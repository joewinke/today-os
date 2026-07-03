import { getActiveTheme } from "$lib/adops/theme"
import type { PageServerLoad } from "./$types"

/**
 * Same active demo theme as the editor. When a scan set one, /studio/batch
 * prepends the scanned business as the preselected variant (row 1).
 */
export const load: PageServerLoad = async () => {
  const t = getActiveTheme()
  return {
    theme: {
      source: t.source,
      domain: t.domain ?? null,
      scannedAt: t.scannedAt ?? null,
      business: t.business,
      vertical: t.vertical,
      city: t.city,
      offer: t.offer,
      script: t.script ?? null,
    },
  }
}
