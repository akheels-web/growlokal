'use client';
// Step 3 of the GBP OAuth flow (see apps/api/src/routes/gbp-oauth.ts). The
// account-level connection already happened via the redirect that landed
// here — this page just lets the owner pick WHICH Business Profile location
// to post to (a Google account can have more than one).
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Location { id: string; title: string; }

export default function ConnectGbpLocation({ params }: { params: { businessId: string } }) {
  const { businessId } = params;
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<{ locations: Location[] }>(`/api/businesses/${businessId}/gbp/locations`)
      .then((d) => setLocations(d.locations ?? []))
      .catch(() => setErr('Could not load your Google Business Profile locations. Try reconnecting.'))
      .finally(() => setLoading(false));
  }, [businessId]);

  async function connect(locationId: string) {
    setBusy(true); setErr('');
    try {
      await api(`/api/businesses/${businessId}/gbp/locations`, {
        method: 'POST',
        body: JSON.stringify({ locationId }),
      });
      setSelectedId(locationId);
    } catch {
      setErr('Could not save your selection. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  // Zero locations usually means they signed in with the wrong Google
  // account — re-run the whole consent flow (prompt=consent forces the
  // account picker again) rather than leaving them stuck on a dead end.
  async function retryWithDifferentAccount() {
    setBusy(true); setErr('');
    try {
      const r = await api<{ authUrl: string }>(`/api/businesses/${businessId}/gbp/connect`);
      window.location.href = r.authUrl;
    } catch {
      setErr('Could not restart the connection. Please try again.');
      setBusy(false);
    }
  }

  if (loading) return <main style={{ maxWidth: 560, margin: '0 auto', padding: 40 }}>Loading your Google Business Profile locations…</main>;

  return (
    <main style={{ maxWidth: 560, margin: '0 auto', padding: '40px 20px' }}>
      <h1>Connect your Google Business Profile</h1>
      {selectedId ? (
        <div style={{ marginTop: 20, padding: 16, background: '#eafaf0', borderRadius: 12 }}>
          ✅ Connected! We'll post here going forward. <a href={`/dashboard/${businessId}`}>Back to dashboard →</a>
        </div>
      ) : (
        <>
          <p style={{ color: '#555' }}>Pick which location we should manage. If you only have one, this is quick.</p>
          {err && <p style={{ color: '#c00' }}>{err}</p>}
          {locations.length === 0 && !err && (
            <div style={{ marginTop: 16, padding: 16, background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 12 }}>
              <p style={{ margin: 0, marginBottom: 12 }}>
                We couldn't find any Google Business Profile locations under this account. Try signing in with the Google account that manages your business.
              </p>
              <button
                disabled={busy}
                onClick={retryWithDifferentAccount}
                style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: '#1a7f37', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
              >
                {busy ? 'Redirecting…' : 'Try a different Google account'}
              </button>
            </div>
          )}
          <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
            {locations.map((loc) => (
              <button
                key={loc.id}
                disabled={busy}
                onClick={() => connect(loc.id)}
                style={{ textAlign: 'left', padding: '14px 16px', borderRadius: 10, border: '1px solid #ccc', background: '#fff', cursor: 'pointer', fontSize: 15 }}
              >
                {loc.title}
              </button>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
