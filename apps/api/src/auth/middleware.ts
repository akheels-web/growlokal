// Fastify preHandler that authenticates via Bearer JWT and attaches claims.
// Use requireAuth on protected routes; requireBusiness also enforces tenant scoping.
import type { FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken, type AuthClaims } from './jwt.js';

declare module 'fastify' {
  interface FastifyRequest {
    auth?: AuthClaims;
  }
}

export async function requireAuth(req: FastifyRequest, reply: FastifyReply) {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const claims = verifyToken(token);
  if (!claims) {
    return reply.code(401).send({ error: 'unauthorized' });
  }
  req.auth = claims;
}

/**
 * Ensures the caller belongs to the business in :id (or is our staff/admin).
 * Prevents one tenant from touching another tenant's data.
 */
export async function requireBusiness(req: FastifyRequest, reply: FastifyReply) {
  await requireAuth(req, reply);
  if (reply.sent) return;
  const { id } = req.params as { id: string };
  const claims = req.auth!;
  if (claims.role === 'admin') return; // our team can access any tenant
  if (claims.businessId !== id) {
    return reply.code(403).send({ error: 'forbidden' });
  }
}

/**
 * Internal-team-only routes (e.g. generating a checkout link for a lead).
 * Note: nothing in this codebase sets role='admin' automatically — promote
 * a user manually (`UPDATE users SET role='admin' WHERE phone='...'`) after
 * they've signed up once via the normal OTP flow.
 */
export async function requireAdmin(req: FastifyRequest, reply: FastifyReply) {
  await requireAuth(req, reply);
  if (reply.sent) return;
  if (req.auth!.role !== 'admin') {
    return reply.code(403).send({ error: 'admin only' });
  }
}
