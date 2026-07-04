<script lang="ts">
  import { slugify } from "$lib/os/types"
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

  <!-- Client-facing monthly reports, one per managed account -->
  <section class="mt-6 border" style="border-color: var(--color-line)">
    <div class="hud flex items-center justify-between border-b px-4 py-2.5" style="border-color: var(--color-line)">
      <span>CLIENT REPORTS</span>
      <span class="text-base-content/35 tabular-nums">{data.clients.length}</span>
    </div>
    {#if data.clients.length}
      <ul class="divide-y" style="border-color: var(--color-line)">
        {#each data.clients as c (c.company)}
          <li class="flex items-center justify-between gap-3 px-4 py-3">
            <div class="min-w-0">
              <p class="truncate text-sm text-base-content">{c.company}</p>
              <p class="hud text-base-content/45">{c.city} · {c.vertical}</p>
            </div>
            <a
              href="/report/{slugify(c.company)}"
              class="hud text-primary transition-transform hover:translate-x-1 whitespace-nowrap"
            >
              MONTHLY REPORT &rarr;
            </a>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="hud text-base-content/40 px-4 py-4 normal-case">
        Close a deal on the pipeline board to bring a client under management — their monthly report
        generates here.
      </p>
    {/if}
  </section>
</div>
