import Link from 'next/link';
import { notFound } from 'next/navigation';

interface ArticleData {
  title: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  coverImage: string;
  takeaways: string[];
  content: string[];
}

const ARTICLE_DB: Record<string, ArticleData> = {
  'top-7-reasons-coaching-centers-lose-admissions': {
    title: 'Top 7 Reasons Why Coaching Centers in Hyderabad Lose Admissions on Google Maps',
    category: 'Local SEO Guide',
    readTime: '4 min read',
    date: 'July 30, 2026',
    author: 'Srikanth V.',
    authorRole: 'Head of Education Growth, GrowLokal',
    authorAvatar: '/images/owner.png',
    coverImage: '/images/blog_google_maps.png',
    takeaways: [
      'Over 80% of local parents search for tuition on Google Maps before calling.',
      'Unanswered reviews drop your local ranking score by up to 35%.',
      'Weekly AI Google posts double parent enquiry calls within 30 days.',
    ],
    content: [
      'In major South Indian educational hubs like Ameerpet, Kukatpally, and Dilsukhnagar, over 80% of parents start their search for Class 10, Intermediate, or NEET tuition centers directly on Google Maps.',
      '1. Incomplete Google Business Profile: Over 45% of institutes leave operating hours, course photos, or website links empty, causing Google to rank competitors higher.',
      '2. Zero Weekly Google Posts: Google algorithm prioritizes active profiles that publish weekly course announcements, batch openings, and result celebrations.',
      '3. Unanswered Parent Reviews: Failing to reply to Google reviews lowers your local map pack ranking score and signals poor parent service.',
      '4. Missing Local Keywords: Not mentioning specific course terms like "Class 10 CBSE Math Tuition Ameerpet" or "IIT JEE Academy Kukatpally" in your profile description.',
      '5. Slow Response Times to Parent WhatsApp Enquiries: Parents who do not get a response within 5 minutes move on to competing centers.',
      '6. Lack of Vernacular Content: Not communicating in native Telugu or Tamil phrasing when targeting local parents who prefer local language updates.',
      '7. Outdated Result Celebrations: Failing to highlight latest student success stories and batch openings keeps prospective parents hesitant.',
    ],
  },
  'how-to-reply-to-negative-google-reviews': {
    title: 'How to Reply to Negative Parent Google Reviews (With Telugu & English Templates)',
    category: 'Review Management',
    readTime: '5 min read',
    date: 'July 28, 2026',
    author: 'Priya Sharma',
    authorRole: 'Reputation Lead, GrowLokal',
    authorAvatar: '/images/priya.png',
    coverImage: '/images/blog_reviews.png',
    takeaways: [
      'Replying within 2 hours turns 60% of upset reviewers into satisfied parents.',
      'Always offer a direct WhatsApp resolution line.',
      'Use professional, empathetic Telugu & English templates.',
    ],
    content: [
      'A negative review on your Google Business Profile does not have to hurt your admissions. When handled professionally, a fast, empathetic response builds trust with future parents.',
      'Step 1: Acknowledge the parent feedback immediately without getting defensive.',
      'Step 2: Take the conversation private by offering a direct WhatsApp call or meeting with the Institute Director.',
      'Step 3: Show prospective parents that you care deeply about student success and faculty quality.',
    ],
  },
  'whatsapp-marketing-strategy-for-coaching-centers': {
    title: 'Step-by-Step WhatsApp Marketing Strategy for IIT/NEET Academies in 2026',
    category: 'WhatsApp Automation',
    readTime: '6 min read',
    date: 'July 25, 2026',
    author: 'Akheel R.',
    authorRole: 'AI Automation Lead, GrowLokal',
    authorAvatar: '/images/owner.png',
    coverImage: '/images/classroom.png',
    takeaways: [
      'WhatsApp enquiry auto-replies improve lead booking by 3x.',
      'Broadcast upcoming batch openings directly to parent lists.',
      'Integrate 1-click UPI fee collection links.',
    ],
    content: [
      'WhatsApp is the #1 communication tool for parents in South India. Learn how to convert prospective parent inquiries into paid admissions using automated WhatsApp flows.',
      '1. Auto-reply to instant parent inquiries with course details, fee structures, and demo timing.',
      '2. Send personalized broadcast announcements for upcoming batch openings and scholarship tests.',
      '3. Use 1-click WhatsApp payment links for easy fee collection.',
    ],
  },
};

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = ARTICLE_DB[params.slug];
  if (!article) return notFound();

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'GrowLokal Technologies',
      logo: 'https://growlokal.com/logo.png',
    },
    datePublished: '2026-07-30',
    description: article.content[0],
  };

  return (
    <div className="page-wrapper" style={{ background: '#ffffff', color: '#033540', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Navigation */}
      <header className="nav nav--scrolled" style={{ position: 'sticky' }}>
        <div className="nav-content">
          <Link href="/" className="nav-brand">
            Grow<span>Lokal</span>
          </Link>
          <div className="nav-links">
            <Link href="/blog" className="nav-link">← All Playbooks</Link>
            <Link href="/tools/google-score-calculator" className="nav-link">Score Tool</Link>
            <Link href="/tools/admission-roi-calculator" className="nav-link">ROI Calculator</Link>
            <Link href="/login" className="btn-nav">Owner Sign In →</Link>
          </div>
        </div>
      </header>

      {/* Main Layout with Article Content & Sticky Sidebar */}
      <main style={{ maxWidth: '1140px', margin: '0 auto', padding: '60px 24px 90px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '48px', alignItems: 'start' }}>
          {/* Left: Main Article Content */}
          <div>
            {/* Category & Meta */}
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#ffffff', background: '#2E9AA6', padding: '4px 12px', borderRadius: '12px', textTransform: 'uppercase' }}>
                {article.category}
              </span>
              <span style={{ fontSize: '13px', color: '#64748b', marginLeft: '12px' }}>
                {article.date} • {article.readTime}
              </span>
            </div>

            <h1 style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '24px', color: '#033540', lineHeight: 1.3 }}>
              {article.title}
            </h1>

            {/* Author Byline */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px', padding: '16px 20px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <img src={article.authorAvatar} alt={article.author} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#033540' }}>{article.author}</div>
                <div style={{ fontSize: '13px', color: '#5e7984' }}>{article.authorRole}</div>
              </div>
            </div>

            {/* Hero Cover Image */}
            <div style={{ width: '100%', height: '380px', borderRadius: '20px', overflow: 'hidden', marginBottom: '40px', boxShadow: '0 8px 24px rgba(3, 53, 64, 0.08)' }}>
              <img src={article.coverImage} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* Article Text Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', fontSize: '1.08rem', lineHeight: '1.8', color: '#0E4459' }}>
              {article.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Inline CTA Banner */}
            <div style={{
              marginTop: '52px',
              padding: '36px',
              background: '#0E4459',
              borderRadius: '24px',
              color: '#ffffff',
              textAlign: 'center',
              boxShadow: '0 12px 32px rgba(14, 68, 89, 0.15)'
            }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px' }}>
                Fix your coaching center&apos;s Google presence today
              </h3>
              <p style={{ fontSize: '0.98rem', color: 'rgba(255,255,255,0.85)', marginBottom: '24px' }}>
                Get your free 30-second audit report and automate your Google posts with GrowLokal AI.
              </p>
              <Link
                href="/#audit-form"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '14px 28px',
                  background: '#70BF63',
                  color: '#033540',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '800',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(112, 191, 99, 0.4)'
                }}
              >
                Run Free Audit Scan Now →
              </Link>
            </div>
          </div>

          {/* Right: Sticky Sidebar */}
          <aside style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Key Takeaways Box */}
            <div style={{
              padding: '24px',
              background: 'rgba(112, 191, 99, 0.12)',
              border: '1.5px solid rgba(112, 191, 99, 0.4)',
              borderRadius: '20px'
            }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#047857', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                💡 Key Takeaways
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {article.takeaways.map((item, i) => (
                  <li key={i} style={{ fontSize: '13.5px', color: '#033540', lineHeight: 1.5, display: 'flex', gap: '8px' }}>
                    <span>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Free Audit Card Widget */}
            <div style={{
              padding: '28px',
              background: 'var(--color-bg-primary)',
              border: '1.5px solid var(--color-border)',
              borderRadius: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#033540', marginBottom: '8px' }}>
                Free Google Score Audit
              </h4>
              <p style={{ fontSize: '0.88rem', color: '#5e7984', marginBottom: '18px' }}>
                Compare your coaching center vs top area competitors in 10 seconds.
              </p>
              <Link
                href="/tools/google-score-calculator"
                style={{
                  display: 'block',
                  padding: '12px 18px',
                  background: '#0E4459',
                  color: '#ffffff',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '700',
                  textDecoration: 'none'
                }}
              >
                Compare Competitor Score →
              </Link>
            </div>

            {/* Related Articles with Thumbnails */}
            <div style={{
              padding: '24px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '20px'
            }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#033540', marginBottom: '16px' }}>
                Popular Playbooks
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Link href="/blog/how-to-reply-to-negative-google-reviews" style={{ display: 'flex', gap: '12px', textDecoration: 'none', alignItems: 'center' }}>
                  <img src="/images/blog_reviews.png" alt="Reviews" style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#033540', lineHeight: 1.35 }}>How to Reply to Negative Reviews</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>5 min read</div>
                  </div>
                </Link>
                <Link href="/blog/whatsapp-marketing-strategy-for-coaching-centers" style={{ display: 'flex', gap: '12px', textDecoration: 'none', alignItems: 'center' }}>
                  <img src="/images/classroom.png" alt="WhatsApp" style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#033540', lineHeight: 1.35 }}>WhatsApp Marketing Strategy 2026</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>6 min read</div>
                  </div>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container" style={{ textAlign: 'center', fontSize: '13px', color: '#5e7984' }}>
          © {new Date().getFullYear()} GrowLokal Technologies. All rights reserved. • <Link href="/terms">Terms of Service</Link> • <Link href="/privacy">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
}
