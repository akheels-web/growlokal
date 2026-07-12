// Billing: create a subscription checkout + handle Razorpay webhooks.
// The webhook route needs the RAW body for signature verification, so we
// register a content-type parser that preserves it.
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { requireBusiness } from '../auth/middleware.js';
import { createSubscription, verifyWebhookSignature } from '../clients/razorpay.js';
import { config } from '../config.js';
import { query, queryOne } from '../db.js';
import { log } from '../logger.js';

const PLAN_TO_PRICE: Record<string, number> = {
  starter: config.PRICE_STARTER_PAISE,
  growth: config.PRICE_GROWTH_PAISE,
  pro: config.PRICE_PRO_PAISE,
};

export function billingRoutes(app: FastifyInstance) {
  // Create a subscription checkout link.
  const body = z.object({
    plan: z.enum(['starter', 'growth', 'pro']),
    razorpayPlanId: z.string(), // the plan_id you created in Razorpay dashboard
  });
  app.post('/api/businesses/:id/billing/subscribe', { preHandler: requireBusiness }, async (req, reply) => {
    const parsed = body.safeParse(req.body);
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

  // Razorpay webhook — RAW body required for signature check.
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
  const subId = event?.payload?.subscription?.entity?.id;
  if (!subId) return;

  switch (type) {
    case 'subscription.activated':
    case 'subscription.charged': {
      const periodEnd = event?.payload?.subscription?.entity?.current_end;
      await query(
        `UPDATE subscriptions SET active = true,
           current_period_end = to_timestamp($2)
         WHERE razorpay_sub_id = $1`,
        [subId, periodEnd ?? Math.floor(Date.now() / 1000)]
      );
      // Activate the business + set its plan from the subscription row.
      await query(
        `UPDATE businesses b SET status = 'active', plan = s.plan
         FROM subscriptions s WHERE s.razorpay_sub_id = $1 AND s.business_id = b.id`,
        [subId]
      );
      log.info({ subId, type }, 'subscription active');
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
