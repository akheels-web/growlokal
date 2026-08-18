# Build Roadmap

Maps the GTM playbook (Part 7 + Part 10) to concrete engineering milestones.
Ship the audit bot FIRST — it's the acquisition engine and it's already built here.

## Milestone 0 — Foundations (Week 1)
- [x] `git init` this folder; first commit.
- [x] Apply for **Google Business Profile API** access (0 QPM until approved — longest lead time).
- [x] Register company + GST + trademark (MSME rate); buy `.in` domain.
- [x] Stand up Proxmox containers: Postgres, Redis, n8n, cloudflared (see Technical-Setup-Guide.md).
- [ ] `psql -f db/schema.sql` on the Proxmox Postgres.
- [ ] Create Meta app, add WhatsApp, get test number + token, point webhook at the API.

## Milestone 1 — Audit bot live (Weeks 1–3)  ← THE LEAD MAGNET
- [x] DB schema (leads, audit_reports, events).
- [x] Places lookup + scoring + vernacular LLM summary + persistence.
- [x] WhatsApp webhook conversation flow (greet → name → audit → DEMO).
- [ ] Get a Telugu WhatsApp **message template** approved for the first outbound touch.
- [ ] Restrict Places API key + set billing cap + rate-limit the endpoint.
- [x] Move convo state to Redis; add Meta webhook signature check.
- [ ] Soft-launch: put the bot link (wa.me/…) in front of 20 local businesses (any vertical) in Ameerpet.

## Milestone 2 — Core product for pilots (Weeks 3–8)
- [x] Dashboard auth (phone OTP + JWT) — `auth/`, `routes/auth.ts`, web `/login`.
- [x] **GBP agent**: generate + publish GBP posts, draft review replies — `features/gbp/` (publish gated on API approval; saves drafts meanwhile).
- [x] ROI dashboard page (reads `v_monthly_enquiries`) — web `/dashboard/[businessId]`.
- [x] Business onboarding form (fills `profile_context`) — web `/onboarding/[businessId]`.
- [x] **WhatsApp chat agent**: RAG over `profile_context` to answer questions — `routes/whatsapp.ts`, `features/content/generator.ts`.
- [ ] Onboard 10–20 pilots; collect Telugu video testimonials + real ROI numbers.

## Milestone 3 — The wedge features (Weeks 8–14)
- [x] **Instagram/FB scheduling** via Mixpost — `clients/mixpost.ts`, `features/social/`, `worker.ts`.
- [x] **WhatsApp marketing campaigns**: template send loop + prepaid-credit debit — `features/campaigns/`.
- [x] Razorpay subscriptions + webhook (signature-verified, idempotent) — `clients/razorpay.ts`, `routes/billing.ts`.
- [x] **Booking microsite** per center (`courses/fees/highlights + WhatsApp + UPI link`) — web `/c/[businessId]`.
- [x] Connect real Mixpost account IDs per business (worker now looks it up; skips + retries if unset).

## Milestone 4 — Monetize & harden (Month 4)
- [ ] Provision Bangalore VPS; move web + API + source-of-truth Postgres there.
- [ ] Keep n8n/Mixpost/Ollama/Metabase on home; nightly backups tested.
- [ ] Launch paid tiers + the free-audit funnel publicly.
- [ ] Hire 1st sales rep; wire leads → rep assignment.

## Milestone 5 — Scale (Months 7–12)
- [ ] Add Tamil/Kannada content; expand to Vijayawada/Bangalore.
- [ ] Wave-2 vertical: clinics/diagnostics (reuse scoring with different weights).
- [ ] 2nd sales rep + channel-partner portal.
- [ ] "Get found by AI" structured-data feature (12–18 months ahead of Grexa).

## Definition of "shipped" for the audit bot
A local business owner in Ameerpet — any vertical — sends a WhatsApp, and within ~10 seconds gets a Telugu report scoring their Google presence and naming their top 2-3 gaps, and replying "DEMO" puts them in your sales queue. **That single loop working end-to-end is your first real milestone.**
