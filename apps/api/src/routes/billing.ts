// Billing: create subscription checkouts (both the existing sign-up-then-pay
// path and the pay-first admin-generated-link path) + handle Razorpay
// webhooks. The webhook route needs the RAW body for signature verification.
//
// Pay-first flow (see docs/DECISIONS.md, Chunk C): a team member generates a
// checkout link for a lead (phone/business name/plan known from a WhatsApp
// conversation — sales-assisted, not public self-serve). NOTHING is written
// to our database at link-generation time; the phone/business name/plan are
// stashed in Razorpay's own `notes` field. Only when the webhook confirms a
// successful payment do we create the business + user + subscription rows,
// all in one transaction, then send "payment confirmed, here's how to log
// in" via WhatsApp + email.
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { requireBusiness, requireAdmin } from '../auth/middleware.js';
import { createSubscription, verifyWebhookSignature } from '../clients/razorpay.js';
import { sendTemplate } from '../clients/whatsapp.js';
import { sendEmail } from '../clients/email.js';
import { config } from '../config.js';
import { query, queryOne, withTransaction } from '../db.js';
import { log } from '../logger.js';

// Pro plan dropped 2026-08-18 (no multi-location support to justify it) — see
// docs/DECISIONS.md. Not in this map, so a stray Pro checkout notes payload
// fails the !PLAN_TO_PRICE[plan] guard below and is rejected cleanly.
const PLAN_TO_PRICE: Record<string, number> = {
  starter: config.PRICE_STARTER_PAISE,
  growth: config.PRICE_GROWTH_PAISE,
};

const phoneRegex = /^[0-9+]+$/;

export function billingRoutes(app: FastifyInstance) {
  // ── Existing flow: an already-logged-in business subscribes from its own dashboard ──
  const subscribeBody = z.object({
    plan: z.enum(['starter', 'growth']), // Pro plan dropped 2026-08-18 — see docs/DECISIONS.md
    razorpayPlanId: z.string(),
  });
  app.post('/api/businesses/:id/billing/subscribe', { preHandler: requireBusiness }, async (req, reply) => {
    const parsed = subscribeBody.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
    const { id } = req.params as { id: string };

    const sub = await createSubscription({
      planId: parsed.data.razorpayPlanId,
      notes: { businessId: id, plan: parsed.data.plan },
    });
    if (!sub) return reply.code(502).send({ error: 'payment provider error' });

    await query(
      `INSERT INTO subscriptions (business_id, plan, amount_paise, razorpay_sub_id, active)
       VALUES ($1, $2, $3, $4, false)`,
      [id, parsed.data.plan, PLAN_TO_PRICE[parsed.data.plan], sub.id]
    );
    return { checkoutUrl: sub.shortUrl, subscriptionId: sub.id };
  });

  // ── Pay-first flow: team-only, generates a link for a lead who doesn't have
  // an account yet. No DB write happens here — see the webhook handler below
  // for where the account actually gets created, once payment succeeds. ──
  const checkoutLinkBody = z.object({
    phone: z.string().min(10).max(15).regex(phoneRegex, 'Invalid phone number format'),
    businessName: z.string().min(2).max(100),
    plan: z.enum(['starter', 'growth']), // Pro plan dropped 2026-08-18 — see docs/DECISIONS.md
    razorpayPlanId: z.string(),
  });
  app.post('/api/admin/checkout-links', { preHandler: requireAdmin }, async (req, reply) => {
    const parsed = checkoutLinkBody.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
    const { phone, businessName, plan, razorpayPlanId } = parsed.data;

    const sub = await createSubscription({
      planId: razorpayPlanId,
      notes: { phone, businessName, plan, source: 'pay_first_checkout' },
    });
    if (!sub) return reply.code(502).send({ error: 'payment provider error' });

    log.info({ phone, businessName, plan, razorpaySubId: sub.id }, 'checkout link generated');
    return { checkoutUrl: sub.shortUrl, razorpaySubscriptionId: sub.id };
  });

  // ── Public self-serve checkout (added 2026-08-18 — see docs/DECISIONS.md):
  // no team member, no manual link generation. The customer supplies their
  // own phone/business name/plan directly, we resolve the right Razorpay
  // plan_id ourselves (RAZORPAY_PLAN_ID_STARTER/GROWTH — created once in the
  // Razorpay dashboard), and reuse the EXACT SAME notes-stashing + webhook
  // provisioning as the admin tool above. Nothing about how a business gets
  // created changes — only who initiates the checkout does. Rate-limited
  // since it's public and unauthenticated (nothing costs money until a real
  // payment succeeds, but it's still a Razorpay API call per request). ──
  const RAZORPAY_PLAN_ID: Record<string, string> = {
    starter: config.RAZORPAY_PLAN_ID_STARTER,
    growth: config.RAZORPAY_PLAN_ID_GROWTH,
  };
  const publicCheckoutBody = z.object({
    phone: z.string().min(10).max(15).regex(phoneRegex, 'Invalid phone number format'),
    businessName: z.string().min(2).max(100),
    plan: z.enum(['starter', 'growth']),
  });
  app.post(
    '/api/checkout',
    { config: { rateLimit: { max: 10, timeWindow: '1 minute' } } },
    async (req, reply) => {
      const parsed = publicCheckoutBody.safeParse(req.body);
      if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
      const { phone, businessName, plan } = parsed.data;

      const razorpayPlanId = RAZORPAY_PLAN_ID[plan];
      if (!razorpayPlanId) {
        log.error({ plan }, 'RAZORPAY_PLAN_ID_STARTER/GROWTH not configured for this plan');
        return reply.code(503).send({ error: 'checkout not configured for this plan yet' });
      }

      const sub = await createSubscription({
        planId: razorpayPlanId,
        notes: { phone, businessName, plan, source: 'public_checkout' },
      });
      if (!sub) return reply.code(502).send({ error: 'payment provider error' });

      log.info({ phone, businessName, plan, razorpaySubId: sub.id }, 'public self-serve checkout created');
      return { checkoutUrl: sub.shortUrl };
    }
  );

  // ── Razorpay webhook — RAW body required for signature check. ──
  app.post('/webhooks/razorpay', {
    config: { rawBody: true },
  }, async (req, reply) => {
    const signature = req.headers['x-razorpay-signature'] as string | undefined;
    const raw = (req as any).rawBody as string | undefined;
    if (!signature || !raw || !verifyWebhookSignature(raw, signature)) {
      return reply.code(400).send({ error: 'invalid signature' });
    }

    const event = req.body as any;
    const eventId = event?.id ?? event?.payload?.subscription?.entity?.id ?? 'unknown';

    // Idempotency: skip if we've seen this event id.
    const seen = await queryOne(
      `INSERT INTO webhook_events (provider, external_id) VALUES ('razorpay', $1)
       ON CONFLICT (provider, external_id) DO NOTHING RETURNING id`,
      [eventId]
    );
    if (!seen) {
      return reply.send({ ok: true, deduped: true });
    }

    await handleRazorpayEvent(event);
    return reply.send({ ok: true });
  });
}

