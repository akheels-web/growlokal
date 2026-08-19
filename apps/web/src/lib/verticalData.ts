// Vertical SEO data for /industry/[slug] and /city/[cityName]/[vertical] pages.
// Slugs and labels match the business-showcase list on the homepage (page.tsx)
// so the two stay consistent across the entire application.

export interface PainPointItem {
  icon: string;
  stat: string;
  title: string;
  desc: string;
  solution: string;
}

export interface AgentUseCase {
  agent: string;
  icon: string;
  title: string;
  desc: string;
  bulletPoints: string[];
}

export interface VerticalCaseStudy {
  businessName: string;
  location: string;
  founder: string;
  initials: string;
  founderImage: string;
  quote: string;
  metrics: Array<{ label: string; value: string; change: string }>;
}

export interface VerticalFaq {
  q: string;
  a: string;
}

export interface VerticalInfo {
  slug: string;
  label: string;
  singular: string;
  painPoint: string;
  searchExample: string;
  image: string;
  heroHeadline: string;
  heroSubheadline: string;
  badge: string;
  stats: Array<{ number: string; label: string }>;
  painPointsList: PainPointItem[];
  agentUseCases: AgentUseCase[];
  caseStudy: VerticalCaseStudy;
  faqs: VerticalFaq[];
  popularKeywords: string[];
}

