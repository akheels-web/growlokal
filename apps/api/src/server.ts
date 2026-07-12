// API entry point. Loads env, wires routes, starts Fastify.
import 'dotenv/config'; // or run with: node --env-file=.env
import Fastify from 'fastify';
import cors from '@fastify/cors';
import rawBody from 'fastify-raw-body';
import { config } from './config.js';
import { log } from './logger.js';
import { auditRoutes } from './routes/audit.js';
import { whatsappRoutes } from './routes/whatsapp.js';
import { authRoutes } from './routes/auth.js';
import { featureRoutes } from './routes/features.js';
import { billingRoutes } from './routes/billing.js';
import { pool } from './db.js';

const app = Fastify({ logger: false });

await app.register(cors, { origin: true });
// Preserve raw body ONLY where routes opt in (config.rawBody) — needed for
// Razorpay webhook signature verification.
await app.register(rawBody, { global: false, field: 'rawBody', encoding: 'utf8' });

app.get('/health', async () => {
  await pool.query('SELECT 1');
  return { ok: true, service: 'growlokal-api' };
});

// Public
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
    process.exit(0);
  });
}
