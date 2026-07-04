<script lang="ts">
  import { enhance } from "$app/forms"
  import { onDestroy } from "svelte"
  import { reveal } from "$lib/actions/reveal"
  import type { PageServerData } from "./$types"

  let { data }: { data: PageServerData } = $props()

  const SAMPLES = ["/video/samples/rooftops.mp4", "/video/samples/crew.mp4", "/video/samples/signing.mp4"]

  // Prospects still worth pitching sit at the top; already-advanced ones drop below.
  const RANK: Record<string, number> = { new: 0, queued: 1, contacted: 2, meeting: 3, won: 4 }
  const queue = $derived([...data.prospects].sort((a, b) => (RANK[a.stage] ?? 9) - (RANK[b.stage] ?? 9)))

  function scoreClass(score: number): string {
    return score >= 70 ? "text-success" : score >= 50 ? "text-warning" : "text-error"
  }

  function stageLabel(stage: string): string {
    return stage === "won" ? "Closed-won" : stage.charAt(0).toUpperCase() + stage.slice(1)
  }

  /** Token-templated pitch — deterministic, no model call. */
  function composePitch(p: (typeof data.prospects)[number]): { subject: string; body: string } {
    const scored = p.score != null ? `${p.score}/100` : "—"
    const subject =
      p.score != null
        ? `${p.company}: your funnel scored ${scored} — here's the fix`
        : `A quick funnel idea for ${p.company}`
    const body = `Hi ${p.company} team,

We ran ${p.company}'s ${p.vertical} funnel through Today OS and scored it ${scored}${p.city ? ` against other ${p.city} advertisers` : ""}. Short version: there's budget leaking that ${p.offer} would recover.

I recorded a 90-second teardown showing exactly where — and put your numbers on a page you can open in one tap:

  → /p/${p.slug}

If it's useful, grab a 15-minute call right from that page and we'll walk it live.

— The Today OS desk`
    return { subject, body }
  }

  // ── SIMULATED post-send signals: clearly labeled, client-only, cleaned up ──
  type Sim = { id: string; label: string }
  let sims = $state<Record<string, Sim[]>>({})
  const timers: ReturnType<typeof setTimeout>[] = []

  /** Runs from the enhance success callback (browser only ⇒ SSR-safe by construction). */
  function scheduleSimulated(pid: string): void {
    sims[pid] = []
    const steps = [
      { delay: 1400, label: "SIMULATED · EMAIL OPENED" },
      { delay: 3800, label: "SIMULATED · VIDEO WATCHED 60%" },
    ]
    for (const s of steps) {
      const t = setTimeout(() => {
        sims[pid] = [...(sims[pid] ?? []), { id: `${pid}-${s.delay}`, label: s.label }]
      }, s.delay)
      timers.push(t)
    }
  }

  onDestroy(() => {
    for (const t of timers) clearTimeout(t)
  })
</script>

<svelte:head>
  <title>Outreach — Today OS</title>
  <meta name="description" content="Compose and send a personalized pitch to every scanned prospect." />
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-6 sm:px-8 lg:py-10">
  <header class="mb-6">
    <p class="hud text-base-content/50">STAGE 2 · PITCH</p>
    <h1 class="statement tracking-in-expand mt-2 text-4xl sm:text-5xl">Outreach</h1>
    <p class="text-base-content/60 mt-2 max-w-2xl text-sm">
      Every scanned prospect gets a personalized pitch — email copy from their own score, a rendered
      teardown video, and a landing page with their numbers on it. Send is the seam:
      <span class="text-base-content/80">it connects to your ESP in production.</span>
    </p>
  </header>

  {#if queue.length === 0}
    <div class="border-line border p-8 text-center">
      <p class="hud text-base-content/50">NO PROSPECTS YET</p>
      <p class="text-base-content/70 mt-2 text-sm">
        Scan a site in <a href="/funnel-score" class="text-primary underline-offset-2 hover:underline">FIND</a>
        and it drops here to pitch.
      </p>
    </div>
  {/if}

  <div class="flex flex-col gap-px" style="background: var(--color-line)">
    {#each queue as p, i (p.id)}
      {@const pitch = composePitch(p)}
      {@const sent = (sims[p.id]?.length ?? 0) > 0 || (RANK[p.stage] ?? 0) >= RANK.contacted}
      <article class="bg-base-100 p-4 sm:p-5" use:reveal={{ animation: "fade-in", delay: Math.min(i, 6) * 0.05 }}>
        <!-- Prospect header -->
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="min-w-0">
            <h2 class="truncate text-lg text-base-content">{p.company}</h2>
            <p class="hud text-base-content/45 mt-0.5">{p.city} · {p.vertical}</p>
          </div>
          <div class="flex shrink-0 items-center gap-3">
            {#if p.score != null}
              <span class="hud tabular-nums {scoreClass(p.score)}">SCORE {p.score}</span>
            {/if}
            <span class="hud {p.stage === 'won' ? 'text-success' : p.stage === 'new' ? 'text-base-content/50' : 'text-primary'}">
              {stageLabel(p.stage)}
            </span>
          </div>
        </div>

        <div class="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <!-- Composed email -->
          <div class="border-line border">
            <div class="hud border-line text-base-content/50 border-b px-3 py-2">DRAFT · PERSONALIZED EMAIL</div>
            <div class="px-3 py-3">
              <p class="text-base-content text-sm font-medium">{pitch.subject}</p>
              <p class="text-base-content/70 mt-2 font-mono text-[12px] leading-relaxed whitespace-pre-wrap">{pitch.body}</p>
            </div>
          </div>

          <!-- Video slot + actions -->
          <div class="flex flex-col gap-3">
            <figure class="border-line border">
              <video
                class="block aspect-video w-full object-cover"
                src={SAMPLES[i % SAMPLES.length]}
                muted
                loop
                playsinline
                preload="metadata"
                controls
                aria-label="Personalized teardown preview render for {p.company}"
              >
                <track kind="captions" />
              </video>
              <figcaption class="hud border-line text-base-content/45 flex items-center justify-between border-t px-3 py-2">
                <span>PREVIEW RENDER</span>
                <span>SEEDANCE · SILENT</span>
              </figcaption>
            </figure>

            <form
              method="POST"
              action="?/send"
              use:enhance={() => {
                return async ({ result, update }) => {
                  await update({ reset: false })
                  if (result.type === "success" && result.data && "sent" in result.data) {
                    scheduleSimulated(String(result.data.sent))
                  }
                }
              }}
            >
              <input type="hidden" name="id" value={p.id} />
              <button
                type="submit"
                class="btn btn-primary w-full rounded-none font-mono text-sm tracking-[0.08em] uppercase"
              >
                {sent ? "Re-send pitch" : "Send pitch"} &rarr;
              </button>
            </form>
            <p class="hud text-base-content/35 text-center leading-tight">CONNECTS TO YOUR ESP IN PRODUCTION</p>

            <a
              href="/p/{p.slug}"
              class="hud text-base-content/50 hover:text-primary text-center transition-colors"
            >
              VIEW LANDING PAGE &rarr;
            </a>
          </div>
        </div>

        <!-- Post-send SIMULATED signal timeline -->
        {#if sims[p.id]?.length}
          <ul class="border-line mt-3 flex flex-wrap gap-2 border-t pt-3" aria-label="Simulated engagement signals">
            {#each sims[p.id] as sig (sig.id)}
              <li class="hud text-primary/80 border-line border px-2 py-1">◹ {sig.label}</li>
            {/each}
          </ul>
        {/if}
      </article>
    {/each}
  </div>
</div>
