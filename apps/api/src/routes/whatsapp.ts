// WhatsApp Cloud API webhook.
//   GET  /webhooks/whatsapp  -> Meta verification handshake
//   POST /webhooks/whatsapp  -> inbound messages + status updates
//
// This is the real inbound handler for the audit bot. A simple per-phone
// conversation state machine: greet -> ask business name -> run audit ->
// handle "DEMO" reply.
import type { FastifyInstance } from 'fastify';
import { config } from '../config.js';
import { log } from '../logger.js';
import { sendText, sendButtons, verifyWebhookSignature } from '../clients/whatsapp.js';
import { runAudit } from '../features/audit/service.js';
import { answerCustomerQuestion, loadBusinessContext } from '../features/content/generator.js';
import { sendStatsSnapshot } from '../features/insights/whatsapp-stats.js';
import { recordWebsiteRequest } from '../features/leads/website-request.js';
import { getEntitlement, hasMinPlan } from '../auth/entitlement.js';
import { query, queryOne } from '../db.js';
import { redis } from '../redis.js';

// Conversation state in Redis — survives restarts and works across multiple
// API instances. TTL means a stale, abandoned chat just resets to the
// greeting rather than getting stuck; no cleanup job needed.
type ConvState = 'awaiting_name' | 'done';
const CONVO_TTL_SECONDS = 24 * 60 * 60; // 24h

function convoKey(phone: string): string {
  return `wa:convo:${phone}`;
}
async function getConvo(phone: string): Promise<ConvState | null> {
  return (await redis.get(convoKey(phone))) as ConvState | null;
}
async function setConvo(phone: string, state: ConvState): Promise<void> {
  await redis.set(convoKey(phone), state, 'EX', CONVO_TTL_SECONDS);
}

export function whatsappRoutes(app: FastifyInstance) {
  // ── Verification handshake (Meta calls this once when you set the webhook)
  app.get('/webhooks/whatsapp', async (req, reply) => {
    const q = req.query as Record<string, string>;
    if (
      q['hub.mode'] === 'subscribe' &&
      q['hub.verify_token'] === config.WHATSAPP_VERIFY_TOKEN
    ) {
      log.info('WhatsApp webhook verified');
      return reply.code(200).send(q['hub.challenge']);
    }
    return reply.code(403).send('forbidden');
  });

  // ── Inbound messages
  app.post('/webhooks/whatsapp', { config: { rawBody: true } }, async (req, reply) => {
    // Verify this really came from Meta before doing anything paid (LLM/Places
    // calls). Reject silently rather than ack — a forged request isn't Meta's
    // to retry.
    const signature = req.headers['x-hub-signature-256'] as string | undefined;
    const raw = (req as any).rawBody as string | undefined;
    if (!verifyWebhookSignature(raw ?? '', signature)) {
      log.warn('WhatsApp webhook signature invalid — rejecting');
      return reply.code(403).send('invalid signature');
    }

    // Ack fast so Meta doesn't retry; process async.
    reply.code(200).send('ok');

    try {
      const body = req.body as any;
      const entry = body?.entry?.[0]?.changes?.[0]?.value;
      const msg = entry?.messages?.[0];
      if (!msg) return; // status update, not a message

      const from: string = msg.from;
      const text: string = msg.text?.body?.trim() ?? '';
      // A button/list tap arrives as msg.type === 'interactive', NOT msg.text —
      // reading only msg.text (as this file used to) silently sees nothing at all.
      const actionId: string | null =
        msg.interactive?.button_reply?.id ?? msg.interactive?.list_reply?.id ?? null;
      // Which of our numbers received this? Business number -> chat agent; platform number -> audit bot / customer menu.
      const recipient: string = entry?.metadata?.display_phone_number ?? '';
      await logInbound(from, actionId ?? text, msg.id);

      const business = recipient
        ? await queryOne<{ id: string }>('SELECT id FROM businesses WHERE whatsapp_number = $1', [recipient])
        : null;

      if (business) {
        await handleChatAgent(business.id, from, text);
        return;
      }

      // Not a business's own customer-facing number — either a new lead going
      // through the free-audit flow, or an existing customer (owner) checking
      // in on our platform number. Tell them apart by users.phone, the OWNER'S
      // login number — NOT businesses.whatsapp_number (a different number by
      // design, see docs/FLOW.md §10).
      const owner = await queryOne<{ business_id: string }>(
        `SELECT business_id FROM users WHERE phone = $1 AND role = 'owner'`,
        [from]
      );
      if (owner) {
        await handleCustomerMenu(owner.business_id, from, actionId ?? text);
      } else {
        await handleMessage(from, text);
      }
    } catch (err) {
      log.error({ err }, 'whatsapp webhook processing failed');
    }
  });
}

