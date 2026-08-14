'use client';

// Premium Phone-OTP login page matching the new GrowLokal design system
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, setToken } from '@/lib/api';

export default function Login() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const [cooldown, setCooldown] = useState(0);

  // Cooldown countdown timer for OTP requests
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function requestOtp(e: React.FormEvent) {
    e.preventDefault();
    if (cooldown > 0) return;
    // Sanitize phone number to digits only
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErr('Please enter a valid 10-digit mobile number.');
      return;
    }

    setBusy(true); setErr('');
    try {
      await api('/api/auth/request-otp', { method: 'POST', body: JSON.stringify({ phone: cleanPhone }) });
      setStep('code');
      setCooldown(60); // Start 60s cooldown timer to prevent OTP spamming
    } catch (err: any) { 
      setErr(err.message?.includes('429') ? 'Too many OTP requests. Please wait a minute.' : 'Could not send code. Please check the number.'); 
    } finally { 
      setBusy(false); 
    }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const cleanCode = code.replace(/[^0-9]/g, '');
    if (cleanCode.length !== 6) {
      setErr('Verification code must be 6 digits.');
      return;
    }

    setBusy(true); setErr('');
    try {
      const r = await api<{ token: string; businessId: string }>('/api/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phone: cleanPhone, code: cleanCode, businessName: businessName.trim() }),
      });
      setToken(r.token);
      router.push(`/dashboard/${r.businessId}`);
    } catch (err: any) { 
      setErr(err.message?.includes('429') ? 'Too many attempts. Please wait a minute.' : 'Invalid or expired 6-digit code.'); 
    } finally { 
      setBusy(false); 
    }
  }

  return (
    <div className="login-page">
      <div className="login-bg-overlay" />

      <div className="login-container">
        {/* Left Side: Brand Showcase */}
        <div className="login-hero-side">
          <Link href="/" className="nav-brand" style={{ color: '#ffffff', fontSize: '1.75rem', display: 'inline-block', marginBottom: '24px' }}>
            Grow<span style={{ color: '#70BF63' }}>Lokal</span>
          </Link>

          <div className="login-hero-badge">
            ✨ AI-Powered Marketing Platform
          </div>

          <h1 className="login-hero-title">
            Grow your local business on Google &amp; WhatsApp
          </h1>

          <p className="login-hero-desc">
            Access your ROI dashboard, manage automated Google Business posts, review replies, and broadcast WhatsApp campaigns.
          </p>

          <ul className="login-features-list">
            <li className="login-feature-item">
              <span className="login-feature-icon">✓</span>
              <span><strong>Google Business Agent</strong> — Weekly post automation &amp; review replies</span>
            </li>
            <li className="login-feature-item">
              <span className="login-feature-icon">✓</span>
              <span><strong>WhatsApp Campaigns</strong> — Direct customer outreach in Telugu &amp; English</span>
            </li>
            <li className="login-feature-item">
              <span className="login-feature-icon">✓</span>
              <span><strong>Real-time Analytics</strong> — Track enquiry growth &amp; conversion score</span>
            </li>
          </ul>
        </div>

        {/* Right Side: Unique Login Card */}
        <div className="login-card">
          <div className="login-card-header">
            <h2 className="login-card-title">
              {step === 'phone' ? 'Welcome Back' : 'Enter Verification Code'}
            </h2>
            <p className="login-card-subtitle">
              {step === 'phone'
                ? 'Sign in or create your account using your WhatsApp number'
                : `We sent a 6-digit verification code to ${phone}`}
            </p>
          </div>

          {step === 'phone' ? (
            <form onSubmit={requestOtp} className="login-form">
              <div className="login-input-group">
                <label className="login-input-label">WhatsApp Number</label>
                <input
                  required
                  placeholder="e.g. 919876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="login-input"
                  type="tel"
                />
              </div>

              <div className="login-input-group">
                <label className="login-input-label">Business Name <span style={{ fontWeight: 400, color: '#64748b' }}>(New users only)</span></label>
                <input
                  placeholder="e.g. Green Trends Salon"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="login-input"
                />
              </div>

              {err && <p className="form-error">{err}</p>}

              <button disabled={busy || cooldown > 0} className="login-btn" type="submit">
                {busy ? (
                  <><span className="spinner" />Sending Code…</>
                ) : cooldown > 0 ? (
                  `Resend Code in ${cooldown}s`
                ) : (
                  'Continue with WhatsApp →'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={verify} className="login-form">
              <div className="login-input-group">
                <label className="login-input-label">6-Digit Code</label>
                <input
                  required
                  placeholder="123456"
                  value={code}
                  maxLength={6}
                  onChange={(e) => setCode(e.target.value)}
                  className="login-input"
                  style={{ letterSpacing: '4px', fontSize: '18px', textAlign: 'center', fontWeight: 'bold' }}
                />
              </div>

              {err && <p className="form-error">{err}</p>}

              <button disabled={busy} className="login-btn" type="submit">
                {busy ? <><span className="spinner" />Verifying…</> : 'Verify & Sign In →'}
              </button>

              <button type="button" onClick={() => setStep('phone')} className="login-back-btn">
                ← Change phone number
              </button>
            </form>
          )}

          <div className="login-dev-note">
            💡 <strong>Dev Mode:</strong> OTP code is printed directly in the API server logs.
          </div>
        </div>
      </div>
    </div>
  );
}
