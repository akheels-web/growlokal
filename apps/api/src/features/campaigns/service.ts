// WhatsApp marketing campaigns with prepaid-credit accounting.
//
// Billing model: marketing template messages cost ~₹1 each (Meta). The
// business pre-pays into wa_credit_paise; each send debits it. We refuse to
// send if credits run out — never absorb Meta's cost.
import { loadBusinessContext, generateCampaignMessage } from '../content/generator.js';
import { sendTemplate } from '../../clients/whatsapp.js';
import { pool, query, queryOne } from '../../db.js';
import { log } from '../../logger.js';

// Cost per marketing message in paise (~₹1.09). Keep in sync with Meta's rate
// card; this rose Jan 2026. Utility/auth are cheaper but campaigns are marketing.
const MARKETING_COST_PAISE = 109;

export interface CreateCampaignInput {
  businessId: string;
  name: string;
  goal: string;                 // e.g. "Festive offer announcement — 20% discount on all bookings"
  templateName: string;         // pre-approved WhatsApp template
  recipients: string[];         // phone numbers (91XXXXXXXXXX)
  scheduledFor?: Date;
}

export async function createCampaign(input: CreateCampaignInput) {
  const ctx = await loadBusinessContext(input.businessId);
  if (!ctx) throw new Error('business not found');

  // Generate a preview body (the actual send uses the approved template;
  // this text is for the owner to review + can fill a template variable).
  const bodyPreview = await generateCampaignMessage(ctx, input.goal);

  const row = await queryOne<{ id: string }>(
    `INSERT INTO campaigns (business_id, name, status, template_name, lang, body_preview, audience_filter, scheduled_for)
     VALUES ($1,$2,'draft',$3,$4,$5,$6,$7) RETURNING id`,
    [
      input.businessId, input.name, input.templateName, ctx.primary_lang,
      bodyPreview, JSON.stringify({ count: input.recipients.length }),
      input.scheduledFor ?? null,
    ]
  );

  // Persist the recipient list now — the send step reads it back from here,
  // so callers never have to re-supply the same list twice.
  if (input.recipients.length > 0) {
    const values: string[] = [];
    const params: unknown[] = [];
    input.recipients.forEach((phone, i) => {
      values.push(`($${i * 2 + 1}, $${i * 2 + 2})`);
      params.push(row!.id, phone);
    });
    await query(
      `INSERT INTO campaign_recipients (campaign_id, phone) VALUES ${values.join(',')}`,
      params
    );
  }

  return { id: row!.id, bodyPreview, recipientCount: input.recipients.length };
}

/**
 * Execute a campaign: debit credits atomically, then send to each pending
 * recipient (read from campaign_recipients — the campaign's own template
 * name, language, and generated body are the source of truth, not re-passed
 * arguments). Returns counts. Stops early if credits are exhausted.
 */
export async function sendCampaign(
  campaignId: string
): Promise<{ sent: number; failed: number; stoppedForCredits: boolean }> {
  const camp = await queryOne<{
    business_id: string; template_name: string; lang: string; body_preview: string;
  }>(
    `SELECT business_id, template_name, lang, body_preview FROM campaigns WHERE id = $1`,
    [campaignId]
  );
  if (!camp) throw new Error('campaign not found');

  const pending = await query<{ id: string; phone: string }>(
    `SELECT id, phone FROM campaign_recipients WHERE campaign_id = $1 AND status = 'pending'`,
    [campaignId]
  );

  await query(`UPDATE campaigns SET status = 'sending' WHERE id = $1`, [campaignId]);

  let sent = 0;
  let failed = 0;
  let stoppedForCredits = false;

  for (const recipient of pending.rows) {
    // Atomically reserve credit for one message. Debit only if balance suffices.
    const debit = await debitCredit(camp.business_id, MARKETING_COST_PAISE);
    if (!debit) {
      stoppedForCredits = true;
      log.warn({ campaignId }, 'campaign stopped — out of WhatsApp credits');
      break;
    }

    const res = await sendTemplate(recipient.phone, camp.template_name, camp.lang, [
      { type: 'body', parameters: [{ type: 'text', text: camp.body_preview }] },
    ]);

    if (res.ok) {
      sent++;
      await markRecipient(recipient.id, 'sent', res.messageId);
      await logMessage(camp.business_id, recipient.phone, res.messageId, camp.template_name, MARKETING_COST_PAISE);
    } else {
      failed++;
      await markRecipient(recipient.id, 'failed', undefined, res.error);
      // Refund the reserved credit on failure.
      await query(`UPDATE businesses SET wa_credit_paise = wa_credit_paise + $2 WHERE id = $1`,
        [camp.business_id, MARKETING_COST_PAISE]);
    }
  }

  await query(
    `UPDATE campaigns SET status = $2, sent_count = sent_count + $3, failed_count = failed_count + $4, cost_paise = cost_paise + $5 WHERE id = $1`,
    [campaignId, 'sent', sent, failed, sent * MARKETING_COST_PAISE]
  );

  return { sent, failed, stoppedForCredits };
}

async function markRecipient(
  recipientId: string, status: 'sent' | 'failed', waMessageId?: string, error?: string
) {
  await query(
    `UPDATE campaign_recipients SET status = $2, wa_message_id = $3, error = $4,
       sent_at = CASE WHEN $2 = 'sent' THEN now() ELSE sent_at END
     WHERE id = $1`,
    [recipientId, status, waMessageId ?? null, error ?? null]
  );
}

/**
 * Atomic conditional debit: returns true if the balance was sufficient and
 * debited, false otherwise. The WHERE clause prevents going negative under
 * concurrency.
 */
async function debitCredit(businessId: string, amountPaise: number): Promise<boolean> {
  const res = await pool.query(
    `UPDATE businesses SET wa_credit_paise = wa_credit_paise - $2
     WHERE id = $1 AND wa_credit_paise >= $2`,
    [businessId, amountPaise]
  );
  return (res.rowCount ?? 0) > 0;
}

async function logMessage(
  businessId: string, to: string, metaId: string | undefined,
  templateName: string, costPaise: number
) {
  await query(
    `INSERT INTO wa_messages (business_id, wa_message_id, direction, to_number, template_name, category, cost_paise)
     VALUES ($1,$2,'outbound',$3,$4,'marketing',$5)`,
    [businessId, metaId ?? null, to, templateName, costPaise]
  );
}
