// Real feature routes (replaces most of stubs.ts). All tenant routes are
// protected by requireBusiness so one center can't touch another's data.
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { requireBusiness, requireAuth, requireAdmin } from '../auth/middleware.js';
import { requirePlan, getEntitlement, hasMinPlan } from '../auth/entitlement.js';
import { query, queryOne } from '../db.js';
import { createScheduledSocialPost } from '../features/social/service.js';
import { createCampaign, sendCampaign } from '../features/campaigns/service.js';
import { createGbpPost, draftReviewReplies } from '../features/gbp/service.js';

// A per-route limit matching the reasoning already applied to /api/audit/run
// (a cost-incurring call needs a tighter cap than the global 100/min) — found
// missing on the two other cost-incurring routes in a security review
// 2026-08-18. These are authenticated per-business routes (unlike the public
// audit endpoint), so the limit is a little looser, but still real — the
// global limiter alone let a business burn ~100 LLM+image calls/minute
// before anything stepped in.
const COSTLY_ROUTE_RATE_LIMIT = { max: 10, timeWindow: '1 minute' } as const;
// Free-text fields that go straight into an LLM prompt — cap length so a
// pasted essay (or a deliberately huge payload) can't inflate cost or
// crowd out the actual instructions in the prompt.
const PROMPT_INPUT_MAX = 300;

