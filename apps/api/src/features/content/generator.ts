// Shared content generation engine. Used by GBP posts, social posts, and
// campaign messages. Pulls the business's profile_context and produces
// vernacular content. All four functions here use the 'quality' tier —
// every one of them is public/customer-facing brand content (see
// docs/DECISIONS.md 2026-08-18 for why social posts moved off 'cheap').
// As of this change, nothing in the codebase actually uses the 'cheap' tier
// (the audit bot already used 'quality' too) — it's kept in clients/llm.ts
// as an available option for future non-customer-facing bulk work, not
// dead code to delete.
import { generate } from '../../clients/llm.js';
import { generateImage } from '../../clients/image.js';
import { uploadImage } from '../../clients/storage.js';
import { query, queryOne } from '../../db.js';

type Lang = 'te' | 'ta' | 'kn' | 'ml' | 'hi' | 'en';

const LANG_NAME: Record<Lang, string> = {
  te: 'Telugu', ta: 'Tamil', kn: 'Kannada', ml: 'Malayalam', hi: 'Hindi', en: 'English',
};

const SYSTEM = `You create engaging, culturally-aware marketing content for a local South Indian business (could be a salon, clinic, restaurant, gym, coaching center, retail store, or service provider). Content is short, energetic, and drives customer enquiries and bookings. Write in the requested language, mixing natural English words the way locals actually speak. NEVER invent fake results, numbers, or testimonials.`;

export interface BusinessContext {
  id: string;
  name: string;
  city: string;
  primary_lang: Lang;
  profile_context: Record<string, unknown>;
}

export async function loadBusinessContext(businessId: string): Promise<BusinessContext | null> {
  return queryOne<BusinessContext>(
    `SELECT id, name, city, primary_lang, profile_context FROM businesses WHERE id = $1`,
    [businessId]
  );
}

export interface SocialPost {
  caption: string;
  hashtags: string[];
  visualIdea: string;
  imageUrl: string | null;
}

/**
 * Generate one AI image from a one-line visual brief and upload it to R2.
 * Best-effort — returns null (never throws) if image gen or upload isn't
 * configured/fails, so a caption-only post still ships. Shared by social
 * and GBP posts; not used for campaigns/chat (text-only, per project owner).
 */
async function generatePostImage(ctx: BusinessContext, visualBrief: string): Promise<string | null> {
  const prompt = `Photorealistic marketing photo for ${ctx.name}, a local business in ${ctx.city}. ${visualBrief}. No text, no logos, no watermarks in the image.`;
  const bytes = await generateImage(prompt);
  if (!bytes) return null;
  return uploadImage(bytes, `posts/${ctx.id}/${crypto.randomUUID()}.png`);
}

/**
 * Last N of this business's own social captions, most recent first — real
 * memory grounded in what's already stored in `posts`, not a new database.
 * GBP posts are a different channel/tone, deliberately excluded here.
 */
async function loadRecentSocialCaptions(businessId: string, limit = 8): Promise<string[]> {
  const res = await query<{ caption: string }>(
    `SELECT caption FROM posts
     WHERE business_id = $1 AND channel IN ('instagram', 'facebook') AND caption IS NOT NULL
     ORDER BY created_at DESC LIMIT $2`,
    [businessId, limit]
  );
  return res.rows.map((r) => r.caption);
}

/**
 * Generate an Instagram/FB post — quality tier (public brand content, same
 * as GBP/campaigns), plus one AI image.
 *
 * `focus` is optional: omit it for the weekly auto-post job (worker.ts) —
 * the model picks a fresh angle itself from the business's context and its
 * own recent-post memory below, rather than needing a human to type one in.
 */
