import Link from 'next/link';
import { getCity } from '@/lib/cityData';
import { VERTICAL_DATA } from '@/lib/verticalData';
import { Navbar } from '@/components/Navbar';
import { Breadcrumbs } from '@/components/Breadcrumbs';

interface Props {
  params: { cityName: string };
}

export default function CityPage({ params }: Props) {
  const city = getCity(params.cityName);
  const cityKey = params.cityName.toLowerCase();

  return (
    <div className="page-wrapper" style={{ background: '#ffffff', color: '#111827', minHeight: '100vh' }}>
      {/* Unified Navigation */}
      <Navbar isSticky />

      {/* Main City Content */}
      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px 90px' }}>
        <Breadcrumbs
          items={[
            { label: 'Cities', href: '/#coverage' },
            { label: `${city.name}, ${city.state}` },
          ]}
        />
        <div style={{ marginBottom: '40px' }}>
          <span style={{
            fontSize: '12px',
            fontWeight: '700',
            color: '#4F46E5',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '4px 12px',
            background: 'rgba(79, 70, 229, 0.1)',
            borderRadius: '20px',
            display: 'inline-block',
            marginBottom: '12px'
          }}>
            📍 Local SEO Solution for {city.name}, {city.state}
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginTop: '6px', marginBottom: '16px', color: '#111827' }}>
            Local Business Marketing Automation in {city.name}
          </h1>
          <p style={{ color: '#64748B', fontSize: '1.05rem', lineHeight: '1.7', maxWidth: '750px' }}>
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
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#4F46E5', textTransform: 'uppercase' }}>Customer Search Volume</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#111827', marginTop: '6px' }}>{city.searchVolume}</div>
          </div>
          <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#F97316', textTransform: 'uppercase' }}>Local Competition Level</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#111827', marginTop: '6px' }}>{city.competition}</div>
          </div>
          <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#0B1020', textTransform: 'uppercase' }}>WhatsApp Inquiry Rate</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#111827', marginTop: '6px' }}>92% Prefer WhatsApp</div>
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
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '16px', color: '#111827' }}>
            Top Commercial Hubs Covered in {city.name}
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
                color: '#0B1020'
              }}>
                🏬 {area}
              </span>
            ))}
          </div>
        </div>

        {/* Vertical cross-links for this city */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '16px', color: '#111827' }}>
            GrowLokal for {city.name} businesses, by type
          </h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {Object.values(VERTICAL_DATA).map((v) => (
              <Link key={v.slug} href={`/city/${cityKey}/${v.slug}`} style={{
                padding: '8px 16px', background: '#F8FAFC', border: '1px solid #e2e8f0',
                borderRadius: '20px', fontSize: '14px', fontWeight: '600', color: '#4F46E5',
                textDecoration: 'none',
              }}>
                {v.label} in {city.name} →
              </Link>
            ))}
          </div>
        </div>

        {/* 30-Day Growth Plan for this City */}
        <div style={{ marginBottom: '44px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '20px', color: '#111827' }}>
            30-Day Growth Blueprint for {city.name} Local Businesses
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', display: 'flex', gap: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(79, 70, 229, 0.15)', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0 }}>1</div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '4px' }}>Google Business Profile Audit &amp; Scorecard</h4>
                <p style={{ fontSize: '0.92rem', color: '#64748b', margin: 0 }}>Identify missing local search keywords like &ldquo;best clinic / salon / store near {city.areas[0]}&rdquo;.</p>
              </div>
            </div>

            <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', display: 'flex', gap: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(249, 115, 22, 0.2)', color: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0 }}>2</div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '4px' }}>Automated Vernacular Google Posts</h4>
                <p style={{ fontSize: '0.92rem', color: '#64748b', margin: 0 }}>Publish weekly AI posts highlighting products, services, and offers tailored for {city.name} customers.</p>
              </div>
            </div>

            <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', display: 'flex', gap: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(14, 68, 89, 0.15)', color: '#0B1020', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0 }}>3</div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '4px' }}>24/7 WhatsApp Customer Enquiry Responder</h4>
                <p style={{ fontSize: '0.92rem', color: '#64748b', margin: 0 }}>Auto-reply to price, service, and appointment queries instantly on WhatsApp.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div style={{
          padding: '40px',
          background: '#0B1020',
          borderRadius: '24px',
          color: '#ffffff',
          textAlign: 'center',
          boxShadow: '0 12px 36px rgba(14, 68, 89, 0.15)'
        }}>
          <h2 style={{ fontSize: '1.9rem', fontWeight: '800', marginBottom: '12px' }}>
            Ready to grow your {city.name} business?
          </h2>
          <p style={{ fontSize: '1.02rem', color: 'rgba(255,255,255,0.88)', marginBottom: '28px', maxWidth: '600px', margin: '0 auto 28px' }}>
            Get a free 10-second audit report of your Google Business Profile right now.
          </p>
          <Link
            href="/#audit-form"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px 36px',
              background: '#F97316',
              color: '#111827',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '800',
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(249, 115, 22, 0.4)',
              transition: 'all 0.2s ease'
            }}
          >
            Get My Free Audit Report →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container" style={{ textAlign: 'center', fontSize: '13px', color: '#64748B' }}>
          © {new Date().getFullYear()} GrowLokal Technologies. All rights reserved. • <Link href="/terms">Terms of Service</Link> • <Link href="/privacy">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
}
