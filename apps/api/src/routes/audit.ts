// Direct HTTP endpoint to run an audit — handy for testing, for the web
// "free audit" form, and for n8n to call. The WhatsApp path uses the same service.
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { autocompletePlaces } from '../clients/places.js';
import { runAudit } from '../features/audit/service.js';

const bodySchema = z.object({
  phone: z.string().min(10).max(15).regex(/^[0-9+]+$/),
  businessName: z.string().min(2).max(100),
  city: z.string().max(50).optional(),
  lang: z.enum(['te', 'ta', 'kn', 'ml', 'hi', 'en']).optional(),
});

export function auditRoutes(app: FastifyInstance) {
  // Live Google Places Autocomplete endpoint.
  // RATE LIMIT: calls the paid Places API — cap it even though it's just
  // search-as-you-type, so it can't be hammered for free API spend.
  app.get(
    '/api/audit/autocomplete',
    { config: { rateLimit: { max: 20, timeWindow: '1 minute' } } },
    async (req, reply) => {
      const query = (req.query as any)?.q as string;
      if (!query || query.trim().length < 2) {
        return reply.send({ suggestions: [] });
      }
      const suggestions = await autocompletePlaces(query);
      return reply.send({ suggestions });
    }
  );

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
