'use client';
// Landing page with the free-audit lead magnet form.
// Mirrors the WhatsApp audit bot: enter name + phone -> get a score.
// This is a real, working form that calls POST /api/audit/run.
import { useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export default function Home() {
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ score: number; message: string } | null>(null);
  const [error, setError] = useState('');

  async function runAudit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(`${API}/api/audit/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName, phone, city: 'Hyderabad', lang: 'en' }),
      });
      if (!res.ok) throw new Error('Audit failed');
      const data = await res.json();
      setResult({ score: data.score, message: data.message });
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '48px 20px' }}>
      <h1 style={{ fontSize: 34, lineHeight: 1.2 }}>
        Is your coaching center losing admissions on Google? 🎓
      </h1>
      <p style={{ fontSize: 18, color: '#444' }}>
        Get a <strong>free instant report</strong> on how your center looks on Google —
        and exactly what’s costing you admission enquiries. In Telugu or English.
      </p>

      <form onSubmit={runAudit} style={{ display: 'grid', gap: 12, marginTop: 24 }}>
        <input
          required
          placeholder="Coaching center name + area (e.g. Bright Future, Ameerpet)"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          style={inputStyle}
        />
        <input
          required
          placeholder="Your WhatsApp number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={inputStyle}
        />
        <button type="submit" disabled={loading} style={btnStyle}>
          {loading ? 'Checking your Google presence…' : 'Get my free report'}
        </button>
      </form>

      {error && <p style={{ color: '#c00' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 28, padding: 20, background: '#f6f8fa', borderRadius: 12 }}>
          <div style={{ fontSize: 44, fontWeight: 700 }}>
            {result.score}
            <span style={{ fontSize: 20, color: '#666' }}>/100</span>
          </div>
          <p style={{ whiteSpace: 'pre-wrap', fontSize: 16 }}>{result.message}</p>
          <a
            href="https://wa.me/91XXXXXXXXXX?text=DEMO"
            style={{ ...btnStyle, display: 'inline-block', textDecoration: 'none', marginTop: 8 }}
          >
            Fix this for me — book a free call
          </a>
        </div>
      )}

      <p style={{ marginTop: 40, fontSize: 13, color: '#999' }}>
        TODO: replace 91XXXXXXXXXX with your WhatsApp number. Add pricing, testimonials,
        and the dashboard login. This page is a working starter.
      </p>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '12px 14px', fontSize: 16, border: '1px solid #ccc', borderRadius: 8,
};
const btnStyle: React.CSSProperties = {
  padding: '12px 18px', fontSize: 16, fontWeight: 600, color: '#fff',
  background: '#1a7f37', border: 'none', borderRadius: 8, cursor: 'pointer',
};
