-- Migration 003: per-business Mixpost account IDs + persisted campaign recipients.
-- Run after db/migrations/002_auth_billing.sql.
-- psql "$DATABASE_URL" -f db/migrations/003_mixpost_and_campaigns.sql

BEGIN;

-- Which self-hosted Mixpost social accounts (Instagram/FB) a business's
-- posts should publish to. Set by an admin after connecting the business's
-- account inside Mixpost's own dashboard (that's where the OAuth happens;
-- we just store the resulting account IDs here).
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS mixpost_account_ids integer[] NOT NULL DEFAULT '{}';

-- Recipients for a WhatsApp campaign, persisted at creation time instead of
-- being re-passed on every send call. Lets /campaigns/:id/send read the list
-- it was created with, and tracks per-recipient delivery status.
CREATE TYPE campaign_recipient_status AS ENUM ('pending', 'sent', 'failed');

CREATE TABLE IF NOT EXISTS campaign_recipients (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id   uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    phone         text NOT NULL,
    status        campaign_recipient_status NOT NULL DEFAULT 'pending',
    wa_message_id text,
    error         text,
    sent_at       timestamptz,
    created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_campaign ON campaign_recipients(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_status   ON campaign_recipients(campaign_id, status);

COMMIT;