export function featureRoutes(app: FastifyInstance) {
  // ── Onboarding: set business profile (fills profile_context) ──
  const onboard = z.object({
    name: z.string().min(2).optional(),
    city: z.string().optional(),
    primaryLang: z.enum(['te', 'ta', 'kn', 'ml', 'hi', 'en']).optional(),
    whatsappNumber: z.string().optional(),
    websiteUrl: z.string().optional(),
    profileContext: z.record(z.any()).optional(), // services, pricing, offers, staff/highlights, upiId, timings
    // mixpostAccountIds and gbpRefreshToken REMOVED from here 2026-08-18
    // (security review): letting a business set either directly, itself,
    // was a real gap —
    //   - mixpostAccountIds: nothing cross-checked that the IDs actually
    //     belonged to this business inside Mixpost's own workspace. With one
    //     shared MIXPOST_TOKEN for everyone, a business could type in
    //     another business's account ID and get us to publish there.
    //   - gbpRefreshToken: this let a business paste in ANY string directly,
    //     completely bypassing the real Google OAuth consent flow
    //     (routes/gbp-oauth.ts) that's supposed to be the only way this gets
    //     set. Superseded now that flow is fully built — this field was
    //     leftover from before it existed.
    // Both now admin-only — see POST /api/admin/businesses/:id/mixpost-accounts
    // below; gbp_refresh_token is set exclusively by the real OAuth callback.
  });
  app.put('/api/businesses/:id', { preHandler: requireBusiness }, async (req, reply) => {
    const parsed = onboard.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
    const { id } = req.params as { id: string };
    const d = parsed.data;
    // COALESCE keeps existing values when a field is omitted.
    const row = await queryOne(
      `UPDATE businesses SET
         name = COALESCE($2, name), city = COALESCE($3, city),
         primary_lang = COALESCE($4, primary_lang),
         whatsapp_number = COALESCE($5, whatsapp_number),
         website_url = COALESCE($6, website_url),
         profile_context = COALESCE($7, profile_context)
       WHERE id = $1 RETURNING id, name, city, primary_lang, whatsapp_number, website_url, profile_context, mixpost_account_ids`,
      [id, d.name ?? null, d.city ?? null, d.primaryLang ?? null,
       d.whatsappNumber ?? null, d.websiteUrl ?? null,
       d.profileContext ? JSON.stringify(d.profileContext) : null]
    );
    return row;
  });

  // ── Admin-only: link a business's verified Mixpost account IDs. Not
  // self-serve — an admin sets this only after actually confirming inside
  // Mixpost's own dashboard which accounts belong to this business. ──
  const mixpostLinkBody = z.object({ mixpostAccountIds: z.array(z.number().int().positive()).max(10) });
  app.post('/api/admin/businesses/:id/mixpost-accounts', { preHandler: requireAdmin }, async (req, reply) => {
    const parsed = mixpostLinkBody.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
    const { id } = req.params as { id: string };
    const row = await queryOne(
      `UPDATE businesses SET mixpost_account_ids = $2 WHERE id = $1 RETURNING id, mixpost_account_ids`,
      [id, parsed.data.mixpostAccountIds]
    );
    if (!row) return reply.code(404).send({ error: 'business not found' });
    return row;
  });

  // ── Public booking/enquiry microsite data (NO auth — it's a public page) ──
  // ponytail: skipped Cal.com; a public page + wa.me + UPI link is the MVP.
  // Add real calendar slots only when centers ask for time-slot booking.
  //
  // Booking microsite is a Growth-tier feature — a lapsed/trial/Starter-only
  // business's page goes dark exactly like everything else (the "Netflix"
  // rule). We return a plain 404 here (not a 402 "plan_required" message)
  // since the visitor is a random member of the public, not the business
  // owner — no reason to expose billing details to them.
  app.get('/api/public/business/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const entitlement = await getEntitlement(id);
    if (!entitlement || !hasMinPlan(entitlement, 'growth')) return reply.code(404).send({ error: 'not found' });

    const row = await queryOne<{ name: string; city: string; whatsapp_number: string | null; profile_context: Record<string, unknown> }>(
      `SELECT name, city, whatsapp_number, profile_context FROM businesses WHERE id = $1 AND status IN ('active','pilot')`,
      [id]
    );
    if (!row) return reply.code(404).send({ error: 'not found' });
    return row;
  });

  // ── ROI dashboard (real) ──
  app.get('/api/businesses/:id/roi', { preHandler: requireBusiness }, async (req) => {
    const { id } = req.params as { id: string };
    const res = await query(
      `SELECT month, enquiries, demos_booked, leads_captured
       FROM v_monthly_enquiries WHERE business_id = $1 ORDER BY month DESC LIMIT 12`,
      [id]
    );
    return { businessId: id, monthly: res.rows };
  });

  // ── Leads (staff/admin) ──
  app.get('/api/leads', { preHandler: requireAuth }, async (req) => {
    const q = req.query as { stage?: string; mine?: string };
    const conditions: string[] = [];
    const params: unknown[] = [];
    if (q.stage) { params.push(q.stage); conditions.push(`stage = $${params.length}`); }
    if (q.mine === 'true') { params.push(req.auth!.userId); conditions.push(`owner_user_id = $${params.length}`); }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const res = await query(`SELECT * FROM leads ${where} ORDER BY created_at DESC LIMIT 100`, params);
    return { leads: res.rows };
  });

  // ── Leads: claim / assign / unassign ──
  // A small sales team (1-2 reps) mostly needs "assign to me"; omit ownerUserId
  // to do that. Pass an explicit ownerUserId (or null) to assign someone else /
  // unassign — no separate "list of staff" UI until the team is bigger than that.
  const assignBody = z.object({ ownerUserId: z.string().uuid().nullable().optional() });
  app.patch('/api/leads/:id/assign', { preHandler: requireAuth }, async (req, reply) => {
    const parsed = assignBody.safeParse(req.body ?? {});
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
    const { id } = req.params as { id: string };
    const ownerUserId = parsed.data.ownerUserId !== undefined ? parsed.data.ownerUserId : req.auth!.userId;
    const row = await queryOne(
      `UPDATE leads SET owner_user_id = $2 WHERE id = $1 RETURNING id, owner_user_id`,
      [id, ownerUserId]
    );
    if (!row) return reply.code(404).send({ error: 'lead not found' });
    return row;
  });

  // ── GBP: create a post (Starter+ — the "GBP posts + WhatsApp responder" tier) ──
  const gbpBody = z.object({ focus: z.string().min(2).max(PROMPT_INPUT_MAX) });
  app.post(
    '/api/businesses/:id/gbp/post',
    { preHandler: requirePlan('starter'), config: { rateLimit: COSTLY_ROUTE_RATE_LIMIT } },
    async (req, reply) => {
      const parsed = gbpBody.safeParse(req.body);
      if (!parsed.success) return reply.code(400).send({ error: 'focus required (2-300 chars)' });
      const { id } = req.params as { id: string };
      return createGbpPost(id, parsed.data.focus);
    }
  );

  // ── GBP: draft review replies (Growth+) ──
  app.post('/api/businesses/:id/reviews/draft-replies', { preHandler: requirePlan('growth') }, async (req) => {
    const { id } = req.params as { id: string };
    return draftReviewReplies(id);
  });

  // ── Social: schedule an Instagram/FB post (Growth+) ──
  // mixpostAccountIds removed from here 2026-08-18 (security review) — it was
  // accepted but never actually used (features/social/service.ts never read
  // it; the worker always reads businesses.mixpost_account_ids fresh at
  // publish time). Dead input that implied a caller could influence which
  // Mixpost accounts get posted to — they never actually could, but removing
  // it removes the false impression too.
  const socialBody = z.object({
    channel: z.enum(['instagram', 'facebook']),
    focus: z.string().min(2).max(PROMPT_INPUT_MAX),
    occasion: z.string().max(PROMPT_INPUT_MAX).optional(),
    scheduledFor: z.string().datetime().optional(),
  });
  app.post(
    '/api/businesses/:id/social/schedule',
    { preHandler: requirePlan('growth'), config: { rateLimit: COSTLY_ROUTE_RATE_LIMIT } },
    async (req, reply) => {
      const parsed = socialBody.safeParse(req.body);
      if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
      const { id } = req.params as { id: string };
      return createScheduledSocialPost({
        businessId: id,
        channel: parsed.data.channel,
        focus: parsed.data.focus,
        occasion: parsed.data.occasion,
        scheduledFor: parsed.data.scheduledFor ? new Date(parsed.data.scheduledFor) : undefined,
      });
    }
  );

  // ── Campaigns: create (draft) (Growth+) ──
  const campBody = z.object({
    name: z.string().min(2),
    goal: z.string().min(2),
    templateName: z.string().min(2),
    recipients: z.array(z.string()).min(1),
    scheduledFor: z.string().datetime().optional(),
  });
  app.post('/api/businesses/:id/campaigns', { preHandler: requirePlan('growth') }, async (req, reply) => {
    const parsed = campBody.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
    const { id } = req.params as { id: string };
    const created = await createCampaign({ businessId: id, ...parsed.data,
      scheduledFor: parsed.data.scheduledFor ? new Date(parsed.data.scheduledFor) : undefined });
    // Stash recipients for the send step (kept out of DB preview for privacy;
    // in production, persist to a campaign_recipients table).
    return { ...created, note: 'Call POST .../campaigns/:cid/send to dispatch.' };
  });

  // ── Campaigns: send now (Growth+) ──
  // Recipients, template name, language, and message body all come from what
  // was stored at creation time — nothing to re-supply. Safe to call again to
  // retry any recipients still 'pending' (e.g. after a credit top-up).
  app.post('/api/businesses/:id/campaigns/:cid/send', { preHandler: requirePlan('growth') }, async (req, reply) => {
    const { cid } = req.params as { cid: string };
    const r = await sendCampaign(cid);
    return r;
  });

  // ── Wallet: check WhatsApp credit balance ──
  app.get('/api/businesses/:id/wallet', { preHandler: requireBusiness }, async (req) => {
    const { id } = req.params as { id: string };
    const res = await query<{ wa_credit_paise: number }>(
      `SELECT wa_credit_paise FROM businesses WHERE id = $1`, [id]
    );
    return { creditPaise: res.rows[0]?.wa_credit_paise ?? 0 };
  });
}
