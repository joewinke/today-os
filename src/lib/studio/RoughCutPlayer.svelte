<script lang="ts">
  /**
   * ROUGH CUT · ANIMATIC — a self-contained preview player.
   *
   * Plays through the KEPT segments of the edit in order so a viewer can
   * experience the whole ~90s ad once:
   *   · a segment with an attached b-roll clip plays that video full-length;
   *   · every other kept segment shows a timed title card (beat, transcript,
   *     camera, caption) in the instrument aesthetic.
   *
   * Honest about scope: this is an animatic, not the render — the finished
   * MP4 comes out of the (out-of-scope) render farm.
   */
  import { fmtDur, segDur, type Seg } from "./edl"
  import { CAM_META } from "./fixtures"
  import type { BrollAttachment } from "./broll"

  interface Props {
    open: boolean
    segs: Seg[]
    broll: Record<number, BrollAttachment>
    onClose: () => void
  }

  let { open = $bindable(), segs, broll, onClose }: Props = $props()

  // Title cards are capped so the preview isn't tedious; real clips run full.
  const CARD_CAP = 2.5

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

  const kept = $derived(segs.filter((s) => s.keep))

  let index = $state(0)
  let playing = $state(false)
  let finished = $state(false)

  // Per-segment progress
  let cardElapsed = $state(0) // seconds elapsed on the current title card
  let videoTime = $state(0)
  let videoDur = $state(0)
  let videoEl = $state<HTMLVideoElement | null>(null)
  let dialogEl = $state<HTMLDivElement | null>(null)

  const current = $derived(kept[index] as Seg | undefined)
  const currentBroll = $derived(current ? broll[current.idx] : undefined)
  const isVideo = $derived(!!currentBroll)
  const cardDuration = $derived(
    current ? Math.min(current.end - current.start, CARD_CAP) : CARD_CAP,
  )

  // Estimated play length of a segment, for the running clock.
  function estPlay(s: Seg): number {
    if (broll[s.idx]) return 3.5 // sample clips run ~a few seconds
    return Math.min(s.end - s.start, CARD_CAP)
  }

  const segProgress = $derived(
    isVideo
      ? videoDur > 0
        ? Math.min(1, videoTime / videoDur)
        : 0
      : cardDuration > 0
        ? Math.min(1, cardElapsed / cardDuration)
        : 0,
  )

  const clock = $derived(
    kept.slice(0, index).reduce((a, s) => a + estPlay(s), 0) +
      (isVideo ? videoTime : cardElapsed),
  )

  function resetSeg() {
    cardElapsed = 0
    videoTime = 0
    videoDur = 0
  }

  function advance() {
    if (index < kept.length - 1) {
      index++
      resetSeg()
    } else {
      playing = false
      finished = true
    }
  }

  function prev() {
    if (index > 0) {
      index--
      resetSeg()
      finished = false
    }
  }

  function next() {
    if (finished) return
    advance()
  }

  function togglePlay() {
    if (finished) {
      restart()
      return
    }
    playing = !playing
  }

  function restart() {
    index = 0
    resetSeg()
    finished = false
    playing = !reduceMotion
  }

  function close() {
    playing = false
    onClose()
  }

  // On open: reset and (unless reduced motion) auto-play from the top.
  $effect(() => {
    if (open) {
      index = 0
      resetSeg()
      finished = false
      playing = !reduceMotion
      queueMicrotask(() => dialogEl?.focus())
    } else {
      playing = false
    }
  })

  // Auto-advance title cards (skipped for video segments and reduced motion).
  $effect(() => {
    // deps
    void open
    void playing
    void index
    void isVideo
    if (!open || !playing || isVideo || reduceMotion || finished) return
    let raf = 0
    const base = performance.now() - cardElapsed * 1000
    const loop = () => {
      const e = (performance.now() - base) / 1000
      cardElapsed = e
      if (e >= cardDuration) {
        advance()
        return
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  })

  // Drive the <video> element from the play/pause state.
  $effect(() => {
    void playing
    void isVideo
    void index
    const v = videoEl
    if (!v) return
    if (open && playing && isVideo) {
      v.play().catch(() => {})
    } else {
      v.pause()
    }
  })

  function onKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault()
      close()
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      next()
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      prev()
    } else if (e.key === " " || e.key === "k") {
      e.preventDefault()
      togglePlay()
    }
  }
</script>

