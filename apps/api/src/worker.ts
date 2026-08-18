// Scheduler worker — runs on the home Proxmox box (separate process from the
// public API). Polls for due content and publishes it. Kept dead-simple
// (setInterval) rather than a full queue; move to BullMQ when volume grows.
//
// Run: pnpm --filter @growlokal/api worker
import 'dotenv/config';
import { log } from './logger.js';
import { query } from './db.js';
import { publishDuePost, createScheduledSocialPost } from './features/social/service.js';
import { createGbpPost } from './features/gbp/service.js';
import { getEntitlement, hasMinPlan } from './auth/entitlement.js';
import { sendTemplate } from './clients/whatsapp.js';
import { sendEmail } from './clients/email.js';
import { config } from './config.js';
import { pool } from './db.js';

const POLL_MS = 60_000;              // social-post scheduler: every minute
const REMINDER_CHECK_MS = 6 * 60 * 60_000; // renewal reminders: every 6 hours (idempotent — reminder_sent_at prevents re-sends)
const AUTO_POST_CHECK_MS = 6 * 60 * 60_000; // weekly auto-post check: every 6 hours (idempotent — "no post in 7 days" is the check itself)

async function tick() {
  try {
    // Find social posts whose scheduled time has arrived and are still scheduled,
    // joined to the business's connected Mixpost account IDs (set by an admin
    // after linking the business's Instagram/FB inside Mixpost's own dashboard).
    const due = await query<{ id: string; business_id: string; mixpost_account_ids: number[] }>(
      `SELECT p.id, p.business_id, b.mixpost_account_ids
       FROM posts p
       JOIN businesses b ON b.id = p.business_id
       WHERE p.status = 'scheduled' AND p.channel IN ('instagram','facebook')
         AND p.scheduled_for <= now()
       ORDER BY p.scheduled_for ASC LIMIT 20`
    );

    for (const post of due.rows) {
      const accountIds = post.mixpost_account_ids ?? [];
      if (accountIds.length === 0) {
        log.warn({ postId: post.id, businessId: post.business_id },
          'no Mixpost accounts connected for this business — skipping publish (post stays scheduled)');
        continue;
      }
      log.info({ postId: post.id, accountIds }, 'publishing due post');
      await publishDuePost(post.id, accountIds);
    }
  } catch (err) {
    log.error({ err }, 'worker tick failed');
  }
}

/**
 * Renewal reminders: subscriptions expiring within 7 days that haven't been
 * reminded yet get a WhatsApp message (if a template is approved — see
 * config.WHATSAPP_RENEWAL_TEMPLATE_NAME) and an email (if the owner has one
 * on file). Notifies the business's owner (users.role='owner'), not the
 * business's own customer-facing WhatsApp number.
 */
async function checkRenewalReminders() {
  try {
    const due = await query<{
      subscription_id: string; business_id: string; business_name: string;
      current_period_end: string; owner_phone: string; owner_email: string | null;
    }>(
      `SELECT s.id AS subscription_id, s.business_id, b.name AS business_name,
              s.current_period_end, u.phone AS owner_phone, u.email AS owner_email
       FROM subscriptions s
       JOIN businesses b ON b.id = s.business_id
       JOIN users u ON u.business_id = b.id AND u.role = 'owner'
       WHERE s.active = true
         AND s.current_period_end BETWEEN now() AND now() + interval '7 days'
         AND s.reminder_sent_at IS NULL
       LIMIT 50`
    );

    for (const row of due.rows) {
      const daysLeft = Math.ceil(
        (new Date(row.current_period_end).getTime() - Date.now()) / 86_400_000
      );

      if (config.WHATSAPP_RENEWAL_TEMPLATE_NAME) {
        await sendTemplate(row.owner_phone, config.WHATSAPP_RENEWAL_TEMPLATE_NAME, 'en', [
          { type: 'body', parameters: [{ type: 'text', text: row.business_name }, { type: 'text', text: String(daysLeft) }] },
        ]);
      } else {
        log.warn({ businessId: row.business_id }, 'WHATSAPP_RENEWAL_TEMPLATE_NAME not set — skipping WhatsApp reminder (email still sent if available)');
      }

      if (row.owner_email) {
        await sendEmail(
          row.owner_email,
          `Your GrowLokal plan renews in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`,
          `Hi,\n\nYour GrowLokal subscription for ${row.business_name} renews on ${new Date(row.current_period_end).toLocaleDateString('en-IN')}. Make sure your payment method is up to date to avoid any interruption.\n\n— GrowLokal`
        );
      }

      await query(`UPDATE subscriptions SET reminder_sent_at = now() WHERE id = $1`, [row.subscription_id]);
      log.info({ businessId: row.business_id, daysLeft }, 'renewal reminder sent');
    }
  } catch (err) {
    log.error({ err }, 'renewal reminder check failed');
  }
}