async function handleRazorpayEvent(event: any) {
  const type = event?.event as string;
  const entity = event?.payload?.subscription?.entity;
  const subId = entity?.id;
  if (!subId) return;

  switch (type) {
    case 'subscription.activated':
    case 'subscription.charged': {
      const periodEnd = entity?.current_end ?? Math.floor(Date.now() / 1000);

      // Try the existing sign-up-then-pay path first: a local subscriptions
      // row already exists (created by /billing/subscribe) if so.
      const updated = await queryOne<{ business_id: string }>(
        `UPDATE subscriptions SET active = true, current_period_end = to_timestamp($2)
         WHERE razorpay_sub_id = $1 RETURNING business_id`,
        [subId, periodEnd]
      );

      if (updated) {
        await query(
          `UPDATE businesses b SET status = 'active', plan = s.plan
           FROM subscriptions s WHERE s.razorpay_sub_id = $1 AND s.business_id = b.id`,
          [subId]
        );
        log.info({ subId, type }, 'subscription active (existing business)');

        // Same confirmation the pay-first path sends — a business subscribing
        // from its own dashboard deserves the same "payment confirmed"
        // message, not silence.
        const owner = await queryOne<{ name: string; plan: string; phone: string }>(
          `SELECT b.name, b.plan, u.phone FROM businesses b
           JOIN users u ON u.business_id = b.id AND u.role = 'owner'
           WHERE b.id = $1 LIMIT 1`,
          [updated.business_id]
        );
        if (owner) await sendPaymentConfirmation(owner.phone, owner.name, owner.plan);
        break;
      }

      // No local row -> this is a pay-first checkout. Auto-provision.
      await provisionFromPayFirstCheckout(subId, entity, periodEnd);
      break;
    }
    case 'subscription.halted':
    case 'subscription.cancelled': {
      await query(`UPDATE subscriptions SET active = false WHERE razorpay_sub_id = $1`, [subId]);
      await query(
        `UPDATE businesses b SET status = 'past_due'
         FROM subscriptions s WHERE s.razorpay_sub_id = $1 AND s.business_id = b.id`,
        [subId]
      );
      log.warn({ subId, type }, 'subscription halted/cancelled');
      break;
    }
    default:
      log.debug({ type }, 'unhandled razorpay event');
  }
}

