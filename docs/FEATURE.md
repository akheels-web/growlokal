# Features Log

One heading per shipped feature, in this single file. Newest first. Each entry includes a test checklist (proof it works, not a claim) and a rollback plan (know your way out before you need it) — see `DECISIONS.md` for the *why* behind each and `FLOW.md` for how it connects to everything else.

## Template

```
### <feature name> — shipped YYYY-MM-DD
- **What it does:** one paragraph
- **Files:** the files that make it up
- **Test checklist:** [ ] concrete, checkable steps — not "works as expected"
- **Rollback:** exact steps to disable/revert without breaking other features
```

---

## Entries (newest first)

### Pricing grid 4-column single-row layout — shipped 2026-08-17
- **What it does:** Changes the pricing section from a 2×2 grid to a 4×1 single-row layout so all four plans (Free / Starter / Growth / Pro) are visible side-by-side on desktop without scrolling. Responsive breakpoints: ≤1100px → 2 columns, ≤640px → 1 column. Card padding slightly reduced to fit the narrower column width.
- **Files:** `apps/web/src/app/globals.css` (`.pricing-gosaas-grid`, `.pricing-card-free`, `.pricing-card-standard`)
- **Test checklist:**
  - [ ] Desktop (≥1100px): all 4 pricing cards render in a single row
  - [ ] Tablet (768–1100px): cards wrap to 2×2 grid
  - [ ] Mobile (≤640px): cards stack vertically in a single column
  - [ ] The "Most Popular" ribbon badge on the Growth card still renders correctly
  - [ ] Card content (features, prices, CTA buttons) is not clipped or overflowing
- **Rollback:** Revert `.pricing-gosaas-grid` to `repeat(2, 1fr)` and card padding to `36px 32px`; remove the 1100px media query.

