// Plan-based feature gating. See docs/DECISIONS.md (2026-07-11, entitlement
// system) for the rules this encodes and docs/FLOW.md §8 for why this exists
// (nothing previously checked plan/status anywhere).
//
// Rule (confirmed by the project owner): a business that never subscribed
// (plan='trial') and a business whose subscription lapsed (status='past_due'
// or 'churned') get the SAME restricted view — there's no difference in
// treatment between "never paid" and "stopped paying."
import type { FastifyRequest, FastifyReply } from 'fastify';
import { queryOne } from '../db.js';
import { requireBusiness } from './middleware.js';

export type PlanTier = 'trial' | 'starter' | 'growth' | 'pro';

const PLAN_RANK: Record<PlanTier, number> = { trial: 0, starter: 1, growth: 2, pro: 3 };

export interface EntitlementInfo {
  plan: PlanTier;
  status: string;
  /** false if status is past_due/churned OR plan is still 'trial' (never subscribed) */
  entitled: boolean;
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
  const entitled = row.status !== 'past_due' && row.status !== 'churned' && row.plan !== 'trial';
  return { plan: row.plan, status: row.status, entitled };
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
