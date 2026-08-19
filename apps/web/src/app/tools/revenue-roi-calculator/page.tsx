'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default function RevenueRoiCalculatorPage() {
  const [serviceValue, setServiceValue] = useState(2500);
  const [extraCustomers, setExtraCustomers] = useState(10);

  const monthlyExtraRevenue = serviceValue * extraCustomers;
  const yearlyExtraRevenue = monthlyExtraRevenue * 12;
  const growLokalCostYearly = 2499 * 12; // Growth plan — the recommended tier
  const netProfitYearly = yearlyExtraRevenue - growLokalCostYearly;
  const roiPercentage = Math.round((netProfitYearly / growLokalCostYearly) * 100);

  return (
    <div className="page-wrapper" style={{ background: '#ffffff', color: '#111827', minHeight: '100vh' }}>
      {/* Unified Navigation */}
      <Navbar isSticky />

      {/* Hero */}
      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px 90px' }}>
        <Breadcrumbs
          items={[
            { label: 'Growth Tools', href: '/#tools' },
            { label: 'Revenue ROI Calculator' },
          ]}
        />
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <span style={{
            fontSize: '12px',
            fontWeight: '700',
            color: '#F97316',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '4px 12px',
            background: 'rgba(249, 115, 22, 0.15)',
            borderRadius: '20px',
            display: 'inline-block',
            marginBottom: '12px'
          }}>
            💰 Local Business Revenue Growth Calculator
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: '800', marginTop: '6px', marginBottom: '16px', color: '#111827' }}>
            Calculate Your Yearly Revenue Growth
          </h1>
          <p style={{ color: '#64748B', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto' }}>
            See how capturing just 5 to 15 additional local customers per month through GrowLokal AI translates into massive annual profit.
          </p>
        </div>

        {/* Calculator Widget */}
        <div className="roi-calculator-grid" style={{
          background: '#ffffff',
          border: '1.5px solid #e2e8f0',
          borderRadius: '24px',
          padding: '36px',
          boxShadow: '0 12px 36px rgba(3, 53, 64, 0.06)'
        }}>
          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
                <label style={{ fontSize: '14.5px', fontWeight: '700', color: '#111827', lineHeight: '1.4' }}>
                  Average Order / Service Value (₹)
                </label>
                <span style={{ fontSize: '16px', fontWeight: '800', color: '#4F46E5', whiteSpace: 'nowrap', flexShrink: 0 }}>
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
                style={{ width: '100%', accentColor: '#4F46E5' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                <span>₹500</span>
                <span>₹50,000</span>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
                <label style={{ fontSize: '14.5px', fontWeight: '700', color: '#111827', lineHeight: '1.4' }}>
                  New Local Customers Acquired / Month
                </label>
                <span style={{ fontSize: '16px', fontWeight: '800', color: '#F97316', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  +{extraCustomers} Customers
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={extraCustomers}
                onChange={(e) => setExtraCustomers(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#F97316' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                <span>+1 Customer</span>
                <span>+30 Customers</span>
              </div>
            </div>

            <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '12px', fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>
              💡 <strong>How it works:</strong> GrowLokal AI ranks your Google Business Profile for "near me" searches and answers customer WhatsApp enquiries 24/7.
            </div>
          </div>

          {/* Result Card */}
          <div style={{
            background: '#0B1020',
            borderRadius: '20px',
            padding: '28px',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                PROJECTED YEARLY NET PROFIT
              </div>
              <div style={{ fontSize: '2.8rem', fontWeight: '900', color: '#F97316', margin: '8px 0 16px', lineHeight: 1 }}>
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
                  <strong style={{ color: '#3be06d' }}>{roiPercentage.toLocaleString('en-IN')}%</strong>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <Link
                href="/free-gbp-report"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  padding: '16px 24px',
                  background: 'linear-gradient(135deg, #175fab 0%, #3be06d 100%)',
                  color: '#ffffff',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '800',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(23, 95, 171, 0.2)',
                  transition: 'all 0.2s ease'
                }}
              >
                Get Free GBP Report &amp; Claim Growth →
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
