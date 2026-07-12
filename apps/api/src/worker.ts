// Scheduler worker — runs on the home Proxmox box (separate process from the
// public API). Polls for due content and publishes it. Kept dead-simple
// (setInterval) rather than a full queue; move to BullMQ when volume grows.
//
// Run: pnpm --filter @prachaar/api worker
import 'dotenv/config';
import { log } from './logger.js';
import { query } from './db.js';
import { publishDuePost } from './features/social/service.js';
import { pool } from './db.js';

const POLL_MS = 60_000; // every minute

async function tick() {
  try {
    // Find social posts whose scheduled time has arrived and are still scheduled.
    const due = await query<{ id: string; business_id: string }>(
      `SELECT id, business_id FROM posts
       WHERE status = 'scheduled' AND channel IN ('instagram','facebook')
         AND scheduled_for <= now()
       ORDER BY scheduled_for ASC LIMIT 20`
    );

    for (const post of due.rows) {
      // TODO: look up the business's connected Mixpost account IDs.
      // Placeholder: empty array -> Mixpost client dry-runs / no-op.
      const accountIds: number[] = [];
      log.info({ postId: post.id }, 'publishing due post');
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
