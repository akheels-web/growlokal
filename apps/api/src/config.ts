// Centralised env config with validation. Fails fast on missing critical vars.
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.string().default('development'),
  API_PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string().default('redis://localhost:6379'),

  // WhatsApp
  WHATSAPP_PHONE_NUMBER_ID: z.string().default(''),
  WHATSAPP_ACCESS_TOKEN: z.string().default(''),
  WHATSAPP_VERIFY_TOKEN: z.string().default('dev_verify_token'),
  WHATSAPP_API_VERSION: z.string().default('v21.0'),
  // Meta App Secret — used to verify X-Hub-Signature-256 on inbound webhooks.
  // Empty in dev (verification skipped with a warning); REQUIRED in production.
  WHATSAPP_APP_SECRET: z.string().default(''),

  // Google
  GOOGLE_PLACES_API_KEY: z.string().default(''),

  // LLM
  LLM_PROVIDER: z.enum(['gemini', 'openrouter', 'anthropic', 'ollama']).default('gemini'),
  LLM_MODEL_CHEAP: z.string().default('gemini-2.0-flash-lite'),
  LLM_MODEL_QUALITY: z.string().default('gemini-2.5-flash'),
  GEMINI_API_KEY: z.string().default(''),
  OPENROUTER_API_KEY: z.string().default(''),
  // Previously hardcoded inside clients/llm.ts, ignoring LLM_PROVIDER=openrouter's
  // own multi-model access (Claude/Llama/etc). Verify these slugs against
  // https://openrouter.ai/models before relying on them — IDs change over time.
  OPENROUTER_MODEL_CHEAP: z.string().default('google/gemini-2.0-flash-lite-001'),
  OPENROUTER_MODEL_QUALITY: z.string().default('anthropic/claude-haiku-4.5'),
  // Image generation (GBP + social posts only — see docs/DECISIONS.md 2026-08-18).
  // ~$0.014/megapixel verified against https://openrouter.ai/models at time of writing.
  OPENROUTER_MODEL_IMAGE: z.string().default('black-forest-labs/flux.2-klein-4b'),

  // QuickChart (open source, https://github.com/typpo/quickchart) — renders
  // the "My Stats" WhatsApp chart. Defaults to their hosted free instance;
  // point at a self-hosted one (e.g. on the home lab, same pattern as Kuma/
  // Twenty) if volume ever outgrows the free tier's rate limits.
  QUICKCHART_BASE_URL: z.string().default('https://quickchart.io'),

  // Cloudflare R2 (S3-compatible) — hosts AI-generated images so Mixpost/GBP
  // can actually publish them (both require a real public URL, not base64).
  // Empty by default: image generation silently no-ops (caption-only posts)
  // until a bucket + token are created and these are set.
  R2_ACCOUNT_ID: z.string().default(''),
  R2_ACCESS_KEY_ID: z.string().default(''),
  R2_SECRET_ACCESS_KEY: z.string().default(''),
  R2_BUCKET: z.string().default('growlokal-media'),
  R2_PUBLIC_URL_BASE: z.string().default(''),   // e.g. https://media.growlokal.com
  ANTHROPIC_API_KEY: z.string().default(''),
  OLLAMA_BASE_URL: z.string().default('http://localhost:11434'),
  OLLAMA_MODEL: z.string().default('qwen2.5:3b'),

  // Auth
  JWT_SECRET: z.string().default('dev_insecure_change_me'),

  // SMS (MSG91 — cheap Indian aggregator; needs DLT registration)
  MSG91_AUTH_KEY: z.string().default(''),
  MSG91_SENDER_ID: z.string().default('GRWLKL'),
  MSG91_OTP_TEMPLATE_ID: z.string().default(''),

  // Mixpost (self-hosted social scheduler on Proxmox)
  MIXPOST_BASE_URL: z.string().default(''),
  MIXPOST_TOKEN: z.string().default(''),
  MIXPOST_WORKSPACE_UUID: z.string().default(''),

  // Razorpay
  RAZORPAY_KEY_ID: z.string().default(''),
  RAZORPAY_KEY_SECRET: z.string().default(''),
  RAZORPAY_WEBHOOK_SECRET: z.string().default(''),

  // GBP (Google Business Profile API — apply early, 0 QPM until approved)
  GBP_ACCESS_TOKEN: z.string().default(''),      // static fallback (single-account pilot)
  GBP_CLIENT_ID: z.string().default(''),         // OAuth client — see clients/gbp-oauth.ts
  GBP_CLIENT_SECRET: z.string().default(''),

  // Email (Amazon SES) — see clients/email.ts. Empty in dev (logs instead of sending).
  SES_REGION: z.string().default('ap-south-1'),
  SES_ACCESS_KEY_ID: z.string().default(''),
  SES_SECRET_ACCESS_KEY: z.string().default(''),
  EMAIL_FROM: z.string().default('hello@growlokal.com'),

  // Renewal reminder WhatsApp template — needs Meta approval first (external,
  // like GBP). Empty until you have one; the reminder job skips the WhatsApp
  // send (still sends email) and logs a warning if unset.
  WHATSAPP_RENEWAL_TEMPLATE_NAME: z.string().default(''),
  // Same situation for the pay-first "payment confirmed, here's how to log
  // in" message — a different template since it's a different use case.
  WHATSAPP_PAYMENT_CONFIRMATION_TEMPLATE_NAME: z.string().default(''),
  // Same situation again — team alert when a customer taps "Get a Website"
  // (see features/leads/website-request.ts). Empty until approved; the alert
  // still sends via email either way, so this feature works today without it.
  WHATSAPP_WEBSITE_REQUEST_TEMPLATE_NAME: z.string().default(''),
  // Your own WhatsApp number (or a shared team one) — where the above template sends.
  OPS_ALERT_PHONE: z.string().default(''),
  // Always-works fallback/companion to the WhatsApp alert above — no Meta approval needed.
  OPS_ALERT_EMAIL: z.string().default(''),

  // Where the login-instructions message points customers.
  DASHBOARD_LOGIN_URL: z.string().default('https://app.growlokal.com/login'),

  // Pricing (paise). Kept in config so it's easy to change.
  PRICE_STARTER_PAISE: z.coerce.number().default(99900),
  PRICE_GROWTH_PAISE: z.coerce.number().default(249900),
  // PRICE_PRO_PAISE removed 2026-08-18 — Pro plan dropped, see docs/DECISIONS.md
});

// Load from process.env (dotenv is loaded in server.ts before this)
export const config = schema.parse(process.env);

export const isProd = config.NODE_ENV === 'production';

// Refuse to boot in production with the insecure default JWT secret — a
// silent default here means every token is forgeable. Fail loud, not quiet.
if (isProd && config.JWT_SECRET === 'dev_insecure_change_me') {
  throw new Error(
    'JWT_SECRET is unset in production (still the dev default). Set a long random JWT_SECRET before starting.'
  );
}
