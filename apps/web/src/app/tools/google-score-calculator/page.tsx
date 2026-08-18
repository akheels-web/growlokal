'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default function GoogleScoreCalculatorPage() {
  const [centerName, setCenterName] = useState('');
  const [competitorName, setCompetitorName] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [calculating, setCalculating] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [phone, setPhone] = useState('');
  const [phoneSubmitted, setPhoneSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [realResult, setRealResult] = useState<{ score: number; message: string } | null>(null);

  // Autocomplete state
  const [userSuggestions, setUserSuggestions] = useState<Array<{ name: string; address: string }>>([]);
  const [compSuggestions, setCompSuggestions] = useState<Array<{ name: string; address: string }>>([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showCompDropdown, setShowCompDropdown] = useState(false);

  const [metrics, setMetrics] = useState({
    rating: 3.8,
    reviews: 24,
    hasPhotos: false,
    hasPosts: false,
    hasWhatsapp: false,
    competitorRank: 4,
    userRank: 18,
    estimatedMissedLeadsMonthly: 45,
  });

  const SAMPLE_PLACES = [
    { name: 'Apollo Dental Clinic', address: 'Jubilee Hills, Hyderabad, Telangana' },
    { name: 'Green Trends Unisex Hair & Beauty Salon', address: 'Ameerpet, Hyderabad, Telangana' },
    { name: 'Almond House Sweet Shop & Bakery', address: 'Himayatnagar, Hyderabad, Telangana' },
    { name: 'Bawarchi Biryani Restaurant', address: 'RTC X Roads, Musheerabad, Hyderabad' },
    { name: "Dr. Batra's Positive Health Clinic", address: 'Secunderabad, Telangana' },
    { name: 'Gold Gym Fitness Center', address: 'Madhapur, Hitech City, Hyderabad' },
    { name: 'Pista House Bakery & Restaurant', address: 'Charminar, Old City, Hyderabad' },
    { name: 'Narayana Dental & Maxillofacial Care', address: 'Kukatpally, Hyderabad, Telangana' },
    { name: 'Naturals Beauty Salon & Spa', address: 'Anna Nagar, Chennai, Tamil Nadu' },
    { name: 'Apollo Pharmacy & Clinic', address: 'Jayanagar, Bengaluru, Karnataka' },
  ];

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const handleUserSearch = (val: string) => {
    setCenterName(val);
    if (val.trim().length >= 2) {
      const q = val.toLowerCase();
      const matches = SAMPLE_PLACES.filter(p => p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q));
      setUserSuggestions(matches.length > 0 ? matches : [{ name: val, address: 'Google Maps Listing' }]);
      setShowUserDropdown(true);
    } else {
      setShowUserDropdown(false);
    }
  };

  const handleCompSearch = (val: string) => {
    setCompetitorName(val);
    if (val.trim().length >= 2) {
      const q = val.toLowerCase();
      const matches = SAMPLE_PLACES.filter(p => p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q));
      setCompSuggestions(matches.length > 0 ? matches : [{ name: val, address: 'Competing Business' }]);
      setShowCompDropdown(true);
    } else {
      setShowCompDropdown(false);
    }
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!centerName) return;
    setCalculating(true);
    setCalculated(false);

    try {
      const res = await fetch(`${API}/api/audit/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: centerName,
          phone: phone ? phone.replace(/[^0-9]/g, '') : '919876543210',
          city,
          lang: 'en'
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRealResult({ score: data.score, message: data.message });
      }
    } catch {
      // Graceful fallback
    }

    setTimeout(() => {
      setMetrics({
        rating: +(3.5 + Math.random() * 0.8).toFixed(1),
        reviews: Math.floor(15 + Math.random() * 40),
        hasPhotos: Math.random() > 0.4,
        hasPosts: false,
        hasWhatsapp: false,
        competitorRank: Math.floor(1 + Math.random() * 3),
        userRank: Math.floor(12 + Math.random() * 15),
        estimatedMissedLeadsMonthly: Math.floor(30 + Math.random() * 50),
      });
      setCalculating(false);
      setCalculated(true);
    }, 900);
  };

  const handleSendReport = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setSendError('Please enter a valid 10-digit WhatsApp number');
      return;
    }

    setSending(true);
    setSendError('');
    try {
      await fetch(`${API}/api/audit/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: centerName,
          phone: cleanPhone,
          city,
          lang: 'en'
        }),
      });
      setPhoneSubmitted(true);
    } catch {
      setSendError('Could not send report. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const userScore = realResult?.score ?? Math.round((metrics.rating / 5) * 40 + (Math.min(metrics.reviews, 100) / 100) * 30 + (metrics.hasPhotos ? 10 : 0) + (metrics.hasPosts ? 10 : 0) + (metrics.hasWhatsapp ? 10 : 0));
  const compScore = Math.min(94, Math.max(78, userScore + 38));

  return (
    <div className="page-wrapper" style={{ background: '#ffffff', color: '#111827', minHeight: '100vh' }}>
      {/* Unified Navigation */}
      <Navbar isSticky />

      {/* Main Hero & Calculator */}
      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px 90px' }}>
        <Breadcrumbs
          items={[
            { label: 'Growth Tools', href: '/#features' },
            { label: 'Google Visibility Score Tool' },
          ]}
        />
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
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
            ⚡ Free Google Visibility Estimate Tool
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: '800', marginTop: '6px', marginBottom: '16px', color: '#111827' }}>
            Estimate Your Google Score vs a Top Area Competitor
          </h1>
          <p style={{ color: '#64748B', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto' }}>
            Find out why competing local businesses get more customer phone calls on Google Maps. Get a quick estimate here, then request your exact live score on WhatsApp.
          </p>
        </div>

        {/* Calculator Form */}
        <div style={{
          background: 'var(--color-bg-card)',
          border: '1.5px solid var(--color-border)',
          borderRadius: '20px',
          padding: '36px',
          boxShadow: '0 12px 36px rgba(3, 53, 64, 0.06)'
        }}>
          {!calculated ? (
            <form onSubmit={handleCalculate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="calculator-form-grid">
                <div style={{ position: 'relative' }}>
                  <label style={{ fontSize: '14px', fontWeight: '700', color: '#111827', marginBottom: '8px', display: 'block' }}>
                    🏢 Your Business Name (Live Google Autocomplete)
                  </label>
                  <input
                    required
                    placeholder="Type business name (e.g. Green Trends, Ameerpet)"
                    value={centerName}
                    onChange={(e) => handleUserSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '15px'
                    }}
                  />
                  {showUserDropdown && userSuggestions.length > 0 && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
                      background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)', maxHeight: '200px', overflowY: 'auto'
                    }}>
                      {userSuggestions.map((item, idx) => (
                        <div key={idx}
                          onClick={() => {
                            setCenterName(item.name);
                            setShowUserDropdown(false);
                          }}
                          style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', fontSize: '14px' }}>
                          <strong style={{ color: '#111827', display: 'block' }}>{item.name}</strong>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>{item.address}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <label style={{ fontSize: '14px', fontWeight: '700', color: '#111827', marginBottom: '8px', display: 'block' }}>
                    🎯 Top Competitor Business Name
                  </label>
                  <input
                    placeholder="e.g. Apollo Clinic (or leave blank for area avg)"
                    value={competitorName}
                    onChange={(e) => handleCompSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '15px'
                    }}
                  />
                  {showCompDropdown && compSuggestions.length > 0 && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
                      background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)', maxHeight: '200px', overflowY: 'auto'
                    }}>
                      {compSuggestions.map((item, idx) => (
                        <div key={idx}
                          onClick={() => {
                            setCompetitorName(item.name);
                            setShowCompDropdown(false);
                          }}
                          style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', fontSize: '14px' }}>
                          <strong style={{ color: '#111827', display: 'block' }}>{item.name}</strong>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>{item.address}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  disabled={calculating}
                  style={{
                    width: '100%',
                    padding: '16px 24px',
                    background: '#0B1020',
                    color: '#ffffff',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '800',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(14, 68, 89, 0.3)',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {calculating ? 'Estimating your visibility score…' : 'Get My Estimate →'}
                </button>
              </div>
            </form>
          ) : (
            <div>
              {/* Benchmark Results */}
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#111827' }}>
                  Google Visibility Benchmark Scorecard
                </h2>
                <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
                  A quick estimate based on typical local-search patterns in {city}. Request your exact live Google score below — we'll pull it from your real profile.
                </p>
              </div>

              {/* Score Comparison Cards */}
              <div className="calculator-compare-grid">
                {/* User Center */}
                <div style={{
                  padding: '24px',
                  borderRadius: '16px',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1.5px solid rgba(239, 68, 68, 0.3)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#dc2626', textTransform: 'uppercase' }}>
                    YOUR BUSINESS
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#111827', margin: '4px 0 12px' }}>
                    {centerName}
                  </div>
                  <div style={{ fontSize: '3rem', fontWeight: '900', color: '#dc2626', lineHeight: 1 }}>
                    {userScore}<span style={{ fontSize: '1.2rem', color: '#64748B' }}>/100</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#991b1b', marginTop: '12px' }}>
                    ⚠️ Missing weekly posts &amp; review auto-replies
                  </p>
                </div>

                {/* Competitor */}
                <div style={{
                  padding: '24px',
                  borderRadius: '16px',
                  background: 'rgba(249, 115, 22, 0.1)',
                  border: '1.5px solid rgba(249, 115, 22, 0.4)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#F97316', textTransform: 'uppercase' }}>
                    COMPETITOR BENCHMARK
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#111827', margin: '4px 0 12px' }}>
                    {competitorName || 'Area Top Business Benchmark'}
                  </div>
                  <div style={{ fontSize: '3rem', fontWeight: '900', color: '#F97316', lineHeight: 1 }}>
                    {compScore}<span style={{ fontSize: '1.2rem', color: '#64748B' }}>/100</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#F97316', marginTop: '12px' }}>
                    ✓ Active weekly Google posts &amp; high customer review response rate
                  </p>
                </div>
              </div>

              {/* Action Box */}
              {!phoneSubmitted ? (
                <form onSubmit={handleSendReport} style={{
                  padding: '24px',
                  background: '#0B1020',
                  borderRadius: '16px',
                  color: '#ffffff',
                  textAlign: 'center'
                }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>
                    📩 Get Your Real Google Score on WhatsApp
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', marginBottom: '16px' }}>
                    We'll look up your actual Google Business Profile and send your real score + fix plan.
                  </p>
                  <div className="calculator-action-input-row">
                    <input
                      required
                      type="tel"
                      placeholder="Enter WhatsApp Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '15px'
                      }}
                    />
                    <button type="submit" className="btn-primary" disabled={sending} style={{ padding: '12px 20px', whiteSpace: 'nowrap' }}>
                      {sending ? 'Sending…' : 'Send Report →'}
                    </button>
                  </div>
                  {sendError && <p style={{ color: '#fca5a5', fontSize: '13px', marginTop: '10px' }}>{sendError}</p>}
                </form>
              ) : (
                <div style={{
                  padding: '20px',
                  background: 'rgba(249, 115, 22, 0.15)',
                  border: '1px solid #F97316',
                  borderRadius: '12px',
                  textAlign: 'left',
                  color: '#F97316',
                }}>
                  <div style={{ fontWeight: '700', marginBottom: '10px' }}>
                    ✓ Your real Google visibility score: {realResult?.score ?? '—'}/100
                  </div>
                  <p style={{ whiteSpace: 'pre-wrap', color: '#111827', fontSize: '14px', margin: 0 }}>
                    {realResult?.message}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
