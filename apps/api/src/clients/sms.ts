// SMS via MSG91 (cheap Indian aggregator, ~₹0.11-0.25/SMS).
// Requires DLT registration (one-time ₹5,900) + an approved template.
// Twilio is ~₹7/SMS for India — do NOT use it for domestic volume.
import { request } from 'undici';
import { config } from '../config.js';
import { log } from '../logger.js';

export async function sendSms(phone: string, message: string): Promise<boolean> {
  if (!config.MSG91_AUTH_KEY) {
    log.warn({ phone, message }, 'MSG91_AUTH_KEY not set — SMS not sent (dev)');
    return true;
  }
  try {
    // MSG91 flow API. Number must be in 91XXXXXXXXXX form (no +).
    const to = phone.replace(/^\+/, '');
    const res = await request('https://control.msg91.com/api/v5/flow/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', authkey: config.MSG91_AUTH_KEY },
      body: JSON.stringify({
        template_id: config.MSG91_OTP_TEMPLATE_ID,
        sender: config.MSG91_SENDER_ID,
        recipients: [{ mobiles: to, message }],
      }),
    });
    if (res.statusCode >= 400) {
      log.error({ status: res.statusCode }, 'MSG91 send failed');
      return false;
    }
    return true;
  } catch (err) {
    log.error({ err }, 'MSG91 exception');
    return false;
  }
}
