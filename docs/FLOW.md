# Flow — how execution actually moves through this codebase

Purpose: trace exactly how a request moves between files and functions, and — critically — **what breaks if you change a given file**. Read this before touching anything you didn't write yourself. Pairs with `ARCHITECTURE.md` (the system map) and `DECISIONS.md` (why things are built this way).

---

## 1. The audit bot (the acquisition engine — most important flow in the app)

Two entry points, **one shared service** — this matters: fix a bug once, both channels get the fix.

### 1a. Via WhatsApp
```
Meta webhook POST → routes/whatsapp.ts (verifyWebhookSignature, then handleMessage)
  → conversation state read/written in Redis (redis.ts, key wa:convo:{phone}, 24h TTL)
  → features/audit/service.ts: runAudit()
      → clients/places.ts: lookupBusiness()        (Google Places, 12h in-memory cache)
      → features/audit/scoring.ts: scoreBusiness()  (pure function, no I/O)
      → features/audit/prompt.ts: buildAuditPrompt() + clients/llm.ts: generate()
      → db.ts: persists lead + audit_report + event rows
  → clients/whatsapp.ts: sendText() replies to the owner
```

### 1b. Via the web form
```
apps/web/src/app/page.tsx (audit form) → POST /api/audit/run
  → routes/audit.ts (zod validation, 5 req/min rate limit)
  → features/audit/service.ts: runAudit()   ← same function as 1a
  → JSON response {score, message} rendered directly on the page
```

**Also calls `runAudit()`:** the "Google score calculator" tool (`tools/google-score-calculator/page.tsx`) — its instant on-page number is a fake client-side estimate for pacing, but the "send me my real score" step calls the real `/api/audit/run` too.

**Blast radius if you change `runAudit()` or anything it calls:** all three entry points above break or behave differently at once. `scoreBusiness()` is pure and unit-tested (`scoring.test.ts`) — changing its weights changes every audit score shown anywhere, silently, with no test failure unless you update the test's expected ranges.

---

## 2. Auth (phone OTP → JWT)

```
Web /login page → POST /api/auth/request-otp → auth/otp.ts: requestOtp()
    → generates 6-digit code, hashes it, stores in otp_codes, sends via clients/sms.ts (MSG91)
  → POST /api/auth/verify-otp → auth/otp.ts: verifyOtp()
    → on success: routes/auth.ts finds-or-creates a `users` row (+ a `businesses` row if new)
    → auth/jwt.ts: signToken() → JWT returned to the client, stored in localStorage (web/src/lib/api.ts)
```

Every subsequent authenticated request sends `Authorization: Bearer <jwt>`. `auth/middleware.ts`:
- `requireAuth` — verifies the JWT, attaches `req.auth = {userId, businessId, role}`.
- `requireBusiness` — calls `requireAuth`, then checks `req.auth.businessId === :id` in the URL (or `role === 'admin'`) before allowing the request through.

**Blast radius:** every `/api/businesses/:id/*` route depends on `requireBusiness`. Change its logic and you either lock everyone out or open a cross-tenant data leak — there is no other authorization check on those routes.

**Known gap (see `DECISIONS.md` 2026-07-11 "pay-first"):** today, signup happens via OTP *before* any payment — `verify-otp` creates a `trial` business immediately. The intended pay-first flow will change this entry point; anything that currently assumes "a business row exists the moment someone verifies OTP" will need revisiting.

---

## 3. Billing (Razorpay)

```
Dashboard → POST /api/businesses/:id/billing/subscribe → clients/razorpay.ts: createSubscription()
  → INSERT into subscriptions (active=false), returns a Razorpay checkout URL
Customer pays on Razorpay's page
Razorpay → POST /webhooks/razorpay (signature-verified over raw body, deduped via webhook_events)
  → routes/billing.ts: handleRazorpayEvent()
      subscription.activated/charged → subscriptions.active=true, current_period_end set;
                                        businesses.status='active', plan=<the subscribed plan>
      subscription.halted/cancelled  → subscriptions.active=false; businesses.status='past_due'
```

