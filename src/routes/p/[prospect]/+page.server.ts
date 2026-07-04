import type { Actions, PageServerLoad } from "./$types"
import { findProspect, bookMeeting, emitActivity, topFixes, slugify, SAMPLE_PROSPECT } from "$lib/os/outreach"

export const load: PageServerLoad = async ({ params }) => {
  const found = findProspect(params.prospect)
  const prospect = found ?? SAMPLE_PROSPECT
  return {
    prospect,
    isSample: !found,
    slug: found ? slugify(found.company) : "sample",
    fixes: topFixes(prospect),
  }
}

export const actions: Actions = {
  // BOOK seam — "CONNECTS TO YOUR CALENDAR IN PRODUCTION". For a real pipeline
  // prospect it advances the stage to "meeting" and logs a booking; for the
  // sample fallback it still records the intent so the OS heartbeat reflects it.
  book: async ({ request }) => {
    const form = await request.formData()
    const id = String(form.get("id") ?? "").trim()
    const isSample = String(form.get("sample") ?? "") === "1"

    if (isSample || !id) {
      emitActivity("meeting", "A sample landing page requested a 15-min call")
      return { booked: true }
    }

    const p = bookMeeting(id)
    if (!p) {
      emitActivity("meeting", "A prospect requested a 15-min call from their landing page")
      return { booked: true }
    }
    return { booked: true, company: p.company }
  },
}
