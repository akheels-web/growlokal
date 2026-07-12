'use client';
// Business dashboard: ROI numbers + quick content actions.
// The ROI panel is the retention driver — "you got X enquiries this month".
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface RoiRow { month: string; enquiries: number; demos_booked: number; leads_captured: number; }

export default function Dashboard({ params }: { params: { businessId: string } }) {
  const { businessId } = params;
  const [roi, setRoi] = useState<RoiRow[]>([]);
  const [credit, setCredit] = useState<number | null>(null);
  const [focus, setFocus] = useState('New NEET batch starting soon');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<{ monthly: RoiRow[] }>(`/api/businesses/${businessId}/roi`).then((d) => setRoi(d.monthly)).catch(() => {});
    api<{ creditPaise: number }>(`/api/businesses/${businessId}/wallet`).then((d) => setCredit(d.creditPaise)).catch(() => {});
  }, [businessId]);

  const thisMonth = roi[0] ?? { enquiries: 0, demos_booked: 0, leads_captured: 0, month: '' };

  async function generateSocial() {
    setBusy(true); setMsg('');
    try {
      const r = await api<{ caption: string; scheduledFor: string }>(
        `/api/businesses/${businessId}/social/schedule`,
        { method: 'POST', body: JSON.stringify({ channel: 'instagram', focus }) }
      );
      setMsg(`✅ Scheduled: "${r.caption.slice(0, 80)}…"`);
    } catch (e) { setMsg('Failed to schedule post.'); }
    finally { setBusy(false); }
  }

  async function generateGbp() {
    setBusy(true); setMsg('');
    try {
      const r = await api<{ published: boolean; text: string }>(
        `/api/businesses/${businessId}/gbp/post`,
        { method: 'POST', body: JSON.stringify({ focus }) }
      );
      setMsg(r.published ? '✅ Posted to Google.' : `📝 Draft saved (GBP not connected): "${r.text.slice(0, 80)}…"`);
    } catch { setMsg('Failed to create GBP post.'); }
    finally { setBusy(false); }
  }

  return (
    <main style={{ maxWidth: 820, margin: '0 auto', padding: '32px 20px' }}>
      <h1>Your dashboard</h1>

      <section style={{ display: 'flex', gap: 16, flexWrap: 'wrap', margin: '20px 0' }}>
        <Stat label="Enquiries this month" value={thisMonth.enquiries} highlight />
        <Stat label="Demos booked" value={thisMonth.demos_booked} />
        <Stat label="Leads captured" value={thisMonth.leads_captured} />
        <Stat label="WhatsApp credit" value={credit == null ? '—' : `₹${(credit / 100).toFixed(0)}`} />
      </section>

      <section style={{ padding: 20, background: '#f6f8fa', borderRadius: 12 }}>
        <h2 style={{ marginTop: 0 }}>Create content</h2>
        <input value={focus} onChange={(e) => setFocus(e.target.value)}
          placeholder="What should this post highlight?"
          style={{ width: '100%', padding: '10px 12px', fontSize: 15, border: '1px solid #ccc', borderRadius: 8 }} />
        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          <button disabled={busy} onClick={generateSocial} style={btn}>Generate Instagram post</button>
          <button disabled={busy} onClick={generateGbp} style={{ ...btn, background: '#1558d6' }}>Generate Google post</button>
        </div>
        {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
      </section>

      <h2 style={{ marginTop: 32 }}>Last 12 months</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead><tr style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>
          <th style={c}>Month</th><th style={c}>Enquiries</th><th style={c}>Demos</th><th style={c}>Leads</th>
        </tr></thead>
        <tbody>
          {roi.map((r) => (
            <tr key={r.month} style={{ borderBottom: '1px solid #eee' }}>
              <td style={c}>{new Date(r.month).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</td>
              <td style={c}>{r.enquiries}</td><td style={c}>{r.demos_booked}</td><td style={c}>{r.leads_captured}</td>
            </tr>
          ))}
          {roi.length === 0 && <tr><td style={c} colSpan={4}>No data yet.</td></tr>}
        </tbody>
      </table>
    </main>
  );
}

function Stat({ label, value, highlight }: { label: string; value: number | string; highlight?: boolean }) {
  return (
    <div style={{ flex: '1 1 160px', padding: 16, borderRadius: 12,
      background: highlight ? '#1a7f37' : '#fff', color: highlight ? '#fff' : '#111',
      border: highlight ? 'none' : '1px solid #e5e5e5' }}>
      <div style={{ fontSize: 30, fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: 13, opacity: 0.85 }}>{label}</div>
    </div>
  );
}

const btn: React.CSSProperties = { padding: '10px 14px', fontSize: 15, fontWeight: 600, color: '#fff', background: '#1a7f37', border: 'none', borderRadius: 8, cursor: 'pointer' };
const c: React.CSSProperties = { padding: '8px 10px' };