export async function generateSocialPost(
  ctx: BusinessContext,
  focus?: string,
  occasion?: string
): Promise<SocialPost> {
  const lang = LANG_NAME[ctx.primary_lang];
  const recent = await loadRecentSocialCaptions(ctx.id);
  const memoryBlock = recent.length
    ? `\nRecently posted for this business (most recent first) — do NOT repeat these hooks, topics, or exact phrasing; keep the established voice consistent:\n${recent.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n`
    : '';
  const highlightLine = focus
    ? `Highlight in this post: ${focus}`
    : `No specific topic was given — pick a fresh, engaging angle yourself based on the business context and, if listed above, what hasn't been covered in recent posts.`;
  const prompt = `Business: ${ctx.name}, ${ctx.city}
Language: ${lang}
${highlightLine}
${occasion ? `Occasion: ${occasion}` : ''}
Business context (services, pricing, offers, staff/highlights): ${JSON.stringify(ctx.profile_context)}
${memoryBlock}
Generate a social media post. Return ONLY valid JSON:
{"caption": "<under 300 chars, hook + CTA to call/WhatsApp>", "hashtags": ["<5-8 local+topic tags>"], "visual_idea": "<one-line phone-shootable idea>"}`;

  const raw = await generate({ system: SYSTEM, prompt, tier: 'quality', maxTokens: 400, temperature: 0.8 });
  const post = parseSocial(raw, ctx.name);
  post.imageUrl = await generatePostImage(ctx, post.visualIdea || `Something representing: ${focus ?? ctx.name}`);
  return post;
}

/**
 * Generate a Google Business Profile post (slightly more formal) plus one AI
 * image. `focus` optional for the same reason as generateSocialPost above.
 */
export async function generateGbpPost(ctx: BusinessContext, focus?: string): Promise<{ text: string; imageUrl: string | null }> {
  const lang = LANG_NAME[ctx.primary_lang];
  const highlight = focus ?? `pick a fresh, engaging angle yourself based on the business context — a service, offer, or highlight not likely covered recently`;
  const prompt = `Write a Google Business Profile update post for ${ctx.name}, ${ctx.city} in ${lang} (mix natural English words). Highlight: ${highlight}. Context: ${JSON.stringify(ctx.profile_context)}. Keep it 1500 chars max, informative, with a clear CTA (call / visit / WhatsApp). Return ONLY the post text.`;
  const text = (await generate({ system: SYSTEM, prompt, tier: 'quality', maxTokens: 600 })).trim();
  const imageUrl = await generatePostImage(ctx, `Something representing: ${focus ?? ctx.name}`);
  return { text, imageUrl };
}

/** Generate a WhatsApp marketing message body (customer-facing → quality tier). */
export async function generateCampaignMessage(
  ctx: BusinessContext,
  goal: string
): Promise<string> {
  const lang = LANG_NAME[ctx.primary_lang];
  const prompt = `Write a short WhatsApp marketing message from ${ctx.name} to its customers in ${lang} (mix natural English words). Goal: ${goal}. Context: ${JSON.stringify(ctx.profile_context)}. Under 500 chars, warm, one clear CTA. Return ONLY the message text.`;
  return (await generate({ system: SYSTEM, prompt, tier: 'quality', maxTokens: 400 })).trim();
}

/**
 * Answer a customer's WhatsApp question using the business's own info.
 * ponytail: profile_context is small — stuff it in the prompt, no vector DB.
 * Add real RAG only if context outgrows one prompt (unlikely for a single
 * local business's profile, regardless of vertical).
 */
export async function answerCustomerQuestion(
  ctx: BusinessContext,
  question: string
): Promise<string> {
  const lang = LANG_NAME[ctx.primary_lang];
  const prompt = `You are the WhatsApp assistant for ${ctx.name}, a local business in ${ctx.city}.
Answer the customer's question in ${lang} (mix natural English words as locals do), using ONLY the info below. If the info doesn't cover it, say you'll have the team call them — never invent prices, dates, or results.

Business info: ${JSON.stringify(ctx.profile_context)}

Question: "${question}"

Reply in under 400 chars, warm and helpful, end nudging them to book a demo/visit.`;
  return (await generate({ system: SYSTEM, prompt, tier: 'quality', maxTokens: 350 })).trim();
}

// Robust JSON extraction — models sometimes wrap JSON in prose or code fences.
function parseSocial(raw: string, fallbackName: string): SocialPost {
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      const obj = JSON.parse(match[0]);
      return {
        caption: String(obj.caption ?? ''),
        hashtags: Array.isArray(obj.hashtags) ? obj.hashtags.map(String) : [],
        visualIdea: String(obj.visual_idea ?? obj.visualIdea ?? ''),
        imageUrl: null,
      };
    }
  } catch {
    /* fall through */
  }
  // Fallback: use the raw text as the caption.
  return {
    caption: raw.trim() || `${fallbackName} is open! Call or WhatsApp us today.`,
    hashtags: [],
    visualIdea: '',
    imageUrl: null,
  };
}
