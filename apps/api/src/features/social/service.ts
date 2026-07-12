// Social scheduling service: generate a post, persist as 'scheduled', and
// (when due) push to Mixpost. The worker (worker.ts) publishes due posts.
import { loadBusinessContext, generateSocialPost } from '../content/generator.js';
import { schedulePost as mixpostSchedule } from '../../clients/mixpost.js';
import { query, queryOne } from '../../db.js';
import { log } from '../../logger.js';

type Channel = 'instagram' | 'facebook';

export interface CreateSocialPostInput {
  businessId: string;
  channel: Channel;
  focus: string;
  occasion?: string;
  scheduledFor?: Date;        // default: tomorrow 9am IST
  mixpostAccountIds?: number[];
}

export async function createScheduledSocialPost(input: CreateSocialPostInput) {
  const ctx = await loadBusinessContext(input.businessId);
  if (!ctx) throw new Error('business not found');

  const post = await generateSocialPost(ctx, input.focus, input.occasion);
  const when = input.scheduledFor ?? defaultSlot();

  const row = await queryOne<{ id: string }>(
    `INSERT INTO posts (business_id, channel, status, lang, caption, hashtags, scheduled_for, generated_by)
     VALUES ($1, $2, 'scheduled', $3, $4, $5, $6, 'gemini-cheap')
     RETURNING id`,
    [input.businessId, input.channel, ctx.primary_lang, post.caption, post.hashtags, when]
  );

  return {
    id: row!.id,
    caption: post.caption,
    hashtags: post.hashtags,
    visualIdea: post.visualIdea,
    scheduledFor: when,
  };
}

/** Called by the worker for each due post. Pushes to Mixpost + marks published. */
export async function publishDuePost(postId: string, mixpostAccountIds: number[]) {
  const post = await queryOne<{
    id: string; caption: string; hashtags: string[]; media_urls: string[] | null; scheduled_for: string;
  }>(`SELECT id, caption, hashtags, media_urls, scheduled_for FROM posts WHERE id = $1`, [postId]);
  if (!post) return;

  const caption = [post.caption, (post.hashtags ?? []).join(' ')].filter(Boolean).join('\n\n');
  const res = await mixpostSchedule({
    accountIds: mixpostAccountIds,
    caption,
    mediaUrls: post.media_urls ?? [],
    scheduledFor: new Date(post.scheduled_for),
  });

  if (res.ok) {
    await query(
      `UPDATE posts SET status = 'published', published_at = now(), external_id = $2 WHERE id = $1`,
      [postId, res.externalId ?? null]
    );
    await query(
      `INSERT INTO events (business_id, type, payload)
       SELECT business_id, 'post_published', '{}'::jsonb FROM posts WHERE id = $1`,
      [postId]
    );
  } else {
    await query(`UPDATE posts SET status = 'failed', error = $2 WHERE id = $1`, [postId, res.error ?? 'unknown']);
    log.error({ postId, error: res.error }, 'post publish failed');
  }
}

function defaultSlot(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(9, 0, 0, 0);
  return d;
}
