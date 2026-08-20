-- Worker hardening (security review 2026-08-18, see docs/DECISIONS.md):
-- 1. A transient 'publishing' status lets worker.ts atomically CLAIM due
--    posts (SELECT ... FOR UPDATE SKIP LOCKED, then mark 'publishing', then
--    commit) before the slow external Mixpost call — closing a real
--    double-processing risk if this worker is ever scaled beyond one
--    instance. Postgres requires adding enum values outside a transaction
--    block in older versions; run this migration on its own.
ALTER TYPE post_status ADD VALUE IF NOT EXISTS 'publishing';

-- 2. An index for the weekly auto-post job's "who's due" query
--    (worker.ts's autoPostChannel — WHERE status IN (...) + a NOT EXISTS
--    subquery against posts.created_at). Cheap now, prevents a full table
--    scan becoming the norm once business count grows past a handful.
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses (status);
CREATE INDEX IF NOT EXISTS idx_posts_business_channel_created
  ON posts (business_id, channel, created_at);
