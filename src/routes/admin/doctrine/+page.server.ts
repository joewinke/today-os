import { fail } from "@sveltejs/kit"
import { DOCTRINE, PROVIDER_LABELS } from "$lib/adops/doctrine"
import { renderDoctrineHtml } from "$lib/adops/ui"
import { PROVIDERS, type Provider } from "$lib/adops/types"
import {
  getEffectiveDoctrine,
  hasDoctrineOverride,
  setDoctrineOverride,
  clearDoctrineOverride,
} from "$lib/adops/doctrineOverride"
import { parseRedFlags } from "$lib/adops/doctrine/redflagParser"

import type { Actions, PageServerLoad } from "./$types"

const PROVIDER_SET = new Set<string>(PROVIDERS)

export const load: PageServerLoad = async () => {
  return {
    docs: PROVIDERS.map((provider) => {
      const source = getEffectiveDoctrine(provider) // override for this session, else default
      return {
        provider,
        label: PROVIDER_LABELS[provider],
        // Rendered from the EFFECTIVE text so an active override is what the page shows.
        html: renderDoctrineHtml(source),
        // Raw markdown seeds the edit textarea; the shipped default backs "reset".
        markdown: source,
        defaultMarkdown: DOCTRINE[provider],
        redFlagCount: (source.match(/^- `/gm) ?? []).length,
        overridden: hasDoctrineOverride(provider),
      }
    }),
  }
}

export const actions: Actions = {
  // Persist a sandbox override for this session. The doctrine still renders even if
  // a rule is malformed — parse errors are surfaced honestly in the editor, and the
  // sweep resolver falls back to the default threshold for anything it can't read.
  save: async ({ request }) => {
    const form = await request.formData()
    const provider = String(form.get("provider") ?? "")
    const markdown = String(form.get("markdown") ?? "")
    if (!PROVIDER_SET.has(provider)) return fail(400, { error: `Unknown provider: ${provider}` })
    if (!markdown.trim()) {
      return fail(400, { error: "Doctrine can't be empty — use Reset to restore the default instead." })
    }
    setDoctrineOverride(provider as Provider, markdown)
    const parsed = parseRedFlags(markdown)
    return {
      ok: true as const,
      action: "save" as const,
      provider,
      rules: parsed.rules.length,
      errors: parsed.errors.length,
    }
  },

  // Drop this session's override for one provider — back to the shipped doctrine.
  reset: async ({ request }) => {
    const form = await request.formData()
    const provider = String(form.get("provider") ?? "")
    if (!PROVIDER_SET.has(provider)) return fail(400, { error: `Unknown provider: ${provider}` })
    clearDoctrineOverride(provider as Provider)
    return { ok: true as const, action: "reset" as const, provider }
  },
}
