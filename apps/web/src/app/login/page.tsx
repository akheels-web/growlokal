'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, setToken } from '@/lib/api';
import { ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';

export default function Login() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
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
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErr('Please enter a valid 10-digit mobile number.');
      return;
    }

    setBusy(true); setErr('');
    try {
      await api('/api/auth/request-otp', { method: 'POST', body: JSON.stringify({ phone: cleanPhone }) });
      setStep('code');
      setCooldown(60);
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
        body: JSON.stringify({ phone: cleanPhone, code: cleanCode }),
      });
      setToken(r.token);
      router.push(`/dashboard/${r.businessId}`);
    } catch (err: any) {
      if (err.message?.includes('429')) setErr('Too many attempts. Please wait a minute.');
      else if (err.message?.includes('no_account')) setErr('No GrowLokal account found for this number — message us on WhatsApp to get started.');
      else setErr('Invalid or expired 6-digit code.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#111827' }}>
      
      {/* ─── MINIMAL HEADER ─── */}
      <header style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '14px 24px',
      }}>
        <div style={{
          maxWidth: '1180px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <BrandLogo variant="header" />

          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13.5px',
              fontWeight: '700',
              color: '#475569',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main style={{ flex: 1, padding: '48px 24px 80px', maxWidth: '1100px', margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '56px',
          alignItems: 'center',
          width: '100%',
        }}>
          
          {/* Left Column: Platform Overview */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: 'rgba(23, 95, 171, 0.06)',
              border: '1px solid rgba(23, 95, 171, 0.25)',
              borderRadius: '50px',
              fontSize: '13px',
              fontWeight: '700',
              color: '#175fab',
              marginBottom: '20px',
            }}>
              <ShieldCheck size={16} color="#175fab" />
              <span>Owner Portal &amp; AI Dashboard</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: '900',
              lineHeight: 1.15,
              color: '#0B1020',
              marginBottom: '20px',
              letterSpacing: '-0.03em',
            }}>
              Sign in to manage your <span style={{ background: 'linear-gradient(135deg, #175fab 0%, #3be06d 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>local growth</span>
            </h1>

            <p style={{ fontSize: '1.05rem', color: '#64748B', lineHeight: 1.65, marginBottom: '32px' }}>
              Access your real-time ranking metrics, approve AI-drafted review replies, and broadcast WhatsApp offers to verified local customers.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <span style={{ fontSize: '22px', lineHeight: 1 }}>🚀</span>
                <div>
                  <strong style={{ fontSize: '1rem', color: '#111827', display: 'block' }}>Google Maps Ranking Autopilot</strong>
                  <span style={{ fontSize: '0.92rem', color: '#64748B' }}>Monitor your ranking progress across local pin codes.</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <span style={{ fontSize: '22px', lineHeight: 1 }}>💬</span>
                <div>
                  <strong style={{ fontSize: '1rem', color: '#111827', display: 'block' }}>24/7 Vernacular WhatsApp AI</strong>
                  <span style={{ fontSize: '0.92rem', color: '#64748B' }}>Manage lead dialogues in Telugu, Tamil, Kannada &amp; English.</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <span style={{ fontSize: '22px', lineHeight: 1 }}>📊</span>
                <div>
                  <strong style={{ fontSize: '1rem', color: '#111827', display: 'block' }}>Verified ROI Analytics</strong>
                  <span style={{ fontSize: '0.92rem', color: '#64748B' }}>Track calls, direction requests, and converted appointments.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean White Login Card */}
          <div>
            <div style={{
              background: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              borderRadius: '24px',
              padding: '36px',
              boxShadow: '0 12px 36px rgba(15, 23, 42, 0.06)',
            }}>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0B1020', marginBottom: '6px' }}>
                  {step === 'phone' ? 'Welcome Back' : 'Enter 6-Digit Code'}
                </h2>
                <p style={{ fontSize: '0.92rem', color: '#64748B' }}>
                  {step === 'phone'
                    ? 'Enter your WhatsApp number to sign in to your GrowLokal account.'
                    : `Enter the verification code sent to +91 ${phone}`}
                </p>
              </div>

              {step === 'phone' ? (
                <form onSubmit={requestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* WhatsApp Number Field */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13.5px', fontWeight: '700', color: '#1E293B', marginBottom: '8px' }}>
                      WhatsApp Number <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <div className="phone-input-group" style={{ height: '48px' }}>
                      <div className="phone-prefix">
                        <svg width="22" height="15" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: '2.5px', flexShrink: 0 }}>
                          <rect width="20" height="4.67" fill="#FF9933" />
                          <rect y="4.67" width="20" height="4.67" fill="#FFFFFF" />
                          <rect y="9.33" width="20" height="4.67" fill="#138808" />
                          <circle cx="10" cy="7" r="1.8" stroke="#000080" strokeWidth="0.6" fill="none" />
                        </svg>
                        <span className="phone-code">+91</span>
                        <span className="phone-divider" />
                      </div>
                      <input
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="81234 56789"
                        className="phone-input-field"
                      />
                    </div>
                  </div>

                  {err && (
                    <div style={{ padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', color: '#DC2626', fontSize: '13px', fontWeight: '600' }}>
                      {err}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={busy || cooldown > 0}
                    style={{
                      width: '100%',
                      padding: '14px 20px',
                      background: 'linear-gradient(135deg, #175fab 0%, #3be06d 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '15px',
                      fontWeight: '800',
                      cursor: busy || cooldown > 0 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 2px 8px rgba(23, 95, 171, 0.2)',
                      transition: 'opacity 0.2s',
                    }}
                  >
                    {busy ? 'Sending OTP...' : cooldown > 0 ? `Resend Code in ${cooldown}s` : 'Send OTP via WhatsApp →'}
                  </button>
                </form>
              ) : (
                /* Step 2: OTP Verification */
                <form onSubmit={verify} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13.5px', fontWeight: '700', color: '#1E293B', marginBottom: '8px' }}>
                      6-Digit Verification Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: '10px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '22px',
                        fontWeight: '800',
                        color: '#0B1020',
                        textAlign: 'center',
                        letterSpacing: '0.3em',
                        outline: 'none',
                      }}
                    />
                  </div>

                  {err && (
                    <div style={{ padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', color: '#DC2626', fontSize: '13px', fontWeight: '600' }}>
                      {err}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={busy}
                    style={{
                      width: '100%',
                      padding: '14px 20px',
                      background: 'linear-gradient(135deg, #175fab 0%, #3be06d 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '15px',
                      fontWeight: '800',
                      cursor: busy ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 2px 8px rgba(23, 95, 171, 0.2)',
                    }}
                  >
                    {busy ? 'Verifying...' : 'Verify & Enter Dashboard →'}
                  </button>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                    <button
                      type="button"
                      onClick={() => setStep('phone')}
                      style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontWeight: '600' }}
                    >
                      ← Change number
                    </button>
                    {cooldown > 0 ? (
                      <span style={{ color: '#94A3B8' }}>Resend in {cooldown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={requestOtp}
                        style={{ background: 'none', border: 'none', color: '#175fab', cursor: 'pointer', fontWeight: '700' }}
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer style={{ borderTop: '1px solid #E2E8F0', padding: '20px', textAlign: 'center', fontSize: '13px', color: '#64748B', background: '#FFFFFF' }}>
        © {new Date().getFullYear()} GrowLokal Technologies. All rights reserved.
      </footer>
    </div>
  );
}
