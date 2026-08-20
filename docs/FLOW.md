# Flow — how execution actually moves through this codebase

Purpose: trace exactly how a request moves between files and functions, and — critically — **what breaks if you change a given file**. Read this before touching anything you didn't write yourself. Pairs with `ARCHITECTURE.md` (the system map) and `DECISIONS.md` (why things are built this way).

---

## 1. The audit bot (the acquisition engine — most important flow in the app)

Two entry points, **one shared service** — this matters: fix a bug once, both channels get the fix.

### 1a. Via WhatsApp
```
Meta webhook POST → routes/whatsapp.ts (verifyWebhookSignature, then handleMessage)
  → conversation state read/written in Redis (redis.ts, key wa:convo:{phone}, 24h TTL)
  → FIRST contact: sendList() — pick a language (added 2026-08-18; state=awaiting_language)
      chosen language stored separately: wa:convo:lang:{phone}, same 24h TTL
  → THEN ask for business name (state=awaiting_name)
  → features/audit/service.ts: runAudit()
      → clients/places.ts: lookupBusiness()        (Google Places, 12h in-memory cache)
      → features/audit/scoring.ts: scoreBusiness()  (pure function, no I/O)
      → features/audit/prompt.ts: buildAuditPrompt() + clients/llm.ts: generate()  — in the chosen language, not a hardcoded default
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

## 2. Auth (phone OTP → JWT) — LOGIN ONLY, does not create accounts

```
Web /login page → POST /api/auth/request-otp → auth/otp.ts: requestOtp()
    → generates 6-digit code, hashes it, stores in otp_codes, sends via clients/sms.ts (MSG91)
  → POST /api/auth/verify-otp → auth/otp.ts: verifyOtp()
    → on success: routes/auth.ts SELECTs the `users` row for this phone
        found  → auth/jwt.ts: signToken() → JWT returned to the client, stored in localStorage (web/src/lib/api.ts)
        absent → 404 { error: 'no_account' } — nothing is created
    → auth/jwt.ts: signToken() → JWT returned to the client, stored in localStorage (web/src/lib/api.ts)
