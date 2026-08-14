// Google-visibility scoring for the free audit bot.
// Pure functions — easy to unit-test, no I/O. Turns raw Place signals into a
// 0-100 score, a breakdown, and a list of gap codes the LLM narrates.
import type { PlaceSignals } from '../../clients/places.js';

export interface AuditResult {
  scoreTotal: number;                 // 0-100
  breakdown: Record<string, number>;  // per-dimension points earned
  gaps: string[];                     // gap codes, worst-first
}

// Weights sum to 100. Tuned for local businesses generally: reviews +
// website + photos matter most for a customer's "should I call/visit" decision.
const WEIGHTS = {
  reviews_volume: 25,   // enough reviews to look credible
  rating_quality: 20,   // average rating
  website: 20,          // has a website / booking page
  photos: 15,           // visual proof (space, work, staff)
  hours: 10,            // opening hours listed
  address: 10,          // complete address
} as const;

// Human-readable gap labels (code -> what's wrong). The LLM prompt turns
// these into friendly vernacular advice; the dashboard shows them too.
export const GAP_LABELS: Record<string, string> = {
  few_reviews: 'Very few Google reviews — customers trust businesses with 20+ reviews',
  low_rating: 'Google rating is below 4.0 — hurts new customer enquiries',
  no_website: 'No website/booking page linked — losing direct enquiries',
  few_photos: 'Too few photos — no visuals of your space/work to build trust',
  no_hours: 'Opening hours not listed — customers can’t tell when to visit',
  incomplete_address: 'Incomplete address — harder to be found on Google Maps',
  not_operational: 'Google shows this business as not operational — critical fix',
};

export function scoreBusiness(s: PlaceSignals): AuditResult {
  const breakdown: Record<string, number> = {};
  const gaps: string[] = [];

  // Reviews volume: full marks at 20+ reviews, linear below.
  const reviews = s.userRatingCount ?? 0;
  breakdown.reviews_volume = Math.round(
    WEIGHTS.reviews_volume * Math.min(1, reviews / 20)
  );
  if (reviews < 20) gaps.push('few_reviews');

  // Rating quality: full marks at 4.5+, zero below 3.0.
  const rating = s.rating ?? 0;
  const ratingScore = rating <= 3 ? 0 : Math.min(1, (rating - 3) / 1.5);
  breakdown.rating_quality = Math.round(WEIGHTS.rating_quality * ratingScore);
  if (rating > 0 && rating < 4.0) gaps.push('low_rating');

  // Website
  breakdown.website = s.website ? WEIGHTS.website : 0;
  if (!s.website) gaps.push('no_website');

  // Photos: full marks at 5+.
  breakdown.photos = Math.round(WEIGHTS.photos * Math.min(1, s.photoCount / 5));
  if (s.photoCount < 5) gaps.push('few_photos');

  // Hours
  breakdown.hours = s.hasHours ? WEIGHTS.hours : 0;
  if (!s.hasHours) gaps.push('no_hours');

  // Address
  breakdown.address = s.addressComplete ? WEIGHTS.address : 0;
  if (!s.addressComplete) gaps.push('incomplete_address');

  // Hard flag
  if (s.businessStatus && s.businessStatus !== 'OPERATIONAL') {
    gaps.unshift('not_operational');
  }

  const scoreTotal = Object.values(breakdown).reduce((a, b) => a + b, 0);

  // Order gaps worst-first by the weight they cost.
  const gapWeight = (code: string): number => {
    const map: Record<string, number> = {
      not_operational: 999,
      no_website: WEIGHTS.website,
      few_reviews: WEIGHTS.reviews_volume,
      low_rating: WEIGHTS.rating_quality,
      few_photos: WEIGHTS.photos,
      no_hours: WEIGHTS.hours,
      incomplete_address: WEIGHTS.address,
    };
    return map[code] ?? 0;
  };
  gaps.sort((a, b) => gapWeight(b) - gapWeight(a));

  return { scoreTotal, breakdown, gaps };
}
