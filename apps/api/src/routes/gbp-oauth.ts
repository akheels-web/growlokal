// Google Business Profile — the actual "connect your Google account" consent
// flow. See clients/gbp-oauth.ts's header for why this didn't exist before
// (no real OAuth client / GBP API access to test against) — both now exist
// (2026-08-18), so this is real, not scaffolding. VERIFY the exact
// mybusinessaccountmanagement/mybusinessbusinessinformation endpoint shapes
// below against Google's current docs before relying on them in production —
// confirmed once via their docs while writing this, but this API surface has
// shifted versions before (routes/../features/gbp/service.ts's posting call
// still targets the older v4 mybusiness.googleapis.com for that reason).
import type { FastifyInstance } from 'fastify';
import { request } from 'undici';
import { z } from 'zod';
import { config } from '../config.js';
import { log } from '../logger.js';
import { requireBusiness } from '../auth/middleware.js';
import { requirePlan } from '../auth/entitlement.js';
import { resolveGbpAccessToken, generateConsentUrl, oauthStateKey } from '../clients/gbp-oauth.js';
import { sendTemplate } from '../clients/whatsapp.js';
import { sendEmail } from '../clients/email.js';
import { query, queryOne } from '../db.js';
import { redis } from '../redis.js';

export function gbpOAuthRoutes(app: FastifyInstance) {
  // Step 1: business owner clicks "Connect Google Business Profile". This
  // route needs the Authorization: Bearer header (requirePlan/requireAuth) —
  // which only a real fetch() call can send, not a plain <a href> navigation
  // — so it RETURNS the Google consent URL as JSON; the dashboard does
  // window.location.href = authUrl itself. The actual browser redirect to
  // Google (and Google's redirect back to our callback below) needs no auth
  // header at all, so those legs are plain navigation, unauthenticated by
  // design — the state param is what ties the callback back to a business.
  app.get('/api/businesses/:id/gbp/connect', { preHandler: requirePlan('starter') }, async (req, reply) => {
    const { id: businessId } = req.params as { id: string };
    const authUrl = await generateConsentUrl(businessId);
    if (!authUrl) {
      return reply.code(503).send({ error: 'GBP OAuth not configured (GBP_CLIENT_ID unset)' });
    }
    return { authUrl };
  });

  // Step 2: Google redirects here with an authorization code. Public route —
  // Google calls this directly, no Authorization header exists at this point.
  app.get('/api/gbp/oauth/callback', async (req, reply) => {
    const { code, state, error } = req.query as { code?: string; state?: string; error?: string };
    const failUrl = `${config.WEB_APP_BASE_URL}/dashboard?gbp_error=1`;
    if (error || !code || !state) {
      log.warn({ error }, 'GBP OAuth callback missing code/state or user denied consent');
      return reply.redirect(failUrl);
    }

    const businessId = await redis.get(oauthStateKey(state));
    if (!businessId) {
      log.warn({ state }, 'GBP OAuth callback: unknown/expired state — possible CSRF or stale link');
      return reply.redirect(failUrl);
    }
    await redis.del(oauthStateKey(state)); // one-time use

    try {
      const res = await request('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: config.GBP_CLIENT_ID,
          client_secret: config.GBP_CLIENT_SECRET,
          code,
          redirect_uri: config.GBP_REDIRECT_URI,
          grant_type: 'authorization_code',
        }).toString(),
      });
      const json = (await res.body.json()) as any;
      if (res.statusCode >= 400 || !json?.refresh_token) {
        log.error({ status: res.statusCode, json }, 'GBP OAuth code exchange failed');
        return reply.redirect(failUrl);
      }

      // The refresh_token is tied to the Google ACCOUNT, not a specific
      // location — safe to persist immediately, independent of which
      // location they pick next (or don't pick yet).
      await query(`UPDATE businesses SET gbp_refresh_token = $1 WHERE id = $2`, [json.refresh_token, businessId]);
      return reply.redirect(`${config.WEB_APP_BASE_URL}/dashboard/${businessId}/gbp/connect`);
    } catch (err) {
      log.error({ err }, 'GBP OAuth callback exception');
      return reply.redirect(failUrl);
    }
  });

  // Step 3: web page lists locations under the now-connected Google account.
  app.get('/api/businesses/:id/gbp/locations', { preHandler: requireBusiness }, async (req, reply) => {
    const { id: businessId } = req.params as { id: string };
    const biz = await queryOne<{ gbp_refresh_token: string | null }>(
      `SELECT gbp_refresh_token FROM businesses WHERE id = $1`,
      [businessId]
    );
    if (!biz?.gbp_refresh_token) {
      return reply.code(400).send({ error: 'not connected — go through /gbp/connect first' });
    }
    const accessToken = await resolveGbpAccessToken(businessId, biz.gbp_refresh_token);
    if (!accessToken) return reply.code(502).send({ error: 'could not get a Google access token' });

    try {
      const accountsRes = await request('https://mybusinessaccountmanagement.googleapis.com/v1/accounts', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const accountsJson = (await accountsRes.body.json()) as any;
      const accounts: { name: string }[] = accountsJson?.accounts ?? [];

      const locations: { id: string; title: string }[] = [];
      for (const account of accounts) {
        const locRes = await request(
          `https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations?readMask=name,title`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const locJson = (await locRes.body.json()) as any;
        for (const loc of locJson?.locations ?? []) {
          locations.push({ id: loc.name, title: loc.title ?? loc.name });
        }
      }
      if (locations.length === 0) {
        // Mirrors the web page's own "no locations found" state on WhatsApp
        // too (2026-08-18) — a competitor's bot does this and it matters:
        // someone who closes the browser tab without noticing the error
        // still gets nudged instead of just silently stalling.
        await alertNoLocationsFound(businessId);
      }
      return { locations };
    } catch (err) {
      log.error({ err }, 'GBP locations list failed');
      return reply.code(502).send({ error: 'could not list Google Business Profile locations' });
    }
  });

  // Step 4: they pick one -> persist it. This is the ONLY location we'll post to.
  const selectBody = z.object({ locationId: z.string().min(1) });
  app.post('/api/businesses/:id/gbp/locations', { preHandler: requireBusiness }, async (req, reply) => {
    const parsed = selectBody.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'locationId required' });
    const { id: businessId } = req.params as { id: string };
    await query(`UPDATE businesses SET gbp_location_id = $1 WHERE id = $2`, [parsed.data.locationId, businessId]);
    return { ok: true };
  });
}

