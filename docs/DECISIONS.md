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
