# Bugs Log

One heading per confirmed bug, in this single file. Newest first. Every entry needs enough detail that someone who's never seen the bug can reproduce it, understand why it happened, and verify the fix — not just "fixed a bug."

## Template

```
### [OPEN|FIXED] <short title> — found YYYY-MM-DD
- **Found in:** commit / how it was discovered
- **Symptom:** what breaks, concretely (error message, wrong behavior)
- **Root cause:** why it happens
- **Fix:** commit + what changed
- **Verified by:** how it was confirmed fixed (test run, manual check, what's still unverified)
```

---

## Entries (newest first)

### [FIXED] WHATSAPP_APP_SECRET/WHATSAPP_VERIFY_TOKEN had no production guard — found 2026-08-18
- **Found in:** developer security review + a crosscheck of every secret-shaped config var against the pattern `JWT_SECRET` already used
- **Symptom:** `verifyWebhookSignature()` returns `true` (skips verification entirely) when `WHATSAPP_APP_SECRET` is unset — a deliberate dev-only escape hatch, but nothing stopped it from silently shipping to production. `WHATSAPP_VERIFY_TOKEN` had the identical shape (real value, public dev default `'dev_verify_token'`) and the same missing guard — this one wasn't in the developer's review at all, found only by checking every other secret for the same pattern.
- **Root cause:** `JWT_SECRET` got a "throw if still default in prod" guard when that bug was originally fixed; the same guard was never applied to the other two secrets that need it just as much.
- **Fix:** `config.ts` now throws at boot for both, in production, exactly like `JWT_SECRET` already does.
- **Verified by:** typecheck + full test suite pass. **Not verified against an actual `NODE_ENV=production` boot in this session** — no live deploy to test against.

### [FIXED] GBP static-token fallback could post a business's content to the wrong Google account — found 2026-08-18
- **Found in:** `clients/gbp-oauth.ts`, while closing the review's static-token-fallback finding and reading the function more carefully
- **Symptom:** `resolveGbpAccessToken()` fell back to the shared static `GBP_ACCESS_TOKEN` not just when a business had never done OAuth, but ALSO when a business's real `refresh_token` exchange failed for any reason (expired token, transient Google API error). That meant a temporary Google API hiccup for one real, OAuth-connected business could silently post its content using a completely different (shared pilot) account's token.
- **Root cause:** the fallback was written as "degrade gracefully rather than fail outright," without distinguishing "no token configured at all" from "a real per-business token exists but this specific call failed."
- **Fix:** the static fallback now ONLY applies when there's no `refresh_token` at all. A failed exchange for a business with real OAuth returns `null` (draft-only, same as "not configured") instead of ever substituting a different account's token.
- **Verified by:** typecheck pass. **Not verified against a real Google API failure in this session** — no live GBP credentials to actually trigger the failure path.

