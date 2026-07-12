-- Demo seed data for local dev. Run after schema.sql.
-- psql "$DATABASE_URL" -f db/seed.sql

BEGIN;

-- A demo coaching center (pilot customer in Ameerpet, Hyderabad)
INSERT INTO businesses (id, name, vertical, city, primary_lang, status, plan,
                        whatsapp_number, website_url, profile_context, wa_credit_paise)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Sri Chaitanya Junior Coaching (Demo)',
    'coaching', 'Hyderabad', 'te', 'pilot', 'trial',
    '919000000001', 'https://example.in/demo',
    '{
      "courses": ["EAMCET", "NEET", "JEE Mains", "Foundation (8-10)"],
      "fees": {"EAMCET": "45000/year", "NEET": "60000/year"},
      "faculty_highlights": "IIT/NIT alumni, 12+ yrs experience",
      "usps": ["Weekly mock tests", "Doubt-clearing sessions", "Telugu + English medium"],
      "batch_timings": "Morning 7-10am, Evening 5-8pm",
      "locality": "Ameerpet"
    }'::jsonb,
    50000   -- ₹500 in prepaid WA credits
);

INSERT INTO users (business_id, phone, name, role)
VALUES ('11111111-1111-1111-1111-111111111111', '919000000001', 'Demo Owner', 'owner');

-- A raw lead captured by the audit bot (not yet a customer)
INSERT INTO leads (phone, business_name, vertical, city, stage, source, audit_score)
VALUES ('919888888888', 'Bright Future Tuition', 'coaching', 'Hyderabad', 'new', 'audit_bot', 42);

-- Some events for the ROI dashboard demo
INSERT INTO events (business_id, type, payload) VALUES
('11111111-1111-1111-1111-111111111111', 'lead_captured', '{}'),
('11111111-1111-1111-1111-111111111111', 'enquiry_received', '{"course":"NEET"}'),
('11111111-1111-1111-1111-111111111111', 'enquiry_received', '{"course":"EAMCET"}'),
('11111111-1111-1111-1111-111111111111', 'demo_booked', '{"course":"NEET"}');

COMMIT;
