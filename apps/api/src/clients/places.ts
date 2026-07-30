// Google Places API (New) client — used by the audit bot to look up a
// business's public Google presence and detect gaps.
//
// ⚠️ COST WARNING: Places API is NOT free at volume. Restrict the API key
// to your server IP, set a billing budget + alert, and rate-limit the audit
// bot endpoint (see Technical-Setup-Guide.md §7-8). Cache results per place.
import { request } from 'undici';
import { config } from '../config.js';
import { log } from '../logger.js';

export interface PlaceSignals {
  placeId: string;
  name: string;
  rating?: number;            // 1-5
  userRatingCount?: number;
  website?: string;
  phone?: string;
  hasHours: boolean;
  photoCount: number;
  businessStatus?: string;    // OPERATIONAL etc.
  primaryType?: string;
  addressComplete: boolean;
}

/**
 * Text-search for a business by name (+ city) and return the top match's
 * signals. Returns null if nothing found or the API key is missing.
 */
// Fast In-Memory Cache for Google Places queries (12-hour TTL to save API costs & achieve < 5ms response latency)
const placesCache = new Map<string, { data: PlaceSignals | null; expiresAt: number }>();
const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

export async function lookupBusiness(
  name: string,
  city = 'Hyderabad'
): Promise<PlaceSignals | null> {
  const cacheKey = `${name.trim().toLowerCase()}_${city.trim().toLowerCase()}`;
  const cached = placesCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    log.info({ cacheKey }, 'Places lookup cache hit — returning cached signals');
    return cached.data;
  }

  if (!config.GOOGLE_PLACES_API_KEY) {
    log.warn('GOOGLE_PLACES_API_KEY not set — returning mock signals');
    const mock = mockSignals(name);
    placesCache.set(cacheKey, { data: mock, expiresAt: Date.now() + CACHE_TTL_MS });
    return mock;
  }

  try {
    // Places API (New) — searchText endpoint with a field mask (field mask
    // controls billing tier, so request only what we score on).
    const res = await request('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': config.GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': [
          'places.id',
          'places.displayName',
          'places.rating',
          'places.userRatingCount',
          'places.websiteUri',
          'places.nationalPhoneNumber',
          'places.regularOpeningHours',
          'places.photos',
          'places.businessStatus',
          'places.primaryType',
          'places.formattedAddress',
        ].join(','),
      },
      body: JSON.stringify({ textQuery: `${name} ${city}`, maxResultCount: 1 }),
    });

    const json = (await res.body.json()) as any;
    if (res.statusCode >= 400) {
      log.error({ status: res.statusCode, json }, 'Places lookup failed');
      return null;
    }
    const p = json?.places?.[0];
    if (!p) return null;

    const result: PlaceSignals = {
      placeId: p.id,
      name: p.displayName?.text ?? name,
      rating: p.rating,
      userRatingCount: p.userRatingCount ?? 0,
      website: p.websiteUri,
      phone: p.nationalPhoneNumber,
      hasHours: Boolean(p.regularOpeningHours),
      photoCount: Array.isArray(p.photos) ? p.photos.length : 0,
      businessStatus: p.businessStatus,
      primaryType: p.primaryType,
      addressComplete: Boolean(p.formattedAddress),
    };
    placesCache.set(cacheKey, { data: result, expiresAt: Date.now() + CACHE_TTL_MS });
    return result;
  } catch (err) {
    log.error({ err }, 'Places lookup exception');
    return null;
  }
}

// Deterministic-ish mock so dev works without an API key / billing.
function mockSignals(name: string): PlaceSignals {
  return {
    placeId: 'mock_' + Buffer.from(name).toString('hex').slice(0, 10),
    name,
    rating: 3.9,
    userRatingCount: 7,
    website: undefined,          // pretend they have no website → a gap
    phone: '040-00000000',
    hasHours: false,             // → a gap
    photoCount: 1,               // → a gap
    businessStatus: 'OPERATIONAL',
    primaryType: 'school',
    addressComplete: true,
  };
}
