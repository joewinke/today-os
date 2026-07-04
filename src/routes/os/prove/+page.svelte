<script lang="ts">
  import type { PageServerData } from "./$types"

  let { data }: { data: PageServerData } = $props()
  const waste = $derived(data.metrics.find((m) => m.key === "waste"))
</script>

<svelte:head>
  <title>Prove — Today OS</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-6 sm:px-8 lg:py-10">
  <header class="mb-6">
    <p class="hud text-base-content/50">STAGE 5 · PROVE</p>
    <h1 class="statement tracking-in-expand mt-2 text-4xl sm:text-5xl">The result, in dollars.</h1>
    <p class="text-base-content/60 mt-2 max-w-2xl text-sm">
      Every approved change lands in the ledger. When you approve a pause in RUN, the waste it
      recovers ticks up here — and a client-facing monthly report is generated from the same numbers.
      (The live ledger + report page land in a later build; this is the running total.)
    </p>
  </header>

  <div class="border p-6 sm:p-8" style="border-color: var(--color-line)">
    <p class="hud text-base-content/50">WASTE RECOVERED · THIS MONTH</p>
    <p class="statement mt-3 text-6xl text-success sm:text-7xl">{waste?.value ?? "$0"}</p>
    <p class="text-base-content/50 mt-3 text-sm">across accounts under management, net of approved pauses and reallocations.</p>
  </div>
</div>
