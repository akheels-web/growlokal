// Cloudflare R2 (S3-compatible) — hosts AI-generated images so Mixpost/GBP
// can actually publish them; both require a real public URL, not inline
// base64. Same "don't hand-roll AWS SigV4" exception as clients/email.ts
// (@aws-sdk/client-sesv2) — reused for the sibling S3 client, same vendor.
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { config } from '../config.js';
import { log } from '../logger.js';

const client = config.R2_ACCOUNT_ID
  ? new S3Client({
      region: 'auto',
      endpoint: `https://${config.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.R2_ACCESS_KEY_ID,
        secretAccessKey: config.R2_SECRET_ACCESS_KEY,
      },
    })
  : null;

/** Uploads and returns the public URL, or null if R2 isn't configured or the upload failed. */
export async function uploadImage(buffer: Buffer, key: string): Promise<string | null> {
  if (!client || !config.R2_PUBLIC_URL_BASE) {
    log.warn('R2 not configured (R2_ACCOUNT_ID/R2_PUBLIC_URL_BASE) — skipping image upload');
    return null;
  }
  try {
    await client.send(new PutObjectCommand({
      Bucket: config.R2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: 'image/png',
    }));
    return `${config.R2_PUBLIC_URL_BASE}/${key}`;
  } catch (err) {
    log.error({ err, key }, 'R2 upload failed');
    return null;
  }
}
