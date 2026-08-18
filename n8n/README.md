# n8n workflows

No importable workflow files right now — the one that used to live here
(`social-scheduler.workflow.json`) was removed 2026-08-18: it called a
`/api/businesses/due-for-post` endpoint that was never built, and had no auth
header for a route that's since become plan-gated (`requirePlan('growth')`).
Social post generation (dashboard-triggered) and publishing (60s poll) are
both fully handled by the API + `apps/api/src/worker.ts` already — see
`docs/FLOW.md` §5. There's nothing for n8n to orchestrate here today.

n8n on the home lab today just runs whatever ad-hoc internal automation you
build in it (e.g. notifications, ops glue) — it isn't wired into any
customer-facing flow.

## API-first vs n8n-first — a deliberate choice

There are two valid ways to build automation that *does* need n8n later:

1. **API-first (what this repo leans toward):** business logic lives in `apps/api` (testable TypeScript), n8n just triggers HTTP calls on a schedule. Easier to test, version, and debug.
2. **n8n-first:** build the whole flow visually in n8n (HTTP → LLM node → Mixpost node). Faster to prototype, harder to test/version.

**Recommendation:** keep scoring/LLM/sending logic in the API (as the audit bot does), use n8n only for *orchestration and scheduling* on top of real, already-built endpoints — not for endpoints that don't exist yet.

## The audit bot in n8n (alternative to the API webhook)

If you'd rather run the audit bot's WhatsApp handling in n8n instead of the API's `/webhooks/whatsapp` route:
```
[Webhook: WhatsApp inbound]
  → [Switch: is it "DEMO"? / a name? / a greeting?]
  → [HTTP: POST https://api.growlokal.com/api/audit/run]   ← reuse the tested service
  → [HTTP: WhatsApp send (Meta Graph API)]
```
Either way, call `/api/audit/run` so the tested scoring + LLM + persistence logic stays in one place.
