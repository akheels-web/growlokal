import 'dotenv/config'; // or run with: node --env-file=.env
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import rawBody from 'fastify-raw-body';
import { config } from './config.js';
import { log } from './logger.js';
import { auditRoutes } from './routes/audit.js';
import { whatsappRoutes } from './routes/whatsapp.js';
import { authRoutes } from './routes/auth.js';
import { featureRoutes } from './routes/features.js';
import { billingRoutes } from './routes/billing.js';
import { pool } from './db.js';
import { redis } from './redis.js';

const app = Fastify({
  logger: false,
  bodyLimit: 1048576, // 1MB payload limit to block payload bomb attacks
});

// Security Header Hardening (XSS, Clickjacking, HSTS, MIME sniffing protection)
await app.register(helmet, {
  contentSecurityPolicy: false, // Managed per-frontend or disabled for API JSON
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});

await app.register(cors, { origin: true });

// Global Rate Limiting: 100 requests per 1-minute window per IP to block DDoS attacks
await app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
  errorResponseBuilder: () => ({
    statusCode: 429,
    error: 'Too Many Requests',
    message: 'Rate limit exceeded. Please wait a minute before trying again.',
  }),
});

// Preserve raw body ONLY where routes opt in (config.rawBody) — needed for Razorpay webhook verification.
await app.register(rawBody, { global: false, field: 'rawBody', encoding: 'utf8' });

app.get('/', async () => {
  return { ok: true, name: 'GrowLokal API', version: '0.1.0', health: '/health' };
});

app.get('/health', async () => {
  await pool.query('SELECT 1');
  return { ok: true, service: 'growlokal-api' };
});

// Public Routes
auditRoutes(app);
whatsappRoutes(app);
authRoutes(app);
billingRoutes(app);
// Protected (auth enforced per-route)
featureRoutes(app);

const port = config.API_PORT;
app
  .listen({ port, host: '0.0.0.0' })
  .then(() => log.info(`API listening on :${port}`))
  .catch((err) => {
    log.error({ err }, 'failed to start');
    process.exit(1);
  });

for (const sig of ['SIGINT', 'SIGTERM'] as const) {
  process.on(sig, async () => {
    log.info(`${sig} received, shutting down`);
    await app.close();
    await pool.end();
    redis.disconnect();
    process.exit(0);
  });
}
