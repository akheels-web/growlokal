// Public booking/enquiry microsite for a local business. Server component —
// no auth, indexable, fast, fully generalized for any local business vertical.
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

interface Ctx {
  services?: string;
  courses?: string;
  pricing?: string;
  fees?: string;
  highlights?: string;
  faculty_highlights?: string;
  usps?: string;
  operating_hours?: string;
  batch_timings?: string;
  upiId?: string;
}

interface Biz {
  name: string;
  city: string;
  whatsapp_number: string | null;
  profile_context: Ctx;
}

async function getBiz(id: string): Promise<Biz | null> {
  try {
    const res = await fetch(`${API}/api/public/business/${id}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function Microsite({ params }: { params: { businessId: string } }) {
  const biz = await getBiz(params.businessId);
  if (!biz) {
    return (
      <main style={{ maxWidth: 640, margin: '60px auto', padding: '40px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#111827' }}>Business Not Found</h1>
        <p style={{ color: '#64748B' }}>This business profile page does not exist or has been removed.</p>
      </main>
    );
  }

  const c = biz.profile_context ?? {};
  const servicesText = c.services || c.courses;
  const pricingText = c.pricing || c.fees;
  const highlightsText = c.highlights || c.faculty_highlights;
  const hoursText = c.operating_hours || c.batch_timings;

  const wa = biz.whatsapp_number
    ? `https://wa.me/${biz.whatsapp_number}?text=${encodeURIComponent(`Hi ${biz.name}, I found you online and would like to enquire about your services & pricing.`)}`
    : null;

  const upi = c.upiId
    ? `upi://pay?pa=${c.upiId}&pn=${encodeURIComponent(biz.name)}&tn=AdvanceBooking`
    : null;

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '40px 20px' }}>
      <main style={{
        maxWidth: 640,
        margin: '0 auto',
        background: '#ffffff',
        border: '1.5px solid #e2e8f0',
        borderRadius: '24px',
        padding: '36px 28px',
        boxShadow: '0 12px 36px rgba(15, 23, 42, 0.05)',
        lineHeight: 1.6
      }}>
        <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-block',
            fontSize: '11px',
            fontWeight: 800,
            color: '#4F46E5',
            background: 'rgba(79, 70, 229, 0.1)',
            padding: '4px 10px',
            borderRadius: '20px',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            📍 Verified Local Business
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>{biz.name}</h1>
          <p style={{ color: '#64748B', fontSize: '15px', margin: 0 }}>{biz.city}</p>
        </div>

        {servicesText && <Section title="Services &amp; Offerings" body={servicesText} icon="✨" />}
        {pricingText && <Section title="Pricing &amp; Packages" body={pricingText} icon="💰" />}
        {highlightsText && <Section title="Highlights &amp; Specialties" body={highlightsText} icon="⭐" />}
        {c.usps && <Section title="Why Choose Us" body={c.usps} icon="🏆" />}
        {hoursText && <Section title="Working &amp; Operating Hours" body={hoursText} icon="🕒" />}

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 32, paddingTop: 24, borderTop: '1px solid #e2e8f0' }}>
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px 24px',
                fontSize: '15px',
                fontWeight: 800,
                color: '#ffffff',
                background: '#F97316',
                borderRadius: '12px',
                textDecoration: 'none',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                flex: '1 1 auto'
              }}
            >
              <span>💬 Enquire on WhatsApp</span>
            </a>
          )}
          {upi && (
            <a
              href={upi}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px 24px',
                fontSize: '15px',
                fontWeight: 800,
                color: '#ffffff',
                background: '#4F46E5',
                borderRadius: '12px',
                textDecoration: 'none',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                flex: '1 1 auto'
              }}
            >
              <span>⚡ Pay Booking Advance (UPI)</span>
            </a>
          )}
        </div>

        {!wa && (
          <p style={{ color: '#94a3b8', marginTop: 20, fontSize: '13px', textAlign: 'center' }}>
            Contact number is being updated.
          </p>
        )}
      </main>
    </div>
  );
}

function Section({ title, body, icon }: { title: string; body: string; icon?: string }) {
  return (
    <section style={{ marginTop: 20, background: '#F8FAFC', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px 20px' }}>
      <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        {icon && <span>{icon}</span>}
        <span>{title}</span>
      </h2>
      <p style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#475569', fontSize: '14px', lineHeight: 1.55 }}>{body}</p>
    </section>
  );
}
