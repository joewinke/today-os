<script lang="ts">
  import { enhance } from "$app/forms"
  import { invalidateAll } from "$app/navigation"
  import type { SubmitFunction } from "@sveltejs/kit"
  import { PIPELINE_STAGES, type PipelineStage } from "$lib/os/types"
  import type { PageServerData } from "./$types"

  let { data }: { data: PageServerData } = $props()
  const byStage = $derived(
    PIPELINE_STAGES.map((s) => ({ ...s, cards: data.prospects.filter((p) => p.stage === s.key) })),
  )

  const ORDER = PIPELINE_STAGES.map((s) => s.key)
  function nextStage(stage: PipelineStage): PipelineStage | null {
    const i = ORDER.indexOf(stage)
    return i >= 0 && i < ORDER.length - 1 ? ORDER[i + 1] : null
  }

  // The company that just closed — surface the "operate their accounts" seam.
  let justClosed = $state<string | null>(null)

  const submit: SubmitFunction = () => {
    return async ({ result, update }) => {
      if (result.type === "success") {
        const d = result.data as { stage?: string; company?: string } | undefined
        if (d?.stage === "won" && d.company) justClosed = d.company
      }
      await update({ reset: false })
      await invalidateAll()
    }
  }
</script>

<svelte:head>
  <title>Pipeline — Today OS</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-6 sm:px-8 lg:py-10">
  <header class="mb-6">
    <p class="hud text-base-content/50">STAGE 3 · CLOSE</p>
    <h1 class="statement tracking-in-expand mt-2 text-4xl sm:text-5xl">Pipeline</h1>
    <p class="text-base-content/60 mt-2 max-w-2xl text-sm">
      Every scan drops a prospect here. Advance them — and when you hit
      <span class="text-success">Close-won</span>, their ad accounts spawn into RUN, themed to them.
    </p>
  </header>

  {#if justClosed}
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3 border border-success/50 bg-success/5 px-4 py-3">
      <p class="text-sm text-base-content">
        <span class="text-success">★ Closed {justClosed}.</span> Their accounts are now live in RUN.
      </p>
      <a href="/admin" class="hud text-success transition-transform hover:translate-x-1">OPERATE THEIR ACCOUNTS &rarr;</a>
    </div>
  {/if}

  <div class="grid grid-cols-2 gap-px border md:grid-cols-5" style="border-color: var(--color-line); background: var(--color-line)">
    {#each byStage as col (col.key)}
      <section class="bg-base-100 min-h-[18rem]">
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

              {#if p.stage !== "won"}
                <div class="mt-2.5 flex flex-wrap gap-1.5">
                  {#if nextStage(p.stage)}
                    <form method="POST" action="?/move" use:enhance={submit}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="stage" value={nextStage(p.stage)} />
                      <button type="submit" class="hud border border-[var(--color-line)] px-2 py-1 text-base-content/70 transition-colors hover:text-base-content hover:border-base-content/40">
                        ADVANCE &rarr;
                      </button>
                    </form>
                  {/if}
                  <form method="POST" action="?/move" use:enhance={submit}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="stage" value="won" />
                    <button type="submit" class="hud border border-success/50 px-2 py-1 text-success transition-colors hover:bg-success/10">
                      CLOSE-WON ★
                    </button>
                  </form>
                </div>
              {:else}
                <a href="/admin" class="hud mt-2.5 inline-block text-success transition-transform hover:translate-x-1">
                  OPERATE IN RUN &rarr;
                </a>
              {/if}
            </li>
          {/each}
        </ul>
      </section>
    {/each}
  </div>
</div>
