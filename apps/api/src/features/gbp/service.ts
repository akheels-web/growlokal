// Google Business Profile agent.
//
// ⚠️ Requires GBP API access approval (0 QPM until Google approves — apply
// early). The API surface here targets the Business Profile APIs:
//   - localPosts.create  (v4 mybusiness.googleapis.com / accountmanagement)
//   - reviews.list + reviews.updateReply
// Auth: resolveGbpAccessToken() (clients/gbp-oauth.ts) resolves a per-business
// token from its stored refresh_token, falling back to the static
// config.GBP_ACCESS_TOKEN for a single-account pilot.
import { request } from 'undici';
import { log } from '../../logger.js';
import { loadBusinessContext, generateGbpPost } from '../content/generator.js';
import { generate } from '../../clients/llm.js';
import { resolveGbpAccessToken } from '../../clients/gbp-oauth.js';
import { query, queryOne } from '../../db.js';
import { config } from '../../config.js';

// NOTE: The GBP API has several host/version surfaces. Endpoints below are
// placeholders showing the intended shape — verify exact paths against
// https://developers.google.com/my-business when your access is approved.

// A security review 2026-08-18 flagged localPosts.create's `sourceUrl` as an
// SSRF risk if `imageUrl` were attacker-controlled. Checked: it never is —
// `imageUrl` only ever comes from generateGbpPost() -> generatePostImage(),
// which always either returns null or a URL WE just uploaded to OUR OWN R2
// bucket (clients/storage.ts). There is no code path where request input
// reaches this field. Leaving this note here so nobody "fixes" this into
// accepting an external imageUrl later without re-adding an allow-list.

// No idempotency key from the GBP API itself (unconfirmed whether one
// exists) — this debounce is the practical guard against a double-submit
// (e.g. a dashboard double-click) creating two posts for the same business
// within the same request burst.
const RECENT_POST_DEBOUNCE_SECONDS = 60;

export async function createGbpPost(businessId: string, focus?: string) {
  const ctx = await loadBusinessContext(businessId);
  if (!ctx) throw new Error('business not found');

  const recent = await queryOne<{ id: string }>(
    `SELECT id FROM posts WHERE business_id = $1 AND channel = 'gbp'
     AND created_at > now() - ($2 || ' seconds')::interval LIMIT 1`,
    [businessId, RECENT_POST_DEBOUNCE_SECONDS]
  );
  if (recent) {
    log.warn({ businessId }, 'GBP post debounced — one was already created for this business in the last minute');
    return { id: recent.id, text: '', imageUrl: null, published: false, reason: 'debounced_duplicate' };
  }

  const biz = await queryOne<{ gbp_location_id: string | null; gbp_refresh_token: string | null }>(
    `SELECT gbp_location_id, gbp_refresh_token FROM businesses WHERE id = $1`,
    [businessId]
  );

  const { text, imageUrl } = await generateGbpPost(ctx, focus);
  const mediaUrls = imageUrl ? [imageUrl] : [];

  // Persist first (as draft), so we never lose generated content.
  const row = await queryOne<{ id: string }>(
    `INSERT INTO posts (business_id, channel, status, lang, caption, media_urls, generated_by)
     VALUES ($1, 'gbp', 'draft', $2, $3, $4, $5) RETURNING id`,
    [businessId, ctx.primary_lang, text, mediaUrls, `${config.LLM_PROVIDER}-quality`]
  );

  const accessToken = biz ? await resolveGbpAccessToken(businessId, biz.gbp_refresh_token) : null;

  if (!accessToken || !biz?.gbp_location_id) {
    log.warn('GBP not configured/approved — post saved as draft only');
    return { id: row!.id, text, imageUrl, published: false, reason: 'gbp_not_configured' };
  }

  try {
    const res = await request(
      `https://mybusiness.googleapis.com/v4/${biz.gbp_location_id}/localPosts`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          languageCode: ctx.primary_lang,
          summary: text,
          topicType: 'STANDARD',
          // media requires a real public URL — verify this exact request
          // shape against https://developers.google.com/my-business when
          // GBP access is actually approved (see file header note).
          ...(imageUrl ? { media: [{ mediaFormat: 'PHOTO', sourceUrl: imageUrl }] } : {}),
        }),
      }
    );
    const json = (await res.body.json().catch(() => ({}))) as any;
    if (res.statusCode >= 400) {
      await query(`UPDATE posts SET status='failed', error=$2 WHERE id=$1`, [row!.id, JSON.stringify(json)]);
      return { id: row!.id, text, imageUrl, published: false, reason: json?.error?.message ?? 'gbp_error' };
    }
    await query(`UPDATE posts SET status='published', published_at=now(), external_id=$2 WHERE id=$1`,
      [row!.id, json?.name ?? null]);
    return { id: row!.id, text, imageUrl, published: true };
  } catch (err) {
    log.error({ err }, 'GBP post failed');
    return { id: row!.id, text, imageUrl, published: false, reason: String(err) };
  }
}

/**
 * Fetch recent Google reviews and draft AI replies for owner approval.
 * Stores drafts in reviews.reply_draft (reply_posted stays false until approved).
 */
export async function draftReviewReplies(businessId: string) {
  const ctx = await loadBusinessContext(businessId);
  if (!ctx) throw new Error('business not found');

  // ponytail: no real GBP reviews.list call yet — genuinely can't build one
  // without live GBP API access (still not confirmed as of this comment).
  // Drafts whatever's already in the `reviews` table without a draft; wire
  // the real fetch in once access is approved (see DEPLOYMENT.md §6.3).
  const reviews = await query<{ id: string; author: string; rating: number; text: string }>(
    `SELECT id, author, rating, text FROM reviews
     WHERE business_id = $1 AND reply_draft IS NULL LIMIT 20`,
    [businessId]
  );

  let drafted = 0;
  for (const r of reviews.rows) {
    const reply = await generate({
      system: `You write warm, professional replies to Google reviews for a local business, in ${ctx.primary_lang === 'te' ? 'Telugu' : 'the local language'} mixed with natural English. Thank happy reviewers; for complaints, be gracious, apologize, and invite them to connect. Never be defensive. Keep under 350 chars.`,
      prompt: `Review (${r.rating}★) by ${r.author}: "${r.text}". Write a reply.`,
      tier: 'quality',
      maxTokens: 250,
    });
    await query(`UPDATE reviews SET reply_draft = $2 WHERE id = $1`, [r.id, reply.trim()]);
    drafted++;
  }
  return { drafted };
}
