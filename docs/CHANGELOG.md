# Changelog

## Build session 31 — Layout Polish, Hero Spacing, Results Banner Gradient & Centralized Brand Logo

- **Hero Clearance & Header Spacing**:
  - Increased hero section top padding to `116px` across [`page.tsx`](file:///e:/Github/grow/growlokal/apps/web/src/app/page.tsx) and [`globals.css`](file:///e:/Github/grow/growlokal/apps/web/src/app/globals.css) so the hero visual product card sits completely below the fixed header with balanced breathing room.
- **Vertical Alignment in "Seamlessly Integrated With"**:
  - Removed unbalanced top padding from `.platforms-section` and unified flex alignment across desktop and mobile so the title label and platform pill badges are vertically centered within the strip.
- **Results Bottom Banner Gradient & Hover Polish**:
  - Applied the brand gradient (`linear-gradient(135deg, #175fab 0%, #3be06d 100%)`) to `.results-bottom-cta` ("Ready to see your business score jump from 23 to 87?").
  - Fixed the `Audit My Business Free` button hover state to high-contrast white background with dark black text (`#0B1020`) so text never mixes with the background.
- **Removed Pricing Add-On Section**:
  - Completely removed the "Custom Local Business Website Creation" add-on strip below the pricing grid.
- **Centralized Brand Logo Component & Global Link Placeholder**:
  - Built [`BrandLogo.tsx`](file:///e:/Github/grow/growlokal/apps/web/src/components/BrandLogo.tsx) exporting `BRAND_CONFIG.logoUrl`.
  - Linked `BrandLogo` in the main Navbar (desktop & mobile drawer), landing page footer, Free GBP Report header, Login header, Industry landing page footer, and Dashboard header.
  - Adding a logo link in `BRAND_CONFIG.logoUrl` now reflects across all headers and footers across the site.
- **Build Verification**:
  - `pnpm --filter @growlokal/web build` passed with **0 errors**.

## Build session 30 — Complete Enterprise Color Unification (#175fab & #3be06d) Across All Pages

- **Brand Color Palette Consolidation**:
  - Strictly unified all buttons, badges, banners, slider tracks, progress loaders, checkmarks, circuit streams, and accent borders across the entire web application to use only:
    - **Sapphire Blue**: `#175fab`
    - **Mint Green**: `#3be06d`
    - **Brand Gradient**: `linear-gradient(135deg, #175fab 0%, #3be06d 100%)`
    - **Text**: High contrast `#0B1020` / `#111827` for headings and `#475569` / `#64748B` for secondary copy.
- **Pages & Components Updated**:
  - **Landing Page** ([`apps/web/src/app/page.tsx`](file:///e:/Github/grow/growlokal/apps/web/src/app/page.tsx)): Pain point icons, transformation steps, circuit SVG animations, results checkmarks, annual pricing discount badges, optional add-on badge, contact desk icons, and WhatsApp action buttons.
  - **Free GBP Report Funnel** ([`apps/web/src/app/free-gbp-report/page.tsx`](file:///e:/Github/grow/growlokal/apps/web/src/app/free-gbp-report/page.tsx)): Brand logo, step numbering badges, autocomplete item category chips, and bottom social proof stats.
  - **Book Free Demo Funnel** ([`apps/web/src/app/book-free-demo/page.tsx`](file:///e:/Github/grow/growlokal/apps/web/src/app/book-free-demo/page.tsx)): Business autocomplete suggestion chips and budget selector cards.
  - **Revenue ROI Calculator** ([`apps/web/src/app/tools/revenue-roi-calculator/page.tsx`](file:///e:/Github/grow/growlokal/apps/web/src/app/tools/revenue-roi-calculator/page.tsx)): Header pill badge, slider handles & tracks, profit metric numbers, and CTA button.
  - **Google Score Calculator** ([`apps/web/src/app/tools/google-score-calculator/page.tsx`](file:///e:/Github/grow/growlokal/apps/web/src/app/tools/google-score-calculator/page.tsx)): Header eyebrow badge, search inputs & autocomplete dropdowns, live analysis progress loader & progress bar, competitor benchmark scorecard, and WhatsApp delivery confirmation banner.
  - **Industry Verticals** ([`apps/web/src/app/industry/[slug]/page.tsx`](file:///e:/Github/grow/growlokal/apps/web/src/app/industry/[slug]/page.tsx)): Top stats, pain point solution pills, agent use case badges & checkmarks, real customer case study badge & founder avatar, FAQ accordion icons, and audit lead form.
  - **City & Programmatic SEO Pages** ([`apps/web/src/app/city/[cityName]/page.tsx`](file:///e:/Github/grow/growlokal/apps/web/src/app/city/[cityName]/page.tsx) & [`apps/web/src/app/city/[cityName]/[vertical]/page.tsx`](file:///e:/Github/grow/growlokal/apps/web/src/app/city/[cityName]/[vertical]/page.tsx)): Local search statistics badges, category chips, and 30-day blueprint steps.
  - **Blog & Articles** ([`apps/web/src/app/blog/page.tsx`](file:///e:/Github/grow/growlokal/apps/web/src/app/blog/page.tsx) & [`apps/web/src/app/blog/[slug]/page.tsx`](file:///e:/Github/grow/growlokal/apps/web/src/app/blog/[slug]/page.tsx)): Knowledge hub header badge, featured guide tag, article category chips, key takeaways box with checkmarks, and playbook links.
  - **Legal Pages** ([`apps/web/src/app/privacy/page.tsx`](file:///e:/Github/grow/growlokal/apps/web/src/app/privacy/page.tsx), [`apps/web/src/app/terms/page.tsx`](file:///e:/Github/grow/growlokal/apps/web/src/app/terms/page.tsx), [`apps/web/src/app/refund/page.tsx`](file:///e:/Github/grow/growlokal/apps/web/src/app/refund/page.tsx)): Section headers, trust badges, and inline legal links.
  - **Authentication & Dashboard** ([`apps/web/src/app/login/page.tsx`](file:///e:/Github/grow/growlokal/apps/web/src/app/login/page.tsx), [`apps/web/src/app/dashboard/[businessId]/page.tsx`](file:///e:/Github/grow/growlokal/apps/web/src/app/dashboard/[businessId]/page.tsx), [`apps/web/src/app/onboarding/[businessId]/page.tsx`](file:///e:/Github/grow/growlokal/apps/web/src/app/onboarding/[businessId]/page.tsx)): Login hero badges & feature icons, navigation brand logo, and onboarding form CTAs.
  - **Global Stylesheet** ([`apps/web/src/app/globals.css`](file:///e:/Github/grow/growlokal/apps/web/src/app/globals.css)): Hero text accent gradient, live pulse dots, floating widget toast, footer branding & links, pricing toggle switch & savings badge, and showcase cards.
- **Build Verification**:
  - `pnpm --filter @growlokal/web build` passed with **0 errors**.
  - Production server running and verified in browser.

## Build session 29 — Dynamic Sitemap, Robots.txt, LLMs.txt & Complete SEO Suite

- **Dynamic Sitemap Generation** ([`apps/web/src/app/sitemap.ts`](file:///e:/Github/grow/growlokal/apps/web/src/app/sitemap.ts)):
  - Built typed Next.js App Router dynamic sitemap automatically generating `/sitemap.xml`.
  - Automatically indexes all core static routes, all 11+ industry verticals (`/industry/[slug]`), all South Indian cities (`/city/[cityName]`), all programmatic city x industry combinations (`/city/[cityName]/[vertical]`), and all blog posts (`/blog/[slug]`).
  - Automatically updates whenever new verticals, cities, or blog articles are added.
- **Dynamic Robots.txt Configuration** ([`apps/web/src/app/robots.ts`](file:///e:/Github/grow/growlokal/apps/web/src/app/robots.ts)):
  - Built typed Next.js App Router dynamic `robots.txt` generator with granular rules for Googlebot, Bingbot, GPTBot, ClaudeBot, and PerplexityBot.
  - Allows public crawling of landing pages, funnels, tools, city pages, industry hubs, and blogs while protecting private dashboard and API endpoints.
  - Automatically links to `https://growlokal.com/sitemap.xml`.
- **LLM Search Engine Standard** ([`apps/web/public/llms.txt`](file:///e:/Github/grow/growlokal/apps/web/public/llms.txt)):
  - Created `/llms.txt` structured document optimized for Perplexity, ChatGPT Search, Claude, and Google Search AI Overviews.
- **Shared Blog Architecture** ([`apps/web/src/lib/blogData.ts`](file:///e:/Github/grow/growlokal/apps/web/src/lib/blogData.ts)):
  - Centralized article database connecting `/blog`, `/blog/[slug]`, and `sitemap.ts`.
- **Dedicated SEO Layouts & Meta Tags**:
  - Added dedicated metadata layouts for [`/free-gbp-report`](file:///e:/Github/grow/growlokal/apps/web/src/app/free-gbp-report/layout.tsx), [`/book-free-demo`](file:///e:/Github/grow/growlokal/apps/web/src/app/book-free-demo/layout.tsx), and [`/login`](file:///e:/Github/grow/growlokal/apps/web/src/app/login/layout.tsx).
  - Verified all `<img>` tags possess descriptive `alt` tags and proper accessibility attributes.
- **Enterprise Gradient Consistency**:
  - Unified all primary action buttons, tool cards, pricing tiers, and navigation CTAs to use the `#175fab` → `#3be06d` custom GrowLokal enterprise gradient.
- **Build Verification**:
  - `pnpm --filter @growlokal/web build` passed with **0 errors**.

- **Hero Redesign**:
  - Removed the embedded GBP audit form from the hero section (now served exclusively via the dedicated [`/free-gbp-report`](file:///e:/Github/grow/growlokal/apps/web/src/app/free-gbp-report/page.tsx) and [`/book-free-demo`](file:///e:/Github/grow/growlokal/apps/web/src/app/book-free-demo/page.tsx) funnels).
  - Added clean 3D isometric AI platform product graphic (`/images/hero_ai_platform.jpg`) showcasing Google Maps ranking, WhatsApp AI chat, AI neural chip, and local business storefronts.
  - Added high-contrast dual action buttons: `⚡ Get Free GBP Report →` and `💬 Book Free Demo →`.
- **Navbar Streamlining**:
  - Removed language selector from the desktop header and mobile drawer.
  - Streamlined desktop menu to clean minimal items: `How it works`, `AI Agents`, `Pricing`, `Industries`, and `Free GBP Report`.
  - Maintained crisp action buttons: `Sign In` and `Book Free Demo →`.
- **Section Decluttering**:
  - Removed `Ready to Stop Losing Local Customers to Competitors?` section.
  - Removed `Built specifically for your local business` guarantee section.
  - Simplified stats bar: removed the numerical stat counters to retain ONLY the clean **"Seamlessly Integrated With"** platform badge bar (Google Maps, WhatsApp, Instagram, Facebook).
- **Aesthetic Refinement**:
  - Replaced dark gradients with pure white background (`#FFFFFF`) and airy pastel washes (`#FAF8FF`, `#EFF0FF`).
  - Enhanced contrast on all text, badges, and integration pills.
- **Build Verification**:
  - `pnpm --filter @growlokal/web build` passed with **0 errors**.

- **Dedicated Demo Booking Funnel** ([`/book-free-demo`](file:///e:/Github/grow/growlokal/apps/web/src/app/book-free-demo/page.tsx)):
  - Built a 2-column layout inspired by Grexa's high-converting booking format.
  - Left column: 4 core value proposition hooks with emojis (`Rank #1 on Google`, `Never miss a lead on WhatsApp`, `Close high-ticket sales faster`, `Bring customers back automatically`) + 25,000+ South Indian business social proof.
  - Right column: Clean card form featuring real-time business autocomplete, `+91` phone input, and **Monthly Marketing Budget Qualifiers** (`More than ₹5,000`, `₹3,000 - ₹5,000 [Recommended]`, `Less than ₹3,000`).
  - Bottom: Infinite scrolling client logos marquee across Clinics, Salons, Gyms, Restaurants, Interiors, and Solar.
- **Dedicated Free GBP Report Onboarding Funnel** ([`/free-gbp-report`](file:///e:/Github/grow/growlokal/apps/web/src/app/free-gbp-report/page.tsx)):
  - Built a distraction-free shop-style onboarding page with multi-language header dropdown (English, Telugu, Tamil, Kannada).
  - 2-Step interactive audit card (Step 1: Find business on Google, Step 2: WhatsApp number) with instant report trigger.
  - Bottom performance stat grid: 25,000+ Businesses, 30-sec Delivery, 3.8x More Calls, 100% Free.
- **Navigation Integration**:
  - Added **"Free GBP Report"** link to desktop and mobile navigation in [`Navbar.tsx`](file:///e:/Github/grow/growlokal/apps/web/src/components/Navbar.tsx).
  - Linked **"Book Free Demo"** header CTAs directly to `/book-free-demo`.
- **Button Styling Polish**:
  - Removed all neon/glow colored halo shadows across all buttons in `globals.css` and `.tsx` pages for clean, modern matte SaaS elevation.
- **Build Verification**:
  - `pnpm --filter @growlokal/web build` passed with **0 errors**.

- **Case Study Headline & Founder High-Contrast Styling**:
  - Fixed dark text blending on the **"Real South Indian Success Story"** card across all 15 `/industry/[slug]` landing pages.
  - Added explicit `#FFFFFF` high-contrast color to the main client quote headline (`h3`), founder name, and soft high-readability slate blue (`#CBD5E1`) for the business & locality metadata.
- **Build Verification**:
  - `pnpm --filter @growlokal/web build` passed with **0 errors**.

- **Dedicated Chennai Pages & Expanded South Indian Cities**:
  - **Chennai, Tamil Nadu** ([`/city/chennai`](file:///e:/Github/grow/growlokal/apps/web/src/app/city/%5BcityName%5D/page.tsx)) — Covering T. Nagar, Anna Nagar, Velachery, Adyar, Mylapore, Nungambakkam, OMR, Porur, Tambaram, Kilpauk.
  - **Coimbatore, Tamil Nadu** ([`/city/coimbatore`](file:///e:/Github/grow/growlokal/apps/web/src/app/city/%5BcityName%5D/page.tsx)) — RS Puram, Gandhipuram, Peelamedu, Saibaba Colony, Saravanampatti.
  - **Kochi, Kerala** ([`/city/kochi`](file:///e:/Github/grow/growlokal/apps/web/src/app/city/%5BcityName%5D/page.tsx)) — Edappally, Kakkanad, Kaloor, MG Road, Fort Kochi, Vyttila.
  - **Madurai, Mysuru, Warangal, Tirupati, Guntur** added to `CITY_DATA` for complete South Indian market coverage.
- **Combined City + Vertical SEO Pages**:
  - Automatically dynamically generated for all 15 industries across all South Indian hubs (e.g., `/city/chennai/interior-designers`, `/city/chennai/doctors-clinics`, `/city/chennai/real-estate`).
- **Footer Navigation Update**:
  - Expanded **Top Locations** footer column to feature Chennai, Coimbatore, and Kochi alongside Hyderabad, Bengaluru, Vijayawada, and Visakhapatnam.
- **Build Verification**:
  - `pnpm --filter @growlokal/web build` passed with **0 errors**.

- **7 New Business Industry Chiklets & Dedicated Landing Pages**:
  - **Interior Designers & Decorators** (`/industry/interior-designers`) — High-ticket home & commercial turnkey interior client acquisition.
  - **Real Estate Brokers & Agents** (`/industry/real-estate`) — Inbound flat, villa, and commercial lease buyer lead capture.
  - **Solar & Rooftop Solutions** (`/industry/solar-solutions`) — Rooftop solar inquiries, subsidy estimation & survey booking.
  - **CA, Tax & Legal Advisors** (`/industry/tax-legal-services`) — Corporate retainers, GST, ITR, and incorporation compliance clients.
  - **Retail Shops & Boutiques** (`/industry/retail-stores`) — Local footfall drivers, new arrival showcases & WhatsApp VIP broadcasts.
  - **Logistics, Packers & Movers** (`/industry/logistics-packers`) — Direct daily house shifting & intercity transport bookings.
  - **Education & Coaching Institutes** (`/industry/education-coaching`) — Batch enrollment, demo class registration & syllabus delivery.
- **Visual Assets & Avatars**:
  - Generated and integrated 7 custom avatar images (`biz_interior.png`, `biz_realtor.png`, `biz_solar.png`, `biz_tax_legal.png`, `biz_retail.png`, `biz_logistics.png`, `biz_education.png`).
- **Comprehensive Vertical Data**:
  - Added full SEO keywords, localized pain points, 4-agent use cases, case studies, and FAQs for all 7 new verticals in `apps/web/src/lib/verticalData.ts`.
- **Build Verification**:
  - `pnpm --filter @growlokal/web build` passed (0 errors, 20 routes generated).

- **Official Vector Speech Bubble with Tail**:
  - Upgraded all WhatsApp icons across the platform (`WhatsAppOfficialIcon`, `WhatsAppIntegrationIcon`, `WhatsAppCampaignOfficialIcon`, and Score Tool components) to use the official WhatsApp speech bubble path with the iconic bottom-left tail (`M16 2C... L2 30L9.11 28.01...`) and handset.
  - Replaced plain circle backgrounds across AI Agent cards, integration badges, contact support cards, and scorecard delivery forms.
- **Build Verification**:
  - `pnpm --filter @growlokal/web build` passed (0 errors, 20 routes generated).

- **Universal Smart Autocomplete & Dynamic Suggestions**:
  - Connected live async autocomplete query (`/api/audit/autocomplete`) with an extensive South Indian regional business database.
  - Added dynamic fallback generator so suggestions are guaranteed to appear for any custom business query.
- **Multi-Step Live Analysis Progress Loader**:
  - Implemented real-time multi-stage scanning animation with dynamic step descriptions (`🔍 Connecting to Google Maps...`, `📊 Benchmarking reviews...`, `⚡ Calculating visibility score...`) and gradient progress bar (0% ➔ 100%).
- **High-Contrast WhatsApp Action Box Typography**:
  - Fixed dark text mixing with dark card background; set header to crisp pure white (`#FFFFFF`) with official WhatsApp Green icon and soft lavender subtitle (`#E0E7FF`).
- **Send Report Button Hover Fix**:
  - Fixed global `.btn-primary:hover` and button-level hover states to remain bright glowing orange (`#EA580C`) on hover, eliminating black-on-black blending.
- **Build Verification**:
  - `pnpm --filter @growlokal/web build` passed (0 errors, 20 routes generated).

- **Official WhatsApp Logo on Contact Cards**:
  - Updated the "WhatsApp Support Desk" card and the contact submit button to use the official green WhatsApp brand icon (`#25D366`) with green accent borders.
- **Official WhatsApp Logo on AI Agent Cards**:
  - Updated `WhatsAppOfficialIcon` to use official WhatsApp green (`#25D366`) across agent cards, transformation flows, and badges.
- **Official Brand Logos in "Seamlessly Integrated With" Section**:
  - Replaced unicode emojis with official full-color SVG brand components:
    - **Google Maps & Search**: Official multi-color Google Maps Pin (`#EA4335`, `#4285F4`, `#FBBC04`, `#34A853`).
    - **WhatsApp Meta Business**: Official WhatsApp Green icon (`#25D366`).
    - **Instagram Business**: Official Instagram gradient rounded app icon.
    - **Facebook Pages**: Official Facebook Blue icon (`#1877F2`).
- **Build Verification**:
  - `pnpm --filter @growlokal/web build` passed (0 errors, 20 routes generated).

- **White Background for Google Business Search Field**:
  - Styled `.form-input` and `.input-with-icon` with a clean white/light background (`#f8fafc` / `#ffffff`), slate placeholder (`#64748b`), and dark slate text (`#0B1020`) to match the phone input field.
- **Interactive Growth Tools Button Hovers**:
  - Enhanced `.btn-growth-tool-teal` (`Spy On Competitor Score ⚡ →`) with a high-contrast Electric Blue hover transformation (`#4F46E5` + glowing shadow).
  - Enhanced `.btn-growth-tool-green` (`Calculate My Business Profit 💰 →`) with bold white text on orange background (`#FFFFFF`) and glowing orange lift on hover (`box-shadow: var(--shadow-orange-glow-lg)`).
- **Official Green WhatsApp Floating Icon**:
  - Updated `.contact_icon` and `.floating_btn:hover` to use official WhatsApp green (`#25D366` in normal state, `#20BA5A` on hover with matching green text pill).
- **Build Verification**:
  - `pnpm --filter @growlokal/web build` passed (0 errors, 20 routes generated).

- **Route & Page Renaming**:
  - Renamed `/tools/admission-roi-calculator` to `/tools/revenue-roi-calculator`.
  - Updated all navigation links (`Navbar.tsx`, `page.tsx`, `Breadcrumbs.tsx`, `README.md`, `FLOW.md`, `DECISIONS.md`).
- **Generalized Blog Playbook Slugs & Titles**:
  - Renamed `top-7-reasons-coaching-centers-lose-admissions` ➔ `top-7-reasons-local-businesses-lose-customers`.
  - Renamed `whatsapp-marketing-strategy-for-coaching-centers` ➔ `whatsapp-marketing-strategy-for-local-businesses`.
- **Generalized Onboarding & Microsite Schemas**:
  - In `/onboarding/[businessId]`, modernized form state & fields from `courses`/`fees`/`faculty`/`timings` to `services`/`pricing`/`highlights`/`operatingHours` (retaining backward-compatible persistence for both keys).
  - In `/c/[businessId]`, generalized sections to "Services & Offerings", "Pricing & Packages", "Highlights & Specialties", and "Working & Operating Hours".
- **Dashboard & Campaigns Placeholder Cleanup**:
  - Replaced coaching-specific placeholders in `/dashboard/[businessId]` and `/dashboard/[businessId]/campaigns` with generic local business promotions.
- **Build & Verification**:
  - `pnpm --filter @growlokal/api typecheck` passed (0 errors).
  - `pnpm --filter @growlokal/api test` passed (4/4 tests).
  - `pnpm --filter @growlokal/web build` passed (0 errors, all 20 routes generated).

- **High-End AI Startup Visual Identity**:
  - Implemented the unified color tokens: Electric Blue (`#4F46E5`), Vibrant Violet (`#7C3AED`), Bright Orange (`#F97316`), Amber (`#FBBF24`), Midnight Navy (`#0B1020`), Soft White (`#F8FAFC`), Pale Indigo (`#EEF2FF`), and Deep Slate (`#111827`).
  - Enforced zero-green constraint across primary UI, replacing ROI metrics, positive stats, badges, and checkmarks with Orange, Amber, or Electric Blue.
- **Codebase Brand Cleanup**:
  - Replaced all occurrences of `grexa` with `growlokal` across code, components, classes, and stylesheets (`apps/api/src/clients/mixpost.ts`, `apps/web/src/app/globals.css`, `apps/web/src/app/page.tsx`).
  - Preserved competitive references inside `.md` documentation intact.
- **Build Verification**:
  - `pnpm --filter @growlokal/api typecheck` passed (0 errors).
  - `pnpm --filter @growlokal/api test` passed (4/4 tests).
  - `pnpm --filter @growlokal/web build` passed (0 errors, all 20 routes generated).

## Build session 16 — Senior UI/UX contrast refinement & Dark Navy (#14213D) to Gold (#FCA311) button dynamics

- **Static & Hover Button Architecture**:
  - All primary CTA buttons (Nav `Book Free Demo →`, Audit Form `Get My Free Report →`, Growth Tool links, Pricing Card actions, and Final CTA `Get Free Google Report →`) now use:
    - **Static State**: Solid **Dark Navy Blue (`#14213D`)** with crisp `#FFFFFF` white text (WCAG AAA 14.2:1 contrast) and smooth subtle elevation.
    - **Hover State**: Seamless transition to **Radiant Gold (`#FCA311`)** with bold `#000000` pitch black text (WCAG AAA 11.5:1 contrast) and a refined `-2px` lift with natural warm ambient glow.
- **High-Contrast Text System**:
  - Headings (`h1`-`h6`) are 100% pure **Black (`#000000`)** for maximum authority and readability.
  - Body copy & descriptions use deep charcoal/slate (`#1E293B` and `#334155`), eliminating washed-out or low-contrast text.
  - Eyebrows on light surfaces use warm bronze pills (`#FEF3C7` background with `#92400E` / `#B45309` text) with 7.5:1+ AAA contrast.
- **Pricing Grid Color Harmonization**:
  - Redesigned the featured "Growth" pricing card from legacy indigo to deep **Midnight Navy (`#14213D` ➔ `#0A1124`)** with **Gold (`#FCA311`)** ribbon badge and checkmarks.
  - All standard plan buttons use `#14213D` (Dark Navy) static with `#FCA311` (Gold) hover.
- **Build Verification**: Next.js production build (`next build`) succeeded with 0 errors.

## Build session 15 — Black and Gold Elegance luxury design system ($1M look)

- **Redesigned Complete Design System with Luxury Palette**:
  - Implemented the user-requested palette:
    - **White**: `#FFFFFF`
    - **Light Gray**: `#E5E5E5` (and soft `#F8F9FA` card surfaces)
    - **Gold / Warm Amber**: `#FCA311` (with rich `#FFB733` highlight and `#E59200` hover)
    - **Dark Navy Blue**: `#14213D` (and deep `#0A1124` velvet tone)
    - **Obsidian Black**: `#000000`
- **Eliminated Artificial AI Glows**:
  - Replaced exaggerated neon gradients with clean, natural, human-crafted micro-interactions.
  - Buttons now use natural font-weights (700/600), crisp high-contrast text (`#000000` on radiant gold or `#FFFFFF` on deep navy), and refined 0.2s cubic-bezier lifts with organic subtle box shadows.
- **Section-by-Section Luxury Polish**:
  - **Header & Navigation**: Crisp white glassmorphic header with `#E5E5E5` border, Obsidian & Gold logo (`Grow`#000000`Lokal`#FCA311), Dark Navy links with Gold hover indicators, and a solid Gold luxury CTA button (`Book Free Demo →`).
  - **Hero & Audit Form**: Refined dot grid, Gold accent gradient on title keywords, clean input fields with Gold focus rings, and a high-contrast Gold action button (`Get My Free Report →`).
  - **High-Impact Stats Bar**: Deep Midnight Navy (`#14213D`) to Obsidian (`#0A1124`) gradient with radiant Gold stat numbers and clean white typography.
  - **AI Agent Cards & Shared Brain**: Pure White and Midnight Navy cards with refined borders and Gold/Navy tags.
  - **Final CTA Section**: Obsidian Black background with a Midnight Navy 3D card, live specialist badges in frosted glass with Gold accents, and natural Gold primary CTA (`Get Free Google Report →`) paired with a clean White/Navy outline button.
  - **Footer**: Obsidian Black canvas with Midnight Navy dividing lines, Gold hover states, and official SVG payment icons.
- **Build Verification**: 100% clean Next.js build (`pnpm --filter web build` exit code 0).

## Build session 14 — Crazy modern interactive final CTA section

- **Interactive 2-Column Glassmorphic Final CTA**:
  - Replaced the plain centered text CTA with an ultra-modern 3D glassmorphic card with ambient glow orbs (`#2E9AA6`, `#70BF63`, `#F59E0B`).
  - **Left Column (Visual Specialist & Live Chat Persona)**:
    - Photorealistic South Indian marketing specialist holding a laptop with business growth analytics.
    - Live Online status pill (`⚡ Growth Specialist Online • Telugu • Tamil • Kannada • English`).
    - Verified rating badge (`⭐ 4.9/5 • 1,200+ Audits Done`).
    - Floating glassmorphic WhatsApp micro-chat bubble with zero-setup-fee value prop.
  - **Right Column (Value Proposition & High-Contrast Buttons)**:
    - High-impact headline & subheadline focused on overtaking local competitors on Google Search & Maps.
    - 3 advantage badges with custom icon badges (`30-Sec Google Score`, `Vernacular AI Autopilot`, `7-Day Money-Back Guarantee`).
    - **Primary Button ("Get Free Google Report →")**: High-contrast, glowing emerald gradient (`#10b981` ➔ `#047857`) that never mixes with the background on hover (`#34d399` hover with luminous shadow).
    - **Secondary Button ("Book Free Demo on WhatsApp")**: Glassmorphic WhatsApp green button with official icon.
    - Micro trust reassurance strip (`No credit card required`, `Instant WhatsApp report`, `100% private & secure`).
- **Build Verification**: Verified 100% clean Next.js production build (`pnpm --filter web build` exit code 0).

## Build session 13 — Official brand icons & modern Lucide icon system

- **Official Brand SVG Icons for AI Agent Cards**:
  - **Google Leads Agent** — official Google Business Profile 4-color vector SVG icon (`#4285F4`, `#EA4335`, `#FBBC05`, `#34A853`).
  - **WhatsApp Chat Agent** — official circular WhatsApp brand badge with crisp white handset SVG.
  - **Social Media Agent** — official multi-stop gradient Instagram camera app icon.
  - **Campaign Agent** — official emerald green WhatsApp broadcast megaphone SVG.
- **Modern Icon Library Integration (`lucide-react`)**:
  - Replaced all system emojis with modern, crisp vector icons across feature bullets, pain points, steps, and growth tool cards.
  - Features styled with dedicated tinted icon containers matching each agent's theme (`BarChart3`, `FileEdit`, `Star`, `MapPin`, `Languages`, `MessageCircle`, `Globe`, `UserCheck`, `Send`, `Headphones`, `Camera`, `Calendar`, `Sparkles`, `Clock`, `Target`, `Megaphone`, `Gift`, `CreditCard`, `TrendingUp`, `Zap`).
  - Pain points and 3-step workflow upgraded with `Search`, `Star`, `Share2`, `Building2`, `Gauge`, `Rocket`.
- **Build Verification**: Verified 100% clean Next.js production build (`pnpm run build` exits 0 with all 20 routes generated).

## Build session 12 — Shared Brain & AI Agents GPU-accelerated animations

- **60 FPS zero-dependency CSS/SVG animations for Shared Brain section (`#agents`)**:
  - **Dynamic Circuit Data Streams**: Integrated SVG gradients (`url(#grad-circuit-google)`, `url(#grad-circuit-whatsapp)`, etc.) with high-performance `stroke-dashoffset` GPU animation (`@keyframes circuit-flow`) illustrating real-time data packets flowing from all 4 AI agents into the central convergence point and high-speed memory highway.
  - **Central Convergence Radar Waves**: Added expanding multi-tier radar wave ring animations (`.circuit-radar-wave`, `@keyframes circuit-radar-ping`) and pulsing core node where all agent data streams unite.
  - **Data Intelligence Engine Ambient Effects**: Built dual counter-rotating orbital dashed rings (`.brain-orbit-ring`, `.brain-orbit-ring--rev`), ambient breathing gradient aura (`.brain-ambient-glow`), hovering floating brain emoji, gleaming `AI` chip badge, and a "Realtime Memory Syncing" live status pill.
  - **Live Autopilot Status Badges**: Added pulsating green avatar status indicators and live activity tags on each agent card (`Live Autopilot`, `Instant 24/7`, `Auto-Scheduler`, `Vernacular AI`).
  - **Performance & Page Speed**: 0 KB external JavaScript added, pure CSS keyframes utilizing hardware-accelerated transforms and opacity, with automatic graceful fallback for users with `prefers-reduced-motion`.
  - **Build Verification**: Fixed duplicate CSS rule selector in `globals.css` and verified 100% clean production build (`pnpm run build` exits 0 with all 20 routes generated).

## Build session 11 — Mobile & tablet responsiveness & contact section

- **Dedicated responsive Contact Section (`#contact`)** — created a full 2-column contact section on the homepage with an interactive enquiry form (Name, Business Name, WhatsApp Number, Custom Goal/Query textarea) that automatically formats and forwards messages to WhatsApp support with one tap, plus right-hand support cards (Fastest Response WhatsApp Desk `+91 98765 43210`, Mon–Sat Helpline `+91 (040) 4892-3100`, and Hyderabad Headquarters office address).
- **Responsive layout overhaul for mobile (<640px) and tablet (768px–1024px)**:
  - Replaced inline grid styles with responsive CSS classes (`.growth-tools-grid`, `.growth-tool-card`, `.calculator-form-grid`, `.calculator-compare-grid`, `.calculator-action-input-row`).
  - Strengthened `.phone-input-group` with flexbox layout, country code prefix, separator divider, and flexible input width to guarantee zero clipping on viewports down to 320px width.
  - Resolved duplicate old contact component definitions and ensured seamless 1-column stacking for Growth Tools, 30-Day Results, Pricing, and Contact sections on mobile and tablet.
  - Formatted footer payment logos (`GPay`, `PhonePe`, `Paytm`, `UPI`, `VISA`, `Mastercard`, `RuPay`, `NetBanking`) with centered wrapping on small screens.
- **TypeScript build & link audit fix** — resolved `vertical.title` → `vertical.label` type discrepancy on `/city/[cityName]/[vertical]` and `/industry/[slug]`, added missing `Link` import on `/resources/whatsapp-kit`, and verified 100% clean production build (`pnpm run build` exits 0 with all 20 routes generated).

## Build session 10 — Dedicated industry & sector landing pages

- **Dedicated sector landing pages** — new dynamic `/industry/[slug]` route covering all 8 business verticals (Gyms, Clinics, Bakeries, Salons, Restaurants, Garages, Travel Agencies, Handyman Services). Each page features sector-specific hero headlines, growth stats, 3 core local pain points with AI fixes, customized breakdowns for all 4 AI agents, real South Indian customer case study with before/after metrics, search keywords, localized city cross-links to `/city/[cityName]/[vertical]`, collapsible FAQs, and an instant Google visibility audit form.
- **Enriched `verticalData.ts`** — expanded the shared vertical data model with comprehensive marketing copy, case studies, pain points, and FAQs for all 8 business categories.
- **Connected homepage showcase cards** — all 8 cards in the "Built for Small Business Owners" section on the homepage are now clickable Next.js `Link` components (`/industry/[slug]`) with animated hover badges. Footer "Solutions" column updated with direct links to the new sector landing pages.

- **Phone input group & typography enhancement** — replaced the previous single input with a `.phone-input-group` component featuring a vector Indian flag SVG, bold `+91` country code, vertical separator divider, and prominent `18px` bold digits (`font-weight: 700`, `letter-spacing: 0.08em`). The typed number now proportionally fills the box with balanced spacing and high legibility.
- **ROI calculator alignment & label cleanup** — in `/tools/admission-roi-calculator`, cleaned up the label to "New Local Customers Acquired / Month" and value badge to `+X Customers` with `white-space: nowrap` and baseline alignment. Removed the redundant and confusing `/ Mo` (abbreviation for Month) badge suffix that was breaking onto an awkward second line. Added `.roi-calculator-grid` responsive styling.
- **Flowbite typography system adopted** — integrated the full optical size **Inter** font family (100–900 weights) with modern Flowbite/Tailwind typographic tokens (`--font-heading: 'Inter'`, `--font-body: 'Inter'`, `font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11'`, `-0.025em` tight letter spacing on headlines, and `1.625` line-heights). Upgraded typography across hero, feature cards, pricing grid, and FAQ accordions for a crisp, high-end SaaS feel.
- **Flowbite breadcrumb navigation & SEO schema** — created reusable `<Breadcrumbs>` component (`apps/web/src/components/Breadcrumbs.tsx`) featuring Flowbite SVG home icon, chevron separators, glassmorphic pill background, hover state transitions, and automatic `BreadcrumbList` Schema.org JSON-LD generation for Google Search rich snippets. Integrated across all sector landing pages (`/industry/[slug]`), growth calculators (`/tools/admission-roi-calculator`, `/tools/google-score-calculator`), resources (`/resources/whatsapp-kit`), and legal policies (`/privacy`, `/terms`, `/refund`).
- **Pulsing floating WhatsApp widget & centered handset alignment** — upgraded the bottom-right WhatsApp floating button to `.floating_btn` with circular green button (`#25D366`), perfectly centered WhatsApp SVG handset geometry (`viewBox="0 0 32 32"`), radar pulse ring keyframe animation (`@keyframes wa-pulsing`), and a "Talk to us?" glassmorphic sub-label pill (`.text_icon`). Integrated across homepage and sector landing pages with smooth scale-up hover states.

Verified: Live browser testing verified click-through navigation from the homepage to all sector pages (`/industry/gyms-fitness`, `/industry/doctors-clinics`, `/industry/salons-spas`, etc.), confirmed zero overlap and bold typography in the phone input, verified clean baseline alignment in the revenue growth calculator, verified 2-column FAQ accordion expand/collapse transitions, verified desktop header layout and mobile drawer open/close flows, validated Flowbite Inter typography, tested breadcrumb rendering and return navigation, verified high contrast on results CTA banner, and verified centered alignment and pulsing animation on the WhatsApp floating widget.

## Build session 9 — landing page UI refinements

- **Pricing grid → 4-column single-row layout** — expanded `#pricing .section-center` and `.pricing-gosaas-wrapper` max-width to `1360px` to properly fit 4 cards side-by-side on desktop without cramped wrapping. Standardized `.pricing-plan-subtitle` with `min-height: 38px` so card dividers and prices align horizontally. Added `white-space: nowrap` and flex alignment on `.pricing-price-val` (`₹999 / month`, `₹2,499 / month`, `₹4,999 / month`). Maintained responsive breakpoints: `@media (max-width: 1100px)` for 2-column tablet layout, and mobile (≤640px) for single-column.
- **ROI "30-day transformation" images replaced** — removed backend dashboard screenshots that exposed the internal product UI. Replaced with realistic Google Maps search & ranking UI comparisons (`results_day1_before.jpg` showing competitor dominance and business buried at #18, `results_day30_after.jpg` showing #1 Local Pack ranking with 4.9 stars and WhatsApp booking CTA). Alt text and overlays updated to match.

Verified: Layout inspected via live browser at `http://localhost:3001` across desktop viewports. All 4 pricing cards render side-by-side cleanly; ROI before/after cards render without dashboard exposure or overlapping badge glitches.

## Build session 8 — Phase 2: new feature candidates

- **City × vertical SEO landing pages** — new `/city/[cityName]/[vertical]` route (32 pages: 4 cities × 8 verticals, matching the homepage's own business-showcase list). Extracted `CITY_DATA`/`getCity()` out of `city/[cityName]/page.tsx` into `lib/cityData.ts` (now has two consumers) and added `lib/verticalData.ts`. Both city pages now cross-link to each other (other verticals in the same city, this vertical in other cities) — the actual SEO value of the matrix.
- **Lead assignment** — `leads.owner_user_id` existed in the schema since the first build but nothing ever set or read it. Added `PATCH /api/leads/:id/assign` (defaults to "assign to me" — no staff-picker UI needed for a 1-2 person team) and `?mine=true` filter on `GET /api/leads`. Web `/leads` page has an "Assign to me" button + "my leads" toggle.
- **WhatsApp template quick-pick** — the campaigns UI's template-name field was free text; added a row of common-use-case suggestion chips (`new_offer_announcement`, `appointment_reminder`, etc.) that prefill it. Meta's own template approval is still an external step in WhatsApp Manager — this just removes the "remember the exact approved name" friction.

Verified: API typecheck clean, 4/4 tests pass, `next build` clean on all 18 routes (17 + the new nested city/vertical route).

## Build session 7 — Phase 1: finish known backend TODOs

- **WhatsApp conversation state → Redis** (`redis.ts`, new `ioredis` dep) — was an in-memory `Map` in `routes/whatsapp.ts`, lost on restart and broken across multiple instances. 24h TTL, no cleanup job needed.
- **Per-business Mixpost account IDs** — `businesses.mixpost_account_ids` (migration 003), settable via the onboarding route. `worker.ts` now reads it and **skips publishing (leaves the post `scheduled` for retry) instead of silently marking a no-op as "published"** when no account is connected — that was a real correctness bug, not just a missing feature.
- **Campaign recipients persisted** (migration 003, `campaign_recipients` table) — `createCampaign` now stores the list once; `sendCampaign(campaignId)` reads recipients + template + language + body back from the DB instead of requiring the caller to re-supply the same list on every send call. Also makes retrying just-`pending` recipients (e.g. after a credit top-up) safe — counters are additive, not overwritten.
- **GBP OAuth refresh mechanism** (`clients/gbp-oauth.ts`, migration 004 `businesses.gbp_refresh_token`) — resolves a fresh access token from a stored refresh token, cached in Redis (~50min), falling back to the static `GBP_ACCESS_TOKEN` if unset. **Deliberately does NOT include the authorization-consent redirect flow** — that needs a Google Cloud OAuth client + approved GBP access (external, user-completed prerequisites); building an unusable redirect route now would be untestable scaffolding. The one-time manual token-acquisition step is documented in the file's header comment.

Verified: API typecheck clean, 4/4 tests pass, `next build` clean on all 17 routes.

## Build session 5 — bug/security audit fixes

Found via full-repo read-through (marketing site, calculators, prod Docker/Caddy stack were added by a prior session). Fixed, verified: API typecheck clean, 4/4 audit-scoring tests pass, `next build` clean on all 17 web routes.

- **CRITICAL — audit bot was DOA:** `leads.vertical` INSERT used `'local_business'`, not a valid value in the `vertical` enum (`coaching|clinic|realestate|salon|restaurant|other`). Every lead capture crashed. Fixed to `'other'` (the enum's catch-all) in `audit/service.ts`.
- **WhatsApp webhook had no signature verification** — anyone who found the URL could trigger paid LLM/Places calls. Added `verifyWebhookSignature()` (HMAC-SHA256 over raw body, `X-Hub-Signature-256`) in `clients/whatsapp.ts`, wired into `routes/whatsapp.ts` via `fastify-raw-body`. New `WHATSAPP_APP_SECRET` config var (required in prod, skipped with a warning in dev).
- **`JWT_SECRET` had no production guard** — `config.ts` now throws on boot if `NODE_ENV=production` and the secret is still the dev default.
- **Env var name mismatch** — `docker-compose.prod.yml` set `WHATSAPP_WEBHOOK_VERIFY_TOKEN`, code reads `WHATSAPP_VERIFY_TOKEN`; the webhook handshake would have failed in prod. Fixed, plus added `WHATSAPP_APP_SECRET` passthrough, both required (`:?`) like `JWT_SECRET`.
- **`.env.example` was missing** (deleted, never replaced) — recreated matching `config.ts` exactly, including the vars added in this session and the prior one (`OPENROUTER_API_KEY`, Mixpost, Razorpay, pricing).
- **`pnpm-lock.yaml` was never committed** despite `.gitignore` saying it should be — Docker's `--frozen-lockfile` build would fail on a fresh clone. Committed.
- **`/api/audit/autocomplete` had no rate limit** despite calling the paid Places API — added `max: 20/min`.
- **Dead `industry` param** removed from the audit route/service (accepted by zod, destructured, never used — no caller sent it).
- **Phone numbers inconsistent** between the WhatsApp webhook (E.164) and the web form (bare digits) — normalized once in `runAudit()` (the single choke point both callers route through): 10-digit numbers get `91` prepended, already-prefixed numbers pass through.
- **`tools/google-score-calculator` faked a live scan** — "📡 Scanning Live Google Maps Profiles…" and "Based on public Google Maps completeness…" described a random string-length hash as a live lookup, and the WhatsApp "send" button did nothing. Relabeled the instant estimate honestly, and wired the send button to the real `/api/audit/run` (same call the homepage form uses) — it now returns and displays the actual score.
- `MSG91_SENDER_ID` default `PRCHAR` → `GRWLKL` (leftover from the pre-rename codename).
- `next-env.d.ts` was staged for commit — added to `.gitignore` (auto-generated by Next, regenerates on build).

## Build session 2 — auth, billing, and the wedge features

Added (all authored, NOT yet run/typechecked — validate with `pnpm install && pnpm --filter @growlokal/api typecheck`):

### Auth (Milestone 2)
- `db/migrations/002_auth_billing.sql` — `otp_codes` (hashed), `webhook_events` (idempotency).
- `auth/otp.ts` — phone OTP: hashed codes, TTL, attempt limits. Dev logs the code; prod sends via MSG91.
- `auth/jwt.ts`, `auth/middleware.ts` — JWT sign/verify + `requireAuth` / `requireBusiness` (tenant scoping).
- `routes/auth.ts` — request-otp / verify-otp (auto-creates user+business on first login) / me.
- Web `/login` — two-step OTP sign-in.

### Content engine
- `features/content/generator.ts` — shared vernacular generation for social/GBP/campaigns, cheap vs quality tiering, robust JSON parsing.

### Wedge features (Milestone 3)
- `features/social/` + `clients/mixpost.ts` — generate + schedule Instagram/FB posts; `worker.ts` publishes due posts.
- `features/campaigns/` — WhatsApp marketing with **atomic prepaid-credit debit** (never overspends, refunds on failure).
- `features/gbp/` — GBP post creation + AI review-reply drafting (publish gated on Google approval; drafts saved regardless).

### Billing
- `clients/razorpay.ts` — subscription create + **HMAC webhook signature verification** (over raw body).
- `routes/billing.ts` — subscribe checkout + idempotent webhook that activates/suspends businesses.

### Wiring
- `routes/features.ts` replaces `stubs.ts` (deleted) — all tenant routes auth-protected.
- `server.ts` — registers `fastify-raw-body` (webhook), auth/billing/feature routes.
- Web `/dashboard/[businessId]` — ROI stats + one-click content generation; `/leads` now authed.

## Build session 3 — onboarding, chat agent, booking microsite

- **Onboarding** — `PUT /api/businesses/:id` (fills profile_context, COALESCE-safe) + web `/onboarding/[businessId]`.
- **WhatsApp chat agent** — `answerCustomerQuestion()` in generator.ts (prompt-stuffed profile_context, no vector DB); `whatsapp.ts` now routes by which number received the message: business number → chat agent (+ logs `enquiry_received`), platform number → audit bot. Replies in the free 24h window.
- **Booking microsite** — public `GET /api/public/business/:id` + web `/c/[businessId]` (server-rendered, wa.me + UPI deep link). Skipped Cal.com; add calendar slots only when a center asks.

## Build session 4 — rename + campaigns UI

- **Renamed** Prachaar → **GrowLokal** across all files; domain placeholder → `growlokal.com`. Package scopes now `@growlokal/*`.
- **Campaigns UI** — web `/dashboard/[businessId]/campaigns` (2-step: draft+preview → send, shows credit-exhaustion warning). Wires to the existing campaigns API. This was the last missing dashboard piece — GBP/social/campaigns backends were already built.
- Dashboard nav links to campaigns + edit-profile.

**All planned product features now have both backend + UI.** Remaining work is hardening (below), not features.

## Known TODOs (carried forward — hardening, not features)
- Conversation state → Redis (currently in-memory in `routes/whatsapp.ts`).
- Meta webhook signature verification (X-Hub-Signature-256).
- GBP OAuth refresh-token exchange (currently expects a static `GBP_ACCESS_TOKEN`).
- Per-business Mixpost account-ID lookup (worker dry-runs without it).
- Persist campaign recipients to a table (currently passed in the send call).
- Rate-limit the audit endpoint + Places API key restriction + billing cap.
- Email sending (SES) — not built; `.env` vars are placeholders.
