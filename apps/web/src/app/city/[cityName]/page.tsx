import Link from 'next/link';

interface Props {
  params: { cityName: string };
}

const CITY_DATA: Record<string, { name: string; areas: string[]; state: string; heroDesc: string; searchVolume: string; competition: string }> = {
  hyderabad: {
    name: 'Hyderabad',
    areas: ['Ameerpet', 'Kukatpally', 'Dilsukhnagar', 'Madhapur', 'Himayatnagar', 'Secunderabad', 'Gachibowli', 'Narayanguda'],
    state: 'Telangana',
    heroDesc: 'Coaching centers in Ameerpet, Kukatpally & Dilsukhnagar are competing heavily for student admissions. GrowLokal AI puts your institute at the top of Google Maps & WhatsApp.',
    searchVolume: '45,000+ monthly parent searches',
    competition: 'High (850+ registered institutes)',
  },
  vijayawada: {
    name: 'Vijayawada',
    areas: ['Benz Circle', 'Governorpet', 'Moghalrajpuram', 'Patamata', 'Gudavalli', 'Kanuru'],
    state: 'Andhra Pradesh',
    heroDesc: 'Vijayawada parents actively search Google Maps for top Class 10, Intermediate & NEET tuition centers. GrowLokal automates your local marketing in Telugu.',
    searchVolume: '28,000+ monthly parent searches',
    competition: 'Very High (420+ institutes)',
  },
  visakhapatnam: {
    name: 'Visakhapatnam',
    areas: ['Dwaraka Nagar', 'MVP Colony', 'Gajuwaka', 'Asilmetta', 'Siripuram', 'Maddilapalem'],
    state: 'Andhra Pradesh',
    heroDesc: 'Attract students across Dwaraka Nagar & MVP Colony with AI-generated Google posts and automated 24/7 WhatsApp parent enquiry responses.',
    searchVolume: '22,000+ monthly parent searches',
    competition: 'High (310+ institutes)',
  },
  bengaluru: {
    name: 'Bengaluru',
    areas: ['Jayanagar', 'Rajajinagar', 'Marathahalli', 'Hebbal', 'Indiranagar', 'HSR Layout', 'Koramangala'],
    state: 'Karnataka',
    heroDesc: 'Dominate local tuition searches in Jayanagar, Rajajinagar & Marathahalli with native Kannada & English AI marketing automation.',
    searchVolume: '65,000+ monthly parent searches',
    competition: 'Extreme (1,200+ institutes)',
  },
};

export default function CityPage({ params }: Props) {
  const cityKey = params.cityName.toLowerCase();
  const city = CITY_DATA[cityKey] || {
    name: params.cityName.charAt(0).toUpperCase() + params.cityName.slice(1),
    areas: ['Central Academic Hub', 'Student District', 'Coaching Zone', 'North Area', 'South Area'],
    state: 'South India',
    heroDesc: `Supercharge student admissions for coaching & tuition centers in ${params.cityName} with GrowLokal AI.`,
    searchVolume: '15,000+ monthly parent searches',
    competition: 'Moderate',
  };

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
            <Link href="/#pricing" className="nav-link">Pricing</Link>
            <Link href="/login" className="btn-nav">Owner Sign In →</Link>
          </div>
        </div>
      </header>

      {/* Main City Content */}
      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '60px 24px 90px' }}>
        <div style={{ marginBottom: '40px' }}>
          <span style={{
            fontSize: '12px',
            fontWeight: '700',
            color: '#2E9AA6',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '4px 12px',
            background: 'rgba(46, 154, 166, 0.1)',
            borderRadius: '20px',
            display: 'inline-block',
            marginBottom: '12px'
          }}>
            📍 Local SEO Solution for {city.name}, {city.state}
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginTop: '6px', marginBottom: '16px', color: '#033540' }}>
            Coaching &amp; Tuition Center Marketing in {city.name}
          </h1>
          <p style={{ color: '#5e7984', fontSize: '1.05rem', lineHeight: '1.7', maxWidth: '750px' }}>
            {city.heroDesc}
          </p>
        </div>

        {/* Local Market Statistics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#2E9AA6', textTransform: 'uppercase' }}>Parent Search Volume</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#033540', marginTop: '6px' }}>{city.searchVolume}</div>
          </div>
          <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#70BF63', textTransform: 'uppercase' }}>Local Competition Level</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#033540', marginTop: '6px' }}>{city.competition}</div>
          </div>
          <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#0E4459', textTransform: 'uppercase' }}>WhatsApp Inquiry Rate</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#033540', marginTop: '6px' }}>92% Prefer WhatsApp</div>
          </div>
        </div>

        {/* Top Areas Grid */}
        <div style={{
          background: 'var(--color-bg-primary)',
          border: '1px solid var(--color-border)',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '40px'
        }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '16px', color: '#033540' }}>
            Top Educational Hubs Covered in {city.name}
          </h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {city.areas.map((area) => (
              <span key={area} style={{
                padding: '8px 16px',
                background: '#ffffff',
                border: '1px solid var(--color-border)',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#0E4459'
              }}>
                🏫 {area}
              </span>
            ))}
          </div>
        </div>

        {/* 30-Day Growth Plan for this City */}
        <div style={{ marginBottom: '44px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '20px', color: '#033540' }}>
            30-Day Growth Blueprint for {city.name} Institutes
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', display: 'flex', gap: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(46, 154, 166, 0.15)', color: '#2E9AA6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0 }}>1</div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '4px' }}>Google Business Profile Audit &amp; Scorecard</h4>
                <p style={{ fontSize: '0.92rem', color: '#64748b', margin: 0 }}>Identify missing local search keywords like &ldquo;IIT JEE coaching near {city.areas[0]}&rdquo;.</p>
              </div>
            </div>

            <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', display: 'flex', gap: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(112, 191, 99, 0.2)', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0 }}>2</div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '4px' }}>Automated Vernacular Google Posts</h4>
                <p style={{ fontSize: '0.92rem', color: '#64748b', margin: 0 }}>Publish weekly AI posts highlighting course results and batch openings tailored for {city.name} parents.</p>
              </div>
            </div>

            <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', display: 'flex', gap: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(14, 68, 89, 0.15)', color: '#0E4459', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0 }}>3</div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '4px' }}>24/7 WhatsApp Parent Enquiry Responder</h4>
                <p style={{ fontSize: '0.92rem', color: '#64748b', margin: 0 }}>Auto-reply to fee, timing, and demo queries instantly on WhatsApp.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div style={{
          padding: '40px',
          background: '#0E4459',
          borderRadius: '24px',
          color: '#ffffff',
          textAlign: 'center',
          boxShadow: '0 12px 36px rgba(14, 68, 89, 0.15)'
        }}>
          <h2 style={{ fontSize: '1.9rem', fontWeight: '800', marginBottom: '12px' }}>
            Ready to grow your {city.name} coaching center?
          </h2>
          <p style={{ fontSize: '1.02rem', color: 'rgba(255,255,255,0.88)', marginBottom: '28px', maxWidth: '600px', margin: '0 auto 28px' }}>
            Get a free 30-second audit report of your Google Business Profile right now.
          </p>
          <Link
            href="/#audit-form"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px 36px',
              background: '#70BF63',
              color: '#033540',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '800',
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(112, 191, 99, 0.4)',
              transition: 'all 0.2s ease'
            }}
          >
            Get My Free Audit Report →
          </Link>
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
