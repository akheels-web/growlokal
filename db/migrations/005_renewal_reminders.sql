-- Migration 005: track whether a renewal reminder has been sent for a
-- subscription, so the daily reminder job doesn't re-send every day for the
-- whole 7-day window. Run after db/migrations/004_gbp_refresh_token.sql.
-- psql "$DATABASE_URL" -f db/migrations/005_renewal_reminders.sql

BEGIN;

ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS reminder_sent_at timestamptz;

COMMIT;
