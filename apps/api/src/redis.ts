// Thin Redis client wrapper, mirroring db.ts's style. Used for short-lived
// state that must survive restarts and work across multiple API instances
// (currently: the WhatsApp audit-bot conversation state machine).
import Redis from 'ioredis';
import { config } from './config.js';
import { log } from './logger.js';

export const redis = new Redis(config.REDIS_URL, {
  maxRetriesPerRequest: 3,
  lazyConnect: false,
});

redis.on('error', (err) => log.error({ err }, 'redis connection error'));
