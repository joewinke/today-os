import { error, fail } from "@sveltejs/kit"
import { getAccount, getRecommendations, getEvents, latestSnapshot, runAudit } from "$lib/adops/store"
import { metricIndex } from "$lib/adops/redflags"
import { ctr } from "$lib/adops/types"
import type { Actions, PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ params }) => {
  const account = getAccount(params.id)
  if (!account) throw error(404, `Unknown account: ${params.id}`)

  const snapshot = latestSnapshot(account.id) ?? null

  // Campaign table computed from the snapshot's structure + metric rows.
  const campaigns = snapshot
    ? (() => {
        const byCampaign = metricIndex(snapshot.spec, "campaign")
        return snapshot.spec.campaigns.map((c) => {
          const m = byCampaign.get(c.external_id) ?? { impressions: 0, clicks: 0, cost: 0, conversions: 0 }
          return {
            external_id: c.external_id,
            name: c.name,
            status: c.status,
            bid_strategy: c.bid_strategy,
            budget_cents: c.budget.amount_cents,
            budget_period: c.budget.period,
            is_budget_limited: c.is_budget_limited ?? false,
            impressions: m.impressions,
            clicks: m.clicks,
            cost_cents: m.cost,
            conversions: m.conversions,
            ctr: ctr(m.impressions, m.clicks),
            cpa_cents: m.conversions > 0 ? Math.round(m.cost / m.conversions) : null,
          }
        })
      })()
    : []

  return {
    account,
    snapshot: snapshot ? { taken_at: snapshot.taken_at, yaml: snapshot.yaml, window_days: snapshot.spec.metrics.window_days } : null,
    campaigns,
    recommendations: getRecommendations({ accountId: account.id }).slice().reverse(),
    events: getEvents(account.id),
  }
}

export const actions: Actions = {
  runAudit: async ({ params }) => {
    try {
      const result = await runAudit(params.id)
      return {
        ok: true as const,
        recommendations: result.recommendations.length,
        redFlags: result.redFlagCount,
        llm: result.llmCount,
        via: result.via,
      }
    } catch (err) {
      return fail(400, { error: err instanceof Error ? err.message : "Audit failed" })
    }
  },
}
