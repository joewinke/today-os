import { fail } from "@sveltejs/kit"
import {
  getAccounts,
  getStats,
  getRecommendations,
  latestSnapshot,
  runAudit,
  runSweep,
} from "$lib/adops/store"
import { getActiveTheme } from "$lib/adops/theme"
import type { Actions, PageServerLoad } from "./$types"

export const load: PageServerLoad = async () => {
  const accounts = getAccounts().map((account) => ({
    ...account,
    proposed: getRecommendations({ accountId: account.id, status: "proposed" }).length,
    lastSnapshotAt: latestSnapshot(account.id)?.taken_at ?? null,
  }))
  const t = getActiveTheme()
  return {
    accounts,
    stats: getStats(),
    theme: { source: t.source, business: t.business, vertical: t.vertical, domain: t.domain ?? null, scannedAt: t.scannedAt ?? null },
  }
}

export const actions: Actions = {
  runAudit: async ({ request }) => {
    const form = await request.formData()
    const accountId = String(form.get("accountId") ?? "")
    try {
      const result = await runAudit(accountId)
      return {
        ok: true as const,
        action: "audit" as const,
        accountId,
        recommendations: result.recommendations.length,
        redFlags: result.redFlagCount,
        llm: result.llmCount,
        via: result.via,
      }
    } catch (err) {
      return fail(400, { error: err instanceof Error ? err.message : "Audit failed" })
    }
  },

  runSweep: async () => {
    const results = await runSweep()
    return {
      ok: true as const,
      action: "sweep" as const,
      drained: results.length,
      recommendations: results.reduce((n, r) => n + r.recommendations.length, 0),
    }
  },
}