**Critical known gap:** `businesses.status` and `businesses.plan` are updated correctly by this flow, but **nothing downstream ever reads them to allow/deny anything.** `createGbpPost`, `createScheduledSocialPost`, `sendCampaign`, `answerCustomerQuestion` — none check status or plan before running. A `past_due` business today has full access to everything. This is the single biggest gap between "what the data says" and "what actually happens" in the codebase (see `DECISIONS.md` customer-journey discussion).

**Blast radius if you touch `routes/billing.ts`:** this is the only place `businesses.status`/`plan` get written from a payment event. Get the webhook handler wrong and businesses either never activate after paying, or never get suspended after cancelling — both are money-losing or trust-losing bugs, and neither will show up in a typecheck or the existing test suite (no test covers this file).

---

## 4. Content generation (shared by three features)

```
features/content/generator.ts is the single place LLM prompts are built:
  generateSocialPost()      ← used by features/social/service.ts
  generateGbpPost()         ← used by features/gbp/service.ts
  generateCampaignMessage() ← used by features/campaigns/service.ts
  answerCustomerQuestion()  ← used by routes/whatsapp.ts (the customer-facing chat agent)

All four call clients/llm.ts: generate(), which switches on config.LLM_PROVIDER
  (gemini | openrouter | anthropic | ollama) — see clients/llm.ts for the per-provider functions.
```

**Blast radius:** `generator.ts`'s `SYSTEM` prompt and `loadBusinessContext()` are shared by every AI-generated customer-facing message in the product. A change here changes the tone/behavior of GBP posts, social posts, campaign messages, *and* the WhatsApp chat agent simultaneously. This is also the file that was coaching-specific until the 2026-07-11 generalization pass — see `DECISIONS.md`.

---

## 5. Social scheduling (dashboard → worker → Mixpost)

```
Dashboard "Generate Instagram post" → POST /api/businesses/:id/social/schedule
  → features/social/service.ts: createScheduledSocialPost()
      → generateSocialPost() (content/generator.ts)
      → INSERT into posts (status='scheduled', scheduled_for)

Separately, on a 60s poll loop (apps/api/src/worker.ts — a DIFFERENT PROCESS from the API):
  tick() → SELECT posts JOIN businesses WHERE status='scheduled' AND scheduled_for <= now()
    → if business.mixpost_account_ids is empty: skip, leave post 'scheduled' (retry next tick)
    → else: features/social/service.ts: publishDuePost() → clients/mixpost.ts: schedulePost()
    → UPDATE posts SET status='published'|'failed'
```

**Important:** the worker (`pnpm --filter @growlokal/api worker`) is a separate long-running process from the API server (`pnpm --filter @growlokal/api dev`/`start`). If you only deploy/restart the API, scheduled posts stop publishing — nothing will error, they'll just sit as `scheduled` forever. Check both processes are running in production.

**Blast radius:** `worker.ts`'s poll query joins `businesses` for `mixpost_account_ids` — if you rename or restructure that column, the worker silently stops publishing for everyone (no error, just an empty `due.rows` or a broken join) unless you update this query too.

---

## 6. WhatsApp campaigns (money-handling — read this before touching)

```
Dashboard → POST /api/businesses/:id/campaigns → features/campaigns/service.ts: createCampaign()
  → generateCampaignMessage() → INSERT campaigns (status='draft') + INSERT campaign_recipients (one row per phone, status='pending')

Dashboard → POST /api/businesses/:id/campaigns/:cid/send → sendCampaign(campaignId)
  → SELECT campaign_recipients WHERE status='pending'
  → for each recipient:
      debitCredit()  — atomic conditional UPDATE (WHERE wa_credit_paise >= cost) — this is what
                        prevents overspending under concurrency; do not "simplify" this to a
                        read-then-write, it would create a race condition
      → clients/whatsapp.ts: sendTemplate()
      → on success: mark recipient 'sent', log to wa_messages
      → on failure: mark recipient 'failed', REFUND the debited credit
  → UPDATE campaigns SET sent_count += , failed_count += , cost_paise +=   (additive — safe to re-run)
```

**Blast radius:** `debitCredit()`'s atomicity is the only thing standing between this feature and a business being charged for messages it can't afford, or the reverse — sending without ever debiting. Any change to this function needs to preserve "debit and check balance in one atomic statement."