### [FIXED] A business could set another business's Mixpost account ID, or bypass GBP OAuth entirely — found 2026-08-18
- **Found in:** developer security review (Mixpost accountIds) + a related finding made while fixing it (`gbpRefreshToken`, same route)
- **Symptom:** `PUT /api/businesses/:id` (self-serve onboarding) accepted both `mixpostAccountIds` (no check that the IDs actually belonged to this business inside Mixpost's own workspace — one shared `MIXPOST_TOKEN` meant a business could type in someone else's ID and get us to publish there) and `gbpRefreshToken` (a raw string a business could set directly, completely bypassing the real Google OAuth consent flow that's supposed to be the only way this gets set).
- **Root cause:** `gbpRefreshToken` was a leftover field from before the real OAuth flow existed, never removed once it did. `mixpostAccountIds` was self-serve from the start, with no verification step ever built for it.
- **Fix:** both removed from the self-serve onboarding schema entirely. Mixpost account linking is now a new admin-only route (`POST /api/admin/businesses/:id/mixpost-accounts`) — an admin sets it only after manually confirming the connection inside Mixpost's own dashboard. `gbp_refresh_token` is now written exclusively by the real OAuth callback (`routes/gbp-oauth.ts`).
- **Verified by:** typecheck pass. **Not verified against a live Mixpost instance in this session** — none exists yet in any session.

### [FIXED] Mixpost dry-run (unconfigured) marked posts 'published' when nothing was sent — found 2026-08-18
- **Found in:** developer review, "Mixpost dry-run masks misconfiguration" — same bug class as an earlier fix for empty `mixpost_account_ids`, found again in a second form
- **Symptom:** when `MIXPOST_BASE_URL`/`MIXPOST_TOKEN` were unset, `schedulePost()` returned `{ok:true, externalId:'dry-run'}` — indistinguishable from a real success to its caller. `publishDuePost()` then marked the post `'published'`, `published_at = now()`, even though nothing had actually been sent to Instagram/Facebook.
- **Root cause:** the dry-run return shape was designed to let development run without real Mixpost credentials, but never added a way for callers to tell a dry-run apart from a real success.
- **Fix:** `SchedulePostResult` now has a `dryRun` flag. `publishDuePost()` checks it and reverts the post to `'scheduled'` instead — same treatment as "no Mixpost accounts connected," not a false `'published'`.
- **Verified by:** typecheck pass. **Not verified against a live Mixpost instance in this session.**

### [FIXED] Worker's publish loop had no locking — a real double-publish risk if ever scaled — found 2026-08-18
- **Found in:** developer review, "Worker can process the same post twice if multiple instances run"
- **Symptom:** `tick()`'s query for due posts was a plain `SELECT ... LIMIT 20` with no row locking. Harmless with exactly one worker instance (today's reality), but two instances running concurrently could both select and publish the same post.
- **Root cause:** written for a single-instance deployment, with no forward-looking lock even though the file's own header comment already anticipated scaling ("move to BullMQ when volume grows").
- **Fix:** `tick()` now claims due posts inside a short transaction using `SELECT ... FOR UPDATE SKIP LOCKED`, marking them `'publishing'` (new enum value, `db/migrations/007_worker_hardening.sql`) before committing — before any external Mixpost call happens. Any post that errors unexpectedly after being claimed reverts to `'scheduled'` rather than getting stuck.
- **Verified by:** typecheck pass. **Not verified against two actual concurrent worker instances in this session** — the real motivating scenario is hard to test without deliberately running two.