### ROI section — dashboard screenshots replaced with illustrative images — shipped 2026-08-17
- **What it does:** Replaces the "Proven ROI & Local Dominance" before/after images that previously showed actual backend dashboard screenshots with illustrative concept images. The new images show Google Maps visibility concepts (buried at #18 vs #1 Local Pack) without exposing the product's admin UI to visitors.
- **Files:** `apps/web/src/app/page.tsx` (image `src` and `alt` attributes), `apps/web/public/images/result_before.jpg` (new), `apps/web/public/images/result_after.jpg` (new)
- **Test checklist:**
  - [ ] Both images load correctly on the landing page in the "30-day transformation" section
  - [ ] The score overlay pills (23/100 and 87/100) still render on top of the images
  - [ ] Images maintain correct aspect ratio within the `results-img-frame` container
  - [ ] No backend dashboard UI is visible in either image
- **Rollback:** Revert image `src` from `.jpg` back to `.png` in `page.tsx`. The original `.png` files are still in the public/images directory.

### Pay-first checkout (sales-assisted) — shipped 2026-07-11
- **What it does:** a team member generates a Razorpay checkout link for a known lead (phone/business name/plan already agreed via WhatsApp); nothing is written to our database until they actually pay. The webhook then auto-creates the business + user + subscription in one transaction and sends "payment confirmed, here's how to log in." See `DECISIONS.md` for the full design and the two decisions delegated to me (no DB row before payment; re-used phone attaches to the existing business).
- **Files:** `apps/api/src/db.ts` (`withTransaction()`), `apps/api/src/auth/middleware.ts` (`requireAdmin`), `apps/api/src/config.ts` (`WHATSAPP_PAYMENT_CONFIRMATION_TEMPLATE_NAME`, `DASHBOARD_LOGIN_URL`), `apps/api/src/routes/billing.ts` (new `POST /api/admin/checkout-links` route, `provisionFromPayFirstCheckout()`, `sendPaymentConfirmation()`, and the webhook handler's fallback path), `apps/web/src/app/admin/create-checkout/page.tsx` (new).
- **Test checklist:**
  - [ ] `POST /api/admin/checkout-links` as a non-admin user returns 403
  - [ ] As an admin: generates a real Razorpay subscription with `notes: {phone, businessName, plan, source:'pay_first_checkout'}` — **no row appears in our `businesses`/`users`/`subscriptions` tables at this point**
  - [ ] Simulate (or trigger for real, in a Razorpay test/sandbox account) a `subscription.charged` webhook for that subscription ID — confirm exactly one `businesses` row, one `users` row, and one `subscriptions` row (`active=true`) now exist, and they're consistent (same `business_id` throughout)
  - [ ] Re-run the same webhook event (simulating a Razorpay retry) — `webhook_events` dedup prevents a second provisioning attempt entirely (this path was already tested when billing was first built; confirm it still holds for the new fallback branch)
  - [ ] Generate a **second** checkout link for a phone number that now has an account (from the previous test) — after payment, confirm their **existing** business's plan/status updates rather than a new business appearing, and their previous subscription row is `active=false`
  - [ ] If the auto-provisioning transaction fails partway (e.g. simulate a DB error mid-transaction) — confirm `ROLLBACK` leaves **no partial rows** (no business without a user, no user without a business)
  - [ ] With `WHATSAPP_PAYMENT_CONFIRMATION_TEMPLATE_NAME` unset: warning logged, no WhatsApp attempted; email still sent if the (newly-created) user happens to have one on file (they won't, for a brand-new signup — only the phone was collected at checkout)
  - [ ] Log in via the normal OTP flow using the phone number from the checkout — confirm it reaches the now-provisioned business's dashboard, showing the correct plan and full entitlement
  - [ ] The *existing* sign-up-then-pay path (`/billing/subscribe`, subscribing from an already-logged-in dashboard) also sends a payment confirmation now — found and fixed mid-chunk, since only the new pay-first path sent one at first
  - [ ] **None of the above verified against a live database or a real Razorpay account in this session** — this is now the single largest "authored, not exercised" risk in the project, since it's the one flow that creates money-bearing customer accounts. Test end-to-end in a Razorpay sandbox before ever generating a real link.
- **Rollback:** the new `/api/admin/checkout-links` route and the webhook's fallback branch are additive — the original sign-up-then-pay path (`/billing/subscribe`) is untouched and still works exactly as before. To fully roll back, remove the new route and revert `handleRazorpayEvent`'s activated/charged case to its single-path version (skip the `updated` check, always assume a local subscription row exists).

### Legal pages rewritten (Privacy/Terms/Refund) — drafted 2026-07-11, NOT yet production-final
- **What it does:** replaces all three legal pages with DPDP-informed, factually-accurate versions. See `DECISIONS.md` for the full rationale and the two corrections made during the quiz-gate check (invoices can't be deleted on request; this is a strong draft, not a lawyer-reviewed final).
- **Files:** `apps/web/src/app/privacy/page.tsx`, `apps/web/src/app/terms/page.tsx`, `apps/web/src/app/refund/page.tsx`.
- **Test checklist:**
  - [ ] `next build` compiles all three pages with no size regression (they're static server components — confirmed at 190B each, unchanged)
  - [ ] No mention of "Grexa" anywhere in any of the three files (re-checked; still clean)
  - [ ] No stale `₹2,999` pricing references (re-checked; still clean — matches the Starter/Growth/Pro ladder already fixed in an earlier chunk)
  - [ ] Privacy Policy's third-party list matches the actual providers used in code: Google, Meta, Gemini/Anthropic/OpenRouter, MSG91, Amazon SES, Razorpay
  - [ ] Terms' feature-access table (Section 5) matches the real plan→feature mapping in `auth/entitlement.ts`
  - [ ] **NOT checked by anyone with legal training.** This is the one item in this project that requires a human professional before it's actually done — no amount of code verification substitutes for that.
- **Rollback:** `git revert` the commit; these are standalone content files with no code dependencies.
- **Outstanding before this can be called "shipped" in the normal sense:** (1) a qualified lawyer's review, (2) replacing the placeholder contact details (phone/email) with real ones, (3) revisiting Terms Section 3 once the pay-first signup flow (Chunk C) actually ships, since it currently describes the sign-up-then-pay flow that's live today.

### Expiry widget, renewal reminders, real email client — shipped 2026-07-11
- **What it does:** closes the loop on the entitlement system — an owner now sees their renewal date on the dashboard, gets warned 7 days before it lapses (WhatsApp + email), and the codebase has a real (if minimal) email-sending mechanism for the first time. See `DECISIONS.md` for the three decisions this involved.
- **Files:** `apps/api/src/clients/email.ts` (new), `apps/api/src/auth/entitlement.ts` (now also checks `current_period_end`), `apps/api/src/worker.ts` (`checkRenewalReminders()`, a second timer), `apps/api/src/config.ts` (SES_*/EMAIL_FROM/WHATSAPP_RENEWAL_TEMPLATE_NAME), `db/migrations/005_renewal_reminders.sql` (`subscriptions.reminder_sent_at`), `apps/web/src/components/PlanGate.tsx` (`ExpiryBadge`, `Entitlement.currentPeriodEnd`), `apps/web/src/app/dashboard/[businessId]/page.tsx`.
- **Test checklist:**
  - [ ] A business with `current_period_end` in the past is `entitled: false` even if `businesses.status` still says `'active'` (simulates a delayed Razorpay webhook)
  - [ ] A business with `current_period_end` more than 7 days out is unaffected
  - [ ] `checkRenewalReminders()` picks up a subscription expiring in 3 days with `reminder_sent_at IS NULL`, and does **not** pick it up again after `reminder_sent_at` is set
  - [ ] With `WHATSAPP_RENEWAL_TEMPLATE_NAME` unset: a warning is logged, no WhatsApp send attempted, but email still sends (if the owner has one on file)
  - [ ] With `SES_ACCESS_KEY_ID` unset: `sendEmail()` logs the would-be email instead of throwing
  - [ ] Dashboard: `ExpiryBadge` shows the teal "🔄 Renews" state for >7 days out, and the red "⚠️" warning state for ≤7 days
  - [ ] None of the above verified against a live database, a real AWS SES account, or a real approved WhatsApp template in this session — this is the biggest "authored, not exercised" risk so far in this project. Test the SES send with real credentials before relying on it for anything real.
- **Rollback:** remove the second `setInterval`/`checkRenewalReminders()` call in `worker.ts` to stop reminders (the DB column and email client can stay unused harmlessly). Revert `entitlement.ts`'s `periodExpired` check to fall back to status-only if the period-end logic ever misbehaves — it's a single `&& !periodExpired` clause in one function.

### Entitlement / plan-gating system — shipped 2026-07-11
- **What it does:** closes the single biggest gap identified in `FLOW.md`/`ARCHITECTURE.md` — server-side enforcement of what a business's plan actually allows, plus a dashboard that shows nothing but a renewal prompt when a business isn't entitled. See `DECISIONS.md` for the full rationale and the plan→feature mapping.
- **Files:** `apps/api/src/auth/entitlement.ts` (new), `apps/api/src/routes/features.ts` (`requirePlan()` added to GBP/social/campaigns routes, entitlement check on the public booking page), `apps/api/src/routes/whatsapp.ts` (chat agent gated), `apps/api/src/routes/auth.ts` (`/api/auth/me` returns `entitlement`), `apps/web/src/components/PlanGate.tsx` (new), `apps/web/src/app/dashboard/[businessId]/page.tsx`, `apps/web/src/app/dashboard/[businessId]/campaigns/page.tsx`.
- **Test checklist:**
  - [ ] A business with `plan='trial'` gets `entitled: false` from `getEntitlement()`; one with `plan='growth', status='active'` gets `entitled: true`
  - [ ] A business with `status='past_due'` gets `entitled: false` **regardless of its `plan` value** (the "same restricted view" rule)
  - [ ] `POST /api/businesses/:id/gbp/post` on a Starter-entitled business succeeds; the same call on a trial/past_due business returns `402 {error:'plan_required'}`
  - [ ] `POST /api/businesses/:id/social/schedule` on a Starter-only (not Growth) business returns 402 — Starter isn't enough for this route
  - [ ] `GET /api/public/business/:id` for a non-entitled or Starter-only business returns a plain `404`, not a 402 with billing info
  - [ ] An inbound WhatsApp message to a non-entitled business's chat agent produces **no reply** (check logs for the warning, not an error to the end customer)
  - [ ] Web: visiting `/dashboard/:id` as a non-entitled business shows *only* the renewal wall — no stats, no buttons, no nav links
  - [ ] Web: visiting `/dashboard/:id/campaigns` as a Starter-only (entitled but not Growth) business shows the upgrade wall, not the campaign form
  - [ ] Web: the "Generate Instagram Post" button on the main dashboard is replaced with an upgrade prompt for Starter-only businesses, while "Generate Google Post" stays usable
  - [ ] None of the above verified against a live database/deployment in this session — exercise each case for real once deployed, especially the WhatsApp-silent-skip behavior (easy to miss since nothing errors)
- **Rollback:** remove `requirePlan(...)` from the route options in `features.ts` (revert to plain `requireBusiness`) and the entitlement check in `whatsapp.ts`'s `handleChatAgent` — this fully reverts backend enforcement. On the frontend, remove the `useEntitlement()`/`RenewalWall` blocks from both pages to restore unconditional rendering. The `entitlement.ts` file and `PlanGate.tsx` component can stay unused without side effects if only partially rolling back.

### City × vertical SEO landing pages — shipped 2026-07-11
- **What it does:** 32 SEO landing pages (`/city/[cityName]/[vertical]`) — 4 cities × 8 verticals matching the homepage's business-showcase list, cross-linked both ways (other verticals in the same city; this vertical in other cities).
- **Files:** `apps/web/src/lib/cityData.ts`, `apps/web/src/lib/verticalData.ts`, `apps/web/src/app/city/[cityName]/[vertical]/page.tsx`; `city/[cityName]/page.tsx` was refactored to import the shared `cityData.ts` instead of a local copy.
- **Test checklist:**
  - [ ] `next build` completes and lists `ƒ /city/[cityName]/[vertical]` in the route table
  - [ ] Visit `/city/hyderabad/salons-spas` — page renders with Hyderabad + salon-specific copy
  - [ ] Visit `/city/unknowncity/salons-spas` — falls back gracefully (generic city copy, per `getCity()`'s fallback)
  - [ ] Visit `/city/hyderabad/not-a-real-vertical` — shows the "business type not found" state, not a crash
  - [ ] Cross-links on `/city/hyderabad/salons-spas` correctly point to the other 7 verticals in Hyderabad and to `salons-spas` in the other 3 cities
- **Rollback:** delete `apps/web/src/app/city/[cityName]/[vertical]/` (the nested route directory). `city/[cityName]/page.tsx` will still work standalone since `cityData.ts`/`verticalData.ts` have no other dependents besides the vertical cross-link section added to that same page — remove that section's JSX block if reverting fully.

### Lead assignment — shipped 2026-07-11
- **What it does:** `leads.owner_user_id` existed in the schema since the first build but nothing ever set or read it. Added `PATCH /api/leads/:id/assign` (defaults to "assign to me") and `?mine=true` filter on `GET /api/leads`; web `/leads` page gets an "Assign to me" button + "my leads" toggle.
- **Files:** `apps/api/src/routes/features.ts` (new route + filter), `apps/web/src/app/leads/page.tsx`, `apps/web/src/lib/api.ts` (`getCurrentUserId()` helper — client-side JWT payload decode for UI display only, not a security check).
- **Test checklist:**
  - [ ] `PATCH /api/leads/:id/assign` with an empty body assigns to the calling user
  - [ ] `PATCH /api/leads/:id/assign` with `{"ownerUserId": null}` unassigns
  - [ ] `GET /api/leads?mine=true` returns only the calling user's leads
  - [ ] Web: "Assign to me" button disappears once a lead is assigned to the current user, reappears if assigned to someone else
- **Rollback:** remove the `PATCH` route and the `mine` query handling in `features.ts`; revert `leads/page.tsx` to the pre-assignment version (no schema change needed — the column was already there, unused).

### WhatsApp template quick-pick chips — shipped 2026-07-11
- **What it does:** the campaigns UI's template-name field was free text; added clickable suggestion chips (`new_offer_announcement`, `appointment_reminder`, etc.) that prefill it. Meta's own template approval remains an external WhatsApp Manager step — this only removes the "remember the exact name" friction.
- **Files:** `apps/web/src/app/dashboard/[businessId]/campaigns/page.tsx`
- **Test checklist:**
  - [ ] Clicking a chip fills the template-name input with that exact string
  - [ ] The input remains freely editable after clicking a chip (not locked to the suggestion)
- **Rollback:** remove the `TEMPLATE_SUGGESTIONS` array and the chip-rendering block; the input still works as plain free text.

### GBP OAuth refresh-token mechanism — shipped 2026-07-11
- **What it does:** resolves a fresh Google access token from a per-business stored refresh token, cached in Redis (~50min), falling back to the static `GBP_ACCESS_TOKEN`. **Deliberately does not include** the authorization-consent redirect flow — see `DECISIONS.md` for why.
- **Files:** `apps/api/src/clients/gbp-oauth.ts` (new), `db/migrations/004_gbp_refresh_token.sql` (`businesses.gbp_refresh_token`), `apps/api/src/features/gbp/service.ts` (wired in), `apps/api/src/routes/features.ts` (`gbpRefreshToken` added to the onboarding PUT body), `apps/api/src/config.ts` (`GBP_CLIENT_ID`/`GBP_CLIENT_SECRET`).
- **Test checklist:**
  - [ ] With no refresh token and no static token set: `createGbpPost` returns `published:false, reason:'gbp_not_configured'`, post still saved as a draft
  - [ ] With `GBP_CLIENT_ID`/`SECRET` unset but a refresh token stored: falls back to the static token (or the same not-configured path if that's also unset) rather than throwing
  - [ ] A real end-to-end token exchange has **not** been tested (needs an actual Google Cloud OAuth client + a refresh token obtained via the documented manual process)
- **Rollback:** in `gbp/service.ts`, replace the `resolveGbpAccessToken(...)` call with the static `config.GBP_ACCESS_TOKEN` directly (this is exactly the pre-existing behavior it replaced).

### Campaign recipient persistence — shipped 2026-07-11
- **What it does:** recipients, template name, language, and generated message body are now stored once at campaign creation and read back at send time — the caller no longer re-supplies the same list to both the create and send calls.
- **Files:** `db/migrations/003_mixpost_and_campaigns.sql` (`campaign_recipients` table), `apps/api/src/features/campaigns/service.ts` (`createCampaign`, `sendCampaign` rewritten), `apps/api/src/routes/features.ts` (send route simplified), `apps/web/src/app/dashboard/[businessId]/campaigns/page.tsx` (send call simplified).
- **Test checklist:**
  - [ ] Create a campaign with N recipients → `campaign_recipients` has exactly N rows, all `status='pending'`
  - [ ] Send → `campaigns.sent_count`/`failed_count` match the number of `campaign_recipients` rows now `'sent'`/`'failed'`
  - [ ] Calling send again with some recipients still `'pending'` (e.g. after a credit top-up) only processes those, and counters increase rather than reset
  - [ ] Sending with insufficient `wa_credit_paise` stops partway and reports `stoppedForCredits: true`; remaining recipients stay `'pending'`
- **Rollback:** this changed the `sendCampaign()` function signature (from `(id, recipients, templateName, languageCode, bodyParam)` to `(id)`) — reverting requires restoring the old signature in both `service.ts` and the route/UI that calls it, not just removing the table.

### Per-business Mixpost account IDs — shipped 2026-07-11
- **What it does:** `businesses.mixpost_account_ids` stores which Mixpost social accounts a business's posts should publish to (set after an admin connects the account inside Mixpost's own dashboard). The worker looks this up instead of using a hardcoded empty array — see the related bug entry in `BUG.md`.
- **Files:** `db/migrations/003_mixpost_and_campaigns.sql`, `apps/api/src/worker.ts`, `apps/api/src/routes/features.ts` (`mixpostAccountIds` added to onboarding PUT).
- **Test checklist:**
  - [ ] A business with an empty `mixpost_account_ids` array: worker logs a warning and leaves its due posts `'scheduled'`
  - [ ] A business with a populated array: worker calls `publishDuePost` with those IDs
  - [ ] Not tested against a real Mixpost instance (none deployed in this session)
- **Rollback:** revert `worker.ts`'s query/check to the prior hardcoded `const accountIds: number[] = []` — functionally goes back to "always dry-run," which is safe but non-functional, not broken.

### WhatsApp conversation state moved to Redis — shipped 2026-07-11
- **What it does:** replaced an in-memory `Map<string, ConvState>` (lost on restart, broken across multiple instances) with Redis, keyed `wa:convo:{phone}`, 24h TTL.
- **Files:** `apps/api/src/redis.ts` (new), `apps/api/src/routes/whatsapp.ts`, `apps/api/src/config.ts` (`REDIS_URL`), `apps/api/package.json` (`ioredis` dependency), `infra/docker-compose.prod.yml` (Redis env/depends_on wiring).
- **Test checklist:**
  - [ ] Restart the API mid-conversation with a test WhatsApp number — the bot remembers it was `awaiting_name` rather than restarting the greeting
  - [ ] A conversation left untouched for 24h+ resets to the initial greeting on the next message rather than erroring
  - [ ] Two API instances pointed at the same Redis both see the same conversation state (not tested with a real second instance in this session)
- **Rollback:** revert `routes/whatsapp.ts` to the `Map`-based version (see git history before commit `0192813`); remove the `ioredis` dependency and `redis.ts` if fully reverting — but note this also removes the GBP token cache, which shares the same Redis instance.

### DPDP-driven legal/customer-journey review — findings only, 2026-07-11
- **What it does:** researched DPDP Act 2023 compliance gaps in the Privacy Policy, Terms, and Refund Policy, and reconciled the intended customer journey (payment → activation → invoicing → renewal reminders → auto-suspension → plan-based feature gating) against what's actually built. **No code or legal text changed yet** — this entry records the research and the decisions made from it (see `DECISIONS.md` for the four decisions: pay-first flow, Razorpay-native invoicing, first-payment-only refund scope, the quiz-gate practice).
- **Files:** none yet — `docs/DECISIONS.md`, `docs/FLOW.md`, `docs/ARCHITECTURE.md`, `docs/BUG.md`, `docs/FEATURE.md` (this file) were created/updated as a direct result of this conversation.
- **Test checklist:** n/a (no code shipped)
- **Rollback:** n/a

### Rewrote README with accurate info, removed Grexa references — shipped 2026-07-11
- **What it does:** the README had drifted badly from reality — a fabricated API endpoint table (routes that don't exist), a stale single ₹2,999 pricing plan, a "Redis & BullMQ Workers" architecture claim with no BullMQ anywhere in the code, and an entire competitive-benchmarking section naming Grexa.ai that needed to be removed.
- **Files:** `README.md`
- **Test checklist:**
  - [ ] Every endpoint listed in the README's API table exists in the actual route files (cross-checked via `grep -rn "app\.\(get\|post\|put\|patch\)("` at time of writing)
  - [ ] No occurrence of "Grexa" anywhere in the file
  - [ ] Pricing matches `config.ts`'s `PRICE_*_PAISE` values
- **Rollback:** `git revert` the README commit; no code dependencies on this file's content.

### Backend generalized from coaching-only to all local-business types — shipped 2026-07-11
- **What it does:** the audit bot's own WhatsApp greeting, all LLM system prompts (social/GBP-review/chat-agent), scoring gap labels, and the default business name were coaching-specific ("admissions", "parents", "coaching center") despite the product having already broadened in its marketing copy. See `DECISIONS.md` for the positioning decision this responds to.
- **Files:** `features/audit/scoring.ts`, `features/content/generator.ts`, `features/gbp/service.ts`, `routes/whatsapp.ts`, `routes/auth.ts`, `prompts/*.md`, plus the pricing rewrite described in its own `DECISIONS.md` entry.
- **Test checklist:**
  - [ ] `grep -rniE "coaching center|admission|parent" apps/api/src` returns no matches outside of intentionally-inclusive example lists (e.g. "salon, clinic, restaurant, gym, coaching center" as one example among several)
  - [ ] The WhatsApp bot's greeting message no longer mentions "coaching center"
- **Rollback:** these are copy-only changes (no schema/logic change) — revert the specific string literals in the files listed above if needed; nothing else depends on the exact wording.

### Audit bot (free WhatsApp/web Google-visibility check) — shipped (initial build, hardened 2026-07-11)
- **What it does:** the product's acquisition engine. A business owner provides their name (+ phone, via WhatsApp) and gets a 0–100 Google-visibility score with the top 2–3 gaps explained in their language, delivered via WhatsApp or shown directly on the web form. Captures a `lead` regardless of whether they convert.
- **Files:** `features/audit/service.ts`, `scoring.ts`, `prompt.ts`, `routes/audit.ts`, `routes/whatsapp.ts`, `clients/places.ts`, `clients/llm.ts`. Full trace in `FLOW.md` §1.
- **Test checklist:**
  - [ ] `scoring.test.ts` passes (4 unit tests: strong profile, weak profile, non-operational flag, score bounds)
  - [ ] A real WhatsApp message to the bot's number produces a reply within a few seconds
  - [ ] The web form at `/` produces the same score for the same business name as the WhatsApp path (same underlying `runAudit()`)
  - [ ] A lead row is created in Postgres after each run (was broken until the `'other'` enum fix — see `BUG.md`)
- **Rollback:** this is the core product — there is no partial rollback that preserves the product's value proposition. If a regression appears, revert to the last known-good commit rather than disabling pieces of this flow.

### Auth: phone OTP + JWT — shipped (initial build)
- **What it does:** passwordless login. Enter a phone number, receive a 6-digit code via SMS, verify it, get a JWT. First-time verification auto-creates a `business` + `user` row.
- **Files:** `auth/otp.ts`, `auth/jwt.ts`, `auth/middleware.ts`, `routes/auth.ts`, `clients/sms.ts`, web `/login`.
- **Test checklist:**
  - [ ] Request-OTP is rate-limited to 5/min, verify-OTP to 10/min (confirm via repeated requests)
  - [ ] A code older than its TTL or used more than the max-attempts count is rejected
  - [ ] `requireAuth` rejects a missing/invalid/expired JWT with 401; `requireBusiness` rejects a JWT for a *different* business's `:id` with 403
- **Rollback:** no safe partial rollback — every authenticated route depends on this.

### GBP agent, social scheduler, WhatsApp campaigns, Razorpay billing, booking microsite, onboarding — shipped (initial build)
- **What they do:** see `FLOW.md` §§3, 5, 6, 7 for full traces of each. Summarized in `README.md`'s feature table.
- **Test checklist:** covered individually where each was later modified (see the more recent, detailed entries above for GBP OAuth and campaign persistence specifically).
- **Rollback:** see individual `FLOW.md` sections for the blast radius of each.
