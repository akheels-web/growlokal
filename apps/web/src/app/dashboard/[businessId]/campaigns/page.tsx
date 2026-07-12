'use client';
// WhatsApp marketing campaigns UI. Two steps against the existing API:
//   1. POST /campaigns        -> draft + AI-written body preview
//   2. POST /campaigns/:cid/send -> dispatch (debits prepaid credits)
// ponytail: recipients as a textarea (one number/line). No CSV upload until asked.
import { useState } from 'react';
import { api } from '@/lib/api';

export default function Campaigns({ params }: { params: { businessId: string } }) {
  const { businessId } = params;
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('Announce new NEET batch starting June 1');
  const [templateName, setTemplateName] = useState('');
  const [recipientsRaw, setRecipientsRaw] = useState('');
  const [draft, setDraft] = useState<{ id: string; bodyPreview: string } | null>(null);
  const [result, setResult] = useState<string>('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  // One number per line; strip blanks and spaces.
  const recipients = recipientsRaw.split('\n').map((s) => s.trim()).filter(Boolean);

  async function createDraft(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(''); setResult('');
    try {
      const r = await api<{ id: string; bodyPreview: string }>(
        `/api/businesses/${businessId}/campaigns`,
        { method: 'POST', body: JSON.stringify({ name, goal, templateName, recipients }) }
      );
      setDraft(r);
    } catch { setErr('Could not create draft. Check the fields.'); }
    finally { setBusy(false); }
  }

  async function send() {
    if (!draft) return;
    setBusy(true); setErr('');
    try {
      const r = await api<{ sent: number; failed: number; stoppedForCredits: boolean }>(
        `/api/businesses/${businessId}/campaigns/${draft.id}/send`,
        { method: 'POST', body: JSON.stringify({ recipients, templateName, languageCode: 'te', bodyParam: goal }) }
      );
      setResult(
        `✅ Sent ${r.sent}, failed ${r.failed}.` +
        (r.stoppedForCredits ? ' ⚠️ Stopped early — out of WhatsApp credits, top up to continue.' : '')
      );
      setDraft(null);
    } catch { setErr('Send failed.'); }
    finally { setBusy(false); }
  }

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '32px 20px' }}>
      <h1>WhatsApp campaign</h1>
      <p style={{ color: '#555' }}>Send an offer or announcement to parents/students. Marketing messages cost ~₹1 each from your prepaid credits.</p>

      <form onSubmit={createDraft} style={{ display: 'grid', gap: 12 }}>
        <input required placeholder="Campaign name (internal)" value={name} onChange={(e) => setName(e.target.value)} style={inp} />
        <input required placeholder="Goal (what to say)" value={goal} onChange={(e) => setGoal(e.target.value)} style={inp} />
        <input required placeholder="Approved WhatsApp template name" value={templateName} onChange={(e) => setTemplateName(e.target.value)} style={inp} />
        <textarea required placeholder="Recipient numbers, one per line (91XXXXXXXXXX)" value={recipientsRaw}
          onChange={(e) => setRecipientsRaw(e.target.value)} style={{ ...inp, minHeight: 100, fontFamily: 'monospace' }} />
        <small style={{ color: '#777' }}>{recipients.length} recipient(s) · est. ₹{recipients.length} in credits</small>
        <button disabled={busy} style={btn}>{busy ? 'Working…' : 'Preview message'}</button>
      </form>

      {err && <p style={{ color: '#c00' }}>{err}</p>}

      {draft && (
        <div style={{ marginTop: 24, padding: 16, background: '#f6f8fa', borderRadius: 12 }}>
          <h3 style={{ marginTop: 0 }}>Preview</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{draft.bodyPreview}</p>
          <button disabled={busy} onClick={send} style={btn}>
            {busy ? 'Sending…' : `Send to ${recipients.length}`}
          </button>
        </div>
      )}

      {result && <p style={{ marginTop: 20, fontWeight: 600 }}>{result}</p>}
    </main>
  );
}

const inp: React.CSSProperties = { padding: '11px 13px', fontSize: 15, border: '1px solid #ccc', borderRadius: 8 };
const btn: React.CSSProperties = { padding: '12px 16px', fontSize: 15, fontWeight: 600, color: '#fff', background: '#1a7f37', border: 'none', borderRadius: 8, cursor: 'pointer' };
