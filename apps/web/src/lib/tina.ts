import fs from 'fs';
import path from 'path';

// Cached content structures
export interface GlobalSettings {
  siteName: string;
  tagline: string;
  headerLogoUrl: string;
  footerLogoUrl: string;
  faviconUrl: string;
  logoAlt: string;
  supportPhone: string;
  whatsappNumber: string;
  whatsappDefaultMsg: string;
  metaTitle: string;
  metaDescription: string;
}

export interface HeaderNavigation {
  navLinks: Array<{ label: string; url: string; isHighlight?: boolean }>;
  headerCta: { label: string; url: string };
  enableLanguageSwitch: boolean;
  defaultLanguage: string;
  supportedLanguages: Array<{ code: string; label: string }>;
}

export interface FooterNavigation {
  footerTagline: string;
  regionalBadges: Array<{ label: string }>;
  freeGrowthTools: Array<{ label: string; url: string }>;
  industrySolutions: Array<{ label: string; url: string }>;
  topLocations: Array<{ label: string; url: string }>;
  accountHelp: Array<{ label: string; url: string }>;
  copyrightText: string;
}

export interface HomePageContent {
  title: string;
  hero: {
    badgeText: string;
    headlinePrefix: string;
    headlineAccent: string;
    headlineSuffix: string;
    subheadline: string;
    primaryCta: { label: string; url: string };
    secondaryCta: { label: string; url: string };
    trustBadges: Array<{ icon: string; text: string }>;
    heroImage: string;
  };
  statsBar: {
    title: string;
    platforms: Array<{ name: string; icon: string }>;
  };
  growthTools: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cards: Array<{
      icon: string;
      badge: string;
      title: string;
      desc: string;
      btnLabel: string;
      btnUrl: string;
      btnBg?: string;
    }>;
  };
  painPoints: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cards: Array<{
      stat: string;
      statLabel: string;
      title: string;
      desc: string;
      solution: string;
      icon: string;
    }>;
  };
  howItWorks: {
    eyebrow: string;
    title: string;
    subtitle: string;
    steps: Array<{
      step: string;
      title: string;
      desc: string;
      icon: string;
    }>;
  };
  aiAgents: {
    eyebrow: string;
    title: string;
    subtitle: string;
    agents: Array<{
      id: string;
      name: string;
      role: string;
      badge: string;
      avatar: string;
      features: string[];
    }>;
  };
  results: {
    eyebrow: string;
    title: string;
    subtitle: string;
    beforeDay1: {
      title: string;
      score: number;
      desc: string;
      metrics: string[];
      image: string;
    };
    afterDay30: {
      title: string;
      score: number;
      desc: string;
      metrics: string[];
      image: string;
    };
    pillars: Array<{
      icon: string;
      title: string;
      desc: string;
      statTag: string;
    }>;
  };
  pricing: {
    eyebrow: string;
    title: string;
    subtitle: string;
    discountBadge: string;
    starter: {
      title: string;
      subtitle: string;
      monthlyPrice: number;
      annualPrice: number;
      annualSavingsNote: string;
      features: string[];
      btnText: string;
      btnUrl: string;
    };
    growth: {
      title: string;
      subtitle: string;
      isFeatured?: boolean;
      badge?: string;
      monthlyPrice: number;
      annualPrice: number;
      annualSavingsNote: string;
      features: string[];
      btnText: string;
      btnUrl: string;
    };
  };
  faq: {
    eyebrow: string;
    title: string;
    subtitle: string;
    questions: Array<{
      q: string;
      a: string;
    }>;
  };
}

/**
 * Safely reads a JSON content file with fallback error handling
 */
