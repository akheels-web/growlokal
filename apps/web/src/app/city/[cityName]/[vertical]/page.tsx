import Link from 'next/link';
import { getCity, CITY_DATA } from '@/lib/cityData';
import { getVertical, VERTICAL_DATA } from '@/lib/verticalData';
import { Navbar } from '@/components/Navbar';
import { Breadcrumbs } from '@/components/Breadcrumbs';

interface Props {
  params: { cityName: string; vertical: string };
}

// City x vertical SEO landing pages — the long-tail extension of /city/[cityName].
// ponytail: reuses getCity()'s existing fallback for unknown cities; an unknown
// vertical slug 404s instead (verticals are a fixed, curated set, not open text).
export default function CityVerticalPage({ params }: Props) {
  const city = getCity(params.cityName);
  const cityKey = params.cityName.toLowerCase();
  const vertical = getVertical(params.vertical);

  if (!vertical) {
    return (
      <main style={{ maxWidth: 640, margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
        <h1>Business type not found</h1>
        <p><Link href={`/city/${cityKey}`}>← Back to {city.name}</Link></p>
      </main>
    );
  }

  const otherVerticals = Object.values(VERTICAL_DATA).filter((v) => v.slug !== vertical.slug);
  const otherCities = Object.keys(CITY_DATA).filter((c) => c !== cityKey);

  return (
    <div className="page-wrapper" style={{ background: '#ffffff', color: '#111827', minHeight: '100vh' }}>
      {/* Unified Navigation */}
      <Navbar isSticky />

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 90px' }}>
        <Breadcrumbs
          items={[
            { label: 'Cities', href: '/#coverage' },
            { label: `${city.name}`, href: `/city/${cityKey}` },
            { label: `${vertical.label}` },
          ]}
        />
        <div style={{ marginBottom: '40px' }}>
          <span style={{
            fontSize: '12px', fontWeight: '700', color: '#4F46E5', textTransform: 'uppercase',
            letterSpacing: '0.1em', padding: '4px 12px', background: 'rgba(79, 70, 229, 0.1)',
            borderRadius: '20px', display: 'inline-block', marginBottom: '12px',
          }}>
            📍 {vertical.label} in {city.name}, {city.state}
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginTop: '6px', marginBottom: '16px', color: '#111827' }}>
            AI Marketing for {vertical.label} in {city.name}
          </h1>
          <p style={{ color: '#64748B', fontSize: '1.05rem', lineHeight: '1.7', maxWidth: '750px' }}>
            When someone in {city.name} searches &ldquo;{vertical.searchExample}&rdquo;, is your {vertical.singular} the one that shows up? Right now you're likely losing {vertical.painPoint} — GrowLokal AI fixes that in {city.name}, in your own language.
          </p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px',
        }}>
          <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#4F46E5', textTransform: 'uppercase' }}>Local Search Demand</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#111827', marginTop: '6px' }}>{city.searchVolume}</div>
          </div>
          <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#F97316', textTransform: 'uppercase' }}>Local Competition</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#111827', marginTop: '6px' }}>{city.competition}</div>
          </div>
          <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#0B1020', textTransform: 'uppercase' }}>WhatsApp Enquiry Rate</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#111827', marginTop: '6px' }}>92% Prefer WhatsApp</div>
          </div>
        </div>

        <div style={{
          background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)',
          borderRadius: '20px', padding: '32px', marginBottom: '40px',
        }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '16px', color: '#111827' }}>
            Areas covered for {vertical.label.toLowerCase()} in {city.name}
          </h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {city.areas.map((area) => (
              <span key={area} style={{
                padding: '8px 16px', background: '#ffffff', border: '1px solid var(--color-border)',
                borderRadius: '20px', fontSize: '14px', fontWeight: '600', color: '#0B1020',
              }}>
                🏬 {area}
              </span>
            ))}
          </div>
        </div>

        {/* Cross-links: other verticals in this city, and this vertical in other cities */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '44px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '12px' }}>Other businesses in {city.name}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {otherVerticals.slice(0, 5).map((v) => (
                <Link key={v.slug} href={`/city/${cityKey}/${v.slug}`} style={{ color: '#4F46E5', fontSize: '14px', textDecoration: 'none' }}>
                  {v.label} in {city.name} →
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '12px' }}>{vertical.label} in other cities</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {otherCities.map((c) => (
                <Link key={c} href={`/city/${c}/${vertical.slug}`} style={{ color: '#4F46E5', fontSize: '14px', textDecoration: 'none' }}>
                  {vertical.label} in {CITY_DATA[c].name} →
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          padding: '40px', background: '#0B1020', borderRadius: '24px', color: '#ffffff',
          textAlign: 'center', boxShadow: '0 12px 36px rgba(14, 68, 89, 0.15)',
        }}>
          <h2 style={{ fontSize: '1.9rem', fontWeight: '800', marginBottom: '12px', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Ready to grow your {vertical.singular} in {city.name}?
          </h2>
          <p style={{ fontSize: '1.02rem', color: '#E2E8F0', marginBottom: '28px', maxWidth: '600px', margin: '0 auto 28px' }}>
            Get a free 10-second audit report of your Google Business Profile right now.
          </p>
          <Link href="/#audit-form" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '16px 36px',
            background: '#F97316', color: '#FFFFFF', borderRadius: '12px', fontSize: '16px',
            fontWeight: '800', textDecoration: 'none', boxShadow: '0 4px 16px rgba(249, 115, 22, 0.4)',
          }}>
            Get My Free Audit Report →
          </Link>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-container" style={{ textAlign: 'center', fontSize: '13px', color: '#64748B' }}>
          © {new Date().getFullYear()} GrowLokal Technologies. All rights reserved. • <Link href="/terms">Terms of Service</Link> • <Link href="/privacy">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
}
