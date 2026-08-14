-- Migration 004: store a per-business GBP OAuth refresh token.
-- Run after db/migrations/003_mixpost_and_campaigns.sql.
-- psql "$DATABASE_URL" -f db/migrations/004_gbp_refresh_token.sql

BEGIN;

-- Obtained via a ONE-TIME manual OAuth consent (see gbp-oauth.ts header comment
-- for how). Exchanged for a short-lived access token before each GBP API call
-- — the app never needs the user to re-consent once this is set.
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS gbp_refresh_token text;

COMMIT;
