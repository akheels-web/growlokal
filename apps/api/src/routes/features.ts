// Real feature routes (replaces most of stubs.ts). All tenant routes are
// protected by requireBusiness so one center can't touch another's data.
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { requireBusiness, requireAuth } from '../auth/middleware.js';
import { query, queryOne } from '../db.js';
import { createScheduledSocialPost } from '../features/social/service.js';
import { createCampaign, sendCampaign } from '../features/campaigns/service.js';
import { createGbpPost, draftReviewReplies } from '../features/gbp/service.js';

export function featureRoutes(app: FastifyInstance) {
  // ── Onboarding: set business profile (fills profile_context) ──
  const onboard = z.object({
    name: z.string().min(2).optional(),
    city: z.string().optional(),
    primaryLang: z.enum(['te', 'ta', 'kn', 'ml', 'hi', 'en']).optional(),
    whatsappNumber: z.string().optional(),
    websiteUrl: z.string().optional(),
    profileContext: z.record(z.any()).optional(), // courses, fees, faculty, USPs, upiId, timings
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
       WHERE id = $1 RETURNING id, name, city, primary_lang, whatsapp_number, website_url, profile_context`,
      [id, d.name ?? null, d.city ?? null, d.primaryLang ?? null,
       d.whatsappNumber ?? null, d.websiteUrl ?? null,
       d.profileContext ? JSON.stringify(d.profileContext) : null]
    );
    return row;
  });

  // ── Public booking/enquiry microsite data (NO auth — it's a public page) ──
  // ponytail: skipped Cal.com; a public page + wa.me + UPI link is the MVP.
  // Add real calendar slots only when centers ask for time-slot booking.
  app.get('/api/public/business/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
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
    const q = req.query as { stage?: string };
    const res = q.stage
      ? await query('SELECT * FROM leads WHERE stage = $1 ORDER BY created_at DESC LIMIT 100', [q.stage])
      : await query('SELECT * FROM leads ORDER BY created_at DESC LIMIT 100');
    return { leads: res.rows };
  });

  // ── GBP: create a post ──
  const gbpBody = z.object({ focus: z.string().min(2) });
  app.post('/api/businesses/:id/gbp/post', { preHandler: requireBusiness }, async (req, reply) => {
    const parsed = gbpBody.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'focus required' });
    const { id } = req.params as { id: string };
    return createGbpPost(id, parsed.data.focus);
  });

  // ── GBP: draft review replies ──
  app.post('/api/businesses/:id/reviews/draft-replies', { preHandler: requireBusiness }, async (req) => {
    const { id } = req.params as { id: string };
    return draftReviewReplies(id);
  });

  // ── Social: schedule an Instagram/FB post ──
  const socialBody = z.object({
    channel: z.enum(['instagram', 'facebook']),
    focus: z.string().min(2),
    occasion: z.string().optional(),
    scheduledFor: z.string().datetime().optional(),
    mixpostAccountIds: z.array(z.number()).optional(),
  });
  app.post('/api/businesses/:id/social/schedule', { preHandler: requireBusiness }, async (req, reply) => {
    const parsed = socialBody.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
    const { id } = req.params as { id: string };
    return createScheduledSocialPost({
      businessId: id,
      channel: parsed.data.channel,
      focus: parsed.data.focus,
      occasion: parsed.data.occasion,
      scheduledFor: parsed.data.scheduledFor ? new Date(parsed.data.scheduledFor) : undefined,
      mixpostAccountIds: parsed.data.mixpostAccountIds,
    });
  });

  // ── Campaigns: create (draft) ──
  const campBody = z.object({
    name: z.string().min(2),
    goal: z.string().min(2),
    templateName: z.string().min(2),
    recipients: z.array(z.string()).min(1),
    scheduledFor: z.string().datetime().optional(),
  });
  app.post('/api/businesses/:id/campaigns', { preHandler: requireBusiness }, async (req, reply) => {
    const parsed = campBody.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
    const { id } = req.params as { id: string };
    const created = await createCampaign({ businessId: id, ...parsed.data,
      scheduledFor: parsed.data.scheduledFor ? new Date(parsed.data.scheduledFor) : undefined });
    // Stash recipients for the send step (kept out of DB preview for privacy;
    // in production, persist to a campaign_recipients table).
    return { ...created, note: 'Call POST .../campaigns/:cid/send to dispatch.' };
  });

  // ── Campaigns: send now ──
  const sendBody = z.object({
    recipients: z.array(z.string()).min(1),
    templateName: z.string(),
    languageCode: z.string().default('te'),
    bodyParam: z.string().default(''),
  });
  app.post('/api/businesses/:id/campaigns/:cid/send', { preHandler: requireBusiness }, async (req, reply) => {
    const parsed = sendBody.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
    const { cid } = req.params as { cid: string };
    const r = await sendCampaign(cid, parsed.data.recipients, parsed.data.templateName,
      parsed.data.languageCode, parsed.data.bodyParam);
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
