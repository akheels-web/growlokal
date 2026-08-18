# Decisions Log

Every meaningful change to this codebase gets an entry here — **logged before the change is implemented**, not after. One entry per decision. Newest first. This is the "why," not the "what" (the "what" is the git log and `docs/FEATURE.md`).

## Template

```
### YYYY-MM-DD — <short title>
- **Why:** what problem/need triggered this
- **Purpose:** what this change is meant to achieve
- **How:** the approach taken (files/systems touched)
- **Status:** proposed | implemented | reverted
```

---

## Entries (newest first)

### 2026-08-18 — Weekly auto-posting, image generation, Facebook fix, Pro plan dropped
- **Why:** a pricing-vs-reality audit (this session, same day) found the product's core automation promise wasn't real — "weekly" GBP/social posts required a human to click a button every time, Facebook wasn't reachable from the dashboard at all despite being sold, "booking microsite" overstated a plain enquiry page, and "multi-branch/multi-location" (Pro plan) had zero backing in the schema. The project owner's explicit goal is a low-manpower automation business — a human-triggered "automation" feature doesn't serve that goal or scale with paying customers.
- **Six decisions, all confirmed by the project owner:**
  1. **Fix the Facebook button** — trivial, backend already supported the channel.
  2. **Build real weekly auto-posting**, but it must re-check entitlement on every run so a lapsed business's generation stops immediately — no exceptions.
  3. **WhatsApp templates — explicitly not touched this round** (project owner: "will work on later, i didnt touch it till now"). Nothing changed for campaigns.
  4. **Booking microsite stays a claimed feature** — the project owner is committing to wiring in Cal.com later; no code change needed today, the existing enquiry microsite remains as-is.
  5. **Pro plan dropped entirely** — cannot honestly claim multi-location support that doesn't exist. Removed from pricing, the admin checkout tool, and the sellable-plan enums. The Postgres `plan_tier` enum and the TypeScript `PlanTier` type/`PLAN_RANK` in `entitlement.ts` were deliberately **left untouched** — ripping a value out of a live enum for zero functional benefit is a disruptive migration for something that's inert if simply never sold again.
  6. **Image generation added** for GBP + Instagram + Facebook only — not campaigns/chat (text-only), and explicitly not X/LinkedIn (project owner's own call: "mostly businesses dont use it").
- **Two cross-cutting constraints, both explicitly required by the project owner:**
  - **Security — no generation for lapsed businesses, ever.** The new weekly auto-post job (`worker.ts`'s `checkWeeklyAutoPosts()`) is the only new thing capable of spending money/LLM calls without a human clicking anything, so it re-runs `getEntitlement()` fresh for every candidate business on every single run (every 6h) — never a cached or one-time check. A business that lapses between runs simply stops appearing as entitled; nothing special has to happen to "turn it off." Same live-check pattern `auth/entitlement.ts` already uses everywhere else — no new security logic invented, no new way for it to be wrong.
  - **Data/memory retained for returning customers.** Checked before building anything: there is no data-purge or cleanup job anywhere in this codebase. Cancelling only ever changes `businesses.status`; nothing deletes `posts`, `profile_context`, or anything else. So a business that lapses and resubscribes months later already keeps its full post history (and therefore the "recent posts" memory built earlier this session) automatically — nothing needed to be built for this, it just needed confirming, and flagging here so nobody adds a purge job later without re-reading this.
- **Weekly auto-posting: how the topic gets chosen without a human.** `generateSocialPost`/`generateGbpPost`'s `focus` parameter is now optional — when omitted, the prompt tells the model to pick a fresh angle itself using the business's `profile_context` and (for social) the same "last 8 posts" memory block built earlier this session. This reuses that memory mechanism for a second purpose (freshness *and* now topic selection) rather than building a separate curated topic-rotation list.
- **Image generation: the real complexity was storage, not generation.** OpenRouter's image endpoint (`POST /api/v1/images`, confirmed via its docs this session) returns base64 bytes, not a hosted URL — but Mixpost (`clients/mixpost.ts`) and GBP's `localPosts.media` both require a real public URL to actually publish an image, not inline data. Added `clients/storage.ts` — Cloudflare R2 via `@aws-sdk/client-s3` (S3-compatible; same "don't hand-roll AWS SigV4" exception already established for SES, and the same vendor already planned for DB backups in `infra/backup.sh`). Requires the project owner to create one R2 bucket + API token manually (same shape as the `TWENTY_ENCRYPTION_KEY` setup) — empty R2 config silently no-ops image generation rather than breaking caption-only posting.
- **Model choice:** `black-forest-labs/flux.2-klein-4b` via OpenRouter — confirmed live pricing (~$0.014/megapixel) and exact slug against OpenRouter's own model pages in this session before defaulting to it, same verify-before-trusting-a-slug pattern used for the Claude Haiku default earlier this session.
- **Image generation is best-effort, never blocking.** `clients/image.ts`'s `generateImage()` returns `null` (never throws) on any failure — a flaky image API or unconfigured R2 must never prevent the caption/text post itself from generating and publishing.
- **GBP posts never had a `media` field wired up at all** (found while adding this) — GBP's Local Posts API supports one; added `media: [{ mediaFormat: 'PHOTO', sourceUrl }]` to the publish call. Flagged with a comment to verify the exact request shape once real GBP API access is approved (unverified against a live Google account, same as the rest of `gbp/service.ts`).
- **Status:** implemented. Typecheck, existing test suite, and `next build` all pass. **Not yet verified against real OpenRouter/R2/Mixpost/GBP credentials or a live database** — no live services available in this session.

### 2026-08-18 — Social posts: quality-tier model + per-business content memory
- **Why:** the project owner raised two doubts about the social scheduler: (1) use a better LLM model via OpenRouter, (2) give it "memory" of what it already generated for a business so it doesn't repeat itself and writes more engaging, continuous content over time.
- **Checked before proposing anything:** `generateSocialPost()` was the only customer-facing content type in `features/content/generator.ts` still on the `cheap` tier — GBP posts and campaign messages were already on `quality`. No content-generation call anywhere had access to a business's own past output; only the static `profile_context` (services/pricing/offers). No image generation exists anywhere in the codebase — `visualIdea` is a one-line text tip for the owner to shoot a photo themselves, not an AI-generated image. Flagged this last point explicitly since the project owner's phrasing implied images might already exist.
- **Two forks, decided by the project owner via question tool:**
  1. **Quality-tier model applies to all plans**, not gated to Growth+/Pro — same reasoning already applied to GBP posts and campaign messages (public brand content either way).
  2. **Scope stays text + memory only this round** — real AI image generation (a new API integration, real per-image cost, using the already-existing-but-unused `posts.media_urls` column) is explicitly deferred as its own future decision, not built now.
- **"Memory" = the business's own last 8 social captions, already sitting in `posts`, fed into the prompt.** No new table, no vector DB, nothing shared across businesses or customers — `loadRecentSocialCaptions()` queries `WHERE business_id = $1 AND channel IN ('instagram','facebook')`, deliberately excluding GBP posts (different tone/platform, same table). This is genuinely bounded and cheap: a business posts a few times a week, so "last 8" is only ever a few weeks of short captions, regardless of how long the business has been a customer.
- **Scoped narrowly to `generateSocialPost()` only** — not GBP posts, campaign messages, or the WhatsApp chat agent, despite all four sharing this file's `SYSTEM` prompt (see `FLOW.md` §4's blast-radius warning). Extending memory to those is a reasonable future ask but wasn't requested; doing it by default here would have been unrequested scope creep into shared, customer-facing prompt behavior.
- **Two bugs found and fixed while doing this** (see `BUG.md`): OpenRouter's model IDs were hardcoded, silently ignoring OpenRouter's own multi-model access (it was only ever actually calling Gemini); and `posts.generated_by` — the cost-tracking column — always recorded the literal string `'gemini-cheap'` regardless of what actually ran.
- **Model choice for OpenRouter's quality tier:** `anthropic/claude-haiku-4.5` — fetched and confirmed against OpenRouter's live model listing in this session rather than guessed, given how fast model slugs change. Configurable via `OPENROUTER_MODEL_QUALITY` either way.
- **Status:** implemented. Typecheck + existing test suite pass. **Not verified against a real LLM provider call or real post history in this session** — no live API credentials or database available here.

### 2026-08-18 — Scheduler worker moved to VPS; home lab is tools-only; n8n gap fixed by removing its cause
- **Why:** the project owner asked to move "required things" onto the VPS and keep the home lab strictly for tools, plus verify n8n's database and workflow were actually correct. Checking surfaced two real problems in the same area (see `BUG.md`): the home-lab shared Postgres n8n was configured to use had never been created, and the one committed n8n workflow (`social-scheduler.workflow.json`) called an endpoint that doesn't exist and had no auth for a route that's since become plan-gated.
- **Purpose:** nothing revenue-critical should depend on home power/internet/hardware; the home lab should hold only internal ops tooling.
- **The scheduler worker (`apps/api/src/worker.ts`) moves from the home lab to the VPS**, as its own container in `infra/docker-compose.prod.yml` (same image as `api`, `command: ["node", "dist/worker.js"]`, same Postgres/Redis). It was previously placed on the home lab per `IMPLEMENTATION.md`'s original runbook — but it writes to production tables (`posts`, `subscriptions`) and sends real payment-confirmation/renewal messages to customers and owners. That makes it revenue-adjacent, not a "tool," and colocating it with the API removes any dependency on a cross-network hop to the production DB. VPS memory is now fully allocated at these limits (postgres 3500M + redis 1500M + api 2000M + worker 256M + caddy 500M = 7756M of 8GB) — no more services fit without raising the VPS spec or trimming existing limits.
- **n8n's database gap: fixed by removing the dependency, not patching it.** Rather than add an init script to create the missing `n8n` Postgres database, n8n now uses its own embedded SQLite (its documented default) — this workload doesn't need Postgres. The shared `postgres`/`redis` containers in `infra/docker-compose.yml` had nothing else using them either (confirmed against `infra/backup.sh`, which backs up the VPS's Postgres via a hardcoded LAN IP, not this container) — removed entirely. Each home-lab tool is now fully self-contained: n8n (SQLite), Kuma (SQLite), Twenty (its own dedicated Postgres/Redis) — no shared stateful service between tools, so one tool's bug/migration can't take another down.
- **The n8n workflow itself was broken, not just its database — deleted rather than fixed.** It called a `/api/businesses/due-for-post` endpoint that was never built and posted to `/social/schedule` with no auth against a now plan-gated route. The real flow (dashboard-triggered generation + the worker's poll-based publish) already does this job correctly without n8n; fixing the workflow to match would have meant building a second, redundant automation path for something already solved. `n8n/README.md` rewritten to reflect that n8n currently has no wired-in customer-facing role.
- **Also corrected in passing:** `IMPLEMENTATION.md`'s Phase 1 VPS section described running the API under pm2/systemd — stale, predates `infra/docker-compose.prod.yml` becoming the real deploy method. Updated to describe the actual `docker compose -f infra/docker-compose.prod.yml up -d --build` flow, now including the worker.
- **Status:** implemented. **Not yet verified against a real `docker compose up` on either the VPS or the home lab** — nothing in this session has run against real hardware.

### 2026-08-18 — Home-lab monitoring (Uptime Kuma) + internal CRM (Twenty), two-box hardware split
- **Why:** real hardware now exists to plan against — a home laptop (i5-1235U, 8GB RAM) with a public IP and a 3hr-UPS-backed connection, plus a VPS still being provisioned. Two open needs: (1) a dashboard showing which services are up/down, (2) somewhere for admin/finance to track leads/deals/revenue that isn't a spreadsheet, with room to grow into newsletters/broadcasts later.
- **Purpose:** answer both without adding manpower — the stated goal is an automation business, not a business that needs someone babysitting new tooling.
- **Monitoring: Uptime Kuma, not Prometheus/Grafana.** One container, SQLite, zero extra services, gives "up/down + alert me" today. Grafana/Prometheus would add real per-route latency/error-rate metrics, but that's setup and upkeep this stage doesn't need — revisit only once an incident actually happens that Kuma couldn't have caught.
- **CRM: Twenty, not Krayin.** Krayin is Laravel/PHP — a second language stack (Composer, PHP-FPM, its own deploy pipeline) to maintain for internal tooling only, directly against the low-manpower goal. Twenty is TypeScript/NestJS/Postgres, the same stack GrowLokal already runs, self-hosts as a couple of containers, and has an API to later push leads from GrowLokal's own `leads` table into it automatically instead of manual entry. Its own broadcast/newsletter feature is immature — Listmonk (already sketched as a future addition in `infra/docker-compose.yml`, SES as SMTP) covers that gap instead, not asked for yet.
- **Twenty runs its OWN bundled `twenty-db` (postgres:16) + `twenty-redis`, not the shared home-lab `postgres`/`redis` used by n8n.** Mirrors Twenty's own supported docker-compose (verified against `twentyhq/twenty`'s upstream `packages/twenty-docker/docker-compose.yml` and `.env.example` before writing this — env vars are `PG_DATABASE_HOST/PORT/USER/PASSWORD` split fields, not a single connection URL; the required secret is `ENCRYPTION_KEY`, not `APP_SECRET` — that name is legacy, only for instances that pre-date `ENCRYPTION_KEY`). Costs a bit more RAM than sharing the existing containers would, but that's the actually-supported path — the project owner's own bar for isolation ("shouldn't affect production database in any means") is best satisfied at the container level, not just a separate logical database.
- **Corrected during the quiz-gate check:** the project owner asked whether the home laptop's new public IP should be used directly — port-forwarding 80/443 to it, Caddy issuing its own cert, same pattern as the VPS. Corrected and the project owner agreed to keep **Cloudflare Tunnel** instead: a home laptop shares a network with personal devices (unlike a disposable VPS), so an open inbound port is a real exposure the VPS doesn't have; most residential "public" IPs aren't static, so direct exposure also risks silent DNS breakage without Dynamic DNS; and Tunnel works identically with or without a public IP (outbound-only), so having one doesn't actually change the calculus for internal tooling behind Cloudflare.
- **Two-box split, explicitly the project owner's call:** this laptop (box #1) hosts Kuma + Twenty + n8n only — capacity math (rough, unverified): OS (~1GB) + Kuma (~150MB) + Twenty server+worker+db+redis (~2-3GB) + n8n (~300MB) leaves limited headroom on 8GB. Chatwoot/Mixpost/Cal.com/Metabase/Listmonk wait for a second laptop the project owner already has, not yet set up — `infra/cloudflared-config.example.yml` now reserves a second LAN IP block (`10.0.0.40`) for it.
- **Deliberately out of scope this round:** actually pulling/booting these containers on the real laptop (no access to that hardware in this session — see `FEATURE.md` checklist), wiring Kuma's alert channel to WhatsApp/Telegram, and pushing GrowLokal leads into Twenty via its API (mentioned as a later step, not built).
- **Status:** implemented (compose + Tunnel config + docs). **Not yet verified against the real laptop, a real Cloudflare Tunnel, or a real Twenty first-run.**

### 2026-07-11 — Chunk C: pay-first checkout, sales-assisted (not public self-serve)
- **Why:** flagged from the start as needing its own design pass — the existing billing code assumed a business already existed (and was logged in) before it could subscribe. The confirmed "pay-first" decision meant nothing is provisioned until a payment actually succeeds, which required rethinking how a business row gets created at all.
- **Purpose:** let a business exist for the first time as a direct result of a successful payment, with no dashboard access (or any DB row) beforehand — matching "pay first, then get your account."
- **The real fork, resolved by the project owner:** sales-assisted (a team member generates a checkout link for a known lead) vs. full public self-serve (a stranger fills in a form on the pricing page, no human involved). **Chosen: sales-assisted** — matches the GTM playbook's own recommendation for this stage (1-2 reps, WhatsApp-driven sales), and avoids building/securing a public form before there's real inbound volume to justify it. The exact same auto-provisioning mechanism underneath would support switching to self-serve later — only the "who initiates checkout" entry point would need to change, not the provisioning logic.
- **Two more decisions, explicitly delegated to me by the project owner (with the instruction "I need a proper working SAAS platform without any issues" as the bar):**
  1. **No database row exists until payment succeeds.** The lead's phone/business name/chosen plan are stashed in Razorpay's own `notes` field at link-generation time — nothing is written to our database until the webhook confirms a successful charge. Avoids ghost/abandoned business rows from checkout links that are generated but never paid.
  2. **A re-used phone number attaches to the existing business** rather than creating a duplicate — if a lead's link is somehow paid twice, or a genuine plan-change link is generated for an existing customer, the payment updates their existing business's plan/status instead of creating a second one. Their previous active subscription row is deactivated so there's exactly one active subscription per business at a time.
- **How:** new admin-only route `POST /api/admin/checkout-links` (`requireAdmin` — nothing in this codebase sets `role='admin'` automatically; promote a user manually after they've signed up once). The Razorpay webhook handler now tries the existing sign-up-then-pay path first (a local `subscriptions` row already exists); if none is found, it falls back to `provisionFromPayFirstCheckout()`, which creates the business + user + subscription rows **in one database transaction** (`db.ts`'s new `withTransaction()` helper) — given the "no issues" bar, a half-created business with no user row is exactly the kind of failure mode that must not be possible. Payment confirmation + login instructions sent via WhatsApp (placeholder template, same external-approval situation as the renewal reminder) and email (real, works today).
- **Deliberately out of scope this round:** downgrade protection (if an existing business on Pro is accidentally sent a Starter link, their plan is simply set to Starter — no "don't downgrade" guard). Not asked for; a one-line addition if it becomes a real problem. Also out of scope: any UI for the still-hypothetical future self-serve path.
- **Status:** implemented. **Not yet verified against a live database, a real Razorpay sandbox, or an approved WhatsApp template** — see `FEATURE.md` for the specific checklist.

### 2026-07-11 — Chunk B: legal pages rewritten for DPDP compliance + accuracy
- **Why:** the original Privacy Policy's third-party processor list was materially wrong (named only Google/Meta/Razorpay; the real system also sends data to Gemini/Anthropic/OpenRouter, MSG91, and now Amazon SES) — the single biggest compliance gap found in the earlier DPDP review. Terms and Refund pages also predated the entitlement system, auto-renewal reminders, and the pay-first/refund-scope decisions, so they described a product that no longer matched reality.
- **Purpose:** an accurate, DPDP-informed draft covering consent + withdrawal, Data Principal rights, retention, children's data, breach notification, cross-border transfers (Privacy); auto-renewal, the real entitlement-based suspension behavior, an AI-content disclaimer (Terms); the corrected refund scope and post-refund account behavior (Refund).
- **Two corrections made during the quiz-gate check, both confirmed by the project owner:**
  1. **Invoices/financial records cannot be deleted on customer request**, even though profile/lead/conversation data can. Indian tax law requires retaining financial records for a legally mandated period regardless of an erasure request — DPDP's right-to-erasure does not override this. Writing "we delete everything on request" would have been a promise the business legally cannot keep. The Privacy Policy states this exception explicitly (Section 8) rather than silently glossing over it.
  2. **These pages are a strong final draft, not a certified-final legal document** — explicitly acknowledged and agreed: a qualified lawyer must review before this is genuinely production-final. No "AI draft / pending review" banner was added to the live pages themselves (would undermine customer trust in a document meant to build it) — the requirement is tracked here and in `FEATURE.md` instead.
- **Other explicit choices:** Terms describes the flow that's actually live today (sign-up via phone OTP, subscribe from dashboard) rather than the not-yet-built pay-first flow — avoids the pages describing something customers won't experience; will need revisiting once Chunk C ships. Retention period stated as "as required by applicable law" rather than a specific year-count, since the exact statutory number wasn't confidently verifiable in this session. Contact details (phone/email) remain the pre-existing placeholders — explicitly kept as-is per the project owner, to be filled in with real details before publishing.
- **Status:** implemented (draft). **Blocking item before this can go live: lawyer review.**

### 2026-07-11 — Chunk E: expiry widget, renewal reminders, real email client
- **Why:** entitlement enforcement (previous entry) covers *access*, but nothing showed an owner their renewal date or warned them before it lapsed, and no email system existed anywhere despite payment-confirmation/invoice emails already being identified as needed.
- **Purpose:** close the "auto-stop like Netflix" loop with an actual warning beforehand, and build the email-sending mechanism once rather than three separate times (this reminder, plus the still-pending payment-confirmation and invoice emails).
- **How, and the three decisions made (all confirmed by the project owner):**
  1. **Build a real (minimal) email client now, not a stub** — a small Amazon SES wrapper (`clients/email.ts`), mirroring `clients/sms.ts`'s dev-log-fallback pattern. Uses the official AWS SDK (`@aws-sdk/client-sesv2`) rather than a hand-rolled `undici` call like every other client in this codebase — SES requires AWS Signature V4 request signing, which is genuinely easy to get subtly wrong by hand; this is the one deliberate exception to the "no SDKs" pattern.
  2. **No approved WhatsApp template yet — build against a placeholder config var** (`WHATSAPP_RENEWAL_TEMPLATE_NAME`), same precedent as GBP OAuth. WhatsApp sending itself is already fully working; only this one template needs Meta's approval before it's live. Until then, the reminder job logs a warning and skips WhatsApp, but still sends email.
  3. **Entitlement also checks `current_period_end`, not just `businesses.status`** — access is correctly restricted the moment a paid period ends even if Razorpay's webhook is delayed. This also means there is deliberately **no separate "suspend" job** — the entitlement check (already built) is evaluated live on every request, so it's always correct without anything needing to proactively flip a status column.
  - Renewal reminder job: a second `setInterval` in `worker.ts` (every 6h, idempotent via `subscriptions.reminder_sent_at` — migration 005), finds subscriptions expiring within 7 days, notifies the business's *owner* (not the business's own customer-facing WhatsApp number), marks reminded.
  - Dashboard: `/api/auth/me`'s `entitlement` now includes `currentPeriodEnd`; `components/PlanGate.tsx` gained `ExpiryBadge` (warns inside 7 days), shown on the main dashboard.
- **Status:** implemented (mechanism). **Not yet live:** the WhatsApp side needs the Meta template approved; the email side needs real AWS SES credentials configured (both degrade gracefully — log instead of failing — until then).

### 2026-07-11 — Entitlement system: plan→feature mapping, enforcement points, and edge-case handling
- **Why:** confirmed as the single biggest gap in `FLOW.md`/`ARCHITECTURE.md` — nothing anywhere checked `businesses.plan`/`status` before running a feature.
- **Purpose:** enforce plan tiers server-side (not just hide UI buttons), with the project owner's confirmed rules: (1) `trial` (never paid) and `past_due`/`churned` (lapsed) get the identical restricted view — no distinction between "never subscribed" and "stopped paying"; (2) login always stays open, but a non-entitled business's dashboard shows nothing except a renewal prompt; (3) no customer-facing API-key system exists today, so "campaigns only via our dashboard" is already true by construction — noted as a future constraint (if customer API keys ever ship, exclude WhatsApp endpoints from them) rather than built now.
- **How:**
  - `auth/entitlement.ts` — `getEntitlement()`, `hasMinPlan()`, and a `requirePlan(minPlan)` Fastify preHandler (composes `requireBusiness`). Returns HTTP 402, not 403 — this is a billing problem, not a permissions one.
  - Plan→feature mapping: GBP posts + WhatsApp 24/7 responder → Starter+; review replies, Instagram/FB scheduler, WhatsApp campaigns, booking microsite → Growth+. (Multi-branch/Pro-only features don't exist yet — N/A.)
  - The public booking microsite (`GET /api/public/business/:id`) returns a plain 404 when not entitled, not a 402 with billing details — the visitor is a random member of the public, not the business owner.
  - The WhatsApp chat agent goes silent (no reply sent, just logged) rather than telling the end customer "this account is suspended" — that reflects badly on the business, not on us; the owner finds out via the dashboard wall instead.
  - `/api/auth/me` extended to return `entitlement` so the frontend can decide what to render.
  - Frontend: `components/PlanGate.tsx` (`useEntitlement()`, `RenewalWall`, `UpgradeWall`) — the dashboard and campaigns pages render nothing but the renewal wall when not entitled; Growth-only actions (Instagram post button, the campaigns nav link, the whole campaigns page) individually check `hasMinPlan(entitlement, 'growth')`.
- **Status:** implemented (server-side enforcement + UI walls). **Not yet done:** the dashboard expiry countdown, 7-day renewal reminder job, and the pay-first signup/auto-provisioning flow — those remain separate, not-yet-started chunks.

### 2026-07-11 — Refund guarantee applies to first payment only
- **Why:** the 7-day money-back guarantee's scope was ambiguous — could be read as applying to every renewal charge.
- **Purpose:** avoid a customer using the product for months then getting any single renewal refunded; matches standard SaaS practice.
- **How:** decision only — to be reflected in the rewritten Refund Policy (pending, see Chunk B).
- **Status:** proposed

### 2026-07-11 — Invoicing via Razorpay's built-in invoices, not a custom generator
- **Why:** need GST-compliant invoices for finance records, without building/maintaining our own PDF generation + GST formatting logic.
- **Purpose:** minimize build/maintenance surface for a legally-sensitive document.
- **How:** store Razorpay's invoice ID/URL against our `subscriptions` row; email the link. No new `invoices` table with generated content.
- **Status:** proposed (not yet implemented)

### 2026-07-11 — Payment happens before account creation ("pay-first")
- **Why:** the originally-built flow assumed sign-up-then-pay (log in via phone OTP first, subscribe from inside the dashboard). The intended real-world flow is the opposite: a visitor pays from the public pricing page, then the account is auto-provisioned.
- **Purpose:** match the actual customer journey — no dashboard access before payment.
- **How:** requires a new pre-auth checkout path (no JWT required to initiate payment) and auto-provisioning of the `business` + `user` rows on successful webhook, followed by sending login instructions. Not yet built — current `POST /api/businesses/:id/billing/subscribe` still requires an existing authenticated business.
- **Status:** proposed (not yet implemented) — **this changes the billing architecture and needs its own design pass before coding.**

### 2026-07-11 — Governance docs: Decisions/Flow/Architecture/Bug+Feature logs
- **Why:** the project has grown past the point where "the code is self-explanatory" — multiple build sessions have independently drifted (pricing shown in 3 places, coaching-only language reappearing after being generalized, a stale ARCHITECTURE.md describing removed stubs).
- **Purpose:** give any developer (human or AI) a way to pick up the project cold — why decisions were made, how execution actually flows, and a real record of bugs/features instead of relying on git archaeology.
- **How:** four docs under `docs/`: `DECISIONS.md` (this file), `FLOW.md`, `ARCHITECTURE.md` (updated in place), `BUG.md` + `FEATURE.md` as single running logs (not per-issue templates — explicit choice, see below).
- **Status:** implemented

### 2026-07-11 — Bug.md and Feature.md are single running logs, not per-issue templates
- **Why:** the default assumption (a template file copied per bug/feature) was proposed and explicitly rejected.
- **Purpose:** one place to scan the full history of bugs or features, each as a heading within one file, rather than files scattered across a directory.
- **How:** `docs/BUG.md` and `docs/FEATURE.md`, each with one `###` heading per entry, newest first.
- **Status:** implemented

### 2026-07-11 — "Quiz gate" before non-trivial changes
- **Why:** the project owner wants to stay in control of what gets built and understand each change before it lands, given the project's size and that it now touches money, personal data, and legal documents.
- **Purpose:** a lightweight comprehension check (2-3 plain-language questions on what a change does, what it touches, and its main risk) before implementing anything non-trivial — not a rubber stamp.
- **How:** applied as a standing practice going forward (not yet written into a `Constraints.md` — explicitly deferred, see below).
- **Status:** implemented (as a practice; not yet documented in a dedicated file)

### 2026-07-11 — Constraints.md deferred
- **Why:** the project owner asked to focus on Decisions/Flow/Architecture/Bug/Feature first and explicitly deferred `Constraints.md`.
- **Purpose:** avoid building a governance file before its content (what's actually off-limits) is well understood.
- **How:** n/a — no file created.
- **Status:** deferred, not dropped

### 2026-07-11 — Positioning: broad (all local-business types), not coaching-only wedge
- **Why:** the live site had already drifted from the original "coaching-centers-only, avoid Grexa's turf" wedge strategy to marketing at all local business verticals, competing head-on with Grexa.
- **Purpose:** the project owner explicitly chose to embrace the broad positioning rather than revert it.
- **How:** generalized all coaching-specific language across the backend (LLM prompts, scoring labels, the audit bot's own greeting, default business name) and docs. Backend scoring/weights are unchanged (they're vertical-neutral by construction) — only hardcoded copy was coaching-specific.
- **Status:** implemented

### 2026-07-11 — Pricing: three-tier ladder (₹999 / ₹2,499 / ₹4,999), not a single flat plan
- **Why:** the live landing page showed a single ad-hoc ₹2,999/mo plan that matched neither the GTM playbook nor the backend Razorpay config (`PRICE_STARTER/GROWTH/PRO_PAISE`), which already had the three-tier ladder.
- **Purpose:** undercut the competitor's ₹5,000/mo flat floor with a real entry tier, and make pricing consistent everywhere it's shown (landing page, ROI calculator, legal pages, SEO structured data).
- **How:** rewrote the pricing section (`apps/web/src/app/page.tsx`) to 4 cards (Free/Starter/Growth/Pro), fixed the same figure in `tools/admission-roi-calculator`, `layout.tsx`'s JSON-LD, and `terms`/`refund` pages.
- **Status:** implemented

### 2026-07-11 — GBP OAuth: build the token-refresh mechanism, not the consent redirect flow
- **Why:** a full "Connect your Google account" OAuth flow needs a Google Cloud OAuth client and approved GBP API access — both external, user-completed prerequisites that don't exist yet.
- **Purpose:** avoid building an untestable, unusable route (scaffolding) while still solving the real problem (a static access token that expires periodically).
- **How:** `clients/gbp-oauth.ts` resolves a fresh access token from a per-business refresh token (stored via the existing onboarding route), cached in Redis (~50min), falling back to the static `GBP_ACCESS_TOKEN`. The refresh token itself is obtained via a documented one-time manual process (Google's OAuth Playground) until volume justifies building the in-app consent flow.
- **Status:** implemented (mechanism only)

### 2026-07-11 — WhatsApp conversation state: Redis, not in-memory
- **Why:** the original `Map<string, ConvState>` in `routes/whatsapp.ts` was lost on every restart and would break the moment the API runs as more than one instance.
- **Purpose:** survive restarts, work correctly across multiple API instances.
- **How:** added `apps/api/src/redis.ts` (thin `ioredis` wrapper); conversation state keyed `wa:convo:{phone}` with a 24h TTL (a stale abandoned chat just resets to the greeting rather than getting permanently stuck).
- **Status:** implemented

### 2026-07-11 — Campaign recipients persisted at creation, not re-supplied at send time
- **Why:** the original API required the caller to pass the same recipient list to both `POST /campaigns` (create) and `POST /campaigns/:id/send` — fragile, and the second call had no way to know if the list had drifted.
- **Purpose:** make the recipient list, template name, and generated message body the single source of truth on the `campaigns`/`campaign_recipients` rows.
- **How:** new `campaign_recipients` table (migration 003); `sendCampaign(campaignId)` now takes no other arguments and reads everything from the DB. Counters are additive so re-calling send to retry just-`pending` recipients (e.g. after a credit top-up) is safe.
- **Status:** implemented

### 2026-07-11 — Worker skips publishing (doesn't fake success) when no Mixpost account is connected
- **Why:** discovered while wiring per-business Mixpost account IDs — the worker was calling `publishDuePost(post.id, [])` unconditionally and marking the post `published` even though nothing was actually sent.
- **Purpose:** a post's status in the DB must reflect reality — "published" must mean something was actually posted.
- **How:** `worker.ts` now checks for a non-empty `mixpost_account_ids` array before attempting to publish; if empty, it logs a warning and leaves the post `scheduled` for the next tick instead of faking success.
- **Status:** implemented

### 2026-07-11 — Audit-bot lead-capture crash fixed: use `'other'`, not `'local_business'`
- **Why:** a prior generalization pass (broadening from "coaching center" to "local business") inserted the literal string `'local_business'` into `leads.vertical`, which is a Postgres enum that does **not** include that value (`coaching|clinic|realestate|salon|restaurant|other`). Every single lead capture from the audit bot was crashing.
- **Purpose:** the audit bot is the entire acquisition engine — this bug made it completely non-functional.
- **How:** changed the insert to use the enum's existing `'other'` catch-all rather than adding a new enum value (avoids an `ALTER TYPE` migration for something the catch-all already covers correctly).
- **Status:** implemented

### 2026-07-11 — WhatsApp webhook requires a verified signature
- **Why:** `/webhooks/whatsapp` had no verification that inbound requests actually came from Meta — anyone who found the URL could trigger paid LLM/Places calls by POSTing fake messages.
- **Purpose:** close a real, exploitable cost-based abuse vector on a public, unauthenticated endpoint.
- **How:** `verifyWebhookSignature()` in `clients/whatsapp.ts` checks Meta's `X-Hub-Signature-256` (HMAC-SHA256 over the raw body) using a new `WHATSAPP_APP_SECRET`; the route opts into raw-body capture via `fastify-raw-body`. Skipped (with a warning) in dev if the secret isn't set.
- **Status:** implemented

### 2026-07-11 — Rename: Prachaar → GrowLokal
- **Why:** the project's working codename ("Prachaar") was replaced once the user purchased the `growlokal.com` domain.
- **Purpose:** consistent branding across code (package scopes, DB name, JWT storage key, page titles), docs, and infra configs.
- **How:** bulk find/replace across all files; domain placeholder `yourdomain.in` → `growlokal.com`.
- **Status:** implemented

### 2026-07-11 — DNS: Cloudflare owns nameservers, Vercel reached via CNAME
- **Why:** confusion over whether pointing nameservers at Vercel (for the dashboard) would break the Cloudflare Tunnel used for the API/self-hosted tools on Proxmox.
- **Purpose:** one DNS source of truth, no conflict between the two hosts.
- **How:** registrar's nameservers point at Cloudflare; `app.growlokal.com` is a Cloudflare CNAME to `cname.vercel-dns.com` set to **DNS-only (grey cloud)**, not proxied — Vercel needs to see real requests for its own SSL/CDN.
- **Status:** implemented (as a plan in `IMPLEMENTATION.md`; actual DNS records are a manual step outside this repo)

### 2026-07-11 — Lean self-hosted stack: home Proxmox + Cloudflare Tunnel + cheap VPS, budget ~₹10K/month
- **Why:** the project owner wants to build and validate the product before spending on infrastructure, using a home Proxmox server that's already available.
- **Purpose:** near-zero infra cost during the build/pilot phase; only add a paid VPS once there are paying customers who need uptime guarantees.
- **How:** Phase 0 (build/pilots) runs entirely on Proxmox via a Cloudflare Tunnel; Phase 1 (paying customers) moves the customer-facing path (web + API + source-of-truth Postgres) to a Bangalore VPS, keeping automation (n8n, Mixpost, worker, backups) on the home box.
- **Status:** implemented (as the documented plan; actual VPS provisioning is a manual step)
