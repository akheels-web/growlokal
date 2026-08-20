// Pure function, no I/O — split out from generator.ts specifically so it's
// testable without needing a database connection (generator.ts imports db.js
// at module scope, which requires DATABASE_URL to even load).
const MAX_PROFILE_CONTEXT_CHARS = 4000;

/**
 * profile_context is set by a business's own owner and stuffed verbatim into
 * every LLM prompt in generator.ts — a security review 2026-08-18 correctly
 * flagged this as unsanitized. Blast radius is narrower than a typical
 * injection finding (a business can only ever manipulate its OWN generated
 * content, never another business's — nothing cross-tenant sits in this
 * prompt), but it's still real: strips control characters (a business could
 * otherwise try to break out of the intended prompt structure) and
 * hard-caps total size (bounds both cost and how much room there is to
 * attempt anything at all). This does not claim to fully solve prompt
 * injection — nothing generic can — it closes the concrete, boundable part.
 */
export function sanitizeProfileContext(ctx: Record<string, unknown>): string {
  const stripControlChars = (v: unknown): unknown => {
    if (typeof v === 'string') return v.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    if (Array.isArray(v)) return v.map(stripControlChars);
    if (v && typeof v === 'object') {
      return Object.fromEntries(Object.entries(v).map(([k, val]) => [k, stripControlChars(val)]));
    }
    return v;
  };
  const serialized = JSON.stringify(stripControlChars(ctx));
  return serialized.length > MAX_PROFILE_CONTEXT_CHARS
    ? serialized.slice(0, MAX_PROFILE_CONTEXT_CHARS) + '...(truncated)'
    : serialized;
}
