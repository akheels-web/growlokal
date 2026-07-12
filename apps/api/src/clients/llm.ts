// LLM abstraction: one generate() call, swappable provider.
// Cost strategy: 'cheap' tier (Gemini Flash-Lite / Ollama) for bulk drafts,
// 'quality' tier (Gemini 2.5 Flash / Claude) for customer-facing vernacular.
import { request } from 'undici';
import { config } from '../config.js';
import { log } from '../logger.js';

export type Tier = 'cheap' | 'quality';

export interface GenerateOpts {
  system?: string;
  prompt: string;
  tier?: Tier;
  maxTokens?: number;
  temperature?: number;
}

export async function generate(opts: GenerateOpts): Promise<string> {
  const { system, prompt, tier = 'quality', maxTokens = 800, temperature = 0.7 } = opts;

  switch (config.LLM_PROVIDER) {
    case 'gemini':
      return generateGemini(system, prompt, tier, maxTokens, temperature);
    case 'anthropic':
      return generateAnthropic(system, prompt, maxTokens, temperature);
    case 'ollama':
      return generateOllama(system, prompt, temperature);
    default:
      throw new Error(`Unknown LLM_PROVIDER: ${config.LLM_PROVIDER}`);
  }
}

// ── Gemini (default; cheapest for vernacular at scale) ────────
async function generateGemini(
  system: string | undefined,
  prompt: string,
  tier: Tier,
  maxTokens: number,
  temperature: number
): Promise<string> {
  const model = tier === 'cheap' ? config.LLM_MODEL_CHEAP : config.LLM_MODEL_QUALITY;
  if (!config.GEMINI_API_KEY) {
    log.warn('GEMINI_API_KEY not set — returning stub text');
    return `[stub ${model} output for prompt: ${prompt.slice(0, 60)}...]`;
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.GEMINI_API_KEY}`;
  const body = {
    systemInstruction: system ? { parts: [{ text: system }] } : undefined,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { maxOutputTokens: maxTokens, temperature },
  };
  const res = await request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = (await res.body.json()) as any;
  if (res.statusCode >= 400) {
    log.error({ status: res.statusCode, json }, 'Gemini failed');
    throw new Error(json?.error?.message ?? 'gemini error');
  }
  return json?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

// ── Anthropic Claude (quality vernacular; higher cost) ────────
async function generateAnthropic(
  system: string | undefined,
  prompt: string,
  maxTokens: number,
  temperature: number
): Promise<string> {
  if (!config.ANTHROPIC_API_KEY) {
    log.warn('ANTHROPIC_API_KEY not set — returning stub text');
    return `[stub claude output for: ${prompt.slice(0, 60)}...]`;
  }
  const res = await request('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': config.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      temperature,
      system,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const json = (await res.body.json()) as any;
  if (res.statusCode >= 400) {
    log.error({ status: res.statusCode, json }, 'Anthropic failed');
    throw new Error(json?.error?.message ?? 'anthropic error');
  }
  return json?.content?.[0]?.text ?? '';
}

// ── Ollama (local on Proxmox; free, for cheap drafts) ─────────
async function generateOllama(
  system: string | undefined,
  prompt: string,
  temperature: number
): Promise<string> {
  const res = await request(`${config.OLLAMA_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: config.OLLAMA_MODEL,
      system,
      prompt,
      stream: false,
      options: { temperature },
    }),
  });
  const json = (await res.body.json()) as any;
  return json?.response ?? '';
}
