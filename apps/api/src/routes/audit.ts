// Direct HTTP endpoint to run an audit — handy for testing, for the web
// "free audit" form, and for n8n to call. The WhatsApp path uses the same service.
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { runAudit } from '../features/audit/service.js';

const bodySchema = z.object({
  phone: z.string().min(8),
  businessName: z.string().min(2),
  city: z.string().optional(),
  lang: z.enum(['te', 'ta', 'kn', 'ml', 'hi', 'en']).optional(),
});

export function auditRoutes(app: FastifyInstance) {
  app.post('/api/audit/run', async (req, reply) => {
    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }
    const result = await runAudit(parsed.data);
    return reply.send(result);
  });
}
