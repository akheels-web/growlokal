// The audit bot orchestration — the vertical slice that ties everything together.
// Flow: business name + phone -> Places lookup -> score -> LLM summary ->
//       persist lead + report + event -> return message to send on WhatsApp.
import { lookupBusiness } from '../../clients/places.js';
import { generate } from '../../clients/llm.js';
import { scoreBusiness } from './scoring.js';
import { buildAuditPrompt, AUDIT_SYSTEM } from './prompt.js';
import { query, queryOne } from '../../db.js';
import { log } from '../../logger.js';

type Lang = 'te' | 'ta' | 'kn' | 'ml' | 'hi' | 'en';

export interface AuditRunInput {
  phone: string;
  businessName: string;
  city?: string;
  lang?: Lang;
  industry?: string;
}

export interface AuditRunOutput {
  message: string;       // the vernacular text to send back on WhatsApp
  score: number;
  gaps: string[];
  leadId: string;
  reportId: string;
}

export async function runAudit(input: AuditRunInput): Promise<AuditRunOutput> {
  const { phone, businessName, city = 'Hyderabad', lang = 'te', industry = 'coaching' } = input;

  // 1. Look up their Google presence
  const signals = await lookupBusiness(businessName, city);

  // If we found nothing on Google, that itself is the headline finding.
  if (!signals) {
    const message = await notFoundMessage(businessName, lang);
    const leadId = await upsertLead(phone, businessName, city, 0);
    const reportId = await saveReport({
      leadId, phone, placeId: null, businessName,
      rawSignals: {}, scoreTotal: 0, breakdown: {},
      gaps: ['not_on_google'], summary: message, lang,
    });
    await logEvent(null, leadId, 'audit_completed', { score: 0, notFound: true });
    return { message, score: 0, gaps: ['not_on_google'], leadId, reportId };
  }

  // 2. Score it
  const audit = scoreBusiness(signals);

  // 3. Generate the vernacular summary (quality tier — customer-facing)
  let message: string;
  try {
    message = (
      await generate({
        system: AUDIT_SYSTEM,
        prompt: buildAuditPrompt(signals, audit, lang),
        tier: 'quality',
        maxTokens: 500,
        temperature: 0.7,
      })
    ).trim();
  } catch (err) {
    log.error({ err }, 'audit LLM failed — using fallback message');
    message = fallbackMessage(businessName, audit.scoreTotal, lang);
  }

  // 4. Persist lead + report + event
  const leadId = await upsertLead(phone, businessName, city, audit.scoreTotal, signals.placeId);
  const reportId = await saveReport({
    leadId, phone, placeId: signals.placeId, businessName,
    rawSignals: signals as unknown as Record<string, unknown>,
    scoreTotal: audit.scoreTotal, breakdown: audit.breakdown,
    gaps: audit.gaps, summary: message, lang,
  });
  await logEvent(null, leadId, 'audit_completed', { score: audit.scoreTotal, gaps: audit.gaps });

  return { message, score: audit.scoreTotal, gaps: audit.gaps, leadId, reportId };
}

// ── DB helpers ────────────────────────────────────────────────

async function upsertLead(
  phone: string,
  businessName: string,
  city: string,
  score: number,
  placeId?: string
): Promise<string> {
  // One lead per phone; refresh their latest audit score.
  const existing = await queryOne<{ id: string }>(
    'SELECT id FROM leads WHERE phone = $1 LIMIT 1',
    [phone]
  );
  if (existing) {
    await query(
      `UPDATE leads SET business_name = COALESCE($2, business_name),
              city = COALESCE($3, city), audit_score = $4,
              place_id = COALESCE($5, place_id)
       WHERE id = $1`,
      [existing.id, businessName, city, score, placeId ?? null]
    );
    return existing.id;
  }
  const row = await queryOne<{ id: string }>(
    `INSERT INTO leads (phone, business_name, vertical, city, place_id, stage, source, audit_score)
     VALUES ($1, $2, 'local_business', $3, $4, 'new', 'audit_bot', $5)
     RETURNING id`,
    [phone, businessName, city, placeId ?? null, score]
  );
  await logEvent(null, row!.id, 'lead_captured', { source: 'audit_bot' });
  return row!.id;
}

interface SaveReportArgs {
  leadId: string; phone: string; placeId: string | null; businessName: string;
  rawSignals: Record<string, unknown>; scoreTotal: number;
  breakdown: Record<string, number>; gaps: string[]; summary: string; lang: Lang;
}

async function saveReport(a: SaveReportArgs): Promise<string> {
  const row = await queryOne<{ id: string }>(
    `INSERT INTO audit_reports
       (lead_id, phone, place_id, business_name, raw_signals, score_total,
        score_breakdown, gaps, summary_text, lang)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING id`,
    [
      a.leadId, a.phone, a.placeId, a.businessName,
      JSON.stringify(a.rawSignals), a.scoreTotal,
      JSON.stringify(a.breakdown), JSON.stringify(a.gaps),
      a.summary, a.lang,
    ]
  );
  return row!.id;
}

async function logEvent(
  businessId: string | null,
  leadId: string | null,
  type: string,
  payload: Record<string, unknown>
): Promise<void> {
  await query(
    'INSERT INTO events (business_id, lead_id, type, payload) VALUES ($1,$2,$3,$4)',
    [businessId, leadId, type, JSON.stringify(payload)]
  );
}

// ── Fallback / edge messages ──────────────────────────────────

async function notFoundMessage(name: string, lang: Lang): Promise<string> {
  try {
    return (
      await generate({
        system: AUDIT_SYSTEM,
        prompt: `A local business called "${name}" could NOT be found on Google Business Profile at all. Write a short WhatsApp message in ${lang === 'te' ? 'Telugu' : 'the local language'} explaining that not being on Google means they are invisible to customers searching nearby, that this is losing them new sales & calls, and it can be fixed quickly. End with: reply "DEMO" for a free call. Under 700 chars, 2 emojis max.`,
        tier: 'quality',
        maxTokens: 400,
      })
    ).trim();
  } catch {
    return fallbackMessage(name, 0, lang);
  }
}

function fallbackMessage(name: string, score: number, lang: Lang): string {
  // Used only if the LLM is unreachable. Kept simple + bilingual-ish.
  if (lang === 'te') {
    return `నమస్తే! 🙏 ${name} కోసం మీ Google presence score: ${score}/100. కొన్ని ముఖ్యమైన సమస్యలు ఉన్నాయి — వాటిని సరిచేస్తే ఎక్కువ మంది కస్టమర్లు మరియు కాల్స్ వస్తాయి. ఉచిత సహాయం కోసం "DEMO" అని reply చేయండి.`;
  }
  return `Hi! 🙏 Your Google presence score for ${name} is ${score}/100. There are a few important issues costing you new customer sales & bookings — all fixable. Reply "DEMO" for a free call to fix the biggest one.`;
}
