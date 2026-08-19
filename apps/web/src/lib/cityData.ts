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
    areas: ['Ameerpet', 'Kukatpally', 'Dilsukhnagar', 'Madhapur', 'Himayatnagar', 'Secunderabad', 'Gachibowli', 'Jubilee Hills', 'Banjara Hills', 'Kondapur'],
    state: 'Telangana',
    heroDesc: 'Clinics, salons, cafes, and retail stores in Ameerpet, Kukatpally & Madhapur are competing heavily for local customer calls. GrowLokal AI puts your business at the top of Google Maps & WhatsApp in Telugu & English.',
    searchVolume: '85,000+ monthly local searches',
    competition: 'High (2,500+ registered businesses)',
  },
  chennai: {
    name: 'Chennai',
    areas: ['T. Nagar', 'Anna Nagar', 'Velachery', 'Adyar', 'Mylapore', 'Nungambakkam', 'OMR (Old Mahabalipuram Rd)', 'Porur', 'Tambaram', 'Kilpauk'],
    state: 'Tamil Nadu',
    heroDesc: 'Local business owners in T. Nagar, Anna Nagar & Velachery rely on instant local discovery. GrowLokal AI drives high-intent customer calls and WhatsApp bookings in Tamil & English 24/7.',
    searchVolume: '115,000+ monthly local searches',
    competition: 'Extreme (4,200+ registered businesses)',
  },
  bengaluru: {
    name: 'Bengaluru',
    areas: ['Jayanagar', 'Rajajinagar', 'Marathahalli', 'Hebbal', 'Indiranagar', 'HSR Layout', 'Koramangala', 'Whitefield', 'Electronic City', 'Malleshwaram'],
    state: 'Karnataka',
    heroDesc: 'Dominate local business searches in Jayanagar, Rajajinagar & HSR Layout with native Kannada & English autonomous AI marketing automation on Google Maps and WhatsApp.',
    searchVolume: '130,000+ monthly local searches',
    competition: 'Extreme (4,800+ businesses)',
  },
  vijayawada: {
    name: 'Vijayawada',
    areas: ['Benz Circle', 'Governorpet', 'Moghalrajpuram', 'Patamata', 'Gudavalli', 'Kanuru', 'One Town', 'Bhavanipuram'],
    state: 'Andhra Pradesh',
    heroDesc: 'Vijayawada residents actively search Google Maps for top clinics, salons, restaurants & retail stores. GrowLokal automates your local marketing in Telugu and WhatsApp customer acquisition.',
    searchVolume: '48,000+ monthly local searches',
    competition: 'Very High (1,200+ businesses)',
  },
  visakhapatnam: {
    name: 'Visakhapatnam',
    areas: ['Dwaraka Nagar', 'MVP Colony', 'Gajuwaka', 'Asilmetta', 'Siripuram', 'Maddilapalem', 'Rushikonda', 'Pendurthi'],
    state: 'Andhra Pradesh',
    heroDesc: 'Attract customers across Dwaraka Nagar & MVP Colony with AI-generated Google posts and automated 24/7 WhatsApp customer enquiry responses in Telugu & English.',
    searchVolume: '42,000+ monthly local searches',
    competition: 'High (950+ businesses)',
  },
  coimbatore: {
    name: 'Coimbatore',
    areas: ['RS Puram', 'Gandhipuram', 'Peelamedu', 'Saibaba Colony', 'Saravanampatti', 'Race Course', 'Singanallur'],
    state: 'Tamil Nadu',
    heroDesc: 'Supercharge inquiries for manufacturing, clinics, retail shops, and services in RS Puram & Gandhipuram with automated local SEO and Tamil WhatsApp AI chatbots.',
    searchVolume: '38,000+ monthly local searches',
    competition: 'High (880+ businesses)',
  },
  kochi: {
    name: 'Kochi',
    areas: ['Edappally', 'Kaloor', 'Kakkanad', 'MG Road', 'Fort Kochi', 'Vyttila', 'Palarivattom', 'Panampilly Nagar'],
    state: 'Kerala',
    heroDesc: 'Clinics, cafes, tourism agencies & boutiques across Edappally & Kakkanad capture tourists and local customers 24/7 with Google Maps dominance and WhatsApp automation.',
    searchVolume: '40,000+ monthly local searches',
    competition: 'High (820+ businesses)',
  },
  madurai: {
    name: 'Madurai',
    areas: ['KK Nagar', 'Anna Nagar', 'Simmakkal', 'SS Colony', 'Tallakulam', 'Town Hall Road'],
    state: 'Tamil Nadu',
    heroDesc: 'Grow customer footfall and inquiries for traditional stores, healthcare clinics, and restaurants in KK Nagar & Anna Nagar with AI Google ranking in Tamil.',
    searchVolume: '28,000+ monthly local searches',
    competition: 'Moderate (650+ businesses)',
  },
  mysuru: {
    name: 'Mysuru',
    areas: ['Gokulam', 'Saraswathipuram', 'Jayalakshmipuram', 'Vijayanagar', 'Kuvempunagar', 'Hebbal Industrial Area'],
    state: 'Karnataka',
    heroDesc: 'Help tourists and local residents discover your boutique, yoga center, cafe, or clinic in Gokulam and Saraswathipuram with top Google Maps rank.',
    searchVolume: '32,000+ monthly local searches',
    competition: 'Moderate (710+ businesses)',
  },
  warangal: {
    name: 'Warangal',
    areas: ['Hanamkonda', 'Kazipet', 'Subedari', 'Nakkalagutta', 'Balasamudram', 'Waddepally'],
    state: 'Telangana',
    heroDesc: 'Dominate customer searches across Hanamkonda & Kazipet for hospitals, coaching institutes, and retail shops with automated Telugu WhatsApp AI responders.',
    searchVolume: '24,000+ monthly local searches',
    competition: 'Moderate (520+ businesses)',
  },
  tirupati: {
    name: 'Tirupati',
    areas: ['Alipiri', 'Korlagunta', 'Bhavani Nagar', 'Bairagipatteda', 'Renigunta Road', 'TUDA Complex'],
    state: 'Andhra Pradesh',
    heroDesc: 'Capture pilgrims, visitors, and residents searching for hotels, healthcare, transport, and stores in Tirupati with #1 Google Maps presence.',
    searchVolume: '35,000+ monthly local searches',
    competition: 'High (780+ businesses)',
  },
  guntur: {
    name: 'Guntur',
    areas: ['Brodipet', 'Arundelpet', 'Laxmipuram', 'Kothapet', 'Old Club Road', 'Pattabhipuram'],
    state: 'Andhra Pradesh',
    heroDesc: 'Clinics, coaching centres, and retail stores in Brodipet & Arundelpet win more daily walk-ins with autonomous Google profile optimization.',
    searchVolume: '26,000+ monthly local searches',
    competition: 'Moderate (620+ businesses)',
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
