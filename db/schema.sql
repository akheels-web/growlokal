-- ─────────────────────────────────────────────────────────────
-- Prachaar — Postgres schema (source of truth)
-- Postgres 16. Run: psql "$DATABASE_URL" -f db/schema.sql
--
-- Design notes:
--  * Multi-tenant by `business_id`. One row in `businesses` = one paying
--    (or trial/pilot) customer (a coaching center).
--  * `leads` captured by the free audit bot may exist BEFORE a business
--    signs up — hence audit_reports links to a phone/place, not a business.
--  * Money stored in paise (integer) to avoid float errors.
--  * All timestamps are timestamptz, app sets timezone Asia/Kolkata.
-- ─────────────────────────────────────────────────────────────

BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- for gen_random_uuid()

-- ── Enums ─────────────────────────────────────────────────────
CREATE TYPE plan_tier      AS ENUM ('trial', 'starter', 'growth', 'pro');
CREATE TYPE business_status AS ENUM ('pilot', 'active', 'past_due', 'churned');
CREATE TYPE vertical        AS ENUM ('coaching', 'clinic', 'realestate', 'salon', 'restaurant', 'other');
CREATE TYPE lang            AS ENUM ('te', 'ta', 'kn', 'ml', 'hi', 'en');
CREATE TYPE lead_stage      AS ENUM ('new', 'contacted', 'demo_booked', 'won', 'lost');
CREATE TYPE post_channel    AS ENUM ('gbp', 'instagram', 'facebook');
CREATE TYPE post_status     AS ENUM ('draft', 'scheduled', 'published', 'failed');
CREATE TYPE campaign_status AS ENUM ('draft', 'scheduled', 'sending', 'sent', 'failed');
CREATE TYPE msg_direction   AS ENUM ('inbound', 'outbound');

