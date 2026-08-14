'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RevenueRoiCalculatorPage() {
  const [serviceValue, setServiceValue] = useState(2500);
  const [extraCustomers, setExtraCustomers] = useState(10);

  const monthlyExtraRevenue = serviceValue * extraCustomers;
  const yearlyExtraRevenue = monthlyExtraRevenue * 12;
  const growLokalCostYearly = 2999 * 12;
  const netProfitYearly = yearlyExtraRevenue - growLokalCostYearly;
  const roiPercentage = Math.round((netProfitYearly / growLokalCostYearly) * 100);

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

      {/* Hero */}
      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '60px 24px 90px' }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <span style={{
            fontSize: '12px',
            fontWeight: '700',
            color: '#70BF63',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '4px 12px',
            background: 'rgba(112, 191, 99, 0.15)',
            borderRadius: '20px',
            display: 'inline-block',
            marginBottom: '12px'
          }}>
            💰 Local Business Revenue Growth Calculator
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: '800', marginTop: '6px', marginBottom: '16px', color: '#033540' }}>
            Calculate Your Yearly Revenue Growth
          </h1>
          <p style={{ color: '#5e7984', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto' }}>
            See how capturing just 5 to 15 additional local customers per month through GrowLokal AI translates into massive annual profit.
          </p>
        </div>

        {/* Calculator Widget */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '32px',
          background: 'var(--color-bg-card)',
          border: '1.5px solid var(--color-border)',
          borderRadius: '24px',
          padding: '36px',
          boxShadow: '0 12px 36px rgba(3, 53, 64, 0.06)'
        }}>
          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '700', color: '#033540' }}>
                  Average Customer Service / Order Value (₹)
                </label>
                <span style={{ fontSize: '16px', fontWeight: '800', color: '#2E9AA6' }}>
                  ₹{serviceValue.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={serviceValue}
                onChange={(e) => setServiceValue(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#2E9AA6' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                <span>₹500</span>
                <span>₹50,000</span>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '700', color: '#033540' }}>
                  Additional New Local Customers per Month
                </label>
                <span style={{ fontSize: '16px', fontWeight: '800', color: '#70BF63' }}>
                  +{extraCustomers} Customers / Mo
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={extraCustomers}
                onChange={(e) => setExtraCustomers(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#70BF63' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                <span>+1 Customer</span>
                <span>+30 Customers</span>
              </div>
            </div>

            <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '12px', fontSize: '13px', color: '#475569' }}>
              💡 <strong>How it works:</strong> GrowLokal AI ranks your Google Business Profile for "near me" searches and answers customer WhatsApp enquiries 24/7.
            </div>
          </div>

          {/* Result Card */}
          <div style={{
            background: '#0E4459',
            borderRadius: '20px',
            padding: '28px',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#2E9AA6', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                PROJECTED YEARLY NET PROFIT
              </div>
              <div style={{ fontSize: '2.8rem', fontWeight: '900', color: '#70BF63', margin: '8px 0 16px', lineHeight: 1 }}>
                +₹{netProfitYearly.toLocaleString('en-IN')}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: 'rgba(255,255,255,0.85)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Gross Annual Revenue:</span>
                  <strong style={{ color: '#ffffff' }}>₹{yearlyExtraRevenue.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>GrowLokal Growth Plan Cost:</span>
                  <span style={{ color: '#cbd5e1' }}>₹{growLokalCostYearly.toLocaleString('en-IN')}/yr</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                  <span>Estimated ROI:</span>
                  <strong style={{ color: '#70BF63' }}>{roiPercentage.toLocaleString('en-IN')}%</strong>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <Link
                href="/#audit-form"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  padding: '16px 24px',
                  background: '#70BF63',
                  color: '#033540',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '800',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(112, 191, 99, 0.35)',
                  transition: 'all 0.2s ease'
                }}
              >
                Start Free Audit &amp; Claim Growth →
              </Link>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', marginTop: '14px', textAlign: 'center', lineHeight: '1.4' }}>
                *Note: Estimated figures based on South Indian local business benchmarks. Actual growth varies by business category &amp; service capacity.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
