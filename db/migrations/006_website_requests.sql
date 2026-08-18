-- "Get a Website" via WhatsApp (see docs/DECISIONS.md 2026-08-18). A flag +
-- timestamp on businesses, NOT a leads.stage value — wanting a website isn't
-- a sales-pipeline stage, it's a tag that can co-exist with any stage, and
-- (more importantly) an existing paying customer triggering this may have no
-- leads row at all (pay-first checkout businesses never get one).
ALTER TABLE businesses ADD COLUMN website_requested_at timestamptz;
