'use client';
// Phone-OTP login. Two steps: request code, then verify.
// In dev the code is printed in the API server logs.
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, setToken } from '@/lib/api';

export default function Login() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function requestOtp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      await api('/api/auth/request-otp', { method: 'POST', body: JSON.stringify({ phone }) });
      setStep('code');
    } catch { setErr('Could not send code. Check the number.'); }
    finally { setBusy(false); }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      const r = await api<{ token: string; businessId: string }>('/api/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phone, code, businessName }),
      });
      setToken(r.token);
      router.push(`/dashboard/${r.businessId}`);
    } catch { setErr('Invalid or expired code.'); }
    finally { setBusy(false); }
  }

  return (
    <main style={{ maxWidth: 420, margin: '0 auto', padding: '64px 20px' }}>
      <h1>Sign in</h1>
      {step === 'phone' ? (
        <form onSubmit={requestOtp} style={{ display: 'grid', gap: 12 }}>
          <input required placeholder="WhatsApp number (91XXXXXXXXXX)" value={phone}
            onChange={(e) => setPhone(e.target.value)} style={inp} />
          <input placeholder="Coaching center name (new users)" value={businessName}
            onChange={(e) => setBusinessName(e.target.value)} style={inp} />
          <button disabled={busy} style={btn}>{busy ? 'Sending…' : 'Send code'}</button>
        </form>
      ) : (
        <form onSubmit={verify} style={{ display: 'grid', gap: 12 }}>
          <p>Enter the 6-digit code sent to {phone}.</p>
          <input required placeholder="6-digit code" value={code} maxLength={6}
            onChange={(e) => setCode(e.target.value)} style={inp} />
          <button disabled={busy} style={btn}>{busy ? 'Verifying…' : 'Verify & sign in'}</button>
        </form>
      )}
      {err && <p style={{ color: '#c00' }}>{err}</p>}
    </main>
  );
}

const inp: React.CSSProperties = { padding: '12px 14px', fontSize: 16, border: '1px solid #ccc', borderRadius: 8 };
const btn: React.CSSProperties = { padding: '12px', fontSize: 16, fontWeight: 600, color: '#fff', background: '#1a7f37', border: 'none', borderRadius: 8, cursor: 'pointer' };
