<script lang="ts">
  import "$lib/haoqi3/haoqi3.css"
  import { reveal } from "$lib/actions/reveal"
  import { procs, gate } from "$lib/haoqi3/scene"
  import {
    STATIONS,
    GATE_CHIPS,
    LEDE,
    FIXTURES,
    BOOT_LINES,
    PROMPT_TITLE,
    PROMPT_KEYS,
    GATE_SUB,
  } from "$lib/haoqi3/copy"

  // pre-split each process line so the pinned stage can stream it in
  // word-by-word (full text is always in the DOM; the reveal is opacity-only)
  const lineWords = STATIONS.map((s) => s.line.split(" "))
</script>

<svelte:head>
  <title>Today OS · Acquire More Customers — the console cut</title>
  <meta
    name="description"
    content="An alternate cut of the Today OS landing page drawn as a live operating console: the OS boots, the five-process lifecycle — Find, Pitch, Close, Run, Prove — runs in a process table, and every proposal stops at an authorization prompt. Agents propose. Humans approve."
  />
</svelte:head>

<div class="hq3">
  <!-- ============================= HERO — BOOT ============================= -->
  <header class="hq3-hero hq3-tex">
    <span class="hq3-cross" style="left: 10%; top: 16%;" aria-hidden="true"></span>
    <span class="hq3-cross" style="right: 12%; bottom: 22%;" aria-hidden="true"></span>

    <div class="hq3-hero-inner">
      <p class="hud hq3-eyebrow hq3-fade" style="--d: 40;">
        <span class="hq3-livedot"></span>
        TODAY OS — THE OPERATING SYSTEM FOR PERFORMANCE MARKETING
      </p>

      <!-- the POST log: lines pop in staged; full text always in the DOM -->
      <div class="hq3-boot">
        {#each BOOT_LINES as b, i (b.text)}
          <p class="hq3-bline hq3-pop" class:hq3-bline--head={!b.ok} style="--d: {100 + i * 180};">
            <span class="hq3-bline-text">{b.text}</span>
            {#if b.ok}
              <span class="hq3-leader" aria-hidden="true"></span>
              <span
                class="hq3-bok hq3-pop"
                class:hq3-bok--warn={b.ok === "SANDBOX" || b.ok === "REQUIRED"}
                style="--d: {100 + i * 180 + 260};">{b.ok}</span
              >
            {/if}
          </p>
        {/each}
        <p class="hq3-bline hq3-pop" style="--d: 1380;" aria-hidden="true">
          <span class="hq3-prompt-char">&gt;</span>
          <span class="hq3-caret hq3-caret-block"></span>
        </p>
      </div>

      <h1 class="hq3-h1">
        <span class="hq3-mask"><span class="hq3-rise" style="--d: 1500;">Acquire</span></span>
        <span class="hq3-mask"><span class="hq3-rise" style="--d: 1590;">More</span></span>
        <span class="hq3-mask"
          ><span class="hq3-rise hq3-h1-blue" style="--d: 1680;">Customers.</span></span
        >
      </h1>

      <!-- drafting annotation: the boot target, dimensioned like a part -->
      <div class="hq3-dim" aria-hidden="true">
        <span class="hq3-dim-line hq3-draw" style="--d: 1980;"></span>
        <span class="hud hq3-dim-label hq3-fade" style="--d: 2180;"
          >FIG. 01 — BOOT TARGET · CONSOLE ONLINE</span
        >
      </div>

      <p class="hq3-lede hq3-fade" style="--d: 1900;">{LEDE}</p>

      <div class="hq3-cta-row hq3-fade" style="--d: 2060;">
        <a href="/os" class="hq3-btn hq3-btn--solid">Enter Today OS &rarr;</a>
        <a href="/readme" class="hq3-btn hq3-btn--ghost">See the contest entry</a>
      </div>
    </div>

    <!-- vertical spec annotation, desktop only -->
    <div class="hq3-spec hq3-fade" style="--d: 2300;" aria-hidden="true">
      <span class="hq3-spec-line hq3-draw hq3-draw--v" style="--d: 2200;"></span>
      <span class="hud hq3-spec-label">SPEC — FIVE PROCESSES · ONE CONSOLE</span>
    </div>

    <p class="hud hq3-scrollcue hq3-fade" style="--d: 2440;" aria-hidden="true">
      SCROLL — THE PROCESS TABLE IS BELOW <span class="hq3-nudge">&darr;</span>
    </p>
  </header>

  <!-- ==================== THE PROCESS TABLE (pinned) ==================== -->
  <section class="hq3-procs" use:procs aria-labelledby="hq3-lifecycle-h">
    <h2 id="hq3-lifecycle-h" class="hq3-ph">
      <span class="hud hq3-ph-kicker">SEC. 01 / THE LIFECYCLE</span>
      One console.<br />Five processes.
    </h2>

    <!-- the pinned stage (decorative mirror of the process list below) -->
    <div class="hq3-pstage hq3-tex" aria-hidden="true">
      <div class="hq3-phud">
        <span class="hud hq3-phud-l">SEC. 01 / THE LIFECYCLE — PROCESS TABLE</span>
        <span class="hud hq3-phud-c">PROC <span data-count>01</span>/05</span>
        <span class="hud hq3-phud-r">{FIXTURES}</span>
      </div>
      <span class="hq3-prog"><span class="hq3-prog-fill"></span></span>

      <div class="hq3-verbwrap">
        {#each STATIONS as s (s.n)}
          <span class="hq3-verb" data-verb>{s.verb}</span>
        {/each}
      </div>
      <div class="hq3-linewrap">
        {#each STATIONS as s, i (s.n)}
          <p class="hq3-log" data-line style="--wn: {lineWords[i].length};">
            <span class="hq3-prompt-char">&gt;&nbsp;</span
            >{#each lineWords[i] as w, wi (wi)}<span class="hq3-w" style="--wi: {wi};">{w}{" "}</span
              >{/each}
          </p>
        {/each}
      </div>

      <div class="hq3-table">
        <div class="hq3-thead">
          <span class="hud hq3-c">PID</span>
          <span class="hud hq3-c">PROCESS</span>
          <span class="hud hq3-c hq3-c-read">READOUT</span>
          <span class="hud hq3-c hq3-c-status">STATUS</span>
        </div>
        {#each STATIONS as s (s.n)}
          <div class="hq3-prow" data-proc>
            <span class="hq3-hl"></span>
            <span class="hq3-bar"></span>
            <span class="hud hq3-c hq3-c-pid">{s.n}</span>
            <span class="hud hq3-c hq3-c-name">{s.verb}</span>
            <span class="hud hq3-c hq3-c-read">{s.read}</span>
            <span class="hq3-c hq3-c-status">
              <span class="hud hq3-st hq3-st--q">QUEUED</span>
              <span class="hud hq3-st hq3-st--r">RUNNING</span>
              <span class="hud hq3-st hq3-st--d">DONE</span>
            </span>
          </div>
        {/each}
      </div>

      <p class="hud hq3-ledger">
        LEDGER: <span class="hq3-oktext" data-ledger>$0</span>/MO WASTE SURFACED — SAMPLE FEED
      </p>

      <p class="hud hq3-output">
        OUTPUT: CUSTOMER ACQUIRED · <span class="hq3-oktext">LEDGER +</span> · LOOP RE-ARMED — NEXT
        PASS QUEUED
      </p>

      <!-- power-down: the console darkens to ink, the table flashes into one
           hot line, the line collapses to a dot, the dot blinks out (CRT-off)
           — so the un-pin scrolls flat ink into the authorization section -->
      <div class="hq3-shutveil" aria-hidden="true"></div>
      <div class="hq3-shutline" aria-hidden="true"></div>
      <span class="hq3-shutdot" aria-hidden="true"></span>
    </div>

    <!-- the five processes in flow: screen readers always, small screens and
         reduced motion visually -->
    <ol class="hq3-plist">
      {#each STATIONS as s, i (s.n)}
        <li class="hq3-frow" use:reveal={{ animation: "fade-in", delay: i * 0.08 }}>
          <span class="hud hq3-frow-status" aria-hidden="true">DONE</span>
          <div class="hq3-frow-copy">
            <span class="hud hq3-frow-meta">PID {s.n} / {s.read}</span>
            <h3 class="hq3-frow-verb">{s.verb}</h3>
            <p class="hq3-frow-line">{s.line}</p>
          </div>
        </li>
      {/each}
    </ol>
  </section>

  <!-- ================== THE CREED — AUTHORIZATION (pinned) ================== -->
  <section class="hq3-gatepin" use:gate aria-labelledby="hq3-creed-h">
    <div class="hq3-gstage">
      <p class="hud hq3-gkicker">SEC. 02 / THE CREED — AUTHORIZATION</p>

      <h2 id="hq3-creed-h" class="hq3-creed">
        <span class="hq3-creed-l">Agents propose.</span>
        <span class="hq3-creed-r">Humans approve.</span>
      </h2>

      <div class="hq3-prompt">
        <p class="hud hq3-prompt-title">{PROMPT_TITLE}</p>
        <ul class="hq3-chips">
          {#each GATE_CHIPS as c (c.label)}
            <li class="hq3-chip" data-chip data-verdict={c.verdict}>
              <span class="hq3-prompt-char" aria-hidden="true">&gt;</span>
              <span class="hq3-chip-label">{c.label}</span>
              <span class="hq3-chip-stamp">{c.stamp}</span>
            </li>
          {/each}
        </ul>
        <p class="hud hq3-prompt-keys">{PROMPT_KEYS}</p>
      </div>

      <p class="hud hq3-gsub">{GATE_SUB}</p>
    </div>
  </section>

  <!-- ============================ THE CLOSE ============================ -->
  <section class="hq3-final" aria-labelledby="hq3-close-h">
    <div use:reveal>
      <p class="hud hq3-fkicker">SEC. 03 / THE CLOSE</p>
      <h2 id="hq3-close-h" class="hq3-h2">Built inside the<br />Build Challenge.</h2>
      <p class="hq3-body">
        The case study, the contest entry, and the product are the same object: Today OS was built
        inside It&rsquo;s Today Media&rsquo;s Build Challenge, on It&rsquo;s Today Media&rsquo;s own
        domain. Everything above runs on sample data — labeled sample. The README answers what it
        does, why this one, and what I&rsquo;d build next.
      </p>
      <div class="hq3-cta-row">
        <a href="/os" class="hq3-btn hq3-btn--solid">Enter Today OS &rarr;</a>
        <a href="/readme" class="hq3-btn hq3-btn--ghost">Read the thinking (README)</a>
      </div>
    </div>
  </section>

  <!-- ============================= FOOTER ============================= -->
  <footer class="hq3-foot">
    <div class="hq3-foot-grid">
      <div>
        <p class="hud hq3-foot-strong">IT&rsquo;S TODAY MEDIA, LLC</p>
        <p class="hud">12 W MADISON ST<br />BALTIMORE, MD 21201</p>
      </div>
      <div>
        <p class="hud hq3-foot-strong">POSITION</p>
        <p class="hud">39.2977&deg; N<br />76.6157&deg; W</p>
      </div>
      <div>
        <p class="hud hq3-foot-strong">INDEX</p>
        <p class="hud hq3-foot-links">
          <a href="/">BACK TO THE MAIN SITE</a><br />
          <a href="/os">ENTER TODAY OS</a><br />
          <a href="/readme">README</a><br />
          <a href="/haoqi">FIRST CUT (/HAOQI)</a><br />
          <a href="/haoqi2">MACHINE CUT (/HAOQI2)</a>
        </p>
      </div>
      <div class="hq3-foot-last">
        <p class="hud">
          TODAY OS · CONSOLE CUT<br />AN ALTERNATE LANDING — REACHED<br />DIRECTLY AT /HAOQI3
        </p>
      </div>
    </div>
  </footer>
</div>

<style>
  /* ── route-local palette (scoped; never touches global tokens) ── */
  .hq3 {
    --hq3-ink: oklch(11.5% 0.015 262);
    --hq3-ink-2: oklch(14.5% 0.016 262);
    --hq3-paper: oklch(97% 0.006 250);
    --hq3-blue: oklch(58% 0.245 262);
    --hq3-blue-text: oklch(66% 0.21 260);
    --hq3-blue-deep: oklch(34% 0.17 264);
    --hq3-amber: oklch(78% 0.12 85);
    /* the one deliberate shift from hq2: a phosphor green for OK / DONE /
       APPROVED — the console's "power good" light, kept in the instrument
       language alongside cobalt */
    --hq3-ok: oklch(76% 0.17 152);
    --hq3-line: color-mix(in oklch, var(--hq3-paper) 14%, transparent);
    --hq3-muted: color-mix(in oklch, var(--hq3-paper) 60%, transparent);

    position: relative;
    isolation: isolate;
    min-height: 100vh;
    background: var(--hq3-ink);
    color: var(--hq3-paper);
    font-family: var(--font-display);
    overflow-x: clip;
  }
  /* the page is always ink — hud labels must not inherit theme-light muted.
     :global keeps this at tie-specificity with the scoped per-element color
     overrides below, so those (declared later) win. */
  :global(.hq3 .hud) {
    color: var(--hq3-muted);
  }

  .hq3-oktext {
    color: var(--hq3-ok);
  }
  .hq3-prompt-char {
    color: var(--hq3-ok);
  }

  /* CRT scanline texture — static, near-invisible, instrument-grade */
  .hq3-tex::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: repeating-linear-gradient(
      0deg,
      transparent 0 3px,
      color-mix(in oklch, var(--hq3-paper) 2%, transparent) 3px 4px
    );
  }

  /* registration cross — drafting tick */
  .hq3-cross {
    position: absolute;
    width: 17px;
    height: 17px;
    pointer-events: none;
    color: color-mix(in oklch, var(--hq3-paper) 26%, transparent);
  }
  .hq3-cross::before,
  .hq3-cross::after {
    content: "";
    position: absolute;
    background: currentColor;
  }
  .hq3-cross::before {
    left: 8px;
    top: 0;
    width: 1px;
    height: 17px;
  }
  .hq3-cross::after {
    top: 8px;
    left: 0;
    height: 1px;
    width: 17px;
  }
  @media (max-width: 640px) {
    .hq3-cross {
      display: none;
    }
  }

  /* ============================= HERO ============================= */
  .hq3-hero {
    position: relative;
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    padding: 4.5rem 1.5rem 5rem;
  }
  .hq3-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(110% 80% at 18% 0%, var(--hq3-blue-deep) 0%, transparent 52%);
    opacity: 0.55;
  }
  @media (min-width: 640px) {
    .hq3-hero {
      padding: 5rem 2.5rem 5rem;
    }
  }
  @media (min-width: 1024px) {
    .hq3-hero {
      padding: 5.5rem 4rem 5.5rem;
    }
  }

  .hq3-hero-inner {
    position: relative;
    z-index: 2;
    max-width: 64rem;
  }

  .hq3-eyebrow {
    display: inline-flex;
    align-items: flex-start;
    gap: 0.55rem;
    color: color-mix(in oklch, var(--hq3-paper) 78%, transparent);
    margin-bottom: 1.5rem;
  }
  .hq3-livedot {
    flex: 0 0 auto;
    width: 6px;
    height: 6px;
    margin-top: 0.28em;
    border-radius: 9999px;
    background: var(--hq3-ok);
  }

  /* ── the boot log ── */
  .hq3-boot {
    max-width: 44rem;
    margin-bottom: 1.9rem;
    border-left: 1px solid var(--hq3-line);
    padding-left: 1rem;
  }
  .hq3-bline {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    line-height: 1.9;
    color: color-mix(in oklch, var(--hq3-paper) 68%, transparent);
  }
  .hq3-bline--head {
    color: var(--hq3-paper);
  }
  .hq3-bline-text {
    min-width: 0;
  }
  .hq3-leader {
    flex: 1 1 2rem;
    min-width: 2rem;
    border-bottom: 1px dotted color-mix(in oklch, var(--hq3-paper) 26%, transparent);
    transform: translateY(-0.32em);
  }
  .hq3-bok {
    flex: 0 0 auto;
    color: var(--hq3-ok);
  }
  .hq3-bok--warn {
    color: var(--hq3-amber);
  }
  .hq3-caret-block {
    display: inline-block;
    width: 0.55em;
    height: 1em;
    transform: translateY(0.15em);
    background: var(--hq3-ok);
  }

  .hq3-h1 {
    display: flex;
    flex-direction: column;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.045em;
    line-height: 0.88;
    /* vh term keeps the whole hero (boot log + headline + lede + CTAs) above
       the fold on short viewports; vw term rules on tall ones */
    font-size: clamp(2.5rem, min(10vw, 14vh), 9rem);
    color: var(--hq3-paper);
  }
  .hq3-mask {
    display: block;
    overflow: hidden;
    padding-bottom: 0.06em;
    margin-bottom: -0.06em;
  }
  .hq3-rise {
    display: block;
  }
  .hq3-h1-blue {
    color: var(--hq3-blue-text);
  }

  /* drafting dimension under the headline */
  .hq3-dim {
    margin-top: 1.2rem;
    max-width: 46rem;
  }
  .hq3-dim-line {
    display: block;
    position: relative;
    height: 1px;
    background: color-mix(in oklch, var(--hq3-paper) 34%, transparent);
    transform-origin: left center;
  }
  .hq3-dim-line::before,
  .hq3-dim-line::after {
    content: "";
    position: absolute;
    top: -4px;
    width: 1px;
    height: 9px;
    background: color-mix(in oklch, var(--hq3-paper) 34%, transparent);
  }
  .hq3-dim-line::before {
    left: 0;
  }
  .hq3-dim-line::after {
    right: 0;
  }
  .hq3-dim-label {
    display: inline-block;
    margin-top: 0.7rem;
  }

  .hq3-lede {
    margin-top: 1.6rem;
    max-width: 34rem;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    line-height: 1.7;
    color: color-mix(in oklch, var(--hq3-paper) 76%, transparent);
  }

  .hq3-cta-row {
    margin-top: 2rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem 1.4rem;
  }

  /* buttons — hardware-flat, square, mono label */
  .hq3-btn {
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.09em;
    font-size: 0.78rem;
    padding: 0.95rem 1.7rem;
    border: 1px solid var(--hq3-line);
    transition:
      transform 120ms cubic-bezier(0.25, 1, 0.5, 1),
      background-color 160ms ease,
      color 160ms ease,
      border-color 160ms ease;
  }
  .hq3-btn--solid {
    background: var(--hq3-blue);
    border-color: var(--hq3-blue);
    color: var(--hq3-paper);
  }
  .hq3-btn--solid:hover {
    background: oklch(64% 0.25 262);
    border-color: oklch(64% 0.25 262);
  }
  .hq3-btn--ghost {
    color: color-mix(in oklch, var(--hq3-paper) 82%, transparent);
    background: color-mix(in oklch, var(--hq3-paper) 4%, transparent);
  }
  .hq3-btn--ghost:hover {
    color: var(--hq3-paper);
    border-color: color-mix(in oklch, var(--hq3-paper) 42%, transparent);
  }
  @media (prefers-reduced-motion: no-preference) {
    .hq3-btn:active {
      transform: scale(0.97);
    }
  }

  /* vertical spec annotation (right edge, desktop only) */
  .hq3-spec {
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
    .hq3-spec {
      display: flex;
    }
  }
  .hq3-spec-line {
    width: 1px;
    height: clamp(10rem, 26vh, 16rem);
    background: color-mix(in oklch, var(--hq3-paper) 30%, transparent);
    transform-origin: center top;
  }
  .hq3-spec-label {
    writing-mode: vertical-rl;
  }

  .hq3-scrollcue {
    position: absolute;
    left: 1.5rem;
    bottom: 1.6rem;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }
  .hq3-nudge {
    display: inline-block;
    color: var(--hq3-blue-text);
  }
  @media (min-width: 640px) {
    .hq3-scrollcue {
      left: 2.5rem;
    }
  }

  /* ======================== THE PROCESS TABLE ======================== */
  .hq3-procs {
    position: relative;
    height: 540vh;
    border-top: 1px solid var(--hq3-line);
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
  .hq3-ph {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  .hq3-ph-kicker {
    display: block;
    margin-bottom: 1rem;
  }

  .hq3-pstage {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
    background:
      radial-gradient(90% 70% at 82% 108%, var(--hq3-blue-deep) 0%, transparent 55%),
      var(--hq3-ink-2);
  }

  /* HUD bar */
  .hq3-phud {
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
    .hq3-phud {
      /* extra right padding clears the fixed theme-toggle chrome */
      padding: 1.6rem 5.5rem 1.2rem 2.5rem;
    }
  }
  .hq3-phud-c {
    color: var(--hq3-paper);
  }
  .hq3-phud-r {
    display: none;
  }
  @media (min-width: 1024px) {
    .hq3-phud-r {
      display: inline;
    }
  }

  .hq3-prog {
    position: absolute;
    top: 4.1rem;
    left: 1.5rem;
    right: 1.5rem;
    z-index: 2;
    height: 1px;
    background: var(--hq3-line);
    opacity: calc(1 - var(--zf, 0));
  }
  @media (min-width: 640px) {
    .hq3-prog {
      left: 2.5rem;
      right: 2.5rem;
      top: 4.4rem;
    }
  }
  .hq3-prog-fill {
    position: absolute;
    inset: 0;
    background: var(--hq3-blue);
    transform: scaleX(var(--p));
    transform-origin: left center;
  }

  /* big verb + streaming log line (stacked crossfades) */
  .hq3-verbwrap {
    position: absolute;
    left: 1.5rem;
    top: 13vh;
    z-index: 2;
    display: grid;
    opacity: calc(1 - var(--zf, 0));
  }
  .hq3-linewrap {
    position: absolute;
    left: 1.5rem;
    top: calc(13vh + clamp(3.6rem, 9vw, 7.4rem));
    z-index: 2;
    display: grid;
    max-width: min(44rem, 84vw);
    opacity: calc(1 - var(--zf, 0));
  }
  @media (min-width: 640px) {
    .hq3-verbwrap,
    .hq3-linewrap {
      left: 2.5rem;
    }
  }
  @media (min-width: 1024px) {
    .hq3-verbwrap,
    .hq3-linewrap {
      left: 4rem;
    }
  }
  .hq3-verb,
  .hq3-log {
    grid-area: 1 / 1;
    opacity: var(--o, 0);
  }
  .hq3-verb {
    transform: translateY(calc((1 - var(--o, 0)) * 14px));
  }
  .hq3-verb:first-child,
  .hq3-log:first-child {
    --o: 1;
  }
  .hq3-verb {
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.04em;
    line-height: 0.9;
    font-size: clamp(3rem, 9vw, 7.5rem);
    color: var(--hq3-paper);
  }
  .hq3-log {
    font-family: var(--font-mono);
    font-size: 0.88rem;
    line-height: 1.7;
    color: color-mix(in oklch, var(--hq3-paper) 72%, transparent);
  }
  /* word-by-word stream: each word ramps 0→1 across its slice of --lp —
     opacity only, full text always present */
  .hq3-w {
    opacity: clamp(0, calc(var(--lp, 1) * var(--wn, 1) - var(--wi, 0)), 1);
  }

  /* the table */
  .hq3-table {
    position: absolute;
    left: 1.5rem;
    right: 1.5rem;
    top: 52vh;
    z-index: 2;
    border: 1px solid var(--hq3-line);
    background: color-mix(in oklch, var(--hq3-ink) 55%, transparent);
    opacity: calc(1 - var(--zf, 0));
  }
  @media (min-width: 640px) {
    .hq3-table {
      left: 2.5rem;
      right: 2.5rem;
    }
  }
  @media (min-width: 1024px) {
    .hq3-table {
      left: 4rem;
      right: 4rem;
    }
  }
  .hq3-thead,
  .hq3-prow {
    position: relative;
    display: grid;
    grid-template-columns: 4.5rem minmax(7rem, 16rem) 1fr 6.5rem;
    align-items: baseline;
    gap: 1.2rem;
    padding: 0.62rem 1.1rem;
  }
  .hq3-thead {
    border-bottom: 1px solid var(--hq3-line);
  }
  .hq3-thead .hud {
    color: color-mix(in oklch, var(--hq3-paper) 40%, transparent);
  }
  .hq3-prow {
    border-top: 1px solid color-mix(in oklch, var(--hq3-paper) 7%, transparent);
  }
  .hq3-prow:nth-child(2) {
    border-top: 0;
  }
  /* running highlight + cobalt edge bar (opacity/transform only) */
  .hq3-hl {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: color-mix(in oklch, var(--hq3-blue) 10%, transparent);
    opacity: var(--r, 0);
  }
  .hq3-bar {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--hq3-blue-text);
    transform: scaleY(var(--r, 0));
    transform-origin: center top;
  }
  .hq3-c {
    position: relative;
    white-space: nowrap;
  }
  .hq3-c-pid {
    color: color-mix(in oklch, var(--hq3-paper) 46%, transparent);
  }
  .hq3-c-name {
    color: color-mix(in oklch, var(--hq3-paper) calc(58% + var(--r, 0) * 40%), transparent);
  }
  .hq3-c-read {
    color: var(--hq3-blue-text);
    opacity: calc(0.25 + var(--r, 0) * 0.75 + var(--dn, 0) * 0.45);
  }
  @media (max-width: 900px) {
    .hq3-thead,
    .hq3-prow {
      grid-template-columns: 4.5rem 1fr 6.5rem;
    }
    .hq3-c-read {
      display: none;
    }
  }
  .hq3-c-status {
    display: grid;
  }
  .hq3-st {
    grid-area: 1 / 1;
  }
  .hq3-st--q {
    opacity: var(--q, 1);
    color: color-mix(in oklch, var(--hq3-paper) 38%, transparent);
  }
  .hq3-st--r {
    opacity: var(--r, 0);
    color: var(--hq3-blue-text);
  }
  .hq3-st--d {
    opacity: var(--dn, 0);
    color: var(--hq3-ok);
  }

  /* readouts under the table */
  .hq3-ledger {
    position: absolute;
    left: 1.5rem;
    bottom: 14vh;
    z-index: 2;
    opacity: calc(1 - var(--zf, 0));
  }
  @media (min-width: 640px) {
    .hq3-ledger {
      left: 2.5rem;
    }
  }
  @media (min-width: 1024px) {
    .hq3-ledger {
      left: 4rem;
    }
  }

  .hq3-output {
    position: absolute;
    left: 50%;
    bottom: 7vh;
    z-index: 2;
    transform: translateX(-50%) translateY(calc((1 - var(--out)) * 12px));
    opacity: calc(var(--out) * (1 - var(--zf, 0)));
    white-space: nowrap;
    color: color-mix(in oklch, var(--hq3-paper) 80%, transparent);
  }

  /* ── the power-down beat (CRT-off) ── */
  .hq3-shutveil {
    position: absolute;
    inset: 0;
    z-index: 3;
    pointer-events: none;
    background: var(--hq3-ink);
    opacity: var(--zv, 0);
  }
  .hq3-shutline {
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
      var(--hq3-blue-text) 18%,
      var(--hq3-paper) 50%,
      var(--hq3-blue-text) 82%,
      transparent
    );
    box-shadow: 0 0 18px 1px color-mix(in oklch, var(--hq3-blue) 65%, transparent);
    transform: translateY(-50%) scaleX(var(--zl, 0));
    transform-origin: center center;
    opacity: var(--zlo, 0);
  }
  .hq3-shutdot {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 4;
    width: 7px;
    height: 7px;
    border-radius: 9999px;
    pointer-events: none;
    background: var(--hq3-paper);
    box-shadow: 0 0 22px 7px color-mix(in oklch, var(--hq3-blue) 75%, transparent);
    transform: translate(-50%, -50%) scale(var(--zd, 0));
    opacity: var(--zdo, 0);
  }

  /* the in-flow process list: hidden visually on the pinned desktop stage,
     the real composition on small screens / reduced motion */
  .hq3-plist {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }

  @media (max-width: 767px), (prefers-reduced-motion: reduce) {
    .hq3-procs {
      height: auto;
      padding: 5.5rem 1.5rem 6rem;
    }
    .hq3-pstage {
      display: none;
    }
    .hq3-ph {
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
    .hq3-plist {
      position: static;
      width: auto;
      height: auto;
      overflow: visible;
      clip-path: none;
      display: flex;
      flex-direction: column;
      border: 1px solid var(--hq3-line);
    }
    .hq3-frow {
      display: flex;
      gap: 1.2rem;
      align-items: flex-start;
      padding: 1.5rem 1.3rem;
      border-top: 1px solid var(--hq3-line);
    }
    .hq3-frow:first-child {
      border-top: 0;
    }
    .hq3-frow-status {
      flex: 0 0 auto;
      margin-top: 0.2rem;
      padding: 0.2rem 0.5rem;
      border: 1px solid color-mix(in oklch, var(--hq3-ok) 55%, transparent);
      color: var(--hq3-ok);
    }
    .hq3-frow-copy {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .hq3-frow-meta {
      color: var(--hq3-blue-text);
    }
    .hq3-frow-verb {
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: -0.02em;
      line-height: 1;
      font-size: clamp(1.7rem, 6vw, 2.6rem);
      color: var(--hq3-paper);
    }
    .hq3-frow-line {
      font-family: var(--font-mono);
      font-size: 0.84rem;
      line-height: 1.65;
      color: color-mix(in oklch, var(--hq3-paper) 70%, transparent);
      max-width: 44rem;
    }
  }
  @media (min-width: 768px) and (prefers-reduced-motion: reduce) {
    .hq3-procs {
      padding: 6rem 4rem 7rem;
    }
  }

  /* ==================== THE CREED — AUTHORIZATION ==================== */
  .hq3-gatepin {
    position: relative;
    height: 230vh;
    /* no border-top: the power-down exits on flat ink and this section opens
       on flat ink — a hairline here would re-draw the seam */
    /* phase vars written by the gate action */
    --g: 0;
    --gl: 0;
    --fr: 0;
    --gr: 0;
    --gs: 0;
  }
  .hq3-gstage {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2.6rem;
    padding: 0 1.5rem;
    background: var(--hq3-ink);
  }
  .hq3-gkicker {
    opacity: calc(0.4 + var(--gl) * 0.6);
  }

  .hq3-creed {
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
    font-size: clamp(1.9rem, 5vw, 5.2rem);
    max-width: 92rem;
  }
  .hq3-creed-l {
    text-align: right;
    color: var(--hq3-paper);
    opacity: var(--gl);
    transform: translateX(calc((1 - var(--gl)) * -28px));
  }
  .hq3-creed-r {
    text-align: left;
    color: var(--hq3-ok);
    opacity: var(--gr);
    transform: scale(calc(1.14 - var(--gr) * 0.14));
    transform-origin: left center;
  }

  /* the authorization prompt */
  .hq3-prompt {
    position: relative;
    z-index: 2;
    width: min(46rem, 100%);
    border: 1px solid var(--hq3-line);
    background: var(--hq3-ink-2);
    opacity: var(--fr);
    transform: translateY(calc((1 - var(--fr)) * 16px));
  }
  .hq3-prompt-title {
    padding: 0.8rem 1.1rem;
    border-bottom: 1px solid var(--hq3-line);
    color: color-mix(in oklch, var(--hq3-paper) 80%, transparent);
  }
  .hq3-chips {
    display: flex;
    flex-direction: column;
  }
  .hq3-chip {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: baseline;
    gap: 0.7rem;
    font-family: var(--font-mono);
    font-size: 0.66rem;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    padding: 0.6rem 1.1rem;
    border-top: 1px solid color-mix(in oklch, var(--hq3-paper) 7%, transparent);
    color: color-mix(in oklch, var(--hq3-paper) 78%, transparent);
    opacity: var(--in, 0);
    transform: translateY(calc((1 - var(--in, 0)) * 10px));
  }
  .hq3-chip:first-child {
    border-top: 0;
  }
  .hq3-chip-label {
    min-width: 0;
  }
  .hq3-chip-stamp {
    display: inline-block;
    justify-self: end;
    padding: 0.15rem 0.45rem;
    border: 1px solid var(--hq3-ok);
    color: var(--hq3-ok);
    opacity: var(--stamp, 0);
    transform: scale(calc(1.25 - var(--stamp, 0) * 0.25));
  }
  .hq3-chip[data-verdict="refused"] .hq3-chip-stamp {
    border-color: var(--hq3-amber);
    color: var(--hq3-amber);
  }
  .hq3-prompt-keys {
    padding: 0.8rem 1.1rem;
    border-top: 1px solid var(--hq3-line);
    /* the key-ack: brightens toward the OK green as HUMANS APPROVE. lands */
    color: color-mix(in oklch, var(--hq3-ok) calc(var(--gr, 0) * 100%), var(--hq3-muted));
  }

  .hq3-gsub {
    position: relative;
    z-index: 2;
    max-width: 34rem;
    text-align: center;
    opacity: var(--gs);
    transform: translateY(calc((1 - var(--gs)) * 10px));
  }

  @media (max-width: 767px), (prefers-reduced-motion: reduce) {
    .hq3-gatepin {
      height: auto;
    }
    .hq3-gstage {
      position: static;
      height: auto;
      min-height: 0;
      padding: 6rem 1.5rem;
      gap: 2.2rem;
    }
    /* static composition: everything lands at its final state */
    .hq3-gkicker {
      opacity: 1;
    }
    .hq3-creed-l,
    .hq3-creed-r,
    .hq3-prompt,
    .hq3-chip,
    .hq3-chip-stamp,
    .hq3-gsub {
      opacity: 1;
      transform: none;
    }
    .hq3-prompt-keys {
      color: var(--hq3-ok);
    }
  }
  @media (max-width: 767px) {
    .hq3-creed {
      grid-template-columns: 1fr;
      gap: 0.6rem;
      text-align: center;
      font-size: clamp(2.3rem, 10vw, 4rem);
    }
    .hq3-creed-l,
    .hq3-creed-r {
      text-align: center;
    }
    .hq3-creed-r {
      transform-origin: center center;
    }
    .hq3-chip {
      grid-template-columns: auto 1fr;
    }
    .hq3-chip-label {
      white-space: normal;
    }
    .hq3-chip-stamp {
      grid-column: 2;
      justify-self: start;
    }
  }

  /* ============================ THE CLOSE ============================ */
  .hq3-final {
    position: relative;
    padding: 6rem 1.5rem;
    border-top: 1px solid var(--hq3-line);
  }
  @media (min-width: 640px) {
    .hq3-final {
      padding: 8rem 2.5rem;
    }
  }
  @media (min-width: 1024px) {
    .hq3-final {
      padding: 9rem 4rem;
    }
  }
  .hq3-fkicker {
    margin-bottom: 1.2rem;
  }
  .hq3-h2 {
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.03em;
    line-height: 0.9;
    font-size: clamp(2.4rem, 6.5vw, 5.4rem);
    color: var(--hq3-paper);
  }
  .hq3-body {
    margin-top: 1.6rem;
    max-width: 40rem;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    line-height: 1.75;
    color: color-mix(in oklch, var(--hq3-paper) 74%, transparent);
  }
  .hq3-final .hq3-cta-row {
    margin-top: 2.4rem;
  }

  /* ============================= FOOTER ============================= */
  .hq3-foot {
    border-top: 1px solid var(--hq3-line);
    padding: 4rem 1.5rem 5rem;
  }
  @media (min-width: 640px) {
    .hq3-foot {
      padding: 4.5rem 2.5rem 5.5rem;
    }
  }
  @media (min-width: 1024px) {
    .hq3-foot {
      padding: 4.5rem 4rem 5.5rem;
    }
  }
  .hq3-foot-grid {
    display: grid;
    gap: 2.5rem;
    grid-template-columns: 1fr;
  }
  @media (min-width: 768px) {
    .hq3-foot-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  .hq3-foot .hud {
    line-height: 2;
  }
  .hq3-foot-strong {
    color: var(--hq3-paper);
    margin-bottom: 0.6rem;
  }
  .hq3-foot-links a {
    transition: color 140ms ease;
  }
  .hq3-foot-links a:hover {
    color: var(--hq3-paper);
  }
  .hq3-foot-links a:first-child {
    color: var(--hq3-blue-text);
  }
  .hq3-foot-links a:first-child:hover {
    color: var(--hq3-paper);
  }
  .hq3-foot-last {
    text-align: left;
  }
  @media (min-width: 768px) {
    .hq3-foot-last {
      text-align: right;
    }
  }
</style>
