<script lang="ts">
  import { reveal } from "$lib/actions/reveal"
  import {
    CAMERAS,
    camShares,
    fmtDur,
    fxBadges,
    keptDuration,
    rawDuration,
    serializeEdl,
  } from "$lib/studio/edl"
  import {
    CAM_META,
    EFFECTS_BANK,
    fixtureSegs,
    type EffectSuggestion,
  } from "$lib/studio/fixtures"
  import {
    brollPrompt,
    sampleFor,
    type BrollAttachment,
    type BrollJob,
  } from "$lib/studio/broll"
  import EdlPanel from "$lib/studio/EdlPanel.svelte"
  import Timeline from "$lib/studio/Timeline.svelte"

  // ── The session ─────────────────────────────────────────────────────────
  let segs = $state(fixtureSegs())

  const edlText = $derived(serializeEdl(segs))
  const kept = $derived(keptDuration(segs))
  const raw = $derived(rawDuration(segs))
  const cuts = $derived(segs.filter((s) => !s.keep).length)
  const shares = $derived(camShares(segs))

  // ── Keyboard: 1-4 camera, K keep, X cut — on the focused row only ───────
  function rowKeydown(e: KeyboardEvent, s: (typeof segs)[number]) {
    const t = e.target as HTMLElement
    if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || e.ctrlKey || e.metaKey || e.altKey) return
    if (e.key >= "1" && e.key <= "4") {
      s.cam = CAMERAS[Number(e.key) - 1]
      e.preventDefault()
    } else if (e.key === "k" || e.key === "K") {
      s.keep = true
      e.preventDefault()
    } else if (e.key === "x" || e.key === "X") {
      s.keep = false
      e.preventDefault()
    }
  }

  function focusRow(idx: number) {
    const el = document.getElementById(`seg-${idx}`)
    el?.scrollIntoView({ behavior: "smooth", block: "center" })
    el?.focus({ preventScroll: true })
  }

  // ── Auto-effects (LLM lane) ─────────────────────────────────────────────
  let suggestions = $state<EffectSuggestion[]>([])
  let applied = $state<EffectSuggestion[]>([])
  let source = $state<string | null>(null)
  let loading = $state(false)

  async function runAutoEffects() {
    loading = true
    try {
      const res = await fetch("/studio/effects", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          segments: segs
            .filter((s) => s.keep)
            .map((s) => ({ idx: s.idx, beat: s.beat, text: s.text })),
        }),
      })
      const data = await res.json()
      const seen = new Set(applied.map((a) => `${a.segment}:${a.asset}`))
      suggestions = ((data.suggestions ?? []) as EffectSuggestion[]).filter(
        (s) => !seen.has(`${s.segment}:${s.asset}`),
      )
      source = String(data.source ?? "fixture")
    } catch {
      source = "error"
      suggestions = []
    } finally {
      loading = false
    }
  }

  function applySuggestion(sug: EffectSuggestion) {
    if (sug.effect === "zoom") {
      const z = parseFloat(sug.asset.replace(/^z=/, ""))
      const seg = segs.find((s) => s.idx === sug.segment)
      if (seg && z > 1) seg.fx.z = z
    } else {
      applied.push(sug)
    }
    suggestions = suggestions.filter((s) => s.id !== sug.id)
  }

  function rejectSuggestion(sug: EffectSuggestion) {
    suggestions = suggestions.filter((s) => s.id !== sug.id)
  }

  function removeApplied(sug: EffectSuggestion) {
    applied = applied.filter((s) => s.id !== sug.id)
  }

  function playSfx(asset: string) {
    const meta = EFFECTS_BANK.find((e) => e.key === asset)
    if (!meta || meta.kind !== "sfx") return
    new Audio(`/effects/${meta.file}`).play().catch(() => {})
  }

  function previewSuggestion(sug: EffectSuggestion) {
    if (sug.effect === "sfx") playSfx(sug.asset)
  }

  const suggestionsFor = (idx: number) => suggestions.filter((s) => s.segment === idx)
  const appliedFor = (idx: number) => applied.filter((s) => s.segment === idx)

  // ── B-roll generation (Seedance lane) ───────────────────────────────────
  let broll = $state<Record<number, BrollAttachment>>({})
  let brollJobs = $state<Record<number, BrollJob>>({})
  let previewOpen = $state<Record<number, boolean>>({})
  let focusedIdx = $state(-1)
  let now = $state(Date.now())

  const activeJobCount = $derived(
    Object.values(brollJobs).filter((j) => j.status === "queued" || j.status === "generating")
      .length,
  )

  async function generateBroll(s: (typeof segs)[number]) {
    const idx = s.idx
    delete broll[idx]
    previewOpen[idx] = false
    brollJobs[idx] = { status: "queued", startedAt: Date.now() }
    try {
      const res = await fetch("/api/seedance/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          prompt: brollPrompt(s.text),
          durationSecs: Math.round(s.end - s.start),
          aspectRatio: "16:9",
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(String(data.error))
      if (!data.enabled) {
        // No SEEDANCE_API_KEY server-side — attach the deterministic sample.
        delete brollJobs[idx]
        broll[idx] = { url: sampleFor(idx), source: "sample" }
        previewOpen[idx] = true
        return
      }
      brollJobs[idx] = { status: "queued", taskId: data.taskId, startedAt: Date.now() }
    } catch (e) {
      brollJobs[idx] = {
        status: "failed",
        startedAt: Date.now(),
        failedReason: e instanceof Error ? e.message : "request failed",
      }
    }
  }

  async function pollBrollJobs() {
    for (const [key, job] of Object.entries(brollJobs)) {
      if ((job.status !== "queued" && job.status !== "generating") || !job.taskId) continue
      const idx = Number(key)
      try {
        const res = await fetch(`/api/seedance/tasks/${job.taskId}`)
        const data = await res.json()
        if (!data.enabled) {
          // Key vanished mid-flight — degrade to the sample lane.
          delete brollJobs[idx]
          broll[idx] = { url: sampleFor(idx), source: "sample" }
          previewOpen[idx] = true
        } else if (data.status === "completed" && data.videoUrl) {
          delete brollJobs[idx]
          broll[idx] = { url: data.videoUrl, source: "seedance", taskId: job.taskId }
          previewOpen[idx] = true
        } else if (data.status === "failed") {
          brollJobs[idx] = {
            ...job,
            status: "failed",
            failedReason: String(data.failedReason ?? "generation failed"),
          }
        } else if (data.status === "generating" && job.status === "queued") {
          brollJobs[idx] = { ...job, status: "generating" }
        }
      } catch {
        // transient poll error — keep the job, try again next tick
      }
    }
  }

  // Poll active Seedance tasks every 10s — never faster; cleared on destroy.
  $effect(() => {
    if (activeJobCount === 0) return
    const t = setInterval(pollBrollJobs, 10_000)
    return () => clearInterval(t)
  })

  // 1s local ticker for the GENERATING elapsed readout (UI only, not a poll).
  $effect(() => {
    if (activeJobCount === 0) return
    const t = setInterval(() => (now = Date.now()), 1000)
    return () => clearInterval(t)
  })

  const elapsedSecs = (j: BrollJob) => Math.max(0, Math.floor((now - j.startedAt) / 1000))

  const brollSidecar = $derived(
    Object.entries(broll)
      .map(([k, b]) => ({
        segment: Number(k),
        source: b.source,
        url: b.url,
        ...(b.taskId ? { taskId: b.taskId } : {}),
      }))
      .sort((a, b) => a.segment - b.segment),
  )

  const sidecarJson = $derived(
    JSON.stringify(
      {
        effects: applied.map((a) => ({
          id: a.id,
          kind: a.effect,
          asset: a.asset,
          anchor: { segment: a.segment },
        })),
        ...(brollSidecar.length > 0 ? { broll: brollSidecar } : {}),
      },
      null,
      2,
    ),
  )
</script>

<svelte:head>
  <title>Studio — Today OS</title>
  <meta
    name="description"
    content="Edit video like a document. The edit is a plain-text EDL agents can operate on."
  />
</svelte:head>

<div class="blueprint min-h-screen">
  <div class="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:px-8">
    <!-- ── Instrument nav ─────────────────────────────────────────────── -->
    <header class="hud flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-line)] pb-3">
      <span>TODAY OS · STUDIO / EDL-01</span>
      <nav class="flex gap-5">
        <a href="/" class="transition-colors hover:text-primary">INDEX</a>
        <a href="/admin" class="transition-colors hover:text-primary">AD OPS</a>
        <a href="/studio/batch" class="text-primary transition-colors hover:text-base-content">BATCH →</a>
      </nav>
    </header>

    <!-- ── Statement + explainer strip ────────────────────────────────── -->
    <section>
      <h1 class="statement tracking-in-expand text-4xl text-base-content sm:text-6xl">
        Edit video<br />like a document.
      </h1>
      <p class="hud mt-3 max-w-2xl normal-case">
        The edit is data — a plain-text EDL. Agents cut it, score it, and personalize it per lead.
      </p>
    </section>

    <section
      class="grid grid-cols-1 border border-[var(--color-line)] sm:grid-cols-3"
      aria-label="How it works"
      use:reveal={{ animation: "fade-in" }}
    >
      {#each [["01", "RECORD ONCE", "one shoot, three cameras + one generated source"], ["02", "AGENTS CUT & SCORE", "keep/cut, angles, fx — all edits to a text file"], ["03", "GENERATE & PERSONALIZE × N", "seedance mints GEN b-roll per segment; tokens swap per lead — /studio/batch"]] as [num, title, sub] (num)}
        <div class="border-[var(--color-line)] px-4 py-3 not-last:border-b sm:not-last:border-r sm:not-last:border-b-0">
          <span class="hud text-primary">{num}</span>
          <p class="mt-1 font-mono text-xs font-medium tracking-wider text-base-content">{title}</p>
          <p class="hud mt-1 normal-case">{sub}</p>
        </div>
      {/each}
    </section>

    <!-- ── Timeline strip ─────────────────────────────────────────────── -->
    <section aria-label="Timeline">
      <Timeline {segs} onSelect={focusRow} />
    </section>

    <!-- ── Stats readout ──────────────────────────────────────────────── -->
    <section
      class="hud flex flex-wrap items-center gap-x-6 gap-y-2 border border-[var(--color-line)] bg-base-200 px-4 py-2"
      aria-label="Session stats"
    >
      <span class="tabular-nums">KEPT <span class="text-base-content">{fmtDur(kept)}</span> / RAW {fmtDur(raw)}</span>
      <span class="tabular-nums">CUTS <span class="text-base-content">{cuts}</span></span>
      <span class="flex flex-wrap items-center gap-x-4 gap-y-1">
        {#each CAMERAS as cam (cam)}
          {@const pct = Math.round((shares[cam] ?? 0) * 100)}
          <span class="flex items-center gap-1.5">
            <span style="color: {CAM_META[cam].color}">{CAM_META[cam].label}</span>
            <span class="inline-block h-1.5 w-12 bg-base-300">
              <span
                class="block h-full transition-[width] duration-300"
                style="width: {pct}%; background: {CAM_META[cam].color}"
              ></span>
            </span>
            <span class="tabular-nums">{pct}%</span>
          </span>
        {/each}
      </span>
    </section>

    <!-- ── Toolbar ────────────────────────────────────────────────────── -->
    <section class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap items-center gap-3">
        <button
          type="button"
          class="hud cursor-pointer border border-primary px-4 py-2 text-primary transition-colors hover:bg-primary hover:text-primary-content disabled:cursor-wait disabled:opacity-50"
          onclick={runAutoEffects}
          disabled={loading}
        >
          {loading ? "SCORING TRANSCRIPT..." : "AUTO-EFFECTS"}
        </button>
        {#if source}
          <span class="hud" aria-live="polite">
            lane: <span class="text-base-content">{source === "anthropic" ? "CLAUDE LIVE" : source === "fixture" ? "PRECOMPUTED (no API key)" : "ERROR"}</span>
            · {suggestions.length} proposed
          </span>
        {/if}
      </div>
      <p class="hud normal-case">keys on a focused row: <span class="text-base-content">1-4</span> camera · <span class="text-base-content">K</span> keep · <span class="text-base-content">X</span> cut</p>
    </section>

    <!-- ── Main grid: segment list + live EDL ─────────────────────────── -->
    <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,26rem)]">
      <ul class="m-0 flex list-none flex-col gap-2 p-0" aria-label="Segments">
        {#each segs as s, i (s.idx)}
          <li use:reveal={{ animation: "fade-in", delay: Math.min(i * 0.03, 0.4) }}>
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions, a11y_no_noninteractive_tabindex -->
            <div
              id="seg-{s.idx}"
              role="group"
              tabindex="0"
              aria-label="Segment {s.idx + 1}, beat {s.beat}, {s.keep ? 'kept' : 'cut'}"
              class="seg-row border border-[var(--color-line)] bg-base-200 px-3 py-2.5 transition-opacity"
              class:opacity-45={!s.keep}
              onkeydown={(e) => rowKeydown(e, s)}
              onfocusin={() => (focusedIdx = s.idx)}
            >
              <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span class="hud w-14 text-primary">{s.beat}</span>
                <span class="hud tabular-nums">{s.start.toFixed(1)}–{s.end.toFixed(1)}s</span>

                <span class="flex gap-1" role="group" aria-label="Camera for segment {s.idx + 1}">
                  {#each CAMERAS as cam, ci (cam)}
                    <button
                      type="button"
                      class="cam-chip hud cursor-pointer border px-1.5 py-0.5 transition-colors"
                      class:cam-active={s.cam === cam}
                      style="--cc: {CAM_META[cam].color}"
                      aria-pressed={s.cam === cam}
                      title="{ci + 1} — {CAM_META[cam].label}"
                      onclick={() => (s.cam = cam)}
                    >{CAM_META[cam].label}</button>
                  {/each}
                </span>

                <button
                  type="button"
                  class="hud ml-auto cursor-pointer border px-2 py-0.5 transition-colors"
                  class:keep-on={s.keep}
                  class:keep-off={!s.keep}
                  aria-pressed={s.keep}
                  aria-label="Keep segment {s.idx + 1}"
                  title="K keep / X cut"
                  onclick={() => (s.keep = !s.keep)}
                >{s.keep ? "KEEP" : "CUT"}</button>
              </div>

              <p
                class="mt-2 mb-0 max-w-3xl text-sm leading-snug text-base-content/90"
                class:line-through={!s.keep}
                class:text-base-content-50={!s.keep}
              >{s.text}</p>

              <div class="mt-2 flex flex-wrap items-center gap-2">
                {#each fxBadges(s.fx) as badge (badge)}
                  <span class="hud border border-[var(--color-line)] px-1.5 py-0.5">{badge}</span>
                {/each}
                {#each appliedFor(s.idx) as a (a.id)}
                  <span class="hud flex items-center border border-success/60 text-success">
                    <button
                      type="button"
                      class="cursor-pointer px-1.5 py-0.5 text-inherit"
                      title={a.rationale}
                      aria-label="Preview applied effect {a.asset}"
                      onclick={() => previewSuggestion(a)}
                    >+ {a.asset} · {a.effect}</button>
                    <button
                      type="button"
                      class="cursor-pointer border-l border-success/60 px-1.5 py-0.5 text-inherit transition-colors hover:text-error"
                      aria-label="Remove applied effect {a.asset}"
                      onclick={() => removeApplied(a)}
                    >×</button>
                  </span>
                {/each}
                <input
                  class="caption-input hud min-w-32 flex-1 border-b border-transparent bg-transparent py-0.5 transition-colors focus:border-primary focus:outline-none"
                  bind:value={s.caption}
                  placeholder="+ CAPTION"
                  aria-label="Caption for segment {s.idx + 1}"
                />
              </div>

              {#if s.cam === "gen" || focusedIdx === s.idx || broll[s.idx] || brollJobs[s.idx]}
                {@const job = brollJobs[s.idx]}
                {@const att = broll[s.idx]}
                <div class="mt-2 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    class="hud cursor-pointer border border-info/60 px-2 py-0.5 text-info transition-colors hover:bg-info hover:text-info-content disabled:cursor-wait disabled:opacity-50"
                    disabled={!!job && job.status !== "failed"}
                    onclick={() => generateBroll(s)}
                  >{job?.status === "failed" ? "RETRY" : att ? "REGENERATE" : "GENERATE B-ROLL"}</button>

                  <span aria-live="polite" class="contents">
                    {#if job?.status === "queued"}
                      <span class="hud border border-warning/60 px-1.5 py-0.5 text-warning">QUEUED</span>
                    {:else if job?.status === "generating"}
                      <span class="hud border border-warning/60 px-1.5 py-0.5 text-warning tabular-nums">GENERATING · {elapsedSecs(job)}s</span>
                    {:else if job?.status === "failed"}
                      <span class="hud border border-error/60 px-1.5 py-0.5 text-error normal-case">FAILED — {job.failedReason}</span>
                    {:else if att?.source === "sample"}
                      <span class="hud border border-info/60 px-1.5 py-0.5 text-info normal-case">SAMPLE — set SEEDANCE_API_KEY for live generation</span>
                    {:else if att?.source === "seedance"}
                      <span class="hud border border-success/60 px-1.5 py-0.5 text-success">READY</span>
                    {/if}
                  </span>

                  {#if att}
                    <button
                      type="button"
                      class="hud cursor-pointer border border-[var(--color-line)] px-2 py-0.5 transition-colors hover:border-primary hover:text-primary"
                      aria-expanded={!!previewOpen[s.idx]}
                      aria-controls="broll-preview-{s.idx}"
                      onclick={() => (previewOpen[s.idx] = !previewOpen[s.idx])}
                    >{previewOpen[s.idx] ? "HIDE PREVIEW" : "SHOW PREVIEW"}</button>
                  {/if}
                </div>

                {#if att && previewOpen[s.idx]}
                  <div id="broll-preview-{s.idx}" class="mt-2">
                    <!-- Generated clips are silent (generateAudio: false) — empty captions track. -->
                    <video
                      src={att.url}
                      muted
                      playsinline
                      controls
                      preload="metadata"
                      class="w-full max-w-xl border border-[var(--color-line)] bg-base-300"
                      aria-label="B-roll preview for segment {s.idx + 1}"
                    >
                      <track kind="captions" label="silent b-roll" />
                    </video>
                  </div>
                {/if}
              {/if}

              {#each suggestionsFor(s.idx) as sug (sug.id)}
                <div class="mt-2 border border-dashed border-warning/60 px-2.5 py-2">
                  <div class="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      class="hud cursor-pointer border border-warning/60 px-1.5 py-0.5 text-warning"
                      title={sug.effect === "sfx" ? "click to preview sound" : sug.rationale}
                      onclick={() => previewSuggestion(sug)}
                    >? {sug.asset} · {sug.effect}{sug.effect === "sfx" ? " · PLAY" : ""}</button>
                    <span class="ml-auto flex gap-1">
                      <button
                        type="button"
                        class="hud cursor-pointer border border-success/60 px-2 py-0.5 text-success transition-colors hover:bg-success hover:text-success-content"
                        onclick={() => applySuggestion(sug)}
                      >APPLY</button>
                      <button
                        type="button"
                        class="hud cursor-pointer border border-[var(--color-line)] px-2 py-0.5 transition-colors hover:border-error hover:text-error"
                        onclick={() => rejectSuggestion(sug)}
                      >REJECT</button>
                    </span>
                  </div>
                  <p class="hud mt-1.5 mb-0 normal-case">{sug.rationale}</p>
                </div>
              {/each}
            </div>
          </li>
        {/each}
      </ul>

      <div class="flex flex-col gap-4 lg:sticky lg:top-6">
        <div class="max-h-[70vh]">
          <EdlPanel text={edlText} />
        </div>
        {#if applied.length > 0 || brollSidecar.length > 0}
          <div class="border border-[var(--color-line)] bg-base-200">
            <div class="hud border-b border-[var(--color-line)] px-3 py-2">EFFECTS.JSON — SIDECAR ({applied.length + brollSidecar.length})</div>
            <pre class="m-0 overflow-auto px-3 py-2 font-mono text-[0.6875rem] leading-relaxed text-base-content/80">{sidecarJson}</pre>
          </div>
        {/if}
        <p class="hud normal-case">
          this text is the whole edit — copy it, diff it, or hand it to a render agent.
        </p>
      </div>
    </div>
  </div>
</div>

<style>
  .cam-chip {
    border-color: var(--color-line);
    color: var(--color-muted);
    background: transparent;
  }
  .cam-chip:hover {
    border-color: var(--cc);
    color: var(--cc);
  }
  .cam-active {
    border-color: var(--cc);
    color: var(--cc);
    background: color-mix(in oklch, var(--cc) 18%, transparent);
  }
  .keep-on {
    border-color: color-mix(in oklch, var(--color-success) 60%, transparent);
    color: var(--color-success);
    background: transparent;
  }
  .keep-off {
    border-color: color-mix(in oklch, var(--color-error) 60%, transparent);
    color: var(--color-error);
    background: transparent;
  }
  .text-base-content-50 {
    color: color-mix(in oklch, var(--color-base-content) 50%, transparent);
  }
  .seg-row:focus-visible {
    outline: 1px solid var(--color-primary);
    outline-offset: 2px;
  }
</style>
