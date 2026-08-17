# Changelog

## Build session 11 — Mobile & tablet responsiveness & contact section

- **Dedicated responsive Contact Section (`#contact`)** — created a full 2-column contact section on the homepage with an interactive enquiry form (Name, Business Name, WhatsApp Number, Custom Goal/Query textarea) that automatically formats and forwards messages to WhatsApp support with one tap, plus right-hand support cards (Fastest Response WhatsApp Desk `+91 98765 43210`, Mon–Sat Helpline `+91 (040) 4892-3100`, and Hyderabad Headquarters office address).
- **Responsive layout overhaul for mobile (<640px) and tablet (768px–1024px)**:
  - Replaced inline grid styles with responsive CSS classes (`.growth-tools-grid`, `.growth-tool-card`, `.calculator-form-grid`, `.calculator-compare-grid`, `.calculator-action-input-row`).
  - Strengthened `.phone-input-group` with flexbox layout, country code prefix, separator divider, and flexible input width to guarantee zero clipping on viewports down to 320px width.
  - Resolved duplicate old contact component definitions and ensured seamless 1-column stacking for Growth Tools, 30-Day Results, Pricing, and Contact sections on mobile and tablet.
  - Formatted footer payment logos (`GPay`, `PhonePe`, `Paytm`, `UPI`, `VISA`, `Mastercard`, `RuPay`, `NetBanking`) with centered wrapping on small screens.
- **TypeScript build & link audit fix** — resolved `vertical.title` → `vertical.label` type discrepancy on `/city/[cityName]/[vertical]` and `/industry/[slug]`, added missing `Link` import on `/resources/whatsapp-kit`, and verified 100% clean production build (`pnpm run build` exits 0 with all 20 routes generated).

## Build session 10 — Dedicated industry & sector landing pages

- **Dedicated sector landing pages** — new dynamic `/industry/[slug]` route covering all 8 business verticals (Gyms, Clinics, Bakeries, Salons, Restaurants, Garages, Travel Agencies, Handyman Services). Each page features sector-specific hero headlines, growth stats, 3 core local pain points with AI fixes, customized breakdowns for all 4 AI agents, real South Indian customer case study with before/after metrics, search keywords, localized city cross-links to `/city/[cityName]/[vertical]`, collapsible FAQs, and an instant Google visibility audit form.
- **Enriched `verticalData.ts`** — expanded the shared vertical data model with comprehensive marketing copy, case studies, pain points, and FAQs for all 8 business categories.
- **Connected homepage showcase cards** — all 8 cards in the "Built for Small Business Owners" section on the homepage are now clickable Next.js `Link` components (`/industry/[slug]`) with animated hover badges. Footer "Solutions" column updated with direct links to the new sector landing pages.

- **Phone input group & typography enhancement** — replaced the previous single input with a `.phone-input-group` component featuring a vector Indian flag SVG, bold `+91` country code, vertical separator divider, and prominent `18px` bold digits (`font-weight: 700`, `letter-spacing: 0.08em`). The typed number now proportionally fills the box with balanced spacing and high legibility.
- **ROI calculator alignment & label cleanup** — in `/tools/admission-roi-calculator`, cleaned up the label to "New Local Customers Acquired / Month" and value badge to `+X Customers` with `white-space: nowrap` and baseline alignment. Removed the redundant and confusing `/ Mo` (abbreviation for Month) badge suffix that was breaking onto an awkward second line. Added `.roi-calculator-grid` responsive styling.
- **Flowbite typography system adopted** — integrated the full optical size **Inter** font family (100–900 weights) with modern Flowbite/Tailwind typographic tokens (`--font-heading: 'Inter'`, `--font-body: 'Inter'`, `font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11'`, `-0.025em` tight letter spacing on headlines, and `1.625` line-heights). Upgraded typography across hero, feature cards, pricing grid, and FAQ accordions for a crisp, high-end SaaS feel.
- **Flowbite breadcrumb navigation & SEO schema** — created reusable `<Breadcrumbs>` component (`apps/web/src/components/Breadcrumbs.tsx`) featuring Flowbite SVG home icon, chevron separators, glassmorphic pill background, hover state transitions, and automatic `BreadcrumbList` Schema.org JSON-LD generation for Google Search rich snippets. Integrated across all sector landing pages (`/industry/[slug]`), growth calculators (`/tools/admission-roi-calculator`, `/tools/google-score-calculator`), resources (`/resources/whatsapp-kit`), and legal policies (`/privacy`, `/terms`, `/refund`).
- **Pulsing floating WhatsApp widget & centered handset alignment** — upgraded the bottom-right WhatsApp floating button to `.floating_btn` with circular green button (`#25D366`), perfectly centered WhatsApp SVG handset geometry (`viewBox="0 0 32 32"`), radar pulse ring keyframe animation (`@keyframes wa-pulsing`), and a "Talk to us?" glassmorphic sub-label pill (`.text_icon`). Integrated across homepage and sector landing pages with smooth scale-up hover states.

