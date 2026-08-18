# 🚀 GrowLokal — Multi-Industry Autonomous AI Marketing Platform for South Indian Local Businesses

[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![Fastify 5](https://img.shields.io/badge/Fastify-5.2-000000?logo=fastify)](https://fastify.io/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7.0-red?logo=redis)](https://redis.io/)
[![i18n Vernacular](https://img.shields.io/badge/Vernacular-Telugu%20|%20Tamil%20|%20Kannada-70BF63)](#-multi-lingual-engine-vernacular-ii8n)

> **GrowLokal** is an AI marketing automation platform for **local businesses across South India** (Telangana, Andhra Pradesh, Tamil Nadu, Karnataka) — any vertical, not one niche.
>
> Operating on **Google Business Profile, WhatsApp Cloud API, Instagram, and Facebook**, GrowLokal automates local lead discovery, review reputation management, and customer enquiry conversion natively in **Telugu, Tamil, Kannada, and English**.

---

## 🌟 Product Overview & Featured Sectors

In South India's major commercial hubs (Ameerpet & Kukatpally in Hyderabad, Benz Circle in Vijayawada, Dwaraka Nagar in Vizag, Jayanagar in Bengaluru), most customers check Google Maps before visiting a local business. GrowLokal works for **any local business type** — the AI content engine is vertical-neutral by design (`profile_context` is freeform per business). Featured sectors with dedicated SEO landing pages (`/city/[cityName]/[vertical]`):

1. 💇 **Salons & Spas**
2. 🏥 **Doctors & Health Clinics**
3. 🍽️ **Restaurants & Cafes**
4. 🏋️ **Gyms & Fitness Centres**
5. 🚗 **Car Garages & Mechanics**
6. 🎂 **Bakers & Cake Shops**
7. ✈️ **Tours & Travel Agencies**
8. 🔧 **Handyman & Repair Services**

(Coaching centers, clinics, salons, restaurants, real estate, and other verticals are all supported at the data layer — this list reflects what has dedicated SEO content today, not a hard limit.)

---

## ✨ Key Features & Capabilities

### 🔍 1. Free Google Visibility Audit (Lead Magnet)
- Scores a business's Google Business Profile completeness, review volume/rating, photos, hours, and address (see `apps/api/src/features/audit/scoring.ts`).
- Delivered via a WhatsApp bot conversation (`routes/whatsapp.ts`) or the web audit form — both call the same `runAudit()` service.
- Vernacular summary (Telugu default, Tamil/Kannada/Malayalam/Hindi/English) written by an LLM, with a scripted fallback if the LLM call fails.
- Captures the phone number + business name as a `lead` for follow-up, independent of whether they ever become a paying customer.

### 🤖 2. AI Agents
- **📍 Google Business Profile agent**: generates GBP posts and drafts AI review replies. Publishing requires Google's GBP API approval (an external, applied-for process) — until then, generated content saves as a draft.
- **💬 WhatsApp chat agent**: answers customer questions about a business's services/pricing/hours from its own profile data, replying inside Meta's free 24-hour service window.
- **📸 Social scheduler**: generates Instagram/Facebook captions + hashtags and schedules them to a self-hosted Mixpost instance via a polling worker (`apps/api/src/worker.ts`).
- **📢 WhatsApp campaigns**: broadcast messages to a business's customer list using pre-approved Meta templates, billed against prepaid credits (atomic debit, refunded on send failure).

### 💰 3. ROI Calculators
- `/tools/revenue-roi-calculator` — projects yearly profit from extra customers vs. subscription cost.
- `/tools/google-score-calculator` — instant estimate, then a real Google-visibility score delivered via the same audit engine as the homepage form.

### 🌐 4. Optional Website Add-On
- One-time add-on for businesses without a website: a custom-built multi-page site with services, photos, and a WhatsApp enquiry form (separate from the auto-generated booking microsite included in paid plans — see below).

### 📄 5. Auto-Generated Booking Microsite
- Every subscribed business gets a public page (`/c/[businessId]`) with services, pricing, a `wa.me` enquiry link, and a UPI payment deep link — no separate website builder required.

### 📜 6. Legal & Trust Pages
- `/terms`, `/privacy`, `/refund` (7-day money-back guarantee on any paid plan).

---

## 💳 Pricing

| Plan | Price | Notes |
|---|---|---|
| **Free** | ₹0 | Instant Google visibility audit + competitor benchmark |
| **Starter** | ₹999/mo (₹799/mo annual) | Weekly GBP posts, 24/7 WhatsApp responder |
| **Growth** ⭐ | ₹2,499/mo (₹1,999/mo annual) | + review replies, Instagram/FB scheduler, booking microsite, campaigns |
| **Pro** | ₹4,999/mo (₹3,999/mo annual) | + multi-branch support, priority support |

Prices are defined in one place — `apps/api/src/config.ts` (`PRICE_*_PAISE`) — and mirrored on the landing page's pricing section and the legal pages. Keep all three in sync if you change pricing.

---

## 🛠️ Architecture (Vercel + Dedicated VPS)

```mermaid
flowchart TD
    User["Local Business Owner<br/>(Web / WhatsApp)"]
    CF["Cloudflare DNS & WAF<br/>growlokal.com"]
    Vercel["Vercel Edge CDN (Frontend)<br/>app.growlokal.com"]
    VPS["Dedicated VPS<br/>api.growlokal.com"]
    Fastify["Fastify 5 API<br/>(:3000)"]
    PG[("PostgreSQL 16<br/>source of truth")]
    Redis[("Redis<br/>WhatsApp chat-session state,<br/>GBP token cache")]
    Worker["Polling worker<br/>(social post scheduler)"]
    Gemini["Gemini 2.0/2.5 Flash<br/>(vernacular AI content)"]
    WhatsApp["Meta WhatsApp Cloud API"]

    User -->|Visits UI| CF --> Vercel
    Vercel -->|JSON API calls| CF --> VPS --> Fastify
    User -->|WhatsApp message| WhatsApp --> VPS --> Fastify
    Fastify --> PG
    Fastify --> Redis
    Fastify --> Gemini
    Fastify --> WhatsApp
    Worker --> PG
    Worker -.->|Mixpost API| Fastify
```

**What Redis is actually used for today:** WhatsApp conversation state (24h TTL, so a stale chat just resets rather than getting stuck) and a cached GBP OAuth access token (~50min TTL). It is not a job queue — the social-post scheduler (`worker.ts`) is a simple `setInterval` poller by design (see the file's own comment on when to graduate to a real queue like BullMQ).

### VPS resource allocation (`infra/docker-compose.prod.yml`, sized for a 2 vCPU / 8 GB RAM box)
- **Frontend**: 100% offloaded to Vercel — 0 GB VPS RAM.
- **PostgreSQL 16**: 3.5 GB RAM limit.
- **Fastify 5 API**: 2.0 GB RAM limit.
- **Redis**: 1.5 GB RAM limit (`maxmemory-policy volatile-lru`).
- **Caddy** (automatic HTTPS reverse proxy): 0.5 GB RAM limit.

---

## 💰 LLM Cost

Default provider is Gemini (`LLM_PROVIDER=gemini` in `config.ts`), with Anthropic, OpenRouter, and a local Ollama fallback also supported:
- **Cheap tier** (`gemini-2.0-flash-lite`): bulk content drafts (social captions).
- **Quality tier** (`gemini-2.5-flash`): customer-facing text (audit summaries, WhatsApp chat replies, review replies).

At the volumes this product runs at (a handful of posts/replies per business per month), token cost is negligible — well under ₹1/business/month on the cheap tier, and still only tens of rupees/month even entirely on the quality tier. Infra and people costs dominate, not LLM spend.

---

## 🔒 Security & Hardening

- **Rate limiting** (`@fastify/rate-limit`): 100 req/min globally, tightened per sensitive route — see the API table below.
- **Security headers** (`@fastify/helmet`): HSTS, MIME-sniffing prevention, etc. (CSP left to the frontend/CDN layer since this API only serves JSON.)
- **Payload limit**: 1 MB max request body.
- **Webhook signature verification**: both `/webhooks/whatsapp` (Meta's `X-Hub-Signature-256`) and `/webhooks/razorpay` (Razorpay's HMAC signature) are verified over the raw request body before any handler logic runs.
- **Production boot guard**: the API refuses to start if `NODE_ENV=production` and `JWT_SECRET` is still the insecure dev default.
- **Tenant isolation**: every `/api/businesses/:id/*` route requires the caller's JWT to belong to that business (or have `role: admin`).
- **Zod validation** on all request bodies, including phone-number format checks.

---

## ⚡ Performance

- **Google Places lookups cached** in-memory with a 12-hour TTL — repeat audits for the same business skip the external API call entirely.
- **Next.js asset optimization**: gzip/brotli compression, WebP/AVIF images, long-lived static asset caching.
- **Font optimization**: `dns-prefetch`/`preconnect` for Google Fonts with `font-display: swap`.

---

## 💻 Local Development Setup

### Step 1: Clone & install
```bash
git clone <your-repo-url>
cd growlokal
pnpm install
```

### Step 2: Configure environment
```bash
cp .env.example .env
```
At minimum, set:
```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/growlokal
JWT_SECRET=<a long random string — required, not the dev default, once NODE_ENV=production>
PUBLIC_API_URL=http://localhost:3000
```
`GOOGLE_PLACES_API_KEY` and `GEMINI_API_KEY` are optional for a first run — without them, Places returns mock data and the LLM returns stub text, so the app still boots and the audit form still works end-to-end.

### Step 3: Create the database
```bash
psql "$DATABASE_URL" -f db/schema.sql
psql "$DATABASE_URL" -f db/migrations/002_auth_billing.sql
psql "$DATABASE_URL" -f db/migrations/003_mixpost_and_campaigns.sql
psql "$DATABASE_URL" -f db/migrations/004_gbp_refresh_token.sql
psql "$DATABASE_URL" -f db/migrations/005_renewal_reminders.sql
psql "$DATABASE_URL" -f db/seed.sql   # optional demo data
```

### Step 4: Start dev servers
```bash
pnpm --filter @growlokal/api dev     # API  → http://localhost:3000
pnpm --filter @growlokal/web dev     # Web  → http://localhost:3001
```

**Full setup, deploy steps, and the DNS/Vercel plan → [`IMPLEMENTATION.md`](IMPLEMENTATION.md).**

---

## 🚢 Production VPS Deployment (Docker Compose + Caddy)

```bash
# 1. Clone on the VPS
git clone <your-repo-url> /opt/growlokal
cd /opt/growlokal

# 2. Configure production .env (PG_PASSWORD, JWT_SECRET, WHATSAPP_APP_SECRET,
#    GEMINI_API_KEY, etc. are all required — the compose file fails fast if unset)
cp .env.example .env

# 3. Launch
docker compose -f infra/docker-compose.prod.yml up -d --build
```

Boots: PostgreSQL 16, Redis 7, the Fastify API (multi-stage Docker build), and Caddy (automatic HTTPS for `api.growlokal.com`). The web dashboard deploys separately to **Vercel** (Root Directory = `apps/web`) — see `IMPLEMENTATION.md` for the DNS split between Cloudflare (owns DNS) and Vercel (reached via a CNAME).

---

## 📡 API Endpoint Reference

| Method | Endpoint | Description | Rate limit |
|---|---|---|---|
| `GET` | `/` | API status | 100/min (global) |
| `GET` | `/health` | API + Postgres health check | 100/min |
| `GET` | `/api/audit/autocomplete?q=` | Google Places business-name autocomplete | 20/min |
| `POST` | `/api/audit/run` | Runs the free Google visibility audit | 5/min |
| `POST` | `/api/auth/request-otp` | Sends a phone OTP | 5/min |
| `POST` | `/api/auth/verify-otp` | Verifies OTP, issues a JWT | 10/min |
| `GET` | `/api/auth/me` | Current user's claims | Authenticated |
| `PUT` | `/api/businesses/:id` | Onboarding — sets profile, Mixpost accounts, GBP refresh token | Authenticated (own business) |
| `GET` | `/api/public/business/:id` | Public booking-microsite data | Public |
| `GET` | `/api/businesses/:id/roi` | Monthly enquiries/demos/leads | Authenticated |
| `GET` | `/api/businesses/:id/wallet` | WhatsApp prepaid credit balance | Authenticated |
| `POST` | `/api/businesses/:id/gbp/post` | Generate (and, if approved, publish) a GBP post | Authenticated |
| `POST` | `/api/businesses/:id/reviews/draft-replies` | AI-draft replies to stored reviews | Authenticated |
| `POST` | `/api/businesses/:id/social/schedule` | Generate + schedule an Instagram/FB post | Authenticated |
| `POST` | `/api/businesses/:id/campaigns` | Create a WhatsApp campaign draft | Authenticated |
| `POST` | `/api/businesses/:id/campaigns/:cid/send` | Send a campaign to its persisted recipients | Authenticated |
| `POST` | `/api/businesses/:id/billing/subscribe` | Create a Razorpay subscription checkout | Authenticated |
| `GET` | `/api/leads?stage=&mine=` | List leads (sales) | Authenticated |
| `PATCH` | `/api/leads/:id/assign` | Assign a lead (defaults to "assign to me") | Authenticated |
| `GET`/`POST` | `/webhooks/whatsapp` | Meta verification handshake / inbound messages | Signature-verified |
| `POST` | `/webhooks/razorpay` | Subscription payment events | Signature-verified |

---

## 📄 License

Proprietary — All rights reserved © 2026 **GrowLokal Technologies**.
