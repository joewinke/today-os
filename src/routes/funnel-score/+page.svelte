<script lang="ts">
  import "$lib/home/home.css"
  import { tick } from "svelte"
  import { enhance } from "$app/forms"
  import { page } from "$app/state"
  import TerminalNav from "$lib/home/TerminalNav.svelte"
  import HudChrome from "$lib/home/HudChrome.svelte"
  import type { ActionData } from "./$types"
  import type { CheckStatus } from "$lib/home/funnelChecks"

  let { form }: { form: ActionData } = $props()

  let scanning = $state(false)
  // Prefill from ?url= (the homepage "scan itstoday.org" deep link) or a prior submit.
  let urlValue = $state(page.url.searchParams.get("url") ?? "")
  let submitEl = $state<HTMLButtonElement | null>(null)

  $effect(() => {
    if (form?.url && !urlValue) urlValue = form.url
  })

  // One-click preset: fill the field and submit, so a judge never has to type.
  // Await a tick so the bound input's DOM value flushes before we click —
  // otherwise the still-empty required field silently blocks the submit.
  async function scanPreset(url: string) {
    urlValue = url
    await tick()
    submitEl?.click()
  }

  const report = $derived(form && "report" in form ? form.report : null)

  const statusText: Record<CheckStatus, string> = {
    pass: "text-success",
    warn: "text-warning",
    fail: "text-error",
  }
  const statusDot: Record<CheckStatus, string> = {
    pass: "bg-success",
    warn: "bg-warning",
    fail: "bg-error",
  }
  const statusWord: Record<CheckStatus, string> = {
    pass: "PASS",
    warn: "WARN",
    fail: "FAIL",
  }

  function hostOf(u: string): string {
    try {
      return new URL(u).host.toUpperCase()
    } catch {
      return u.toUpperCase()
    }
  }
</script>

<svelte:head>
  <title>Funnel Score · It's Today Media</title>
  <meta
    name="description"
    content="Free funnel diagnostic: enter your URL, get a 0-100 Funnel Score from ten deterministic conversion checks, plus what to fix first."
  />
</svelte:head>

<TerminalNav />
<HudChrome />

