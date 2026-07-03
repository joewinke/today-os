<script lang="ts">
  import { fmtDur, keptDuration, segDur, type Seg } from "./edl"
  import { CAM_META } from "./fixtures"

  interface Props {
    segs: Seg[]
    onSelect?: (idx: number) => void
  }

  let { segs, onSelect }: Props = $props()

  const total = $derived(keptDuration(segs))

  // Kept blocks scale with output duration; cut takes collapse to slivers.
  function grow(s: Seg): string {
    return s.keep ? `flex:${segDur(s)} 1 0%` : "flex:0 0 0.5rem"
  }

  function beatStart(i: number): boolean {
    return i === 0 || segs[i].beat !== segs[i - 1].beat
  }

  // Program time at which each kept segment starts.
  const starts = $derived.by(() => {
    const map = new Map<number, number>()
    let t = 0
    for (const s of segs) {
      if (!s.keep) continue
      map.set(s.idx, t)
      t += segDur(s)
    }
    return map
  })
</script>

<div class="border border-[var(--color-line)]">
  <div class="flex h-9 w-full bg-base-300" role="group" aria-label="Program timeline">
    {#each segs as s (s.idx)}
      <button
        type="button"
        class="tl-block relative h-full min-w-0 cursor-pointer border-0 p-0"
        class:tl-cut={!s.keep}
        class:tl-beat-start={beatStart(s.idx)}
        style="{grow(s)}; --tl: {CAM_META[s.cam]?.color ?? 'var(--color-primary)'}"
        title={s.keep
          ? `${fmtDur(starts.get(s.idx) ?? 0)} · ${CAM_META[s.cam]?.label ?? s.cam} · ${s.text.slice(0, 70)}`
          : `CUT · ${s.text.slice(0, 70)}`}
        aria-label="Segment {s.idx + 1}, beat {s.beat}, {s.keep ? CAM_META[s.cam]?.label ?? s.cam : 'cut'}"
        onclick={() => onSelect?.(s.idx)}
      ></button>
    {/each}
  </div>
  <div class="hud flex items-center justify-between gap-2 border-t border-[var(--color-line)] px-2 py-1">
    <span class="flex flex-wrap gap-x-3">
      {#each [...new Set(segs.map((s) => s.beat))] as beat (beat)}
        <span>{beat}</span>
      {/each}
    </span>
    <span class="tabular-nums whitespace-nowrap">out {fmtDur(total)}</span>
  </div>
</div>

<style>
  .tl-block {
    background: color-mix(in oklch, var(--tl) 40%, var(--color-base-300));
    transition: background-color 150ms cubic-bezier(0.25, 1, 0.5, 1);
  }
  .tl-block:hover {
    background: color-mix(in oklch, var(--tl) 80%, var(--color-base-300));
  }
  .tl-cut {
    background: var(--color-base-100);
    opacity: 0.55;
  }
  .tl-cut:hover {
    background: var(--color-base-200);
  }
  .tl-beat-start {
    border-left: 1px solid color-mix(in oklch, var(--color-base-content) 40%, transparent);
  }
  @media (prefers-reduced-motion: reduce) {
    .tl-block {
      transition: none;
    }
  }
</style>
