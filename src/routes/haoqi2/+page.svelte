<script lang="ts">
  import "$lib/haoqi2/haoqi2.css"
  import { reveal } from "$lib/actions/reveal"
  import { machine, gate } from "$lib/haoqi2/scene"
  import { STATIONS, GATE_CHIPS, LEDE, FIXTURES } from "$lib/haoqi2/copy"
  import HeroScene from "$lib/home/HeroScene.svelte"
</script>

<svelte:head>
  <title>Today OS · Acquire More Customers — the machine cut</title>
  <meta
    name="description"
    content="An alternate cut of the Today OS landing page drawn as a working instrument: one rough stone travels a five-station production line — Find, Pitch, Close, Run, Prove — and leaves as a polished gem. Agents propose. Humans approve."
  />
</svelte:head>

{#snippet gem(i: number)}
  {#if i === 0}
    <!-- rough stone -->
    <svg viewBox="0 0 100 100" role="presentation">
      <polygon
        points="50,12 73,24 84,50 70,84 33,83 17,55 25,25"
        fill="var(--hq2-stone)"
        stroke="var(--hq2-stone-edge)"
        stroke-width="1.5"
      />
      <path d="M33 34 L58 52 M62 30 L48 66" stroke="var(--hq2-stone-edge)" stroke-width="1" fill="none" />
    </svg>
  {:else if i === 1}
    <!-- scored: the facet plan is drawn on -->
    <svg viewBox="0 0 100 100" role="presentation">
      <polygon
        points="50,12 73,24 84,50 70,84 33,83 17,55 25,25"
        fill="var(--hq2-stone)"
        stroke="var(--hq2-stone-edge)"
        stroke-width="1.5"
      />
      <path
        d="M34 24 L66 24 M18 42 L82 42 M34 24 L50 46 L66 24 M18 42 L50 46 L82 42 M50 46 L50 84"
        stroke="var(--hq2-blue-line)"
        stroke-width="1.2"
        stroke-dasharray="4 3"
        fill="none"
      />
    </svg>
  {:else if i === 2}
    <!-- first cut: rough facets emerge -->
    <svg viewBox="0 0 100 100" role="presentation">
      <polygon points="50,14 74,24 84,48 72,82 28,82 16,48 26,24" fill="var(--hq2-gem-left-dim)" />
      <polygon points="50,14 74,24 50,50 26,24" fill="var(--hq2-gem-top-dim)" />
      <polygon points="16,48 26,24 50,50 28,82" fill="var(--hq2-gem-right-dim)" />
      <polygon points="50,50 74,24 84,48 72,82" fill="var(--hq2-gem-face-dim)" opacity="0.55" />
    </svg>
  {:else if i === 3}
    <!-- the gem, cut -->
    <svg viewBox="0 0 100 100" role="presentation">
      <polygon points="34,22 66,22 82,40 50,44 18,40" fill="var(--hq2-gem-top-dim)" />
      <polygon points="18,40 50,44 50,92" fill="var(--hq2-gem-left-dim)" />
      <polygon points="82,40 50,44 50,92" fill="var(--hq2-gem-right-dim)" />
      <polygon points="34,22 50,44 66,22" fill="var(--hq2-gem-face-dim)" />
    </svg>
  {:else}
    <!-- polished: bright facets + a specular streak -->
    <svg viewBox="0 0 100 100" role="presentation">
      <polygon points="34,22 66,22 82,40 50,44 18,40" fill="var(--hq2-gem-top)" />
      <polygon points="18,40 50,44 50,92" fill="var(--hq2-gem-left)" />
      <polygon points="82,40 50,44 50,92" fill="var(--hq2-gem-right)" />
      <polygon points="34,22 50,44 66,22" fill="var(--hq2-gem-face)" />
      <line x1="24" y1="16" x2="70" y2="60" stroke="var(--hq2-paper)" stroke-width="1.4" opacity="0.85" />
    </svg>
  {/if}
{/snippet}

<div class="hq2">
  <!-- ============================= HERO ============================= -->
  <header class="hq2-hero blueprint">
    <!-- the funnel vortex from the main LP: raw stones in, polished gems out -->
    <HeroScene />
    <span class="hq2-cross" style="left: 10%; top: 18%;" aria-hidden="true"></span>
    <span class="hq2-cross" style="right: 12%; bottom: 22%;" aria-hidden="true"></span>

    <div class="hq2-hero-inner">
      <p class="hud hq2-eyebrow hq2-fade" style="--d: 40;">
        <span class="hq2-livedot"></span>
        TODAY OS — THE OPERATING SYSTEM FOR PERFORMANCE MARKETING
      </p>

      <h1 class="hq2-h1">
        <span class="hq2-mask"><span class="hq2-rise" style="--d: 60;">Acquire</span></span>
        <span class="hq2-mask"><span class="hq2-rise" style="--d: 150;">More</span></span>
        <span class="hq2-mask"><span class="hq2-rise hq2-h1-blue" style="--d: 240;">Customers.</span></span>
      </h1>

      <!-- drafting annotation: the headline, dimensioned like a part -->
      <div class="hq2-dim" aria-hidden="true">
        <span class="hq2-dim-line hq2-draw" style="--d: 620;"></span>
        <span class="hud hq2-dim-label hq2-fade" style="--d: 860;">FIG. 01 — ACQUISITION ENGINE · SCALE 1:1</span>
      </div>

      <p class="hq2-lede hq2-fade" style="--d: 520;">{LEDE}</p>

      <div class="hq2-cta-row hq2-fade" style="--d: 640;">
        <a href="/os" class="hq2-btn hq2-btn--solid">Enter Today OS &rarr;</a>
        <a href="/readme" class="hq2-btn hq2-btn--ghost">See the contest entry</a>
      </div>
    </div>

    <!-- vertical spec annotation, desktop only -->
    <div class="hq2-spec hq2-fade" style="--d: 900;" aria-hidden="true">
      <span class="hq2-spec-line hq2-draw hq2-draw--v" style="--d: 760;"></span>
      <span class="hud hq2-spec-label">SPEC — FIVE MOVES · ONE SYSTEM</span>
    </div>

    <p class="hud hq2-scrollcue hq2-fade" style="--d: 1100;" aria-hidden="true">
      SCROLL — THE MACHINE IS BELOW <span class="hq2-nudge">&darr;</span>
    </p>
  </header>

  <!-- ====================== THE MACHINE (pinned) ====================== -->
  <section class="hq2-machine" use:machine aria-labelledby="hq2-lifecycle-h">
    <h2 id="hq2-lifecycle-h" class="hq2-mh">
      <span class="hud hq2-mh-kicker">SEC. 01 / THE LIFECYCLE</span>
      One machine.<br />Five stations.
    </h2>

    <!-- the pinned stage (decorative mirror of the station list below) -->
    <div class="hq2-mstage" aria-hidden="true">
      <div class="hq2-mhud">
        <span class="hud hq2-mhud-l">SEC. 01 / THE LIFECYCLE — RUNNING</span>
        <span class="hud hq2-mhud-c">STAGE <span data-count>01</span>/05</span>
        <span class="hud hq2-mhud-r">{FIXTURES}</span>
      </div>
      <span class="hq2-prog"><span class="hq2-prog-fill"></span></span>

      <div class="hq2-verbwrap">
        {#each STATIONS as s (s.n)}
          <span class="hq2-verb" data-verb>{s.verb}</span>
        {/each}
      </div>
      <div class="hq2-linewrap">
        {#each STATIONS as s (s.n)}
          <p class="hq2-mline" data-line>{s.line}</p>
        {/each}
      </div>

      <div class="hq2-track" data-track>
        <span class="hq2-rail"></span>
        <span class="hq2-rail hq2-rail--lit"></span>
        {#each STATIONS as s, i (s.n)}
          <span class="hq2-station" data-station style="left: {(i + 0.5) * 20}%;">
            <span class="hq2-scan"></span>
            <span class="hq2-node"></span>
            <span class="hud hq2-slabel">{s.n} · {s.verb}</span>
            <span class="hud hq2-sread">{s.read}</span>
          </span>
        {/each}
        <div class="hq2-piece" data-piece>
          {#each STATIONS as s, i (s.n)}
            <span class="hq2-state" class:hq2-glint={i === 4} data-state>
              {@render gem(i)}
            </span>
          {/each}
        </div>
      </div>

      <p class="hud hq2-output">
        OUTPUT: CUSTOMER ACQUIRED · <span class="hq2-output-blue">LEDGER +</span> · LOOP RE-ARMED — NEXT PASS QUEUED
      </p>

      <!-- power-down: the stage darkens to ink, the rail flashes into one hot
           line, the line collapses to a dot, the dot blinks out (CRT-off) —
           so the un-pin scrolls flat ink against the gate section's flat ink -->
      <div class="hq2-shutveil" aria-hidden="true"></div>
      <div class="hq2-shutline" aria-hidden="true"></div>
      <span class="hq2-shutdot" aria-hidden="true"></span>
    </div>

    <!-- the five stations in flow: screen readers always, small screens and
         reduced motion visually -->
    <ol class="hq2-mlist">
      {#each STATIONS as s, i (s.n)}
        <li class="hq2-mrow" use:reveal={{ animation: "fade-in", delay: i * 0.08 }}>
          <span class="hq2-mrow-gem" aria-hidden="true">{@render gem(i)}</span>
          <div class="hq2-mrow-copy">
            <span class="hud hq2-mrow-meta">{s.n} / {s.read}</span>
            <h3 class="hq2-mrow-verb">{s.verb}</h3>
            <p class="hq2-mrow-line">{s.line}</p>
          </div>
        </li>
      {/each}
    </ol>
  </section>

  <!-- ======================= THE CREED (pinned) ======================= -->
  <section class="hq2-gatepin" use:gate aria-labelledby="hq2-creed-h">
    <div class="hq2-gstage">
      <p class="hud hq2-gkicker">SEC. 02 / THE CREED</p>

      <span class="hq2-gline" aria-hidden="true"></span>

      <h2 id="hq2-creed-h" class="hq2-creed">
        <span class="hq2-creed-l">Agents propose.</span>
        <span class="hq2-creed-r">Humans approve.</span>
      </h2>

      <ul class="hq2-chips">
        {#each GATE_CHIPS as c (c.label)}
          <li class="hq2-chip" data-chip data-verdict={c.verdict}>
            <span class="hq2-chip-label">{c.label}</span>
            <span class="hq2-chip-stamp">{c.stamp}</span>
          </li>
        {/each}
      </ul>

      <p class="hud hq2-gsub">
        EVERY AGENT FIX PASSES A SPEND-CAP GATE — NOTHING UNSAFE SHIPS WITHOUT A HUMAN AT THE SWITCH.
      </p>
    </div>
  </section>

  <!-- ============================ THE CLOSE ============================ -->
  <section class="hq2-final" aria-labelledby="hq2-close-h">
    <div use:reveal>
      <p class="hud hq2-fkicker">SEC. 03 / THE CLOSE</p>
      <h2 id="hq2-close-h" class="hq2-h2">Built inside the<br />Build Challenge.</h2>
      <p class="hq2-body">
        The case study, the contest entry, and the product are the same object: Today OS was built
        inside It&rsquo;s Today Media&rsquo;s Build Challenge, on It&rsquo;s Today Media&rsquo;s own
        domain. Everything above runs on sample data — labeled sample. The README answers what it
        does, why this one, and what I&rsquo;d build next.
      </p>
      <div class="hq2-cta-row">
        <a href="/os" class="hq2-btn hq2-btn--solid">Enter Today OS &rarr;</a>
        <a href="/readme" class="hq2-btn hq2-btn--ghost">Read the thinking (README)</a>
      </div>
    </div>
  </section>

  <!-- ============================= FOOTER ============================= -->
  <footer class="hq2-foot">
    <div class="hq2-foot-grid">
      <div>
        <p class="hud hq2-foot-strong">IT&rsquo;S TODAY MEDIA, LLC</p>
        <p class="hud">12 W MADISON ST<br />BALTIMORE, MD 21201</p>
      </div>
      <div>
        <p class="hud hq2-foot-strong">POSITION</p>
        <p class="hud">39.2977&deg; N<br />76.6157&deg; W</p>
      </div>
      <div>
        <p class="hud hq2-foot-strong">INDEX</p>
        <p class="hud hq2-foot-links">
          <a href="/">BACK TO THE MAIN SITE</a><br />
          <a href="/os">ENTER TODAY OS</a><br />
          <a href="/readme">README</a><br />
          <a href="/haoqi">FIRST CUT (/HAOQI)</a>
        </p>
      </div>
      <div class="hq2-foot-last">
        <p class="hud">
          TODAY OS · MACHINE CUT<br />AN ALTERNATE LANDING — REACHED<br />DIRECTLY AT /HAOQI2
        </p>
      </div>
    </div>
  </footer>
</div>

<style>
  /* ── route-local palette (scoped; never touches global tokens) ── */
  .hq2 {
    --hq2-ink: oklch(11.5% 0.015 262);
    --hq2-ink-2: oklch(14.5% 0.016 262);
    --hq2-paper: oklch(97% 0.006 250);
    --hq2-blue: oklch(58% 0.245 262);
    --hq2-blue-text: oklch(66% 0.21 260);
    --hq2-blue-deep: oklch(34% 0.17 264);
    --hq2-blue-line: oklch(58% 0.245 262 / 0.55);
    --hq2-amber: oklch(78% 0.12 85);
    --hq2-line: color-mix(in oklch, var(--hq2-paper) 14%, transparent);
    --hq2-muted: color-mix(in oklch, var(--hq2-paper) 60%, transparent);

    /* workpiece: stone → gem */
    --hq2-stone: oklch(36% 0.018 258);
    --hq2-stone-edge: oklch(52% 0.02 258);
    --hq2-gem-top-dim: oklch(62% 0.11 250);
    --hq2-gem-face-dim: oklch(82% 0.05 250);
    --hq2-gem-left-dim: oklch(38% 0.15 268);
    --hq2-gem-right-dim: oklch(48% 0.14 262);
    --hq2-gem-top: oklch(82% 0.13 246);
    --hq2-gem-face: oklch(97% 0.02 250);
    --hq2-gem-left: oklch(46% 0.24 270);
    --hq2-gem-right: oklch(60% 0.22 264);

    position: relative;
    isolation: isolate;
    min-height: 100vh;
    background: var(--hq2-ink);
    color: var(--hq2-paper);
    font-family: var(--font-display);
    overflow-x: clip;
  }

  /* registration cross — drafting tick */
  .hq2-cross {
    position: absolute;
    width: 17px;
    height: 17px;
    pointer-events: none;
    color: color-mix(in oklch, var(--hq2-paper) 26%, transparent);
  }
  .hq2-cross::before,
  .hq2-cross::after {
    content: "";
    position: absolute;
    background: currentColor;
  }
  .hq2-cross::before {
    left: 8px;
    top: 0;
    width: 1px;
    height: 17px;
  }
  .hq2-cross::after {
    top: 8px;
    left: 0;
    height: 1px;
    width: 17px;
  }
  @media (max-width: 640px) {
    /* the marks collide with the wrapped eyebrow + headline on phones */
    .hq2-cross {
      display: none;
    }
  }

  /* ============================= HERO ============================= */
  .hq2-hero {
    position: relative;
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    padding: 4.5rem 1.5rem 5rem;
  }
  .hq2-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(110% 80% at 18% 0%, var(--hq2-blue-deep) 0%, transparent 52%);
    opacity: 0.55;
  }
  @media (min-width: 640px) {
    .hq2-hero {
      padding: 5rem 2.5rem 5rem;
    }
  }
  @media (min-width: 1024px) {
    .hq2-hero {
      padding: 5.5rem 4rem 5.5rem;
    }
  }

  .hq2-hero-inner {
    position: relative;
    z-index: 2;
    max-width: 64rem;
  }

  .hq2-eyebrow {
    display: inline-flex;
    align-items: flex-start;
    gap: 0.55rem;
    color: color-mix(in oklch, var(--hq2-paper) 78%, transparent);
    margin-bottom: 1.4rem;
  }
  .hq2-livedot {
    flex: 0 0 auto;
    width: 6px;
    height: 6px;
    margin-top: 0.28em; /* optically centers on the first line when the label wraps */
    border-radius: 9999px;
    background: var(--hq2-blue-text);
  }

  .hq2-h1 {
    display: flex;
    flex-direction: column;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.045em;
    line-height: 0.88;
    /* vh term keeps the whole hero (headline + lede + CTAs) above the fold on
       short viewports; vw term rules on tall ones */
    font-size: clamp(2.7rem, min(11vw, 17vh), 10.5rem);
    color: var(--hq2-paper);
  }
  .hq2-mask {
    display: block;
    overflow: hidden;
    padding-bottom: 0.06em; /* keep descender-free caps from clipping at tight line-height */
    margin-bottom: -0.06em;
  }
  .hq2-rise {
    display: block;
  }
  .hq2-h1-blue {
    color: var(--hq2-blue-text);
  }

  /* drafting dimension under the headline */
  .hq2-dim {
    margin-top: 1.2rem;
    max-width: 46rem;
  }
  .hq2-dim-line {
    display: block;
    position: relative;
    height: 1px;
    background: color-mix(in oklch, var(--hq2-paper) 34%, transparent);
    transform-origin: left center;
  }
  .hq2-dim-line::before,
  .hq2-dim-line::after {
    content: "";
    position: absolute;
    top: -4px;
    width: 1px;
    height: 9px;
    background: color-mix(in oklch, var(--hq2-paper) 34%, transparent);
  }
  .hq2-dim-line::before {
    left: 0;
  }
  .hq2-dim-line::after {
    right: 0;
  }
  .hq2-dim-label {
    display: inline-block;
    margin-top: 0.7rem;
    color: var(--hq2-muted);
  }

  .hq2-lede {
    margin-top: 1.6rem;
    max-width: 34rem;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    line-height: 1.7;
    color: color-mix(in oklch, var(--hq2-paper) 76%, transparent);
  }

  .hq2-cta-row {
    margin-top: 2rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem 1.4rem;
  }

  /* buttons — hardware-flat, square, mono label */
  .hq2-btn {
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.09em;
    font-size: 0.78rem;
    padding: 0.95rem 1.7rem;
    border: 1px solid var(--hq2-line);
    transition:
      transform 120ms cubic-bezier(0.25, 1, 0.5, 1),
      background-color 160ms ease,
      color 160ms ease,
      border-color 160ms ease;
  }
  .hq2-btn--solid {
    background: var(--hq2-blue);
    border-color: var(--hq2-blue);
    color: var(--hq2-paper);
  }
  .hq2-btn--solid:hover {
    background: oklch(64% 0.25 262);
    border-color: oklch(64% 0.25 262);
  }
  .hq2-btn--ghost {
    color: color-mix(in oklch, var(--hq2-paper) 82%, transparent);
    background: color-mix(in oklch, var(--hq2-paper) 4%, transparent);
  }
  .hq2-btn--ghost:hover {
    color: var(--hq2-paper);
    border-color: color-mix(in oklch, var(--hq2-paper) 42%, transparent);
  }
  @media (prefers-reduced-motion: no-preference) {
    .hq2-btn:active {
      transform: scale(0.97);
    }
  }

  /* vertical spec annotation (right edge, desktop only) */
  .hq2-spec {
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
    .hq2-spec {
      display: flex;
    }
  }
  .hq2-spec-line {
    width: 1px;
    height: clamp(10rem, 26vh, 16rem);
    background: color-mix(in oklch, var(--hq2-paper) 30%, transparent);
    transform-origin: center top;
  }
  .hq2-spec-label {
    writing-mode: vertical-rl;
    color: var(--hq2-muted);
  }

  .hq2-scrollcue {
    position: absolute;
    left: 1.5rem;
    bottom: 1.6rem;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--hq2-muted);
  }
  .hq2-nudge {
    display: inline-block;
    color: var(--hq2-blue-text);
  }
  @media (min-width: 640px) {
    .hq2-scrollcue {
      left: 2.5rem;
    }
  }

  /* ========================== THE MACHINE ========================== */
  .hq2-machine {
    position: relative;
    height: 560vh; /* extra ~100vh feeds the zoom-into-the-gem beat */
    border-top: 1px solid var(--hq2-line);
    /* phase vars written by the machine action */
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
  .hq2-mh {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  .hq2-mh-kicker {
    display: block;
    margin-bottom: 1rem;
  }

  .hq2-mstage {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
    background:
      radial-gradient(90% 70% at 82% 108%, var(--hq2-blue-deep) 0%, transparent 55%),
      var(--hq2-ink-2);
  }

  /* HUD bar */
  .hq2-mhud {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1.5rem;
    padding: 1.4rem 1.5rem 1.1rem;
    opacity: calc(1 - var(--zf, 0));
  }
  @media (min-width: 640px) {
    .hq2-mhud {
      /* extra right padding clears the fixed theme-toggle chrome in the corner */
      padding: 1.6rem 5.5rem 1.2rem 2.5rem;
    }
  }
  .hq2-mhud-l {
    color: var(--hq2-muted);
  }
  .hq2-mhud-c {
    color: var(--hq2-paper);
  }
  .hq2-mhud-r {
    color: var(--hq2-muted);
    display: none;
  }
  @media (min-width: 1024px) {
    .hq2-mhud-r {
      display: inline;
    }
  }

  .hq2-prog {
    position: absolute;
    top: 4.1rem;
    left: 1.5rem;
    right: 1.5rem;
    height: 1px;
    background: var(--hq2-line);
    opacity: calc(1 - var(--zf, 0));
  }
  @media (min-width: 640px) {
    .hq2-prog {
      left: 2.5rem;
      right: 2.5rem;
      top: 4.4rem;
    }
  }
  .hq2-prog-fill {
    position: absolute;
    inset: 0;
    background: var(--hq2-blue);
    transform: scaleX(var(--p));
    transform-origin: left center;
  }

  /* big verb + line (stacked crossfade) */
  .hq2-verbwrap {
    position: absolute;
    left: 1.5rem;
    top: 17vh;
    display: grid;
    opacity: calc(1 - var(--zf, 0));
  }
  .hq2-linewrap {
    position: absolute;
    left: 1.5rem;
    top: calc(17vh + clamp(4rem, 10vw, 8.5rem));
    display: grid;
    max-width: min(42rem, 82vw);
    opacity: calc(1 - var(--zf, 0));
  }
  @media (min-width: 640px) {
    .hq2-verbwrap,
    .hq2-linewrap {
      left: 2.5rem;
    }
  }
  @media (min-width: 1024px) {
    .hq2-verbwrap,
    .hq2-linewrap {
      left: 4rem;
    }
  }
  .hq2-verb,
  .hq2-mline {
    grid-area: 1 / 1;
    opacity: var(--o, 0);
    transform: translateY(calc((1 - var(--o, 0)) * 14px));
  }
  .hq2-verb:first-child,
  .hq2-mline:first-child {
    --o: 1;
  }
  .hq2-verb {
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.04em;
    line-height: 0.9;
    font-size: clamp(3.4rem, 10vw, 8.5rem);
    color: var(--hq2-paper);
  }
  .hq2-mline {
    font-family: var(--font-mono);
    font-size: 0.88rem;
    line-height: 1.7;
    color: color-mix(in oklch, var(--hq2-paper) 72%, transparent);
  }

  /* the track */
  .hq2-track {
    position: absolute;
    left: 1.5rem;
    right: 1.5rem;
    top: 68vh;
    height: 0;
  }
  @media (min-width: 640px) {
    .hq2-track {
      left: 2.5rem;
      right: 2.5rem;
    }
  }
  @media (min-width: 1024px) {
    .hq2-track {
      left: 4rem;
      right: 4rem;
    }
  }
  .hq2-rail {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 1px;
    background: var(--hq2-line);
    opacity: calc(1 - var(--zf, 0));
  }
  .hq2-rail--lit {
    background: var(--hq2-blue);
    transform: scaleX(var(--p));
    transform-origin: left center;
  }

  .hq2-station {
    position: absolute;
    top: 0;
    /* --a (activation) and --done written per-station by the action */
    opacity: calc(1 - var(--zf, 0));
  }
  .hq2-scan {
    position: absolute;
    left: 0;
    top: -13vh;
    width: 1px;
    height: 26vh;
    background: var(--hq2-blue-text);
    opacity: calc(var(--a, 0) * 0.9);
  }
  .hq2-node {
    position: absolute;
    left: -4px;
    top: -4px;
    width: 9px;
    height: 9px;
    border: 1px solid color-mix(in oklch, var(--hq2-paper) 45%, transparent);
    background: color-mix(in oklch, var(--hq2-blue) calc(var(--done, 0) * 100%), var(--hq2-ink-2));
    transform: rotate(45deg) scale(calc(1 + var(--a, 0) * 0.5));
  }
  .hq2-slabel {
    position: absolute;
    left: 0;
    top: 1.4rem;
    transform: translateX(-50%);
    white-space: nowrap;
    color: color-mix(
      in oklch,
      var(--hq2-paper) calc(48% + var(--a, 0) * 44%),
      transparent
    );
  }
  .hq2-sread {
    position: absolute;
    left: 0;
    top: 2.9rem;
    transform: translateX(-50%);
    white-space: nowrap;
    color: var(--hq2-blue-text);
    opacity: calc(var(--a, 0) * 0.9 + var(--done, 0) * 0.35);
  }

  /* the workpiece */
  .hq2-piece {
    position: absolute;
    left: 0;
    top: 0;
    width: clamp(58px, 7vw, 96px);
    height: clamp(58px, 7vw, 96px);
    transform: translate3d(0, 0, 0) translate(-50%, -50%);
    will-change: transform;
  }
  .hq2-state {
    position: absolute;
    inset: 0;
    display: block;
    overflow: hidden;
    opacity: var(--m, 0);
  }
  .hq2-state:first-child {
    --m: 1;
  }
  .hq2-state :global(svg) {
    display: block;
    width: 100%;
    height: 100%;
  }
  .hq2-state.hq2-glint {
    filter: drop-shadow(0 0 18px color-mix(in oklch, var(--hq2-blue) 55%, transparent));
  }
  .hq2-state.hq2-glint::after {
    content: "";
    position: absolute;
    inset: 0;
    width: 45%;
    background: linear-gradient(
      90deg,
      transparent,
      color-mix(in oklch, var(--hq2-paper) 80%, transparent),
      transparent
    );
    opacity: 0;
    transform: translateX(-130%) skewX(-20deg);
  }

  .hq2-output {
    position: absolute;
    left: 50%;
    bottom: 9vh;
    transform: translateX(-50%) translateY(calc((1 - var(--out)) * 12px));
    opacity: calc(var(--out) * (1 - var(--zf, 0)));
    white-space: nowrap;
    color: color-mix(in oklch, var(--hq2-paper) 80%, transparent);
  }
  .hq2-output-blue {
    color: var(--hq2-blue-text);
  }

  /* ── the power-down beat (CRT-off) ── */
  /* ink veil: the whole stage fades to flat ink so the un-pin scrolls
     ink-against-ink into the gate section — no visible seam */
  .hq2-shutveil {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: var(--hq2-ink);
    opacity: var(--zv, 0);
  }
  /* the hot line: the machine's rail, condensed — flashes across the center
     then collapses from both ends toward the middle */
  .hq2-shutline {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 2px;
    pointer-events: none;
    background: linear-gradient(
      90deg,
      transparent,
      var(--hq2-blue-text) 18%,
      var(--hq2-paper) 50%,
      var(--hq2-blue-text) 82%,
      transparent
    );
    box-shadow: 0 0 18px 1px color-mix(in oklch, var(--hq2-blue) 65%, transparent);
    transform: translateY(-50%) scaleX(var(--zl, 0));
    transform-origin: center center;
    opacity: var(--zlo, 0);
  }
  /* the residue dot: everything the machine did, held in one point of light —
     it blinks out, and the gate section's vertical hairline inherits the spot */
  .hq2-shutdot {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 7px;
    height: 7px;
    border-radius: 9999px;
    pointer-events: none;
    background: var(--hq2-paper);
    box-shadow: 0 0 22px 7px color-mix(in oklch, var(--hq2-blue) 75%, transparent);
    transform: translate(-50%, -50%) scale(var(--zd, 0));
    opacity: var(--zdo, 0);
  }

  /* the in-flow station list: hidden visually on the pinned desktop stage,
     the real composition on small screens / reduced motion */
  .hq2-mlist {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }

  @media (max-width: 767px), (prefers-reduced-motion: reduce) {
    .hq2-machine {
      height: auto;
      padding: 5.5rem 1.5rem 6rem;
    }
    .hq2-mstage {
      display: none;
    }
    .hq2-mh {
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
    .hq2-mlist {
      position: static;
      width: auto;
      height: auto;
      overflow: visible;
      clip-path: none;
      display: flex;
      flex-direction: column;
      border: 1px solid var(--hq2-line);
    }
    .hq2-mrow {
      display: flex;
      gap: 1.2rem;
      align-items: flex-start;
      padding: 1.5rem 1.3rem;
      border-top: 1px solid var(--hq2-line);
    }
    .hq2-mrow:first-child {
      border-top: 0;
    }
    .hq2-mrow-gem {
      flex: 0 0 auto;
      width: 52px;
      height: 52px;
    }
    .hq2-mrow-gem :global(svg) {
      display: block;
      width: 100%;
      height: 100%;
    }
    .hq2-mrow-copy {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .hq2-mrow-meta {
      color: var(--hq2-blue-text);
    }
    .hq2-mrow-verb {
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: -0.02em;
      line-height: 1;
      font-size: clamp(1.7rem, 6vw, 2.6rem);
      color: var(--hq2-paper);
    }
    .hq2-mrow-line {
      font-family: var(--font-mono);
      font-size: 0.84rem;
      line-height: 1.65;
      color: color-mix(in oklch, var(--hq2-paper) 70%, transparent);
      max-width: 44rem;
    }
  }
  @media (min-width: 768px) and (prefers-reduced-motion: reduce) {
    .hq2-machine {
      padding: 6rem 4rem 7rem;
    }
  }

  /* =========================== THE CREED =========================== */
  .hq2-gatepin {
    position: relative;
    height: 230vh;
    /* no border-top: the machine's zoom cover exits on flat ink and this
       section opens on flat ink — a hairline here would re-draw the seam */
    /* phase vars written by the gate action */
    --g: 0;
    --gl: 0;
    --gate: 0;
    --gr: 0;
    --gs: 0;
  }
  .hq2-gstage {
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
    background: var(--hq2-ink);
  }
  .hq2-gkicker {
    color: var(--hq2-muted);
    opacity: calc(0.4 + var(--gl) * 0.6);
  }

  /* the gate hairline */
  .hq2-gline {
    position: absolute;
    left: 50%;
    top: 14vh;
    bottom: 14vh;
    width: 1px;
    background: color-mix(
      in oklch,
      var(--hq2-blue) calc(30% + var(--gate) * 70%),
      var(--hq2-line)
    );
    transform: scaleY(var(--gate));
    transform-origin: center top;
    opacity: calc(0.35 + var(--gate) * 0.65);
  }

  .hq2-creed {
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
  .hq2-creed-l {
    text-align: right;
    color: var(--hq2-paper);
    opacity: var(--gl);
    transform: translateX(calc((1 - var(--gl)) * -28px));
  }
  .hq2-creed-r {
    text-align: left;
    color: var(--hq2-blue-text);
    opacity: var(--gr);
    transform: scale(calc(1.14 - var(--gr) * 0.14));
    transform-origin: left center;
  }

  /* proposal chips queuing at the gate */
  .hq2-chips {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.7rem;
    --cross: clamp(120px, 22vw, 260px);
  }
  .hq2-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.7rem;
    font-family: var(--font-mono);
    font-size: 0.66rem;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    padding: 0.55rem 0.85rem;
    border: 1px solid var(--hq2-line);
    background: var(--hq2-ink-2);
    color: color-mix(in oklch, var(--hq2-paper) 78%, transparent);
    white-space: nowrap;
    opacity: var(--in, 0);
    transform: translateX(calc(var(--cross) * -1 + var(--c, 0) * 2 * var(--cross)))
      translateY(calc((1 - var(--in, 0)) * 10px));
  }
  .hq2-chip[data-verdict="refused"] {
    border-color: color-mix(in oklch, var(--hq2-amber) calc(var(--stamp, 0) * 70%), var(--hq2-line));
  }
  .hq2-chip-stamp {
    display: inline-block;
    padding: 0.15rem 0.45rem;
    border: 1px solid var(--hq2-blue-text);
    color: var(--hq2-blue-text);
    opacity: var(--stamp, 0);
    transform: scale(calc(1.25 - var(--stamp, 0) * 0.25));
  }
  .hq2-chip[data-verdict="refused"] .hq2-chip-stamp {
    border-color: var(--hq2-amber);
    color: var(--hq2-amber);
  }

  .hq2-gsub {
    position: relative;
    z-index: 2;
    max-width: 34rem;
    text-align: center;
    color: var(--hq2-muted);
    opacity: var(--gs);
    transform: translateY(calc((1 - var(--gs)) * 10px));
  }

  @media (max-width: 767px) {
    .hq2-gatepin {
      height: 190vh;
    }
    .hq2-gstage {
      gap: 2.2rem;
    }
    .hq2-gline {
      display: none;
    }
    .hq2-creed {
      grid-template-columns: 1fr;
      gap: 0.6rem;
      text-align: center;
      font-size: clamp(2.3rem, 10vw, 4rem);
    }
    .hq2-creed-l,
    .hq2-creed-r {
      text-align: center;
    }
    .hq2-creed-r {
      transform-origin: center center;
    }
    .hq2-chips {
      --cross: clamp(10px, 4vw, 22px);
    }
    .hq2-chip {
      white-space: normal;
      text-align: left;
      max-width: 82vw;
    }
  }

  /* reduced motion: no pin, calm static composition (vars land at 1) */
  @media (prefers-reduced-motion: reduce) {
    .hq2-gatepin {
      height: auto;
    }
    .hq2-gstage {
      position: static;
      height: auto;
      min-height: 0;
      padding: 6rem 1.5rem;
    }
  }

  /* ============================ THE CLOSE ============================ */
  .hq2-final {
    position: relative;
    padding: 6rem 1.5rem;
    border-top: 1px solid var(--hq2-line);
  }
  @media (min-width: 640px) {
    .hq2-final {
      padding: 8rem 2.5rem;
    }
  }
  @media (min-width: 1024px) {
    .hq2-final {
      padding: 9rem 4rem;
    }
  }
  .hq2-fkicker {
    color: var(--hq2-muted);
    margin-bottom: 1.2rem;
  }
  .hq2-h2 {
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.03em;
    line-height: 0.9;
    font-size: clamp(2.4rem, 6.5vw, 5.4rem);
    color: var(--hq2-paper);
  }
  .hq2-body {
    margin-top: 1.6rem;
    max-width: 40rem;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    line-height: 1.75;
    color: color-mix(in oklch, var(--hq2-paper) 74%, transparent);
  }
  .hq2-final .hq2-cta-row {
    margin-top: 2.4rem;
  }

  /* ============================= FOOTER ============================= */
  .hq2-foot {
    border-top: 1px solid var(--hq2-line);
    padding: 4rem 1.5rem 5rem;
  }
  @media (min-width: 640px) {
    .hq2-foot {
      padding: 4.5rem 2.5rem 5.5rem;
    }
  }
  @media (min-width: 1024px) {
    .hq2-foot {
      padding: 4.5rem 4rem 5.5rem;
    }
  }
  .hq2-foot-grid {
    display: grid;
    gap: 2.5rem;
    grid-template-columns: 1fr;
  }
  @media (min-width: 768px) {
    .hq2-foot-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  .hq2-foot .hud {
    line-height: 2;
  }
  .hq2-foot-strong {
    color: var(--hq2-paper);
    margin-bottom: 0.6rem;
  }
  .hq2-foot-links a {
    transition: color 140ms ease;
  }
  .hq2-foot-links a:hover {
    color: var(--hq2-paper);
  }
  .hq2-foot-links a:first-child {
    color: var(--hq2-blue-text);
  }
  .hq2-foot-links a:first-child:hover {
    color: var(--hq2-paper);
  }
  .hq2-foot-last {
    text-align: left;
  }
  @media (min-width: 768px) {
    .hq2-foot-last {
      text-align: right;
    }
  }
</style>
