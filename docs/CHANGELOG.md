# Changelog

## Build session 2 — auth, billing, and the wedge features

Added (all authored, NOT yet run/typechecked — validate with `pnpm install && pnpm --filter @growlokal/api typecheck`):

### Auth (Milestone 2)
- `db/migrations/002_auth_billing.sql` — `otp_codes` (hashed), `webhook_events` (idempotency).
- `auth/otp.ts` — phone OTP: hashed codes, TTL, attempt limits. Dev logs the code; prod sends via MSG91.
- `auth/jwt.ts`, `auth/middleware.ts` — JWT sign/verify + `requireAuth` / `requireBusiness` (tenant scoping).
- `routes/auth.ts` — request-otp / verify-otp (auto-creates user+business on first login) / me.
- Web `/login` — two-step OTP sign-in.

### Content engine
- `features/content/generator.ts` — shared vernacular generation for social/GBP/campaigns, cheap vs quality tiering, robust JSON parsing.

### Wedge features (Milestone 3)
- `features/social/` + `clients/mixpost.ts` — generate + schedule Instagram/FB posts; `worker.ts` publishes due posts.
- `features/campaigns/` — WhatsApp marketing with **atomic prepaid-credit debit** (never overspends, refunds on failure).
- `features/gbp/` — GBP post creation + AI review-reply drafting (publish gated on Google approval; drafts saved regardless).

### Billing
- `clients/razorpay.ts` — subscription create + **HMAC webhook signature verification** (over raw body).
- `routes/billing.ts` — subscribe checkout + idempotent webhook that activates/suspends businesses.

### Wiring
- `routes/features.ts` replaces `stubs.ts` (deleted) — all tenant routes auth-protected.
- `server.ts` — registers `fastify-raw-body` (webhook), auth/billing/feature routes.
- Web `/dashboard/[businessId]` — ROI stats + one-click content generation; `/leads` now authed.

## Build session 3 — onboarding, chat agent, booking microsite

- **Onboarding** — `PUT /api/businesses/:id` (fills profile_context, COALESCE-safe) + web `/onboarding/[businessId]`.
- **WhatsApp chat agent** — `answerCustomerQuestion()` in generator.ts (prompt-stuffed profile_context, no vector DB); `whatsapp.ts` now routes by which number received the message: business number → chat agent (+ logs `enquiry_received`), platform number → audit bot. Replies in the free 24h window.
- **Booking microsite** — public `GET /api/public/business/:id` + web `/c/[businessId]` (server-rendered, wa.me + UPI deep link). Skipped Cal.com; add calendar slots only when a center asks.

## Build session 4 — rename + campaigns UI

- **Renamed** Prachaar → **GrowLokal** across all files; domain placeholder → `growlokal.com`. Package scopes now `@growlokal/*`.
- **Campaigns UI** — web `/dashboard/[businessId]/campaigns` (2-step: draft+preview → send, shows credit-exhaustion warning). Wires to the existing campaigns API. This was the last missing dashboard piece — GBP/social/campaigns backends were already built.
- Dashboard nav links to campaigns + edit-profile.

**All planned product features now have both backend + UI.** Remaining work is hardening (below), not features.

## Known TODOs (carried forward — hardening, not features)
- Conversation state → Redis (currently in-memory in `routes/whatsapp.ts`).
- Meta webhook signature verification (X-Hub-Signature-256).
- GBP OAuth refresh-token exchange (currently expects a static `GBP_ACCESS_TOKEN`).
- Per-business Mixpost account-ID lookup (worker dry-runs without it).
- Persist campaign recipients to a table (currently passed in the send call).
- Rate-limit the audit endpoint + Places API key restriction + billing cap.
- Email sending (SES) — not built; `.env` vars are placeholders.