### [FIXED] backup.sh could never actually reach the database it was meant to back up — found 2026-08-18
- **Found in:** `infra/backup.sh`, while writing `DEPLOYMENT.md` and checking whether the home lab needs any network path to the VPS
- **Symptom:** the script defaulted `PG_HOST` to `10.0.0.10` — a LAN-style IP — and its header comment said to cron it on the Proxmox (home lab) host. But `infra/docker-compose.prod.yml` binds Postgres to `127.0.0.1:5432` on the VPS only, with no LAN connecting the VPS to the home lab at all (they're on entirely separate networks, by design — see `DEPLOYMENT.md`). Run as originally written, this script could never have connected to anything; it would have failed every single night.
- **Root cause:** written before the VPS/home-lab network topology was fully decided; never revisited once the "tools-only home lab, no LAN link to the VPS" design was settled.
- **Fix:** default `PG_HOST` changed to `127.0.0.1`; header comment now says to cron this on the VPS itself, dumping the locally-running Postgres and uploading straight to B2/R2 (both reachable from anywhere) — no home-lab involvement needed at all.
- **Verified by:** consistent with `docker-compose.prod.yml`'s actual port binding. **Not verified against a real cron run in this session** — no live VPS in this session; run it manually once after first deploy and confirm the `.sql.gz` actually lands in the bucket before trusting the cron.

### [FIXED] Most of config.ts's env vars never actually reached the prod containers — found 2026-08-18
- **Found in:** `infra/docker-compose.prod.yml`, while adding `GBP_REDIRECT_URI`/`WEB_APP_BASE_URL` for the new GBP OAuth flow and noticing the `api`/`worker` services' `environment:` blocks looked thin
- **Symptom:** `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET`/`RAZORPAY_WEBHOOK_SECRET`, `MIXPOST_BASE_URL`/`MIXPOST_TOKEN`/`MIXPOST_WORKSPACE_UUID`, `MSG91_*`, `LLM_PROVIDER`/`LLM_MODEL_*`/`OPENROUTER_*`/`ANTHROPIC_API_KEY`, `PRICE_STARTER_PAISE`/`PRICE_GROWTH_PAISE`, and every var added earlier in this session (`R2_*`, `QUICKCHART_BASE_URL`, `GBP_*`, `OPS_ALERT_*`, `WHATSAPP_WEBSITE_REQUEST_TEMPLATE_NAME`) were documented in `config.ts`/`.env.example` but never actually passed through to the `api` or `worker` containers in the real prod Compose file. Deployed as-is, this would mean: Razorpay billing (the entire pay-first checkout flow from Chunk C) silently running on empty-string defaults, Mixpost publishing always dry-running, OTP SMS never sending, and every LLM/image call falling back to Gemini defaults regardless of configured provider — with zero errors, just silent misbehavior.
- **Root cause:** `FLOW.md`'s own file-level table already states the rule ("adding a required env var" must update both `.env.example` and `infra/docker-compose.prod.yml`) — but it was only followed for `.env.example` across most chunks this session; the actual deploy file was never cross-checked against it until now.
- **Fix:** added the complete missing set to both services (worker gets everything except the HTTP-route-only vars — `JWT_SECRET`, `RAZORPAY_*`, `MSG91_*`, `PRICE_*_PAISE` — it never serves a route that needs them).
- **Verified by:** manual line-by-line diff of `config.ts`'s full schema against both services' `environment:` blocks. **Not verified against a real `docker compose up` in this session** — worth a real deploy dry-run before trusting this is now complete; this class of drift has now happened at least once, so it's worth periodically re-diffing rather than assuming it stays in sync.

### [FIXED] generated_by cost-tracking column always said 'gemini-cheap', regardless of what actually ran — found 2026-08-18
- **Found in:** `apps/api/src/features/social/service.ts`, while bumping social posts to the quality tier
- **Symptom:** every row in `posts.generated_by` (the column's own comment: "model used, for cost tracking") was hardcoded to the literal string `'gemini-cheap'`, even when `LLM_PROVIDER` was set to `openrouter`/`anthropic`/`ollama`, and even now that the tier itself changed to `'quality'`. Any cost-tracking built on this column would have been reading fiction.
- **Root cause:** the literal was written once when the feature was first built and never revisited when the provider became configurable.
- **Fix:** `createScheduledSocialPost()` now records `` `${config.LLM_PROVIDER}-quality` `` — reflects the actually-configured provider and the actual tier used.
- **Verified by:** typecheck + existing test suite pass. Not verified against a real multi-provider run in this session (no live LLM credentials configured here).

### [FIXED] OpenRouter model IDs were hardcoded, ignoring OpenRouter's own multi-model access — found 2026-08-18
- **Found in:** `apps/api/src/clients/llm.ts`, while checking how to get a "good model" for social posts via OpenRouter
- **Symptom:** `generateOpenRouter()` hardcoded two fixed Gemini model strings for the cheap/quality tiers, regardless of `LLM_MODEL_CHEAP`/`LLM_MODEL_QUALITY` config (which the Gemini-direct path *does* respect). The file's own comment advertised "Multi-model: Claude, Llama 3.3, Gemini, FLUX graphics" access through OpenRouter, but none of those were actually reachable — OpenRouter was silently only ever calling Gemini.
- **Root cause:** the two model strings were written once as a working default and never made configurable when the Gemini path's equivalent config vars were added.
- **Fix:** added `OPENROUTER_MODEL_CHEAP`/`OPENROUTER_MODEL_QUALITY` to `config.ts` (defaults: the same Gemini-via-OpenRouter cheap model as before, and `anthropic/claude-haiku-4.5` for quality — verified as a real current OpenRouter slug before using it as a default). `generateOpenRouter()` now reads these instead of hardcoded strings.
- **Verified by:** typecheck pass; the `anthropic/claude-haiku-4.5` slug was confirmed against OpenRouter's live model listing in this session. Not verified against a real OpenRouter API call (no live credentials in this session).

### [FIXED] n8n's social-scheduler workflow called an endpoint that doesn't exist — found 2026-08-18
- **Found in:** `n8n/social-scheduler.workflow.json`, while checking n8n workflow correctness
- **Symptom:** the workflow's first HTTP node called `GET /api/businesses/due-for-post` — no such route exists anywhere in `apps/api`. Its second node POSTed to the real `/api/businesses/:id/social/schedule`, but with no `Authorization` header at all, against a route that requires a JWT and is now `requirePlan('growth')`-gated (built in a later chunk than this workflow). Importing and running this workflow as-is would fail outright on both steps.
- **Root cause:** written early as a "starter" example before the real social-scheduling flow was built; `apps/api/src/worker.ts`'s 60s poll loop plus the dashboard-triggered `/social/schedule` endpoint ended up implementing the same job differently, and this file was never reconciled or removed.
- **Fix:** deleted `n8n/social-scheduler.workflow.json` — the real flow (`docs/FLOW.md` §5) already covers post generation (dashboard) and publishing (worker poll) with no n8n involvement needed. Rewrote `n8n/README.md` to stop pointing at it.
- **Verified by:** confirmed `/api/businesses/due-for-post` has zero matches anywhere in `apps/api/src` (grep); confirmed the real `/social/schedule` route's actual auth/plan requirements in `apps/api/src/routes/features.ts`.

### [FIXED] n8n's database was never actually created — found 2026-08-18
- **Found in:** `infra/docker-compose.yml`, while adding Twenty CRM alongside n8n on the home-lab box
- **Symptom:** n8n's service config set `DB_POSTGRESDB_DATABASE: ${N8N_DB:-n8n}`, pointing it at a database named `n8n` inside the shared `postgres` container — but that container's `POSTGRES_DB` env only creates `growlokal` on first boot. Nothing in this repo ever ran `CREATE DATABASE n8n;`. First boot would have failed n8n's DB connection until someone did this manually.
- **Root cause:** the `postgres` image only auto-creates the single database named in `POSTGRES_DB`; a second logical database on the same server needs either an init script or a one-time manual `CREATE DATABASE`, and neither existed.
- **Fix:** removed the dependency instead of patching around it — n8n now uses its own embedded SQLite (its documented default), which this workload (a handful of scheduling workflows, no queue-mode concurrency) doesn't outgrow. The shared `postgres`/`redis` containers this bug depended on were themselves unused by anything else (confirmed: `infra/backup.sh` backs up the VPS's production Postgres via a hardcoded LAN IP, unrelated to this container) and have been removed from `infra/docker-compose.yml` entirely — one less thing to run on an 8GB box.
- **Verified by:** static read of `infra/docker-compose.yml` and `infra/backup.sh` — not exercised against a real `docker compose up` in this session.

### [FIXED] Next.js build failed due to dangling CSS rule in globals.css — found 2026-08-18
- **Found in:** `pnpm --filter @growlokal/web build` gate check
- **Symptom:** Webpack build failed with `Syntax error: E:\Github\grow\growlokal\apps\web\src\app\globals.css Unexpected } (1584:1)`.
- **Root cause:** An orphaned duplicate block `border: 1.5px solid var(--color-brand-teal) !important; background: rgba(46, 154, 166, 0.15) !important; }` lacked a selector and caused a PostCSS parser syntax error.
- **Fix:** Removed the orphaned block and deduplicated `.cta-buttons .btn-outline:hover` styles.
- **Verified by:** `pnpm --filter @growlokal/web build` passes with 0 errors and all static routes successfully generated.

### [FIXED] page.tsx invalid UTF-8 byte stream and section corruption — found 2026-08-18
- **Found in:** `pnpm --filter @growlokal/web build` gate check
- **Symptom:** Next.js build failed with `Error: Failed to read source code from page.tsx Caused by: stream did not contain valid UTF-8`.
- **Root cause:** A bad file replacement left a truncated 4-byte emoji sequence (`\xf0\x9f`) merged with a duplicate chunk of the pricing section inside the guarantee section.
- **Fix:** Restored the clean UTF-8 source baseline from git HEAD and accurately applied the luxury theme color tokens (`#14213D` / `#FCA311`), high-contrast text styles, and contact section.
- **Verified by:** `pnpm --filter @growlokal/web build` compiles 100% cleanly without errors.

### [FIXED] Google-score calculator faked a live scan and a fake WhatsApp send — found 2026-07-11
- **Found in:** full-repo review, `apps/web/src/app/tools/google-score-calculator/page.tsx`
- **Symptom:** the page showed "📡 Scanning Live Google Maps Profiles…" and claimed the score was "Based on public Google Maps completeness…", but the number was `42 + (name.length * 3) % 25` — a string-length hash, not a real lookup. The "Send Full Audit Fix Plan to Your WhatsApp" button set a fake success state with no backend call at all.
- **Root cause:** the page was built as a marketing/lead-gen mockup and never wired to the real audit engine that already existed (`/api/audit/run`).
- **Fix:** commit `c31be7d` — relabeled the instant number as an honest estimate; wired the "send" button to the real `/api/audit/run` (same call the homepage form uses) and display the actual returned score/message.
- **Verified by:** `next build` clean; not verified against a live backend in this session (no Postgres available to run the full round-trip) — exercise this page against a real deployment before trusting it.

### [FIXED] Audit-bot lead capture crashed on every single run — found 2026-07-11
- **Found in:** full-repo review, `apps/api/src/features/audit/service.ts`
- **Symptom:** `INSERT INTO leads (..., vertical, ...) VALUES (..., 'local_business', ...)` — Postgres would reject this with `invalid input value for enum vertical: "local_business"` on every call. The audit bot — the entire acquisition engine — was non-functional.
- **Root cause:** an earlier pass broadening the product from "coaching centers" to "local businesses" changed the literal string inserted into `leads.vertical`, but the Postgres enum (`coaching|clinic|realestate|salon|restaurant|other`) was never updated to match, and nobody had run the code end-to-end against a real database to catch it.
- **Fix:** commit `c31be7d` — changed the insert to use `'other'`, the enum's existing catch-all, rather than adding a new enum value.
- **Verified by:** confirmed statically against the `CREATE TYPE vertical AS ENUM (...)` statement in `db/schema.sql`. **Not verified against a live database** in this session — run one real audit end-to-end after deploying and confirm the `leads` row actually lands.

### [FIXED] WhatsApp webhook had zero signature verification — found 2026-07-11
- **Found in:** full-repo security review, `apps/api/src/routes/whatsapp.ts`
- **Symptom:** anyone who discovered the webhook URL could POST a forged Meta-shaped payload and trigger `runAudit()` (Places + LLM calls, real cost) or the customer chat agent (LLM calls) — no authentication of any kind on a public endpoint.
- **Root cause:** the route was built to receive Meta's webhook but never checked Meta's `X-Hub-Signature-256` header.
- **Fix:** commit `c31be7d` — added `verifyWebhookSignature()` (HMAC-SHA256 over the raw body) in `clients/whatsapp.ts`, wired into the route via `fastify-raw-body`; new `WHATSAPP_APP_SECRET` config var, skipped with a warning if unset (dev-only escape hatch).
- **Verified by:** typecheck + existing test suite pass (no dedicated test for this path). Not verified against a real Meta signature in this session — confirm with a real webhook call once `WHATSAPP_APP_SECRET` is set from the Meta App Dashboard.

### [FIXED] Prod deploy would have failed Meta's webhook handshake — found 2026-07-11
- **Found in:** cross-checking `infra/docker-compose.prod.yml` against `apps/api/src/config.ts`
- **Symptom:** the prod compose file passed `WHATSAPP_WEBHOOK_VERIFY_TOKEN` to the API container, but the code reads `WHATSAPP_VERIFY_TOKEN`. In production, Meta's verification `GET` request would compare against the zod default (`'dev_verify_token'`) instead of the real configured value, and the handshake would fail — the webhook would never successfully register.
- **Root cause:** the env var name in the deploy config was never checked against the actual variable name the app reads.
- **Fix:** commit `c31be7d` — corrected the name in `docker-compose.prod.yml` and made both `WHATSAPP_VERIFY_TOKEN` and the new `WHATSAPP_APP_SECRET` hard-required (`:?`) in that file, matching the existing `JWT_SECRET` pattern.
- **Verified by:** manual cross-check of both files; not exercised against a live Meta webhook registration in this session.

### [FIXED] pnpm-lock.yaml was never committed — found 2026-07-11
- **Found in:** `git ls-files | grep lock` returned nothing, despite `.gitignore` explicitly stating "pnpm-lock.yaml IS committed"
- **Symptom:** `apps/api/Dockerfile` runs `COPY ... pnpm-lock.yaml ...` then `pnpm install --frozen-lockfile` — a fresh `git clone` would be missing the file the Docker build depends on, and the build would fail outright.
- **Root cause:** the lockfile was regenerated locally (present in the working tree) but had never actually been `git add`-ed in any prior commit.
- **Fix:** commit `c31be7d` — committed the lockfile.
- **Verified by:** confirmed present in `git ls-files` after the commit; a full `docker compose -f infra/docker-compose.prod.yml build` has not been run in this session to confirm the Docker build itself succeeds end-to-end.

### [FIXED] .env.example was missing entirely — found 2026-07-11
- **Found in:** full-repo review — the file had been deleted at some point and never replaced
- **Symptom:** `IMPLEMENTATION.md`'s own quick-start instructions (`cp .env.example .env`) were broken for anyone cloning the repo fresh; several env vars added since (`OPENROUTER_API_KEY`, `MSG91_*`, Mixpost, Razorpay, pricing vars) were undocumented anywhere.
- **Root cause:** unclear — likely deleted during an earlier cleanup pass and not noticed since the local `.env` continued to work.
- **Fix:** commit `c31be7d` — recreated it matching `config.ts` exactly; kept in sync again in later commits (`0192813` added `REDIS_URL`, GBP OAuth vars).
- **Verified by:** manually diffed against `config.ts`'s zod schema field-by-field at time of writing.

### [FIXED] Worker marked posts "published" when nothing was actually sent — found 2026-07-11
- **Found in:** while wiring per-business Mixpost account IDs, `apps/api/src/worker.ts`
- **Symptom:** `publishDuePost(post.id, [])` was called unconditionally with an empty account-ID array (a hardcoded placeholder), and the post's status was then set to `'published'` regardless of whether Mixpost actually received anything.
- **Root cause:** the worker was scaffolded before per-business Mixpost account IDs existed anywhere in the schema, and the "mark as published" step didn't distinguish a successful send from a no-op dry-run.
- **Fix:** commit `0192813` — the worker now checks for a non-empty `mixpost_account_ids` array before attempting to publish; if empty, it logs a warning and leaves the post `'scheduled'` for the next poll instead of lying about the outcome.
- **Verified by:** typecheck + test suite pass. Not verified against a real Mixpost instance in this session (none was deployed).

### [FIXED] JWT_SECRET had no production guard — found 2026-07-11
- **Found in:** security review of `apps/api/src/config.ts`
- **Symptom:** the default value `'dev_insecure_change_me'` would be used silently if `NODE_ENV=production` was set without also setting a real `JWT_SECRET` via any path other than the prod Docker Compose file (e.g. running `node dist/server.js` directly under pm2/systemd, per `IMPLEMENTATION.md`'s alternate deploy instructions) — every issued token would be forgeable with a publicly-known secret.
- **Root cause:** the Docker Compose file enforced this (`:?`), but nothing at the application layer did, so any deploy path that bypassed Compose was unprotected.
- **Fix:** commit `c31be7d` — `config.ts` now throws on module load if `NODE_ENV === 'production'` and `JWT_SECRET` is still the dev default, so the process refuses to start.
- **Verified by:** typecheck pass (the throw is a runtime check, not exercised by a test — would be worth a small test that sets `NODE_ENV=production` + the default secret and asserts the module throws).

### [FIXED] /api/audit/autocomplete had no rate limit despite calling a paid API — found 2026-07-11
- **Found in:** security review of `apps/api/src/routes/audit.ts`
- **Symptom:** every other cost-incurring endpoint had a tight per-route rate limit (`/api/audit/run` at 5/min), but autocomplete — called on every keystroke, hitting Google Places — only had the generic global 100/min limit.
- **Root cause:** oversight when the stricter limits were added elsewhere.
- **Fix:** commit `c31be7d` — added a 20/min limit scoped to this route.
- **Verified by:** typecheck pass; limit value chosen for UX (fast enough while typing) rather than measured against real Places API cost — revisit if it proves too generous once real traffic exists.