async function alertNoLocationsFound(businessId: string): Promise<void> {
  const owner = await queryOne<{ name: string; phone: string; email: string | null }>(
    `SELECT b.name, u.phone, u.email FROM businesses b
     JOIN users u ON u.business_id = b.id AND u.role = 'owner'
     WHERE b.id = $1 LIMIT 1`,
    [businessId]
  );
  if (!owner) return;

  if (config.WHATSAPP_GBP_NO_LOCATIONS_TEMPLATE_NAME) {
    await sendTemplate(owner.phone, config.WHATSAPP_GBP_NO_LOCATIONS_TEMPLATE_NAME, 'en', [
      { type: 'body', parameters: [{ type: 'text', text: owner.name }] },
    ]);
  } else {
    log.warn({ businessId }, 'WHATSAPP_GBP_NO_LOCATIONS_TEMPLATE_NAME not set — skipping WhatsApp alert (email still sent if configured)');
  }

  if (owner.email) {
    await sendEmail(
      owner.email,
      'We could not find a Google Business Profile on that account',
      `Hi,\n\nWe connected to your Google account for ${owner.name}, but couldn't find any Google Business Profile locations on it.\n\nPlease try connecting again using the Google account that actually manages your business listing — you can retry any time from your dashboard.\n\n— GrowLokal`
    );
  }
}
