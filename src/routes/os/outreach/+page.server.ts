import { fail } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"
import { getProspects } from "$lib/os/store"
import { sendPitch, slugify } from "$lib/os/outreach"

export const load: PageServerLoad = async () => {
  // The whole pipeline is the outreach queue; the page groups it by how far each
  // prospect has moved (still to pitch → already contacted → won/meeting).
  return {
    prospects: getProspects().map((p) => ({ ...p, slug: slugify(p.company) })),
  }
}

export const actions: Actions = {
  // SEND seam — advances the stage + logs a pitch activity via the store.
  // "SANDBOX SEND — CONNECTS TO YOUR ESP WHEN LIVE": here it moves the sandbox
  // state; the page then schedules clearly-SANDBOX open/watch signals client-side.
  send: async ({ request }) => {
    const form = await request.formData()
    const id = String(form.get("id") ?? "").trim()
    if (!id) return fail(400, { error: "Missing prospect id." })
    const p = sendPitch(id)
    if (!p) return fail(404, { error: "That prospect is no longer in the pipeline." })
    return { sent: p.id, company: p.company }
  },
}
