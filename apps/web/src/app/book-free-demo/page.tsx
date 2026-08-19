'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { CheckCircle2, ArrowRight, Star, ShieldCheck, Sparkles, Building2, PhoneCall, Check, MessageSquare } from 'lucide-react';

const SUGGESTED_BUSINESSES = [
  { name: 'Apollo Clinic & Diagnostics', category: 'Health Clinic', city: 'Ameerpet, Hyderabad' },
  { name: 'Naturals Salon & Spa', category: 'Salon & Spa', city: 'T. Nagar, Chennai' },
  { name: 'Vistara Luxury Interiors', category: 'Interior Designer', city: 'Indiranagar, Bengaluru' },
  { name: 'Cult Fitness Club', category: 'Gym & Fitness', city: 'Madhapur, Hyderabad' },
  { name: 'Karachi Bakery & Cafe', category: 'Bakery', city: 'Banjara Hills, Hyderabad' },
  { name: 'Sri Krishna Sweets & Treats', category: 'Retail / Sweets', city: 'Mylapore, Chennai' },
  { name: 'QuickFix Home Solutions', category: 'Handyman Services', city: 'Kukatpally, Hyderabad' },
  { name: 'SunPower Rooftop Solar', category: 'Solar Solutions', city: 'Kakkanad, Kochi' },
  { name: 'Royal Care Dental Studio', category: 'Dental Clinic', city: 'RS Puram, Coimbatore' },
  { name: 'Urban Nest Properties', category: 'Real Estate', city: 'HSR Layout, Bengaluru' },
];

