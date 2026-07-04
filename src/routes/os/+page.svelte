<script lang="ts">
  import { reveal } from "$lib/actions/reveal"
  import { STAGES } from "$lib/os/stages"
  import { PIPELINE_STAGES } from "$lib/os/types"
  import type { PageServerData } from "./$types"

  let { data }: { data: PageServerData } = $props()

  const kindMark: Record<string, string> = {
    scan: "◇",
    pitch: "▷",
    reply: "◂",
    meeting: "◆",
    sweep: "↻",
    gate: "▮",
    won: "★",
    render: "◹",
    system: "·",
  }

  function stageLabel(key: string): string {
    return PIPELINE_STAGES.find((s) => s.key === key)?.label ?? key
  }

  // First-run "Get set up" checklist — items check off from real store actions.
  const SETUP_STEPS = [
    { key: "scanned", label: "Scan your first site", href: "/funnel-score" },
    { key: "queued", label: "Queue a prospect", href: "/os/pipeline" },
    { key: "swept", label: "Run a sweep", href: "/admin" },
    { key: "approved", label: "Approve a fix", href: "/admin/inbox" },
  ] as const
  const setupDone = $derived(SETUP_STEPS.filter((s) => data.setup[s.key]).length)
  let dismissed = $state(false)
  $effect(() => {
    try {
      dismissed = localStorage.getItem("todayos-setup-dismissed") === "1"
    } catch {
      dismissed = false
    }
  })
  const showSetup = $derived(!dismissed && setupDone < SETUP_STEPS.length)
  function dismissSetup() {
    dismissed = true
    try {
      localStorage.setItem("todayos-setup-dismissed", "1")
    } catch {
      /* ignore */
    }
  }
</script>