{#if open}
  <!-- backdrop -->
  <div
    class="rc-backdrop fade-in fixed inset-0 z-[200] flex items-center justify-center p-4"
    role="presentation"
    onclick={(e) => {
      if (e.target === e.currentTarget) close()
    }}
  >
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div
      bind:this={dialogEl}
      class="scale-in-center flex max-h-[92vh] w-full max-w-3xl flex-col border border-[var(--color-line)] bg-base-200 shadow-2xl"
      role="dialog"
      aria-modal="true"
      aria-label="Rough cut animatic preview"
      tabindex="-1"
      onkeydown={onKeydown}
    >
      <!-- header -->
      <div class="flex items-center justify-between gap-2 border-b border-[var(--color-line)] px-4 py-2.5">
        <div class="flex min-w-0 flex-col">
          <span class="hud text-primary">ROUGH CUT · ANIMATIC</span>
          <span class="hud normal-case text-base-content/50" style="letter-spacing:0.02em">
            the render farm produces the finished MP4 (out of scope here)
          </span>
        </div>
        <button
          type="button"
          class="hud shrink-0 cursor-pointer border border-[var(--color-line)] px-2 py-1 transition-colors hover:border-error hover:text-error"
          aria-label="Close preview"
          onclick={close}
        >CLOSE ✕</button>
      </div>

      <!-- stage -->
      <div class="rc-stage relative flex min-h-[16rem] flex-1 items-center justify-center overflow-hidden bg-base-300">
        {#if current}
          {#if isVideo && currentBroll}
            <!-- attached b-roll: play the clip full-length -->
            <video
              bind:this={videoEl}
              src={currentBroll.url}
              muted
              playsinline
              preload="metadata"
              class="max-h-[52vh] w-full bg-base-300 object-contain"
              aria-label="B-roll clip for {current.beat} segment"
              onloadedmetadata={(e) => (videoDur = (e.currentTarget as HTMLVideoElement).duration || 0)}
              ontimeupdate={(e) => (videoTime = (e.currentTarget as HTMLVideoElement).currentTime)}
              onended={advance}
            >
              <track kind="captions" label="silent b-roll" />
            </video>
            <span class="hud absolute top-3 left-3 border border-info/60 px-1.5 py-0.5 text-info">
              GEN B-ROLL · {CAM_META[current.cam]?.label ?? current.cam}
            </span>
          {:else}
            <!-- title card -->
            <div class="rc-card flex w-full flex-col gap-4 px-6 py-8 sm:px-10">
              <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
                <span class="hud text-primary">{current.beat}</span>
                <span
                  class="hud border px-1.5 py-0.5"
                  style="color:{CAM_META[current.cam]?.color}; border-color:{CAM_META[current.cam]?.color}"
                >{CAM_META[current.cam]?.label ?? current.cam}</span>
                <span class="hud tabular-nums">{current.start.toFixed(1)}–{current.end.toFixed(1)}s</span>
              </div>
              <p class="statement text-2xl leading-tight text-base-content sm:text-3xl" style="text-transform:none">
                {current.text}
              </p>
              {#if current.caption}
                <p class="hud border-l-2 border-primary pl-3 normal-case text-base-content/80" style="letter-spacing:0.02em">
                  CAPTION — {current.caption}
                </p>
              {/if}
            </div>
          {/if}
        {/if}

        {#if finished}
          <div class="rc-end absolute inset-0 flex flex-col items-center justify-center gap-3 bg-base-300/95 px-6 text-center">
            <span class="hud text-primary">END OF ROUGH CUT</span>
            <p class="statement text-xl text-base-content" style="text-transform:none">That's the whole cut.</p>
            <button
              type="button"
              class="hud cursor-pointer border border-primary px-3 py-1.5 text-primary transition-colors hover:bg-primary hover:text-primary-content"
              onclick={restart}
            >▸ REPLAY</button>
          </div>
        {/if}
      </div>

      <!-- progress -->
      <div class="border-t border-[var(--color-line)] px-4 py-2">
        <div class="hud flex items-center justify-between tabular-nums">
          <span>SEGMENT <span class="text-base-content">{Math.min(index + 1, kept.length)}</span>/{kept.length}</span>
          <span>{fmtDur(clock)}</span>
        </div>
        <!-- segment ticks -->
        <div class="mt-1.5 flex gap-0.5" aria-hidden="true">
          {#each kept as k, i (k.idx)}
            <span class="rc-tick relative h-1 flex-1 bg-base-content/15">
              {#if i < index}
                <span class="absolute inset-0 bg-primary"></span>
              {:else if i === index}
                <span class="absolute inset-y-0 left-0 bg-primary" style="width:{Math.round(segProgress * 100)}%"></span>
              {/if}
            </span>
          {/each}
        </div>
      </div>

      <!-- transport controls -->
      <div class="flex items-center justify-center gap-2 border-t border-[var(--color-line)] px-4 py-3">
        <button
          type="button"
          class="hud cursor-pointer border border-[var(--color-line)] px-3 py-1.5 transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous segment"
          disabled={index === 0 && !finished}
          onclick={prev}
        >◂ PREV</button>
        <button
          type="button"
          class="hud cursor-pointer border border-primary px-4 py-1.5 text-primary transition-colors hover:bg-primary hover:text-primary-content"
          aria-label={playing ? "Pause" : finished ? "Replay" : "Play"}
          onclick={togglePlay}
        >{finished ? "▸ REPLAY" : playing ? "❚❚ PAUSE" : "▸ PLAY"}</button>
        <button
          type="button"
          class="hud cursor-pointer border border-[var(--color-line)] px-3 py-1.5 transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next segment"
          disabled={finished}
          onclick={next}
        >NEXT ▸</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .rc-backdrop {
    background: color-mix(in oklch, var(--color-base-100) 82%, transparent);
    backdrop-filter: blur(2px);
  }
</style>