const CLIENT_LOGOS = [
  { name: 'Apollo Clinics', industry: 'Health Clinic', logo: '🏥' },
  { name: 'Naturals Salon', industry: 'Beauty & Wellness', logo: '💇' },
  { name: 'Cult.Fit Gyms', industry: 'Fitness & Sports', logo: '🏋️' },
  { name: 'Paradise Biryani', industry: 'Restaurant & Dining', logo: '🍛' },
  { name: 'Vistara Interiors', industry: 'Interior Design', logo: '🛋️' },
  { name: 'Karachi Bakery', industry: 'Bakery & Sweets', logo: '🎂' },
  { name: 'Dr. Mohan Diabetes', industry: 'Healthcare', logo: '🩺' },
  { name: 'FitPro Gym Studios', industry: 'Gyms', logo: '💪' },
  { name: 'GreenLeaf Ayurvedic', industry: 'Wellness Spa', logo: '🌿' },
  { name: 'Premier Solar Tech', industry: 'Renewable Energy', logo: '☀️' },
];

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 2C8.28 2 2 8.28 2 16C2 18.68 2.75 21.18 4.06 23.32L2 30L9.11 28.01C11.19 29.21 13.52 30 16 30C23.72 30 30 23.72 30 16C30 8.28 23.72 2 16 2Z"
        fill="#25D366"
      />
      <path
        d="M22.5 19.35C22.15 19.18 20.45 18.34 20.13 18.22C19.82 18.11 19.59 18.05 19.36 18.4C19.13 18.75 18.49 19.5 18.3 19.73C18.1 19.96 17.91 19.98 17.56 19.81C17.21 19.64 16.08 19.27 14.75 18.08C13.71 17.15 13.01 16.01 12.81 15.66C12.61 15.31 12.79 15.12 12.96 14.95C13.12 14.79 13.31 14.54 13.49 14.34C13.66 14.13 13.72 13.99 13.84 13.75C13.95 13.52 13.9 13.32 13.81 13.14C13.72 12.97 13.03 11.27 12.74 10.58C12.46 9.9 12.18 10 11.97 9.99H11.31C11.08 9.99 10.71 10.08 10.39 10.42C10.08 10.77 9.18 11.61 9.18 13.32C9.18 15.04 10.43 16.69 10.6 16.92C10.78 17.15 13.06 20.67 16.55 22.18C17.38 22.54 18.03 22.75 18.53 22.91C19.37 23.18 20.13 23.14 20.73 23.05C21.41 22.95 22.81 22.2 23.1 21.38C23.39 20.57 23.39 19.87 23.3 19.73C23.22 19.58 22.99 19.52 22.5 19.35Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export default function BookFreeDemoPage() {
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [budget, setBudget] = useState('₹3000 - ₹5000');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const filteredBusinesses = SUGGESTED_BUSINESSES.filter(
    (b) =>
      b.name.toLowerCase().includes(businessName.toLowerCase()) ||
      b.city.toLowerCase().includes(businessName.toLowerCase()) ||
      b.category.toLowerCase().includes(businessName.toLowerCase())
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!businessName || !phone) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Open WhatsApp demo confirmation
      const waText = encodeURIComponent(
        `Hi GrowLokal Team, I want to book a free live growth demo.\n\n` +
        `🏢 Business: ${businessName}\n` +
        `📱 Phone: +91 ${phone}\n` +
        `💰 Monthly Marketing Budget: ${budget}\n\n` +
        `Please schedule my free demo session!`
      );
      window.open(`https://api.whatsapp.com/send?phone=919876543210&text=${waText}`, '_blank');
    }, 700);
  }

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#111827' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '110px 24px 80px', maxWidth: '1180px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '56px', alignItems: 'center' }}>
          
          {/* ─── LEFT COLUMN: VALUE PROPOSITION ─── */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: 'rgba(23, 95, 171, 0.06)',
              border: '1px solid rgba(23, 95, 171, 0.25)',
              borderRadius: '50px',
              fontSize: '13px',
              fontWeight: '700',
              color: '#175fab',
              marginBottom: '20px',
            }}>
              <Sparkles size={16} color="#175fab" />
              <span>Trusted by 25,000+ South Indian business owners</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: '900',
              lineHeight: 1.15,
              color: '#0B1020',
              marginBottom: '20px',
              letterSpacing: '-0.03em',
            }}>
              What can <span style={{ background: 'linear-gradient(135deg, #175fab 0%, #3be06d 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>GrowLokal AI</span> do for your business?
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginTop: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <span style={{ fontSize: '24px', lineHeight: 1 }}>🚀</span>
                <div>
                  <strong style={{ fontSize: '1.05rem', color: '#111827', display: 'block' }}>Rank #1 on Google Maps</strong>
                  <span style={{ fontSize: '0.94rem', color: '#64748B' }}>Get 3x more local customer calls, direction requests, and walk-ins every week.</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <span style={{ fontSize: '24px', lineHeight: 1 }}>💬</span>
                <div>
                  <strong style={{ fontSize: '1.05rem', color: '#111827', display: 'block' }}>Never miss a lead on WhatsApp</strong>
                  <span style={{ fontSize: '0.94rem', color: '#64748B' }}>Autonomous AI agent answers customer inquiries 24/7 in Telugu, Tamil, Kannada &amp; English.</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <span style={{ fontSize: '24px', lineHeight: 1 }}>📈</span>
                <div>
                  <strong style={{ fontSize: '1.05rem', color: '#111827', display: 'block' }}>Close high-ticket sales faster</strong>
                  <span style={{ fontSize: '0.94rem', color: '#64748B' }}>Qualify ready buyers instantly and schedule appointments on autopilot.</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <span style={{ fontSize: '24px', lineHeight: 1 }}>🔁</span>
                <div>
                  <strong style={{ fontSize: '1.05rem', color: '#111827', display: 'block' }}>Bring customers back automatically</strong>
                  <span style={{ fontSize: '0.94rem', color: '#64748B' }}>Collect 5-star Google reviews and broadcast festive offers to existing customers.</span>
                </div>
              </div>
            </div>

            {/* Micro proof badges */}
            <div style={{ display: 'flex', gap: '24px', marginTop: '36px', paddingTop: '28px', borderTop: '1px solid #E2E8F0', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>
                <CheckCircle2 size={18} color="#25D366" />
                <span>100% Free Demo Session</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>
                <CheckCircle2 size={18} color="#25D366" />
                <span>No Credit Card Required</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>
                <CheckCircle2 size={18} color="#25D366" />
                <span>Custom Local SEO Plan</span>
              </div>
            </div>
          </div>

          {/* ─── RIGHT COLUMN: DISTRACTION-FREE FORM CARD ─── */}
          <div>
            <div style={{
              background: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              borderRadius: '24px',
              padding: '36px',
              boxShadow: '0 12px 36px rgba(15, 23, 42, 0.06)',
              position: 'relative',
            }}>
              {!isSubmitted ? (
                <>
                  <div style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0B1020', marginBottom: '6px' }}>
                      Ready to see it in action? Book a free demo!
                    </h2>
                    <p style={{ fontSize: '0.92rem', color: '#64748B' }}>
                      Fill in your business details below to schedule your personalized 1-on-1 walkthrough.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Field 1: Business Details */}
                    <div style={{ position: 'relative' }}>
                      <label style={{ display: 'block', fontSize: '13.5px', fontWeight: '700', color: '#1E293B', marginBottom: '8px' }}>
                        Business Details <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          required
                          value={businessName}
                          onChange={(e) => {
                            setBusinessName(e.target.value);
                            setShowSuggestions(true);
                          }}
                          onFocus={() => setShowSuggestions(true)}
                          placeholder="Start typing your business name..."
                          style={{
                            width: '100%',
                            padding: '13px 16px',
                            borderRadius: '10px',
                            border: '1.5px solid #CBD5E1',
                            fontSize: '14.5px',
                            color: '#111827',
                            outline: 'none',
                            transition: 'border-color 0.2s',
                          }}
                        />
                      </div>

                      {/* Autocomplete suggestions dropdown */}
                      {showSuggestions && businessName.length > 0 && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          zIndex: 50,
                          background: '#FFFFFF',
                          border: '1.5px solid #E2E8F0',
                          borderRadius: '12px',
                          marginTop: '6px',
                          boxShadow: '0 12px 32px rgba(15, 23, 42, 0.12)',
                          maxHeight: '220px',
                          overflowY: 'auto',
                        }}>
                          {filteredBusinesses.length > 0 ? (
                            filteredBusinesses.map((item, idx) => (
                              <div
                                key={idx}
                                onClick={() => {
                                  setBusinessName(`${item.name} (${item.city})`);
                                  setShowSuggestions(false);
                                }}
                                style={{
                                  padding: '10px 14px',
                                  cursor: 'pointer',
                                  borderBottom: idx === filteredBusinesses.length - 1 ? 'none' : '1px solid #F1F5F9',
                                  fontSize: '13.5px',
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
                                <span style={{ fontSize: '11px', background: '#EEF2FF', color: '#4F46E5', padding: '2px 8px', borderRadius: '12px', fontWeight: '700' }}>
                                  {item.category}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div
                              onClick={() => setShowSuggestions(false)}
                              style={{ padding: '12px 14px', fontSize: '13px', color: '#4F46E5', cursor: 'pointer', fontWeight: '600' }}
                            >
                              Use custom: &ldquo;{businessName}&rdquo;
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Field 2: Phone Number */}
                    <div>
                      <label style={{ display: 'block', fontSize: '13.5px', fontWeight: '700', color: '#1E293B', marginBottom: '8px' }}>
                        Phone Number <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <div className="phone-input-group" style={{ height: '48px' }}>
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

                    {/* Field 3: Monthly Budget Qualifier */}
                    <div>
                      <label style={{ display: 'block', fontSize: '13.5px', fontWeight: '700', color: '#1E293B', marginBottom: '4px' }}>
                        Monthly Budget <span style={{ fontSize: '12px', fontWeight: '500', color: '#64748B' }}>(Willing to spend on growth)</span>
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                        {[
                          { id: 'b1', label: 'More than ₹5,000 / month' },
                          { id: 'b2', label: '₹3,000 - ₹5,000 / month (Recommended)' },
                          { id: 'b3', label: 'Less than ₹3,000 / month' },
                        ].map((opt) => (
                          <label
                            key={opt.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '10px 14px',
                              borderRadius: '8px',
                              border: budget.startsWith(opt.label.split(' ')[0]) ? '1.5px solid #175fab' : '1px solid #E2E8F0',
                              background: budget.startsWith(opt.label.split(' ')[0]) ? 'rgba(23, 95, 171, 0.05)' : '#FFFFFF',
                              cursor: 'pointer',
                              fontSize: '13.5px',
                              fontWeight: budget.startsWith(opt.label.split(' ')[0]) ? '700' : '500',
                              color: budget.startsWith(opt.label.split(' ')[0]) ? '#175fab' : '#334155',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <input
                              type="radio"
                              name="budget"
                              checked={budget.startsWith(opt.label.split(' ')[0])}
                              onChange={() => setBudget(opt.label.split(' (')[0])}
                              style={{ accentColor: '#175fab' }}
                            />
                            <span>{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        width: '100%',
                        padding: '14px 20px',
                        background: 'linear-gradient(135deg, #175fab 0%, #3be06d 100%)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '15px',
                        fontWeight: '800',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 2px 8px rgba(23, 95, 171, 0.2)',
                        transition: 'opacity 0.2s',
                        marginTop: '4px',
                      }}
                    >
                      {isSubmitting ? 'Scheduling Your Demo...' : 'Book Free Demo Now →'}
                    </button>
                  </form>
                </>
              ) : (
                /* Success Card */
                <div style={{ textAlign: 'center', padding: '24px 10px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(37, 211, 102, 0.15)',
                    color: '#25D366',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}>
                    <Check size={36} strokeWidth={3} />
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0B1020', marginBottom: '8px' }}>
                    Demo Request Confirmed!
                  </h3>
                  <p style={{ fontSize: '0.94rem', color: '#64748B', lineHeight: 1.5, marginBottom: '24px' }}>
                    Our local growth specialist will connect with you on WhatsApp at <strong>+91 {phone}</strong> within 15 minutes.
                  </p>

                  <a
                    href={`https://api.whatsapp.com/send?phone=919876543210&text=${encodeURIComponent(`Hi GrowLokal, I just booked a demo for ${businessName}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 24px',
                      background: '#25D366',
                      color: '#FFFFFF',
                      borderRadius: '10px',
                      fontWeight: '800',
                      textDecoration: 'none',
                      fontSize: '14.5px',
                    }}
                  >
                    <WhatsAppIcon size={20} />
                    <span>Open WhatsApp Chat Now</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── BOTTOM SECTION: CLIENT LOGOS & TRUST MARQUEE ─── */}
        <div style={{ marginTop: '80px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '24px' }}>
            Trusted by Leading Local Businesses across Hyderabad, Bengaluru, Chennai, Kochi &amp; Vizag
          </p>

          <div style={{
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            {CLIENT_LOGOS.map((client, i) => (
              <div
                key={i}
                style={{
                  padding: '10px 18px',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  color: '#1E293B',
                }}
              >
                <span>{client.logo}</span>
                <span>{client.name}</span>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '500' }}>• {client.industry}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer style={{ borderTop: '1px solid #E2E8F0', padding: '24px', textAlign: 'center', fontSize: '13px', color: '#64748B', background: '#F8FAFC' }}>
        © {new Date().getFullYear()} GrowLokal Technologies. All rights reserved. • <Link href="/terms" style={{ color: '#64748B' }}>Terms</Link> • <Link href="/privacy" style={{ color: '#64748B' }}>Privacy</Link>
      </footer>
    </div>
  );
}
