// Centralised env config with validation. Fails fast on missing critical vars.
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.string().default('development'),
  API_PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),

  // WhatsApp
  WHATSAPP_PHONE_NUMBER_ID: z.string().default(''),
  WHATSAPP_ACCESS_TOKEN: z.string().default(''),
  WHATSAPP_VERIFY_TOKEN: z.string().default('dev_verify_token'),
  WHATSAPP_API_VERSION: z.string().default('v21.0'),

  // Google
  GOOGLE_PLACES_API_KEY: z.string().default(''),

  // LLM
  LLM_PROVIDER: z.enum(['gemini', 'anthropic', 'ollama']).default('gemini'),
  LLM_MODEL_CHEAP: z.string().default('gemini-2.0-flash-lite'),
  LLM_MODEL_QUALITY: z.string().default('gemini-2.5-flash'),
  GEMINI_API_KEY: z.string().default(''),
  ANTHROPIC_API_KEY: z.string().default(''),
  OLLAMA_BASE_URL: z.string().default('http://localhost:11434'),
  OLLAMA_MODEL: z.string().default('qwen2.5:3b'),

  // Auth
  JWT_SECRET: z.string().default('dev_insecure_change_me'),

  // SMS (MSG91 — cheap Indian aggregator; needs DLT registration)
  MSG91_AUTH_KEY: z.string().default(''),
  MSG91_SENDER_ID: z.string().default('PRCHAR'),
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
  GBP_ACCESS_TOKEN: z.string().default(''),

  // Pricing (paise). Kept in config so it's easy to change.
  PRICE_STARTER_PAISE: z.coerce.number().default(99900),
  PRICE_GROWTH_PAISE: z.coerce.number().default(249900),
  PRICE_PRO_PAISE: z.coerce.number().default(499900),
});

// Load from process.env (dotenv is loaded in server.ts before this)
export const config = schema.parse(process.env);

export const isProd = config.NODE_ENV === 'production';
