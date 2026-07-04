<script lang="ts">
  /**
   * The winning LP cut (console body + radar creed), extracted so it can render
   * both as the site root (/) and at its original address (/haoqi8).
   * `root` swaps in the canonical title/description and de-dupes the footer's
   * self-referential index links.
   */
  import "$lib/haoqi8/haoqi8.css"
  import { reveal } from "$lib/actions/reveal"
  import { procs, hold } from "$lib/haoqi8/scene"
  import { STATIONS, GATE_CHIPS, LEDE, FIXTURES, BOOT_LINES, GATE_SUB } from "$lib/haoqi8/copy"

  let { root = false }: { root?: boolean } = $props()

  // pre-split each process line so the pinned stage can stream it in
  // word-by-word (full text is always in the DOM; the reveal is opacity-only)
  const lineWords = STATIONS.map((s) => s.line.split(" "))
</script>

<svelte:head>
  {#if root}
    <title>Today OS · Acquire More Customers</title>
    <meta
      name="description"
      content="Today OS — the operating system for performance marketing. Find advertisers, pitch them with personalized video, run their accounts behind human gates, and prove the result on a ledger. Built for the It's Today Media Build Challenge."
    />
  {:else}
    <title>Today OS · Acquire More Customers — the console cut, radar creed</title>
    <meta
      name="description"
      content="A hybrid cut of the Today OS landing page: the OS boots as a live operating console, the five-process lifecycle — Find, Pitch, Close, Run, Prove — runs in a process table, and the creed lands as a weapons-hold authorization moment from the radar cut. Agents propose. Humans approve."
    />
  {/if}
</svelte:head>

<div class="hq8">
  <!-- ============================= HERO — BOOT ============================= -->
  <header class="hq8-hero hq8-tex">
    <span class="hq8-cross" style="left: 10%; top: 16%;" aria-hidden="true"></span>
    <span class="hq8-cross" style="right: 12%; bottom: 22%;" aria-hidden="true"></span>

    <div class="hq8-hero-inner">
      <p class="hud hq8-eyebrow hq8-fade" style="--d: 40;">
        <span class="hq8-livedot"></span>
        TODAY OS — THE OPERATING SYSTEM FOR PERFORMANCE MARKETING
      </p>

      <!-- the POST log: lines pop in staged; full text always in the DOM -->
      <div class="hq8-boot">
        {#each BOOT_LINES as b, i (b.text)}
          <p class="hq8-bline hq8-pop" class:hq8-bline--head={!b.ok} style="--d: {100 + i * 180};">
            <span class="hq8-bline-text">{b.text}</span>
            {#if b.ok}
              <span class="hq8-leader" aria-hidden="true"></span>
              <span
                class="hq8-bok hq8-pop"
                class:hq8-bok--warn={b.ok === "SANDBOX" || b.ok === "REQUIRED"}
                style="--d: {100 + i * 180 + 260};">{b.ok}</span
              >
            {/if}
          </p>
        {/each}
        <p class="hq8-bline hq8-pop" style="--d: 1380;" aria-hidden="true">
          <span class="hq8-prompt-char">&gt;</span>
          <span class="hq8-caret hq8-caret-block"></span>
        </p>
      </div>

      <h1 class="hq8-h1">
        <span class="hq8-mask"><span class="hq8-rise" style="--d: 1500;">Acquire</span></span>
        <span class="hq8-mask"><span class="hq8-rise" style="--d: 1590;">More</span></span>
        <span class="hq8-mask"
          ><span class="hq8-rise hq8-h1-blue" style="--d: 1680;">Customers.</span></span
        >
      </h1>

      <!-- drafting annotation: the boot target, dimensioned like a part -->
      <div class="hq8-dim" aria-hidden="true">
        <span class="hq8-dim-line hq8-draw" style="--d: 1980;"></span>
        <span class="hud hq8-dim-label hq8-fade" style="--d: 2180;"
          >FIG. 01 — BOOT TARGET · CONSOLE ONLINE</span
        >
      </div>

      <p class="hq8-lede hq8-fade" style="--d: 1900;">{LEDE}</p>

      <div class="hq8-cta-row hq8-fade" style="--d: 2060;">
        <a href="/os" class="hq8-btn hq8-btn--solid">Enter Today OS &rarr;</a>
        <a href="/readme" class="hq8-btn hq8-btn--ghost">See the contest entry</a>
      </div>
    </div>

    <!-- vertical spec annotation, desktop only -->
    <div class="hq8-spec hq8-fade" style="--d: 2300;" aria-hidden="true">
      <span class="hq8-spec-line hq8-draw hq8-draw--v" style="--d: 2200;"></span>
      <span class="hud hq8-spec-label">SPEC — FIVE PROCESSES · ONE CONSOLE</span>
    </div>

    <p class="hud hq8-scrollcue hq8-fade" style="--d: 2440;" aria-hidden="true">
      SCROLL — THE PROCESS TABLE IS BELOW <span class="hq8-nudge">&darr;</span>
    </p>
  </header>

  <!-- ==================== THE PROCESS TABLE (pinned) ==================== -->
  <section class="hq8-procs" use:procs aria-labelledby="hq8-lifecycle-h">
    <h2 id="hq8-lifecycle-h" class="hq8-ph">
      <span class="hud hq8-ph-kicker">SEC. 01 / THE LIFECYCLE</span>
      One console.<br />Five processes.
    </h2>

    <!-- the pinned stage (decorative mirror of the process list below) -->
    <div class="hq8-pstage hq8-tex" aria-hidden="true">
      <div class="hq8-phud">
        <span class="hud hq8-phud-l">SEC. 01 / THE LIFECYCLE — PROCESS TABLE</span>
        <span class="hud hq8-phud-c">PROC <span data-count>01</span>/05</span>
        <span class="hud hq8-phud-r">{FIXTURES}</span>
      </div>
      <span class="hq8-prog"><span class="hq8-prog-fill"></span></span>

      <div class="hq8-verbwrap">
        {#each STATIONS as s (s.n)}
          <span class="hq8-verb" data-verb>{s.verb}</span>
        {/each}
      </div>
      <div class="hq8-linewrap">
        {#each STATIONS as s, i (s.n)}
          <p class="hq8-log" data-line style="--wn: {lineWords[i].length};">
            <span class="hq8-prompt-char">&gt;&nbsp;</span
            >{#each lineWords[i] as w, wi (wi)}<span class="hq8-w" style="--wi: {wi};">{w}{" "}</span
              >{/each}
          </p>
        {/each}
      </div>

      <div class="hq8-table">
        <div class="hq8-thead">
          <span class="hud hq8-c">PID</span>
          <span class="hud hq8-c">PROCESS</span>
          <span class="hud hq8-c hq8-c-read">READOUT</span>
          <span class="hud hq8-c hq8-c-status">STATUS</span>
        </div>
        {#each STATIONS as s (s.n)}
          <div class="hq8-prow" data-proc>
            <span class="hq8-hl"></span>
            <span class="hq8-bar"></span>
            <span class="hud hq8-c hq8-c-pid">{s.n}</span>
            <span class="hud hq8-c hq8-c-name">{s.verb}</span>
            <span class="hud hq8-c hq8-c-read">{s.read}</span>
            <span class="hq8-c hq8-c-status">
              <span class="hud hq8-st hq8-st--q">QUEUED</span>
              <span class="hud hq8-st hq8-st--r">RUNNING</span>
              <span class="hud hq8-st hq8-st--d">DONE</span>
            </span>
          </div>
        {/each}
      </div>

      <p class="hud hq8-ledger">
        LEDGER: <span class="hq8-oktext" data-ledger>$0</span>/MO WASTE SURFACED — SAMPLE FEED
      </p>

      <p class="hud hq8-output">
        OUTPUT: CUSTOMER ACQUIRED · <span class="hq8-oktext">LEDGER +</span> · LOOP RE-ARMED — NEXT
        PASS QUEUED
      </p>

      <!-- power-down: the console darkens to ink, the table flashes into one
           hot line, the line collapses to a dot, the dot blinks out (CRT-off)
           — so the un-pin scrolls flat ink into the weapons-hold section -->
      <div class="hq8-shutveil" aria-hidden="true"></div>
      <div class="hq8-shutline" aria-hidden="true"></div>
      <span class="hq8-shutdot" aria-hidden="true"></span>
    </div>

    <!-- the five processes in flow: screen readers always, small screens and
         reduced motion visually -->
    <ol class="hq8-plist">
      {#each STATIONS as s, i (s.n)}
        <li class="hq8-frow" use:reveal={{ animation: "fade-in", delay: i * 0.08 }}>
          <span class="hud hq8-frow-status" aria-hidden="true">DONE</span>
          <div class="hq8-frow-copy">
            <span class="hud hq8-frow-meta">PID {s.n} / {s.read}</span>
            <h3 class="hq8-frow-verb">{s.verb}</h3>
            <p class="hq8-frow-line">{s.line}</p>
          </div>
        </li>
      {/each}
    </ol>
  </section>

  <!-- ================== THE CREED — WEAPONS HOLD (pinned) ==================
       transplanted from /haoqi6 (the radar cut): authorization requests queue
       at the weapons-hold line; two cross APPROVED, one is held REFUSED. -->
  <section class="hq8-holdpin" use:hold aria-labelledby="hq8-creed-h">
    <div class="hq8-gstage">
      <p class="hud hq8-gkicker">SEC. 02 / THE CREED — WEAPONS HOLD</p>

      <span class="hq8-gline" aria-hidden="true"></span>
      <span class="hud hq8-gline-label" aria-hidden="true"
        >WEAPONS HOLD — AUTHORIZATION REQUIRED</span
      >

      <h2 id="hq8-creed-h" class="hq8-creed">
        <span class="hq8-creed-l">Agents propose.</span>
        <span class="hq8-creed-r">Humans approve.</span>
      </h2>

      <ul class="hq8-chips">
        {#each GATE_CHIPS as c, i (c.label)}
          <li class="hq8-chip" data-chip data-verdict={c.verdict}>
            <span class="hq8-chip-req">REQ-0{i + 1}</span>
            <span class="hq8-chip-label">{c.label}</span>
            <span class="hq8-chip-stamp">{c.stamp}</span>
          </li>
        {/each}
      </ul>

      <p class="hud hq8-gsub">{GATE_SUB}</p>
    </div>
  </section>

  <!-- ============================ THE CLOSE ============================ -->
  <section class="hq8-final" aria-labelledby="hq8-close-h">
    <div use:reveal>
      <p class="hud hq8-fkicker">SEC. 03 / THE CLOSE</p>
      <h2 id="hq8-close-h" class="hq8-h2">Built inside the<br />Build Challenge.</h2>
      <p class="hq8-body">
        The case study, the contest entry, and the product are the same object: Today OS was built
        inside It&rsquo;s Today Media&rsquo;s Build Challenge, on It&rsquo;s Today Media&rsquo;s own
        domain. Everything above runs on sample data — labeled sample. The README answers what it
        does, why this one, and what I&rsquo;d build next.
      </p>
      <div class="hq8-cta-row">
        <a href="/os" class="hq8-btn hq8-btn--solid">Enter Today OS &rarr;</a>
        <a href="/readme" class="hq8-btn hq8-btn--ghost">Read the thinking (README)</a>
      </div>
    </div>
  </section>

  <!-- ============================= FOOTER ============================= -->
  <footer class="hq8-foot">
    <div class="hq8-foot-grid">
      <div>
        <p class="hud hq8-foot-strong">IT&rsquo;S TODAY MEDIA, LLC</p>
        <p class="hud">12 W MADISON ST<br />BALTIMORE, MD 21201</p>
      </div>
      <div>
        <p class="hud hq8-foot-strong">POSITION</p>
        <p class="hud">39.2977&deg; N<br />76.6157&deg; W</p>
      </div>
      <div>
        <p class="hud hq8-foot-strong">INDEX</p>
        <p class="hud hq8-foot-links">
          {#if !root}
            <a href="/">BACK TO THE MAIN SITE</a><br />
          {/if}
          <a href="/os">ENTER TODAY OS</a><br />
          <a href="/readme">README</a><br />
          <a href="/haoqi">FIRST CUT (/HAOQI)</a><br />
          <a href="/haoqi2">MACHINE CUT (/HAOQI2)</a><br />
          <a href="/haoqi3">CONSOLE CUT (/HAOQI3)</a><br />
          <a href="/haoqi6">RADAR CUT (/HAOQI6)</a>
        </p>
      </div>
      <div class="hq8-foot-last">
        <p class="hud">
          {#if root}
            TODAY OS · CONSOLE CUT, RADAR CREED<br />THE LANDING — ALTERNATE CUTS<br />INDEXED AT
            LEFT
          {:else}
            TODAY OS · CONSOLE CUT, RADAR CREED<br />AN ALTERNATE LANDING — REACHED<br />DIRECTLY
            AT /HAOQI8
          {/if}
        </p>
      </div>
    </div>
  </footer>
</div>

<style>
  /* ── route-local palette (scoped; never touches global tokens) ── */
  .hq8 {
    --hq8-ink: oklch(11.5% 0.015 262);
    --hq8-ink-2: oklch(14.5% 0.016 262);
    --hq8-paper: oklch(97% 0.006 250);
    --hq8-blue: oklch(58% 0.245 262);
    --hq8-blue-text: oklch(66% 0.21 260);
    --hq8-blue-deep: oklch(34% 0.17 264);
    --hq8-amber: oklch(78% 0.12 85);
    /* the console's phosphor green for OK / DONE / APPROVED — the "power good"
       light, kept in the instrument language alongside cobalt. (The radar
       cut's --hq6-phos is this same family; the transplanted creed unifies on
       this token.) */
    --hq8-ok: oklch(76% 0.17 152);
    --hq8-line: color-mix(in oklch, var(--hq8-paper) 14%, transparent);
    --hq8-muted: color-mix(in oklch, var(--hq8-paper) 60%, transparent);

    position: relative;
    isolation: isolate;
    min-height: 100vh;
    background: var(--hq8-ink);
    color: var(--hq8-paper);
    font-family: var(--font-display);
    overflow-x: clip;
  }
  /* the page is always ink — hud labels must not inherit theme-light muted.
     :global keeps this at tie-specificity with the scoped per-element color
     overrides below, so those (declared later) win. */
  :global(.hq8 .hud) {
    color: var(--hq8-muted);
  }

  .hq8-oktext {
    color: var(--hq8-ok);
  }
  .hq8-prompt-char {
    color: var(--hq8-ok);
  }

  /* CRT scanline texture — static, near-invisible, instrument-grade */
  .hq8-tex::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: repeating-linear-gradient(
      0deg,
      transparent 0 3px,
      color-mix(in oklch, var(--hq8-paper) 2%, transparent) 3px 4px
    );
  }

  /* registration cross — drafting tick */
  .hq8-cross {
    position: absolute;
    width: 17px;
    height: 17px;
    pointer-events: none;
    color: color-mix(in oklch, var(--hq8-paper) 26%, transparent);
  }
  .hq8-cross::before,
  .hq8-cross::after {
    content: "";
    position: absolute;
    background: currentColor;
  }
  .hq8-cross::before {
    left: 8px;
    top: 0;
    width: 1px;
    height: 17px;
  }
  .hq8-cross::after {
    top: 8px;
    left: 0;
    height: 1px;
    width: 17px;
  }
  @media (max-width: 640px) {
    .hq8-cross {
      display: none;
    }
  }

  /* ============================= HERO ============================= */
  .hq8-hero {
    position: relative;
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    padding: 4.5rem 1.5rem 5rem;
  }
  .hq8-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(110% 80% at 18% 0%, var(--hq8-blue-deep) 0%, transparent 52%);
    opacity: 0.55;
  }
  @media (min-width: 640px) {
    .hq8-hero {
      padding: 5rem 2.5rem 5rem;
    }
  }
  @media (min-width: 1024px) {
    .hq8-hero {
      padding: 5.5rem 4rem 5.5rem;
    }
  }

  .hq8-hero-inner {
    position: relative;
    z-index: 2;
    max-width: 64rem;
  }

  .hq8-eyebrow {
    display: inline-flex;
    align-items: flex-start;
    gap: 0.55rem;
    color: color-mix(in oklch, var(--hq8-paper) 78%, transparent);
    margin-bottom: 1.5rem;
  }
  .hq8-livedot {
    flex: 0 0 auto;
    width: 6px;
    height: 6px;
    margin-top: 0.28em;
    border-radius: 9999px;
    background: var(--hq8-ok);
  }

  /* ── the boot log ── */
  .hq8-boot {
    max-width: 44rem;
    margin-bottom: 1.9rem;
    border-left: 1px solid var(--hq8-line);
    padding-left: 1rem;
  }
  .hq8-bline {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    line-height: 1.9;
    color: color-mix(in oklch, var(--hq8-paper) 68%, transparent);
  }
  .hq8-bline--head {
    color: var(--hq8-paper);
  }
  .hq8-bline-text {
    min-width: 0;
  }
  .hq8-leader {
    flex: 1 1 2rem;
    min-width: 2rem;
    border-bottom: 1px dotted color-mix(in oklch, var(--hq8-paper) 26%, transparent);
    transform: translateY(-0.32em);
  }
  .hq8-bok {
    flex: 0 0 auto;
    color: var(--hq8-ok);
  }
  .hq8-bok--warn {
    color: var(--hq8-amber);
  }
  .hq8-caret-block {
    display: inline-block;
    width: 0.55em;
    height: 1em;
    transform: translateY(0.15em);
    background: var(--hq8-ok);
  }

  .hq8-h1 {
    display: flex;
    flex-direction: column;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.045em;
    line-height: 0.88;
    /* vh term keeps the whole hero (boot log + headline + lede + CTAs) above
       the fold on short viewports; vw term rules on tall ones */
    font-size: clamp(2.5rem, min(10vw, 14vh), 9rem);
    color: var(--hq8-paper);
  }
  .hq8-mask {
    display: block;
    overflow: hidden;
    padding-bottom: 0.06em;
    margin-bottom: -0.06em;
  }
  .hq8-rise {
    display: block;
  }
  .hq8-h1-blue {
    color: var(--hq8-blue-text);
  }

  /* drafting dimension under the headline */
  .hq8-dim {
    margin-top: 1.2rem;
    max-width: 46rem;
  }
  .hq8-dim-line {
    display: block;
    position: relative;
    height: 1px;
    background: color-mix(in oklch, var(--hq8-paper) 34%, transparent);
    transform-origin: left center;
  }
  .hq8-dim-line::before,
  .hq8-dim-line::after {
    content: "";
    position: absolute;
    top: -4px;
    width: 1px;
    height: 9px;
    background: color-mix(in oklch, var(--hq8-paper) 34%, transparent);
  }
  .hq8-dim-line::before {
    left: 0;
  }
  .hq8-dim-line::after {
    right: 0;
  }
  .hq8-dim-label {
    display: inline-block;
    margin-top: 0.7rem;
  }

  .hq8-lede {
    margin-top: 1.6rem;
    max-width: 34rem;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    line-height: 1.7;
    color: color-mix(in oklch, var(--hq8-paper) 76%, transparent);
  }

  .hq8-cta-row {
    margin-top: 2rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem 1.4rem;
  }

  /* buttons — hardware-flat, square, mono label */
  .hq8-btn {
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.09em;
    font-size: 0.78rem;
    padding: 0.95rem 1.7rem;
    border: 1px solid var(--hq8-line);
    transition:
      transform 120ms cubic-bezier(0.25, 1, 0.5, 1),
      background-color 160ms ease,
      color 160ms ease,
      border-color 160ms ease;
  }
  .hq8-btn--solid {
    background: var(--hq8-blue);
    border-color: var(--hq8-blue);
    color: var(--hq8-paper);
  }
  .hq8-btn--solid:hover {
    background: oklch(64% 0.25 262);
    border-color: oklch(64% 0.25 262);
  }
  .hq8-btn--ghost {
    color: color-mix(in oklch, var(--hq8-paper) 82%, transparent);
    background: color-mix(in oklch, var(--hq8-paper) 4%, transparent);
  }
  .hq8-btn--ghost:hover {
    color: var(--hq8-paper);
    border-color: color-mix(in oklch, var(--hq8-paper) 42%, transparent);
  }
  @media (prefers-reduced-motion: no-preference) {
    .hq8-btn:active {
      transform: scale(0.97);
    }
  }

  /* vertical spec annotation (right edge, desktop only) */
  .hq8-spec {
    position: absolute;
    right: 3.2rem;
    top: 50%;
    z-index: 2;
    display: none;
    align-items: center;
    gap: 0.8rem;
    transform: translateY(-50%);
  }
  @media (min-width: 1180px) {
    .hq8-spec {
      display: flex;
    }
  }
  .hq8-spec-line {
    width: 1px;
    height: clamp(10rem, 26vh, 16rem);
    background: color-mix(in oklch, var(--hq8-paper) 30%, transparent);
    transform-origin: center top;
  }
  .hq8-spec-label {
    writing-mode: vertical-rl;
  }

  .hq8-scrollcue {
    position: absolute;
    left: 1.5rem;
    bottom: 1.6rem;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }
  .hq8-nudge {
    display: inline-block;
    color: var(--hq8-blue-text);
  }
  @media (min-width: 640px) {
    .hq8-scrollcue {
      left: 2.5rem;
    }
  }

  /* ======================== THE PROCESS TABLE ======================== */
  .hq8-procs {
    position: relative;
    height: 540vh;
    border-top: 1px solid var(--hq8-line);
    /* phase vars written by the procs action */
    --p: 0;
    --out: 0;
    /* power-down phase: chrome fade / ink veil / hot line / residue dot */
    --zf: 0;
    --zv: 0;
    --zl: 0;
    --zlo: 0;
    --zd: 0;
    --zdo: 0;
  }

  /* heading: screen readers always; becomes the visible section head in the
     static (mobile / reduced-motion) composition */
  .hq8-ph {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  .hq8-ph-kicker {
    display: block;
    margin-bottom: 1rem;
  }

  .hq8-pstage {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
    background:
      radial-gradient(90% 70% at 82% 108%, var(--hq8-blue-deep) 0%, transparent 55%),
      var(--hq8-ink-2);
  }

  /* HUD bar */
  .hq8-phud {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1.5rem;
    padding: 1.4rem 1.5rem 1.1rem;
    opacity: calc(1 - var(--zf, 0));
  }
  @media (min-width: 640px) {
    .hq8-phud {
      /* extra right padding clears the fixed theme-toggle chrome */
      padding: 1.6rem 5.5rem 1.2rem 2.5rem;
    }
  }
  .hq8-phud-c {
    color: var(--hq8-paper);
  }
  .hq8-phud-r {
    display: none;
  }
  @media (min-width: 1024px) {
    .hq8-phud-r {
      display: inline;
    }
  }

  .hq8-prog {
    position: absolute;
    top: 4.1rem;
    left: 1.5rem;
    right: 1.5rem;
    z-index: 2;
    height: 1px;
    background: var(--hq8-line);
    opacity: calc(1 - var(--zf, 0));
  }
  @media (min-width: 640px) {
    .hq8-prog {
      left: 2.5rem;
      right: 2.5rem;
      top: 4.4rem;
    }
  }
  .hq8-prog-fill {
    position: absolute;
    inset: 0;
    background: var(--hq8-blue);
    transform: scaleX(var(--p));
    transform-origin: left center;
  }

  /* big verb + streaming log line (stacked crossfades) */
  .hq8-verbwrap {
    position: absolute;
    left: 1.5rem;
    top: 13vh;
    z-index: 2;
    display: grid;
    opacity: calc(1 - var(--zf, 0));
  }
  .hq8-linewrap {
    position: absolute;
    left: 1.5rem;
    top: calc(13vh + clamp(3.6rem, 9vw, 7.4rem));
    z-index: 2;
    display: grid;
    max-width: min(44rem, 84vw);
    opacity: calc(1 - var(--zf, 0));
  }
  @media (min-width: 640px) {
    .hq8-verbwrap,
    .hq8-linewrap {
      left: 2.5rem;
    }
  }
  @media (min-width: 1024px) {
    .hq8-verbwrap,
    .hq8-linewrap {
      left: 4rem;
    }
  }
  .hq8-verb,
  .hq8-log {
    grid-area: 1 / 1;
    opacity: var(--o, 0);
  }
  .hq8-verb {
    transform: translateY(calc((1 - var(--o, 0)) * 14px));
  }
  .hq8-verb:first-child,
  .hq8-log:first-child {
    --o: 1;
  }
  .hq8-verb {
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.04em;
    line-height: 0.9;
    font-size: clamp(3rem, 9vw, 7.5rem);
    color: var(--hq8-paper);
  }
  .hq8-log {
    font-family: var(--font-mono);
    font-size: 0.88rem;
    line-height: 1.7;
    color: color-mix(in oklch, var(--hq8-paper) 72%, transparent);
  }
  /* word-by-word stream: each word ramps 0→1 across its slice of --lp —
     opacity only, full text always present */
  .hq8-w {
    opacity: clamp(0, calc(var(--lp, 1) * var(--wn, 1) - var(--wi, 0)), 1);
  }

  /* the table */
  .hq8-table {
    position: absolute;
    left: 1.5rem;
    right: 1.5rem;
    top: 52vh;
    z-index: 2;
    border: 1px solid var(--hq8-line);
    background: color-mix(in oklch, var(--hq8-ink) 55%, transparent);
    opacity: calc(1 - var(--zf, 0));
  }
  @media (min-width: 640px) {
    .hq8-table {
      left: 2.5rem;
      right: 2.5rem;
    }
  }
  @media (min-width: 1024px) {
    .hq8-table {
      left: 4rem;
      right: 4rem;
    }
  }
  .hq8-thead,
  .hq8-prow {
    position: relative;
    display: grid;
    grid-template-columns: 4.5rem minmax(7rem, 16rem) 1fr 6.5rem;
    align-items: baseline;
    gap: 1.2rem;
    padding: 0.62rem 1.1rem;
  }
  .hq8-thead {
    border-bottom: 1px solid var(--hq8-line);
  }
  .hq8-thead .hud {
    color: color-mix(in oklch, var(--hq8-paper) 40%, transparent);
  }
  .hq8-prow {
    border-top: 1px solid color-mix(in oklch, var(--hq8-paper) 7%, transparent);
  }
  .hq8-prow:nth-child(2) {
    border-top: 0;
  }
  /* running highlight + cobalt edge bar (opacity/transform only) */
  .hq8-hl {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: color-mix(in oklch, var(--hq8-blue) 10%, transparent);
    opacity: var(--r, 0);
  }
  .hq8-bar {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--hq8-blue-text);
    transform: scaleY(var(--r, 0));
    transform-origin: center top;
  }
  .hq8-c {
    position: relative;
    white-space: nowrap;
  }
  .hq8-c-pid {
    color: color-mix(in oklch, var(--hq8-paper) 46%, transparent);
  }
  .hq8-c-name {
    color: color-mix(in oklch, var(--hq8-paper) calc(58% + var(--r, 0) * 40%), transparent);
  }
  .hq8-c-read {
    color: var(--hq8-blue-text);
    opacity: calc(0.25 + var(--r, 0) * 0.75 + var(--dn, 0) * 0.45);
  }
  @media (max-width: 900px) {
    .hq8-thead,
    .hq8-prow {
      grid-template-columns: 4.5rem 1fr 6.5rem;
    }
    .hq8-c-read {
      display: none;
    }
  }
  .hq8-c-status {
    display: grid;
  }
  .hq8-st {
    grid-area: 1 / 1;
  }
  .hq8-st--q {
    opacity: var(--q, 1);
    color: color-mix(in oklch, var(--hq8-paper) 38%, transparent);
  }
  .hq8-st--r {
    opacity: var(--r, 0);
    color: var(--hq8-blue-text);
  }
  .hq8-st--d {
    opacity: var(--dn, 0);
    color: var(--hq8-ok);
  }

  /* readouts under the table */
  .hq8-ledger {
    position: absolute;
    left: 1.5rem;
    bottom: 14vh;
    z-index: 2;
    opacity: calc(1 - var(--zf, 0));
  }
  @media (min-width: 640px) {
    .hq8-ledger {
      left: 2.5rem;
    }
  }
  @media (min-width: 1024px) {
    .hq8-ledger {
      left: 4rem;
    }
  }

  .hq8-output {
    position: absolute;
    left: 50%;
    bottom: 7vh;
    z-index: 2;
    transform: translateX(-50%) translateY(calc((1 - var(--out)) * 12px));
    opacity: calc(var(--out) * (1 - var(--zf, 0)));
    white-space: nowrap;
    color: color-mix(in oklch, var(--hq8-paper) 80%, transparent);
  }

  /* ── the power-down beat (CRT-off) ── */
  .hq8-shutveil {
    position: absolute;
    inset: 0;
    z-index: 3;
    pointer-events: none;
    background: var(--hq8-ink);
    opacity: var(--zv, 0);
  }
  .hq8-shutline {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    z-index: 4;
    height: 2px;
    pointer-events: none;
    background: linear-gradient(
      90deg,
      transparent,
      var(--hq8-blue-text) 18%,
      var(--hq8-paper) 50%,
      var(--hq8-blue-text) 82%,
      transparent
    );
    box-shadow: 0 0 18px 1px color-mix(in oklch, var(--hq8-blue) 65%, transparent);
    transform: translateY(-50%) scaleX(var(--zl, 0));
    transform-origin: center center;
    opacity: var(--zlo, 0);
  }
  .hq8-shutdot {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 4;
    width: 7px;
    height: 7px;
    border-radius: 9999px;
    pointer-events: none;
    background: var(--hq8-paper);
    box-shadow: 0 0 22px 7px color-mix(in oklch, var(--hq8-blue) 75%, transparent);
    transform: translate(-50%, -50%) scale(var(--zd, 0));
    opacity: var(--zdo, 0);
  }

  /* the in-flow process list: hidden visually on the pinned desktop stage,
     the real composition on small screens / reduced motion */
  .hq8-plist {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }

  @media (max-width: 767px), (prefers-reduced-motion: reduce) {
    .hq8-procs {
      height: auto;
      padding: 5.5rem 1.5rem 6rem;
    }
    .hq8-pstage {
      display: none;
    }
    .hq8-ph {
      position: static;
      width: auto;
      height: auto;
      overflow: visible;
      clip-path: none;
      white-space: normal;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: -0.03em;
      line-height: 0.9;
      font-size: clamp(2.4rem, 9vw, 5.4rem);
      margin-bottom: 3rem;
    }
    .hq8-plist {
      position: static;
      width: auto;
      height: auto;
      overflow: visible;
      clip-path: none;
      display: flex;
      flex-direction: column;
      border: 1px solid var(--hq8-line);
    }
    .hq8-frow {
      display: flex;
      gap: 1.2rem;
      align-items: flex-start;
      padding: 1.5rem 1.3rem;
      border-top: 1px solid var(--hq8-line);
    }
    .hq8-frow:first-child {
      border-top: 0;
    }
    .hq8-frow-status {
      flex: 0 0 auto;
      margin-top: 0.2rem;
      padding: 0.2rem 0.5rem;
      border: 1px solid color-mix(in oklch, var(--hq8-ok) 55%, transparent);
      color: var(--hq8-ok);
    }
    .hq8-frow-copy {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .hq8-frow-meta {
      color: var(--hq8-blue-text);
    }
    .hq8-frow-verb {
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: -0.02em;
      line-height: 1;
      font-size: clamp(1.7rem, 6vw, 2.6rem);
      color: var(--hq8-paper);
    }
    .hq8-frow-line {
      font-family: var(--font-mono);
      font-size: 0.84rem;
      line-height: 1.65;
      color: color-mix(in oklch, var(--hq8-paper) 70%, transparent);
      max-width: 44rem;
    }
  }
  @media (min-width: 768px) and (prefers-reduced-motion: reduce) {
    .hq8-procs {
      padding: 6rem 4rem 7rem;
    }
  }

  /* ==================== THE CREED — WEAPONS HOLD ====================
     ported from /haoqi6's hold scene, bridged to the hq8 palette. */
  .hq8-holdpin {
    position: relative;
    height: 230vh;
    /* no border-top: the power-down exits on flat ink and this section opens
       on flat ink — a hairline here would re-draw the seam */
    /* phase vars written by the hold action */
    --g: 0;
    --gl: 0;
    --hold: 0;
    --gr: 0;
    --gs: 0;
  }
  .hq8-gstage {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3rem;
    padding: 0 1.5rem;
    background: var(--hq8-ink);
  }
  .hq8-gkicker {
    opacity: calc(0.4 + var(--gl) * 0.6);
  }

  /* the hold hairline — the weapons-hold boundary requests must cross */
  .hq8-gline {
    position: absolute;
    left: 50%;
    top: 14vh;
    bottom: 14vh;
    width: 1px;
    background: color-mix(in oklch, var(--hq8-blue) calc(30% + var(--hold) * 70%), var(--hq8-line));
    transform: scaleY(var(--hold));
    transform-origin: center top;
    opacity: calc(0.35 + var(--hold) * 0.65);
  }
  .hq8-gline-label {
    position: absolute;
    left: calc(50% + 0.9rem);
    top: 27vh;
    writing-mode: vertical-rl;
    opacity: var(--hold);
  }

  .hq8-creed {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 clamp(2.5rem, 6vw, 6rem);
    align-items: baseline;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.035em;
    line-height: 0.92;
    font-size: clamp(1.9rem, 5.2vw, 5.6rem);
    max-width: 92rem;
  }
  .hq8-creed-l {
    text-align: right;
    color: var(--hq8-paper);
    opacity: var(--gl);
    transform: translateX(calc((1 - var(--gl)) * -28px));
  }
  .hq8-creed-r {
    text-align: left;
    color: var(--hq8-blue-text);
    opacity: var(--gr);
    transform: scale(calc(1.14 - var(--gr) * 0.14));
    transform-origin: left center;
  }

  /* authorization requests queuing at the hold */
  .hq8-chips {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.7rem;
    --cross: clamp(120px, 22vw, 260px);
  }
  .hq8-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.7rem;
    font-family: var(--font-mono);
    font-size: 0.66rem;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    padding: 0.55rem 0.85rem;
    border: 1px solid var(--hq8-line);
    background: var(--hq8-ink-2);
    color: color-mix(in oklch, var(--hq8-paper) 78%, transparent);
    white-space: nowrap;
    opacity: var(--in, 0);
    transform: translateX(calc(var(--cross) * -1 + var(--c, 0) * 2 * var(--cross)))
      translateY(calc((1 - var(--in, 0)) * 10px));
  }
  .hq8-chip-req {
    color: var(--hq8-muted);
  }
  .hq8-chip[data-verdict="refused"] {
    border-color: color-mix(in oklch, var(--hq8-amber) calc(var(--stamp, 0) * 70%), var(--hq8-line));
  }
  .hq8-chip-stamp {
    display: inline-block;
    padding: 0.15rem 0.45rem;
    border: 1px solid var(--hq8-blue-text);
    color: var(--hq8-blue-text);
    opacity: var(--stamp, 0);
    transform: scale(calc(1.25 - var(--stamp, 0) * 0.25));
  }
  .hq8-chip[data-verdict="refused"] .hq8-chip-stamp {
    border-color: var(--hq8-amber);
    color: var(--hq8-amber);
  }

  .hq8-gsub {
    position: relative;
    z-index: 2;
    max-width: 34rem;
    text-align: center;
    opacity: var(--gs);
    transform: translateY(calc((1 - var(--gs)) * 10px));
  }

  /* static composition (small screens / reduced motion): no pin, everything
     lands at its final state — same pattern as the process table above */
  @media (max-width: 767px), (prefers-reduced-motion: reduce) {
    .hq8-holdpin {
      height: auto;
    }
    .hq8-gstage {
      position: static;
      height: auto;
      min-height: 0;
      padding: 6rem 1.5rem;
      gap: 2.2rem;
    }
    .hq8-gkicker {
      opacity: 1;
    }
    .hq8-gline,
    .hq8-gline-label {
      display: none;
    }
    .hq8-creed-l,
    .hq8-creed-r,
    .hq8-chip,
    .hq8-chip-stamp,
    .hq8-gsub {
      opacity: 1;
      transform: none;
    }
    .hq8-chip[data-verdict="refused"] {
      border-color: color-mix(in oklch, var(--hq8-amber) 70%, var(--hq8-line));
    }
  }
  @media (max-width: 767px) {
    .hq8-creed {
      grid-template-columns: 1fr;
      gap: 0.6rem;
      text-align: center;
      font-size: clamp(2.3rem, 10vw, 4rem);
    }
    .hq8-creed-l,
    .hq8-creed-r {
      text-align: center;
    }
    .hq8-creed-r {
      transform-origin: center center;
    }
    .hq8-chip {
      white-space: normal;
      text-align: left;
      max-width: 82vw;
    }
  }

  /* ============================ THE CLOSE ============================ */
  .hq8-final {
    position: relative;
    padding: 6rem 1.5rem;
    border-top: 1px solid var(--hq8-line);
  }
  @media (min-width: 640px) {
    .hq8-final {
      padding: 8rem 2.5rem;
    }
  }
  @media (min-width: 1024px) {
    .hq8-final {
      padding: 9rem 4rem;
    }
  }
  .hq8-fkicker {
    margin-bottom: 1.2rem;
  }
  .hq8-h2 {
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.03em;
    line-height: 0.9;
    font-size: clamp(2.4rem, 6.5vw, 5.4rem);
    color: var(--hq8-paper);
  }
  .hq8-body {
    margin-top: 1.6rem;
    max-width: 40rem;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    line-height: 1.75;
    color: color-mix(in oklch, var(--hq8-paper) 74%, transparent);
  }
  .hq8-final .hq8-cta-row {
    margin-top: 2.4rem;
  }

  /* ============================= FOOTER ============================= */
  .hq8-foot {
    border-top: 1px solid var(--hq8-line);
    padding: 4rem 1.5rem 5rem;
  }
  @media (min-width: 640px) {
    .hq8-foot {
      padding: 4.5rem 2.5rem 5.5rem;
    }
  }
  @media (min-width: 1024px) {
    .hq8-foot {
      padding: 4.5rem 4rem 5.5rem;
    }
  }
  .hq8-foot-grid {
    display: grid;
    gap: 2.5rem;
    grid-template-columns: 1fr;
  }
  @media (min-width: 768px) {
    .hq8-foot-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  .hq8-foot .hud {
    line-height: 2;
  }
  .hq8-foot-strong {
    color: var(--hq8-paper);
    margin-bottom: 0.6rem;
  }
  .hq8-foot-links a {
    transition: color 140ms ease;
  }
  .hq8-foot-links a:hover {
    color: var(--hq8-paper);
  }
  .hq8-foot-links a:first-child {
    color: var(--hq8-blue-text);
  }
  .hq8-foot-links a:first-child:hover {
    color: var(--hq8-paper);
  }
  .hq8-foot-last {
    text-align: left;
  }
  @media (min-width: 768px) {
    .hq8-foot-last {
      text-align: right;
    }
  }
</style>
