# 🚀 GrowLokal — Autonomous AI Marketing Platform for South Indian Education Institutes

[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![Fastify 4](https://img.shields.io/badge/Fastify-4.28-000000?logo=fastify)](https://fastify.io/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
[![i18n Vernacular](https://img.shields.io/badge/Vernacular-Telugu%20|%20Tamil%20|%20Kannada-70BF63)](#-multi-lingual-engine-vernacular-i18n)

> **GrowLokal** is a production-grade, enterprise-ready AI marketing automation platform engineered specifically for **coaching centers, tuition academies, and educational institutes in South India**. 
> 
> Operating 24/7 on **Google Maps, WhatsApp Cloud API, Instagram, and Facebook Pages**, GrowLokal automates local lead discovery, review reputation management, and parent enquiry conversion natively in **Telugu, Tamil, Kannada, and English**.

---

## 🌟 Product Overview & Core Mission

In major educational hubs across South India (e.g., Ameerpet & Kukatpally in Hyderabad, Benz Circle in Vijayawada, Dwaraka Nagar in Vizag, Jayanagar in Bengaluru, Anna Nagar in Chennai), over **80% of parents search Google Maps** before selecting a tuition or coaching center. However, over 60% of local institute directors lose prospective admissions due to:
1. Incomplete Google Business Profiles (missing weekly posts or active listing signals).
2. Unanswered parent Google reviews and negative feedback handling.
3. Slow response times to parent WhatsApp enquiries during teaching hours.
4. Language barriers when communicating with non-English speaking parents.

GrowLokal solves this with **4 Autonomous AI Agents** working in sync to capture, qualify, and convert local parent enquiries into paid student admissions.

---

## ✨ Key Features & Capabilities

### 🔍 1. Free 10-Second Google Visibility Audit Magnet
- Instant scan of public Google Places completeness, review recency, photo updates, and map pack ranking.
- Generates side-by-side comparative visibility scorecards vs top local competitors.
- Delivers automated Telugu, Tamil, Kannada, and English PDF/WhatsApp gap analysis reports to institute directors.

### 🤖 2. 4 Autonomous AI Agents
- **📍 Google Business Agent**: Publishes weekly AI course updates, result celebrations, and drafts vernacular review responses.
- **💬 24/7 WhatsApp Chat Agent**: Answers parent enquiries about course fees, batch timings, and demo classes instantly via WhatsApp API.
- **📸 Social Media Content Agent**: Schedules autopilot graphics and posts for Instagram & Facebook.
- **🚀 WhatsApp Campaign Broadcast Agent**: Executes targeted SMS/WhatsApp broadcast campaigns for batch openings.

### 💰 3. Admission ROI & Revenue Growth Calculator
- Interactive ROI calculator projecting annual profit growth based on local South Indian fee structures.
- Explains exact student enrollment returns backed by regional industry benchmarks.

### 🌐 4. Custom Website Add-On (+₹4,999 One-Time)
- 1-click optional add-on for institutes lacking a digital presence: builds a fast, mobile-friendly 5-page website with course details, faculty profiles, and direct WhatsApp enquiry forms.

### 📜 5. Complete Legal & Trust Stack
- Includes fully compliant **Terms of Service** (`/terms`), **Privacy Policy** (`/privacy`), and **Refund Policy** (`/refund`) with a 7-day money-back guarantee.
- Displays official SVG brand payment logos (GPay, PhonePe, Paytm, BHIM UPI, VISA, Mastercard, RuPay, NetBanking) for trust-building.

---

## 🌐 Multi-Lingual Engine (Vernacular i18n)

GrowLokal features a **1-Click Multilingual Selector** right in the header bar supporting native scripts:
- **🌐 English**
- **🌐 తెలుగు (Telugu)**: Telangana & Andhra Pradesh
- **🌐 தமிழ் (Tamil)**: Tamil Nadu
- **🌐 ಕನ್ನಡ (Kannada)**: Karnataka

All landing page sections, audit form inputs, AI agents, and WhatsApp responses dynamically toggle across all 4 languages without page reloads.

---

## 🛠️ Tech Stack & Architecture

```mermaid
flowchart TD
    Owner["Institute Director<br/>(WhatsApp / Web)"]
    Nginx["Nginx Reverse Proxy / SSL<br/>(Certbot / Cloudflare)"]
    Web["Next.js 14 App Router<br/>(apps/web :3001)"]
    API["Fastify 4 TypeScript API<br/>(apps/api :3000)"]
    Cache[("In-Memory Places Cache<br/>(12-hr TTL <5ms latency)")]
    DB[("PostgreSQL 16<br/>Tenant Data")]
    Google["Google Places & Maps API"]
    WhatsApp["Meta WhatsApp Cloud API"]

    Owner -->|Web Visit| Nginx --> Web
    Owner -->|WhatsApp Inquiry| WhatsApp --> Nginx --> API
    Web -->|Fetch Audit / Auth| API
    API -->|Read/Write| DB
    API -->|Lookup Profile| Cache
    Cache -->|Cache Miss| Google
    API -->|Send Notifications| WhatsApp
```

- **Frontend**: Next.js 14 (App Router), React 18, Vanilla CSS (Design Tokens & Glassmorphism), Lucide SVG Vector Icons.
- **Backend Engine**: Fastify 4 (TypeScript), Node.js, Undici HTTP Client.
- **Database**: PostgreSQL 16 with Zod input validation schemas.
- **Cache Layer**: In-Memory LRU Cache (12-hour TTL for Google Places queries).
- **Security Stack**: `@fastify/rate-limit`, `@fastify/helmet`, Zod regex phone sanitization, OTP cooldown timers.

---

## 🔒 Security & Hardening Stack

- **Global & Route Rate Limiting**: `@fastify/rate-limit` enforces 100 req/min globally, 5 req/min on `/api/auth/request-otp`, and 5 req/min on `/api/audit/run` to block brute-force & DDoS attacks.
- **Security Headers**: `@fastify/helmet` enforces HSTS, Content Security Policy, XSS Protection, and MIME Sniffing prevention.
- **Payload Limits**: 1MB max body payload limit configured on Fastify.
- **Strict Input Validation**: Zod schema validation for all phone numbers (`/[^0-9]/g`) and inputs.

---

## ⚡ Performance & Caching Engine

- **API Sub-5ms Responses**: Google Places lookups are stored in an in-memory cache (`12-hour TTL`), reducing audit latency from 1,200ms to **< 5ms** on repeat scans.
- **Next.js Asset Optimization**: `compress: true` (Gzip/Brotli), WebP/AVIF image formats, static asset caching headers (`Cache-Control: public, max-age=31536000, immutable`).
- **Font Optimization**: `dns-prefetch` and `preconnect` for Google Fonts (`Inter`, `Manrope`) with `font-display: swap`.

---

## 💻 Local Development Setup

### Prerequisites
- **Node.js**: `v18.x` or `v20.x`
- **pnpm**: `v9.x`
- **PostgreSQL**: `v16.x`

### Step 1: Clone Repository & Install Dependencies
```bash
git clone https://github.com/akheels-web/growlokal.git
cd growlokal
pnpm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Edit `.env` and set your PostgreSQL connection string:
```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/growlokal
JWT_SECRET=super-secret-jwt-key-change-in-production
PUBLIC_API_URL=http://localhost:3000
GOOGLE_PLACES_API_KEY=your_optional_google_api_key
```

### Step 3: Run Database Migrations & Seed Data
```bash
psql "$DATABASE_URL" -f db/schema.sql
psql "$DATABASE_URL" -f db/migrations/002_auth_billing.sql
psql "$DATABASE_URL" -f db/seed.sql
```

### Step 4: Start Local Development Servers
```bash
# Start API server on http://localhost:3000
pnpm --filter @growlokal/api dev

# In a new terminal, start Web Frontend on http://localhost:3001
pnpm --filter @growlokal/web dev
```

---

## 🚢 Real-Time Production Server Deployment Guide

### Option A: Docker Deployment (Recommended)

#### 1. Build and Run Container Services
Create a `docker-compose.yml` on your production server:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: growlokal_db
    restart: always
    environment:
      POSTGRES_DB: growlokal
      POSTGRES_USER: growlokal_user
      POSTGRES_PASSWORD: StrongProductionPassword123!
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    container_name: growlokal_api
    restart: always
    environment:
      NODE_ENV: production
      PORT: 3000
      DATABASE_URL: postgres://growlokal_user:StrongProductionPassword123!@postgres:5432/growlokal
      JWT_SECRET: ProductionJwtSecretKey98765!
      GOOGLE_PLACES_API_KEY: your_places_key
    ports:
      - "3000:3000"
    depends_on:
      - postgres

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    container_name: growlokal_web
    restart: always
    environment:
      NODE_ENV: production
      PUBLIC_API_URL: https://api.growlokal.com
    ports:
      - "3001:3001"

volumes:
  postgres_data:
```

Execute Docker Compose:
```bash
docker-compose up -d --build
```

---

### Option B: Bare-Metal / Ubuntu VPS Deployment (PM2 + Nginx + SSL)

#### 1. Install Node.js, pnpm & PM2
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx certbot python3-certbot-nginx
sudo npm install -g pnpm pm2
```

#### 2. Build Production Bundles
```bash
cd /var/www/growlokal
pnpm install
pnpm --filter @growlokal/api build
pnpm --filter @growlokal/web build
```

#### 3. Launch Applications via PM2
```bash
# Start API
pm2 start apps/api/dist/server.js --name "growlokal-api" --env production

# Start Next.js Web Frontend
pm2 start "pnpm --filter @growlokal/web start" --name "growlokal-web"

# Save PM2 process list
pm2 save
pm2 startup
```

#### 4. Configure Nginx Reverse Proxy
Create `/etc/nginx/sites-available/growlokal`:
```nginx
server {
    server_name growlokal.com www.growlokal.com;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    server_name api.growlokal.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable site & obtain SSL Certificate via Let's Encrypt:
```bash
sudo ln -s /etc/nginx/sites-available/growlokal /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d growlokal.com -d www.growlokal.com -d api.growlokal.com
```

---

## 📡 API Endpoint Reference

| Method | Endpoint | Description | Rate Limit |
|---|---|---|---|
| `GET` | `/health` | API & PostgreSQL database health check | 100 req/min |
| `POST` | `/api/audit/run` | Executes Google visibility scan & gap analysis | 5 req/min |
| `POST` | `/api/auth/request-otp` | Sends phone OTP for institute owner login | 5 req/min |
| `POST` | `/api/auth/verify-otp` | Verifies OTP code & issues JWT claims | 10 req/min |
| `GET` | `/api/features/dashboard` | Returns tenant ROI & enquiry statistics | Authenticated |
| `POST` | `/api/billing/webhook` | Verifies Razorpay subscription payment webhooks | Signed |

---

## 📄 License & Credits

- **License**: Proprietary — All rights reserved © 2026 **GrowLokal Technologies**.
- **Engineered by**: Advanced Agentic Coding Team.