<svelte:head>
  <title>Dashboard — Today OS</title>
  <meta name="description" content="The operating dashboard for a performance-marketing firm." />
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-6 sm:px-8 lg:py-10">
  <!-- Header -->
  <header class="flex flex-wrap items-end justify-between gap-4">
    <div>
      <p class="hud text-base-content/50">TODAY OS · OPERATING DASHBOARD</p>
      <h1 class="statement tracking-in-expand mt-2 text-4xl sm:text-5xl">Good morning, Matt.</h1>
      <p class="text-base-content/70 mt-3 max-w-xl text-sm leading-relaxed">
        You've seen the client side — the landing pages, the score. This is the seat It's Today Media
        operates from. Here's what the machine did overnight.
      </p>
    </div>
    <a
      href="/funnel-score"
      class="btn btn-primary rounded-none px-6 font-mono text-sm tracking-[0.08em] uppercase"
    >
      Scan a prospect &rarr;
    </a>
  </header>

  <!-- First-run onboarding checklist (dismissible; checks off from real actions) -->
  {#if showSetup}
    <section class="mt-6 border" style="border-color: var(--color-line)">
      <div class="flex items-center justify-between border-b px-4 py-2.5" style="border-color: var(--color-line)">
        <span class="hud text-primary">GET SET UP · {setupDone}/{SETUP_STEPS.length}</span>
        <button
          type="button"
          onclick={dismissSetup}
          aria-label="Dismiss setup checklist"
          class="hud text-base-content/40 hover:text-base-content transition-colors"
        >
          DISMISS ✕
        </button>
      </div>
      <ul class="grid grid-cols-1 divide-y sm:grid-cols-2 sm:divide-y-0" style="border-color: var(--color-line)">
        {#each SETUP_STEPS as step, i (step.key)}
          {@const done = data.setup[step.key]}
          <li class="border-[var(--color-line)] {i % 2 === 0 ? 'sm:border-r' : ''} {i < 2 ? 'sm:border-b' : ''}">
            <a href={step.href} class="hover:bg-base-200 flex items-center gap-3 px-4 py-3 transition-colors">
              <span class="grid h-5 w-5 shrink-0 place-items-center border {done ? 'border-success text-success' : 'border-line text-base-content/30'}">
                {done ? "✓" : ""}
              </span>
              <span class="text-sm {done ? 'text-base-content/45 line-through' : 'text-base-content'}">{step.label}</span>
              {#if !done}<span class="hud text-primary ml-auto">START &rarr;</span>{/if}
            </a>
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  <!-- Operating numbers -->
  <section class="mt-8 grid grid-cols-2 gap-px border md:grid-cols-5" style="border-color: var(--color-line); background: var(--color-line)" aria-label="Operating numbers">
    {#each data.metrics as m, i (m.key)}
      <div class="bg-base-100 p-4 sm:p-5" use:reveal={{ animation: "scale-in-center", delay: i * 0.06 }}>
        <p class="hud text-base-content/50 leading-tight">{m.label}</p>
        <p class="statement mt-2 text-3xl sm:text-4xl">{m.value}</p>
        {#if m.sub}<p class="hud text-base-content/35 mt-1">{m.sub}</p>{/if}
      </div>
    {/each}
  </section>

  <div class="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
    <!-- Pipeline preview -->
    <section class="border" style="border-color: var(--color-line)" use:reveal>
      <div class="hud flex items-center justify-between border-b px-4 py-2.5" style="border-color: var(--color-line)">
        <span>PIPELINE</span>
        <a href="/os/pipeline" class="text-primary transition-transform hover:translate-x-1">OPEN BOARD &rarr;</a>
      </div>
      <ul class="divide-y" style="border-color: var(--color-line)">
        {#each data.prospects as p (p.id)}
          <li class="flex items-center justify-between gap-3 px-4 py-3">
            <div class="min-w-0">
              <p class="truncate text-sm text-base-content">{p.company}</p>
              <p class="hud text-base-content/45">{p.city} · {p.vertical}</p>
            </div>
            <div class="flex shrink-0 items-center gap-3">
              {#if p.score != null}
                <span class="hud tabular-nums {p.score >= 70 ? 'text-success' : p.score >= 50 ? 'text-warning' : 'text-error'}">{p.score}</span>
              {/if}
              <span class="hud {p.stage === 'won' ? 'text-success' : 'text-base-content/60'} w-24 text-right">{stageLabel(p.stage)}</span>
            </div>
          </li>
        {/each}
      </ul>
    </section>

    <!-- Activity feed: the OS heartbeat -->
    <section class="border" style="border-color: var(--color-line)" use:reveal={{ delay: 0.1 }}>
      <div class="hud flex items-center justify-between border-b px-4 py-2.5" style="border-color: var(--color-line)">
        <span>ACTIVITY</span>
        <span class="text-base-content/35 flex items-center gap-1.5"><span class="live-dot"></span>LIVE</span>
      </div>
      <ul class="divide-y" style="border-color: var(--color-line)">
        {#each data.activity as a (a.id)}
          <li class="flex gap-3 px-4 py-2.5">
            <span class="text-primary/70 mt-0.5 shrink-0 font-mono text-xs">{kindMark[a.kind] ?? "·"}</span>
            <div class="min-w-0">
              <p class="text-[13px] leading-snug text-base-content/80">{a.text}</p>
              <p class="hud text-base-content/35 mt-0.5">{a.ago}</p>
            </div>
          </li>
        {/each}
      </ul>
    </section>
  </div>

  <!-- Stage shortcuts -->
  <section class="mt-6 grid grid-cols-2 gap-px border sm:grid-cols-3 lg:grid-cols-5" style="border-color: var(--color-line); background: var(--color-line)">
    {#each STAGES as stage, i (stage.key)}
      <a href={stage.href} class="bg-base-100 group p-4 transition-colors hover:bg-base-200" use:reveal={{ animation: "fade-in", delay: i * 0.05 }}>
        <p class="hud text-primary">{i + 1} · {stage.label}</p>
        <p class="mt-1 text-[12px] leading-tight text-base-content/55">{stage.blurb}</p>
        <p class="hud text-base-content/30 mt-2 transition-transform group-hover:translate-x-1">OPEN &rarr;</p>
      </a>
    {/each}
  </section>
</div>
