// Google Business Profile OAuth — token exchange AND the consent-flow URL
// builder used by both real entry points (updated 2026-08-18; this comment
// was badly stale — it used to describe a manual OAuth-Playground
// copy-paste workflow and a since-removed `gbpRefreshToken` onboarding
// field, neither of which exist anymore now that the real flow is built):
//   - Dashboard: "Connect Google Business Profile" button -> routes/gbp-oauth.ts
//   - WhatsApp: the customer self-service menu's "Connect Google" option -> routes/whatsapp.ts
// Both call generateConsentUrl() below; routes/gbp-oauth.ts's OAuth callback
// is the ONLY place gbp_refresh_token ever gets written now — there is no
// other, manual way to set it.
import { request } from 'undici';
import crypto from 'node:crypto';
import { config } from '../config.js';
import { log } from '../logger.js';
import { redis } from '../redis.js';

const TOKEN_CACHE_TTL_SECONDS = 50 * 60; // Google access tokens last ~1h; refresh a bit early.
const STATE_TTL_SECONDS = 10 * 60;

function cacheKey(businessId: string): string {
  return `gbp:access_token:${businessId}`;
}
export function oauthStateKey(state: string): string {
  return `gbp:oauth_state:${state}`;
}

/**
 * Builds the Google consent URL for a business, storing a one-time state
 * token in Redis so the callback (routes/gbp-oauth.ts) can tie the redirect
 * back to the right business. Shared by two entry points, added 2026-08-18:
 * the dashboard's "Connect Google Business Profile" button (authenticated
 * fetch, see routes/gbp-oauth.ts for why) and the WhatsApp customer menu's
 * "Connect Google" option (routes/whatsapp.ts) — same underlying flow either
 * way, just a different way of getting the link in front of the owner.
 */
export async function generateConsentUrl(businessId: string): Promise<string | null> {
  if (!config.GBP_CLIENT_ID) {
    // Used to fail silently (code-quality finding, security review 2026-08-18)
    // — both callers already handle a null return correctly, but a missing
    // config var should always be visible in logs, not just inferred from a
    // user-facing "not configured yet" message.
    log.warn({ businessId }, 'generateConsentUrl: GBP_CLIENT_ID not set — cannot build a consent URL');
    return null;
  }

  const state = crypto.randomUUID();
  await redis.set(oauthStateKey(state), businessId, 'EX', STATE_TTL_SECONDS);

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', config.GBP_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', config.GBP_REDIRECT_URI);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/business.manage');
  authUrl.searchParams.set('access_type', 'offline'); // required to get a refresh_token back
  authUrl.searchParams.set('prompt', 'consent');       // forces refresh_token on repeat connects too
  authUrl.searchParams.set('state', state);
  return authUrl.toString();
}

/**
 * Resolve a usable GBP access token for a business: a cached/fresh one from
 * its stored refresh_token if present, otherwise the static fallback
 * GBP_ACCESS_TOKEN from config (useful for a single-account pilot before
 * per-business OAuth is worth setting up). Returns null if neither exists.
 *
 * SECURITY (fixed 2026-08-18, found while closing a related review item):
 * the static fallback ONLY applies when this business has no refresh_token
 * at all. It used to also apply when a real refresh_token existed but the
 * exchange call failed (network blip, expired token, etc.) — that meant a
 * transient Google API failure could silently post THIS business's content
 * using the SHARED PILOT ACCOUNT's token, i.e. to the wrong Google Business
 * Profile entirely. A business that has done real OAuth must only ever post
 * as itself or not at all — never degrade to someone else's account.
 */
export async function resolveGbpAccessToken(
  businessId: string,
  refreshToken: string | null
): Promise<string | null> {
  if (!refreshToken) return config.GBP_ACCESS_TOKEN || null;

  const cached = await redis.get(cacheKey(businessId));
  if (cached) return cached;

  const fresh = await exchangeRefreshToken(refreshToken);
  if (!fresh) return null; // do NOT fall back to the shared static token — wrong-account risk

  await redis.set(cacheKey(businessId), fresh, 'EX', TOKEN_CACHE_TTL_SECONDS);
  return fresh;
}

async function exchangeRefreshToken(refreshToken: string): Promise<string | null> {
  if (!config.GBP_CLIENT_ID || !config.GBP_CLIENT_SECRET) {
    log.warn('GBP_CLIENT_ID/SECRET not set — cannot refresh a per-business GBP token');
    return null;
  }
  try {
    const res = await request('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: config.GBP_CLIENT_ID,
        client_secret: config.GBP_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }).toString(),
    });
    const json = (await res.body.json()) as any;
    if (res.statusCode >= 400) {
      log.error({ status: res.statusCode, json }, 'GBP token refresh failed');
      return null;
    }
    return json?.access_token ?? null;
  } catch (err) {
    log.error({ err }, 'GBP token refresh exception');
    return null;
  }
}
