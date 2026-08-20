# Build Roadmap

Maps the GTM playbook (Part 7 + Part 10) to concrete engineering milestones.
Ship the audit bot FIRST — it's the acquisition engine and it's already built here.

**Refreshed 2026-08-18** — most milestones below were written early and
predate a lot of what's actually been built since. Status marks are accurate
as of today; anywhere direction actually *changed* (not just "got built") is
called out explicitly under **⤷ Replaced** rather than silently re-checked.

## Milestone 0 — Foundations (Week 1)
- [x] `git init` this folder; first commit.
- [x] Apply for **Google Business Profile API** access — **confirmed granted (or imminent) by the project owner 2026-08-18**; the real OAuth consent flow is now built (`routes/gbp-oauth.ts`), not just the token-exchange mechanism.
- [x] Register company + GST + trademark (MSME rate); buy `.in` domain.
- [x] Stand up Proxmox containers — **⤷ Replaced**: originally meant Postgres + Redis + n8n + cloudflared. Postgres/Redis moved to the VPS as the architecture matured (see `docs/ARCHITECTURE.md`); the home lab is now **tools-only**: n8n, **Uptime Kuma**, and **Twenty CRM** (neither in the original plan — added 2026-08-18).
- [ ] ~~`psql -f db/schema.sql` on the Proxmox Postgres~~ — **obsolete**, not just pending. There is no Postgres on Proxmox anymore. See `DEPLOYMENT.md` §3.6 for where migrations actually run now (the VPS).
- [ ] Create Meta app, add WhatsApp, get test number + token, point webhook at the API — still genuinely pending; no live Meta credentials in any session so far.

## Milestone 1 — Audit bot live (Weeks 1–3) ← THE LEAD MAGNET
- [x] DB schema (leads, audit_reports, events).
- [x] Places lookup + scoring + vernacular LLM summary + persistence.
- [x] WhatsApp webhook conversation flow (greet → name → audit → DEMO) — **expanded**: now greets with a **language picker** first (Telugu/Hindi/Tamil/Kannada/Malayalam, added 2026-08-18) before asking for the business name, and the audit itself runs in whichever language was picked instead of a hardcoded default.
- [ ] Get a Telugu WhatsApp message template approved — still pending, and the list has grown: renewal reminders, payment confirmations, website-request alerts, and GBP-no-locations alerts all also need Meta-approved templates now. All degrade to email-only until approved.
- [ ] Restrict Places API key + set billing cap + rate-limit the endpoint — **split, partially done**: the rate-limit part shipped early (`/api/audit/autocomplete` — see `docs/BUG.md`). Key restriction + a billing cap are still **not done** — the single most-repeated open risk across every audit this session.
- [x] Move convo state to Redis; add Meta webhook signature check.
- [ ] Soft-launch: put the bot link in front of 20 local businesses — business/GTM action, status unknown from code.

