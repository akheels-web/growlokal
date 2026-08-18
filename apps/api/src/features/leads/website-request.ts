// "Get a Website" WhatsApp button -> priority alert to the team. See
// docs/DECISIONS.md (2026-08-18) for why this is a flag on `businesses`
// rather than a leads.stage value, and why the alert goes out over BOTH
// WhatsApp (template, needs Meta approval) and email (works today, no
// approval needed) rather than waiting on the WhatsApp side alone.
import { query, queryOne } from '../../db.js';
import { config } from '../../config.js';
import { sendTemplate, sendText } from '../../clients/whatsapp.js';
import { sendEmail } from '../../clients/email.js';
import { log } from '../../logger.js';

export async function recordWebsiteRequest(businessId: string, from: string): Promise<void> {
  const biz = await queryOne<{ name: string; city: string }>(
    `UPDATE businesses SET website_requested_at = now() WHERE id = $1 RETURNING name, city`,
    [businessId]
  );
  if (!biz) return;

  await query(
    `INSERT INTO events (business_id, type, payload) VALUES ($1, 'website_requested', '{}'::jsonb)`,
    [businessId]
  );

  await sendText(from, "Got it! 🎉 Our team will reach out shortly to get your free website started.");
  await alertTeam(biz.name, biz.city, from);
}

async function alertTeam(businessName: string, city: string, customerPhone: string): Promise<void> {
  if (!config.OPS_ALERT_PHONE && !config.OPS_ALERT_EMAIL) {
    log.warn({ businessName }, 'website request recorded but OPS_ALERT_PHONE/OPS_ALERT_EMAIL both unset — nobody will be notified');
    return;
  }

  if (config.OPS_ALERT_PHONE) {
    if (config.WHATSAPP_WEBSITE_REQUEST_TEMPLATE_NAME) {
      await sendTemplate(config.OPS_ALERT_PHONE, config.WHATSAPP_WEBSITE_REQUEST_TEMPLATE_NAME, 'en', [
        { type: 'body', parameters: [{ type: 'text', text: businessName }, { type: 'text', text: customerPhone }] },
      ]);
    } else {
      log.warn('WHATSAPP_WEBSITE_REQUEST_TEMPLATE_NAME not set — skipping WhatsApp alert (email still sent if configured)');
    }
  }

  if (config.OPS_ALERT_EMAIL) {
    await sendEmail(
      config.OPS_ALERT_EMAIL,
      `🌐 Website request: ${businessName}`,
      `${businessName} (${city}) just tapped "Get a Website" on WhatsApp.\n\nCustomer phone: ${customerPhone}\n\nFollow up soon — this came in as a priority request.`
    );
  }
}
