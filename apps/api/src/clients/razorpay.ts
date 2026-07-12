// Razorpay client + webhook signature verification.
// Subscriptions API: https://razorpay.com/docs/api/payments/subscriptions/
import { request } from 'undici';
import crypto from 'node:crypto';
import { config } from '../config.js';
import { log } from '../logger.js';

function authHeader(): string {
  const raw = `${config.RAZORPAY_KEY_ID}:${config.RAZORPAY_KEY_SECRET}`;
  return 'Basic ' + Buffer.from(raw).toString('base64');
}

export interface CreateSubInput {
  planId: string;          // a Razorpay plan_id you created in their dashboard
  totalCount?: number;     // billing cycles (e.g. 12 for a year of monthly)
  notes?: Record<string, string>;
}

export async function createSubscription(input: CreateSubInput): Promise<{ id: string; shortUrl: string } | null> {
  if (!config.RAZORPAY_KEY_ID) {
    log.warn('Razorpay not configured — dry-run subscription');
    return { id: 'dry-run', shortUrl: 'https://example.com/pay' };
  }
  try {
    const res = await request('https://api.razorpay.com/v1/subscriptions', {
      method: 'POST',
      headers: { Authorization: authHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plan_id: input.planId,
        total_count: input.totalCount ?? 12,
        customer_notify: 1,
        notes: input.notes ?? {},
      }),
    });
    const json = (await res.body.json()) as any;
    if (res.statusCode >= 400) {
      log.error({ status: res.statusCode, json }, 'Razorpay sub create failed');
      return null;
    }
    return { id: json.id, shortUrl: json.short_url };
  } catch (err) {
    log.error({ err }, 'Razorpay exception');
    return null;
  }
}

/**
 * Verify the X-Razorpay-Signature header on a webhook using the webhook secret.
 * MUST be computed over the RAW request body (not the parsed object).
 */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  if (!config.RAZORPAY_WEBHOOK_SECRET) return false;
  const expected = crypto
    .createHmac('sha256', config.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');
  // timing-safe compare
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}
