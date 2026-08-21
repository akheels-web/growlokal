# GrowLokal Project Memory

## Architecture & CMS Setup (August 2026)

### 1. Headless CMS: TinaCMS
- **Location:** `apps/web/tina/config.ts`
- **Content Directory:** `apps/web/content/`
- **Admin Dashboard:** `/admin` (`apps/web/src/app/admin/[[...index]]/page.tsx`)
- **Hosting Strategy:** 100% Vercel Free Tier (Git-backed) with Tina Cloud free tier for production authentication.
- **Content Architecture:**
  - `content/global/settings.json`: Site branding, Header Logo, Footer Logo, 32x32 Favicon, Support Helpline, WhatsApp number, SEO Meta.
  - `content/navigation/header.json`: Header navbar links, CTA button, Language options.
  - `content/navigation/footer.json`: Footer columns, Industry solutions, Top locations, Legal links.
  - `content/pages/home.json`: Complete Homepage sections (Hero, Stats, Tools, Pain Points, AI Agents, 30-Day Results, Pricing, FAQ).
  - `content/posts/`: SEO Playbooks and Blog articles (.mdx).
  - `content/industries/`: Niche solutions (Clinics, Salons, Bakeries, etc.).
- **Helper Library:** `apps/web/src/lib/tina.ts` provides zero-downtime type-safe content loaders.

### 2. Brand Visual Design System
- **Electric Blue:** `#4F46E5` (Primary Interactive)
- **Vibrant Violet:** `#7C3AED` (AI Core & Glows)
- **Bright Orange:** `#F97316` (Primary CTA & Attention)
- **Amber / Gold:** `#FBBF24` (Highlights & Badges)
- **Midnight Navy:** `#0B1020` (Dark Contrast & Footer)
- **Soft White:** `#F8FAFC` (Page Backgrounds)
- **Green Policy:** No green in primary UI/metrics (replaced by Orange/Amber/Electric Blue).
- **Logo Dimensions:**
  - Header Logo: `44px` height (`max-height: 48px`, ~150px width).
  - Footer Logo: `52px` height (`max-height: 58px`, ~177px width).
  - Favicon: True 1:1 square icon mark (`32x32`, `48x48`, `180x180` in `/favicon.png`, `/favicon-48x48.png`, `/apple-touch-icon.png`) centered with zero horizontal stretching or aspect ratio distortion.
- **Iconography Standard:**
  - Standardized on `lucide-react` SVG icons across all industry/vertical landing pages, pain point roadblocks, AI agent use cases, keywords, and city matrix cross-links (zero raw emojis in UI cards).
- **Footer Architecture:**
  - **Full Rich 5-Column Dark Footer (`<Footer />`):** Used on main content/discovery pages (`/`, `/industry/[slug]`, `/city/[cityName]`, `/city/[cityName]/[vertical]`, `/blog`, `/terms`, `/privacy`, `/refund`, `/resources/whatsapp-kit`).
  - **Single-Liner Dark Footer:** Used on focused interactive tools and auth pages (`/free-gbp-report`, `/login`, `/book-free-demo`, `/tools/google-score-calculator`, `/tools/revenue-roi-calculator`).