```

Every subsequent authenticated request sends `Authorization: Bearer <jwt>`. `auth/middleware.ts`:
- `requireAuth` — verifies the JWT, attaches `req.auth = {userId, businessId, role}`.
- `requireBusiness` — calls `requireAuth`, then checks `req.auth.businessId === :id` in the URL (or `role === 'admin'`) before allowing the request through.

**Blast radius:** every `/api/businesses/:id/*` route depends on `requireBusiness`. Change its logic and you either lock everyone out or open a cross-tenant data leak — there is no other authorization check on those routes.

**Resolved 2026-08-18 (see `DECISIONS.md`):** this used to create a `trial` business + login for ANY phone on first OTP verify — no payment, ever. Retired: the ONLY way a `businesses`/`users` row now comes into existence is `routes/billing.ts`'s `provisionFromPayFirstCheckout()` (§11). This route now only ever logs an EXISTING customer in. Any code that assumed "a business row exists the moment someone verifies OTP" no longer holds — check §11 instead for how one gets created.

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

## 5. Social scheduling (dashboard OR weekly auto-post → worker → Mixpost)

**Two entry points as of 2026-08-18** — same as the audit bot's "one shared service, two triggers" pattern (§1), and for the same reason: fix a bug once, both paths get it.

```
Dashboard "Generate Instagram/Facebook post" → POST /api/businesses/:id/social/schedule
  → features/social/service.ts: createScheduledSocialPost()  (focus = what the owner typed)
      → generateSocialPost() (content/generator.ts)
      → INSERT into posts (status='scheduled', scheduled_for)

worker.ts's checkWeeklyAutoPosts() (every 6h) → same createScheduledSocialPost()
  → but focus is OMITTED — generateSocialPost() has the model pick its own
    angle using profile_context + the business's own recent-post memory
  → only called for businesses with no post in that channel in 7 days AND
    a fresh getEntitlement() check passed for THIS run (see DECISIONS.md
    2026-08-18 — this is the actual mechanism that stops generation the
    moment a subscription lapses; there's no separate "disable" step)

Separately, on a 60s poll loop (apps/api/src/worker.ts — a DIFFERENT PROCESS from the API):
  tick() → ATOMIC CLAIM (added 2026-08-18, security review — see docs/BUG.md):
    withTransaction: SELECT posts JOIN businesses WHERE status='scheduled' AND scheduled_for <= now()
                      FOR UPDATE OF posts SKIP LOCKED LIMIT 20
                      → UPDATE posts SET status='publishing' WHERE id = ANY(claimed ids)  → COMMIT
    (only after the claim transaction commits, i.e. the lock is released, do we touch Mixpost)
    → if business.mixpost_account_ids is empty: revert to 'scheduled' (retry next tick)
    → else: features/social/service.ts: publishDuePost() → clients/mixpost.ts: schedulePost()
        → if schedulePost() was a dry-run (Mixpost unconfigured): revert to 'scheduled', NOT 'published'
        → else: UPDATE posts SET status='published'|'failed'
    → any unexpected error after claiming: revert to 'scheduled' (never leave a post stuck in 'publishing')
```

**Important:** the worker (`pnpm --filter @growlokal/api worker`) is a separate long-running process from the API server (`pnpm --filter @growlokal/api dev`/`start`). If you only deploy/restart the API, scheduled posts stop publishing — nothing will error, they'll just sit as `scheduled` forever. Check both processes are running in production. **Runs on the VPS as its own container** (`infra/docker-compose.prod.yml`'s `worker` service), colocated with the API and its Postgres/Redis, not on the home lab — moved 2026-08-18, see `DECISIONS.md`.

**The `FOR UPDATE SKIP LOCKED` claim exists for when this worker is ever scaled to more than one instance** — with exactly one instance (today's reality) it changes nothing observable, but it's what makes running two instances safe instead of a double-publish risk. `'publishing'` is a real, persisted `post_status` value (migration `007`) — if you ever query `posts` by status directly, remember it's a valid transient state, not a bug if you see it mid-tick.

**Blast radius:** `worker.ts`'s poll query joins `businesses` for `mixpost_account_ids` — if you rename or restructure that column, the worker silently stops publishing for everyone (no error, just an empty `due.rows` or a broken join) unless you update this query too.

**Image generation (added 2026-08-18):** `generateSocialPost()` also calls `clients/image.ts: generateImage()` then `clients/storage.ts: uploadImage()` (Cloudflare R2), storing the result in `posts.media_urls` for Mixpost to actually publish. Both steps are best-effort — return `null` on any failure rather than throw — so a flaky image API or unconfigured R2 never blocks the caption/text post itself. Don't "fix" this to be blocking; that would turn an image outage into a full posting outage.

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

**Two entry points as of 2026-08-18** — same pattern as social scheduling (§5): manual (dashboard, `focus` provided) or automatic (`worker.ts`'s `checkWeeklyAutoPosts()`, every 6h, `focus` omitted, model picks its own angle, fresh `getEntitlement()` check every run).

```
Dashboard/worker → POST /api/businesses/:id/gbp/post OR worker.ts direct call → features/gbp/service.ts: createGbpPost()
  → generateGbpPost() → also generates + uploads one AI image (clients/image.ts, clients/storage.ts — best-effort, never blocks the text)
  → INSERT posts (status='draft', media_urls)  ← content is NEVER lost even if publish fails
  → clients/gbp-oauth.ts: resolveGbpAccessToken(businessId, storedRefreshToken)
      → Redis cache hit? return cached token
      → else exchange refresh_token for a fresh access_token (Google OAuth), cache ~50min
      → no refresh token stored? fall back to static config.GBP_ACCESS_TOKEN
  → if no usable token OR no gbp_location_id: return published:false, post stays 'draft'
  → else: POST to mybusiness.googleapis.com (includes media if an image was generated), UPDATE posts SET status='published'|'failed'
```

**Blast radius:** the "always save as draft first" ordering is deliberate — never reorder this so the API call happens before the DB insert, or a failed/pending-approval publish attempt loses the generated content entirely. The `media` field in the publish body, and the account/location-listing calls below, are unverified against a live Google account in this session — the project owner confirmed real OAuth client + GBP API access exists (or is imminent) as of 2026-08-18, but nothing here has actually run against it yet.

**How `businesses.gbp_refresh_token`/`gbp_location_id` actually get set now (added 2026-08-18) — `routes/gbp-oauth.ts`:**
```
Dashboard "Connect Google Business Profile" → authenticated fetch GET /api/businesses/:id/gbp/connect
  → returns a Google consent URL as JSON (NOT a redirect — this route needs the Bearer header,
    which only a real fetch() can send; the dashboard does window.location.href itself)
Browser → Google consent screen → Google redirects to GET /api/gbp/oauth/callback (public, unauthenticated)
  → validates a one-time state token (Redis, 10min TTL) → exchanges code for tokens
  → UPDATE businesses SET gbp_refresh_token = ...   (account-level, independent of which location gets picked)
  → redirects to /dashboard/:id/gbp/connect (a web page)
      → GET /api/businesses/:id/gbp/locations — lists locations via the just-saved refresh token
      → owner picks one → POST /api/businesses/:id/gbp/locations → UPDATE businesses SET gbp_location_id = ...
```

**Blast radius:** the state param in Redis is the only thing tying Google's callback back to a specific business — anyone who guesses/steals a valid state within its 10-minute window could connect their own Google account to someone else's business. Low risk (state is a random UUID, short-lived, single-use), but don't remove the one-time delete-on-use behavior.

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

## 11. Pay-first checkout — admin-assisted AND public self-serve (added 2026-07-11, self-serve added 2026-08-18)

**Two ways to START a checkout, converging on the same provisioning logic:**

```
EITHER: Team member → POST /api/admin/checkout-links (requireAdmin)
    — phone/businessName/plan already known from a WhatsApp conversation
OR:     Customer themselves → POST /api/checkout (public, rate-limited)
    — phone/businessName/plan typed in by the customer on /checkout
BOTH → clients/razorpay.ts: createSubscription({planId, notes: {phone, businessName, plan, source: '...'}})
    — planId resolved differently: admin types it in; public checkout reads
      RAZORPAY_PLAN_ID_STARTER/GROWTH from config (a customer never sees a plan_id)
  → returns a Razorpay-hosted checkout URL — NO row written to our database yet

Lead/customer pays on Razorpay's page
Razorpay → POST /webhooks/razorpay (signature-verified, deduped — same as always)
  → handleRazorpayEvent(): tries the "business already exists, changing/renewing plan" path first
      UPDATE subscriptions ... WHERE razorpay_sub_id = $1 RETURNING business_id
    if that finds a row → existing flow (business already existed — e.g. re-subscribing after a lapse)
    if it finds NOTHING → provisionFromPayFirstCheckout(subId, entity, periodEnd):
        reads entity.notes {phone, businessName, plan} — doesn't care which route created the subscription
        db.ts: withTransaction() — ALL of the following succeed together or none do:
          SELECT users WHERE phone = $1
            found  → reuse business_id; UPDATE businesses SET status/plan;
                     deactivate any prior active subscription for this business
            absent → INSERT businesses (status='active', plan) → INSERT users (role='owner')
          INSERT subscriptions (business_id, plan, razorpay_sub_id, active=true, current_period_end)
        → sendPaymentConfirmation(): sendTemplate() (if template configured) + sendEmail() (if owner has one)
```

**This is the ONLY way a `business` row is ever created** (see `DECISIONS.md` 2026-08-18 — self-serve trial signup via OTP was retired; `routes/auth.ts` now only ever logs an existing user in, never creates one). If you ever add a fourth way for an account to come into existence, make sure it creates a `users` row in the same transaction — nothing else in this codebase tolerates a business existing with zero users attached (login has nothing to authenticate against).

**Two entry points into checkout, one webhook handler, provisioning logic that doesn't know or care which entry point was used:** `routes/billing.ts`'s `handleRazorpayEvent()` branches on whether a local `subscriptions` row already exists for the `razorpay_sub_id` — completely independent of whether `/api/admin/checkout-links` or `/api/checkout` created it. The `notes.source` field (`pay_first_checkout` vs `public_checkout`) is purely descriptive/for-logging — nothing branches on it.

## 12. WhatsApp customer self-service menu (added 2026-08-18)

**A THIRD branch in the same webhook handler that already split business-vs-lead-gen (§1, §3's `handleChatAgent` vs `handleMessage`):**

```
POST /webhooks/whatsapp (routes/whatsapp.ts) — same entry point as always
  msg.interactive?.button_reply?.id ?? msg.interactive?.list_reply?.id ?? msg.text?.body
    ↓ recipient matches a businesses.whatsapp_number?
        yes → handleChatAgent()  (unchanged — answers THAT business's own customers)
        no  → is `from` a users.phone with role='owner'?
                yes → handleCustomerMenu(businessId, from, actionId ?? text)   ← NEW
                no  → handleMessage()  (unchanged — new-lead audit-bot script)

handleCustomerMenu() — stateless, no Redis:
  action === 'view_stats'    → features/insights/whatsapp-stats.ts: sendStatsSnapshot()
      → getEntitlement() check (starter+, same gate as the chat agent)
      → SELECT v_monthly_enquiries (same view /api/businesses/:id/roi uses — no new query)
      → clients/quickchart.ts: renderChart() → clients/storage.ts: uploadImage() (R2, reused from image-gen)
      → clients/whatsapp.ts: sendImage() — falls back to a text summary if chart render/upload fails
  action === 'want_website'  → features/leads/website-request.ts: recordWebsiteRequest()
      → UPDATE businesses SET website_requested_at = now()
      → INSERT events (type='website_requested')
      → alert team: sendTemplate() (if WHATSAPP_WEBSITE_REQUEST_TEMPLATE_NAME set) + sendEmail() (if OPS_ALERT_EMAIL set)
  anything else               → sendButtons() — show the menu again
```

**Blast radius:** the `users.phone` lookup is what makes this branch fire at all — it's checking the OWNER'S login number, not `businesses.whatsapp_number` (that's the business's own customer-facing number, a different thing — see §10's note, this confusion has already been called out once). If you ever let an owner change their login phone without updating this table consistently, they'd silently fall back into the new-lead script instead of their own menu — no error, just the wrong experience.

**Interactive messages are new to this codebase as of this entry** — until now, `routes/whatsapp.ts` only ever read `msg.text.body`; a button tap was invisible. Any other inbound handling you add in the future needs to check `msg.type` the same way (`text` vs `interactive`), or it will silently see nothing for button/list taps.

---

## 9. File-level "if you touch this, check that" map

| If you change... | Also check / likely to break |
|---|---|
| `db/schema.sql` enum types (`vertical`, `plan_tier`, `business_status`, etc.) | Every `INSERT`/`UPDATE` statement using a literal string for that column — Postgres will reject an unlisted value at **runtime**, not at typecheck. This exact bug already happened once (`'local_business'` vs the `vertical` enum — see `DECISIONS.md`). |
| `apps/api/src/config.ts` (adding a required env var) | `.env.example` (must document it), `infra/docker-compose.prod.yml` (must pass it through), and whether it needs a `:?` hard-require like `JWT_SECRET` |
| `features/content/generator.ts`'s `SYSTEM` prompt | GBP posts, social posts, campaign messages, and the WhatsApp chat agent all change tone simultaneously |
| `apps/api/src/routes/whatsapp.ts` conversation states | The Redis key format `wa:convo:{phone}` — anything reading that key elsewhere (nothing does today, but don't assume) |
| `apps/api/src/routes/whatsapp.ts`'s inbound message parsing | The three-way dispatch (business / owner / new lead) added 2026-08-18 (§12) — a `msg.text`-only change would silently break button/list taps for all three branches, not just one |
| Pricing (`PRICE_*_PAISE` in `config.ts`) | `apps/web/src/app/page.tsx` pricing section, `tools/revenue-roi-calculator`, `terms/page.tsx`, `refund/page.tsx`, `layout.tsx`'s JSON-LD `AggregateOffer` — **five places, not one** (this drifted before; see `DECISIONS.md`) |
| `lib/cityData.ts` or `lib/verticalData.ts` | Both `city/[cityName]/page.tsx` and `city/[cityName]/[vertical]/page.tsx` consume the same data — a city removed from `CITY_DATA` silently 404s both routes for that city |
| `worker.ts`'s poll query | If it stops matching businesses correctly, scheduled posts silently stop publishing with no error anywhere — check by querying `posts WHERE status='scheduled' AND scheduled_for < now()` for a growing backlog |