export const VERTICAL_DATA: Record<string, VerticalInfo> = {
  'gyms-fitness': {
    slug: 'gyms-fitness',
    label: 'Gym & Fitness Centres',
    singular: 'gym & fitness centre',
    painPoint: 'prospective members joining a competitor gym that shows up first on Google Maps with better reviews',
    searchExample: 'best gym near me open now',
    image: '/images/biz_gym.png',
    badge: '🏋️ Autonomous AI Marketing for Gyms & Fitness Centers',
    heroHeadline: 'Pack Your Gym with High-Value Members on Autopilot',
    heroSubheadline: 'Dominate "gym near me" Google searches, auto-reply to trial enquiries on WhatsApp in Telugu, Tamil & English, and keep members engaged all year.',
    stats: [
      { number: '3.4x', label: 'More Monthly Trial Inquiries' },
      { number: '#1', label: 'Rank in Local 3-Pack Maps' },
      { number: '100%', label: 'Instant WhatsApp Auto-Reply' },
    ],
    popularKeywords: ['gym near me', 'best fitness center', 'unisex gym with trainer', 'crossfit training near me', 'gym monthly membership price'],
    painPointsList: [
      {
        icon: '📍',
        stat: '68%',
        title: 'Hidden on Local Google Maps',
        desc: 'When nearby fitness enthusiasts search "best gym near me", commercial chains rank above you because their profiles post weekly updates.',
        solution: 'Google Leads Agent publishes weekly workout tips & trainer highlights to push you to #1.',
      },
      {
        icon: '💬',
        stat: '4.2 hrs',
        title: 'Slow WhatsApp Inquiry Responses',
        desc: 'People ask about monthly fees and timings after work hours. Unanswered messages lead directly to competitors.',
        solution: 'WhatsApp Chat Agent answers pricing, slot availability, and membership perks in seconds 24/7.',
      },
      {
        icon: '📱',
        stat: '1x/mo',
        title: 'Inconsistent Social Media',
        desc: 'You are busy managing equipment and trainers. Instagram reels and transformation photos rarely get posted consistently.',
        solution: 'Social Agent automatically drafts and schedules fitness posts in English & vernacular languages.',
      },
    ],
    agentUseCases: [
      {
        agent: 'Google Leads Agent',
        icon: '🔍',
        title: 'Local Google Maps Dominance',
        desc: 'Keeps your Google Business Profile updated with classes, timings, amenities, and seasonal offers to rank #1.',
        bulletPoints: ['Ranks for "gym near me" & "personal training"', 'Auto-generates GBP posts with workout photos', '1-click draft replies for member Google reviews'],
      },
      {
        agent: 'WhatsApp Chat Agent',
        icon: '💬',
        title: '24/7 Membership Lead Capture',
        desc: 'Engages potential members instantly, sends fee cards, schedules 1-day free trial visits, and captures phone numbers.',
        bulletPoints: ['Answers fee structure & trainer questions', 'Understands Telugu, Tamil, Kannada & English', 'Books free 1-day trial workout passes directly'],
      },
      {
        agent: 'Social Media Agent',
        icon: '📱',
        title: 'Automated Fitness Posts',
        desc: 'Creates motivational posts, member spotlight stories, and festive diet tips on Instagram and Facebook.',
        bulletPoints: ['Weekly scheduled workout & nutrition posts', 'Automated festive transformation challenges', 'Consistent local brand authority'],
      },
      {
        agent: 'Campaign Agent',
        icon: '📣',
        title: 'New Year & Festival Offer Broadcasts',
        desc: 'Send WhatsApp broadcast campaigns to past members and leads with annual subscription discounts.',
        bulletPoints: ['Prepaid credit system — 0 surprise costs', 'Personalized offers for New Year, Diwali, Pongal', 'Tracks open rates and trial bookings'],
      },
    ],
    caseStudy: {
      businessName: 'Gold Gym & Crossfit Fitness',
      location: 'Vijayawada, Andhra Pradesh',
      founder: 'K. Ramesh Varma',
      initials: 'RV',
      founderImage: '/images/owner.png',
      quote: 'We used to get 5-6 phone calls a month. After GrowLokal AI automated our Google profile and WhatsApp lead responder, we signed up 48 new annual memberships in just 30 days!',
      metrics: [
        { label: 'Google Score', value: '24 → 91', change: '+279%' },
        { label: 'Monthly Walk-ins', value: '14 → 62', change: '+342%' },
        { label: 'WhatsApp Inquiries', value: '8 → 76/mo', change: '9.5x' },
      ],
    },
    faqs: [
      {
        q: 'Can GrowLokal handle trial workout bookings for our gym?',
        a: 'Yes! Our WhatsApp agent can capture customer details, send available workout slots, and send an automated confirmation message right to their WhatsApp.',
      },
      {
        q: 'Will it post about our personal trainers and facilities?',
        a: 'Absolutely. The AI creates weekly posts highlighting your trainers, cardio equipment, weight sections, and membership offers.',
      },
      {
        q: 'Does it support regional languages like Telugu or Tamil?',
        a: 'Yes! GrowLokal writes authentic vernacular posts and answers WhatsApp queries in Telugu, Tamil, Kannada, and English.',
      },
      {
        q: 'How quickly will our gym rank higher on Google Maps?',
        a: 'Most gyms see notable increases in Google Maps views and phone calls within 2 to 3 weeks of profile optimization and regular AI posting.',
      },
    ],
  },

  'doctors-clinics': {
    slug: 'doctors-clinics',
    label: 'Doctors & Health Clinics',
    singular: 'health clinic',
    painPoint: 'patients booking with competitor clinics that answer WhatsApp appointment enquiries faster',
    searchExample: 'pediatric clinic near me open now',
    image: '/images/biz_doctor.png',
    badge: '🩺 AI Patient Acquisition for Clinics & Doctors',
    heroHeadline: 'Fill Your Clinic Appointment Calendar on Autopilot',
    heroSubheadline: 'Rank #1 for specialized local healthcare searches, answer patient inquiries 24/7 on WhatsApp, and automate Google review responses.',
    stats: [
      { number: '3.8x', label: 'More Direct Patient Bookings' },
      { number: '15 min', label: 'Avg Inquiry Response Time' },
      { number: '#1', label: 'Local Medical 3-Pack' },
    ],
    popularKeywords: ['doctor near me', 'dental clinic near me', 'pediatrician open now', 'eye clinic consultation price', 'best skin doctor in town'],
    painPointsList: [
      {
        icon: '🏥',
        stat: '74%',
        title: 'Patients Search Nearby Before Visiting',
        desc: 'Patients choose doctors with 4.8+ ratings, recent patient reviews, and updated clinic timings on Google.',
        solution: 'Google Leads Agent keeps your consultation hours, doctor profiles, and emergency contacts always accurate.',
      },
      {
        icon: '⭐',
        stat: '81%',
        title: 'Unanswered Google Reviews',
        desc: 'Patients leave positive feedback or questions that go neglected, lowering your clinic trust and Google ranking.',
        solution: 'AI drafts warm, HIPAA-safe, empathetic replies to every review with 1-click WhatsApp approval.',
      },
      {
        icon: '💬',
        stat: '62%',
        title: 'Missed WhatsApp Consult Requests',
        desc: 'Patients message asking "Is doctor available today?" or "Consultation fee?". Delayed replies mean lost appointments.',
        solution: 'WhatsApp Chat Agent answers doctor availability, consultation fees, and clinic address in real time.',
      },
    ],
    agentUseCases: [
      {
        agent: 'Google Leads Agent',
        icon: '🔍',
        title: 'Medical Search Optimization',
        desc: 'Ensures your clinic ranks for urgent "near me" doctor searches and specialized treatments.',
        bulletPoints: ['Optimizes profile for specific symptoms & treatments', 'Publishes weekly health awareness tips on GBP', 'Collects & manages 5-star patient reviews'],
      },
      {
        agent: 'WhatsApp Chat Agent',
        icon: '💬',
        title: '24/7 Patient Concierge',
        desc: 'Handles appointment slot enquiries, clinic timings, and location sharing in Telugu, Tamil, and English.',
        bulletPoints: ['Answers consultation fees and doctor specialties', 'Collects patient name, age, and preferred time slot', 'Hands off complex medical questions to clinic staff'],
      },
      {
        agent: 'Social Media Agent',
        icon: '📱',
        title: 'Health Awareness Content',
        desc: 'Publishes preventive health tips, seasonal fever alerts, and clinic achievement updates to build credibility.',
        bulletPoints: ['Educational infographics and doctor quotes', 'Seasonal wellness reminders in regional languages', 'Builds trusted authority in your neighborhood'],
      },
      {
        agent: 'Campaign Agent',
        icon: '📣',
        title: 'Health Camp & Checkup Announcements',
        desc: 'Notify existing patients about free dental checkups, seasonal vaccination drives, or new specialist visits.',
        bulletPoints: ['Direct WhatsApp broadcast to registered patients', 'High 95%+ open rate compared to SMS', 'Compliant with opt-in communication rules'],
      },
    ],
    caseStudy: {
      businessName: 'Apex Multi-Speciality Dental Care',
      location: 'Ameerpet, Hyderabad',
      founder: 'Dr. Rajesh Rao (BDS, MDS)',
      initials: 'RR',
      founderImage: '/images/owner.png',
      quote: 'We used to rely purely on word-of-mouth. GrowLokal AI optimized our Google profile and launched our Telugu WhatsApp bot — our appointment book is now full 2 weeks in advance.',
      metrics: [
        { label: 'Google Score', value: '29 → 94', change: '+224%' },
        { label: 'Weekly Consults', value: '18 → 54', change: '3x' },
        { label: 'Google 5-Star Reviews', value: '22 → 148', change: '+572%' },
      ],
    },
    faqs: [
      {
        q: 'Is GrowLokal suitable for private practices and multi-doctor clinics?',
        a: 'Yes, GrowLokal is used by dental clinics, pediatricians, dermatologists, eye hospitals, and general physician clinics across South India.',
      },
      {
        q: 'Does it replace our front desk receptionist?',
        a: 'Not at all! It assists your receptionist by automatically answering routine questions (timings, fees, location) 24/7, leaving staff free for in-clinic patient care.',
      },
      {
        q: 'How does it handle review replies appropriately?',
        a: 'Our AI drafts professional, empathetic, medical-compliant responses. You review and click "Approve" on your phone before anything is published.',
      },
    ],
  },

  'bakers-cake-shops': {
    slug: 'bakers-cake-shops',
    label: 'Bakers & Cake Shops',
    singular: 'cake shop & bakery',
    painPoint: 'customers ordering customized cakes from bakeries with more recent photos and faster WhatsApp replies',
    searchExample: 'custom birthday cake shop near me',
    image: '/images/biz_baker.png',
    badge: '🎂 Sweet Revenue Growth for Local Bakeries',
    heroHeadline: 'Get More Custom Cake & Bakery Orders on Autopilot',
    heroSubheadline: 'Showcase your cake designs on Google & Instagram, send mouthwatering festival offers on WhatsApp, and capture last-minute party orders.',
    stats: [
      { number: '4.2x', label: 'More Custom Cake Enquiries' },
      { number: '90%', label: 'Orders Converted on WhatsApp' },
      { number: '#1', label: 'Bakery in Local Map Pack' },
    ],
    popularKeywords: ['cake shop near me', 'custom birthday cake', 'pastry shop near me', 'eggless cake delivery', 'midnight cake delivery'],
    painPointsList: [
      {
        icon: '🧁',
        stat: '83%',
        title: 'Cake Buyers Decide via Google Photos',
        desc: 'Customers searching for birthday cakes pick the bakery with the freshest, most appealing cake photos and clear pricing.',
        solution: 'Social & Google Agents showcase your latest designer cakes and customer celebration photos every week.',
      },
      {
        icon: '⚡',
        stat: '70%',
        title: 'Last-Minute Order Loss',
        desc: 'When someone needs a cake in 2 hours, they WhatsApp 3 bakeries. The first one to reply gets the ₹1,500 order.',
        solution: 'WhatsApp Chat Agent instantly shares flavor menus, pricing per kg, and takes delivery addresses.',
      },
      {
        icon: '🎁',
        stat: '5x',
        title: 'Missed Festival & Festive Revenue',
        desc: 'Diwali, Christmas, and New Year are peak seasons. Bakeries forget to send promotional messages to past customers.',
        solution: 'Campaign Agent sends beautiful festive discount broadcasts directly to your customer database.',
      },
    ],
    agentUseCases: [
      {
        agent: 'Google Leads Agent',
        icon: '🔍',
        title: 'Top Local Bakery Rank',
        desc: 'Ensures your bakery appears #1 for "birthday cake near me", "eggless pastry", and "theme cakes".',
        bulletPoints: ['Posts weekly photo updates of fresh creations', 'Highlights delivery radius and opening hours', 'Collects rave reviews from happy party hosts'],
      },
      {
        agent: 'WhatsApp Chat Agent',
        icon: '💬',
        title: 'Automated Cake Ordering',
        desc: 'Shares cake catalogs, flavor options, eggless choices, and collects delivery details automatically.',
        bulletPoints: ['Sends pricing per kg & photo menus', 'Answers customized theme inquiries instantly', 'Supports Telugu, Tamil, and English messages'],
      },
      {
        agent: 'Social Media Agent',
        icon: '📱',
        title: 'Drool-Worthy IG & FB Posts',
        desc: 'Regularly schedules reels, celebration clips, and seasonal pastry announcements.',
        bulletPoints: ['Highlighting weekend specials & custom orders', 'Hashtags tailored for local neighborhood foodies', 'Consistent high-engagement social presence'],
      },
      {
        agent: 'Campaign Agent',
        icon: '📣',
        title: 'Festive Cake Broadcasts',
        desc: 'Broadcast pre-order discounts for Rakhi, Diwali, Valentine’s Day, and New Year directly to past buyers.',
        bulletPoints: ['Drive 40+ bulk orders before major festivals', 'Prepaid credit system — zero monthly waste', 'Track who clicked and booked'],
      },
    ],
    caseStudy: {
      businessName: 'Almond House Artisanal Bakery',
      location: 'Himayatnagar, Hyderabad',
      founder: 'Suresh & Preeti K.',
      initials: 'SK',
      founderImage: '/images/priya.png',
      quote: 'We sent one festive WhatsApp offer with GrowLokal and booked 65 customized Plum Cakes in 4 hours! Our Google ranking went from #14 to #1.',
      metrics: [
        { label: 'Google Maps Views', value: '+310%', change: '3.1x' },
        { label: 'Weekend Orders', value: '25 → 88', change: '+252%' },
        { label: 'WhatsApp Revenue', value: '₹1.8L/mo', change: 'Record High' },
      ],
    },
    faqs: [
      {
        q: 'Can the WhatsApp agent send our custom cake photo menu?',
        a: 'Yes! It can share links to your menu, flavor choices (chocolate truffle, red velvet, butterscotch, etc.), and price estimates per kilogram.',
      },
      {
        q: 'How does it help with festival rush periods?',
        a: 'Campaign Agent helps you schedule early-bird pre-order announcements 10 days before festivals like Diwali, Christmas, or Valentine’s Day.',
      },
    ],
  },

  'salons-spas': {
    slug: 'salons-spas',
    label: 'Salon Owners & Spas',
    singular: 'salon & spa',
    painPoint: 'walk-in customers choosing a competitor salon with more Google reviews and recent hairstyle photos',
    searchExample: 'best unisex salon near me',
    image: '/images/biz_salon.png',
    badge: '💇 Scalable Growth for Salons & Beauty Spas',
    heroHeadline: 'Keep Your Salon Chairs Full Monday to Sunday',
    heroSubheadline: 'Attract high-ticket bridal, haircut & spa clients from Google Maps, automate WhatsApp booking requests, and retain clients with festive packages.',
    stats: [
      { number: '3.5x', label: 'More Weekly Appointments' },
      { number: '98%', label: 'Review Reply Rate' },
      { number: '#1', label: 'Local Salon 3-Pack' },
    ],
    popularKeywords: ['salon near me', 'best bridal makeup', 'unisex haircut near me', 'keratin treatment price', 'spa massage center near me'],
    painPointsList: [
      {
        icon: '✂️',
        stat: '78%',
        title: 'Customers Check Salon Photos First',
        desc: 'Before visiting a salon, clients look up recent haircuts, bridal makeup work, and interior cleanliness on Google Maps.',
        solution: 'Google & Social Agents regularly post your staff’s best hair styling and skincare transformations.',
      },
      {
        icon: '💬',
        stat: '55%',
        title: 'Unattended Appointment Inquiries',
        desc: 'Clients text during busy salon hours asking for pricing and stylist slots. Delayed replies cause them to call another salon.',
        solution: 'WhatsApp Chat Agent answers service rates, hair treatment packages, and books appointment slots 24/7.',
      },
      {
        icon: '⭐',
        stat: '4.8★',
        title: 'Review Score Determines New Walk-ins',
        desc: 'Salons with 100+ five-star reviews capture 4x more walk-in traffic than salons with 15-20 reviews.',
        solution: 'Automated review capture requests & 1-click AI replies build unmatched social proof.',
      },
    ],
    agentUseCases: [
      {
        agent: 'Google Leads Agent',
        icon: '🔍',
        title: 'Local Beauty Dominance',
        desc: 'Ranks your salon #1 for "unisex salon near me", "bridal makeup artist", and "hair spa".',
        bulletPoints: ['Posts weekly hairstyle and manicure updates', 'Optimizes service catalog on Google Profile', 'Drafts warm replies to all client reviews'],
      },
      {
        agent: 'WhatsApp Chat Agent',
        icon: '💬',
        title: '24/7 Salon Booking Concierge',
        desc: 'Answers pricing queries for keratin, botox hair treatment, facials, and hair coloring instantly.',
        bulletPoints: ['Shares service rate cards in Telugu/Tamil/English', 'Schedules appointment dates and times', 'Sends reminder messages to reduce no-shows'],
      },
      {
        agent: 'Social Media Agent',
        icon: '📱',
        title: 'Glamour & Transformation Posts',
        desc: 'Maintains an aesthetic Instagram grid with before/after hair transformations and skincare tips.',
        bulletPoints: ['Weekly scheduled beauty tips and reels content', 'Promotes seasonal bridal & grooming packages', 'Attracts local fashion-conscious clients'],
      },
      {
        agent: 'Campaign Agent',
        icon: '📣',
        title: 'Festive & Bridal Broadcasts',
        desc: 'Send WhatsApp broadcast campaigns with festive combo offers (e.g. Haircut + Facial + Mani-Pedi combo).',
        bulletPoints: ['Drives weekday traffic during slow hours', '95%+ open rate with personalized client greetings', 'Zero wasted SMS marketing spend'],
      },
    ],
    caseStudy: {
      businessName: 'Glow Unisex Salon & Spa',
      location: 'Kukatpally, Hyderabad',
      founder: 'Priya Sharma',
      initials: 'PS',
      founderImage: '/images/priya.png',
      quote: 'The WhatsApp campaigns are incredible. We sent one festive combo offer announcement and got 40+ customer bookings the same day in Telugu!',
      metrics: [
        { label: 'Google Score', value: '23 → 89', change: '+286%' },
        { label: 'Monthly Bookings', value: '45 → 160', change: '3.5x' },
        { label: 'Google Reviews', value: '18 → 112', change: '+522%' },
      ],
    },
    faqs: [
      {
        q: 'Can clients check service prices and book appointments on WhatsApp?',
        a: 'Yes! The WhatsApp agent can provide service rate cards and collect appointment requests directly on your smartphone.',
      },
      {
        q: 'Does it help bring customers during slow weekdays (Tuesdays/Wednesdays)?',
        a: 'Yes! You can use Campaign Agent to broadcast "Weekday Special 20% Off" offers to fill empty salon chairs on slow days.',
      },
    ],
  },

  'restaurants-cafes': {
    slug: 'restaurants-cafes',
    label: 'Restaurants & Cafes',
    singular: 'restaurant & cafe',
    painPoint: 'diners picking a competitor restaurant with better Google photos and faster table reservation replies',
    searchExample: 'best family restaurant near me',
    image: '/images/biz_chef.png',
    badge: '🍽️ AI Growth Engine for Restaurants & Cafes',
    heroHeadline: 'Fill Tables & Drive Direct Food Orders Every Day',
    heroSubheadline: 'Dominate food searches in your area, showcase delicious dishes on Google & Instagram, and automate table booking inquiries on WhatsApp.',
    stats: [
      { number: '4.5x', label: 'More Table Reservation Calls' },
      { number: '#1', label: 'Food & Dining Map Pack' },
      { number: '24/7', label: 'WhatsApp Menu & Booking' },
    ],
    popularKeywords: ['restaurants near me', 'best biryani near me', 'pure veg family restaurant', 'rooftop cafe near me', 'table booking near me'],
    painPointsList: [
      {
        icon: '🍲',
        stat: '86%',
        title: 'Diners Search & Check Menus on Maps',
        desc: 'When hungry customers look up "restaurants near me", they choose spots with updated food photos, price menus, and high ratings.',
        solution: 'Google Leads Agent keeps your food photos, specialty dishes, and timings updated weekly.',
      },
      {
        icon: '📱',
        stat: '65%',
        title: 'Third-Party Commission Drain',
        desc: 'Food delivery apps charge 25-30% commissions. Restaurants need direct customer relationships to stay profitable.',
        solution: 'WhatsApp Agent lets diners view your digital menu and order or book tables directly with zero commission.',
      },
      {
        icon: '⭐',
        stat: '1-Star',
        title: 'Negative Review Damage',
        desc: 'One unaddressed bad review about wait time or taste hurts dining traffic for weeks.',
        solution: 'AI drafts polite, professional resolution replies immediately to protect your restaurant reputation.',
      },
    ],
    agentUseCases: [
      {
        agent: 'Google Leads Agent',
        icon: '🔍',
        title: 'Local Foodie Rank Dominance',
        desc: 'Ranks your cafe/restaurant at the top of Google Maps for breakfast, lunch, and dinner searches.',
        bulletPoints: ['Publishes weekly signature dish photos & weekend specials', 'Optimizes menu keywords (Biryani, Mandi, South Indian Thali)', 'Collects verified 5-star diner reviews'],
      },
      {
        agent: 'WhatsApp Chat Agent',
        icon: '💬',
        title: 'Direct Table & Menu Assistant',
        desc: 'Answers questions about pure veg/non-veg options, AC seating, parking, and party reservations.',
        bulletPoints: ['Sends PDF / link to food menu on WhatsApp', 'Takes table reservations and party hall enquiries', 'Communicates fluently in Telugu, Tamil, and English'],
      },
      {
        agent: 'Social Media Agent',
        icon: '📱',
        title: 'Mouthwatering Food Content',
        desc: 'Schedules delicious dish photography, chef specials, and festival feast announcements.',
        bulletPoints: ['Weekly scheduled Instagram & Facebook food posts', 'Festive thali and special combo promotion', 'Engages local food bloggers and neighborhood diners'],
      },
      {
        agent: 'Campaign Agent',
        icon: '📣',
        title: 'Weekend & Festival Offer Broadcasts',
        desc: 'Broadcast weekend buffet offers, IPL match screening invites, or festive feast discounts to your diner list.',
        bulletPoints: ['Direct broadcast with 95%+ open rate', 'Bring back past diners with loyalty discounts', 'Zero third-party commission'],
      },
    ],
    caseStudy: {
      businessName: 'Urban Spice Family Restaurant',
      location: 'Dilsukhnagar, Hyderabad',
      founder: 'Mohammed Irfan',
      initials: 'MI',
      founderImage: '/images/classroom.png',
      quote: 'I used to spend hours writing Google posts and replying to reviews. Now AI does it all — I just approve on WhatsApp. We booked out all tables for Sunday dinner!',
      metrics: [
        { label: 'Google Search Clicks', value: '+340%', change: '3.4x' },
        { label: 'Weekend Table Bookings', value: '15 → 55', change: '+266%' },
        { label: 'Direct WhatsApp Orders', value: '₹2.4L/mo', change: 'Zero Commission' },
      ],
    },
    faqs: [
      {
        q: 'Can customers view our full food menu on WhatsApp?',
        a: 'Yes! The WhatsApp chatbot sends your digital menu link or photo card instantly whenever a customer asks for it.',
      },
      {
        q: 'How does it help reduce reliance on Zomato / Swiggy?',
        a: 'By ranking you #1 on Google Maps and giving customers a direct WhatsApp order/table booking link, customers connect with you directly without high commission fees.',
      },
    ],
  },

  'garages-mechanics': {
    slug: 'garages-mechanics',
    label: 'Car Garages & Mechanics',
    singular: 'auto repair garage',
    painPoint: 'drivers calling a competitor garage that shows up first on Google Maps and answers WhatsApp immediately during breakdowns',
    searchExample: 'car mechanic near me open now',
    image: '/images/biz_mechanic.png',
    badge: '🚗 High-Ticket Inquiries for Auto Garages & Mechanics',
    heroHeadline: 'Get More Car Service & Repair Jobs Every Day',
    heroSubheadline: 'Rank #1 when drivers search for urgent repairs, denting-painting, or periodic service in your city. Capture breakdown leads instantly on WhatsApp.',
    stats: [
      { number: '3.2x', label: 'More Service Inquiries' },
      { number: '5 min', label: 'Emergency Lead Response' },
      { number: '#1', label: 'Rank in Auto Repair Pack' },
    ],
    popularKeywords: ['car mechanic near me', 'car servicing center', 'denting painting near me', 'car ac repair near me', 'car battery replacement'],
    painPointsList: [
      {
        icon: '🔧',
        stat: '89%',
        title: 'Drivers Call the Top 2 Google Map Results',
        desc: 'When a car breaks down or needs periodic maintenance, car owners call the first trusted garage with good reviews.',
        solution: 'Google Leads Agent pushes your workshop into the Top 3 Local Map Pack.',
      },
      {
        icon: '⚡',
        stat: '3 min',
        title: 'Urgent Breakdown Response Window',
        desc: 'A stranded car owner calls 2 mechanics. The one who sends their location and answers pricing wins the towing and repair job.',
        solution: 'WhatsApp Chat Agent sends service estimates, towing helpline numbers, and location instantly.',
      },
      {
        icon: '🛡️',
        stat: '60%',
        title: 'Customer Trust & Transparency Issues',
        desc: 'Car owners fear overcharging. Showcasing certified repairs and customer reviews builds immediate credibility.',
        solution: 'Automated 5-star review collection and weekly GBP posts showing genuine repair work.',
      },
    ],
    agentUseCases: [
      {
        agent: 'Google Leads Agent',
        icon: '🔍',
        title: 'Top Local Workshop Rank',
        desc: 'Ensures your garage ranks for "car repair near me", "denting painting", and "car AC service".',
        bulletPoints: ['Updates service list (oil change, clutch overhaul, battery)', 'Publishes weekly before/after paint repair posts', 'Automates professional replies to all customer reviews'],
      },
      {
        agent: 'WhatsApp Chat Agent',
        icon: '💬',
        title: 'Instant Repair Estimate Assistant',
        desc: 'Answers service cost queries, collects car model & issue details, and schedules garage visits.',
        bulletPoints: ['Shares standard service packages & pricing estimates', 'Collects vehicle make, model, and problem photos', 'Communicates in Telugu, Tamil, and English'],
      },
      {
        agent: 'Social Media Agent',
        icon: '📱',
        title: 'Auto Maintenance Tips & Authority',
        desc: 'Posts monsoon car care tips, AC maintenance advice, and customer vehicle delivery photos.',
        bulletPoints: ['Weekly car maintenance infographics', 'Highlights expert mechanic staff & diagnostic tools', 'Builds long-term neighborhood vehicle trust'],
      },
      {
        agent: 'Campaign Agent',
        icon: '📣',
        title: 'Seasonal Service Camp Broadcasts',
        desc: 'Send WhatsApp broadcast campaigns for Summer AC checkup camps or Monsoon wiper & brake checkup discounts.',
        bulletPoints: ['Direct broadcast to past vehicle owners', 'High 90%+ repeat servicing conversion', 'Prepaid credit system — zero monthly lock-in'],
      },
    ],
    caseStudy: {
      businessName: 'Sri Balaji Multi-Brand Car Care',
      location: 'Gachibowli, Hyderabad',
      founder: 'Venkatesh Naidu',
      initials: 'VN',
      founderImage: '/images/biz_mechanic.png',
      quote: 'We used to wait for cars to come by chance. With GrowLokal AI managing our Google reviews and WhatsApp inquiries, we get 15+ major periodic service and painting jobs every week!',
      metrics: [
        { label: 'Google Score', value: '26 → 88', change: '+238%' },
        { label: 'Weekly Service Jobs', value: '8 → 32', change: '4x' },
        { label: 'Monthly Revenue', value: '₹3.5L/mo', change: '+180%' },
      ],
    },
    faqs: [
      {
        q: 'Can the chatbot collect the car model and symptoms from the customer?',
        a: 'Yes! It asks the customer for their car make/model, the issue they are facing (AC, noise, brake, denting), and notifies you immediately.',
      },
      {
        q: 'How does it help us get more fleet and periodic maintenance contracts?',
        a: 'By establishing you as the #1 rated workshop in your locality with 100+ positive reviews and active Google posts.',
      },
    ],
  },

  'travel-agencies': {
    slug: 'travel-agencies',
    label: 'Tours & Travel Agencies',
    singular: 'travel agency',
    painPoint: 'travellers booking tour packages with an agency that replies to WhatsApp enquiries within minutes',
    searchExample: 'best tour and travel agency near me',
    image: '/images/biz_travel.png',
    badge: '✈️ AI Lead Generation for Tours & Travel Agencies',
    heroHeadline: 'Book More Holiday & Pilgrimage Tour Packages',
    heroSubheadline: 'Capture holiday travelers and pilgrimage tour bookings directly on WhatsApp. Rank #1 for domestic & international tour searches.',
    stats: [
      { number: '3.6x', label: 'More Package Enquiries' },
      { number: '24/7', label: 'Instant Itinerary Delivery' },
      { number: '#1', label: 'Local Travel Agent Rank' },
    ],
    popularKeywords: ['travel agency near me', 'kashmir tour package', 'tirupati package from hyderabad', 'dubai trip agency', 'car rental for outstation'],
    painPointsList: [
      {
        icon: '🗺️',
        stat: '82%',
        title: 'Holiday Seekers Look for Local Verified Agents',
        desc: 'Families prefer booking holiday and pilgrimage packages with trusted local travel agencies near them.',
        solution: 'Google Leads Agent builds verified authority with customer trip photos and reviews.',
      },
      {
        icon: '💬',
        stat: '5 min',
        title: 'Enquiry Response Speed Wins the Booking',
        desc: 'When planning vacations, customers WhatsApp 3 agencies asking for itineraries. The fastest detailed reply wins.',
        solution: 'WhatsApp Chat Agent shares day-wise itineraries and package price estimates in seconds.',
      },
      {
        icon: '🏖️',
        stat: '4x',
        title: 'Seasonal Holiday Rush Opportunity',
        desc: 'Summer holidays, Dussehra, and Christmas are peak travel windows that require proactive marketing.',
        solution: 'Campaign Agent broadcasts early-bird holiday package deals to your customer database.',
      },
    ],
    agentUseCases: [
      {
        agent: 'Google Leads Agent',
        icon: '🔍',
        title: 'Top Local Travel Pack',
        desc: 'Ranks your agency for "Kashmir tour package", "Tirupati darshan travel", and "Goa holiday agent".',
        bulletPoints: ['Posts weekly travel packages & visa services', 'Optimizes tour categories and destination tags', 'Collects glowing 5-star traveler reviews'],
      },
      {
        agent: 'WhatsApp Chat Agent',
        icon: '💬',
        title: 'Automated Travel Itinerary Bot',
        desc: 'Sends destination itineraries, vehicle options (Innova, Tempo Traveller), and hotel category pricing.',
        bulletPoints: ['Shares PDF itineraries & inclusions/exclusions', 'Captures traveler count, dates, and budget', 'Responds in Telugu, Tamil, and English'],
      },
      {
        agent: 'Social Media Agent',
        icon: '📱',
        title: 'Inspiring Destination Content',
        desc: 'Schedules high-quality vacation photos, flight deal alerts, and customer tour group photos.',
        bulletPoints: ['Weekly destination spotlights and packing tips', 'Promotes seasonal pilgrimage & honeymoon packages', 'Attracts local families planning vacations'],
      },
      {
        agent: 'Campaign Agent',
        icon: '📣',
        title: 'Holiday & Long Weekend Broadcasts',
        desc: 'Broadcast long-weekend getaway deals and festival holiday discounts directly on WhatsApp.',
        bulletPoints: ['95%+ open rate with direct WhatsApp booking button', 'Prepaid credit system — no surprise bills', 'Proven 30+ family bookings per campaign'],
      },
    ],
    caseStudy: {
      businessName: 'Southern Trails Tours & Travels',
      location: 'Visakhapatnam, Andhra Pradesh',
      founder: 'M. Anand Kumar',
      initials: 'AK',
      founderImage: '/images/biz_travel.png',
      quote: 'We broadcasted our Char Dham and Kerala holiday packages on WhatsApp with GrowLokal — we sold out 3 bus batches in 48 hours!',
      metrics: [
        { label: 'Google Search Traffic', value: '+290%', change: '2.9x' },
        { label: 'Monthly Inquiries', value: '20 → 95', change: '+375%' },
        { label: 'Direct Bookings', value: '₹4.2L/mo', change: 'All-Time High' },
      ],
    },
    faqs: [
      {
        q: 'Can the WhatsApp bot send full tour itineraries to prospective travelers?',
        a: 'Yes! It can share day-by-day itineraries, flight/hotel inclusions, and pricing estimates based on destination choice.',
      },
      {
        q: 'Does it work for both domestic and international tours?',
        a: 'Yes, GrowLokal is tailored for domestic packages (Kerala, Kashmir, Goa, Tirupati) as well as international trips (Dubai, Thailand, Singapore).',
      },
    ],
  },

  'handyman-repair': {
    slug: 'handyman-repair',
    label: 'Handyman & Repair Services',
    singular: 'repair & maintenance service',
    painPoint: 'customers calling a competitor who shows up first for urgent electrician, plumbing, or AC repair searches',
    searchExample: 'electrician / plumber near me open now',
    image: '/images/biz_handyman.png',
    badge: '🔨 Rapid Lead Flow for Handyman & Repair Pros',
    heroHeadline: 'Get Urgent Repair Calls in Your Area Every Single Day',
    heroSubheadline: 'Rank #1 when homeowners search for electricians, plumbers, painters, or appliance repairs. Never miss an emergency call on WhatsApp.',
    stats: [
      { number: '4.1x', label: 'More Service Call Leads' },
      { number: '2 min', label: 'Emergency Lead Alert' },
      { number: '#1', label: 'Local Repair 3-Pack' },
    ],
    popularKeywords: ['plumber near me', 'electrician near me open now', 'ac repair service near me', 'carpenter near me', 'washing machine repair'],
    painPointsList: [
      {
        icon: '🚰',
        stat: '91%',
        title: 'Emergency Homeowners Call the First Result',
        desc: 'When a pipe bursts or power trips, customers don’t scroll past the first 2-3 Google Map numbers.',
        solution: 'Google Leads Agent ensures your service ranks in the top 3 with verified contact details.',
      },
      {
        icon: '⚡',
        stat: '2 min',
        title: 'Urgent Service Booking Window',
        desc: 'If you don’t answer immediately, the homeowner dials the next number on Google.',
        solution: 'WhatsApp Chat Agent answers immediately, shares standard inspection rates, and captures the service address.',
      },
      {
        icon: '⭐',
        stat: '10x',
        title: 'Reviews Prove Trust in Home Services',
        desc: 'Homeowners want trustworthy technicians inside their homes. 50+ positive Google reviews build instant safety and trust.',
        solution: 'Automated review capture requests sent to happy homeowners after job completion.',
      },
    ],
    agentUseCases: [
      {
        agent: 'Google Leads Agent',
        icon: '🔍',
        title: 'Top Local Handyman Rank',
        desc: 'Ranks your business for "electrician near me", "plumber in Ameerpet", and "appliance repair".',
        bulletPoints: ['Highlights 24/7 emergency service availability', 'Optimizes service radius across target neighborhoods', 'Collects glowing 5-star customer reviews'],
      },
      {
        agent: 'WhatsApp Chat Agent',
        icon: '💬',
        title: 'Instant Service Dispatch Assistant',
        desc: 'Answers pricing for inspection, collects the problem description & location pin on WhatsApp.',
        bulletPoints: ['Shares standard inspection & hourly charges', 'Collects customer address and problem photos', 'Communicates in Telugu, Tamil, and English'],
      },
      {
        agent: 'Social Media Agent',
        icon: '📱',
        title: 'Home Maintenance Tips',
        desc: 'Posts electrical safety tips, plumbing leak detection, and monsoon home care advice.',
        bulletPoints: ['Weekly DIY and safety maintenance tips', 'Highlights certified and background-verified technicians', 'Builds trusted neighborhood authority'],
      },
      {
        agent: 'Campaign Agent',
        icon: '📣',
        title: 'Seasonal Home Maintenance Broadcasts',
        desc: 'Send WhatsApp broadcast campaigns for Summer AC servicing or Pre-Monsoon roof & pipe checkups.',
        bulletPoints: ['Direct broadcast to past homeowners in your area', '95%+ open rate for repeat service calls', 'Prepaid credit system — zero monthly wastage'],
      },
    ],
    caseStudy: {
      businessName: 'QuickFix Home Solutions & Repairs',
      location: 'Kukatpally & Hitech City, Hyderabad',
      founder: 'S. Chandrasekhar',
      initials: 'SC',
      founderImage: '/images/biz_handyman.png',
      quote: 'We used to depend on local leaflets. GrowLokal AI got our Google Maps profile to #1 in Kukatpally — now our 8 technicians are busy from morning till night!',
      metrics: [
        { label: 'Google Search Calls', value: '+380%', change: '3.8x' },
        { label: 'Daily Service Jobs', value: '5 → 24', change: '+380%' },
        { label: 'Monthly Revenue', value: '₹2.8L/mo', change: 'Record High' },
      ],
    },
    faqs: [
      {
        q: 'Can the chatbot collect the customer location and repair issue?',
        a: 'Yes! It prompts the customer for their address/location pin and problem type (electrical, plumbing, carpentry, AC) and alerts your team.',
      },
      {
        q: 'How does it help us get jobs across multiple neighborhoods?',
        a: 'By optimizing your service areas in your Google Business Profile and ranking for location-specific keywords.',
      },
    ],
  },

  'interior-designers': {
    slug: 'interior-designers',
    label: 'Interior Designers & Decorators',
    singular: 'interior design studio',
    painPoint: 'high-value homeowners giving turnkey interior contracts to competitors who showcase reviews and 3D portfolio walkthroughs on Google',
    searchExample: 'best interior designers near me for 3bhk',
    image: '/images/biz_interior.png',
    badge: '🏡 Autonomous AI Marketing for Interior Designers & Architects',
    heroHeadline: 'Win High-Ticket Home & Commercial Interior Projects',
    heroSubheadline: 'Rank #1 on Google Maps for "interior designers near me", share portfolio highlights automatically, and qualify customer budget inquiries instantly on WhatsApp in Telugu, Tamil & English.',
    stats: [
      { number: '4.1x', label: 'More Qualified Project Enquiries' },
      { number: '#1', label: 'Rank in Local 3-Pack Maps' },
      { number: '100%', label: 'Instant WhatsApp Auto-Reply' },
    ],
    popularKeywords: ['interior designers near me', 'home interior decorator', 'modular kitchen designers', 'living room interior cost', 'budget interior designers'],
    painPointsList: [
      {
        icon: '📍',
        stat: '74%',
        title: 'Losing High-Budget Homeowners',
        desc: 'New flat buyers in Jubilee Hills, Whitefield, or Anna Nagar search Google Maps for top-rated designers with verified reviews and completed site photos.',
        solution: 'Google Leads Agent keeps your profile active with weekly site walkthrough photos and verified client review responses.',
      },
      {
        icon: '💬',
        stat: '3.8 hrs',
        title: 'Unqualified Inquiry Calls',
        desc: 'You waste hours on the phone answering "what is per sqft cost" instead of meeting serious clients ready for site visits.',
        solution: 'WhatsApp Chat Agent instantly shares budget estimators, portfolio lookbooks, and books designer site consultations.',
      },
      {
        icon: '📱',
        stat: '1x/mo',
        title: 'Neglected Social Media Portfolio',
        desc: 'You finish stunning interior handovers but lack the time to edit and publish reels, before/after stories, and material guides.',
        solution: 'Social Agent drafts and schedules aesthetically pleasing design posts on Instagram and Facebook automatically.',
      },
    ],
    agentUseCases: [
      {
        agent: 'Google Leads Agent',
        icon: '🔍',
        title: 'High-Intent Local Search Dominance',
        desc: 'Optimizes keywords for "3BHK interior design", "modular kitchen renovation", and "luxury villa architects" to rank #1.',
        bulletPoints: ['Ranks for high-ticket residential keywords', 'Auto-publishes weekly project showcase posts', 'Automated 1-click review generation on WhatsApp'],
      },
      {
        agent: 'WhatsApp Chat Agent',
        icon: '💬',
        title: '24/7 Budget & Portfolio Chatbot',
        desc: 'Answers floorplan questions, shares PDF lookbooks, and captures apartment name & budget from prospective clients.',
        bulletPoints: ['Understands Telugu, Tamil, Kannada & English', 'Shares modular kitchen & living room design catalogs', 'Books showroom visits and site measurements directly'],
      },
      {
        agent: 'Social Media Agent',
        icon: '📱',
        title: 'Visual Portfolio Showcase',
        desc: 'Turns completed site photos into engaging Instagram reels, carousel guides, and client testimonial spotlights.',
        bulletPoints: ['Automated project handover reels & carousels', 'Material & lighting selection tips for homeowners', 'Builds premium local brand authority'],
      },
      {
        agent: 'Campaign Agent',
        icon: '📣',
        title: 'New Community Festive Broadcasts',
        desc: 'Send WhatsApp broadcast campaigns to prospective homeowners in newly delivered apartment gated communities.',
        bulletPoints: ['Targeted festive offers (Diwali, Ugadi, Pongal)', 'Prepaid credit system — 0 wasted ad spend', 'Tracks catalog opens and consultation bookings'],
      },
    ],
    caseStudy: {
      businessName: 'Vistara Luxury Living & Interiors',
      location: 'Gachibowli & Financial District, Hyderabad',
      founder: 'Ananya Reddy',
      initials: 'AR',
      founderImage: '/images/biz_interior.png',
      quote: 'We used to depend 100% on architect referrals. GrowLokal AI got our Google profile to #1 in Gachibowli, bringing us 6 closed 3BHK turnkey interior contracts in our very first month!',
      metrics: [
        { label: 'Google Maps Rank', value: '#16 → #1', change: 'Top 3-Pack' },
        { label: 'Qualified Inquiries', value: '4 → 28/mo', change: '7x Growth' },
        { label: 'Project Pipeline', value: '₹42L+', change: 'Turnkey Value' },
      ],
    },
    faqs: [
      {
        q: 'Can the WhatsApp bot collect apartment size and client budget?',
        a: 'Yes! The bot automatically asks the customer for their floor plan (2BHK, 3BHK, Villa), handover date, and approximate budget range before booking a consultation.',
      },
      {
        q: 'How does it help us showcase our design portfolio?',
        a: 'The system automatically formats your project photos into Google Business updates and sends digital PDF lookbooks directly inside WhatsApp conversations.',
      },
    ],
  },

  'real-estate': {
    slug: 'real-estate',
    label: 'Real Estate Brokers & Agents',
    singular: 'real estate agency',
    painPoint: 'prospective property buyers and tenants contacting competing brokers whose listings and office location show high trust and top ratings on Google Maps',
    searchExample: 'best real estate agent for flats in hyderabad',
    image: '/images/biz_realtor.png',
    badge: '🏢 Autonomous AI Marketing for Real Estate Brokers & Developers',
    heroHeadline: 'Close More High-Value Property Deals with Inbound Leads',
    heroSubheadline: 'Rank #1 for local property & flat searches, auto-share floorplans and brochures on WhatsApp 24/7 in Telugu, Tamil & English, and capture verified buyer leads on autopilot.',
    stats: [
      { number: '3.8x', label: 'More Inbound Buyer Inquiries' },
      { number: '#1', label: 'Rank in Local Property Searches' },
      { number: '100%', label: 'Instant WhatsApp Auto-Reply' },
    ],
    popularKeywords: ['real estate agent near me', 'flats for sale in hyderabad', 'commercial office space for lease', 'gated community villas', 'property dealers near me'],
    painPointsList: [
      {
        icon: '📍',
        stat: '82%',
        title: 'Ignored on Local Maps',
        desc: 'When serious buyers search "realtors near me" or "flats for sale near me", large portal listings push individual brokerages down.',
        solution: 'Google Leads Agent builds strong local authority to rank your agency above aggregator directories.',
      },
      {
        icon: '💬',
        stat: '15 mins',
        title: 'Lost Buyer Attention Span',
        desc: 'Buyers browse properties at night. If they do not receive floor plans and pricing within minutes, they move to another agent.',
        solution: 'WhatsApp Chat Agent delivers property brochures, unit configurations, and videos within seconds 24/7.',
      },
      {
        icon: '📱',
        stat: '90%',
        title: 'Lack of Verified Review Trust',
        desc: 'Trust is everything in real estate. Clients choose brokers with dozens of authentic 5-star reviews praising transparency.',
        solution: 'Automated WhatsApp review funnels capture positive client testimonials after every successful registration.',
      },
    ],
    agentUseCases: [
      {
        agent: 'Google Leads Agent',
        icon: '🔍',
        title: 'Local Commercial & Residential SEO',
        desc: 'Ranks your consultancy for prime locality keywords like "HMDA approved plots", "commercial leasing", and "luxury penthouses".',
        bulletPoints: ['Ranks for locality-specific property searches', 'Auto-posts newly available listings & inventory', '1-click review generation on WhatsApp'],
      },
      {
        agent: 'WhatsApp Chat Agent',
        icon: '💬',
        title: '24/7 Property Brochure & Site Visit Bot',
        desc: 'Instantly shares location pins, price sheets, and schedules weekend site visit appointments.',
        bulletPoints: ['Works in Telugu, Tamil, Kannada & English', 'Sends PDF brochures and video walkthrough links', 'Captures verified buyer phone numbers & budgets'],
      },
      {
        agent: 'Social Media Agent',
        icon: '📱',
        title: 'High-Engagement Property Reels',
        desc: 'Creates property spotlights, investment market trends, and newly launched project announcements on Instagram and Facebook.',
        bulletPoints: ['Scheduled project video tours and layout graphics', 'Market appreciation trends and locality guides', 'Builds trustworthy local advisory brand'],
      },
      {
        agent: 'Campaign Agent',
        icon: '📣',
        title: 'New Launch & Pre-Booking Broadcasts',
        desc: 'Send WhatsApp broadcast campaigns for exclusive pre-launch pricing and investor opportunities directly to buyer databases.',
        bulletPoints: ['Personalized WhatsApp broadcast messages', '98% open rate compared to ignored emails', 'Instant site visit RSVP tracking'],
      },
    ],
    caseStudy: {
      businessName: 'Prime Habitat Properties & Advisors',
      location: 'Madhapur & Kondapur, Hyderabad',
      founder: 'Vikramaditya Raju',
      initials: 'VR',
      founderImage: '/images/biz_realtor.png',
      quote: 'GrowLokal transformed our brokerage. We went from cold-calling to receiving 15+ inbound buyer inquiries every weekend directly on WhatsApp. We closed 4 villa sales in 60 days!',
      metrics: [
        { label: 'Google Score', value: '29 → 93', change: '+320%' },
        { label: 'Weekend Site Visits', value: '3 → 19/wk', change: '6.3x' },
        { label: 'Commission Revenue', value: '₹14.5L', change: 'Record High' },
      ],
    },
    faqs: [
      {
        q: 'Can the WhatsApp bot handle commercial property leasing inquiries?',
        a: 'Yes! It handles both residential plots/flats and commercial office/retail space inquiries with custom area and budget filters.',
      },
      {
        q: 'How does it help us stand out against huge real estate portals?',
        a: 'By making your business the verified #1 local Google Maps advisory in your specific neighborhood, which buyers trust far more than generic portal listings.',
      },
    ],
  },

  'solar-solutions': {
    slug: 'solar-solutions',
    label: 'Solar & Rooftop Energy Companies',
    singular: 'solar energy company',
    painPoint: 'homeowners and factory owners awarding rooftop solar installation contracts to competing companies who dominate local Google Maps search results',
    searchExample: 'best rooftop solar panel installation near me',
    image: '/images/biz_solar.png',
    badge: '☀️ Autonomous AI Marketing for Solar Installation Companies',
    heroHeadline: 'Capture Rooftop Solar Inquiries & Subsidy Leads on Autopilot',
    heroSubheadline: 'Dominate Google search for "solar panel installation near me", answer government subsidy and ROI questions on WhatsApp 24/7, and book site survey appointments seamlessly.',
    stats: [
      { number: '4.5x', label: 'More High-Intent Solar Enquiries' },
      { number: '#1', label: 'Rank for Local Solar Searches' },
      { number: '100%', label: 'Instant WhatsApp Auto-Reply' },
    ],
    popularKeywords: ['solar panel installation near me', 'rooftop solar company', 'solar subsidy scheme', 'commercial solar plant cost', 'best solar installer'],
    painPointsList: [
      {
        icon: '📍',
        stat: '79%',
        title: 'Missing Subsidy Seekers',
        desc: 'Homeowners looking to install solar under government subsidy schemes search Google Maps first to find authorized local installers.',
        solution: 'Google Leads Agent optimizes your profile with subsidy certifications and completed rooftop project photos to rank #1.',
      },
      {
        icon: '💬',
        stat: '5 hrs',
        title: 'Repetitive Subsidy & Pricing Questions',
        desc: 'Clients ask the same questions about monthly savings, payback periods, and grid approval. Delayed replies mean lost deals.',
        solution: 'WhatsApp Chat Agent answers kW sizing, subsidy deductions, and monthly bill savings in seconds.',
      },
      {
        icon: '📱',
        stat: '85%',
        title: 'Lack of Completed Site Proof',
        desc: 'Commercial factory owners require proof of previous 10kW to 100kW installations before inviting you for technical surveys.',
        solution: 'Social Agent publishes verified video case studies and electricity bill reduction proof consistently.',
      },
    ],
    agentUseCases: [
      {
        agent: 'Google Leads Agent',
        icon: '🔍',
        title: 'Local Commercial & Residential Solar SEO',
        desc: 'Ranks your company for "on-grid solar installation", "industrial solar panels", and "government solar subsidy dealers".',
        bulletPoints: ['Ranks #1 for rooftop solar installation keywords', 'Auto-publishes weekly installation showcase photos', '1-click review generation on WhatsApp'],
      },
      {
        agent: 'WhatsApp Chat Agent',
        icon: '💬',
        title: '24/7 Solar Savings Calculator & Survey Bot',
        desc: 'Calculates approximate monthly savings based on electricity bill and schedules engineer rooftop survey visits.',
        bulletPoints: ['Answers subsidy guidelines & net metering questions', 'Works in Telugu, Tamil, Kannada & English', 'Books site inspection appointments automatically'],
      },
      {
        agent: 'Social Media Agent',
        icon: '📱',
        title: 'Educational Solar Content',
        desc: 'Creates infographics comparing electricity bill savings, subsidy deadlines, and video testimonials of happy homeowners.',
        bulletPoints: ['Automated ROI and savings comparison graphics', 'Government subsidy scheme alerts & deadlines', 'Builds clean energy brand leadership'],
      },
      {
        agent: 'Campaign Agent',
        icon: '📣',
        title: 'Summer Peak Bill WhatsApp Broadcasts',
        desc: 'Send WhatsApp broadcast campaigns before high-electricity summer months highlighting zero-bill solar solutions.',
        bulletPoints: ['High-converting summer offer broadcasts', 'Direct targeting to residential colonies & industrial areas', 'Prepaid credit system — 0 ad wastage'],
      },
    ],
    caseStudy: {
      businessName: 'SunShakti Solar Systems & Energy',
      location: 'Secunderabad & Uppal, Hyderabad',
      founder: 'Rahul Sharma',
      initials: 'RS',
      founderImage: '/images/biz_solar.png',
      quote: 'Before GrowLokal, we had to rely on door-to-door sales reps. Now, we receive 35+ high-intent rooftop solar inquiries every week directly from Google Maps and WhatsApp!',
      metrics: [
        { label: 'Google Score', value: '21 → 89', change: '+323%' },
        { label: 'Site Surveys Booked', value: '6 → 42/mo', change: '7x' },
        { label: 'Installed Capacity', value: '180 kW/mo', change: '+240%' },
      ],
    },
    faqs: [
      {
        q: 'Can the chatbot answer questions about government solar subsidies?',
        a: 'Yes! It explains current central & state subsidy tiers (e.g. PM Surya Ghar scheme) and calculates estimated customer out-of-pocket costs.',
      },
      {
        q: 'Can it book rooftop site measurement appointments?',
        a: 'Yes! It collects the customer monthly electricity bill amount, roof type, and preferred time slot for an engineer site visit.',
      },
    ],
  },

  'tax-legal-services': {
    slug: 'tax-legal-services',
    label: 'CA, Tax & Legal Advisors',
    singular: 'tax & legal consultancy',
    painPoint: 'small business owners and individuals taking their GST, ITR, and corporate compliance work to competing CA firms that show up first on Google',
    searchExample: 'chartered accountant near me for gst filing',
    image: '/images/biz_tax_legal.png',
    badge: '⚖️ Autonomous AI Marketing for CAs, Tax Consultants & Advocates',
    heroHeadline: 'Attract High-Value Corporate & Tax Filing Clients Locally',
    heroSubheadline: 'Rank top on Google for "CA near me" and "GST registration", auto-answer document checklists on WhatsApp in 4 languages, and retain clients with seasonal deadline reminders.',
    stats: [
      { number: '3.6x', label: 'More Retainer Client Inquiries' },
      { number: '#1', label: 'Rank in Local Advisory Searches' },
      { number: '100%', label: 'Instant WhatsApp Auto-Reply' },
    ],
    popularKeywords: ['chartered accountant near me', 'gst registration consultant', 'income tax return filing near me', 'company registration lawyer', 'trademark attorney'],
    painPointsList: [
      {
        icon: '📍',
        stat: '83%',
        title: 'Buried Under Old Directory Links',
        desc: 'When new business founders search "company registration CA near me", outdated portals show up unless your Google Business Profile is actively optimized.',
        solution: 'Google Leads Agent pushes your practice to the top 3-pack with verified compliance keywords.',
      },
      {
        icon: '💬',
        stat: '4 hrs',
        title: 'Repetitive Document Inquiries',
        desc: 'Clients repeatedly message asking what documents are required for GST, Trademark, or ITR filing, consuming precious staff hours.',
        solution: 'WhatsApp Chat Agent delivers instant document checklists and consultation appointment booking links 24/7.',
      },
      {
        icon: '📱',
        stat: '92%',
        title: 'Client Churn at Year End',
        desc: 'Without regular touchpoints, seasonal tax clients forget your practice and file elsewhere.',
        solution: 'Campaign Agent sends automated compliance calendar alerts & tax saving reminders directly on WhatsApp.',
      },
    ],
    agentUseCases: [
      {
        agent: 'Google Leads Agent',
        icon: '🔍',
        title: 'Local B2B Advisory Search Dominance',
        desc: 'Optimizes keywords for "startup incorporation", "tax audit consultant", and "FSSAI license agent" to rank #1.',
        bulletPoints: ['Ranks for high-value annual retainer keywords', 'Auto-posts weekly regulatory and tax updates', '1-click review generation on WhatsApp'],
      },
      {
        agent: 'WhatsApp Chat Agent',
        icon: '💬',
        title: '24/7 Document Checklist & Consultation Bot',
        desc: 'Answers service fee questions, delivers document lists, and schedules office or video consultations.',
        bulletPoints: ['Works in Telugu, Tamil, Kannada & English', 'Sends GST, ITR, and Pvt Ltd document checklists', 'Books paid consultation slots directly'],
      },
      {
        agent: 'Social Media Agent',
        icon: '📱',
        title: 'Authoritative Tax & Legal Updates',
        desc: 'Creates tax saving tips, budget summary infographics, and compliance deadline alerts on LinkedIn, Instagram, and Facebook.',
        bulletPoints: ['Automated financial deadline countdowns', 'Plain-language tax optimization guides', 'Builds trusted authority with MSME owners'],
      },
      {
        agent: 'Campaign Agent',
        icon: '📣',
        title: 'Tax Season & GST Due Date Broadcasts',
        desc: 'Send WhatsApp broadcast campaigns to past business owners before ITR and advance tax deadlines.',
        bulletPoints: ['Prepaid credit system — 0 surprise fees', 'Targeted reminders for March 31, July 31, and Sept 30', '98% open rate for repeat filings'],
      },
    ],
    caseStudy: {
      businessName: 'Rajesh Sharma & Associates (CA Firm)',
      location: 'Somajiguda & Begumpet, Hyderabad',
      founder: 'CA Rajesh Sharma',
      initials: 'RS',
      founderImage: '/images/biz_tax_legal.png',
      quote: 'We were completely dependent on word-of-mouth. GrowLokal AI optimized our Google presence and automated WhatsApp onboarding. We onboarded 38 new corporate monthly retainer clients in 45 days!',
      metrics: [
        { label: 'Google Score', value: '27 → 92', change: '+340%' },
        { label: 'Corporate Clients', value: '8 → 46/yr', change: '5.7x' },
        { label: 'Annual Retainers', value: '₹18L+', change: 'New Revenue' },
      ],
    },
    faqs: [
      {
        q: 'Can the WhatsApp bot send document checklists for company incorporation or GST?',
        a: 'Yes! When a client asks about GST, Pvt Ltd, or ITR, the bot sends a clean bulleted checklist of required documents instantly.',
      },
      {
        q: 'Can it remind our existing clients before tax filing due dates?',
        a: 'Yes! You can trigger automated WhatsApp broadcasts for advance tax, quarterly GST returns, and annual ITR deadlines with one click.',
      },
    ],
  },

  'retail-stores': {
    slug: 'retail-stores',
    label: 'Retail Shops & Boutiques',
    singular: 'retail boutique store',
    painPoint: 'local shoppers purchasing from competing commercial chains that show up on Google Maps with directions, live photos, and active WhatsApp catalogs',
    searchExample: 'best designer boutique and clothing store near me',
    image: '/images/biz_retail.png',
    badge: '🛍️ Autonomous AI Marketing for Retail Stores & Boutiques',
    heroHeadline: 'Drive Nearby Footfall & Repeat Shoppers to Your Store',
    heroSubheadline: 'Rank #1 on Google Maps for local shoppers searching for clothing, jewellery, electronics, or home goods, and broadcast new arrivals directly on WhatsApp in 4 languages.',
    stats: [
      { number: '3.9x', label: 'More Daily In-Store Footfall' },
      { number: '#1', label: 'Rank in Local Shopping Searches' },
      { number: '100%', label: 'Instant WhatsApp Auto-Reply' },
    ],
    popularKeywords: ['clothing store near me', 'designer boutique near me', 'jewellery shop open now', 'electronics store nearby', 'festive discount offers'],
    painPointsList: [
      {
        icon: '📍',
        stat: '86%',
        title: 'Hidden on Local Maps',
        desc: 'Shoppers search "saree boutique near me" or "electronics shop near me" on Google Maps before stepping out. If you lack photos & updates, they walk into competitors.',
        solution: 'Google Leads Agent publishes weekly new arrival photos and seasonal discount tags to rank #1.',
      },
      {
        icon: '💬',
        stat: '10 mins',
        title: 'Unanswered Stock Inquiries',
        desc: 'Shoppers message on WhatsApp asking "do you have this dress in stock" or "what are your Sunday timings". Slow replies mean lost sales.',
        solution: 'WhatsApp Chat Agent answers store timings, parking availability, and shares product photos instantly 24/7.',
      },
      {
        icon: '📱',
        stat: '90%',
        title: 'Customers Forgetting Your Store',
        desc: 'Shoppers visit once during a festival and never return because there is no automated re-engagement system.',
        solution: 'Campaign Agent sends personalized festive offer broadcasts and VIP private sale invites on WhatsApp.',
      },
    ],
    agentUseCases: [
      {
        agent: 'Google Leads Agent',
        icon: '🔍',
        title: 'Local Retail Search Dominance',
        desc: 'Ranks your shop for "bridal boutique", "organic grocery store", and "men ethnic wear" with optimized location pins.',
        bulletPoints: ['Ranks for high-intent local shopping searches', 'Auto-publishes weekly new arrival product posts', '1-click review generation on WhatsApp'],
      },
      {
        agent: 'WhatsApp Chat Agent',
        icon: '💬',
        title: '24/7 Product Catalog & Store Bot',
        desc: 'Shares location map link, operating hours, payment options, and recent collection photos.',
        bulletPoints: ['Works in Telugu, Tamil, Kannada & English', 'Shares digital product catalogs & seasonal lookbooks', 'Captures customer contact details for VIP list'],
      },
      {
        agent: 'Social Media Agent',
        icon: '📱',
        title: 'Trend-Driven Retail Content',
        desc: 'Creates stylish reels, new arrival announcements, and customer styling guides on Instagram and Facebook.',
        bulletPoints: ['Weekly scheduled product showcases and styling tips', 'Festive fashion guides for Ugadi, Diwali, Sankranti', 'Builds loyal local following'],
      },
      {
        agent: 'Campaign Agent',
        icon: '📣',
        title: 'Festive & End-of-Season WhatsApp Broadcasts',
        desc: 'Send WhatsApp broadcast campaigns to your customer database with exclusive discount codes and festival previews.',
        bulletPoints: ['Direct WhatsApp broadcast with photo cards', '95%+ open rate compared to ignored SMS', 'Prepaid credit system — 0 surprise bills'],
      },
    ],
    caseStudy: {
      businessName: 'Myra Designer Studio & Boutique',
      location: 'Himayatnagar & Jubilee Hills, Hyderabad',
      founder: 'Lavanya Reddy',
      initials: 'LR',
      founderImage: '/images/biz_retail.png',
      quote: 'GrowLokal has been a game-changer for our boutique. Our Google profile now brings 20+ walk-in shoppers every weekend, and our WhatsApp festive broadcast generated ₹4.2 Lakhs in sales in 48 hours!',
      metrics: [
        { label: 'Google Score', value: '25 → 94', change: '+376%' },
        { label: 'Weekend Footfall', value: '18 → 72', change: '4x' },
        { label: 'Festive Sales', value: '₹4.2L / 48hrs', change: 'Record High' },
      ],
    },
    faqs: [
      {
        q: 'Can we send WhatsApp broadcasts to customers who visited our store?',
        a: 'Yes! You can upload your customer contact list and send beautiful image cards with festive offers and discount codes in Telugu, Tamil, or English.',
      },
      {
        q: 'How does it help bring footfall from Google Maps?',
        a: 'By ranking your boutique at the top of "near me" search results with active weekly product updates, high ratings, and 1-click WhatsApp chat buttons.',
      },
    ],
  },

  'logistics-packers': {
    slug: 'logistics-packers',
    label: 'Logistics, Packers & Movers',
    singular: 'logistics & movers agency',
    painPoint: 'families and businesses hiring competing movers and mini-truck services whose verified ratings and quick quote responses show up first on Google Maps',
    searchExample: 'best packers and movers near me for house shifting',
    image: '/images/biz_logistics.png',
    badge: '📦 Autonomous AI Marketing for Packers, Movers & Transporters',
    heroHeadline: 'Book More Daily House Relocation & Transport Jobs',
    heroSubheadline: 'Rank #1 on Google Maps for "packers and movers near me", auto-estimate shifting costs on WhatsApp instantly 24/7 in 4 languages, and close bookings before competitors reply.',
    stats: [
      { number: '4.2x', label: 'More Daily Relocation Bookings' },
      { number: '#1', label: 'Rank in Local Movers Searches' },
      { number: '100%', label: 'Instant WhatsApp Auto-Reply' },
    ],
    popularKeywords: ['packers and movers near me', 'house shifting services', 'office relocation companies', 'local mini truck transport', 'intercity transport service'],
    painPointsList: [
      {
        icon: '📍',
        stat: '88%',
        title: 'Losing Urgent Shifting Leads',
        desc: 'When people need to shift home or transport goods this weekend, they search Google Maps and call the top 2 ranked movers with verified reviews.',
        solution: 'Google Leads Agent pushes your agency to #1 in your city with locality-specific ranking.',
      },
      {
        icon: '💬',
        stat: '2 mins',
        title: 'Leads Book The First Responder',
        desc: 'Shifting customers request quotes from 3 movers simultaneously. Whoever responds with a clean quote first wins the job 80% of the time.',
        solution: 'WhatsApp Chat Agent calculates instant shifting estimates based on BHK size and distance within seconds.',
      },
      {
        icon: '📱',
        stat: '94%',
        title: 'Review Fear & Suspicion',
        desc: 'Customers fear damaged goods or hidden charges. They only hire movers with dozens of recent 5-star reviews praising safe delivery.',
        solution: 'Automated post-move WhatsApp review prompts collect glowing reviews right when items are safely unloaded.',
      },
    ],
    agentUseCases: [
      {
        agent: 'Google Leads Agent',
        icon: '🔍',
        title: 'Local Relocation Search Dominance',
        desc: 'Ranks your agency for "intercity packers movers", "bike car transport", and "local mini truck rental".',
        bulletPoints: ['Ranks for high-intent shifting & transport searches', 'Auto-posts weekly safe packing & delivery photos', '1-click review generation on WhatsApp'],
      },
      {
        agent: 'WhatsApp Chat Agent',
        icon: '💬',
        title: '24/7 Instant Shifting Cost Estimator',
        desc: 'Asks pickup/drop locality, BHK size, moving date, and calculates estimated price range automatically.',
        bulletPoints: ['Works in Telugu, Tamil, Kannada & English', 'Calculates instant 1BHK, 2BHK, 3BHK shifting estimates', 'Collects customer phone number and schedules packing team survey'],
      },
      {
        agent: 'Social Media Agent',
        icon: '📱',
        title: 'Safe Packing & Reliability Highlights',
        desc: 'Shares video clips of bubble-wrapped furniture, clean covered trucks, and happy customer relocation stories.',
        bulletPoints: ['Weekly scheduled moving tips and packing videos', 'Highlights insurance coverage & transparent pricing', 'Builds trust against unverified fly-by-night movers'],
      },
      {
        agent: 'Campaign Agent',
        icon: '📣',
        title: 'Month-End & Commercial Office Relocation Broadcasts',
        desc: 'Send WhatsApp broadcast campaigns to commercial clients and residential databases before month-end peak moving dates.',
        bulletPoints: ['Targeted month-end discount promotions', 'Corporate and office relocation packages', 'Prepaid credit system — 0 monthly waste'],
      },
    ],
    caseStudy: {
      businessName: 'Global Safe Packers & Movers',
      location: 'Kukatpally & Miyapur, Hyderabad',
      founder: 'Rajesh Sharma',
      initials: 'RS',
      founderImage: '/images/biz_logistics.png',
      quote: 'We used to pay huge commissions to lead aggregator portals. With GrowLokal AI, our Google Maps profile generates 8-10 direct shifting bookings every single day on WhatsApp with zero middlemen fees!',
      metrics: [
        { label: 'Google Score', value: '23 → 90', change: '+391%' },
        { label: 'Direct Monthly Jobs', value: '18 → 84', change: '4.6x' },
        { label: 'Portal Commission Saved', value: '₹65,000/mo', change: '100% Direct' },
      ],
    },
    faqs: [
      {
        q: 'Can the bot give automated price estimates for house shifting?',
        a: 'Yes! It asks for BHK size (1BHK, 2BHK, 3BHK, Villa), pickup & drop locations, and lift availability to give a customized estimate range.',
      },
      {
        q: 'Does it support intercity and car transport inquiries?',
        a: 'Yes! It handles local shifting, intercity moves across South India, and vehicle transport inquiries effortlessly in regional languages.',
      },
    ],
  },

  'education-coaching': {
    slug: 'education-coaching',
    label: 'Education & Coaching Institutes',
    singular: 'coaching institute & tuition centre',
    painPoint: 'parents and students enrolling in competitor tuition centers and institutes that dominate local Google Maps search with top ratings and demo class booking links',
    searchExample: 'best neet and iit jee coaching institute near me',
    image: '/images/biz_education.png',
    badge: '🎓 Autonomous AI Marketing for Coaching & Tuition Institutes',
    heroHeadline: 'Fill Your Batches with Eager Students & Parents',
    heroSubheadline: 'Rank #1 on Google Maps for "IIT JEE / NEET / spoken English coaching near me", auto-share syllabus & batch timings on WhatsApp 24/7 in 4 languages, and book demo classes seamlessly.',
    stats: [
      { number: '4.3x', label: 'More Monthly Demo Class Admissions' },
      { number: '#1', label: 'Rank in Local Coaching Searches' },
      { number: '100%', label: 'Instant WhatsApp Auto-Reply' },
    ],
    popularKeywords: ['coaching institute near me', 'neet coaching centers', 'iit jee tuition classes', 'spoken english classes near me', 'maths physics tuition'],
    painPointsList: [
      {
        icon: '📍',
        stat: '85%',
        title: 'Hidden Behind Big EdTech Chains',
        desc: 'When parents search "best maths physics tuition near me", national commercial chains crowd out top local subject matter experts.',
        solution: 'Google Leads Agent pushes your institute to the top of Google Maps with verified student ranks and faculty credentials.',
      },
      {
        icon: '💬',
        stat: '3.5 hrs',
        title: 'Slow Inquiry Response During Work Hours',
        desc: 'Parents message in the evening asking about fees, batch timings, and faculty background. If you do not reply instantly, they enroll elsewhere.',
        solution: 'WhatsApp Chat Agent answers fee structures, batch schedules, and shares demo class registration links 24/7.',
      },
      {
        icon: '📱',
        stat: '90%',
        title: 'Results Never Shown Visually',
        desc: 'Your students score great marks, but prospective parents in your neighborhood never see the banners and rank celebrations.',
        solution: 'Social Agent automatically designs and publishes student rank celebrations, faculty tips, and admission alerts.',
      },
    ],
    agentUseCases: [
      {
        agent: 'Google Leads Agent',
        icon: '🔍',
        title: 'Local Academic & Coaching Search SEO',
        desc: 'Ranks your institute for "Class 10 12 board coaching", "NEET foundation batch", and "spoken English classes".',
        bulletPoints: ['Ranks for high-intent academic searches', 'Auto-posts weekly study tips & rank announcements', '1-click review generation on WhatsApp'],
      },
      {
        agent: 'WhatsApp Chat Agent',
        icon: '💬',
        title: '24/7 Course Syllabus & Demo Class Booking Bot',
        desc: 'Answers fee structure questions, delivers syllabus PDFs, and registers students for free 2-day demo classes.',
        bulletPoints: ['Works in Telugu, Tamil, Kannada & English', 'Sends subject syllabus, fee structure & batch timings', 'Books free demo class seat reservations directly'],
      },
      {
        agent: 'Social Media Agent',
        icon: '📱',
        title: 'Student Success & Academic Tips',
        desc: 'Creates exam strategy guides, memory tricks, and student rank appreciation posters on Instagram and Facebook.',
        bulletPoints: ['Weekly scheduled exam preparation & study tips', 'Student achievement posters and parent testimonials', 'Builds prestigious academic reputation locally'],
      },
      {
        agent: 'Campaign Agent',
        icon: '📣',
        title: 'New Batch Launch & Exam Season Broadcasts',
        desc: 'Send WhatsApp broadcast campaigns to parent inquiries before summer crash courses and academic year batch starts.',
        bulletPoints: ['High-converting summer camp & batch announcements', 'Targeted reminders for early-bird admission discounts', 'Prepaid credit system — 0 monthly waste'],
      },
    ],
    caseStudy: {
      businessName: 'Prakash Academy for Science & IIT-JEE',
      location: 'Dilsukhnagar & LB Nagar, Hyderabad',
      founder: 'Prof. K. Prakash Rao',
      initials: 'PR',
      founderImage: '/images/biz_education.png',
      quote: 'We used to distribute thousands of paper pamphlets. GrowLokal AI got our Google profile to #1 in Dilsukhnagar, filling all 3 of our Class 11 & 12 batches with 120+ students in just 3 weeks!',
      metrics: [
        { label: 'Google Score', value: '28 → 93', change: '+332%' },
        { label: 'Demo Registrations', value: '12 → 68/mo', change: '5.6x' },
        { label: 'Batch Enrollment', value: '100% Full', change: '3 Batches' },
      ],
    },
    faqs: [
      {
        q: 'Can the WhatsApp bot register students for a free demo class?',
        a: 'Yes! It captures student name, class/standard, school, and automatically books a seat for the upcoming weekend demo batch.',
      },
      {
        q: 'Can we send syllabus and fee structure brochures automatically?',
        a: 'Yes! When a parent or student asks for course details, the bot instantly sends the full PDF brochure and fee installment plan.',
      },
    ],
  },
};

export function getVertical(slug?: string | null): VerticalInfo | null {
  if (!slug || typeof slug !== 'string') return null;
  return VERTICAL_DATA[slug.toLowerCase()] ?? null;
}