function readContentJson<T>(relativePath: string): T {
  try {
    const fullPath = path.join(process.cwd(), 'content', relativePath);
    if (fs.existsSync(fullPath)) {
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      return JSON.parse(fileContents) as T;
    }
  } catch (err) {
    console.warn(`[TinaCMS Loader] Warning: Could not read content from content/${relativePath}. Using defaults.`, err);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return {} as any;
}

export function getGlobalSettings(): GlobalSettings {
  const data = readContentJson<GlobalSettings>('global/settings.json');
  return {
    siteName: data.siteName || 'GrowLokal',
    tagline: data.tagline || 'The #1 AI Marketing Platform for South Indian Local Businesses',
    headerLogoUrl: data.headerLogoUrl || 'https://zugkwxy0oqkvrsu5.public.blob.vercel-storage.com/logo_right_text.png',
    footerLogoUrl: data.footerLogoUrl || 'https://zugkwxy0oqkvrsu5.public.blob.vercel-storage.com/logo_white.png',
    faviconUrl: data.faviconUrl || 'https://zugkwxy0oqkvrsu5.public.blob.vercel-storage.com/32x32_favicon.png',
    logoAlt: data.logoAlt || 'GrowLokal — Autonomous AI Local Marketing',
    supportPhone: data.supportPhone || '+91 98765 43210',
    whatsappNumber: data.whatsappNumber || '919876543210',
    whatsappDefaultMsg: data.whatsappDefaultMsg || 'Hi GrowLokal, I want to get a free Google Business audit for my store',
    metaTitle: data.metaTitle || 'GrowLokal — Autonomous AI Marketing Platform for South Indian Local Businesses',
    metaDescription: data.metaDescription || 'Get a free instant Google Business Profile report for your local clinic, salon, store, restaurant, or business.',
  };
}

export function getHeaderNavigation(): HeaderNavigation {
  const data = readContentJson<HeaderNavigation>('navigation/header.json');
  return {
    navLinks: data.navLinks || [
      { label: 'How it works', url: '/#how-it-works' },
      { label: 'AI Agents', url: '/#agents' },
      { label: 'Pricing', url: '/#pricing' },
      { label: 'Industries', url: '/#industries' },
      { label: 'Free GBP Report', url: '/free-gbp-report', isHighlight: true },
    ],
    headerCta: data.headerCta || { label: 'Audit My Business', url: '/free-gbp-report' },
    enableLanguageSwitch: data.enableLanguageSwitch !== false,
    defaultLanguage: data.defaultLanguage || 'en',
    supportedLanguages: data.supportedLanguages || [
      { code: 'en', label: 'English' },
      { code: 'te', label: 'తెలుగు' },
      { code: 'ta', label: 'தமிழ்' },
      { code: 'kn', label: 'ಕನ್ನಡ' },
    ],
  };
}

export function getFooterNavigation(): FooterNavigation {
  const data = readContentJson<FooterNavigation>('navigation/footer.json');
  return {
    footerTagline: data.footerTagline || 'The #1 AI Marketing Platform built for South Indian Local Businesses.',
    regionalBadges: data.regionalBadges || [
      { label: '🇮🇳 Telugu' },
      { label: '🇮🇳 Tamil' },
      { label: '🇮🇳 Kannada' },
      { label: '🌐 English' },
    ],
    freeGrowthTools: data.freeGrowthTools || [
      { label: 'Google Score Benchmark', url: '/tools/google-score-calculator' },
      { label: 'Revenue Growth Calculator', url: '/tools/revenue-roi-calculator' },
      { label: 'WhatsApp Growth Kit', url: '/resources/whatsapp-kit' },
      { label: 'Local SEO Playbooks', url: '/blog' },
      { label: 'Free Google Audit', url: '/free-gbp-report' },
    ],
    industrySolutions: data.industrySolutions || [
      { label: 'Clinics & Healthcare', url: '/industry/doctors-clinics' },
      { label: 'Salons & Spas', url: '/industry/salons-spas' },
      { label: 'Restaurants & Cafes', url: '/industry/restaurants-cafes' },
      { label: 'Gyms & Fitness', url: '/industry/gyms-fitness' },
      { label: 'Bakeries & Cake Shops', url: '/industry/bakers-cake-shops' },
    ],
    topLocations: data.topLocations || [
      { label: 'Hyderabad, Telangana', url: '/city/hyderabad' },
      { label: 'Chennai, Tamil Nadu', url: '/city/chennai' },
      { label: 'Bengaluru, Karnataka', url: '/city/bengaluru' },
      { label: 'Vijayawada, AP', url: '/city/vijayawada' },
      { label: 'Visakhapatnam, AP', url: '/city/visakhapatnam' },
      { label: 'Coimbatore, TN', url: '/city/coimbatore' },
      { label: 'Kochi, Kerala', url: '/city/kochi' },
    ],
    accountHelp: data.accountHelp || [
      { label: 'Owner Sign In', url: '/login' },
      { label: 'Growth Plan Pricing', url: '/#pricing' },
      { label: 'Frequently Asked Questions', url: '/#faq' },
      { label: 'WhatsApp Support', url: 'https://api.whatsapp.com/send?phone=919876543210' },
      { label: 'Privacy Policy', url: '/privacy' },
      { label: 'Terms & Conditions', url: '/terms' },
      { label: 'Refund Policy', url: '/refund' },
    ],
    copyrightText: data.copyrightText || 'GrowLokal Technologies. Built with ❤️ for South Indian Local Businesses.',
  };
}

export function getHomePageContent(): HomePageContent {
  return readContentJson<HomePageContent>('pages/home.json');
}
