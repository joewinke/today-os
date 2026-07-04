<script lang="ts">
  import GhostPanel from "$lib/ghostpanels/GhostPanel.svelte"

  const platforms = [
    { name: "Google Ads", note: "OAuth grants read+write on campaigns and budgets." },
    { name: "Meta Ads", note: "OAuth grants read+write on campaigns and audiences." },
    { name: "TikTok Ads", note: "OAuth scope covers campaign and creative reporting." },
    { name: "Taboola", note: "No public OAuth — browser agent is the only day-one path." },
  ]
</script>

<GhostPanel
  eyebrow="OPERATIONS · CONNECTIONS"
  title="Connections"
  intent="Every account RUN audits today is a fixture. Connections is where that changes — one OAuth login per platform, and the same live snapshot that seeds RUN's recommendations and PROVE's ledger the moment an account is linked."
  seam="This page shows the shape of the connection layer, not a live integration — RUN and PROVE already run on the fixtures a real account replaces here."
>
  <div class="hud border-line flex items-center justify-between border-b px-5 py-2.5 sm:px-6">
    <span>PLATFORMS</span>
    <span class="text-base-content/35 tabular-nums">{platforms.length}</span>
  </div>
  <ul class="divide-line divide-y">
    {#each platforms as p (p.name)}
      <li class="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6">
        <div class="min-w-0">
          <p class="statement text-lg">{p.name}</p>
          <p class="text-base-content/55 mt-1 max-w-md text-sm leading-relaxed">
            API when it's granted, browser agent on day one when it isn't. {p.note}
          </p>
        </div>
        <span
          class="badge badge-outline badge-xs border-base-content/25 text-base-content/50 shrink-0 font-mono tracking-[0.08em]"
        >
          NOT CONNECTED · OAUTH PLANNED
        </span>
      </li>
    {/each}
  </ul>
</GhostPanel>
