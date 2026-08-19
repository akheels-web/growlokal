'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default function WhatsappKitPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const TEMPLATES = [
    {
      title: 'Group Broadcast Template for Local Business Associations',
      text: `🏢 *Local Business Digital Audit Checklist (2026)*\n\nIs your business losing local customer calls on Google Maps? Free 10-second check for business owners:\n\n✅ Check Google Maps Ranking\n✅ Audit Customer Review Replies\n✅ Vernacular WhatsApp Auto-Reply Setup\n\n👉 Get your free report instantly: https://growlokal.com`,
    },
    {
      title: 'Peer Recommendation Template for Business Owners',
      text: `Sir, I ran a free Google audit for our business using GrowLokal AI. It checked our Google Business listing score and customer review response rate in 10 seconds. Thought it might be helpful for your business too: https://growlokal.com`,
    },
  ];

  function copyTemplate(text: string, idx: number) {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2500);
  }

  return (
    <div className="page-wrapper" style={{ background: '#ffffff', color: '#111827', minHeight: '100vh' }}>
      {/* Unified Navigation */}
      <Navbar isSticky />

      {/* Main Content */}
      <main style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px 90px' }}>
        <Breadcrumbs
          items={[
            { label: 'Resources', href: '/#resources' },
            { label: 'WhatsApp Marketing Kit' },
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
            background: 'rgba(37, 211, 102, 0.12)',
            borderRadius: '20px',
            display: 'inline-block',
            marginBottom: '12px'
          }}>
            💬 WhatsApp Growth Distribution Kit
          </span>
          <h1 style={{ fontSize: '2.3rem', fontWeight: '800', marginTop: '6px', marginBottom: '16px', color: '#111827' }}>
            WhatsApp Growth &amp; Share Templates for Business Owners
          </h1>
          <p style={{ color: '#64748B', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto' }}>
            Share these pre-formatted growth checklists and templates with fellow business owners and merchant WhatsApp groups.
          </p>
        </div>

        {/* Templates */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {TEMPLATES.map((tmpl, idx) => (
            <div key={idx} style={{
              padding: '28px',
              background: 'var(--color-bg-card)',
              border: '1.5px solid var(--color-border)',
              borderRadius: '20px',
              boxShadow: '0 4px 16px rgba(3, 53, 64, 0.04)'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#111827', marginBottom: '14px' }}>
                {tmpl.title}
              </h2>
              <div style={{
                padding: '16px',
                background: '#F8FAFC',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontFamily: 'monospace',
                fontSize: '14px',
                whiteSpace: 'pre-wrap',
                color: '#334155',
                marginBottom: '16px',
                lineHeight: '1.6'
              }}>
                {tmpl.text}
              </div>
              <button
                onClick={() => copyTemplate(tmpl.text, idx)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 24px',
                  background: copiedIndex === idx ? '#F97316' : '#0B1020',
                  color: '#ffffff',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '800',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.2s ease'
                }}
              >
                {copiedIndex === idx ? '✅ Copied to Clipboard!' : '📋 Copy WhatsApp Message →'}
              </button>
            </div>
          ))}
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