/**
 * Weekly auto-posting: no human has to click "generate" for GBP/social
 * content to keep happening. For each channel, find businesses with no post
 * in that channel in the last 7 days, then — critically — re-check real
 * entitlement (getEntitlement) for every single one before generating
 * anything. This is the ONLY place besides the manual dashboard routes that
 * can trigger LLM/image spend, so a lapsed business must never slip through:
 * a business that fell behind on payment simply won't appear as entitled on
 * the next run, and nothing gets generated or spent on their behalf. No
 * separate "stop" step needed — same live-check pattern as auth/entitlement.ts.
 */
async function checkWeeklyAutoPosts() {
  try {
    await autoPostChannel('gbp', 'starter', async (businessId) => {
      await createGbpPost(businessId);
    });
    await autoPostChannel('instagram', 'growth', async (businessId) => {
      await createScheduledSocialPost({ businessId, channel: 'instagram' });
    });
    await autoPostChannel('facebook', 'growth', async (businessId) => {
      await createScheduledSocialPost({ businessId, channel: 'facebook' });
    });
  } catch (err) {
    log.error({ err }, 'weekly auto-post check failed');
  }
}

async function autoPostChannel(
  channel: 'gbp' | 'instagram' | 'facebook',
  minPlan: 'starter' | 'growth',
  generate: (businessId: string) => Promise<void>
) {
  // SQL prefilter narrows candidates (cheap); getEntitlement() below is the
  // one actual authority on whether this business may have anything
  // generated for it — never trust status='active' alone for a billing gate.
  const candidates = await query<{ id: string }>(
    `SELECT b.id FROM businesses b
     WHERE b.status IN ('active', 'pilot')
       AND NOT EXISTS (
         SELECT 1 FROM posts p
         WHERE p.business_id = b.id AND p.channel = $1 AND p.created_at > now() - interval '7 days'
       )
     LIMIT 200`,
    [channel]
  );

  for (const row of candidates.rows) {
    const info = await getEntitlement(row.id);
    if (!info || !hasMinPlan(info, minPlan)) continue; // not entitled (or lapsed) — skip, no spend
    try {
      await generate(row.id);
      log.info({ businessId: row.id, channel }, 'weekly auto-post generated');
    } catch (err) {
      log.error({ businessId: row.id, channel, err }, 'weekly auto-post failed');
    }
  }
}

log.info(`worker started (posts every ${POLL_MS / 1000}s, renewal reminders every ${REMINDER_CHECK_MS / 3_600_000}h, auto-post check every ${AUTO_POST_CHECK_MS / 3_600_000}h)`);
const postTimer = setInterval(tick, POLL_MS);
const reminderTimer = setInterval(checkRenewalReminders, REMINDER_CHECK_MS);
const autoPostTimer = setInterval(checkWeeklyAutoPosts, AUTO_POST_CHECK_MS);
void tick();
void checkRenewalReminders();
void checkWeeklyAutoPosts();

for (const sig of ['SIGINT', 'SIGTERM'] as const) {
  process.on(sig, async () => {
    clearInterval(postTimer);
    clearInterval(reminderTimer);
    clearInterval(autoPostTimer);
    await pool.end();
    process.exit(0);
  });
}
