import { fail } from "@sveltejs/kit"
import type { Actions } from "./$types"
import { analyzeUrl } from "$lib/home/funnelChecks"

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData()
    const url = String(data.get("url") ?? "").trim()

    if (!url) {
      return fail(400, { url, error: "Enter a URL to scan." })
    }

    try {
      const report = await analyzeUrl(url)
      return { report, url }
    } catch (e) {
      let message = "Could not reach that URL."
      if (e instanceof TypeError && /URL/i.test(String(e.message))) {
        message = "That does not look like a valid URL."
      } else if (e instanceof DOMException && e.name === "AbortError") {
        message = "Timed out after 15 seconds. The target is too slow or unreachable."
      } else if (e instanceof Error && e.message === "fetch failed") {
        message = "Could not reach that URL. Check the domain and try again."
      } else if (e instanceof Error && e.message) {
        message = e.message
      }
      return fail(422, { url, error: message })
    }
  },
}
