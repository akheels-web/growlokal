// AI image generation via OpenRouter (FLUX.2 Klein 4B — see docs/DECISIONS.md
// 2026-08-18 for model choice + cost). Best-effort: returns null on any
// failure rather than throwing, so a flaky image call never blocks the
// caption/text post it's attached to.
import { request } from 'undici';
import { config } from '../config.js';
import { log } from '../logger.js';

export async function generateImage(prompt: string): Promise<Buffer | null> {
  if (!config.OPENROUTER_API_KEY) {
    log.warn('OPENROUTER_API_KEY not set — skipping image generation');
    return null;
  }
  try {
    const res = await request('https://openrouter.ai/api/v1/images', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model: config.OPENROUTER_MODEL_IMAGE, prompt }),
    });
    const json = (await res.body.json().catch(() => ({}))) as any;
    if (res.statusCode >= 400) {
      log.error({ status: res.statusCode, json }, 'image generation failed');
      return null;
    }
    const b64 = json?.data?.[0]?.b64_json;
    return b64 ? Buffer.from(b64, 'base64') : null;
  } catch (err) {
    log.error({ err }, 'image generation exception');
    return null;
  }
}
