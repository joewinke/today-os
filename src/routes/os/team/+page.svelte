<script lang="ts">
  import GhostPanel from "$lib/ghostpanels/GhostPanel.svelte"

  const roles = [
    { role: "Operator", approves: "Any risk tier, any account", member: "Matt R." },
    { role: "Analyst", approves: "Low- and medium-risk pauses only", member: "Dana K." },
    { role: "Client-viewer", approves: "View only — no approvals", member: "Harbor Point Dental" },
  ]
</script>

<GhostPanel
  eyebrow="OPERATIONS · TEAM"
  title="Team"
  intent="Three roles, one approval chain: an Operator clears anything, an Analyst clears low- and medium-risk pauses, and a Client-viewer watches the ledger without touching a gate."
  seam="Roles below are illustrative — real seats, invites, and per-account risk-tier assignment are the next build."
>
  <div class="hud border-line flex items-center justify-between border-b px-5 py-2.5 sm:px-6">
    <span>ROLES</span>
    <span class="text-base-content/35 tabular-nums">{roles.length}</span>
  </div>
  <ul class="divide-line divide-y">
    {#each roles as r (r.role)}
      <li class="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
        <div class="min-w-0">
          <p class="statement text-lg">{r.role}</p>
          <p class="text-base-content/55 mt-1 text-sm">{r.approves}</p>
        </div>
        <span class="hud text-base-content/40 shrink-0">{r.member}</span>
      </li>
    {/each}
  </ul>
</GhostPanel>
