'use client';

// Premium Business Dashboard matching the custom GrowLokal brand palette
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useEntitlement, hasMinPlan, RenewalWall, ExpiryBadge } from '@/components/PlanGate';

interface RoiRow { month: string; enquiries: number; demos_booked: number; leads_captured: number; }

export default function Dashboard({ params }: { params: { businessId: string } }) {
  const { businessId } = params;
  const { entitlement, loading: entitlementLoading } = useEntitlement();
  const [roi, setRoi] = useState<RoiRow[]>([]);
  const [credit, setCredit] = useState<number | null>(null);
  const [focus, setFocus] = useState('New NEET & JEE batch starting soon');
  const [msg, setMsg] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<{ monthly: RoiRow[] }>(`/api/businesses/${businessId}/roi`).then((d) => setRoi(d.monthly)).catch(() => {});
    api<{ creditPaise: number }>(`/api/businesses/${businessId}/wallet`).then((d) => setCredit(d.creditPaise)).catch(() => {});
  }, [businessId]);

  const thisMonth = roi[0] ?? { enquiries: 0, demos_booked: 0, leads_captured: 0, month: '' };

  // Not entitled to any paid plan (never subscribed, or lapsed) -> show
  // nothing else, per the confirmed "same restricted view" rule.
  if (entitlementLoading) return null;
  if (!entitlement?.entitled) return <RenewalWall />;
  const canUseGrowthFeatures = hasMinPlan(entitlement, 'growth');

  async function generateSocial(channel: 'instagram' | 'facebook') {
    setBusy(true); setMsg(''); setImageUrl(null);
    try {
      const r = await api<{ caption: string; scheduledFor: string; imageUrl: string | null }>(
        `/api/businesses/${businessId}/social/schedule`,
        { method: 'POST', body: JSON.stringify({ channel, focus }) }
      );
      setMsg(`✅ Scheduled (${channel}): "${r.caption.slice(0, 80)}…"`);
      setImageUrl(r.imageUrl);
    } catch {
      setMsg('Failed to schedule social post.');
    } finally {
      setBusy(false);
    }
  }

  async function generateGbp() {
    setBusy(true); setMsg(''); setImageUrl(null);
    try {
      const r = await api<{ published: boolean; text: string; imageUrl: string | null }>(
        `/api/businesses/${businessId}/gbp/post`,
        { method: 'POST', body: JSON.stringify({ focus }) }
      );
      setMsg(r.published ? '✅ Posted to Google Business.' : `📝 Draft saved: "${r.text.slice(0, 80)}…"`);
      setImageUrl(r.imageUrl);
    } catch {
      setMsg('Failed to create Google post.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page-wrapper" style={{ background: 'var(--color-bg-primary)', minHeight: '100vh', paddingBottom: '64px' }}>
      {/* Header Bar */}
      <header style={{ background: 'var(--color-brand-darkest)', color: '#ffffff', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" className="nav-brand" style={{ color: '#ffffff', fontSize: '1.4rem' }}>
            Grow<span style={{ color: '#F97316' }}>Lokal</span>
          </Link>
          <div style={{ display: 'flex', gap: '16px', fontSize: '14px', fontWeight: 500 }}>
            {canUseGrowthFeatures && (
              <Link href={`/dashboard/${businessId}/campaigns`} style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}>
                💬 WhatsApp Campaigns
              </Link>
            )}
            <Link href={`/onboarding/${businessId}`} style={{ color: '#4F46E5', textDecoration: 'none' }}>
              ⚙️ Edit Profile
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--color-brand-darkest)', marginBottom: '4px' }}>Business Overview</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Track your ROI, enquiries, and generate AI posts instantly.</p>
          </div>
          <ExpiryBadge currentPeriodEnd={entitlement.currentPeriodEnd} />
        </div>

        {/* Stats Section */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '36px' }}>
          <StatCard label="Enquiries This Month" value={thisMonth.enquiries} highlight icon="📈" />
          <StatCard label="Demos Booked" value={thisMonth.demos_booked} icon="🎯" />
          <StatCard label="Leads Captured" value={thisMonth.leads_captured} icon="👥" />
          <StatCard label="WhatsApp Credit" value={credit == null ? '—' : `₹${(credit / 100).toFixed(0)}`} icon="💳" />
        </section>

        {/* AI Content Creator Panel */}
        <section style={{ background: '#ffffff', borderRadius: '16px', padding: '28px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)', marginBottom: '44px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontSize: '24px' }}>🤖</span>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--color-brand-darkest)', margin: 0 }}>AI Marketing Post Generator</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', margin: 0 }}>Describe what you want to promote, and your AI agents will craft optimized posts.</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              placeholder="e.g., Special 20% discount on new service package starting this week"
              className="form-input"
              style={{ background: 'var(--color-bg-primary)' }}
            />
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {canUseGrowthFeatures ? (
                <>
                  <button disabled={busy} onClick={() => generateSocial('instagram')} className="btn-primary" style={{ width: 'auto', background: 'var(--gradient-cta)' }}>
                    {busy ? <span className="spinner" /> : '✨ Generate Instagram Post'}
                  </button>
                  <button disabled={busy} onClick={() => generateSocial('facebook')} className="btn-primary" style={{ width: 'auto', background: 'var(--gradient-cta)' }}>
                    {busy ? <span className="spinner" /> : '✨ Generate Facebook Post'}
                  </button>
                </>
              ) : (
                <span style={{ fontSize: 13, color: 'var(--color-text-muted)', alignSelf: 'center' }}>
                  ✨ Instagram/Facebook posts need the Growth plan — <a href="https://api.whatsapp.com/send?phone=919876543210&text=Hi%2C%20I%20want%20to%20upgrade%20my%20GrowLokal%20plan" target="_blank" rel="noopener noreferrer" style={{ color: '#1a7f37', fontWeight: 600 }}>upgrade →</a>
                </span>
              )}
              <button disabled={busy} onClick={generateGbp} className="btn-outline" style={{ width: 'auto', border: '1.5px solid var(--color-brand-dark)', color: 'var(--color-brand-dark)' }}>
                {busy ? <span className="spinner" /> : '📍 Generate Google Post'}
              </button>
            </div>
            {msg && <p style={{ marginTop: '12px', padding: '12px 16px', background: 'rgba(249, 115, 22, 0.12)', border: '1px solid rgba(249, 115, 22, 0.3)', borderRadius: '8px', color: 'var(--color-brand-darkest)', fontSize: '14px' }}>{msg}</p>}
            {imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="AI-generated post visual" style={{ marginTop: '12px', maxWidth: '280px', borderRadius: '12px', border: '1px solid var(--color-border)' }} />
            )}
          </div>
        </section>

        {/* Historical Table */}
        <section style={{ background: '#ffffff', borderRadius: '16px', padding: '28px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--color-brand-darkest)', marginBottom: '16px' }}>Enquiry Performance History</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--color-border)', color: 'var(--color-brand-dark)' }}>
                  <th style={c}>Month</th>
                  <th style={c}>Enquiries</th>
                  <th style={c}>Demos</th>
                  <th style={c}>Leads</th>
                </tr>
              </thead>
              <tbody>
                {roi.map((r) => (
                  <tr key={r.month} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={c}><strong>{new Date(r.month).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</strong></td>
                    <td style={c}><span style={{ color: 'var(--color-brand-teal)', fontWeight: 600 }}>{r.enquiries}</span></td>
                    <td style={c}>{r.demos_booked}</td>
                    <td style={c}>{r.leads_captured}</td>
                  </tr>
                ))}
                {roi.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ ...c, textAlign: 'center', color: 'var(--color-text-muted)', padding: '24px' }}>
                      No enquiry data recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ label, value, highlight, icon }: { label: string; value: number | string; highlight?: boolean; icon: string }) {
  return (
    <div style={{
      padding: '24px',
      borderRadius: '16px',
      background: highlight ? 'var(--gradient-cta)' : '#ffffff',
      color: highlight ? '#ffffff' : 'var(--color-brand-darkest)',
      border: highlight ? 'none' : '1px solid var(--color-border)',
      boxShadow: highlight ? 'var(--shadow-glow)' : 'var(--shadow-card)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '20px' }}>{icon}</span>
        {highlight && <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '999px', fontWeight: 600 }}>Top Metric</span>}
      </div>
      <div style={{ fontSize: '2.25rem', fontWeight: 800, fontFamily: 'var(--font-heading)', lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: '13px', opacity: highlight ? 0.9 : 0.7, marginTop: '4px', fontWeight: 500 }}>{label}</div>
    </div>
  );
}

const c: React.CSSProperties = { padding: '12px 14px' };
