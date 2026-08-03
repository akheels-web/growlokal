// Direct HTTP endpoint to run an audit — handy for testing, for the web
// "free audit" form, and for n8n to call. The WhatsApp path uses the same service.
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { runAudit } from '../features/audit/service.js';

const bodySchema = z.object({
  phone: z.string().min(10).max(15).regex(/^[0-9+]+$/),
  businessName: z.string().min(2).max(100),
  city: z.string().max(50).optional(),
  lang: z.enum(['te', 'ta', 'kn', 'ml', 'hi', 'en']).optional(),
  industry: z.string().max(50).optional(),
});

export function auditRoutes(app: FastifyInstance) {
  // STRICT RATE LIMIT: max 5 audit scans per minute per IP to block scraper bots and automated form spam
  app.post(
    '/api/audit/run',
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '1 minute',
        },
      },
    },
    async (req, reply) => {
      const parsed = bodySchema.safeParse(req.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: 'Please provide a valid business name and phone number.' });
      }
      const result = await runAudit(parsed.data);
      return reply.send(result);
    }
  );
}
