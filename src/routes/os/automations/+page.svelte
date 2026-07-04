<script lang="ts">
  import GhostPanel from "$lib/ghostpanels/GhostPanel.svelte"
  import { GATE_BADGE_CLASS } from "$lib/adops/ui"

  const rules = [
    { text: "Pause anything at 2x CPA cap for 7 days", verdict: "manual_review" },
    { text: "Reallocate spend off a 0-conversion ad set after 3 days", verdict: "eligible" },
    { text: "Kill a keyword below a 0.10 quality score", verdict: "blocked" },
  ] as const
</script>

<GhostPanel
  eyebrow="OPERATIONS · AUTOMATIONS"
  title="Automations"
  intent="Rules that act between approvals — the overnight sweep already flags these in RUN. Automations closes the loop by acting on whatever your policy clears, and holding the rest for review."
  seam="These rows mirror RUN's gate verdicts but don't act on anything yet — the rule engine and per-client approval policy are the next build."
>
  <div class="hud border-line flex items-center justify-between border-b px-5 py-2.5 sm:px-6">
    <span>RULES</span>
    <span class="text-base-content/35 tabular-nums">{rules.length} queued</span>
  </div>
  <ul class="divide-line divide-y">
    {#each rules as r (r.text)}
      <li class="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6">
        <p class="text-base-content/80 max-w-md text-sm leading-relaxed">
          {r.text} — pending your approval policy.
        </p>
        <span
          class="badge badge-outline badge-xs font-mono {GATE_BADGE_CLASS[r.verdict]} shrink-0 tracking-[0.08em]"
        >
          {r.verdict.toUpperCase().replace("_", " ")}
        </span>
      </li>
    {/each}
  </ul>
</GhostPanel>