async function handleMessage(from: string, text: string): Promise<void> {
  const lower = text.toLowerCase();
  const state = await getConvo(from);

  // "DEMO" at any time -> mark the lead demo-requested + hand off to sales.
  if (lower === 'demo') {
    await markDemoRequested(from);
    await sendText(
      from,
      'Super! 🙌 Our team will call you within a few hours for your free 15-minute session. Meanwhile, is morning or evening better for you?'
    );
    await setConvo(from, 'done');
    return;
  }

  // First contact / greeting -> ask for business name.
  if (!state || lower === 'hi' || lower === 'hello' || lower === 'start' || lower === 'namaste') {
    await setConvo(from, 'awaiting_name');
    await sendText(
      from,
      'Namaste! 🙏 I can give you a FREE report on how your business looks on Google — and what’s losing you customer enquiries.\n\nJust reply with your business *name* (and area, e.g. "Bright Future Salon, Ameerpet").'
    );
    return;
  }

  // They sent their business name -> run the audit.
  if (state === 'awaiting_name') {
    // naive "name, area" split
    const [namePart, cityPart] = text.split(',').map((s) => s.trim());
    await sendText(from, 'Checking your Google presence now… 🔎 (takes a few seconds)');

    const result = await runAudit({
      phone: from,
      businessName: namePart || text,
      city: cityPart || 'Hyderabad',
      lang: 'te', // TODO: detect / ask preferred language
    });
    await sendText(from, result.message);
    await setConvo(from, 'done');
    return;
  }

  // After done -> gentle nudge.
  await sendText(
    from,
    'If you’d like us to fix these issues for you, just reply "DEMO" for a free call. 😊'
  );
}

/**
 * Chat agent for a customer's own WhatsApp number. Answers questions from the
 * business's profile_context and logs an enquiry event (feeds the ROI dashboard).
 * ponytail: replies inside the free 24h service window, so no template cost.
 *
 * The 24/7 responder is a Starter+ feature. A lapsed/trial business's chat
 * agent stops answering — the "Netflix" rule. We do NOT send the end
 * customer an "account suspended" message (that reflects badly on the
 * business, not us); we just stay silent and log it, so the owner notices
 * via missing replies + the dashboard's renewal wall.
 */
async function handleChatAgent(businessId: string, from: string, text: string): Promise<void> {
  const entitlement = await getEntitlement(businessId);
  if (!entitlement || !hasMinPlan(entitlement, 'starter')) {
    log.warn({ businessId }, 'chat agent skipped — business not entitled (plan lapsed or trial)');
    return;
  }

  const ctx = await loadBusinessContext(businessId);
  if (!ctx) return;
  const reply = await answerCustomerQuestion(ctx, text);
  await sendText(from, reply);
  await query(
    "INSERT INTO events (business_id, type, payload) VALUES ($1, 'enquiry_received', $2)",
    [businessId, JSON.stringify({ q: text.slice(0, 200) })]
  );
}

/**
 * Self-service menu for an EXISTING customer (owner) messaging our platform
 * number — separate from handleChatAgent (which answers THEIR customers'
 * questions) and handleMessage (which onboards a brand-new lead). Stateless
 * by design: every message either matches a known button id or falls
 * through to showing the menu again — no Redis conversation state needed
 * for this flow.
 */
async function handleCustomerMenu(businessId: string, from: string, action: string): Promise<void> {
  switch (action) {
    case 'view_stats':
      await sendStatsSnapshot(businessId, from);
      return;
    case 'want_website':
      await recordWebsiteRequest(businessId, from);
      return;
    default:
      await sendButtons(from, 'Hi! 👋 What would you like to do?', [
        { id: 'view_stats', title: '📊 My Stats' },
        { id: 'want_website', title: '🌐 Get a Website' },
      ]);
      return;
  }
}

// ── DB helpers ────────────────────────────────────────────────

async function logInbound(from: string, body: string, metaId: string): Promise<void> {
  await query(
    `INSERT INTO wa_messages (direction, from_number, to_number, body, wa_message_id, category)
     VALUES ('inbound', $1, $2, $3, $4, 'service')`,
    [from, config.WHATSAPP_PHONE_NUMBER_ID, body, metaId]
  );
}

async function markDemoRequested(phone: string): Promise<void> {
  const lead = await queryOne<{ id: string }>(
    'SELECT id FROM leads WHERE phone = $1 ORDER BY created_at DESC LIMIT 1',
    [phone]
  );
  if (lead) {
    await query("UPDATE leads SET stage = 'demo_booked' WHERE id = $1", [lead.id]);
    await query(
      "INSERT INTO events (lead_id, type, payload) VALUES ($1, 'demo_booked', '{}')",
      [lead.id]
    );
  }
}
