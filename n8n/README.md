# n8n workflows

Importable starters. In n8n: **Workflows → Import from File**.

| File | Purpose | Status |
|---|---|---|
| `social-scheduler.workflow.json` | Daily 8am IST → generate + schedule Instagram/FB posts per active business | Starter (calls API stub) |

## API-first vs n8n-first — a deliberate choice

There are two valid ways to build the automation:

1. **API-first (what this repo leans toward):** business logic lives in `apps/api` (testable TypeScript), n8n just triggers HTTP calls on a schedule. Easier to test, version, and debug.
2. **n8n-first:** build the whole flow visually in n8n (HTTP → LLM node → Mixpost node). Faster to prototype, harder to test/version.

**Recommendation:** keep scoring/LLM/sending logic in the API (as the audit bot does), use n8n for *orchestration and scheduling*. The audit bot deliberately runs fully in the API so it has unit tests; the social scheduler shows the n8n-triggers-API pattern.

## The audit bot in n8n (alternative to the API webhook)

If you'd rather run the audit bot's WhatsApp handling in n8n instead of the API's `/webhooks/whatsapp` route:
```
[Webhook: WhatsApp inbound]
  → [Switch: is it "DEMO"? / a name? / a greeting?]
  → [HTTP: POST https://api.yourdomain.in/api/audit/run]   ← reuse the tested service
  → [HTTP: WhatsApp send (Meta Graph API)]
```
Either way, call `/api/audit/run` so the tested scoring + LLM + persistence logic stays in one place.
