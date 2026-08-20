// Unit test for sanitizeProfileContext — the fix for a security review
// finding (2026-08-18): profile_context is set by a business's own owner and
// stuffed verbatim into every LLM prompt. Pure logic, no I/O — see
// sanitize.ts's own header for why it was split out of generator.ts (which
// imports db.js at module scope and can't load without DATABASE_URL).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeProfileContext } from './sanitize.js';

test('strips control characters from nested string values', () => {
  const out = sanitizeProfileContext({ services: 'Haircut\x00\x1F', nested: { note: 'Fine\x7Ftext' } });
  assert.ok(!/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(out), 'control chars must be stripped');
  assert.ok(out.includes('Haircut'));
  assert.ok(out.includes('Finetext'));
});

test('keeps normal whitespace (newlines/tabs) intact', () => {
  const out = sanitizeProfileContext({ hours: 'Mon-Fri\n9am-6pm' });
  assert.ok(out.includes('\\n') || out.includes('\n'), 'JSON.stringify escapes \\n — either form is fine, just not stripped');
});

test('hard-caps total size instead of passing an unbounded payload to the LLM', () => {
  const huge = { note: 'x'.repeat(10_000) };
  const out = sanitizeProfileContext(huge);
  assert.ok(out.length <= 4000 + '...(truncated)'.length);
  assert.ok(out.endsWith('...(truncated)'));
});

test('small, normal profile_context passes through unchanged in content', () => {
  const ctx = { services: 'Salon, Spa', pricing: '₹500-2000', upiId: 'shop@upi' };
  const out = sanitizeProfileContext(ctx);
  const parsed = JSON.parse(out);
  assert.deepEqual(parsed, ctx);
});
