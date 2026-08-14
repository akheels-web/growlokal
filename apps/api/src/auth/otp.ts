// Phone OTP: generate, store hashed, verify. In dev the code is logged;
// in prod it's sent via SMS (MSG91 — cheap Indian aggregator, needs DLT).
import crypto from 'node:crypto';
import { query, queryOne } from '../db.js';
import { log } from '../logger.js';
import { config } from '../config.js';
import { sendSms } from '../clients/sms.js';

const OTP_TTL_MIN = 10;
const MAX_ATTEMPTS = 5;

function hash(code: string, phone: string): string {
  return crypto.createHash('sha256').update(`${code}:${phone}`).digest('hex');
}

export async function requestOtp(phone: string): Promise<void> {
  // 6-digit code. crypto.randomInt is fine here (not Math.random).
  const code = String(crypto.randomInt(100000, 1000000));
  const codeHash = hash(code, phone);
  const expires = new Date(Date.now() + OTP_TTL_MIN * 60_000);

  await query(
    `INSERT INTO otp_codes (phone, code_hash, expires_at) VALUES ($1, $2, $3)`,
    [phone, codeHash, expires]
  );

  if (config.NODE_ENV === 'production') {
    await sendSms(phone, `Your GrowLokal login code is ${code}. Valid ${OTP_TTL_MIN} min.`);
  } else {
    log.info({ phone, code }, 'DEV OTP (not sent over SMS)');
  }
}

export async function verifyOtp(phone: string, code: string): Promise<boolean> {
  const row = await queryOne<{ id: string; code_hash: string; attempts: number }>(
    `SELECT id, code_hash, attempts FROM otp_codes
     WHERE phone = $1 AND consumed_at IS NULL AND expires_at > now()
     ORDER BY created_at DESC LIMIT 1`,
    [phone]
  );
  if (!row) return false;
  if (row.attempts >= MAX_ATTEMPTS) return false;

  const ok = row.code_hash === hash(code, phone);
  if (ok) {
    await query(`UPDATE otp_codes SET consumed_at = now() WHERE id = $1`, [row.id]);
  } else {
    await query(`UPDATE otp_codes SET attempts = attempts + 1 WHERE id = $1`, [row.id]);
  }
  return ok;
}
