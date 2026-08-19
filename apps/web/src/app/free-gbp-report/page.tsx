'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, CheckCircle2, ShieldCheck, Sparkles, Check, ArrowRight } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';

const SUGGESTED_LOCAL_BUSINESSES = [
  { name: 'Apollo Clinic & Diagnostics', city: 'Ameerpet, Hyderabad', category: 'Health Clinic' },
  { name: 'Naturals Salon & Spa', city: 'T. Nagar, Chennai', category: 'Salon & Spa' },
  { name: 'Vistara Luxury Interiors', city: 'Indiranagar, Bengaluru', category: 'Interior Design' },
  { name: 'Cult Fitness Club', city: 'Madhapur, Hyderabad', category: 'Gym & Fitness' },
  { name: 'Karachi Bakery & Cafe', city: 'Banjara Hills, Hyderabad', category: 'Bakery' },
  { name: 'Sri Krishna Sweets', city: 'Mylapore, Chennai', category: 'Retail / Sweets' },
  { name: 'QuickFix Home Solutions', city: 'Kukatpally, Hyderabad', category: 'Handyman Services' },
  { name: 'SunPower Rooftop Solar', city: 'Kakkanad, Kochi', category: 'Solar Energy' },
  { name: 'Royal Care Dental Studio', city: 'RS Puram, Coimbatore', category: 'Dental Clinic' },
  { name: 'Urban Nest Properties', city: 'HSR Layout, Bengaluru', category: 'Real Estate' },
];

const POPULAR_INDUSTRIES = [
  'Salons & Spas', 'Clinics & Doctors', 'Gyms & Fitness', 'Restaurants & Cafes',
  'Interior Designers', 'Real Estate Brokers', 'Bakeries & Cake Shops', 'Solar Rooftop',
  'Retail Shops & Boutiques', 'CA, Tax & Legal Advisors', 'Logistics & Packers', 'Coaching Institutes'
];

