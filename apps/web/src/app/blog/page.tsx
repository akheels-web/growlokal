import Link from 'next/link';

const ARTICLES = [
  {
    slug: 'top-7-reasons-coaching-centers-lose-admissions',
    title: 'Top 7 Reasons Why Coaching Centers in Hyderabad Lose Admissions on Google Maps',
    excerpt: 'Discover the most common Google Business Profile mistakes that cause parents to pick competing tuition centers in Ameerpet & Kukatpally instead of yours.',
    category: 'Local SEO Guide',
    readTime: '4 min read',
    date: 'July 30, 2026',
    image: '/images/blog_google_maps.png',
    author: 'Growth Team',
    featured: true,
  },
  {
    slug: 'how-to-reply-to-negative-google-reviews',
    title: 'How to Reply to Negative Parent Google Reviews (With Telugu & English Templates)',
    excerpt: 'Turn negative parent reviews into trust-building opportunities with our proven 3-step response blueprint and native language templates.',
    category: 'Review Management',
    readTime: '5 min read',
    date: 'July 28, 2026',
    image: '/images/blog_reviews.png',
    author: 'Marketing Specialist',
    featured: false,
  },
  {
    slug: 'whatsapp-marketing-strategy-for-coaching-centers',
    title: 'Step-by-Step WhatsApp Marketing Strategy for IIT/NEET Academies in 2026',
    excerpt: 'How to automate parent enquiry follow-ups, broadcast exam result celebrations, and fill batch slots using WhatsApp Business API.',
    category: 'WhatsApp Automation',
    readTime: '6 min read',
    date: 'July 25, 2026',
    image: '/images/classroom.png',
    author: 'Automation Lead',
    featured: false,
  },
];

export default function BlogHubPage() {
  const featured = ARTICLES.find((a) => a.featured) || ARTICLES[0];
  const gridArticles = ARTICLES.filter((a) => !a.featured);

  return (
    <div className="page-wrapper" style={{ background: '#ffffff', color: '#033540', minHeight: '100vh' }}>
      {/* Navigation */}
      <header className="nav nav--scrolled" style={{ position: 'sticky' }}>
        <div className="nav-content">
          <Link href="/" className="nav-brand">
            Grow<span>Lokal</span>
          </Link>
          <div className="nav-links">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/tools/google-score-calculator" className="nav-link">Score Tool</Link>
            <Link href="/tools/admission-roi-calculator" className="nav-link">ROI Calculator</Link>
            <Link href="/resources/whatsapp-kit" className="nav-link">WhatsApp Kit</Link>
            <Link href="/login" className="btn-nav">Owner Sign In →</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1140px', margin: '0 auto', padding: '60px 24px 90px' }}>
        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <span style={{
            fontSize: '12px',
            fontWeight: '700',
            color: '#2E9AA6',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '4px 14px',
            background: 'rgba(46, 154, 166, 0.1)',
            borderRadius: '20px',
            display: 'inline-block',
            marginBottom: '12px'
          }}>
            📚 Local SEO &amp; Growth Knowledge Hub
          </span>
          <h1 style={{ fontSize: '2.6rem', fontWeight: '800', marginTop: '6px', marginBottom: '16px', color: '#033540' }}>
            Actionable Playbooks for Institute Directors
          </h1>
          <p style={{ color: '#5e7984', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto' }}>
            Proven strategies on local Google ranking, parent WhatsApp enquiry conversion, and review management built for South Indian academies.
          </p>
        </div>

        {/* Featured Hero Article Card */}
        {featured && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '36px',
            background: 'var(--color-bg-primary)',
            border: '1.5px solid var(--color-border)',
            borderRadius: '24px',
            overflow: 'hidden',
            marginBottom: '56px',
            boxShadow: '0 12px 32px rgba(3, 53, 64, 0.06)'
          }}>
            <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#ffffff', background: '#2E9AA6', padding: '4px 10px', borderRadius: '12px', textTransform: 'uppercase' }}>
                  ⭐ Featured Guide
                </span>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>• {featured.category}</span>
                <span style={{ fontSize: '13px', color: '#64748b' }}>• {featured.readTime}</span>
              </div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: '800', marginBottom: '14px', color: '#033540', lineHeight: 1.3 }}>
                <Link href={`/blog/${featured.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {featured.title}
                </Link>
              </h2>
              <p style={{ color: '#5e7984', fontSize: '1rem', lineHeight: '1.65', marginBottom: '24px' }}>
                {featured.excerpt}
              </p>
              <div>
                <Link
                  href={`/blog/${featured.slug}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '14px 24px',
                    background: '#0E4459',
                    color: '#ffffff',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '700',
                    textDecoration: 'none'
                  }}
                >
                  Read Featured Guide →
                </Link>
              </div>
            </div>
            <div style={{ position: 'relative', minHeight: '320px', background: '#e2e8f0' }}>
              <img
                src={featured.image}
                alt={featured.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        )}

        {/* Section Header & Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#033540' }}>
            All Playbook Articles
          </h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ padding: '6px 16px', background: '#0E4459', color: '#ffffff', borderRadius: '20px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>All Guides</span>
            <span style={{ padding: '6px 16px', background: '#F1F5F9', color: '#64748b', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Local SEO</span>
            <span style={{ padding: '6px 16px', background: '#F1F5F9', color: '#64748b', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Reviews</span>
            <span style={{ padding: '6px 16px', background: '#F1F5F9', color: '#64748b', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>WhatsApp</span>
          </div>
        </div>

        {/* Article Cards 2-Column Grid with Images */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px', marginBottom: '56px' }}>
          {gridArticles.map((article) => (
            <article key={article.slug} style={{
              background: '#ffffff',
              border: '1.5px solid var(--color-border)',
              borderRadius: '20px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 16px rgba(3, 53, 64, 0.05)',
              transition: 'all 0.2s ease'
            }}>
              {/* Image Header */}
              <div style={{ height: '200px', overflow: 'hidden', background: '#f1f5f9', position: 'relative' }}>
                <img
                  src={article.image}
                  alt={article.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{
                  position: 'absolute',
                  top: '14px',
                  left: '14px',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#033540',
                  background: '#ffffff',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                }}>
                  {article.category}
                </span>
              </div>

              {/* Card Body */}
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                    {article.date} • {article.readTime}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '10px', color: '#033540', lineHeight: 1.35 }}>
                    <Link href={`/blog/${article.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {article.title}
                    </Link>
                  </h3>
                  <p style={{ color: '#5e7984', fontSize: '0.94rem', lineHeight: '1.6', marginBottom: '20px' }}>
                    {article.excerpt}
                  </p>
                </div>
                <div>
                  <Link href={`/blog/${article.slug}`} style={{ fontSize: '14px', fontWeight: '700', color: '#2E9AA6', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Read Full Playbook →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', alignItems: 'center' }}>
          <button disabled style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>
            ← Previous Page
          </button>
          <span style={{ fontSize: '14px', fontWeight: '700', color: '#0E4459' }}>Page 1 of 1</span>
          <button disabled style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>
            Next Page →
          </button>
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
