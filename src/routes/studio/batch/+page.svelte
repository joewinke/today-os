<script lang="ts">
  import "$lib/home/home.css"
  import { untrack } from "svelte"
  import { reveal } from "$lib/actions/reveal"
  import {
    fmtDur,
    keptDuration,
    personalizeSegs,
    serializeEdl,
    tokenParts,
  } from "$lib/studio/edl"
  import { applyThemeScript, CAM_META, LEADS, fixtureSegs, leadFromTheme } from "$lib/studio/fixtures"
  import EdlPanel from "$lib/studio/EdlPanel.svelte"
  import type { PageServerData } from "./$types"

  let { data }: { data: PageServerData } = $props()
  const theme = $derived(data.theme)

  function scannedClock(ms: number | null): string {
    if (!ms) return ""
    // Format in America/New_York (ET) to match the site's Baltimore footer clock.
    return new Date(ms).toLocaleTimeString("en-US", {
      timeZone: "America/New_York",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  // Themed script (if a scan set one) overlaid on the fixture — {{city}} is left
  // in place so per-lead token substitution resolves it per row.
  const master = untrack(() => applyThemeScript(fixtureSegs(), data.theme.script))
  const keptMaster = master.filter((s) => s.keep)

  // When scanned, the scanned business is row 1 (preselected) — the payoff:
  // a judge who scanned itstoday.org lands on their own personalized variant.
  const leads = $derived(
    theme.source === "scanned" ? [leadFromTheme(theme), ...LEADS] : LEADS,
  )

  let selected = $state(0)
  const lead = $derived(leads[selected])
  const cut = $derived(personalizeSegs(master, lead))
  const edlText = $derived(serializeEdl(cut))
</script>

<svelte:head>
  <title>Batch — Studio — Today OS</title>
  <meta name="description" content="One shoot, N personalized video variants from a leads CSV." />
</svelte:head>

<div class="blueprint min-h-screen">
  <div class="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:px-8">
    <header class="hud flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-line)] pb-3">
      <span>TODAY OS · STUDIO / BATCH-01</span>
      <span class="text-base-content/40" aria-hidden="true">STOP 3 · PERSONALIZE</span>
    </header>

    <section>
      {#if theme.source === "scanned" && theme.domain}
        <!-- provenance chip: row 1 is the site the reviewer scanned -->
        <p class="hud mb-3 flex w-fit items-center gap-2 border border-[var(--color-line)] px-3 py-1.5 text-primary">
          <span class="live-dot"></span>
          THEMED TO: {theme.domain.toUpperCase()}{scannedClock(theme.scannedAt) ? ` · SCANNED ${scannedClock(theme.scannedAt)}` : ""}
        </p>
      {/if}
      <h1 class="statement tracking-in-expand text-4xl text-base-content sm:text-6xl">
        One shoot.<br />N variants.
      </h1>
      <p class="hud mt-3 max-w-2xl normal-case">
        The video CRM: pick a lead, and the same footage re-renders with
        {"{{company}} {{city}} {{offer}}"} tokens substituted — script, captions, and the GEN segments.
      </p>
    </section>

    <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
      <!-- ── Leads table ─────────────────────────────────────────────── -->
      <section class="border border-[var(--color-line)] bg-base-200" aria-label="Leads">
        <div class="hud flex items-center justify-between border-b border-[var(--color-line)] px-3 py-2">
          <span>LEADS.CSV — {leads.length} ROWS</span>
          <span class="tabular-nums">VARIANT {selected + 1}/{leads.length}</span>
        </div>
        {#if theme.source === "scanned" && theme.vertical !== "home services"}
          <!-- clarify the disconnect: only row 1 is the scan; the rest are fixture samples -->
          <p class="hud border-b border-[var(--color-line)] px-3 py-1.5 text-base-content/50">
            ROW 1 = YOUR SCAN · REST ARE SAMPLE HOME-SERVICES LEADS
          </p>
        {/if}
        <div class="overflow-x-auto">
          <table class="w-full border-collapse text-left">
            <thead>
              <tr class="hud border-b border-[var(--color-line)]">
                <th class="px-3 py-2 font-medium">company</th>
                <th class="px-2 py-2 font-medium">city</th>
                <th class="hidden px-2 py-2 font-medium sm:table-cell">vertical</th>
                <th class="px-2 py-2 font-medium">offer</th>
              </tr>
            </thead>
            <tbody>
              {#each leads as l, i (l.company)}
                <tr
                  class="lead-row cursor-pointer border-b border-[var(--color-line)] last:border-b-0"
                  class:lead-active={i === selected}
                  role="button"
                  tabindex="0"
                  aria-pressed={i === selected}
                  aria-label="Render variant for {l.company}, {l.city}"
                  onclick={() => (selected = i)}
                  onkeydown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      selected = i
                    }
                  }}
                >
                  <td class="lead-company px-3 py-2 font-mono text-xs text-base-content">{l.company}</td>
                  <td class="px-2 py-2 font-mono text-xs text-base-content/70">{l.city}</td>
                  <td class="hidden px-2 py-2 font-mono text-xs text-base-content/70 sm:table-cell">{l.vertical}</td>
                  <td class="hud px-2 py-2 normal-case">{l.offer}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </section>

      <!-- ── Personalized variant ────────────────────────────────────── -->
      <div class="flex min-w-0 flex-col gap-4">
        <section
          class="border border-[var(--color-line)] bg-base-200"
          aria-label="Personalized script for {lead.company}"
        >
          <div class="hud flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-line)] px-3 py-2">
            <span>
              VARIANT — <span class="text-primary">{lead.company}</span> · {lead.city}{lead.first_name ? ` · ${lead.first_name}` : ""}
            </span>
            <span class="tabular-nums">{fmtDur(keptDuration(cut))} PROGRAM</span>
          </div>
          <ul class="m-0 flex list-none flex-col p-0">
            {#each keptMaster as s (s.idx)}
              <li class="border-b border-[var(--color-line)] px-3 py-2 last:border-b-0" use:reveal={{ animation: "fade-in" }}>
                <div class="hud flex flex-wrap items-center gap-x-3">
                  <span class="w-14 text-primary">{s.beat}</span>
                  <span style="color: {CAM_META[s.cam]?.color}">{CAM_META[s.cam]?.label ?? s.cam}</span>
                  <span class="tabular-nums">{s.start.toFixed(1)}–{s.end.toFixed(1)}s</span>
                </div>
                <p class="mt-1 mb-0 text-sm leading-snug text-base-content/90">
                  {#each tokenParts(s.text, lead) as part, pi (pi)}
                    {#if part.sub}<mark class="token-sub">{part.text}</mark>{:else}{part.text}{/if}
                  {/each}
                </p>
                {#if s.caption}
                  <p class="hud mt-1 mb-0">
                    CAPTION:
                    {#each tokenParts(s.caption, lead) as part, pi (pi)}
                      {#if part.sub}<mark class="token-sub">{part.text}</mark>{:else}<span class="text-base-content/70">{part.text}</span>{/if}
                    {/each}
                  </p>
                {/if}
              </li>
            {/each}
          </ul>
        </section>

        <div class="max-h-[60vh]">
          <EdlPanel text={edlText} label="EDL — VARIANT {selected + 1}/{leads.length}" />
        </div>

        <p class="hud border border-[var(--color-line)] bg-base-200 px-3 py-2 normal-case">
          PRODUCTION NOTE — what you see here is the personalization layer only. In production this
          EDL + tokens feed a server-side ffmpeg render farm: shared footage is cut once, GEN
          segments and captions are re-rendered per lead, and N finished MP4s come out the other
          side. The renderer is out of scope for this demo; the data model is the point.
        </p>

        <p class="hud border border-[var(--color-line)] bg-base-200 px-3 py-2 normal-case">
          B-ROLL NOTE — the editor's GENERATE B-ROLL lane applies per lead too: GEN segment
          prompts carry the same tokens, so each variant can mint its own b-roll. In production
          that call is credit-metered and completes at minutes-latency, so per-lead clips are
          minted ahead of send — not on click.
        </p>
      </div>
    </div>

    <!-- tour complete: batch is the studio's last act; finish at the README (stop 04) -->
    <div class="mt-6 border-t border-[var(--color-line)] pt-10">
      <span class="hud text-primary">TOUR STOP 03 · COMPLETE · LAST STOP &rarr; 04</span>
      <h2 class="statement mt-4 mb-3 text-2xl text-base-content sm:text-3xl">
        That&rsquo;s the system.<br />Here&rsquo;s the thinking.
      </h2>
      <p class="text-base-content/70 mb-8 max-w-xl text-sm leading-relaxed">
        You&rsquo;ve run the scan, worked the console, and edited the creative. The README answers
        the three questions the contest asks &mdash; what it does, why this one, and what I&rsquo;d
        build next with the keys.
      </p>
      <div class="flex flex-wrap items-center gap-5">
        <a
          href="/readme"
          class="btn btn-primary btn-lg rounded-none px-8 font-mono text-sm tracking-[0.08em] uppercase"
        >
          Read the Thinking (README) &rarr;
        </a>
        <a href="/#begin" class="hud text-base-content/60 hover:text-primary transition-colors">
          OR BACK TO THE START &uarr;
        </a>
      </div>
    </div>
  </div>
</div>

<style>
  .lead-row {
    transition: background-color 150ms cubic-bezier(0.25, 1, 0.5, 1);
  }
  .lead-row:hover {
    background: color-mix(in oklch, var(--color-base-content) 4%, transparent);
  }
  .lead-active {
    background: color-mix(in oklch, var(--color-primary) 12%, transparent);
  }
  .lead-active .lead-company {
    color: var(--color-primary);
  }
  .lead-row:focus-visible {
    outline: 1px solid var(--color-primary);
    outline-offset: -1px;
  }
  .token-sub {
    background: color-mix(in oklch, var(--color-primary) 22%, transparent);
    color: var(--color-base-content);
    padding: 0 0.15em;
  }
  @media (prefers-reduced-motion: reduce) {
    .lead-row {
      transition: none;
    }
  }
</style>
