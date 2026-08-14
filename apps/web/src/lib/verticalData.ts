// Vertical SEO data for /city/[cityName]/[vertical] pages.
// Slugs and labels match the business-showcase list on the homepage (page.tsx)
// so the two stay consistent in the site's own language.
export interface VerticalInfo {
  slug: string;
  label: string;        // matches the homepage showcase name
  singular: string;      // e.g. "salon" — used mid-sentence
  painPoint: string;     // what's specifically costing them customers
  searchExample: string; // a realistic "near me" search phrase
  image: string;
}

export const VERTICAL_DATA: Record<string, VerticalInfo> = {
  'salons-spas': {
    slug: 'salons-spas', label: 'Salon Owners & Spas', singular: 'salon',
    painPoint: 'walk-in customers choosing a competitor with more Google reviews and recent photos',
    searchExample: 'best salon near me', image: '/images/biz_salon.png',
  },
  'doctors-clinics': {
    slug: 'doctors-clinics', label: 'Doctors & Health Clinics', singular: 'clinic',
    painPoint: 'patients booking with a clinic that answers WhatsApp enquiries faster',
    searchExample: 'clinic near me open now', image: '/images/biz_doctor.png',
  },
  'restaurants-cafes': {
    slug: 'restaurants-cafes', label: 'Restaurants & Cafes', singular: 'restaurant',
    painPoint: 'diners picking a place with better Google photos and faster reply to booking enquiries',
    searchExample: 'restaurants near me', image: '/images/biz_chef.png',
  },
  'gyms-fitness': {
    slug: 'gyms-fitness', label: 'Gym & Fitness Centres', singular: 'gym',
    painPoint: 'prospective members joining a gym that shows up first with more reviews',
    searchExample: 'gym near me', image: '/images/biz_gym.png',
  },
  'garages-mechanics': {
    slug: 'garages-mechanics', label: 'Car Garages & Mechanics', singular: 'garage',
    painPoint: 'drivers calling the garage that answers on WhatsApp instantly during a breakdown',
    searchExample: 'car mechanic near me', image: '/images/biz_mechanic.png',
  },
  'bakers-cake-shops': {
    slug: 'bakers-cake-shops', label: 'Bakers & Cake Shops', singular: 'bakery',
    painPoint: 'customers ordering from a bakery with more recent photos and reviews for last-minute orders',
    searchExample: 'cake shop near me', image: '/images/biz_baker.png',
  },
  'travel-agencies': {
    slug: 'travel-agencies', label: 'Tours & Travel Agencies', singular: 'travel agency',
    painPoint: 'travellers booking with an agency that replies to WhatsApp enquiries within minutes',
    searchExample: 'travel agency near me', image: '/images/biz_travel.png',
  },
  'handyman-repair': {
    slug: 'handyman-repair', label: 'Handyman & Repair Services', singular: 'repair service',
    painPoint: 'customers calling a competitor who shows up first for urgent repair searches',
    searchExample: 'handyman near me', image: '/images/biz_handyman.png',
  },
};

export function getVertical(slug: string): VerticalInfo | null {
  return VERTICAL_DATA[slug.toLowerCase()] ?? null;
}
