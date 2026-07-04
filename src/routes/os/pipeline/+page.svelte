<script lang="ts">
  import { PIPELINE_STAGES } from "$lib/os/types"
  import type { PageServerData } from "./$types"

  let { data }: { data: PageServerData } = $props()
  const byStage = $derived(
    PIPELINE_STAGES.map((s) => ({ ...s, cards: data.prospects.filter((p) => p.stage === s.key) })),
  )
</script>

<svelte:head>
  <title>Pipeline — Today OS</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-6 sm:px-8 lg:py-10">
  <header class="mb-6">
    <p class="hud text-base-content/50">STAGE 3 · CLOSE</p>
    <h1 class="statement tracking-in-expand mt-2 text-4xl sm:text-5xl">Pipeline</h1>
    <p class="text-base-content/60 mt-2 max-w-2xl text-sm">
      Every scan drops a prospect here. Work them from New to Closed-won — and when a deal closes,
      their ad accounts spawn into RUN, themed to them. (The drag + close-hinge lands in the next
      build; this is the live board.)
    </p>
  </header>

  <div class="grid grid-cols-2 gap-px border md:grid-cols-5" style="border-color: var(--color-line); background: var(--color-line)">
    {#each byStage as col (col.key)}
      <section class="bg-base-100 min-h-[16rem]">
        <div class="hud flex items-center justify-between border-b px-3 py-2" style="border-color: var(--color-line)">
          <span class={col.key === "won" ? "text-success" : ""}>{col.label}</span>
          <span class="text-base-content/35 tabular-nums">{col.cards.length}</span>
        </div>
        <ul class="flex flex-col gap-2 p-2">
          {#each col.cards as p (p.id)}
            <li class="border bg-base-200/40 p-2.5" style="border-color: var(--color-line)">
              <p class="truncate text-sm text-base-content">{p.company}</p>
              <p class="hud text-base-content/45 mt-0.5">{p.city}</p>
              <div class="mt-2 flex items-center justify-between">
                {#if p.score != null}
                  <span class="hud tabular-nums {p.score >= 70 ? 'text-success' : p.score >= 50 ? 'text-warning' : 'text-error'}">SCORE {p.score}</span>
                {/if}
                {#if p.spawnedAccounts}<span class="hud text-success">◉ RUNNING</span>{/if}
              </div>
            </li>
          {/each}
        </ul>
      </section>
    {/each}
  </div>
</div>
