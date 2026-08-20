'use client';
// Public self-serve checkout (added 2026-08-18 — see docs/DECISIONS.md).
// No login, no team member generating a link first — pay, then get access.
// Reuses the exact same account-provisioning safety (nothing is created
// until the Razorpay webhook confirms payment) as the admin-assisted path.
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';

const PLAN_LABEL: Record<string, string> = {
  starter: 'Starter — ₹999/month',
  growth: 'Growth — ₹2,499/month',
};

// useSearchParams() needs a Suspense boundary in the App Router, or the page
// fails static generation.
export default function Checkout() {
  return (
    <Suspense>
      <CheckoutForm />
    </Suspense>
  );
}

function CheckoutForm() {
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get('plan') === 'growth' ? 'growth' : 'starter';

  const [plan, setPlan] = useState<'starter' | 'growth'>(initialPlan);
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErr('Please enter a valid 10-digit mobile number.');
      return;
    }
    setBusy(true); setErr('');
    try {
      const r = await api<{ checkoutUrl: string }>('/api/checkout', {
        method: 'POST',
        body: JSON.stringify({ phone: `91${cleanPhone}`, businessName, plan }),
      });
      window.location.href = r.checkoutUrl;
    } catch (err: any) {
      setErr(err.message?.includes('429') ? 'Too many attempts. Please wait a minute.' : 'Could not start checkout. Please check your details.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ maxWidth: 480, margin: '0 auto', padding: '48px 20px' }}>
      <h1>Subscribe to GrowLokal</h1>
      <p style={{ color: '#555' }}>Pay now, get your dashboard access the moment payment completes — no waiting on a callback.</p>

      <form onSubmit={pay} style={{ display: 'grid', gap: 14, marginTop: 24 }}>
        <label>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Plan</div>
          <select value={plan} onChange={(e) => setPlan(e.target.value as 'starter' | 'growth')} style={inp}>
            <option value="starter">{PLAN_LABEL.starter}</option>
            <option value="growth">{PLAN_LABEL.growth}</option>
          </select>
        </label>
        <label>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Business Name</div>
          <input required value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. Naturals Salon" style={inp} />
        </label>
        <label>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>WhatsApp Number</div>
          <input required type="tel" maxLength={10} pattern="[0-9]{10}" value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} placeholder="81234 56789" style={inp} />
        </label>

        {err && <p style={{ color: '#c00', margin: 0 }}>{err}</p>}

        <button disabled={busy} style={btn}>{busy ? 'Starting checkout…' : `Pay & Subscribe →`}</button>
      </form>
    </main>
  );
}

const inp: React.CSSProperties = { width: '100%', padding: '11px 13px', fontSize: 15, border: '1px solid #ccc', borderRadius: 8 };
const btn: React.CSSProperties = { padding: '13px 16px', fontSize: 15, fontWeight: 700, color: '#fff', background: '#1a7f37', border: 'none', borderRadius: 8, cursor: 'pointer' };
