<script lang="ts">
  import GhostPanel from "$lib/ghostpanels/GhostPanel.svelte"
  import type { PageServerData } from "./$types"

  let { data }: { data: PageServerData } = $props()

  const lines = [
    { label: "Monthly retainer", value: "$1,800" },
    { label: "8% of managed ad spend", value: "$1,240" },
  ]
</script>

<GhostPanel
  eyebrow="OPERATIONS · BILLING"
  title="Billing"
  intent="Billing pairs a flat retainer with a percentage of managed spend, and every invoice cites the same ledger PROVE runs from — the client sees the recovered-waste number before they ever see a line item."
  seam="Numbers below are a mock invoice, not a real billing run — Stripe wiring and per-client invoice generation are the next build."
>
  <div class="hud border-line flex items-center justify-between border-b px-5 py-2.5 sm:px-6">
    <span>INVOICE · DRAFT</span>
    <span class="text-base-content/35">HARBOR POINT DENTAL</span>
  </div>
  <div class="divide-line divide-y">
    {#each lines as l (l.label)}
      <div class="flex items-center justify-between px-5 py-3 sm:px-6">
        <p class="text-base-content/80 text-sm">{l.label}</p>
        <p class="statement text-base">{l.value}</p>
      </div>
    {/each}
    <div class="flex items-center justify-between gap-3 px-5 py-3 sm:px-6">
      <p class="hud text-base-content/50">Your invoice cites the ledger — {data.waste} recovered this month</p>
      <a href="/os/prove" class="hud text-primary shrink-0 transition-transform hover:translate-x-1">PROVE &rarr;</a>
    </div>
  </div>
</GhostPanel>
