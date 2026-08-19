'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getVertical, VERTICAL_DATA } from '@/lib/verticalData';
import { CITY_DATA } from '@/lib/cityData';
import { Navbar } from '@/components/Navbar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { BrandLogo } from '@/components/BrandLogo';

interface Props {
  params: { slug: string };
}

export default function IndustryLandingPage({ params }: Props) {
  const vertical = getVertical(params.slug);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [bizName, setBizName] = useState('');
  const [phone, setPhone] = useState('');
  const [auditSubmitted, setAuditSubmitted] = useState(false);

  if (!vertical) {
    return (
      <div className="page-wrapper" style={{ background: '#ffffff', color: '#111827', minHeight: '100vh', padding: '80px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '16px' }}>Industry Sector Not Found</h1>
        <p style={{ color: '#64748B', marginBottom: '24px' }}>The business sector you are looking for does not exist.</p>
        <Link href="/#industries" style={{ display: 'inline-block', padding: '12px 24px', background: '#0B1020', color: '#fff', borderRadius: '12px', textDecoration: 'none', fontWeight: '700' }}>
          ← View All Small Business Sectors
        </Link>
      </div>
    );
  }

  const otherVerticals = Object.values(VERTICAL_DATA).filter((v) => v.slug !== vertical.slug);
  const cities = Object.entries(CITY_DATA);

  function handleAuditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!bizName || !phone) return;
    setAuditSubmitted(true);
  }

  return (
    <div className="page-wrapper" style={{ background: '#ffffff', color: '#111827', minHeight: '100vh' }}>
      {/* ─── UNIFIED HEADER ─── */}
      <Navbar isSticky />

      {/* ─── HERO SECTION ─── */}
      <section style={{
        padding: '50px 24px 60px',
        background: 'linear-gradient(180deg, #F0F9FF 0%, #ffffff 100%)',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Breadcrumbs
            items={[
              { label: 'Industries', href: '/#industries' },
              { label: vertical.label },
            ]}
          />
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '48px',
            alignItems: 'center',
          }}>
            {/* Left Col: Hero Copy */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 16px',
                background: 'rgba(14, 68, 89, 0.08)',
                color: '#0B1020',
                borderRadius: '50px',
                fontSize: '13px',
                fontWeight: '800',
                marginBottom: '18px',
                letterSpacing: '0.02em',
              }}>
                {vertical.badge}
              </div>

              <h1 style={{
                fontSize: 'clamp(2.1rem, 3.8vw, 3.2rem)',
                fontWeight: '900',
                lineHeight: '1.18',
                color: '#111827',
                marginBottom: '20px',
                letterSpacing: '-0.03em',
              }}>
                {vertical.heroHeadline}
              </h1>

              <p style={{
                fontSize: '1.1rem',
                lineHeight: '1.65',
                color: '#475569',
                marginBottom: '32px',
                maxWidth: '620px',
              }}>
                {vertical.heroSubheadline}
              </p>

              {/* Stats Strip */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                marginBottom: '36px',
              }}>
                {vertical.stats.map((stat, i) => (
                  <div key={i} style={{
                    padding: '16px',
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1.5px solid #e2e8f0',
                    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
                    textAlign: 'center',
                  }}>
                    <div style={{
                      fontSize: '1.8rem',
                      fontWeight: '900',
                      color: i === 0 ? '#0B1020' : i === 1 ? '#175fab' : '#3be06d',
                      lineHeight: '1',
                      marginBottom: '4px',
                    }}>
                      {stat.number}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', lineHeight: '1.3' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <a
                  href="#audit-sector-form"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px 28px',
                    background: 'linear-gradient(135deg, #175fab 0%, #3be06d 100%)',
                    color: '#ffffff',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '800',
                    textDecoration: 'none',
                    boxShadow: '0 2px 8px rgba(23, 95, 171, 0.2)',
                  }}
                >
                  Claim Free {vertical.singular} Audit →
                </a>
                <a
                  href="/book-free-demo"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px 28px',
                    background: '#ffffff',
                    color: '#111827',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '700',
                    textDecoration: 'none',
                  }}
                >
                  Book 1-on-1 Demo
                </a>
              </div>
            </div>

            {/* Right: Sector Specific Realistic Visual Card */}
            <div style={{
              background: '#ffffff',
              border: '1.5px solid #e2e8f0',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 12px 36px rgba(15, 23, 42, 0.06)',
            }}>
              <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                aspectRatio: '16/10',
                marginBottom: '20px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #f0f7ff 0%, #e8fbf0 100%)',
                }}>
                  <img
                    src={vertical.image}
                    alt={vertical.label}
                    style={{
                      maxHeight: '85%',
                      maxWidth: '85%',
                      objectFit: 'contain',
                    }}
                  />
                </div>
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: '#0B1020',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: '800',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                }}>
                  ⭐ Top Ranked on Google Maps
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                  <span style={{ fontSize: '13.5px', color: '#64748b', fontWeight: '600' }}>Target Search Example:</span>
                  <span style={{ fontSize: '13.5px', color: '#0B1020', fontWeight: '800' }}>&ldquo;{vertical.searchExample}&rdquo;</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                  <span style={{ fontSize: '13.5px', color: '#64748b', fontWeight: '600' }}>Main Pain Point:</span>
                  <span style={{ fontSize: '13.5px', color: '#dc2626', fontWeight: '700' }}>Competitor Taking Customers</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13.5px', color: '#64748b', fontWeight: '600' }}>AI Automation Platform:</span>
                  <span style={{ fontSize: '13.5px', color: '#16a34a', fontWeight: '800' }}>Google Maps + WhatsApp</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PAIN POINTS & AI SOLUTIONS ─── */}
      <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <p style={{ fontSize: '13px', fontWeight: '700', color: '#175fab', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '8px' }}>
            Why Most {vertical.label} Struggle
          </p>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.02em' }}>
            The 3 Growth Roadblocks Costing You Customers
          </h2>
          <p style={{ fontSize: '1rem', color: '#64748B', maxWidth: '650px', margin: '8px auto 0' }}>
            Local competition is tough. Here is how your competitors take customers and how GrowLokal AI wins them back.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {vertical.painPointsList.map((item, i) => (
            <div key={i} style={{
              background: '#ffffff',
              border: '1.5px solid #e2e8f0',
              borderRadius: '20px',
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 6px 24px rgba(15, 23, 42, 0.04)',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontSize: '32px' }}>{item.icon}</span>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '800',
                    color: '#e11d48',
                    background: '#ffe4e6',
                    padding: '4px 10px',
                    borderRadius: '20px',
                  }}>
                    {item.stat} Impact
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#111827', marginBottom: '10px' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#64748b', lineHeight: '1.55', marginBottom: '20px' }}>
                  {item.desc}
                </p>
              </div>

              <div style={{
                background: 'rgba(23, 95, 171, 0.08)',
                border: '1.5px solid rgba(23, 95, 171, 0.2)',
                borderRadius: '12px',
                padding: '14px',
                fontSize: '13px',
                color: '#175fab',
                lineHeight: '1.45',
              }}>
                <strong>⚡ AI Fix:</strong> {item.solution}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 4 AI AGENTS TAILORED FOR THIS SECTOR ─── */}
      <section style={{ padding: '80px 24px', background: '#F8FAFC', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <p style={{ fontSize: '13px', fontWeight: '700', color: '#175fab', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '8px' }}>
              Your 24/7 AI Marketing Team
            </p>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#111827' }}>
              4 AI Agents Built Specifically for {vertical.label}
            </h2>
            <p style={{ fontSize: '1rem', color: '#64748B', maxWidth: '650px', margin: '8px auto 0' }}>
              Everything runs directly on WhatsApp. No complex dashboards, no technical knowledge needed.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            {vertical.agentUseCases.map((agent, i) => (
              <div key={i} style={{
                background: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '24px',
                padding: '32px',
                boxShadow: '0 8px 30px rgba(15, 23, 42, 0.04)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'rgba(14, 68, 89, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                  }}>
                    {agent.icon}
                  </div>
                  <div>
                    <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#175fab', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {agent.agent}
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#111827', margin: 0 }}>
                      {agent.title}
                    </h3>
                  </div>
                </div>

                <p style={{ fontSize: '0.94rem', color: '#475569', lineHeight: '1.6', marginBottom: '18px' }}>
                  {agent.desc}
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {agent.bulletPoints.map((bp, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: '#0B1020', fontWeight: '600' }}>
                      <span style={{ color: '#3be06d', fontWeight: '900' }}>✓</span>
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── REAL CASE STUDY & 30-DAY PROOF ─── */}
      <section style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0B1020 0%, #111827 100%)',
          borderRadius: '28px',
          padding: '44px',
          color: '#ffffff',
          boxShadow: '0 20px 50px rgba(3, 53, 64, 0.25)',
        }}>
          <div style={{ display: 'inline-block', background: 'rgba(59, 224, 109, 0.15)', color: '#3be06d', padding: '4px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', marginBottom: '16px' }}>
            ⚡ Real South Indian Success Story
          </div>

          <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '16px', lineHeight: '1.35', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            &ldquo;{vertical.caseStudy.quote}&rdquo;
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #175fab 0%, #3be06d 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900',
              fontSize: '18px',
            }}>
              {vertical.caseStudy.initials}
            </div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '16px', color: '#FFFFFF' }}>{vertical.caseStudy.founder}</div>
              <div style={{ color: '#CBD5E1', fontSize: '13px' }}>
                {vertical.caseStudy.businessName} • {vertical.caseStudy.location}
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '18px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}>
            {vertical.caseStudy.metrics.map((metric, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', fontWeight: '700' }}>
                  {metric.label}
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#ffffff', margin: '4px 0' }}>
                  {metric.value}
                </div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#3be06d', background: 'rgba(59, 224, 109, 0.2)', padding: '2px 8px', borderRadius: '6px' }}>
                  {metric.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── POPULAR KEYWORDS FOR THIS SECTOR ─── */}
      <section style={{ padding: '40px 24px 60px', maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#111827', marginBottom: '14px' }}>
          Keywords Nearby Customers Are Searching Right Now for {vertical.label}
        </h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {vertical.popularKeywords.map((kw, i) => (
            <span key={i} style={{
              padding: '8px 18px',
              background: '#F1F5F9',
              border: '1px solid #cbd5e1',
              borderRadius: '50px',
              fontSize: '13.5px',
              fontWeight: '700',
              color: '#0B1020',
            }}>
              🔍 {kw}
            </span>
          ))}
        </div>
      </section>

      {/* ─── LOCAL CITY CROSS-LINKS (SEO MATRIX) ─── */}
      <section style={{ padding: '60px 24px', background: '#F8FAFC', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#111827' }}>
              Find {vertical.label} AI Marketing in Your City
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#64748B' }}>
              Select your city for hyper-localized search trends, WhatsApp enquiry volumes, and area coverage.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {cities.map(([cityKey, city]) => (
              <Link
                key={cityKey}
                href={`/city/${cityKey}/${vertical.slug}`}
                style={{
                  padding: '16px 20px',
                  background: '#ffffff',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '16px',
                  textDecoration: 'none',
                  color: '#111827',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)',
                  transition: 'all 0.2s ease',
                  display: 'block',
                }}
              >
                <div style={{ fontWeight: '800', fontSize: '15px', marginBottom: '4px' }}>
                  📍 {city.name}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {vertical.singular} marketing in {city.name} →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTOR FAQS ─── */}
      <section style={{ padding: '80px 24px', maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ fontSize: '13px', fontWeight: '700', color: '#175fab', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Got Questions?
          </p>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#111827' }}>
            Frequently Asked Questions by {vertical.label}
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {vertical.faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '16px',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  type="button"
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '800',
                    color: '#111827',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span>{faq.q}</span>
                  <span style={{ fontSize: '12px', color: '#175fab' }}>{isOpen ? '▲' : '▼'}</span>
                </button>
                {isOpen && (
                  <div style={{ padding: '0 24px 20px', fontSize: '14.5px', color: '#475569', lineHeight: '1.6' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── AUDIT SCAN LEAD CAPTURE FORM ─── */}
      <section id="audit-sector-form" style={{ padding: '80px 24px', background: '#F8FAFC', borderTop: '1px solid #e2e8f0' }}>
        <div style={{
          maxWidth: '680px',
          margin: '0 auto',
          background: '#ffffff',
          border: '1.5px solid #cbd5e1',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: '12px', fontWeight: '800', color: '#175fab', background: 'rgba(23, 95, 171, 0.1)', padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase' }}>
            ⚡ 100% Free Instant Google Audit
          </span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', margin: '14px 0 8px' }}>
            Check Your {vertical.singular} Google Score
          </h3>
          <p style={{ fontSize: '0.94rem', color: '#64748b', marginBottom: '28px', lineHeight: '1.5' }}>
            Enter your business name and phone number to get your custom Google visibility audit report sent to your WhatsApp in 30 seconds.
          </p>

          {!auditSubmitted ? (
            <form onSubmit={handleAuditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input
                required
                placeholder={`Your ${vertical.label} Business Name (e.g. Apollo / Star / Fresh)`}
                value={bizName}
                onChange={(e) => setBizName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '15px',
                }}
              />
              <div className="phone-input-group">
                <div className="phone-prefix">
                  <svg width="22" height="15" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: '2.5px', boxShadow: '0 1px 3px rgba(0,0,0,0.15)', flexShrink: 0 }}>
                    <rect width="20" height="4.67" fill="#FF9933"/>
                    <rect y="4.67" width="20" height="4.67" fill="#FFFFFF"/>
                    <rect y="9.33" width="20" height="4.67" fill="#138808"/>
                    <circle cx="10" cy="7" r="1.8" stroke="#000080" strokeWidth="0.6" fill="none"/>
                  </svg>
                  <span className="phone-code">+91</span>
                  <span className="phone-divider" />
                </div>
                <input
                  required
                  type="tel"
                  maxLength={10}
                  placeholder="Enter 10-digit WhatsApp number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  className="phone-input-field"
                />
              </div>
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '15px 24px',
                  background: 'linear-gradient(135deg, #175fab 0%, #3be06d 100%)',
                  color: '#ffffff',
                  borderRadius: '12px',
                  fontSize: '15.5px',
                  fontWeight: '800',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(23, 95, 171, 0.2)',
                }}
              >
                Send Free {vertical.label} Report to WhatsApp →
              </button>
            </form>
          ) : (
            <div style={{ padding: '24px', background: 'rgba(59, 224, 109, 0.12)', borderRadius: '16px', color: '#15803D' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '6px' }}>Audit Scan Initiated!</h4>
              <p style={{ fontSize: '14px', margin: 0 }}>
                We are scanning Google Business Profile for <strong>{bizName}</strong>. Your full audit score and growth report will arrive at <strong>{phone}</strong> on WhatsApp shortly.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ─── EXPLORE OTHER SECTORS ─── */}
      <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827' }}>
            Explore AI Marketing for Other Local Sectors
          </h3>
          <p style={{ fontSize: '0.94rem', color: '#64748B' }}>
            GrowLokal AI is customized for 8 distinct small business categories across South India.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {otherVerticals.map((v) => (
            <Link
              key={v.slug}
              href={`/industry/${v.slug}`}
              style={{
                background: 'linear-gradient(135deg, #f0f7ff 0%, #e8fbf0 100%)',
                border: '1.5px solid #bce0f7',
                borderRadius: '16px',
                padding: '16px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#0F172A',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)',
                transition: 'transform 0.2s ease',
              }}
            >
              <div style={{ fontWeight: '700', fontSize: '13.5px', width: '65%' }}>
                {v.label}
              </div>
              <div style={{ width: '44px', height: '44px', flexShrink: 0 }}>
                <img src={v.image} alt={v.label} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="footer" style={{ borderTop: '1px solid #e2e8f0', background: '#ffffff', padding: '60px 24px 30px' }}>
        <div className="footer-container" style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <BrandLogo variant="footer" />
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '8px', marginBottom: '24px' }}>
            The #1 AI Marketing Platform built for South Indian Local Businesses.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', fontSize: '14px', color: '#0B1020', fontWeight: '600' }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
            <Link href="/#pricing" style={{ textDecoration: 'none', color: 'inherit' }}>Pricing</Link>
            <Link href="/#industries" style={{ textDecoration: 'none', color: 'inherit' }}>All Industries</Link>
            <Link href="/tools/google-score-calculator" style={{ textDecoration: 'none', color: 'inherit' }}>Score Calculator</Link>
            <Link href="/privacy" style={{ textDecoration: 'none', color: 'inherit' }}>Privacy</Link>
            <Link href="/terms" style={{ textDecoration: 'none', color: 'inherit' }}>Terms</Link>
          </div>
          <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '30px', paddingTop: '20px', fontSize: '12.5px', color: '#94a3b8' }}>
            © {new Date().getFullYear()} GrowLokal Technologies. All rights reserved.
          </div>
        </div>
      </footer>

      {/* ─── FLOATING WHATSAPP BUTTON ─── */}
      <div className="floating_btn">
        <a
          href={`https://api.whatsapp.com/send?phone=919876543210&text=Hi%20GrowLokal%2C%20I%20want%20to%20know%20more%20about%20GrowLokal%20for%20my%20${encodeURIComponent(vertical.singular)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Chat on WhatsApp with GrowLokal for ${vertical.label}`}
        >
          <div className="contact_icon">
            <svg
              viewBox="0 0 32 32"
              width="34"
              height="34"
              fill="#ffffff"
              aria-hidden="true"
            >
              <path d="M16 2C8.28 2 2 8.28 2 16c0 2.68.75 5.18 2.06 7.32L2 30l6.89-1.99C11 29.21 13.43 30 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.55c-2.3 0-4.47-.67-6.3-1.83l-.45-.29-4.68 1.35 1.36-4.54-.3-.47C4.41 19.92 3.73 17.99 3.73 16c0-6.77 5.5-12.27 12.27-12.27 6.77 0 12.27 5.5 12.27 12.27 0 6.77-5.5 12.28-12.27 12.28zm6.73-9.19c-.37-.18-2.18-1.08-2.52-1.2-.34-.12-.59-.18-.84.18-.25.37-.96 1.2-1.18 1.45-.22.25-.43.28-.8.09-.37-.18-1.56-.58-2.98-1.84-1.1-0.98-1.85-2.19-2.07-2.56-.22-.37-.02-.57.16-.75.17-.16.37-.43.55-.65.18-.22.25-.37.37-.62.12-.25.06-.46-.03-.65-.09-.18-.84-2.02-1.15-2.77-.3-.72-.61-.63-.84-.64l-.71-.01c-.25 0-.65.09-.99.46-.34.37-1.3 1.27-1.3 3.1 0 1.83 1.33 3.6 1.52 3.85.18.25 2.62 4 6.35 5.61.89.38 1.58.61 2.12.78.89.28 1.7.24 2.34.15.72-.11 2.18-.89 2.49-1.75.31-.86.31-1.6.22-1.75-.1-.15-.34-.24-.71-.43z" />
            </svg>
          </div>
        </a>
        <p className="text_icon">Talk to us?</p>
      </div>
    </div>
  );
}
