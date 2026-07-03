import { DOCTRINE, PROVIDER_LABELS } from "$lib/adops/doctrine"
import { renderDoctrineHtml } from "$lib/adops/ui"
import { PROVIDERS } from "$lib/adops/types"

import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async () => {
  return {
    docs: PROVIDERS.map((provider) => ({
      provider,
      label: PROVIDER_LABELS[provider],
      html: renderDoctrineHtml(DOCTRINE[provider]),
      redFlagCount: (DOCTRINE[provider].match(/^- `/gm) ?? []).length,
    })),
  }
}
