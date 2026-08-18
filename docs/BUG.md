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
