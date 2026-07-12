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
import { sendText } from '../clients/whatsapp.js';
import { runAudit } from '../features/audit/service.js';
import { answerCustomerQuestion, loadBusinessContext } from '../features/content/generator.js';
import { query, queryOne } from '../db.js';

// Minimal in-memory conversation state. For production, move to Redis so it
// survives restarts and works across multiple API instances.
type ConvState = 'awaiting_name' | 'done';
const convo = new Map<string, ConvState>();

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
  app.post('/webhooks/whatsapp', async (req, reply) => {
    // Always 200 fast so Meta doesn't retry; process async.
    reply.code(200).send('ok');

    try {
      const body = req.body as any;
      const entry = body?.entry?.[0]?.changes?.[0]?.value;
      const msg = entry?.messages?.[0];
      if (!msg) return; // status update, not a message

      const from: string = msg.from;
      const text: string = msg.text?.body?.trim() ?? '';
      // Which of our numbers received this? Business number -> chat agent; platform number -> audit bot.
      const recipient: string = entry?.metadata?.display_phone_number ?? '';
      await logInbound(from, text, msg.id);

      const business = recipient
        ? await queryOne<{ id: string }>('SELECT id FROM businesses WHERE whatsapp_number = $1', [recipient])
        : null;

      if (business) {
        await handleChatAgent(business.id, from, text);
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
  const state = convo.get(from);

  // "DEMO" at any time -> mark the lead demo-requested + hand off to sales.
  if (lower === 'demo') {
    await markDemoRequested(from);
    await sendText(
      from,
      'Super! 🙌 Our team will call you within a few hours for your free 15-minute session. Meanwhile, is morning or evening better for you?'
    );
    convo.set(from, 'done');
    return;
  }

  // First contact / greeting -> ask for business name.
  if (!state || lower === 'hi' || lower === 'hello' || lower === 'start' || lower === 'namaste') {
    convo.set(from, 'awaiting_name');
    await sendText(
      from,
      'Namaste! 🙏 I can give you a FREE report on how your coaching center looks on Google — and what’s losing you admission enquiries.\n\nJust reply with your coaching center’s *name* (and area, e.g. "Bright Future, Ameerpet").'
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
    convo.set(from, 'done');
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
 */
async function handleChatAgent(businessId: string, from: string, text: string): Promise<void> {
  const ctx = await loadBusinessContext(businessId);
  if (!ctx) return;
  const reply = await answerCustomerQuestion(ctx, text);
  await sendText(from, reply);
  await query(
    "INSERT INTO events (business_id, type, payload) VALUES ($1, 'enquiry_received', $2)",
    [businessId, JSON.stringify({ q: text.slice(0, 200) })]
  );
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
