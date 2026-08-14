'use client';
// Internal leads view for your sales team. Requires a logged-in staff/admin
// token (sign in at /login). "Assign to me" covers a 1-2 person sales team —
// no staff-picker UI until the team is bigger than that.
import { useEffect, useState } from 'react';
import { api, getCurrentUserId } from '@/lib/api';

interface Lead {
  id: string;
  phone: string;
  business_name: string;
  city: string;
  stage: string;
  audit_score: number | null;
  owner_user_id: string | null;
  created_at: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [mineOnly, setMineOnly] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const myUserId = getCurrentUserId();

  function load() {
    setLoading(true);
    api<{ leads: Lead[] }>(`/api/leads${mineOnly ? '?mine=true' : ''}`)
      .then((d) => setLeads(d.leads ?? []))
      .catch(() => setErr('Not authorized — sign in at /login first.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [mineOnly]); // eslint-disable-line react-hooks/exhaustive-deps

  async function assignToMe(leadId: string) {
    setBusyId(leadId);
    try {
      await api(`/api/leads/${leadId}/assign`, { method: 'PATCH', body: JSON.stringify({}) });
      load();
    } catch { setErr('Could not assign lead.'); }
    finally { setBusyId(null); }
  }

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '32px 20px' }}>
      <h1>Leads (sales)</h1>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '12px 0', fontSize: 14 }}>
        <input type="checkbox" checked={mineOnly} onChange={(e) => setMineOnly(e.target.checked)} />
        Show only my leads
      </label>
      {err && <p style={{ color: '#c00' }}>{err}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>
              <th style={th}>Business</th><th style={th}>Phone</th>
              <th style={th}>Score</th><th style={th}>Stage</th><th style={th}>Owner</th>
              <th style={th}>Captured</th><th style={th}></th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={td}>{l.business_name}</td>
                <td style={td}>{l.phone}</td>
                <td style={td}>{l.audit_score ?? '—'}</td>
                <td style={td}>{l.stage}</td>
                <td style={td}>{l.owner_user_id === myUserId && myUserId ? 'Me' : l.owner_user_id ? 'Assigned' : '—'}</td>
                <td style={td}>{new Date(l.created_at).toLocaleDateString('en-IN')}</td>
                <td style={td}>
                  {l.owner_user_id !== myUserId && (
                    <button disabled={busyId === l.id} onClick={() => assignToMe(l.id)} style={btn}>
                      {busyId === l.id ? '…' : 'Assign to me'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {leads.length === 0 && !err && (
              <tr><td style={td} colSpan={7}>No leads yet. Run an audit from the home page.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </main>
  );
}

const th: React.CSSProperties = { padding: '8px 10px' };
const td: React.CSSProperties = { padding: '8px 10px' };
const btn: React.CSSProperties = { padding: '5px 10px', fontSize: 12, fontWeight: 600, color: '#fff', background: '#1a7f37', border: 'none', borderRadius: 6, cursor: 'pointer' };
