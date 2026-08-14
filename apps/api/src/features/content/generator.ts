// Shared content generation engine. Used by GBP posts, social posts, and
// campaign messages. Pulls the business's profile_context and produces
// vernacular content. Cheap tier for bulk, quality tier for anything the
// customer's audience sees prominently.
import { generate } from '../../clients/llm.js';
import { queryOne } from '../../db.js';

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
}

/** Generate an Instagram/FB post. Cheap tier is fine for drafts. */
export async function generateSocialPost(
  ctx: BusinessContext,
  focus: string,
  occasion?: string
): Promise<SocialPost> {
  const lang = LANG_NAME[ctx.primary_lang];
  const prompt = `Business: ${ctx.name}, ${ctx.city}
Language: ${lang}
Highlight in this post: ${focus}
${occasion ? `Occasion: ${occasion}` : ''}
Business context (services, pricing, offers, staff/highlights): ${JSON.stringify(ctx.profile_context)}

Generate a social media post. Return ONLY valid JSON:
{"caption": "<under 300 chars, hook + CTA to call/WhatsApp>", "hashtags": ["<5-8 local+topic tags>"], "visual_idea": "<one-line phone-shootable idea>"}`;

  const raw = await generate({ system: SYSTEM, prompt, tier: 'cheap', maxTokens: 400, temperature: 0.8 });
  return parseSocial(raw, ctx.name);
}

/** Generate a Google Business Profile post (slightly more formal). */
export async function generateGbpPost(ctx: BusinessContext, focus: string): Promise<string> {
  const lang = LANG_NAME[ctx.primary_lang];
  const prompt = `Write a Google Business Profile update post for ${ctx.name}, ${ctx.city} in ${lang} (mix natural English words). Highlight: ${focus}. Context: ${JSON.stringify(ctx.profile_context)}. Keep it 1500 chars max, informative, with a clear CTA (call / visit / WhatsApp). Return ONLY the post text.`;
  return (await generate({ system: SYSTEM, prompt, tier: 'quality', maxTokens: 600 })).trim();
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
  };
}