export default function FreeGbpReportPage() {
  const [lang, setLang] = useState<'en' | 'te' | 'ta' | 'kn'>('en');
  const [searchTerm, setSearchTerm] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const filtered = SUGGESTED_LOCAL_BUSINESSES.filter(
    (b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleSelectBusiness(bizName: string, city: string) {
    setSelectedBusiness(`${bizName} — ${city}`);
    setSearchTerm(`${bizName} (${city})`);
    setShowDropdown(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!searchTerm || !phone) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);

      const targetBiz = selectedBusiness || searchTerm;
      const waText = encodeURIComponent(
        `Hi GrowLokal Team! Please send my Free Google Business Profile Audit Report for: ${targetBiz} to WhatsApp: +91 ${phone}.`
      );
      window.open(`https://api.whatsapp.com/send?phone=919876543210&text=${waText}`, '_blank');
    }, 600);
  }

  return (
    <div style={{ background: '#FAF8FF', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#111827' }}>
      
      {/* ─── MINIMAL HEADER: LOGO + LANGUAGE SELECTOR ONLY ─── */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #E2E8F0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{
          maxWidth: '1180px',
          margin: '0 auto',
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <BrandLogo variant="header" />

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as any)}
              style={{
                padding: '6px 14px',
                borderRadius: '50px',
                border: '1.5px solid #E2E8F0',
                background: '#FFFFFF',
                fontSize: '13px',
                fontWeight: '700',
                color: '#1E293B',
                cursor: 'pointer',
                outline: 'none',
              }}
              aria-label="Choose Language"
            >
              <option value="en">🌐 English</option>
              <option value="te">🌐 తెలుగు (Telugu)</option>
              <option value="ta">🌐 தமிழ் (Tamil)</option>
              <option value="kn">🌐 ಕನ್ನಡ (Kannada)</option>
            </select>
          </div>
        </div>
      </header>

      {/* ─── MAIN HERO ONBOARDING SECTION ─── */}
      <main style={{ flex: 1, padding: '40px 20px 60px', maxWidth: '1180px', margin: '0 auto', width: '100%' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '48px',
          alignItems: 'center',
        }}>
          
          {/* Left Side: Value Props */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: 'rgba(59, 224, 109, 0.12)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '50px',
              fontSize: '13px',
              fontWeight: '700',
              color: '#15803D',
              marginBottom: '16px',
            }}>
              <ShieldCheck size={16} color="#059669" />
              <span>Trusted by 25,000+ South Indian businesses</span>
              <span style={{
                background: '#15803D',
                color: '#FFFFFF',
                padding: '2px 8px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '800',
                letterSpacing: '0.02em',
              }}>
                100% FREE REPORT
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: '900',
              lineHeight: 1.18,
              color: '#0B1020',
              letterSpacing: '-0.02em',
              marginBottom: '20px',
            }}>
              Grow your business from{' '}
              <span style={{ display: 'inline-block', letterSpacing: '0' }}>
                <span style={{ color: '#4285F4' }}>G</span>
                <span style={{ color: '#EA4335' }}>o</span>
                <span style={{ color: '#FBBC05' }}>o</span>
                <span style={{ color: '#4285F4' }}>g</span>
                <span style={{ color: '#34A853' }}>l</span>
                <span style={{ color: '#EA4335' }}>e</span>
              </span>{' '}
              with GrowLokal AI
            </h1>

            {/* 4 Benefit Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
              marginTop: '28px',
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(6px)',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
              }}>
                <span style={{ fontSize: '20px', lineHeight: 1 }}>🏆</span>
                <div>
                  <strong style={{ fontSize: '13.5px', color: '#0B1020', display: 'block' }}>Rank #1 on Google</strong>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>→ More calls &amp; walk-ins</span>
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(6px)',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
              }}>
                <span style={{ fontSize: '20px', lineHeight: 1 }}>⭐</span>
                <div>
                  <strong style={{ fontSize: '13.5px', color: '#0B1020', display: 'block' }}>More 5-star reviews</strong>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>→ Win customer trust</span>
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(6px)',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
              }}>
                <span style={{ fontSize: '20px', lineHeight: 1 }}>📸</span>
                <div>
                  <strong style={{ fontSize: '13.5px', color: '#0B1020', display: 'block' }}>Beat local competitors</strong>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>→ Customers pick you first</span>
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(6px)',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
              }}>
                <span style={{ fontSize: '20px', lineHeight: 1 }}>📈</span>
                <div>
                  <strong style={{ fontSize: '13.5px', color: '#0B1020', display: 'block' }}>Grow without an agency</strong>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>→ Save ₹40,000/mo &amp; time</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Grexa V8 Style 2-Step Card */}
          <div>
            <div style={{
              background: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              borderRadius: '20px',
              padding: '28px',
              boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <span style={{ height: '1px', flex: 1, background: '#E2E8F0' }} />
                <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#175fab' }}>
                  Get Your Free GBP Report
                </span>
                <span style={{ height: '1px', flex: 1, background: '#E2E8F0' }} />
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {/* Step 1: Find Business */}
                  <div style={{ position: 'relative' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', fontWeight: '700', color: '#1E293B', marginBottom: '6px' }}>
                      <span style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: '#175fab',
                        color: '#FFFFFF',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: '900',
                      }}>
                        1
                      </span>
                      <span>Find your business on Google</span>
                    </label>

                    <div style={{ position: 'relative' }}>
                      <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="text"
                        required
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setSelectedBusiness(null);
                          setShowDropdown(true);
                        }}
                        onFocus={() => setShowDropdown(true)}
                        placeholder="Start typing your business name..."
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 42px',
                          borderRadius: '10px',
                          border: '1.5px solid #CBD5E1',
                          fontSize: '14px',
                          color: '#0B1020',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <p style={{ fontSize: '11.5px', color: '#64748B', marginTop: '4px', marginLeft: '4px' }}>
                      Type the name, then pick your business from the list.
                    </p>

                    {/* Autocomplete Dropdown */}
                    {showDropdown && searchTerm.length > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        zIndex: 40,
                        background: '#FFFFFF',
                        border: '1.5px solid #E2E8F0',
                        borderRadius: '12px',
                        marginTop: '4px',
                        boxShadow: '0 12px 32px rgba(15, 23, 42, 0.12)',
                        maxHeight: '220px',
                        overflowY: 'auto',
                      }}>
                        {filtered.length > 0 ? (
                          filtered.map((item, idx) => (
                            <div
                              key={idx}
                              onClick={() => handleSelectBusiness(item.name, item.city)}
                              style={{
                                padding: '10px 14px',
                                cursor: 'pointer',
                                borderBottom: idx === filtered.length - 1 ? 'none' : '1px solid #F1F5F9',
                                fontSize: '13px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                              onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
                            >
                              <div>
                                <strong style={{ color: '#0B1020' }}>{item.name}</strong>
                                <div style={{ fontSize: '11.5px', color: '#64748B' }}>📍 {item.city}</div>
                              </div>
                              <span style={{ fontSize: '11px', background: 'rgba(23, 95, 171, 0.1)', color: '#175fab', padding: '2px 8px', borderRadius: '12px', fontWeight: '700' }}>
                                {item.category}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div
                            onClick={() => {
                              setSelectedBusiness(searchTerm);
                              setShowDropdown(false);
                            }}
                            style={{ padding: '12px 14px', fontSize: '13px', color: '#175fab', cursor: 'pointer', fontWeight: '600' }}
                          >
                            Use &ldquo;{searchTerm}&rdquo;
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Step 2: WhatsApp Number */}
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', fontWeight: '700', color: '#1E293B', marginBottom: '6px' }}>
                      <span style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: '#175fab',
                        color: '#FFFFFF',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: '900',
                      }}>
                        2
                      </span>
                      <span>Your WhatsApp number</span>
                    </label>

                    <div className="phone-input-group" style={{ height: '46px' }}>
                      <div className="phone-prefix">
                        <svg width="22" height="15" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: '2.5px', flexShrink: 0 }}>
                          <rect width="20" height="4.67" fill="#FF9933" />
                          <rect y="4.67" width="20" height="4.67" fill="#FFFFFF" />
                          <rect y="9.33" width="20" height="4.67" fill="#138808" />
                          <circle cx="10" cy="7" r="1.8" stroke="#000080" strokeWidth="0.6" fill="none" />
                        </svg>
                        <span className="phone-code">+91</span>
                        <span className="phone-divider" />
                      </div>
                      <input
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="81234 56789"
                        className="phone-input-field"
                      />
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: 'linear-gradient(135deg, #175fab 0%, #3be06d 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '15px',
                      fontWeight: '800',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      boxShadow: '0 2px 8px rgba(23, 95, 171, 0.2)',
                      transition: 'opacity 0.2s',
                      marginTop: '4px',
                    }}
                  >
                    {isSubmitting ? 'Generating Your Report...' : 'Get Free Google Report →'}
                  </button>
                </form>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 8px' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'rgba(59, 224, 109, 0.15)',
                    color: '#15803d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}>
                    <Check size={32} strokeWidth={3} />
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0B1020', marginBottom: '8px' }}>
                    Your Report is on its way!
                  </h3>
                  <p style={{ fontSize: '0.92rem', color: '#64748B', lineHeight: 1.5, marginBottom: '20px' }}>
                    We&apos;re sending your custom Google visibility audit report to WhatsApp <strong>+91 {phone}</strong>.
                  </p>
                  <Link
                    href="/tools/google-score-calculator"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 20px',
                      background: 'linear-gradient(135deg, #175fab 0%, #3be06d 100%)',
                      color: '#FFFFFF',
                      borderRadius: '10px',
                      fontWeight: '700',
                      textDecoration: 'none',
                      fontSize: '14px',
                      boxShadow: '0 2px 8px rgba(23, 95, 171, 0.2)',
                    }}
                  >
                    Spy On Competitors Now →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── BOTTOM STATS METRICS & INDUSTRIES ─── */}
        <div style={{ marginTop: '64px' }}>
          <section style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E2E8F0',
            padding: '28px',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
          }}>
            {/* 4 Stat Badges */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px',
              textAlign: 'center',
            }}>
              <div style={{ padding: '16px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#175fab' }}>25,000+</div>
                <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px' }}>South Indian businesses audited</div>
              </div>
              <div style={{ padding: '16px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#175fab' }}>30 sec</div>
                <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px' }}>Instant WhatsApp delivery</div>
              </div>
              <div style={{ padding: '16px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#175fab' }}>3.8x</div>
                <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px' }}>More customer calls in 90 days</div>
              </div>
              <div style={{ padding: '16px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#175fab' }}>100% Free</div>
                <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px' }}>No credit card or setup required</div>
              </div>
            </div>

            {/* Industry Chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '28px 0 18px' }}>
              <span style={{ height: '1px', flex: 1, background: '#E2E8F0' }} />
              <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#64748B' }}>
                Works for all South Indian Local Businesses
              </span>
              <span style={{ height: '1px', flex: 1, background: '#E2E8F0' }} />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
              {POPULAR_INDUSTRIES.map((ind, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '50px',
                    background: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    fontSize: '12.5px',
                    fontWeight: '600',
                    color: '#334155',
                  }}
                >
                  {ind}
                </span>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer style={{ borderTop: '1px solid #E2E8F0', padding: '20px', textAlign: 'center', fontSize: '13px', color: '#64748B', background: '#FFFFFF' }}>
        © {new Date().getFullYear()} GrowLokal Technologies. All rights reserved.
      </footer>
    </div>
  );
}