Verified: Live browser testing verified click-through navigation from the homepage to all sector pages (`/industry/gyms-fitness`, `/industry/doctors-clinics`, `/industry/salons-spas`, etc.), confirmed zero overlap and bold typography in the phone input, verified clean baseline alignment in the revenue growth calculator, verified 2-column FAQ accordion expand/collapse transitions, verified desktop header layout and mobile drawer open/close flows, validated Flowbite Inter typography, tested breadcrumb rendering and return navigation, verified high contrast on results CTA banner, and verified centered alignment and pulsing animation on the WhatsApp floating widget.

## Build session 9 — landing page UI refinements

- **Pricing grid → 4-column single-row layout** — expanded `#pricing .section-center` and `.pricing-gosaas-wrapper` max-width to `1360px` to properly fit 4 cards side-by-side on desktop without cramped wrapping. Standardized `.pricing-plan-subtitle` with `min-height: 38px` so card dividers and prices align horizontally. Added `white-space: nowrap` and flex alignment on `.pricing-price-val` (`₹999 / month`, `₹2,499 / month`, `₹4,999 / month`). Maintained responsive breakpoints: `@media (max-width: 1100px)` for 2-column tablet layout, and mobile (≤640px) for single-column.
- **ROI "30-day transformation" images replaced** — removed backend dashboard screenshots that exposed the internal product UI. Replaced with realistic Google Maps search & ranking UI comparisons (`results_day1_before.jpg` showing competitor dominance and business buried at #18, `results_day30_after.jpg` showing #1 Local Pack ranking with 4.9 stars and WhatsApp booking CTA). Alt text and overlays updated to match.

Verified: Layout inspected via live browser at `http://localhost:3001` across desktop viewports. All 4 pricing cards render side-by-side cleanly; ROI before/after cards render without dashboard exposure or overlapping badge glitches.

## Build session 8 — Phase 2: new feature candidates

- **City × vertical SEO landing pages** — new `/city/[cityName]/[vertical]` route (32 pages: 4 cities × 8 verticals, matching the homepage's own business-showcase list). Extracted `CITY_DATA`/`getCity()` out of `city/[cityName]/page.tsx` into `lib/cityData.ts` (now has two consumers) and added `lib/verticalData.ts`. Both city pages now cross-link to each other (other verticals in the same city, this vertical in other cities) — the actual SEO value of the matrix.
- **Lead assignment** — `leads.owner_user_id` existed in the schema since the first build but nothing ever set or read it. Added `PATCH /api/leads/:id/assign` (defaults to "assign to me" — no staff-picker UI needed for a 1-2 person team) and `?mine=true` filter on `GET /api/leads`. Web `/leads` page has an "Assign to me" button + "my leads" toggle.
- **WhatsApp template quick-pick** — the campaigns UI's template-name field was free text; added a row of common-use-case suggestion chips (`new_offer_announcement`, `appointment_reminder`, etc.) that prefill it. Meta's own template approval is still an external step in WhatsApp Manager — this just removes the "remember the exact approved name" friction.

Verified: API typecheck clean, 4/4 tests pass, `next build` clean on all 18 routes (17 + the new nested city/vertical route).

## Build session 7 — Phase 1: finish known backend TODOs

- **WhatsApp conversation state → Redis** (`redis.ts`, new `ioredis` dep) — was an in-memory `Map` in `routes/whatsapp.ts`, lost on restart and broken across multiple instances. 24h TTL, no cleanup job needed.
- **Per-business Mixpost account IDs** — `businesses.mixpost_account_ids` (migration 003), settable via the onboarding route. `worker.ts` now reads it and **skips publishing (leaves the post `scheduled` for retry) instead of silently marking a no-op as "published"** when no account is connected — that was a real correctness bug, not just a missing feature.
- **Campaign recipients persisted** (migration 003, `campaign_recipients` table) — `createCampaign` now stores the list once; `sendCampaign(campaignId)` reads recipients + template + language + body back from the DB instead of requiring the caller to re-supply the same list on every send call. Also makes retrying just-`pending` recipients (e.g. after a credit top-up) safe — counters are additive, not overwritten.
- **GBP OAuth refresh mechanism** (`clients/gbp-oauth.ts`, migration 004 `businesses.gbp_refresh_token`) — resolves a fresh access token from a stored refresh token, cached in Redis (~50min), falling back to the static `GBP_ACCESS_TOKEN` if unset. **Deliberately does NOT include the authorization-consent redirect flow** — that needs a Google Cloud OAuth client + approved GBP access (external, user-completed prerequisites); building an unusable redirect route now would be untestable scaffolding. The one-time manual token-acquisition step is documented in the file's header comment.

Verified: API typecheck clean, 4/4 tests pass, `next build` clean on all 17 routes.

## Build session 5 — bug/security audit fixes

Found via full-repo read-through (marketing site, calculators, prod Docker/Caddy stack were added by a prior session). Fixed, verified: API typecheck clean, 4/4 audit-scoring tests pass, `next build` clean on all 17 web routes.

- **CRITICAL — audit bot was DOA:** `leads.vertical` INSERT used `'local_business'`, not a valid value in the `vertical` enum (`coaching|clinic|realestate|salon|restaurant|other`). Every lead capture crashed. Fixed to `'other'` (the enum's catch-all) in `audit/service.ts`.
- **WhatsApp webhook had no signature verification** — anyone who found the URL could trigger paid LLM/Places calls. Added `verifyWebhookSignature()` (HMAC-SHA256 over raw body, `X-Hub-Signature-256`) in `clients/whatsapp.ts`, wired into `routes/whatsapp.ts` via `fastify-raw-body`. New `WHATSAPP_APP_SECRET` config var (required in prod, skipped with a warning in dev).
- **`JWT_SECRET` had no production guard** — `config.ts` now throws on boot if `NODE_ENV=production` and the secret is still the dev default.
- **Env var name mismatch** — `docker-compose.prod.yml` set `WHATSAPP_WEBHOOK_VERIFY_TOKEN`, code reads `WHATSAPP_VERIFY_TOKEN`; the webhook handshake would have failed in prod. Fixed, plus added `WHATSAPP_APP_SECRET` passthrough, both required (`:?`) like `JWT_SECRET`.
- **`.env.example` was missing** (deleted, never replaced) — recreated matching `config.ts` exactly, including the vars added in this session and the prior one (`OPENROUTER_API_KEY`, Mixpost, Razorpay, pricing).
- **`pnpm-lock.yaml` was never committed** despite `.gitignore` saying it should be — Docker's `--frozen-lockfile` build would fail on a fresh clone. Committed.
- **`/api/audit/autocomplete` had no rate limit** despite calling the paid Places API — added `max: 20/min`.
- **Dead `industry` param** removed from the audit route/service (accepted by zod, destructured, never used — no caller sent it).
- **Phone numbers inconsistent** between the WhatsApp webhook (E.164) and the web form (bare digits) — normalized once in `runAudit()` (the single choke point both callers route through): 10-digit numbers get `91` prepended, already-prefixed numbers pass through.
- **`tools/google-score-calculator` faked a live scan** — "📡 Scanning Live Google Maps Profiles…" and "Based on public Google Maps completeness…" described a random string-length hash as a live lookup, and the WhatsApp "send" button did nothing. Relabeled the instant estimate honestly, and wired the send button to the real `/api/audit/run` (same call the homepage form uses) — it now returns and displays the actual score.
- `MSG91_SENDER_ID` default `PRCHAR` → `GRWLKL` (leftover from the pre-rename codename).
- `next-env.d.ts` was staged for commit — added to `.gitignore` (auto-generated by Next, regenerates on build).

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
