import { fail } from "@sveltejs/kit"
import type { PageServerLoad, Actions } from "./$types"
import { getProspects, moveProspect } from "$lib/os/store"
import { PIPELINE_STAGES, type PipelineStage } from "$lib/os/types"
import { setThemeFromProspect } from "$lib/adops/theme"
import { rethemeProposed } from "$lib/adops/store"

const STAGE_KEYS = PIPELINE_STAGES.map((s) => s.key) as PipelineStage[]

export const load: PageServerLoad = async () => ({
  prospects: getProspects(),
})

export const actions: Actions = {
  move: async ({ request }) => {
    const data = await request.formData()
    const id = String(data.get("id") ?? "")
    const stage = String(data.get("stage") ?? "") as PipelineStage
    if (!id || !STAGE_KEYS.includes(stage)) return fail(400, { error: "bad move" })

    const p = moveProspect(id, stage)
    if (!p) return fail(404, { error: "no such prospect" })

    // THE HINGE: closing a deal spawns their accounts into RUN — point the
    // active theme at the new client and re-theme the ad-ops recommendations.
    if (stage === "won") {
      setThemeFromProspect({ company: p.company, city: p.city, vertical: p.vertical, offer: p.offer })
      await rethemeProposed()
    }
    return { moved: p.id, stage, company: p.company }
  },
}