---

## 7. GBP (Google Business Profile) posting

```
Dashboard → POST /api/businesses/:id/gbp/post → features/gbp/service.ts: createGbpPost()
  → generateGbpPost() → INSERT posts (status='draft')  ← content is NEVER lost even if publish fails
  → clients/gbp-oauth.ts: resolveGbpAccessToken(businessId, storedRefreshToken)
      → Redis cache hit? return cached token
      → else exchange refresh_token for a fresh access_token (Google OAuth), cache ~50min
      → no refresh token stored? fall back to static config.GBP_ACCESS_TOKEN
  → if no usable token OR no gbp_location_id: return published:false, post stays 'draft'
  → else: POST to mybusiness.googleapis.com, UPDATE posts SET status='published'|'failed'
```

**Blast radius:** this entire feature is gated on Google's GBP API approval (external, not yet confirmed granted). The "always save as draft first" ordering is deliberate — never reorder this so the API call happens before the DB insert, or a failed/pending-approval publish attempt loses the generated content entirely.

---

## 8. Cross-cutting: what touches `businesses.plan` / `businesses.status`

**Updated 2026-07-11 — this gap is now closed for the routes that matter; see `DECISIONS.md` and `FEATURE.md` for the entitlement system.** Grep for these two columns before changing either:

| File | Reads/Writes | What it does with it |
|---|---|---|
| `routes/billing.ts` | Writes `status`, `plan` | Sets `active`/`past_due` from Razorpay webhook events |
| `routes/auth.ts` | Writes `status` (indirectly, via `INSERT ... 'pilot','trial'`) | New signup default |
| `auth/entitlement.ts` | Reads both | `getEntitlement()` / `hasMinPlan()` / `requirePlan()` — the single source of truth for "is this business allowed to do X" |
| `features.ts`: GBP post/review-replies/social-schedule/campaigns routes, public booking page | Reads (via `requirePlan`/`hasMinPlan`) | Returns 402 (or 404 for the public page) if not entitled |
| `routes/whatsapp.ts` (chat agent) | Reads (via `getEntitlement`/`hasMinPlan`) | Silently skips replying (no message to the end customer) if not entitled |
| `apps/web/.../dashboard/[businessId]/page.tsx`, `.../campaigns/page.tsx` | Reads (via `components/PlanGate.tsx`) | Renders only the renewal/upgrade wall if not entitled |
| `routes/features.ts` onboarding PUT, `roi`, `wallet`, `routes/features.ts` leads routes | — | **Deliberately NOT gated** — account management and viewing your own status/renewal path must always work regardless of plan |

**Updated again 2026-07-11 (Chunk E):** the expiry countdown and 7-day renewal reminder job are now built too — see §10. **Updated again 2026-07-11 (Chunk C):** the pay-first auto-provisioning flow is now built too — see §11. A business can now come into existence two ways: via phone-OTP signup (§2, still the only path for the Free tier / trying before paying) or via a paid checkout link (§11, sales-assisted, not public self-serve).

## 10. Renewal reminders (added 2026-07-11)

```
worker.ts runs TWO independent timers (separate from each other):
  tick()                  every 60s   — the social-post scheduler (§5)
  checkRenewalReminders() every 6h    — this flow

checkRenewalReminders():
  SELECT subscriptions WHERE active AND current_period_end BETWEEN now() AND now()+7d
                        AND reminder_sent_at IS NULL
    JOIN businesses (name) JOIN users (role='owner', for phone/email)
  for each row:
    if config.WHATSAPP_RENEWAL_TEMPLATE_NAME set → clients/whatsapp.ts: sendTemplate()
    else → log warning, skip WhatsApp (email still sent)
    if owner has an email → clients/email.ts: sendEmail()
    UPDATE subscriptions SET reminder_sent_at = now()   ← idempotency, prevents re-sending daily
```

**Blast radius:** `reminder_sent_at` is the only thing preventing this from re-sending the same reminder every 6 hours for the full 7-day window. If you ever add a way to "un-remind" a subscription (e.g. a plan change mid-window), remember to null this column out, or the owner just won't get reminded again that cycle.

