# Prachaar — AI Marketing Platform for South Indian Local Businesses

> Working codename. *Prachaar (ప్రచారం / பிரச்சாரம்)* = "promotion / publicity". Rename freely.

An open-source, self-hostable alternative to Grexa.ai, targeting **coaching & tuition centers in Hyderabad and across South India**, in **Telugu / Tamil / Kannada + English (Hinglish)**.

See the strategy docs in the parent folder:
- `../Grexa-Competitor-GTM-Playbook.md` — full go-to-market plan
- `../Technical-Setup-Guide.md` — Proxmox / Cloudflare / Meta API setup

## What this repo is

A monorepo scaffold you can `git init` and build on. It is designed for the **lean self-hosted stack**: home Proxmox server + Cloudflare Tunnel + a cheap Bangalore VPS, budget ~₹10K/month.

## What's actually built vs. scaffolded

| Part | Status |
|---|---|
| **Database schema** (`db/schema.sql`) | ✅ Complete, runnable |
| **Audit bot** — the free WhatsApp "Google visibility report" lead magnet | ✅ Real vertical slice (webhook → Places lookup → scoring → LLM summary → WhatsApp reply → lead capture) |
| **WhatsApp Cloud API** send + webhook | ✅ Real |
| **Google Places lookup + audit scoring** | ✅ Real logic |
| **Vernacular LLM prompts** (Telugu/English) | ✅ Real templates |
| **API server** (Fastify + TS) | ✅ Runnable core, feature routes stubbed |
| **Web dashboard** (Next.js) | 🟡 Scaffold + key pages, most UI is TODO |
| **GBP agent, social scheduler, campaigns** | 🟡 Stubs with TODOs + n8n workflow starters |
| **n8n workflows** | ✅ Importable JSON starters |
| **Infra** (docker-compose, cloudflared) | ✅ Ready to adapt |

## Repo layout

```
project/
├── apps/
│   ├── api/          # Fastify TypeScript API — webhooks, audit bot, business logic
│   └── web/          # Next.js dashboard (App Router)
├── db/               # Postgres schema (source of truth) + seed
├── infra/            # docker-compose for self-hosted tools, cloudflared config
├── n8n/              # importable workflow JSON (audit bot, social scheduler)
├── prompts/          # vernacular LLM prompt templates
└── docs/             # architecture, data model, roadmap
```

## Quick start (local dev)

```bash
cp .env.example .env                              # set DATABASE_URL (keys optional for first boot)
pnpm install
psql "$DATABASE_URL" -f db/schema.sql
psql "$DATABASE_URL" -f db/migrations/002_auth_billing.sql
psql "$DATABASE_URL" -f db/seed.sql               # optional demo data
pnpm --filter @prachaar/api dev                   # API  :3000
pnpm --filter @prachaar/web dev                   # web  :3001
```

**Full end-to-end process, deploy steps, and the Git-vs-server split →
[`IMPLEMENTATION.md`](IMPLEMENTATION.md).** Start there.

## The one feature to ship first

The **audit bot** (`apps/api/src/features/audit/`). It's your acquisition engine: a coaching-center owner WhatsApps their business name, gets an instant Telugu/English report on what they're losing on Google, and becomes a captured lead. Get this live before building anything else — see `docs/ROADMAP.md`.

## License

Private / proprietary for now. Add a LICENSE file before making the repo public.
