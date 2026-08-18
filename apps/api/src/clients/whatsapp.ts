// Meta WhatsApp Cloud API client.
// Docs: https://developers.facebook.com/docs/whatsapp/cloud-api
// See ../../../../Technical-Setup-Guide.md §4 for account setup.
import { request } from 'undici';
import crypto from 'node:crypto';
import { config } from '../config.js';
import { log } from '../logger.js';

const BASE = () =>
  `https://graph.facebook.com/${config.WHATSAPP_API_VERSION}/${config.WHATSAPP_PHONE_NUMBER_ID}`;

interface SendResult {
  ok: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send a free-form text message. ONLY works inside the 24-hour customer
 * service window (i.e. within 24h of the user's last inbound message).
 * Outside the window you MUST use sendTemplate() instead.
 */
export async function sendText(to: string, body: string): Promise<SendResult> {
  return post({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'text',
    text: { preview_url: false, body },
  });
}

/**
 * Send a pre-approved template message (works outside the 24h window).
 * `components` fills template variables. Marketing templates are billed (~₹1).
 */
export async function sendTemplate(
  to: string,
  templateName: string,
  languageCode: string,
  components: unknown[] = []
): Promise<SendResult> {
  return post({
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: templateName,
      language: { code: languageCode },
      components,
    },
  });
}

export interface Button {
  id: string;
  title: string; // max 20 chars per Meta's platform limit
}

/**
 * Reply buttons (max 3 — a Meta platform limit; verify against current docs
 * before raising this). Use for a short menu/binary choice. For more than 3
 * options, use sendList() instead.
 */
export async function sendButtons(to: string, bodyText: string, buttons: Button[]): Promise<SendResult> {
  return post({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'interactive',
    interactive: {
      type: 'button',
      body: { text: bodyText },
      action: {
        buttons: buttons.map((b) => ({ type: 'reply', reply: { id: b.id, title: b.title } })),
      },
    },
  });
}

export interface ListRow {
  id: string;
  title: string;
  description?: string;
}

/** List menu (up to 10 rows total — a Meta platform limit; verify before raising). */
export async function sendList(
  to: string,
  bodyText: string,
  buttonText: string,
  rows: ListRow[]
): Promise<SendResult> {
  return post({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'interactive',
    interactive: {
      type: 'list',
      body: { text: bodyText },
      action: { button: buttonText, sections: [{ rows }] },
    },
  });
}

/** Send an image by public URL (not a media ID) — simplest path for something we already host on R2. */
export async function sendImage(to: string, imageUrl: string, caption?: string): Promise<SendResult> {
  return post({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'image',
    image: { link: imageUrl, caption },
  });
}

/**
 * Verify Meta's X-Hub-Signature-256 header on an inbound webhook, computed
 * over the RAW request body using the Meta App Secret. Without this, anyone
 * who finds the webhook URL can POST fake messages and trigger paid LLM/Places
 * calls. If WHATSAPP_APP_SECRET is unset (dev), verification is skipped.
 */
export function verifyWebhookSignature(rawBody: string, signatureHeader: string | undefined): boolean {
  if (!config.WHATSAPP_APP_SECRET) {
    log.warn('WHATSAPP_APP_SECRET not set — skipping webhook signature check (dev only)');
    return true;
  }
  if (!signatureHeader) return false;
  const expected =
    'sha256=' + crypto.createHmac('sha256', config.WHATSAPP_APP_SECRET).update(rawBody).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signatureHeader));
  } catch {
    return false; // length mismatch etc. -> not equal
  }
}

async function post(payload: unknown): Promise<SendResult> {
  if (!config.WHATSAPP_ACCESS_TOKEN) {
    log.warn('WHATSAPP_ACCESS_TOKEN not set — logging message instead of sending');
    log.info({ payload }, 'WA (dry-run)');
    return { ok: true, messageId: 'dry-run' };
  }
  try {
    const res = await request(`${BASE()}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const json = (await res.body.json()) as any;
    if (res.statusCode >= 400) {
      log.error({ status: res.statusCode, json }, 'WA send failed');
      return { ok: false, error: json?.error?.message ?? 'unknown' };
    }
    return { ok: true, messageId: json?.messages?.[0]?.id };
  } catch (err) {
    log.error({ err }, 'WA send exception');
    return { ok: false, error: String(err) };
  }
}
