'use client';
// Internal tool: generate a pay-first checkout link for a lead. Team-only
// (backend enforces role='admin' via requireAdmin — this page has no client-
// side check beyond that, since the API call itself will 403 for non-admins).
// No account is created until the lead actually pays — see routes/billing.ts.
import { useState } from 'react';
import { api } from '@/lib/api';

export default function CreateCheckoutLink() {
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [plan, setPlan] = useState<'starter' | 'growth'>('growth');
  const [razorpayPlanId, setRazorpayPlanId] = useState('');
  const [result, setResult] = useState<{ checkoutUrl: string; razorpaySubscriptionId: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [copied, setCopied] = useState(false);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(''); setResult(null); setCopied(false);
    try {
      const r = await api<{ checkoutUrl: string; razorpaySubscriptionId: string }>(
        '/api/admin/checkout-links',
        { method: 'POST', body: JSON.stringify({ phone, businessName, plan, razorpayPlanId }) }
      );
      setResult(r);
    } catch {
      setErr('Could not generate link. Check the fields (and that you have admin access).');
    } finally {
      setBusy(false);
    }
  }

  function copy() {
    if (!result) return;
    navigator.clipboard.writeText(result.checkoutUrl);
    setCopied(true);
  }

  return (
    <main style={{ maxWidth: 560, margin: '0 auto', padding: '40px 20px' }}>
      <h1>Create checkout link</h1>
      <p style={{ color: '#555' }}>
        For a lead you've already talked to. Nothing is created in our system until they actually pay —
        send them this link on WhatsApp yourself.
      </p>

      <form onSubmit={generate} style={{ display: 'grid', gap: 12 }}>
        <input required placeholder="Lead's WhatsApp number (91XXXXXXXXXX)" value={phone}
          onChange={(e) => setPhone(e.target.value)} style={inp} />
        <input required placeholder="Business name" value={businessName}
          onChange={(e) => setBusinessName(e.target.value)} style={inp} />
        <select value={plan} onChange={(e) => setPlan(e.target.value as typeof plan)} style={inp}>
          <option value="starter">Starter — ₹999/mo</option>
          <option value="growth">Growth — ₹2,499/mo</option>
        </select>
        <input required placeholder="Razorpay plan_id for this tier" value={razorpayPlanId}
          onChange={(e) => setRazorpayPlanId(e.target.value)} style={inp} />
        <small style={{ color: '#888' }}>Created once per tier in your Razorpay dashboard — reuse the same plan_id every time.</small>
        <button disabled={busy} style={btn}>{busy ? 'Generating…' : 'Generate checkout link'}</button>
      </form>

      {err && <p style={{ color: '#c00' }}>{err}</p>}

      {result && (
        <div style={{ marginTop: 24, padding: 16, background: '#f6f8fa', borderRadius: 12 }}>
          <p style={{ wordBreak: 'break-all', marginBottom: 12 }}>{result.checkoutUrl}</p>
          <button onClick={copy} style={btn}>{copied ? '✅ Copied' : 'Copy link'}</button>
        </div>
      )}
    </main>
  );
}

const inp: React.CSSProperties = { padding: '11px 13px', fontSize: 15, border: '1px solid #ccc', borderRadius: 8 };
const btn: React.CSSProperties = { padding: '12px 16px', fontSize: 15, fontWeight: 600, color: '#fff', background: '#1a7f37', border: 'none', borderRadius: 8, cursor: 'pointer' };
