// Google Business Profile OAuth token refresh.
//
// SCOPE: this file builds the token-EXCHANGE mechanism only (refresh_token ->
// short-lived access_token). It does NOT build the authorization-consent
// redirect flow (the "click to connect your Google account" UI) — that
// requires prerequisites only you can complete:
//   1. A Google Cloud project with an OAuth 2.0 Client ID (Console >
//      APIs & Services > Credentials). Set GBP_CLIENT_ID/GBP_CLIENT_SECRET.
//   2. Approved Google Business Profile API access (0 QPM until Google
//      approves — see Technical-Setup-Guide.md).
// Until both exist, there is nothing for a consent screen to authorize, so
// building that route now would be untestable scaffolding.
//
// ONE-TIME per business, once the above are ready: use Google's OAuth 2.0
// Playground (https://developers.google.com/oauthplayground) — set your own
// client ID/secret in its settings, authorize the
// "https://www.googleapis.com/auth/business.manage" scope, exchange the
// authorization code, and copy the resulting refresh_token. Save it via
// PUT /api/businesses/:id { gbpRefreshToken: "..." } (see routes/features.ts).
// A proper in-app "Connect Google" button is a good follow-up once you're
// managing more than a handful of businesses.
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
  if (!config.GBP_CLIENT_ID) return null;

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
 */
export async function resolveGbpAccessToken(
  businessId: string,
  refreshToken: string | null
): Promise<string | null> {
  if (!refreshToken) return config.GBP_ACCESS_TOKEN || null;

  const cached = await redis.get(cacheKey(businessId));
  if (cached) return cached;

  const fresh = await exchangeRefreshToken(refreshToken);
  if (!fresh) return config.GBP_ACCESS_TOKEN || null; // degrade to static token rather than fail outright

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
