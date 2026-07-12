'use client';
// Onboarding: fills profile_context (what the AI uses for all content + chat).
// ponytail: courses/fees/faculty as free text -> stored in profile_context jsonb.
// No structured course editor until a center actually needs one.
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function Onboarding({ params }: { params: { businessId: string } }) {
  const router = useRouter();
  const { businessId } = params;
  const [f, setF] = useState({
    name: '', city: 'Hyderabad', primaryLang: 'te', whatsappNumber: '',
    courses: '', fees: '', faculty: '', usps: '', timings: '', upiId: '',
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.value });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      await api(`/api/businesses/${businessId}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: f.name, city: f.city, primaryLang: f.primaryLang, whatsappNumber: f.whatsappNumber,
          profileContext: {
            courses: f.courses, fees: f.fees, faculty_highlights: f.faculty,
            usps: f.usps, batch_timings: f.timings, upiId: f.upiId,
          },
        }),
      });
      router.push(`/dashboard/${businessId}`);
    } catch { setErr('Could not save. Try again.'); }
    finally { setBusy(false); }
  }

  return (
    <main style={{ maxWidth: 560, margin: '0 auto', padding: '40px 20px' }}>
      <h1>Set up your center</h1>
      <p style={{ color: '#555' }}>This is what our AI uses to write your posts and answer parents on WhatsApp.</p>
      <form onSubmit={save} style={{ display: 'grid', gap: 12 }}>
        <input required placeholder="Center name" value={f.name} onChange={set('name')} style={inp} />
        <input placeholder="City" value={f.city} onChange={set('city')} style={inp} />
        <select value={f.primaryLang} onChange={set('primaryLang')} style={inp}>
          <option value="te">Telugu</option><option value="ta">Tamil</option>
          <option value="kn">Kannada</option><option value="ml">Malayalam</option>
          <option value="hi">Hindi</option><option value="en">English</option>
        </select>
        <input placeholder="Your WhatsApp number (91XXXXXXXXXX)" value={f.whatsappNumber} onChange={set('whatsappNumber')} style={inp} />
        <textarea placeholder="Courses (e.g. EAMCET, NEET, JEE, Foundation 8-10)" value={f.courses} onChange={set('courses')} style={ta} />
        <textarea placeholder="Fees (e.g. NEET 60000/year)" value={f.fees} onChange={set('fees')} style={ta} />
        <input placeholder="Faculty highlights (e.g. IIT/NIT alumni, 12+ yrs)" value={f.faculty} onChange={set('faculty')} style={inp} />
        <input placeholder="What makes you different (USPs)" value={f.usps} onChange={set('usps')} style={inp} />
        <input placeholder="Batch timings" value={f.timings} onChange={set('timings')} style={inp} />
        <input placeholder="UPI ID for registration fees (optional)" value={f.upiId} onChange={set('upiId')} style={inp} />
        <button disabled={busy} style={btn}>{busy ? 'Saving…' : 'Save & go to dashboard'}</button>
      </form>
      {err && <p style={{ color: '#c00' }}>{err}</p>}
    </main>
  );
}

const inp: React.CSSProperties = { padding: '11px 13px', fontSize: 15, border: '1px solid #ccc', borderRadius: 8 };
const ta: React.CSSProperties = { ...inp, minHeight: 60, fontFamily: 'inherit' };
const btn: React.CSSProperties = { padding: '12px', fontSize: 16, fontWeight: 600, color: '#fff', background: '#1a7f37', border: 'none', borderRadius: 8, cursor: 'pointer' };
