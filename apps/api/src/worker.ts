// Scheduler worker — runs on the home Proxmox box (separate process from the
// public API). Polls for due content and publishes it. Kept dead-simple
// (setInterval) rather than a full queue; move to BullMQ when volume grows.
//
// Run: pnpm --filter @growlokal/api worker
import 'dotenv/config';
import { log } from './logger.js';
import { query } from './db.js';
import { publishDuePost } from './features/social/service.js';
import { pool } from './db.js';

const POLL_MS = 60_000; // every minute

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

log.info(`worker started (poll every ${POLL_MS / 1000}s)`);
const timer = setInterval(tick, POLL_MS);
void tick(); // run once at boot

for (const sig of ['SIGINT', 'SIGTERM'] as const) {
  process.on(sig, async () => {
    clearInterval(timer);
    await pool.end();
    process.exit(0);
  });
}
