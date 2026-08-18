'use client';
// Client-side entitlement helpers + the two wall states. Mirrors the backend
// rule in apps/api/src/auth/entitlement.ts (PLAN_RANK, entitled definition)
// — this is UI-only; the backend enforces the real rule independently (see
// docs/DECISIONS.md, entitlement system).
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export interface Entitlement { plan: string; status: string; entitled: boolean; currentPeriodEnd: string | null; }

const PLAN_RANK: Record<string, number> = { trial: 0, starter: 1, growth: 2, pro: 3 };

export function hasMinPlan(ent: Entitlement | null, minPlan: string): boolean {
  return !!ent && ent.entitled && (PLAN_RANK[ent.plan] ?? 0) >= (PLAN_RANK[minPlan] ?? 0);
}

export function useEntitlement() {
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api<{ entitlement: Entitlement | null }>('/api/auth/me')
      .then((d) => setEntitlement(d.entitlement))
      .catch(() => setEntitlement(null))
      .finally(() => setLoading(false));
  }, []);
  return { entitlement, loading };
}

const RENEW_WA_LINK = 'https://api.whatsapp.com/send?phone=919876543210&text=Hi%2C%20I%20want%20to%20renew%20my%20GrowLokal%20plan';
const UPGRADE_WA_LINK = 'https://api.whatsapp.com/send?phone=919876543210&text=Hi%2C%20I%20want%20to%20upgrade%20my%20GrowLokal%20plan';

/**
 * Full-page wall for a business that isn't entitled to ANY paid plan —
 * never subscribed (trial) or lapsed (past_due/churned). Per the confirmed
 * rule, both get this exact same view; nothing else on the dashboard renders.
 */
export function RenewalWall() {
  return (
    <main style={{ maxWidth: 480, margin: '100px auto', textAlign: 'center', padding: '0 24px' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
      <h1 style={{ fontSize: '1.6rem', marginBottom: 8, color: '#111827' }}>Your plan needs renewal</h1>
      <p style={{ color: '#64748B', marginBottom: 24 }}>
        Renew your subscription to get back to your dashboard, AI posts, and WhatsApp automation.
      </p>
      <a href={RENEW_WA_LINK} target="_blank" rel="noopener noreferrer" style={{
        display: 'inline-block', padding: '14px 28px', background: '#1a7f37', color: '#fff',
        borderRadius: 8, fontWeight: 600, textDecoration: 'none',
      }}>
        Renew on WhatsApp →
      </a>
    </main>
  );
}

/** Small badge showing renewal date + days remaining; warns inside 7 days. */
export function ExpiryBadge({ currentPeriodEnd }: { currentPeriodEnd: string | null }) {
  if (!currentPeriodEnd) return null;
  const daysLeft = Math.ceil((new Date(currentPeriodEnd).getTime() - Date.now()) / 86_400_000);
  const warning = daysLeft <= 7;
  const dateStr = new Date(currentPeriodEnd).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  return (
    <span style={{
      padding: '6px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600,
      background: warning ? 'rgba(220, 38, 38, 0.1)' : 'rgba(79, 70, 229, 0.1)',
      color: warning ? '#dc2626' : 'var(--color-brand-dark, #0B1020)',
      border: `1px solid ${warning ? 'rgba(220,38,38,0.3)' : 'rgba(79, 70, 229,0.25)'}`,
    }}>
      {warning ? '⚠️' : '🔄'} Renews {dateStr} ({daysLeft} day{daysLeft === 1 ? '' : 's'})
    </span>
  );
}

/** Smaller inline wall for one gated feature within an otherwise-usable dashboard. */
export function UpgradeWall({ requiredPlan }: { requiredPlan: string }) {
  return (
    <div style={{ padding: 32, textAlign: 'center', background: '#f6f8fa', borderRadius: 12 }}>
      <p style={{ fontWeight: 600, marginBottom: 8, color: '#111827' }}>
        This feature needs the {requiredPlan} plan or above.
      </p>
      <a href={UPGRADE_WA_LINK} target="_blank" rel="noopener noreferrer" style={{ color: '#1a7f37', fontWeight: 600, textDecoration: 'none' }}>
        Upgrade now →
      </a>
    </div>
  );
}