/**
 * Creates (or reuses, if the phone already has an account) the business +
 * user + subscription rows for a pay-first checkout, all in one transaction,
 * then sends the payment-confirmation + login-instructions message.
 */
async function provisionFromPayFirstCheckout(
  subId: string,
  entity: any,
  periodEndUnix: number
): Promise<void> {
  const notes = entity?.notes ?? {};
  const phone: string | undefined = notes.phone;
  const businessName: string | undefined = notes.businessName;
  const plan: string | undefined = notes.plan;

  if (!phone || !businessName || !plan || !PLAN_TO_PRICE[plan]) {
    log.error({ subId, notes }, 'pay-first webhook missing expected notes — cannot provision');
    return;
  }

  const result = await withTransaction(async (client) => {
    const existingUser = await client.query<{ business_id: string }>(
      `SELECT business_id FROM users WHERE phone = $1`,
      [phone]
    );

    let businessId: string;
    let isNewBusiness: boolean;

    if (existingUser.rows[0]?.business_id) {
      // Reused phone — attach this payment to their existing business
      // (confirmed rule: re-used phone numbers attach to the existing
      // business rather than creating a duplicate).
      businessId = existingUser.rows[0].business_id;
      isNewBusiness = false;
      await client.query(
        `UPDATE businesses SET status = 'active', plan = $2 WHERE id = $1`,
        [businessId, plan]
      );
      // Deactivate any previously-active subscription row for this business
      // so there's exactly one active subscription at a time.
      await client.query(
        `UPDATE subscriptions SET active = false WHERE business_id = $1 AND active = true`,
        [businessId]
      );
    } else {
      const biz = await client.query<{ id: string }>(
        `INSERT INTO businesses (name, status, plan) VALUES ($1, 'active', $2) RETURNING id`,
        [businessName, plan]
      );
      businessId = biz.rows[0].id;
      isNewBusiness = true;
      await client.query(
        `INSERT INTO users (business_id, phone, role) VALUES ($1, $2, 'owner')`,
        [businessId, phone]
      );
    }

    await client.query(
      `INSERT INTO subscriptions (business_id, plan, amount_paise, razorpay_sub_id, active, current_period_end)
       VALUES ($1, $2, $3, $4, true, to_timestamp($5))`,
      [businessId, plan, PLAN_TO_PRICE[plan], subId, periodEndUnix]
    );

    return { businessId, isNewBusiness };
  });

  log.info({ subId, ...result, phone, plan }, 'pay-first checkout provisioned');
  await sendPaymentConfirmation(phone, businessName, plan);
}

async function sendPaymentConfirmation(phone: string, businessName: string, plan: string): Promise<void> {
  if (config.WHATSAPP_PAYMENT_CONFIRMATION_TEMPLATE_NAME) {
    await sendTemplate(phone, config.WHATSAPP_PAYMENT_CONFIRMATION_TEMPLATE_NAME, 'en', [
      { type: 'body', parameters: [{ type: 'text', text: businessName }, { type: 'text', text: plan }] },
    ]);
  } else {
    log.warn({ phone }, 'WHATSAPP_PAYMENT_CONFIRMATION_TEMPLATE_NAME not set — skipping WhatsApp confirmation (email still sent if available)');
  }

  // No email address exists yet for a brand-new pay-first signup (only a
  // phone was collected) — this only actually sends for a reused phone
  // whose owner has an email on file. Real for both cases the moment the
  // owner adds their email via onboarding.
  const owner = await queryOne<{ email: string | null }>(
    `SELECT email FROM users WHERE phone = $1`,
    [phone]
  );
  if (owner?.email) {
    await sendEmail(
      owner.email,
      `Payment received — your ${plan} plan is active`,
      `Hi,\n\nYour payment for ${businessName} was successful and your ${plan} plan is now active.\n\nLog in any time at ${config.DASHBOARD_LOGIN_URL} using this WhatsApp number (${phone}) — we'll text you a one-time code, no password needed.\n\n— GrowLokal`
    );
  }
}
