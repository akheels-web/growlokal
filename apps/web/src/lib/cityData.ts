// Shared city SEO data — used by /city/[cityName] and /city/[cityName]/[vertical].
// ponytail: extracted once a second consumer needed the same data; a single
// consumer would have kept this inline.
export interface CityInfo {
  name: string;
  areas: string[];
  state: string;
  heroDesc: string;
  searchVolume: string;
  competition: string;
}

export const CITY_DATA: Record<string, CityInfo> = {
  hyderabad: {
    name: 'Hyderabad',
    areas: ['Ameerpet', 'Kukatpally', 'Dilsukhnagar', 'Madhapur', 'Himayatnagar', 'Secunderabad', 'Gachibowli', 'Jubilee Hills'],
    state: 'Telangana',
    heroDesc: 'Clinics, salons, cafes, and retail stores in Ameerpet, Kukatpally & Madhapur are competing heavily for local customer calls. GrowLokal AI puts your business at the top of Google Maps & WhatsApp.',
    searchVolume: '85,000+ monthly local searches',
    competition: 'High (2,500+ registered businesses)',
  },
  vijayawada: {
    name: 'Vijayawada',
    areas: ['Benz Circle', 'Governorpet', 'Moghalrajpuram', 'Patamata', 'Gudavalli', 'Kanuru'],
    state: 'Andhra Pradesh',
    heroDesc: 'Vijayawada residents actively search Google Maps for top clinics, salons, restaurants & stores. GrowLokal automates your local marketing in Telugu.',
    searchVolume: '48,000+ monthly local searches',
    competition: 'Very High (1,200+ businesses)',
  },
  visakhapatnam: {
    name: 'Visakhapatnam',
    areas: ['Dwaraka Nagar', 'MVP Colony', 'Gajuwaka', 'Asilmetta', 'Siripuram', 'Maddilapalem'],
    state: 'Andhra Pradesh',
    heroDesc: 'Attract customers across Dwaraka Nagar & MVP Colony with AI-generated Google posts and automated 24/7 WhatsApp customer enquiry responses.',
    searchVolume: '42,000+ monthly local searches',
    competition: 'High (950+ businesses)',
  },
  bengaluru: {
    name: 'Bengaluru',
    areas: ['Jayanagar', 'Rajajinagar', 'Marathahalli', 'Hebbal', 'Indiranagar', 'HSR Layout', 'Koramangala'],
    state: 'Karnataka',
    heroDesc: 'Dominate local business searches in Jayanagar, Rajajinagar & HSR Layout with native Kannada & English AI marketing automation.',
    searchVolume: '120,000+ monthly local searches',
    competition: 'Extreme (4,500+ businesses)',
  },
};

export function getCity(cityName: string): CityInfo {
  const key = cityName.toLowerCase();
  return (
    CITY_DATA[key] || {
      name: cityName.charAt(0).toUpperCase() + cityName.slice(1),
      areas: ['Central Commercial Hub', 'Market District', 'Main Bazaar', 'North Area', 'South Area'],
      state: 'South India',
      heroDesc: `Supercharge new customer growth for local businesses in ${cityName} with GrowLokal AI.`,
      searchVolume: '25,000+ monthly local searches',
      competition: 'Moderate',
    }
  );
}
