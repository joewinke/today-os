import { getActiveTheme } from "$lib/adops/theme"
import type { PageServerLoad } from "./$types"

/**
 * Feed the studio the active demo theme so the ad script re-themes to whatever
 * site a reviewer scanned on /funnel-score. Default (no scan) carries no
 * `script`, so the studio keeps its built-in roofing fixture.
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
