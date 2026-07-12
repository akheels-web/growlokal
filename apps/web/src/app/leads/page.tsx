'use client';
// Internal leads view for your sales team. Now uses the authed API client.
// Requires a logged-in staff/admin token (sign in at /login).
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Lead {
  id: string;
  phone: string;
  business_name: string;
  city: string;
  stage: string;
  audit_score: number | null;
  created_at: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    api<{ leads: Lead[] }>('/api/leads')
      .then((d) => setLeads(d.leads ?? []))
      .catch(() => setErr('Not authorized — sign in at /login first.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>
      <h1>Leads (sales)</h1>
      {err && <p style={{ color: '#c00' }}>{err}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>
              <th style={th}>Business</th><th style={th}>Phone</th>
              <th style={th}>Score</th><th style={th}>Stage</th><th style={th}>Captured</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={td}>{l.business_name}</td>
                <td style={td}>{l.phone}</td>
                <td style={td}>{l.audit_score ?? '—'}</td>
                <td style={td}>{l.stage}</td>
                <td style={td}>{new Date(l.created_at).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
            {leads.length === 0 && !err && (
              <tr><td style={td} colSpan={5}>No leads yet. Run an audit from the home page.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </main>
  );
}

const th: React.CSSProperties = { padding: '8px 10px' };
const td: React.CSSProperties = { padding: '8px 10px' };
