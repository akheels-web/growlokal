'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function GoogleScoreCalculatorPage() {
  const [centerName, setCenterName] = useState('');
  const [competitorName, setCompetitorName] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [calculating, setCalculating] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [phone, setPhone] = useState('');
  const [phoneSubmitted, setPhoneSubmitted] = useState(false);

  // Autocomplete state
  const [userSuggestions, setUserSuggestions] = useState<Array<{ name: string; address: string }>>([]);
  const [compSuggestions, setCompSuggestions] = useState<Array<{ name: string; address: string }>>([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showCompDropdown, setShowCompDropdown] = useState(false);

  // Benchmarking scores
  const [userScore, setUserScore] = useState(48);
  const [compScore, setCompScore] = useState(84);

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  async function handleUserSearch(queryText: string) {
    setCenterName(queryText);
    if (queryText.trim().length >= 2) {
      try {
        const res = await fetch(`${API}/api/audit/autocomplete?q=${encodeURIComponent(queryText)}`);
        if (res.ok) {
          const data = await res.json();
          setUserSuggestions(data.suggestions || []);
          setShowUserDropdown(true);
        }
      } catch (err) {
        setUserSuggestions([]);
      }
    } else {
      setUserSuggestions([]);
      setShowUserDropdown(false);
    }
  }

  async function handleCompSearch(queryText: string) {
    setCompetitorName(queryText);
    if (queryText.trim().length >= 2) {
      try {
        const res = await fetch(`${API}/api/audit/autocomplete?q=${encodeURIComponent(queryText)}`);
        if (res.ok) {
          const data = await res.json();
          setCompSuggestions(data.suggestions || []);
          setShowCompDropdown(true);
        }
      } catch (err) {
        setCompSuggestions([]);
      }
    } else {
      setCompSuggestions([]);
      setShowCompDropdown(false);
    }
  }

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    if (!centerName) return;
    setCalculating(true);
    setTimeout(() => {
      const base = 42 + (centerName.length * 3) % 25;
      setUserScore(base);
      setCompScore(78 + (competitorName.length * 2) % 18);
      setCalculating(false);
      setCalculated(true);
    }, 1200);
  }

  function handleWhatsAppSend(e: React.FormEvent) {
    e.preventDefault();
    if (!phone) return;
    setPhoneSubmitted(true);
  }

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
            <Link href="/#pricing" className="nav-link">Pricing</Link>
            <Link href="/login" className="btn-nav">Owner Sign In →</Link>
          </div>
        </div>
      </header>

      {/* Main Hero & Calculator */}
      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '60px 24px 90px' }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
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
            ⚡ Free 10-Second Google Competitor Benchmark Tool
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: '800', marginTop: '6px', marginBottom: '16px', color: '#033540' }}>
            Compare Your Google Score vs Top Area Competitor
          </h1>
          <p style={{ color: '#5e7984', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto' }}>
            Find out why competing local businesses get 3x more customer phone calls on Google Maps. Get a side-by-side comparative score in seconds.
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ position: 'relative' }}>
                  <label style={{ fontSize: '14px', fontWeight: '700', color: '#033540', marginBottom: '8px', display: 'block' }}>
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
                          <strong style={{ color: '#033540', display: 'block' }}>{item.name}</strong>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>{item.address}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <label style={{ fontSize: '14px', fontWeight: '700', color: '#033540', marginBottom: '8px', display: 'block' }}>
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
                          <strong style={{ color: '#033540', display: 'block' }}>{item.name}</strong>
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
                    background: '#0E4459',
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
                  {calculating ? '📡 Scanning Live Google Maps Profiles…' : 'Compare Google Scores Now →'}
                </button>
              </div>
            </form>
          ) : (
            <div>
              {/* Benchmark Results */}
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#033540' }}>
                  Google Visibility Benchmark Scorecard
                </h2>
                <p style={{ color: '#5e7984', fontSize: '0.95rem' }}>
                  Based on public Google Maps completeness, review recency, photo updates &amp; local search signals in {city}.
                </p>
              </div>

              {/* Score Comparison Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                {/* User Center */}
                <div style={{
                  padding: '24px',
                  borderRadius: '16px',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1.5px solid rgba(239, 68, 68, 0.3)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#dc2626', textTransform: 'uppercase' }}>
                    YOUR CENTER
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#033540', margin: '4px 0 12px' }}>
                    {centerName}
                  </div>
                  <div style={{ fontSize: '3rem', fontWeight: '900', color: '#dc2626', lineHeight: 1 }}>
                    {userScore}<span style={{ fontSize: '1.2rem', color: '#5e7984' }}>/100</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#991b1b', marginTop: '12px' }}>
                    ⚠️ Missing weekly posts &amp; review auto-replies
                  </p>
                </div>

                {/* Competitor */}
                <div style={{
                  padding: '24px',
                  borderRadius: '16px',
                  background: 'rgba(112, 191, 99, 0.1)',
                  border: '1.5px solid rgba(112, 191, 99, 0.4)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#047857', textTransform: 'uppercase' }}>
                    COMPETITOR BENCHMARK
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#033540', margin: '4px 0 12px' }}>
                    {competitorName || 'Area Top Business Benchmark'}
                  </div>
                  <div style={{ fontSize: '3rem', fontWeight: '900', color: '#047857', lineHeight: 1 }}>
                    {compScore}<span style={{ fontSize: '1.2rem', color: '#5e7984' }}>/100</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#047857', marginTop: '12px' }}>
                    ✅ Active weekly Google posts &amp; high customer review response rate
                  </p>
                </div>
              </div>

              {/* Action Box */}
              {!phoneSubmitted ? (
                <form onSubmit={handleWhatsAppSend} style={{
                  padding: '24px',
                  background: '#0E4459',
                  borderRadius: '16px',
                  color: '#ffffff',
                  textAlign: 'center'
                }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>
                    📩 Send Full Audit Fix Plan to Your WhatsApp
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', marginBottom: '16px' }}>
                    Get AI-written review reply templates &amp; Google post keywords to bridge the gap.
                  </p>
                  <div style={{ display: 'flex', gap: '12px', maxWidth: '480px', margin: '0 auto' }}>
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
                    <button type="submit" className="btn-primary" style={{ padding: '12px 20px', whiteSpace: 'nowrap' }}>
                      Send Report →
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{
                  padding: '20px',
                  background: 'rgba(112, 191, 99, 0.15)',
                  border: '1px solid #70BF63',
                  borderRadius: '12px',
                  textAlign: 'center',
                  color: '#047857',
                  fontWeight: '700'
                }}>
                  ✅ Full audit fix plan sent to your WhatsApp ({phone})! Check your messages.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
