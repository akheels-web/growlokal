// Builds the LLM prompt that turns audit gaps into a warm, persuasive
// vernacular WhatsApp message for a coaching-center owner.
//
// The prompt templates themselves also live in /prompts (for non-devs to edit).
// Keep this in sync with prompts/audit-summary.md.
import type { PlaceSignals } from '../../clients/places.js';
import type { AuditResult } from './scoring.js';
import { GAP_LABELS } from './scoring.js';

type Lang = 'te' | 'ta' | 'kn' | 'ml' | 'hi' | 'en';

const LANG_NAME: Record<Lang, string> = {
  te: 'Telugu', ta: 'Tamil', kn: 'Kannada', ml: 'Malayalam', hi: 'Hindi', en: 'English',
};

export const AUDIT_SYSTEM = `You are a friendly local marketing advisor for small coaching/tuition centers in South India. You write short, warm WhatsApp messages that a busy center owner will actually read. You are honest but encouraging — you point out what they are losing on Google, then offer hope that it is fixable. You never sound like a robot or a spammer. You never over-promise or invent numbers.`;

export function buildAuditPrompt(
  signals: PlaceSignals,
  audit: AuditResult,
  lang: Lang
): string {
  const gapLines = audit.gaps.map((g) => `- ${GAP_LABELS[g] ?? g}`).join('\n');
  const langName = LANG_NAME[lang];

  return `A coaching center owner asked for a free check of their Google presence.

Business: ${signals.name}
Google rating: ${signals.rating ?? 'none'} (${signals.userRatingCount ?? 0} reviews)
Visibility score: ${audit.scoreTotal}/100

Main problems found (most important first):
${gapLines || '- (none — their profile is strong)'}

Write a WhatsApp message to the owner in ${langName} (you may mix in common English words the way locals actually speak — e.g. "Google", "reviews", "website"). Requirements:
1. Start warm and personal, mention their business name.
2. Give the score as a simple "X out of 100".
3. Explain the top 2-3 problems in plain language a non-technical parent-facing owner understands — focus on "you are losing admission enquiries because...".
4. Be encouraging: say these are all fixable.
5. End with ONE clear call to action: reply "DEMO" to get a free 15-minute call where we fix the biggest issue for them.
6. Keep it under 900 characters. Use 2-3 relevant emojis, not more. No markdown headings, no bullet symbols like *.

Write ONLY the message text, nothing else.`;
}
