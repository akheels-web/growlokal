// Email via Amazon SES (SESv2 API).
//
// Unlike every other client in this codebase, this one is NOT hand-rolled
// over undici with a bearer token. SES requires AWS Signature V4 request
// signing, which is easy to get subtly wrong by hand and hard to verify
// without a real AWS account to test against — the official SDK is the
// correct trade here despite the codebase's usual "no SDKs" pattern.
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { config } from '../config.js';
import { log } from '../logger.js';

let client: SESv2Client | null = null;
function getClient(): SESv2Client {
  if (!client) {
    client = new SESv2Client({
      region: config.SES_REGION,
      credentials: {
        accessKeyId: config.SES_ACCESS_KEY_ID,
        secretAccessKey: config.SES_SECRET_ACCESS_KEY,
      },
    });
  }
  return client;
}

export async function sendEmail(to: string, subject: string, bodyText: string): Promise<boolean> {
  if (!config.SES_ACCESS_KEY_ID || !to) {
    log.warn({ to, subject }, 'SES not configured (or no recipient email) — logging instead of sending');
    log.info({ to, subject, bodyText }, 'EMAIL (dry-run)');
    return true;
  }
  try {
    await getClient().send(
      new SendEmailCommand({
        FromEmailAddress: config.EMAIL_FROM,
        Destination: { ToAddresses: [to] },
        Content: {
          Simple: {
            Subject: { Data: subject },
            Body: { Text: { Data: bodyText } },
          },
        },
      })
    );
    return true;
  } catch (err) {
    log.error({ err, to }, 'SES send failed');
    return false;
  }
}