**Notifies the owner (`users.role='owner'`), not the business's own customer-facing WhatsApp number** — don't confuse `businesses.whatsapp_number` (which the business uses to talk to *its* customers) with the owner's login phone (`users.phone`, where reminders go). These are two different numbers by design.

## 11. Pay-first checkout (added 2026-07-11)

```
Team member (NOT a public form) → POST /api/admin/checkout-links (requireAdmin)
  → clients/razorpay.ts: createSubscription({planId, notes: {phone, businessName, plan, source:'pay_first_checkout'}})
  → returns a Razorpay-hosted checkout URL — NO row written to our database yet
  → the admin copies this link and sends it to the lead manually (WhatsApp)

Lead pays on Razorpay's page
Razorpay → POST /webhooks/razorpay (signature-verified, deduped — same as always)
  → handleRazorpayEvent(): tries the sign-up-then-pay path first
      UPDATE subscriptions ... WHERE razorpay_sub_id = $1 RETURNING business_id
    if that finds a row → existing flow (business already existed, e.g. subscribed via its own dashboard)
    if it finds NOTHING → provisionFromPayFirstCheckout(subId, entity, periodEnd):
        reads entity.notes {phone, businessName, plan}
        db.ts: withTransaction() — ALL of the following succeed together or none do:
          SELECT users WHERE phone = $1
            found  → reuse business_id; UPDATE businesses SET status/plan;
                     deactivate any prior active subscription for this business
            absent → INSERT businesses (status='active', plan) → INSERT users (role='owner')
          INSERT subscriptions (business_id, plan, razorpay_sub_id, active=true, current_period_end)
        → sendPaymentConfirmation(): sendTemplate() (if template configured) + sendEmail() (if owner has one)
```

**Blast radius:** `provisionFromPayFirstCheckout()` is the only place a `business` can be created **without** going through the phone-OTP signup route (`routes/auth.ts`). If you ever add a third way to create a business, make sure it also creates a `users` row in the same transaction — nothing else in this codebase tolerates a business existing with zero users attached (login has nothing to authenticate against).

**Two entry points, one webhook handler:** `routes/billing.ts`'s `handleRazorpayEvent()` now branches on whether a local `subscriptions` row already exists for the `razorpay_sub_id`. This means the *same* webhook event type (`subscription.charged`) is handled completely differently depending on which path created the Razorpay subscription in the first place — read both branches together if you're debugging a payment that didn't activate correctly.

---

## 9. File-level "if you touch this, check that" map

| If you change... | Also check / likely to break |
|---|---|
| `db/schema.sql` enum types (`vertical`, `plan_tier`, `business_status`, etc.) | Every `INSERT`/`UPDATE` statement using a literal string for that column — Postgres will reject an unlisted value at **runtime**, not at typecheck. This exact bug already happened once (`'local_business'` vs the `vertical` enum — see `DECISIONS.md`). |
| `apps/api/src/config.ts` (adding a required env var) | `.env.example` (must document it), `infra/docker-compose.prod.yml` (must pass it through), and whether it needs a `:?` hard-require like `JWT_SECRET` |
| `features/content/generator.ts`'s `SYSTEM` prompt | GBP posts, social posts, campaign messages, and the WhatsApp chat agent all change tone simultaneously |
| `apps/api/src/routes/whatsapp.ts` conversation states | The Redis key format `wa:convo:{phone}` — anything reading that key elsewhere (nothing does today, but don't assume) |
| Pricing (`PRICE_*_PAISE` in `config.ts`) | `apps/web/src/app/page.tsx` pricing section, `tools/admission-roi-calculator`, `terms/page.tsx`, `refund/page.tsx`, `layout.tsx`'s JSON-LD `AggregateOffer` — **five places, not one** (this drifted before; see `DECISIONS.md`) |
| `lib/cityData.ts` or `lib/verticalData.ts` | Both `city/[cityName]/page.tsx` and `city/[cityName]/[vertical]/page.tsx` consume the same data — a city removed from `CITY_DATA` silently 404s both routes for that city |
| `worker.ts`'s poll query | If it stops matching businesses correctly, scheduled posts silently stop publishing with no error anywhere — check by querying `posts WHERE status='scheduled' AND scheduled_for < now()` for a growing backlog |
