'use client';
// Onboarding: fills profile_context (what the AI uses for all content + chat).
// General purpose: services/pricing/highlights as clean text -> stored in profile_context
// jsonb, works for any local business type (salons, clinics, cafes, stores, gyms, etc.).
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function Onboarding({ params }: { params: { businessId: string } }) {
  const router = useRouter();
  const { businessId } = params;
  const [f, setF] = useState({
    name: '',
    city: 'Hyderabad',
    primaryLang: 'te',
    whatsappNumber: '',
    services: '',
    pricing: '',
    highlights: '',
    usps: '',
    operatingHours: '',
    upiId: '',
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.value });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      await api(`/api/businesses/${businessId}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: f.name,
          city: f.city,
          primaryLang: f.primaryLang,
          whatsappNumber: f.whatsappNumber,
          profileContext: {
            services: f.services,
            courses: f.services, // backward compatibility
            pricing: f.pricing,
            fees: f.pricing, // backward compatibility
            highlights: f.highlights,
            faculty_highlights: f.highlights, // backward compatibility
            usps: f.usps,
            operating_hours: f.operatingHours,
            batch_timings: f.operatingHours, // backward compatibility
            upiId: f.upiId,
          },
        }),
      });
      router.push(`/dashboard/${businessId}`);
    } catch {
      setErr('Could not save profile. Please check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px 80px', fontFamily: 'inherit' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <span style={{
          fontSize: '12px',
          fontWeight: '700',
          color: '#4F46E5',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          padding: '4px 12px',
          background: 'rgba(79, 70, 229, 0.1)',
          borderRadius: '20px',
          display: 'inline-block',
          marginBottom: '10px'
        }}>
          ⚡ Business Setup
        </span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#111827', margin: '0 0 10px' }}>
          Set Up Your Business Profile
        </h1>
        <p style={{ color: '#64748B', fontSize: '1rem', lineHeight: '1.5', margin: 0 }}>
          This information powers your 24/7 AI WhatsApp Chat Agent and weekly automated Google &amp; Instagram marketing posts.
        </p>
      </div>

      <div style={{
        background: '#ffffff',
        border: '1.5px solid #e2e8f0',
        borderRadius: '24px',
        padding: '36px 32px',
        boxShadow: '0 12px 36px rgba(15, 23, 42, 0.05)'
      }}>
        <form onSubmit={save} style={{ display: 'grid', gap: 16 }}>
          <div>
            <label style={lbl}>Business Name *</label>
            <input required placeholder="e.g. Apex Dental Clinic & Implant Center" value={f.name} onChange={set('name')} style={inp} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={lbl}>City *</label>
              <input required placeholder="e.g. Hyderabad" value={f.city} onChange={set('city')} style={inp} />
            </div>
            <div>
              <label style={lbl}>Primary Language *</label>
              <select value={f.primaryLang} onChange={set('primaryLang')} style={inp}>
                <option value="te">Telugu (తెలుగు)</option>
                <option value="ta">Tamil (தமிழ்)</option>
                <option value="kn">Kannada (ಕನ್ನಡ)</option>
                <option value="ml">Malayalam (മലയാളം)</option>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <div>
            <label style={lbl}>Business WhatsApp Number (for customer chat)</label>
            <input placeholder="91XXXXXXXXXX" value={f.whatsappNumber} onChange={set('whatsappNumber')} style={inp} />
          </div>

          <div>
            <label style={lbl}>Services &amp; Offerings</label>
            <textarea
              placeholder="List your key services (e.g. Root Canal, Teeth Whitening, Braces, Dental Implants, Emergency Care)"
              value={f.services}
              onChange={set('services')}
              style={ta}
            />
          </div>

          <div>
            <label style={lbl}>Pricing &amp; Packages</label>
            <textarea
              placeholder="Price ranges &amp; consultation fees (e.g. Consultation ₹300, Teeth Cleaning from ₹999, Complete Package ₹4,999)"
              value={f.pricing}
              onChange={set('pricing')}
              style={ta}
            />
          </div>

          <div>
            <label style={lbl}>Key Highlights &amp; Specialties</label>
            <input
              placeholder="e.g. 15+ years experience, State-of-the-art German equipment, 5000+ happy clients"
              value={f.highlights}
              onChange={set('highlights')}
              style={inp}
            />
          </div>

          <div>
            <label style={lbl}>What Makes You Stand Out (USPs)</label>
            <input
              placeholder="e.g. Free parking, 100% painless treatment, Open on Sundays"
              value={f.usps}
              onChange={set('usps')}
              style={inp}
            />
          </div>

          <div>
            <label style={lbl}>Working &amp; Operating Hours</label>
            <input
              placeholder="e.g. Mon - Sat: 9:00 AM - 9:00 PM, Sun: 10:00 AM - 2:00 PM"
              value={f.operatingHours}
              onChange={set('operatingHours')}
              style={inp}
            />
          </div>

          <div>
            <label style={lbl}>UPI ID for Bookings &amp; Advance Payments (Optional)</label>
            <input
              placeholder="e.g. business@okhdfcbank"
              value={f.upiId}
              onChange={set('upiId')}
              style={inp}
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            style={{
              padding: '16px 24px',
              fontSize: '16px',
              fontWeight: 800,
              color: '#ffffff',
              background: '#4F46E5',
              border: 'none',
              borderRadius: '12px',
              cursor: busy ? 'not-allowed' : 'pointer',
              marginTop: '12px',
              boxShadow: '0 4px 16px rgba(79, 70, 229, 0.35)',
              transition: 'all 0.2s ease',
            }}
          >
            {busy ? 'Saving Profile…' : 'Save Profile & Go to Dashboard →'}
          </button>
        </form>

        {err && (
          <p style={{ color: '#e11d48', background: '#ffe4e6', padding: '12px', borderRadius: '8px', marginTop: '16px', fontSize: '14px', textAlign: 'center' }}>
            {err}
          </p>
        )}
      </div>
    </main>
  );
}

const lbl: React.CSSProperties = { display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#111827', marginBottom: '6px' };
const inp: React.CSSProperties = { width: '100%', padding: '12px 14px', fontSize: '15px', border: '1.5px solid #cbd5e1', borderRadius: '10px', color: '#111827', outline: 'none', boxSizing: 'border-box' };
const ta: React.CSSProperties = { ...inp, minHeight: '80px', fontFamily: 'inherit', resize: 'vertical' };
