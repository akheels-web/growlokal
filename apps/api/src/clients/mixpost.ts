// Mixpost client — self-hosted social scheduler (Instagram/Facebook).
// This is the wedge feature GrowLokal only advertises. Mixpost runs on Proxmox.
// Docs: https://docs.mixpost.app/  (API under /api/{workspace}/...)
import { request } from 'undici';
import { config } from '../config.js';
import { log } from '../logger.js';

export interface SchedulePostInput {
  accountIds: number[];        // Mixpost social-account IDs the business connected
  caption: string;
  mediaUrls?: string[];
  scheduledFor: Date;          // IST
}

export interface SchedulePostResult {
  ok: boolean;
  externalId?: string;
  error?: string;
  /** True when nothing was actually sent (Mixpost unconfigured) — callers
   * must NOT treat this as a real success. Added 2026-08-18: this used to be
   * indistinguishable from a real publish (both returned ok:true), so the
   * worker was marking posts 'published' when nothing had actually gone out. */
  dryRun?: boolean;
}

export async function schedulePost(input: SchedulePostInput): Promise<SchedulePostResult> {
  if (!config.MIXPOST_BASE_URL || !config.MIXPOST_TOKEN) {
    log.warn('Mixpost not configured — dry-run (post will NOT be marked published)');
    return { ok: true, externalId: 'dry-run', dryRun: true };
  }
  const url = `${config.MIXPOST_BASE_URL}/api/${config.MIXPOST_WORKSPACE_UUID}/posts`;
  try {
    const res = await request(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.MIXPOST_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        accounts: input.accountIds,
        // Mixpost "versions" allow per-network content; keep one shared version.
        versions: [
          {
            account_id: 0, // 0 = applies to all selected accounts
            is_original: true,
            content: [{ body: input.caption, media: input.mediaUrls ?? [] }],
          },
        ],
        date: toMixpostDate(input.scheduledFor),
        schedule: true,
      }),
    });
    const json = (await res.body.json().catch(() => ({}))) as any;
    if (res.statusCode >= 400) {
      log.error({ status: res.statusCode, json }, 'Mixpost schedule failed');
      return { ok: false, error: json?.message ?? `http ${res.statusCode}` };
    }
    return { ok: true, externalId: String(json?.id ?? json?.data?.id ?? '') };
  } catch (err) {
    log.error({ err }, 'Mixpost exception');
    return { ok: false, error: String(err) };
  }
}

// Mixpost expects "YYYY-MM-DD HH:mm" in the workspace timezone (set to IST).
function toMixpostDate(d: Date): string {
  const ist = new Date(d.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const p = (n: number) => String(n).padStart(2, '0');
  return `${ist.getFullYear()}-${p(ist.getMonth() + 1)}-${p(ist.getDate())} ${p(ist.getHours())}:${p(ist.getMinutes())}`;
}
