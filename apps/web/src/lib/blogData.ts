// Shared blog articles database — used by /blog, /blog/[slug], and dynamic sitemap.ts

export interface ArticleData {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  coverImage: string;
  featured?: boolean;
  takeaways: string[];
  content: string[];
}

export const ARTICLES_DATA: Record<string, ArticleData> = {
  'top-7-reasons-local-businesses-lose-customers': {
    slug: 'top-7-reasons-local-businesses-lose-customers',
    title: 'Top 7 Reasons Why Local Businesses in Hyderabad Lose Customer Calls on Google Maps',
    excerpt: 'Discover the most common Google Business Profile mistakes that cause customers to pick competing clinics, salons, & stores in Ameerpet & Kukatpally instead of yours.',
    category: 'Local SEO Guide',
    readTime: '4 min read',
    date: 'July 30, 2026',
    author: 'Srikanth V.',
    authorRole: 'Head of Local Business Growth, GrowLokal',
    authorAvatar: '/images/owner.png',
    coverImage: '/images/blog_google_maps.png',
    featured: true,
    takeaways: [
      'Over 80% of local customers search on Google Maps before visiting or calling.',
      'Unanswered reviews drop your local ranking score by up to 35%.',
      'Weekly AI Google posts double customer enquiry calls within 30 days.',
    ],
    content: [
      'In major South Indian commercial hubs like Ameerpet, Kukatpally, and Dilsukhnagar, over 80% of customers start their search for clinics, salons, cafes, or stores directly on Google Maps.',
      '1. Incomplete Google Business Profile: Over 45% of local businesses leave operating hours, service photos, or website links empty, causing Google to rank competitors higher.',
      '2. Zero Weekly Google Posts: Google algorithm prioritizes active profiles that publish weekly service updates, special offers, and new launches.',
      '3. Unanswered Customer Reviews: Failing to reply to Google reviews lowers your local map pack ranking score and signals poor customer service.',
      '4. Missing Local Keywords: Not mentioning specific service terms like "Best Dental Clinic Ameerpet" or "Unisex Salon Kukatpally" in your profile description.',
      '5. Slow Response Times to Customer WhatsApp Enquiries: Customers who do not get a response within 5 minutes move on to competing businesses.',
      '6. Lack of Vernacular Content: Not communicating in native Telugu or Tamil phrasing when targeting local customers who prefer local language updates.',
      '7. Outdated Store/Service Photos: Failing to highlight latest work and happy customers keeps prospective buyers hesitant.',
    ],
  },
  'how-to-reply-to-negative-google-reviews': {
    slug: 'how-to-reply-to-negative-google-reviews',
    title: 'How to Reply to Negative Customer Google Reviews (With Telugu & English Templates)',
    excerpt: 'Turn negative customer reviews into trust-building opportunities with our proven 3-step response blueprint and native language templates.',
    category: 'Review Management',
    readTime: '5 min read',
    date: 'July 28, 2026',
    author: 'Priya Sharma',
    authorRole: 'Reputation Lead, GrowLokal',
    authorAvatar: '/images/priya.png',
    coverImage: '/images/blog_reviews.png',
    featured: false,
    takeaways: [
      'Replying within 2 hours turns 60% of upset reviewers into satisfied clients.',
      'Always offer a direct WhatsApp resolution line.',
      'Use professional, empathetic Telugu & English templates.',
    ],
    content: [
      'A negative review on your Google Business Profile does not have to hurt your business. When handled professionally, a fast, empathetic response builds trust with future customers.',
      'Step 1: Acknowledge customer feedback immediately without getting defensive.',
      'Step 2: Take the conversation private by offering a direct WhatsApp call or meeting with the business owner.',
      'Step 3: Show prospective customers that you care deeply about quality of service.',
    ],
  },
  'whatsapp-marketing-strategy-for-local-businesses': {
    slug: 'whatsapp-marketing-strategy-for-local-businesses',
    title: 'Step-by-Step WhatsApp Marketing Strategy for South Indian Local Businesses in 2026',
    excerpt: 'How to automate customer enquiry follow-ups, broadcast festive offers, and book appointments using WhatsApp Business API.',
    category: 'WhatsApp Automation',
    readTime: '6 min read',
    date: 'July 25, 2026',
    author: 'Akheel R.',
    authorRole: 'AI Automation Lead, GrowLokal',
    authorAvatar: '/images/owner.png',
    coverImage: '/images/classroom.png',
    featured: false,
    takeaways: [
      'WhatsApp enquiry auto-replies improve lead booking by 3x.',
      'Broadcast festive offers directly to customer lists.',
      'Integrate 1-click UPI booking payment links.',
    ],
    content: [
      'WhatsApp is the #1 communication tool for local customers in South India. Learn how to convert prospective inquiries into loyal clients using automated WhatsApp flows.',
      '1. Auto-reply to instant customer inquiries with price lists, service details, and working hours.',
      '2. Send personalized broadcast announcements for upcoming festive offers and new service launches.',
      '3. Use 1-click WhatsApp payment links for easy advance booking collection.',
    ],
  },
};

export const ARTICLES_LIST = Object.values(ARTICLES_DATA);
