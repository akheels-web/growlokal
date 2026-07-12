-- Migration 002: auth (phone OTP) + billing webhook idempotency.
-- Base tables live in db/schema.sql. Run this AFTER schema.sql.
-- psql "$DATABASE_URL" -f db/migrations/002_auth_billing.sql

BEGIN;

-- One-time passwords for phone login. Codes are stored HASHED.
CREATE TABLE IF NOT EXISTS otp_codes (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    phone       text NOT NULL,
    code_hash   text NOT NULL,          -- sha256(code + phone)
    attempts    integer NOT NULL DEFAULT 0,
    expires_at  timestamptz NOT NULL,
    consumed_at timestamptz,
    created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_otp_phone ON otp_codes(phone);

-- Idempotency for payment-provider webhooks (avoid double-processing).
CREATE TABLE IF NOT EXISTS webhook_events (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    provider      text NOT NULL,          -- razorpay | meta
    external_id   text NOT NULL,          -- provider's event id
    processed_at  timestamptz NOT NULL DEFAULT now(),
    UNIQUE (provider, external_id)
);

COMMIT;
