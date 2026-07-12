// Unit tests for scoring — pure logic, no I/O. Run with `node --test` (Node 20+)
// after building, or with tsx: `npx tsx --test src/features/audit/scoring.test.ts`
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scoreBusiness } from './scoring.js';
import type { PlaceSignals } from '../../clients/places.js';

const strong: PlaceSignals = {
  placeId: 'x', name: 'Top Coaching', rating: 4.7, userRatingCount: 55,
  website: 'https://x.in', phone: '040', hasHours: true, photoCount: 12,
  businessStatus: 'OPERATIONAL', primaryType: 'school', addressComplete: true,
};

const weak: PlaceSignals = {
  placeId: 'y', name: 'New Tuition', rating: 3.4, userRatingCount: 3,
  website: undefined, phone: undefined, hasHours: false, photoCount: 1,
  businessStatus: 'OPERATIONAL', primaryType: 'school', addressComplete: false,
};

test('strong profile scores high with no major gaps', () => {
  const r = scoreBusiness(strong);
  assert.ok(r.scoreTotal >= 90, `expected >=90, got ${r.scoreTotal}`);
  assert.equal(r.gaps.length, 0);
});

test('weak profile scores low and surfaces the worst gaps first', () => {
  const r = scoreBusiness(weak);
  assert.ok(r.scoreTotal < 40, `expected <40, got ${r.scoreTotal}`);
  // website (20) and reviews (25) are the biggest weights -> should lead
  assert.ok(['no_website', 'few_reviews'].includes(r.gaps[0]));
  assert.ok(r.gaps.includes('low_rating'));
  assert.ok(r.gaps.includes('no_hours'));
});

test('non-operational business is flagged first', () => {
  const r = scoreBusiness({ ...weak, businessStatus: 'CLOSED_PERMANENTLY' });
  assert.equal(r.gaps[0], 'not_operational');
});

test('score is always within 0-100', () => {
  for (const s of [strong, weak]) {
    const r = scoreBusiness(s);
    assert.ok(r.scoreTotal >= 0 && r.scoreTotal <= 100);
  }
});