-- ── Businesses (tenants) ──────────────────────────────────────
CREATE TABLE businesses (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name            text NOT NULL,
    vertical        vertical NOT NULL DEFAULT 'coaching',
    city            text NOT NULL DEFAULT 'Hyderabad',
    primary_lang    lang NOT NULL DEFAULT 'te',
    status          business_status NOT NULL DEFAULT 'pilot',
    plan            plan_tier NOT NULL DEFAULT 'trial',

    -- WhatsApp: the business's own number they market from
    whatsapp_number text,
    -- Google Business Profile linkage
    gbp_place_id    text,          -- Google Places ID
    gbp_location_id text,          -- GBP API location resource name
    website_url     text,

    -- Freeform business context fed to the LLM (courses, fees, faculty, USPs)
    profile_context jsonb NOT NULL DEFAULT '{}'::jsonb,

    -- WhatsApp message credits (prepaid, in paise) — marketing msgs billed against this
    wa_credit_paise integer NOT NULL DEFAULT 0,

    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_businesses_status ON businesses(status);
CREATE INDEX idx_businesses_city   ON businesses(city);

-- ── Users (dashboard logins; a business can have multiple) ────
CREATE TABLE users (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id   uuid REFERENCES businesses(id) ON DELETE CASCADE,
    phone         text UNIQUE NOT NULL,       -- login via phone OTP
    email         text,
    name          text,
    role          text NOT NULL DEFAULT 'owner',   -- owner | staff | admin(our team)
    created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_users_business ON users(business_id);

-- ── Leads (captured by the free audit bot, BEFORE signup) ─────
-- This is the top of the funnel. A lead may later convert to a business.
CREATE TABLE leads (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    phone           text NOT NULL,
    business_name   text,
    vertical        vertical DEFAULT 'coaching',
    city            text,
    place_id        text,                     -- if we matched them on Google
    stage           lead_stage NOT NULL DEFAULT 'new',
    source          text NOT NULL DEFAULT 'audit_bot',  -- audit_bot | referral | field | web
    audit_score     integer,                  -- 0-100 from the most recent audit
    owner_user_id   uuid REFERENCES users(id),-- our sales rep who owns this lead
    notes           text,
    converted_business_id uuid REFERENCES businesses(id),
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_leads_phone  ON leads(phone);
CREATE INDEX idx_leads_stage  ON leads(stage);
CREATE INDEX idx_leads_owner  ON leads(owner_user_id);

-- ── Audit reports (each run of the free Google-visibility audit) ──
CREATE TABLE audit_reports (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id       uuid REFERENCES leads(id) ON DELETE SET NULL,
    phone         text,
    place_id      text,
    business_name text,
    -- Raw signals pulled from Google Places
    raw_signals   jsonb NOT NULL DEFAULT '{}'::jsonb,
    -- Computed sub-scores + total (see audit/scoring.ts)
    score_total   integer NOT NULL,           -- 0-100
    score_breakdown jsonb NOT NULL DEFAULT '{}'::jsonb,
    gaps          jsonb NOT NULL DEFAULT '[]'::jsonb,   -- ["no_website","few_reviews",...]
    summary_text  text,                        -- the LLM-written vernacular summary sent to user
    lang          lang NOT NULL DEFAULT 'te',
    created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_audit_lead  ON audit_reports(lead_id);
CREATE INDEX idx_audit_phone ON audit_reports(phone);

-- ── WhatsApp messages (inbound + outbound log) ────────────────
CREATE TABLE wa_messages (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id   uuid REFERENCES businesses(id) ON DELETE CASCADE,  -- null for pre-signup bot chats
    lead_id       uuid REFERENCES leads(id) ON DELETE SET NULL,
    wa_message_id text,                        -- Meta's message id (for dedupe/status)
    direction     msg_direction NOT NULL,
    from_number   text,
    to_number     text,
    body          text,
    template_name text,                        -- if a template was used
    category      text,                        -- marketing | utility | authentication | service
    cost_paise    integer NOT NULL DEFAULT 0,  -- what Meta charged (0 for free service msgs)
    raw           jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_wa_msg_business ON wa_messages(business_id);
CREATE INDEX idx_wa_msg_metaid   ON wa_messages(wa_message_id);
CREATE INDEX idx_wa_msg_created  ON wa_messages(created_at);

-- ── Content posts (GBP / Instagram / Facebook) ────────────────
CREATE TABLE posts (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id   uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    channel       post_channel NOT NULL,
    status        post_status NOT NULL DEFAULT 'draft',
    lang          lang NOT NULL DEFAULT 'te',
    caption       text,
    hashtags      text[],
    media_urls    text[],
    scheduled_for timestamptz,
    published_at  timestamptz,
    external_id   text,                        -- id returned by GBP/Mixpost/Meta
    error         text,
    generated_by  text,                        -- model used, for cost tracking
    created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_posts_business  ON posts(business_id);
CREATE INDEX idx_posts_schedule  ON posts(status, scheduled_for);

-- ── WhatsApp marketing campaigns ──────────────────────────────
CREATE TABLE campaigns (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id   uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    name          text NOT NULL,
    status        campaign_status NOT NULL DEFAULT 'draft',
    template_name text,
    lang          lang NOT NULL DEFAULT 'te',
    body_preview  text,
    audience_filter jsonb NOT NULL DEFAULT '{}'::jsonb,  -- how the recipient list was built
    scheduled_for timestamptz,
    sent_count    integer NOT NULL DEFAULT 0,
    failed_count  integer NOT NULL DEFAULT 0,
    cost_paise    integer NOT NULL DEFAULT 0,
    created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_campaigns_business ON campaigns(business_id);

-- ── Reviews (Google reviews we monitor + AI-draft replies) ────
CREATE TABLE reviews (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id   uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    external_id   text,                        -- Google review id
    author        text,
    rating        integer,                     -- 1-5
    text          text,
    reply_draft   text,                        -- AI-generated, awaiting owner approval
    reply_posted  boolean NOT NULL DEFAULT false,
    review_time   timestamptz,
    created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_reviews_business ON reviews(business_id);

-- ── Subscriptions / billing (Razorpay) ────────────────────────
CREATE TABLE subscriptions (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id         uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    plan                plan_tier NOT NULL,
    amount_paise        integer NOT NULL,
    razorpay_sub_id     text,
    razorpay_customer_id text,
    current_period_end  timestamptz,
    active              boolean NOT NULL DEFAULT true,
    created_at          timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_subs_business ON subscriptions(business_id);

-- ── Event log (lightweight analytics + ROI dashboard source) ──
-- e.g. lead_captured, enquiry_received, demo_booked, post_published
CREATE TABLE events (
    id            bigserial PRIMARY KEY,
    business_id   uuid REFERENCES businesses(id) ON DELETE CASCADE,
    lead_id       uuid REFERENCES leads(id) ON DELETE SET NULL,
    type          text NOT NULL,
    payload       jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_events_business_type ON events(business_id, type);
CREATE INDEX idx_events_created       ON events(created_at);

-- ── updated_at trigger helper ─────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_businesses_updated BEFORE UPDATE ON businesses
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_leads_updated BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMIT;

-- ─────────────────────────────────────────────────────────────
-- ROI dashboard helper view: monthly enquiries per business.
-- "You got X admission enquiries this month" — the headline metric.
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v_monthly_enquiries AS
SELECT
    business_id,
    date_trunc('month', created_at) AS month,
    count(*) FILTER (WHERE type = 'enquiry_received') AS enquiries,
    count(*) FILTER (WHERE type = 'demo_booked')      AS demos_booked,
    count(*) FILTER (WHERE type = 'lead_captured')    AS leads_captured
FROM events
GROUP BY business_id, date_trunc('month', created_at);
