// Public booking/enquiry microsite for a local business. Server component —
// no auth, indexable, fast.
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

interface Ctx { courses?: string; fees?: string; faculty_highlights?: string; usps?: string; batch_timings?: string; upiId?: string; }
interface Biz { name: string; city: string; whatsapp_number: string | null; profile_context: Ctx; }

async function getBiz(id: string): Promise<Biz | null> {
  const res = await fetch(`${API}/api/public/business/${id}`, { next: { revalidate: 300 } });
  if (!res.ok) return null;
  return res.json();
}

export default async function Microsite({ params }: { params: { businessId: string } }) {
  const biz = await getBiz(params.businessId);
  if (!biz) return <main style={{ padding: 40 }}><h1>Business not found</h1></main>;

  const c = biz.profile_context ?? {};
  const wa = biz.whatsapp_number ? `https://wa.me/${biz.whatsapp_number}?text=${encodeURIComponent('Hi, I want to enquire about your services & pricing')}` : null;
  const upi = c.upiId ? `upi://pay?pa=${c.upiId}&pn=${encodeURIComponent(biz.name)}&tn=Booking` : null;

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '32px 20px', lineHeight: 1.5 }}>
      <h1 style={{ marginBottom: 4 }}>{biz.name}</h1>
      <p style={{ color: '#666', marginTop: 0 }}>{biz.city}</p>

      {c.courses && <Section title="Services & Products" body={c.courses} />}
      {c.fees && <Section title="Pricing" body={c.fees} />}
      {c.faculty_highlights && <Section title="Highlights & Specialties" body={c.faculty_highlights} />}
      {c.usps && <Section title="Why Choose Us" body={c.usps} />}
      {c.batch_timings && <Section title="Working Hours" body={c.batch_timings} />}

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24 }}>
        {wa && <a href={wa} style={{ ...btn, background: '#1a7f37' }}>Enquire on WhatsApp</a>}
        {upi && <a href={upi} style={{ ...btn, background: '#1558d6' }}>Pay Advance / Booking (UPI)</a>}
      </div>
      {!wa && <p style={{ color: '#999', marginTop: 20 }}>Contact number not set up yet.</p>}
    </main>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <section style={{ marginTop: 18 }}>
      <h2 style={{ fontSize: 17, marginBottom: 4 }}>{title}</h2>
      <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{body}</p>
    </section>
  );
}

const btn: React.CSSProperties = { padding: '12px 18px', fontSize: 16, fontWeight: 600, color: '#fff', textDecoration: 'none', borderRadius: 8 };
