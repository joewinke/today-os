import { fail } from "@sveltejs/kit"
import {
  getAccounts,
  getRecommendations,
  approveRecommendation,
  dismissRecommendation,
  evaluateAutoApplyGate,
} from "$lib/adops/store"
import { getActiveTheme } from "$lib/adops/theme"
import { recordWasteRecovered, markSetup } from "$lib/os/store"
import type { Actions, PageServerLoad } from "./$types"

export const load: PageServerLoad = async () => {
  const accounts = getAccounts()
  const groups = accounts
    .map((account) => {
      const proposed = getRecommendations({ accountId: account.id, status: "proposed" })
      const approved = getRecommendations({ accountId: account.id, status: "approved" })
      const dismissed = getRecommendations({ accountId: account.id, status: "dismissed" }).length
      // High risk first inside each status bucket.
      const riskOrder = { high: 0, medium: 1, low: 2 } as const
      proposed.sort((a, b) => riskOrder[a.risk] - riskOrder[b.risk])
      // The safety-demo hook: the first proposed rec whose approval would fail
      // closed (auto autonomy + no spend cap). Computed with the SAME gate the
      // approve action runs — reused, not duplicated — so the inbox can invite
      // the reviewer to approve exactly the rec that will get BLOCKED.
      const blockingRecId =
        proposed.find((r) => evaluateAutoApplyGate(account, r).verdict === "blocked")?.id ?? null
      return { account, proposed, approved, dismissed, blockingRecId }
    })
    .filter((group) => group.proposed.length > 0 || group.approved.length > 0 || group.dismissed > 0)

  return { groups }
}

export const actions: Actions = {
  approve: async ({ request }) => {
    const form = await request.formData()
    const id = String(form.get("id") ?? "")
    try {
      const rec = approveRecommendation(id)
      markSetup("approved")
      // PROVE: a human just approved this change — if it recovers wasted spend,
      // tick the OS ledger (waste recovered) for the client under management.
      const waste = rec.proposed_change?.["waste_cents_monthly"]
      if (typeof waste === "number") recordWasteRecovered(waste, `approved for ${getActiveTheme().business}`)
      return { ok: true as const, id, verdict: rec.gate_verdict, reason: rec.gate_reason }
    } catch (err) {
      return fail(400, { error: err instanceof Error ? err.message : "Approve failed" })
    }
  },

  dismiss: async ({ request }) => {
    const form = await request.formData()
    const id = String(form.get("id") ?? "")
    try {
      dismissRecommendation(id)
      return { ok: true as const, id }
    } catch (err) {
      return fail(400, { error: err instanceof Error ? err.message : "Dismiss failed" })
    }
  },
}
