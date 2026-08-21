import { defineConfig } from 'tinacms';

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.NEXT_PUBLIC_TINA_BRANCH ||
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  'main';

export default defineConfig({
  branch,

  // Get this from tina.io for production on Vercel
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || null,
  // Get this from tina.io for production on Vercel
  token: process.env.TINA_TOKEN || null,

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'uploads',
      publicFolder: 'public',
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      // ─── 1. GLOBAL SETTINGS (SINGLETON) ───
      {
        name: 'global',
        label: 'Global Brand & Settings',
        path: 'content/global',
        format: 'json',
        ui: {
          global: true,
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: 'string',
            name: 'siteName',
            label: 'Site Name',
            required: true,
          },
          {
            type: 'string',
            name: 'tagline',
            label: 'Tagline',
          },
          {
            type: 'image',
            name: 'headerLogoUrl',
            label: 'Header Logo (Dark Text for White Navbar)',
          },
          {
            type: 'image',
            name: 'footerLogoUrl',
            label: 'Footer Logo (Light/White Text for Midnight Footer)',
          },
          {
            type: 'image',
            name: 'faviconUrl',
            label: 'Favicon (32x32 / 48x48 Square Icon)',
          },
          {
            type: 'string',
            name: 'logoAlt',
            label: 'Logo Alt Text',
          },
          {
            type: 'string',
            name: 'supportPhone',
            label: 'Support Helpline Phone',
          },
          {
            type: 'string',
            name: 'whatsappNumber',
            label: 'WhatsApp Business Number (with country code, e.g. 919876543210)',
          },
          {
            type: 'string',
            name: 'whatsappDefaultMsg',
            label: 'WhatsApp Default Message',
            ui: {
              component: 'textarea',
            },
          },
          {
            type: 'string',
            name: 'metaTitle',
            label: 'Default SEO Meta Title',
          },
          {
            type: 'string',
            name: 'metaDescription',
            label: 'Default SEO Meta Description',
            ui: {
              component: 'textarea',
            },
          },
        ],
      },

      // ─── 2. NAVIGATION (SINGLETON) ───
      {
        name: 'navigation',
        label: 'Header & Footer Navigation',
        path: 'content/navigation',
        format: 'json',
        ui: {
          global: true,
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: 'object',
            name: 'navLinks',
            label: 'Header Navigation Links',
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.label || 'Nav Link' }),
            },
            fields: [
              { type: 'string', name: 'label', label: 'Link Label' },
              { type: 'string', name: 'url', label: 'URL / Anchor (#how-it-works)' },
              { type: 'boolean', name: 'isHighlight', label: 'Highlight Link (Blue/Bold)' },
            ],
          },
          {
            type: 'object',
            name: 'headerCta',
            label: 'Header Primary CTA Button',
            fields: [
              { type: 'string', name: 'label', label: 'Button Label' },
              { type: 'string', name: 'url', label: 'Button URL' },
            ],
          },
          {
            type: 'string',
            name: 'footerTagline',
            label: 'Footer Tagline Description',
            ui: { component: 'textarea' },
          },
          {
            type: 'object',
            name: 'freeGrowthTools',
            label: 'Footer Free Growth Tool Links',
            list: true,
            ui: { itemProps: (item) => ({ label: item?.label || 'Tool Link' }) },
            fields: [
              { type: 'string', name: 'label', label: 'Label' },
              { type: 'string', name: 'url', label: 'URL' },
            ],
          },
          {
            type: 'object',
            name: 'industrySolutions',
            label: 'Footer Industry Solution Links',
            list: true,
            ui: { itemProps: (item) => ({ label: item?.label || 'Solution Link' }) },
            fields: [
              { type: 'string', name: 'label', label: 'Label' },
              { type: 'string', name: 'url', label: 'URL' },
            ],
          },
          {
            type: 'object',
            name: 'topLocations',
            label: 'Footer Top Location Links',
            list: true,
            ui: { itemProps: (item) => ({ label: item?.label || 'Location Link' }) },
            fields: [
              { type: 'string', name: 'label', label: 'Label' },
              { type: 'string', name: 'url', label: 'URL' },
            ],
          },
          {
            type: 'object',
            name: 'accountHelp',
            label: 'Footer Account & Legal Links',
            list: true,
            ui: { itemProps: (item) => ({ label: item?.label || 'Help Link' }) },
            fields: [
              { type: 'string', name: 'label', label: 'Label' },
              { type: 'string', name: 'url', label: 'URL' },
            ],
          },
          {
            type: 'string',
            name: 'copyrightText',
            label: 'Copyright Line',
          },
        ],
      },

      // ─── 3. PAGES (DYNAMIC PAGE BUILDER) ───
      {
        name: 'page',
        label: 'Pages (Page Builder)',
        path: 'content/pages',
        format: 'json',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Page Title',
            isTitle: true,
            required: true,
          },
          // Hero Section
          {
            type: 'object',
            name: 'hero',
            label: 'Hero Section',
            fields: [
              { type: 'string', name: 'badgeText', label: 'Top Eyebrow Badge' },
              { type: 'string', name: 'headlinePrefix', label: 'Headline Prefix' },
              { type: 'string', name: 'headlineAccent', label: 'Headline Highlighted Accent' },
              { type: 'string', name: 'headlineSuffix', label: 'Headline Suffix' },
              { type: 'string', name: 'subheadline', label: 'Subheadline', ui: { component: 'textarea' } },
              {
                type: 'object',
                name: 'primaryCta',
                label: 'Primary CTA Button (Orange)',
                fields: [
                  { type: 'string', name: 'label', label: 'Label' },
                  { type: 'string', name: 'url', label: 'URL' },
                ],
              },
              {
                type: 'object',
                name: 'secondaryCta',
                label: 'Secondary CTA Button',
                fields: [
                  { type: 'string', name: 'label', label: 'Label' },
                  { type: 'string', name: 'url', label: 'URL' },
                ],
              },
              {
                type: 'object',
                name: 'trustBadges',
                label: 'Trust Bullet Points',
                list: true,
                fields: [
                  { type: 'string', name: 'icon', label: 'Icon (e.g. ✓, ⚡, 🌐)' },
                  { type: 'string', name: 'text', label: 'Badge Text' },
                ],
              },
              { type: 'image', name: 'heroImage', label: 'Right Hero Visual Image' },
            ],
          },
          // Growth Tools Section
          {
            type: 'object',
            name: 'growthTools',
            label: 'Growth Tools Section',
            fields: [
              { type: 'string', name: 'eyebrow', label: 'Eyebrow' },
              { type: 'string', name: 'title', label: 'Title' },
              { type: 'string', name: 'subtitle', label: 'Subtitle' },
              {
                type: 'object',
                name: 'cards',
                label: 'Tool Cards',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.title || 'Tool Card' }) },
                fields: [
                  { type: 'string', name: 'badge', label: 'Badge Text' },
                  { type: 'string', name: 'title', label: 'Title' },
                  { type: 'string', name: 'desc', label: 'Description', ui: { component: 'textarea' } },
                  { type: 'string', name: 'btnLabel', label: 'Button Label' },
                  { type: 'string', name: 'btnUrl', label: 'Button URL' },
                ],
              },
            ],
          },
          // Pain Points Section
          {
            type: 'object',
            name: 'painPoints',
            label: 'Pain Points Section',
            fields: [
              { type: 'string', name: 'eyebrow', label: 'Eyebrow' },
              { type: 'string', name: 'title', label: 'Title' },
              { type: 'string', name: 'subtitle', label: 'Subtitle' },
              {
                type: 'object',
                name: 'cards',
                label: 'Pain Cards',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.title || 'Pain Card' }) },
                fields: [
                  { type: 'string', name: 'stat', label: 'Stat Number (e.g. 84%)' },
                  { type: 'string', name: 'statLabel', label: 'Stat Subtitle' },
                  { type: 'string', name: 'title', label: 'Card Title' },
                  { type: 'string', name: 'desc', label: 'Description', ui: { component: 'textarea' } },
                  { type: 'string', name: 'solution', label: 'Solution Tag' },
                ],
              },
            ],
          },
          // AI Agents Section
          {
            type: 'object',
            name: 'aiAgents',
            label: 'AI Agents Section',
            fields: [
              { type: 'string', name: 'eyebrow', label: 'Eyebrow' },
              { type: 'string', name: 'title', label: 'Title' },
              { type: 'string', name: 'subtitle', label: 'Subtitle' },
              {
                type: 'object',
                name: 'agents',
                label: 'AI Agents List',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.name || 'Agent' }) },
                fields: [
                  { type: 'string', name: 'name', label: 'Agent Name' },
                  { type: 'string', name: 'role', label: 'Agent Role' },
                  { type: 'string', name: 'badge', label: 'Agent Badge' },
                  { type: 'image', name: 'avatar', label: 'Avatar Image' },
                  { type: 'string', name: 'features', label: 'Features List', list: true },
                ],
              },
            ],
          },
          // 30-Day Results Section
          {
            type: 'object',
            name: 'results',
            label: '30-Day Results Transformation Section',
            fields: [
              { type: 'string', name: 'eyebrow', label: 'Eyebrow' },
              { type: 'string', name: 'title', label: 'Title' },
              { type: 'string', name: 'subtitle', label: 'Subtitle' },
              {
                type: 'object',
                name: 'beforeDay1',
                label: 'Before (Day 1) Card',
                fields: [
                  { type: 'string', name: 'title', label: 'Title' },
                  { type: 'number', name: 'score', label: 'Score / 100' },
                  { type: 'string', name: 'desc', label: 'Description' },
                  { type: 'string', name: 'metrics', label: 'Negative Metrics List', list: true },
                  { type: 'image', name: 'image', label: 'Screenshot / Image' },
                ],
              },
              {
                type: 'object',
                name: 'afterDay30',
                label: 'After (Day 30) Card',
                fields: [
                  { type: 'string', name: 'title', label: 'Title' },
                  { type: 'number', name: 'score', label: 'Score / 100' },
                  { type: 'string', name: 'desc', label: 'Description' },
                  { type: 'string', name: 'metrics', label: 'Positive Metrics List', list: true },
                  { type: 'image', name: 'image', label: 'Screenshot / Image' },
                ],
              },
              {
                type: 'object',
                name: 'pillars',
                label: '4 Transformation Pillars',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.title || 'Pillar' }) },
                fields: [
                  { type: 'string', name: 'icon', label: 'Icon Emoji' },
                  { type: 'string', name: 'title', label: 'Pillar Title' },
                  { type: 'string', name: 'desc', label: 'Description' },
                  { type: 'string', name: 'statTag', label: 'Stat Badge (e.g. +278% Map Views)' },
                ],
              },
            ],
          },
          // Pricing Section
          {
            type: 'object',
            name: 'pricing',
            label: 'Pricing Section',
            fields: [
              { type: 'string', name: 'eyebrow', label: 'Eyebrow' },
              { type: 'string', name: 'title', label: 'Title' },
              { type: 'string', name: 'subtitle', label: 'Subtitle' },
              { type: 'string', name: 'discountBadge', label: 'Annual Discount Badge' },
              {
                type: 'object',
                name: 'starter',
                label: 'Starter Plan',
                fields: [
                  { type: 'string', name: 'title', label: 'Plan Name' },
                  { type: 'string', name: 'subtitle', label: 'Subtitle' },
                  { type: 'number', name: 'monthlyPrice', label: 'Monthly Price (₹)' },
                  { type: 'number', name: 'annualPrice', label: 'Annual Price / Mo (₹)' },
                  { type: 'string', name: 'annualSavingsNote', label: 'Annual Savings Note' },
                  { type: 'string', name: 'features', label: 'Features Checklist', list: true },
                  { type: 'string', name: 'btnText', label: 'Button Text' },
                  { type: 'string', name: 'btnUrl', label: 'Button URL' },
                ],
              },
              {
                type: 'object',
                name: 'growth',
                label: 'Growth Plan (Featured)',
                fields: [
                  { type: 'string', name: 'title', label: 'Plan Name' },
                  { type: 'string', name: 'subtitle', label: 'Subtitle' },
                  { type: 'string', name: 'badge', label: 'Ribbon Badge (e.g. Most Popular)' },
                  { type: 'number', name: 'monthlyPrice', label: 'Monthly Price (₹)' },
                  { type: 'number', name: 'annualPrice', label: 'Annual Price / Mo (₹)' },
                  { type: 'string', name: 'annualSavingsNote', label: 'Annual Savings Note' },
                  { type: 'string', name: 'features', label: 'Features Checklist', list: true },
                  { type: 'string', name: 'btnText', label: 'Button Text' },
                  { type: 'string', name: 'btnUrl', label: 'Button URL' },
                ],
              },
            ],
          },
          // FAQ Section
          {
            type: 'object',
            name: 'faq',
            label: 'FAQ Section',
            fields: [
              { type: 'string', name: 'eyebrow', label: 'Eyebrow' },
              { type: 'string', name: 'title', label: 'Title' },
              { type: 'string', name: 'subtitle', label: 'Subtitle' },
              {
                type: 'object',
                name: 'questions',
                label: 'Questions & Answers',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.q || 'Question' }) },
                fields: [
                  { type: 'string', name: 'q', label: 'Question' },
                  { type: 'string', name: 'a', label: 'Answer', ui: { component: 'textarea' } },
                ],
              },
            ],
          },
        ],
      },

      // ─── 4. BLOG POSTS & PLAYBOOKS (COLLECTION) ───
      {
        name: 'post',
        label: 'Blog & Playbooks',
        path: 'content/posts',
        format: 'mdx',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Article Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'slug',
            label: 'Slug (URL path)',
            required: true,
          },
          {
            type: 'datetime',
            name: 'date',
            label: 'Date Published',
          },
          {
            type: 'string',
            name: 'author',
            label: 'Author Name',
          },
          {
            type: 'string',
            name: 'category',
            label: 'Category',
          },
          {
            type: 'string',
            name: 'excerpt',
            label: 'Short Excerpt / Meta Description',
            ui: { component: 'textarea' },
          },
          {
            type: 'image',
            name: 'coverImage',
            label: 'Cover Image',
          },
          {
            type: 'string',
            name: 'readTime',
            label: 'Read Time (e.g. 5 min read)',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Article Body',
            isBody: true,
          },
        ],
      },
    ],
  },
});