<main class="blueprint bg-base-100 text-base-content relative min-h-screen px-6 pt-28 pb-24 sm:px-10 lg:px-16">
  <span class="crosshair" style="right: 63px; top: 84px;" aria-hidden="true"></span>

  <header class="mb-12">
    <p class="hud mb-5 flex items-center gap-2">
      <span class="live-dot"></span>
      DIAGNOSTIC · TEN CHECKS · DETERMINISTIC · FREE
    </p>
    <h1 class="statement text-[clamp(3rem,9vw,8rem)]">Funnel<br />Score.</h1>
    <p class="text-base-content/70 mt-6 max-w-xl text-[15px] leading-relaxed">
      Enter a URL. We fetch the page live and grade it on the ten things that decide whether paid
      traffic converts: speed, message, capture, mobile. No account, no email gate.
    </p>
  </header>

  <!-- ============ THE INSTRUMENT ============ -->
  <form
    method="POST"
    class="border-line max-w-3xl border"
    use:enhance={() => {
      scanning = true
      return async ({ update }) => {
        await update()
        scanning = false
      }
    }}
  >
    <div class="flex flex-col sm:flex-row">
      <div class="flex-1 p-5 sm:p-6">
        <label for="url" class="hud mb-2 block">TARGET URL</label>
        <input
          id="url"
          name="url"
          type="text"
          bind:value={urlValue}
          placeholder="https://example.com"
          autocomplete="url"
          spellcheck="false"
          required
          class="text-base-content placeholder:text-base-content/30 w-full border-0 bg-transparent p-0 font-mono text-lg outline-none"
        />
      </div>
      <button
        type="submit"
        bind:this={submitEl}
        disabled={scanning}
        class="btn btn-primary border-line h-auto min-h-16 rounded-none border-0 border-t px-10 font-mono text-sm tracking-[0.08em] uppercase sm:border-t-0 sm:border-l"
      >
        {scanning ? "Scanning" : "Scan"}
      </button>
    </div>
    {#if scanning}
      <div class="border-line relative h-px overflow-hidden border-t" aria-hidden="true">
        <span class="scan-bar bg-primary absolute top-[-1px] left-0 block h-[3px] w-1/4"></span>
      </div>
      <p class="hud border-line border-t px-5 py-3 sm:px-6" role="status">
        FETCHING · PARSING · SCORING — 10 CHECKS · MAX 15S
      </p>
    {/if}
  </form>

  <!-- one-click presets so no one has to type -->
  <div class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
    <span class="hud text-base-content/50">NO URL HANDY?</span>
    <button
      type="button"
      onclick={() => scanPreset("https://www.itstoday.org/")}
      disabled={scanning}
      class="hud text-primary transition-transform hover:translate-x-0.5 disabled:opacity-40"
    >
      SCAN ITSTODAY.ORG &rarr;
    </button>
  </div>

  {#if form?.error}
    <div class="border-error/40 mt-8 max-w-3xl border p-5 sm:p-6" role="alert">
      <p class="hud text-error mb-1">SCAN FAILED</p>
      <p class="text-base-content/80 text-sm leading-relaxed">{form.error}</p>
    </div>
  {/if}

  <!-- ============ THE TEARDOWN ============ -->
  {#if report}
    <section class="mt-20" aria-label="Funnel score results">
      <div class="hud mb-8 flex flex-wrap items-center gap-x-6 gap-y-2">
        <span>TARGET: {hostOf(report.finalUrl)}</span>
        <span>RT {report.responseMs} MS</span>
        <span>{report.weightKb} KB</span>
        <span class="hidden sm:inline">{report.fetchedAt.slice(0, 19).replace("T", " · ")} UTC</span>
      </div>

      <div class="grid items-start gap-12 lg:grid-cols-[minmax(280px,420px)_1fr]">
        <!-- score numeral -->
        <div class="border-line border p-8 lg:sticky lg:top-20">
          <p class="hud mb-4">FUNNEL SCORE / 100</p>
          <p
            class="statement text-[clamp(6rem,18vw,11rem)] leading-none {report.score >= 70
              ? 'text-success'
              : report.score >= 50
                ? 'text-warning'
                : 'text-error'}"
          >
            {report.score}
          </p>
          <p class="hud mt-4">VERDICT: {report.band}</p>
          <div class="bg-line mt-6 h-px w-full" aria-hidden="true">
            <div
              class="h-px {report.score >= 70 ? 'bg-success' : report.score >= 50 ? 'bg-warning' : 'bg-error'}"
              style="width: {report.score}%"
            ></div>
          </div>
        </div>

        <!-- per-check rows -->
        <div>
          <div class="hud border-line grid grid-cols-[1fr_auto_auto] gap-4 border-b pb-3 sm:grid-cols-[1fr_120px_90px_60px]">
            <span>CHECK</span>
            <span class="hidden text-right sm:inline">READING</span>
            <span class="text-right">STATUS</span>
            <span class="text-right">PTS</span>
          </div>
          {#each report.checks as check (check.id)}
            <div
              class="border-line grid grid-cols-[1fr_auto_auto] items-baseline gap-4 border-b py-4 sm:grid-cols-[1fr_120px_90px_60px]"
            >
              <span class="hud text-base-content">{check.label}</span>
              <span class="hud hidden text-right sm:inline">{check.detail}</span>
              <span class="hud flex items-center justify-end gap-2 {statusText[check.status]}">
                <span class="inline-block h-1.5 w-1.5 rounded-full {statusDot[check.status]}"></span>
                {statusWord[check.status]}
              </span>
              <span class="hud text-right">{check.points}/{check.weight}</span>
            </div>
          {/each}

          {#if report.fixFirst.length > 0}
            <div class="mt-12">
              <h2 class="statement mb-6 text-2xl sm:text-3xl">Fix This First</h2>
              <ol class="space-y-4">
                {#each report.fixFirst as fix, i (fix)}
                  <li class="grid grid-cols-[44px_1fr] items-baseline gap-3">
                    <span class="hud">{String(i + 1).padStart(2, "0")}</span>
                    <span class="text-base-content/80 text-sm leading-relaxed">{fix}</span>
                  </li>
                {/each}
              </ol>
            </div>
          {:else}
            <p class="text-base-content/70 mt-12 text-sm leading-relaxed">
              Every check passed. The plumbing is sound; the next gains are in offer and creative.
            </p>
          {/if}

          <!-- ==== HANDOFF: the score is the diagnosis; the OS is the treatment ==== -->
          <div class="border-line mt-14 border-t pt-10">
            <span class="hud text-primary">TOUR STOP 01 COMPLETE · NEXT &rarr; 02</span>
            <h2 class="statement mt-4 mb-3 text-2xl sm:text-3xl">
              The score is the diagnosis.<br />The OS is the treatment.
            </h2>
            <p class="text-base-content/70 mb-8 max-w-lg text-sm leading-relaxed">
              A number tells you the funnel leaks. The console finds the same class of problems
              inside your ad accounts every single day — and proposes the fix, with the evidence,
              behind a human approval gate.
            </p>
            <div class="border-line divide-line divide-y border">
              <a
                href="/admin"
                class="hover:bg-base-200 group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5 p-5 transition-colors sm:p-6"
              >
                <span class="hud text-primary">02</span>
                <span>
                  <span class="statement block text-lg sm:text-xl">Open the Console</span>
                  <span class="text-base-content/60 mt-1 block text-[13px] leading-relaxed">
                    Run a sweep, watch the audit loop propose fixes like these — and watch the gate
                    refuse an unsafe one.
                  </span>
                </span>
                <span class="hud transition-transform group-hover:translate-x-1">&rarr;</span>
              </a>
              <a
                href="/studio"
                class="hover:bg-base-200 group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5 p-5 transition-colors sm:p-6"
              >
                <span class="hud text-base-content/50">03</span>
                <span>
                  <span class="statement block text-lg sm:text-xl">Then Generate the Creative</span>
                  <span class="text-base-content/60 mt-1 block text-[13px] leading-relaxed">
                    Fresh pages need fresh ads. Mint AI b-roll and personalize per lead in the
                    studio.
                  </span>
                </span>
                <span class="hud transition-transform group-hover:translate-x-1">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  {/if}
</main>
