// Auth routes: request an OTP, verify it, get a JWT. Logs in an EXISTING
// customer only — see verify-otp below for why this no longer onboards a
// new user/business on first login.
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { requestOtp, verifyOtp } from '../auth/otp.js';
import { signToken } from '../auth/jwt.js';
import { requireAuth } from '../auth/middleware.js';
import { getEntitlement } from '../auth/entitlement.js';
import { queryOne } from '../db.js';

const phoneSchema = z.object({
  phone: z.string().min(10).max(15).regex(/^[0-9+]+$/, 'Invalid phone number format'),
});
const verifySchema = z.object({
  phone: z.string().min(10).max(15).regex(/^[0-9+]+$/, 'Invalid phone number format'),
  code: z.string().length(6).regex(/^[0-9]+$/, 'Code must be 6 numeric digits'),
});

export function authRoutes(app: FastifyInstance) {
  // Step 1: request a code (STRICT RATE LIMIT: max 5 OTP requests per minute per IP to prevent SMS/OTP flooding)
  app.post(
    '/api/auth/request-otp',
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '1 minute',
        },
      },
    },
    async (req, reply) => {
      const parsed = phoneSchema.safeParse(req.body);
      if (!parsed.success) return reply.code(400).send({ error: 'Please enter a valid phone number.' });
      await requestOtp(parsed.data.phone);
      return reply.send({ ok: true });
    }
  );

  // Step 2: verify + issue JWT (STRICT RATE LIMIT: max 10 verify attempts per minute to block brute-force guessing)
  app.post(
    '/api/auth/verify-otp',
    {
      config: {
        rateLimit: {
          max: 10,
          timeWindow: '1 minute',
        },
      },
    },
    async (req, reply) => {
      const parsed = verifySchema.safeParse(req.body);
      if (!parsed.success) return reply.code(400).send({ error: 'Invalid verification input format.' });
      const { phone, code } = parsed.data;

      const ok = await verifyOtp(phone, code);
      if (!ok) return reply.code(401).send({ error: 'Invalid or expired 6-digit verification code.' });

    // Find the user — do NOT create one. Self-serve trial signup was
    // retired 2026-08-18 (see docs/DECISIONS.md): a business/login account
    // now only ever comes into existence via the pay-first checkout flow
    // (routes/billing.ts's provisionFromPayFirstCheckout()), never for free
    // just by verifying an OTP. An existing paying customer still logs in
    // here exactly as before — this only removes the "create on first login"
    // branch for phones nobody has ever paid for.
    const user = await queryOne<{ id: string; business_id: string | null; role: string }>(
      'SELECT id, business_id, role FROM users WHERE phone = $1',
      [phone]
    );

    if (!user) {
      return reply.code(404).send({
        error: 'no_account',
        message: 'No GrowLokal account found for this number. Message us on WhatsApp to get started.',
      });
    }

    const token = signToken({
      userId: user!.id,
      businessId: user!.business_id,
      role: user!.role,
    });
    return reply.send({ token, businessId: user!.business_id, role: user!.role });
  });

  // Who am I (for the dashboard to hydrate) — includes plan/status/entitled
  // so the dashboard can decide whether to show the renewal wall.
  app.get('/api/auth/me', { preHandler: requireAuth }, async (req) => {
    const entitlement = req.auth!.businessId ? await getEntitlement(req.auth!.businessId) : null;
    return { ...req.auth, entitlement };
  });
}
