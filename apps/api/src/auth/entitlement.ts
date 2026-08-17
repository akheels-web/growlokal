// Plan-based feature gating. See docs/DECISIONS.md (2026-07-11, entitlement
// system) for the rules this encodes and docs/FLOW.md §8 for why this exists
// (nothing previously checked plan/status anywhere).
//
// Rule (confirmed by the project owner): a business that never subscribed
// (plan='trial') and a business whose subscription lapsed (status='past_due'
// or 'churned') get the SAME restricted view — there's no difference in
// treatment between "never paid" and "stopped paying."
//
// Also checks the active subscription's current_period_end directly, not
// just businesses.status — so access is correctly restricted the moment the
// paid period ends even if Razorpay's webhook is delayed. There is
// deliberately no separate "suspend" job: this check is evaluated live on
// every request, so it's always correct without needing anything to
// proactively flip a status column.
import type { FastifyRequest, FastifyReply } from 'fastify';
import { queryOne } from '../db.js';
import { requireBusiness } from './middleware.js';

export type PlanTier = 'trial' | 'starter' | 'growth' | 'pro';

const PLAN_RANK: Record<PlanTier, number> = { trial: 0, starter: 1, growth: 2, pro: 3 };

export interface EntitlementInfo {
  plan: PlanTier;
  status: string;
  /** false if status is past_due/churned, plan is 'trial', or the active subscription's period has ended */
  entitled: boolean;
  /** the active subscription's renewal date, if any — for the dashboard expiry widget */
  currentPeriodEnd: string | null;
}

/** For checks outside an authenticated route (e.g. the public booking page). */
export function hasMinPlan(info: EntitlementInfo, minPlan: PlanTier): boolean {
  return info.entitled && PLAN_RANK[info.plan] >= PLAN_RANK[minPlan];
}

export async function getEntitlement(businessId: string): Promise<EntitlementInfo | null> {
  const row = await queryOne<{ plan: PlanTier; status: string }>(
    `SELECT plan, status FROM businesses WHERE id = $1`,
    [businessId]
  );
  if (!row) return null;

  // Most recent active subscription, if any — a business can have several
  // rows over time (plan changes, resubscribes).
  const sub = await queryOne<{ current_period_end: string | null }>(
    `SELECT current_period_end FROM subscriptions
     WHERE business_id = $1 AND active = true
     ORDER BY current_period_end DESC NULLS LAST LIMIT 1`,
    [businessId]
  );

  const periodExpired = !!sub?.current_period_end && new Date(sub.current_period_end) < new Date();
  const entitled =
    row.status !== 'past_due' && row.status !== 'churned' && row.plan !== 'trial' && !periodExpired;

  return {
    plan: row.plan,
    status: row.status,
    entitled,
    currentPeriodEnd: sub?.current_period_end ?? null,
  };
}

/**
 * Fastify preHandler: requires the business to be entitled AND on at least
 * `minPlan`. Composes requireBusiness first (auth + tenant check), so routes
 * only need this one preHandler, not both.
 *
 * Returns HTTP 402 (Payment Required) rather than 403 — this isn't a
 * permissions problem, it's a billing one, and the frontend can branch on
 * the status code to show a renewal prompt instead of a generic error.
 */
export function requirePlan(minPlan: PlanTier) {
  return async function (req: FastifyRequest, reply: FastifyReply) {
    await requireBusiness(req, reply);
    if (reply.sent) return;

    const { id } = req.params as { id: string };
    const info = await getEntitlement(id);
    if (!info || !info.entitled || PLAN_RANK[info.plan] < PLAN_RANK[minPlan]) {
      return reply.code(402).send({
        error: 'plan_required',
        message: `This feature requires the ${minPlan} plan or above. Please renew or upgrade your subscription.`,
        requiredPlan: minPlan,
      });
    }
  };
}
