<script lang="ts">
  import { clockStamp } from "$lib/adops/ui"
  import type { PageServerData } from "./$types"

  let { data }: { data: PageServerData } = $props()

  const KIND_CLASS: Record<string, string> = {
    seed: "",
    audit: "text-primary",
    sweep: "text-info",
    rec_approved: "text-success",
    rec_dismissed: "text-error",
  }
</script>

<p class="hud mb-2">AUDIT TRAIL</p>
<h1 class="statement text-4xl sm:text-5xl">Log</h1>
<p class="hud mt-3">{data.events.length} EVENTS · NEWEST FIRST · EVERY DECISION LEAVES A RECORD</p>

<div class="mt-8 border font-mono text-xs" style="border-color: var(--color-line)">
  {#each data.events as event (event.id)}
    <div
      class="grid grid-cols-1 gap-x-4 gap-y-0.5 border-b px-4 py-2.5 last:border-b-0 sm:grid-cols-[11.5rem_7rem_9rem_1fr]"
      style="border-color: var(--color-line)"
    >
      <span style="color: var(--color-muted)">{clockStamp(event.at)}</span>
      <span class="uppercase {KIND_CLASS[event.kind] ?? ''}">{event.kind}</span>
      <span class="truncate" style="color: var(--color-muted)">
        {#if event.account_id}
          <a href="/admin/accounts/{event.account_id}" class="hover:text-base-content transition-colors">
            {event.account_name}
          </a>
        {:else}
          —
        {/if}
      </span>
      <span class="leading-relaxed break-words">{event.message}</span>
    </div>
  {:else}
    <div class="px-4 py-8 text-center">
      <span class="hud">NO EVENTS YET</span>
    </div>
  {/each}
</div>