## Milestone 2 — Core product for pilots (Weeks 3–8)
- [x] Dashboard auth (phone OTP + JWT) — **⤷ Replaced**: originally, OTP verification created a new business + login on first use (self-serve signup). Retired 2026-08-18 — `routes/auth.ts` now only ever logs in an *existing* account. An account is created exactly one way now: a successful payment (Milestone 3's checkout, below).
- [x] **GBP agent** — massively expanded beyond "generate + publish, draft replies": real OAuth connect flow (dashboard button *and* WhatsApp menu), AI-generated images on every post, weekly automatic posting (no human has to click anything), a retry flow + WhatsApp/email alert when zero locations are found.
- [x] ROI dashboard page — also now reachable over WhatsApp ("My Stats" → a real chart image via QuickChart, added 2026-08-18), not just the web dashboard.
- [x] Business onboarding form (fills `profile_context`).
- [x] WhatsApp chat agent — unchanged in mechanism, now explicitly entitlement-gated (Starter+ only; silently skips replying for a lapsed/trial business rather than erroring).
- [ ] Onboard 10–20 pilots — business action, status unknown from code.

## Milestone 3 — The wedge features (Weeks 8–14)
- [x] Instagram/FB scheduling via Mixpost — **bug fixed + expanded**: the dashboard's Facebook button was actually hardcoded to Instagram only until 2026-08-18 (despite Facebook being sold on the pricing page). Both channels now also get weekly automatic posts with AI-generated images.
- [x] WhatsApp marketing campaigns (template send loop + prepaid-credit debit).
- [x] Razorpay subscriptions + webhook — **⤷ Replaced, twice**: originally sign-up-then-pay only (subscribe from an already-existing dashboard). Chunk C added **pay-first, admin-assisted** checkout (a team member generates a link; nothing exists until payment succeeds). 2026-08-18 added a **second, now-primary entry point**: `/checkout`, fully public and self-serve — a customer pays directly, no admin involved, same atomic account-creation logic either way. The admin-assisted link is now the *secondary* path, for edge cases only.
- [x] Booking microsite per business — **naming caveat, not a bug**: it's an enquiry/contact page (WhatsApp link + optional UPI pay link), not real date/time appointment booking. Cal.com integration is the intended real fix; not built yet — the project owner has confirmed they'll wire this in, so the feature stays on the pricing page as-is.
- [x] Connect real Mixpost account IDs per business (worker looks it up; skips + retries if unset — no live Mixpost instance confirmed in any session).

## Milestone 4 — Monetize & harden (Month 4)
- [x] Provision a VPS; move API + source-of-truth Postgres + Redis there — **done, on the project owner's real hardware** (2 vCPU / 8GB / 200GB, not specifically "Bangalore" — that was placeholder city naming). The web dashboard (`apps/web`) was always meant for **Vercel**, not the VPS — that part of the original wording was never quite right; corrected here.
- [ ] Keep n8n/Mixpost/Ollama/Metabase on home; nightly backups tested — **partially true, partially replaced**: n8n is on the home lab as planned; Mixpost/Ollama/Metabase are **not deployed anywhere yet** (still commented-out placeholders — Mixpost dry-runs with no live instance). **Added instead** (not in the original plan): Uptime Kuma + Twenty CRM. Backups: the script exists and a real bug in it was just fixed (`infra/backup.sh` assumed a network path from the home lab to the VPS that never actually existed — see `docs/BUG.md`), but a real restore has still never been tested end-to-end.
- [ ] Launch paid tiers + the free-audit funnel publicly — the *infrastructure* for a public launch now exists (`/checkout`, self-serve, no admin needed per sale) — whether it's actually been launched/marketed is a business decision outside what the code can confirm. Also: **the "Free" plan and "Pro" plan were both dropped from pricing** 2026-08-18 (Free's self-serve signup was a real cost/manpower risk with no benefit; Pro advertised multi-location support that never existed in the schema) — only Starter/Growth are sold now.
- [ ] Hire 1st sales rep; wire leads → rep assignment — **the wiring is done** (`/leads` page, "assign to me", `owner_user_id` on leads — built before this session). Hiring itself is a business/HR action, status unknown from code.

## Milestone 5 — Scale (Months 7–12)
- [ ] Add Tamil/Kannada content — **partially superseded**: the WhatsApp language picker (2026-08-18) already lets a lead receive their audit report in Tamil or Kannada today, not as a future wave. "Expand to Vijayawada/Bangalore" (geographic sales expansion) remains a business action, unrelated to code.
- [ ] ~~Wave-2 vertical: clinics/diagnostics (reuse scoring with different weights)~~ — **obsolete, replaced by a decision made before this session's context began**: the product was generalized to be vertical-neutral by design (Phase 0) — `profile_context` is freeform JSON, nothing is hardcoded to one business type. There is no "wave 2 vertical" to build; every vertical is already supported today.
- [ ] 2nd sales rep + channel-partner portal — business/HR action, unrelated to code.
- [ ] "Get found by AI" structured-data feature — genuinely not built, no work done here yet.

## What's been built that isn't in any milestone above
This roadmap was written early and never fully caught up. These shipped
2026-08-18 and don't map cleanly onto any milestone bucket above — see
`docs/DECISIONS.md`/`docs/FEATURE.md` for full detail on each:
- **Entitlement/plan-gating system** — the single biggest gap closed all session: nothing previously checked `businesses.plan`/`status` before running paid features. Now everything does, checked live on every request.
- **Legal pages rewritten for DPDP compliance** (Privacy/Terms/Refund) — still needs a lawyer's final sign-off before being production-final.
- **Renewal reminders, expiry widget, real email client** (SES).
- **Uptime Kuma + Twenty CRM** on the home lab (monitoring + internal CRM — no product ask for either in the original roadmap).
- **AI image generation** for GBP/Instagram/Facebook posts (FLUX via OpenRouter, hosted on Cloudflare R2).
- **WhatsApp interactive messages** (buttons/lists/images) and a full customer self-service menu (My Stats, Get a Website → priority alert, Connect Google) — the bot only ever supported plain text before this.
- **`DEPLOYMENT.md` and `docs/JOURNEYS.md`** — the detailed production deployment guide and the end-to-end customer/admin lifecycle diagrams, neither of which existed before.

## Definition of "shipped" for the audit bot
A local business owner — any vertical, any of the 5 supported languages — sends a WhatsApp, and within ~10 seconds gets a report scoring their Google presence and naming their top 2-3 gaps, and replying "DEMO" puts them in your sales queue. **That single loop working end-to-end is your first real milestone.**
