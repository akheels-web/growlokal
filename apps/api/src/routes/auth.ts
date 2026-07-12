// Auth routes: request an OTP, verify it, get a JWT. Onboards a new user +
// business on first login.
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { requestOtp, verifyOtp } from '../auth/otp.js';
import { signToken } from '../auth/jwt.js';
import { requireAuth } from '../auth/middleware.js';
import { queryOne } from '../db.js';

const phoneSchema = z.object({ phone: z.string().min(8) });
const verifySchema = z.object({
  phone: z.string().min(8),
  code: z.string().length(6),
  businessName: z.string().optional(), // for first-time signup
});

export function authRoutes(app: FastifyInstance) {
  // Step 1: request a code
  app.post('/api/auth/request-otp', async (req, reply) => {
    const parsed = phoneSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'bad phone' });
    await requestOtp(parsed.data.phone);
    return reply.send({ ok: true });
  });

  // Step 2: verify + issue JWT (creates user/business on first login)
  app.post('/api/auth/verify-otp', async (req, reply) => {
    const parsed = verifySchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'bad input' });
    const { phone, code, businessName } = parsed.data;

    const ok = await verifyOtp(phone, code);
    if (!ok) return reply.code(401).send({ error: 'invalid or expired code' });

    // Find or create the user (+ business if new)
    let user = await queryOne<{ id: string; business_id: string | null; role: string }>(
      'SELECT id, business_id, role FROM users WHERE phone = $1',
      [phone]
    );

    if (!user) {
      const biz = await queryOne<{ id: string }>(
        `INSERT INTO businesses (name, status, plan) VALUES ($1, 'pilot', 'trial') RETURNING id`,
        [businessName || 'My Coaching Center']
      );
      user = await queryOne(
        `INSERT INTO users (business_id, phone, role) VALUES ($1, $2, 'owner')
         RETURNING id, business_id, role`,
        [biz!.id, phone]
      );
    }

    const token = signToken({
      userId: user!.id,
      businessId: user!.business_id,
      role: user!.role,
    });
    return reply.send({ token, businessId: user!.business_id, role: user!.role });
  });

  // Who am I (for the dashboard to hydrate)
  app.get('/api/auth/me', { preHandler: requireAuth }, async (req) => req.auth);
}
