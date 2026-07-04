<script lang="ts">
  import "$lib/haoqi4/haoqi4.css"
  import { reveal } from "$lib/actions/reveal"
  import { diagram, approval } from "$lib/haoqi4/scene"
  import {
    STATIONS,
    GATE_CHIPS,
    LEDE,
    FIXTURES,
    TITLE_BLOCK,
    REV_LETTERS,
    ASSEMBLY_CAPTION,
    PART_LIFT,
  } from "$lib/haoqi4/copy"

  /** Caption zones of the pinned scene: one per part + the assembly beat. */
  const CAPTIONS = [...STATIONS.map((s) => ({ verb: s.verb, line: s.line })), ASSEMBLY_CAPTION]
</script>

<svelte:head>
  <title>Today OS · Acquire More Customers — the blueprint cut</title>
  <meta
    name="description"
    content="An alternate cut of the Today OS landing page drawn as an engineering blueprint: the acquisition engine appears as an exploded technical drawing — Find, Pitch, Close, Run, Prove — that assembles itself as you scroll, then takes its approval stamp. Agents propose. Humans approve."
  />
</svelte:head>

{#snippet part(i: number)}
  {#if i === 0}
    <!-- FIND — the scanner head: dish, crosshair, sweep, blip -->
    <svg class="hq4-partsvg" viewBox="0 0 120 120" role="presentation" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path class="d1" pathLength="1" d="M40 104 H80 M60 104 V82" />
      <circle class="d2" pathLength="1" cx="60" cy="52" r="30" />
      <path class="d3" pathLength="1" d="M60 30 V74 M38 52 H82" />
      <path class="d4" pathLength="1" d="M60 52 L80 36" />
      <circle class="d4" pathLength="1" cx="84" cy="33" r="3" />
    </svg>
  {:else if i === 1}
    <!-- PITCH — the projector: one reel pair, one lens, a widening beam -->
    <svg class="hq4-partsvg" viewBox="0 0 120 120" role="presentation" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path class="d1" pathLength="1" d="M16 44 H56 V78 H16 Z" />
      <circle class="d2" pathLength="1" cx="27" cy="33" r="9" />
      <circle class="d2" pathLength="1" cx="46" cy="33" r="9" />
      <circle class="d3" pathLength="1" cx="60" cy="61" r="6" />
      <path class="d4" pathLength="1" d="M68 55 L104 38 M68 67 L104 84 M104 38 V84" />
    </svg>
  {:else if i === 2}
    <!-- CLOSE — the clamp: screw, two jaws closing on the deal -->
    <svg class="hq4-partsvg" viewBox="0 0 120 120" role="presentation" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path class="d1" pathLength="1" d="M60 10 V28 M48 10 H72" />
      <path class="d2" pathLength="1" d="M32 28 H88 L78 48 H42 Z" />
      <path class="d3" pathLength="1" d="M32 94 H88 L78 74 H42 Z" />
      <path class="d4" pathLength="1" d="M60 54 L71 61 L60 68 L49 61 Z" />
    </svg>
  {:else if i === 3}
    <!-- RUN — the governor: gear, teeth, hub, and the spend-cap gate bar -->
    <svg class="hq4-partsvg" viewBox="0 0 120 120" role="presentation" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <circle class="d1" pathLength="1" cx="50" cy="61" r="28" />
      <path class="d2" pathLength="1" d="M50 33 V25 M50 89 V97 M22 61 H14 M78 61 H86 M30 41 L24 35 M70 41 L76 35 M30 81 L24 87 M70 81 L76 87" />
      <circle class="d3" pathLength="1" cx="50" cy="61" r="8" />
      <path class="d4" pathLength="1" d="M98 33 V89 M98 47 H106 M98 75 H106" />
    </svg>
  {:else}
    <!-- PROVE — the ledger register: frame, header rule, tallies, the plus -->
    <svg class="hq4-partsvg" viewBox="0 0 120 120" role="presentation" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path class="d1" pathLength="1" d="M20 30 H100 V92 H20 Z" />
      <path class="d2" pathLength="1" d="M20 44 H100" />
      <path class="d3" pathLength="1" d="M28 56 H70 M28 66 H62 M28 76 H74" />
      <path class="d4" pathLength="1" d="M87 60 V76 M79 68 H95" />
    </svg>
  {/if}
{/snippet}

<div class="hq4">
  <!-- the drawing frame: a fixed sheet border with registration crosses -->
  <div class="hq4-frame hq4-fade" style="--d: 160;" aria-hidden="true">
    <span class="hq4-cross" style="left: -9px; top: -9px;"></span>
    <span class="hq4-cross" style="right: -9px; top: -9px;"></span>
    <span class="hq4-cross" style="left: -9px; bottom: -9px;"></span>
    <span class="hq4-cross" style="right: -9px; bottom: -9px;"></span>
  </div>

  <!-- ============================= HERO ============================= -->
  <header class="hq4-hero">
    <span class="hq4-cross" style="left: 8%; top: 15%;" aria-hidden="true"></span>
    <span class="hq4-cross" style="right: 11%; bottom: 27%;" aria-hidden="true"></span>

    <div class="hq4-hero-inner">
      <p class="hud hq4-eyebrow hq4-fade" style="--d: 40;">
        <span class="hq4-livedot"></span>
        TODAY OS — THE OPERATING SYSTEM FOR PERFORMANCE MARKETING · DWG № TOS-LP-04
      </p>

      <div class="hq4-titlewrap">
        <h1 class="hq4-h1">
          <span class="hq4-mask"><span class="hq4-rise" style="--d: 60;">Acquire</span></span>
          <span class="hq4-mask"><span class="hq4-rise" style="--d: 150;">More</span></span>
          <span class="hq4-mask"><span class="hq4-rise hq4-h1-bright" style="--d: 240;">Customers.</span></span>
        </h1>

        <!-- vertical dimension: the drawing's title, measured like a part -->
        <div class="hq4-vdim" aria-hidden="true">
          <span class="hq4-vdim-line hq4-draw hq4-draw--v" style="--d: 720;"></span>
          <span class="hud hq4-vdim-label hq4-fade" style="--d: 960;">DIM — 3 LINES · 800 WT · UPPERCASE</span>
        </div>
      </div>

      <!-- horizontal dimension under the title -->
      <div class="hq4-dim" aria-hidden="true">
        <span class="hq4-dim-line hq4-draw" style="--d: 620;"></span>
        <span class="hud hq4-dim-label hq4-fade" style="--d: 860;">
          FIG. 01 — ACQUISITION ENGINE · SCALE 1:1 · SEE SEC. 01 FOR EXPLODED VIEW
        </span>
      </div>

      <p class="hq4-lede hq4-fade" style="--d: 520;">{LEDE}</p>

      <div class="hq4-cta-row hq4-fade" style="--d: 640;">
        <a href="/os" class="hq4-btn hq4-btn--solid">Enter Today OS &rarr;</a>
        <a href="/readme" class="hq4-btn hq4-btn--ghost">See the contest entry</a>
      </div>
    </div>

    <p class="hud hq4-scrollcue hq4-fade" style="--d: 1100;" aria-hidden="true">
      SCROLL — THE SHEET IS DRAWN BELOW <span class="hq4-nudge">&darr;</span>
    </p>
  </header>

  <!-- ========================= TITLE BLOCK ========================= -->
  <div class="hq4-tblock hq4-fade" style="--d: 980;">
    {#each TITLE_BLOCK as c (c.k)}
      <div class="hq4-tcell">
        <span class="hud hq4-tcell-k">{c.k}</span>
        <span class="hud hq4-tcell-v">{c.v}</span>
      </div>
    {/each}
    <div class="hq4-tcell hq4-tcell--wide">
      <span class="hud hq4-tcell-k">DATA SOURCE</span>
      <span class="hud hq4-tcell-v">{FIXTURES}</span>
    </div>
  </div>

  <!-- ==================== THE EXPLODED VIEW (pinned) ==================== -->
  <section class="hq4-explode" use:diagram aria-labelledby="hq4-lifecycle-h">
    <h2 id="hq4-lifecycle-h" class="hq4-mh">
      <span class="hud hq4-mh-kicker">SEC. 01 / THE EXPLODED VIEW</span>
      One drawing.<br />Five parts.
    </h2>

    <!-- the pinned drafting stage (decorative mirror of the part list below) -->
    <div class="hq4-stage" aria-hidden="true">
      <div class="hq4-shud">
        <span class="hud hq4-shud-l">SEC. 01 / THE EXPLODED VIEW — DRAFTING</span>
        <span class="hud hq4-shud-c">PART <span data-count>01</span>/05</span>
        <span class="hud hq4-shud-r">{FIXTURES}</span>
      </div>
      <span class="hq4-prog"><span class="hq4-prog-fill"></span></span>

      <div class="hq4-capwrap">
        {#each CAPTIONS as c (c.verb)}
          <span class="hq4-cverb" data-verb>{c.verb}</span>
        {/each}
      </div>
      <div class="hq4-clinewrap">
        {#each CAPTIONS as c (c.verb)}
          <p class="hq4-cline" data-cline>{c.line}</p>
        {/each}
      </div>

      <div class="hq4-board">
        <span class="hq4-datum"></span>
        <span class="hq4-datum hq4-datum--lit"></span>

        {#each STATIONS as s, i (s.n)}
          <div class="hq4-part" data-part style="--px: {i - 2}; --sx: {i - 2}; --ey: {PART_LIFT[i]}px;">
            {@render part(i)}
            <span class="hq4-part-tag">
              <span class="hq4-part-lead"></span>
              <span class="hud hq4-part-n">{s.n} · {s.verb}</span>
              <span class="hud hq4-part-read">{s.read}</span>
            </span>
          </div>
        {/each}

        <!-- envelope box drawn around the assembled machine -->
        <div class="hq4-envwrap">
          <svg class="hq4-envsvg" viewBox="0 0 374 100" preserveAspectRatio="none">
            <rect x="1" y="1" width="372" height="98" pathLength="1" />
          </svg>
          <span class="hud hq4-env-label">ASSY 01 — ACQUISITION ENGINE</span>
        </div>

        <!-- the approval stamp slams onto the sheet -->
        <div class="hq4-stamp">
          <span class="hud hq4-stamp-k">OUTPUT:</span>
          <span class="hq4-stamp-t">Customer acquired</span>
          <span class="hud hq4-stamp-b">LEDGER + · LOOP RE-ARMED</span>
        </div>
      </div>

      <p class="hud hq4-sheetnote">DWG № TOS-LP-04 · DO NOT SCALE DRAWING</p>
    </div>

    <!-- the five parts in flow: screen readers always, small screens and
         reduced motion visually -->
    <ol class="hq4-plist">
      {#each STATIONS as s, i (s.n)}
        <li class="hq4-prow" use:reveal={{ animation: "fade-in", delay: i * 0.08 }}>
          <span class="hq4-prow-art" aria-hidden="true">{@render part(i)}</span>
          <div class="hq4-prow-copy">
            <span class="hud hq4-prow-meta">{s.n} / {s.read}</span>
            <h3 class="hq4-prow-verb">{s.verb}</h3>
            <p class="hq4-prow-line">{s.line}</p>
          </div>
        </li>
      {/each}
    </ol>
  </section>

  <!-- =================== THE APPROVAL BLOCK (pinned) =================== -->
  <section class="hq4-appin" use:approval aria-labelledby="hq4-creed-h">
    <div class="hq4-astage">
      <div class="hq4-ablock">
        <span class="hq4-abord hq4-abord--t" aria-hidden="true"></span>
        <span class="hq4-abord hq4-abord--b" aria-hidden="true"></span>
        <span class="hq4-abord hq4-abord--l" aria-hidden="true"></span>
        <span class="hq4-abord hq4-abord--r" aria-hidden="true"></span>

        <p class="hud hq4-akicker">SEC. 02 / THE APPROVAL BLOCK — REV A</p>

        <h2 id="hq4-creed-h" class="hq4-creed">
          <span class="hq4-sig hq4-sig--l">
            <span class="hud hq4-sig-k">PROPOSED BY</span>
            <span class="hq4-sig-t">Agents propose.</span>
            <span class="hq4-sig-rule" aria-hidden="true"></span>
            <span class="hud hq4-sig-m">SIGNED — AGENTS · DATE: TODAY</span>
          </span>
          <span class="hq4-sig hq4-sig--r">
            <span class="hud hq4-sig-k">APPROVED BY</span>
            <span class="hq4-sig-t hq4-sig-t--b">Humans approve.</span>
            <span class="hq4-sig-rule" aria-hidden="true"></span>
            <span class="hud hq4-sig-m">SIGNED — HUMAN AT THE SWITCH · DATE: TODAY</span>
          </span>
        </h2>

        <ul class="hq4-revs">
          {#each GATE_CHIPS as c, i (c.label)}
            <li class="hq4-rev" data-row data-verdict={c.verdict}>
              <span class="hud hq4-rev-n">REV {REV_LETTERS[i]}</span>
              <span class="hq4-rev-label">{c.label}</span>
              <span class="hq4-rev-stamp">{c.stamp}</span>
            </li>
          {/each}
        </ul>

        <p class="hud hq4-asub">
          EVERY AGENT FIX PASSES A SPEND-CAP GATE — NOTHING UNSAFE SHIPS WITHOUT A HUMAN AT THE SWITCH.
        </p>
      </div>
    </div>
  </section>

  <!-- ============================ THE CLOSE ============================ -->
  <section class="hq4-final" aria-labelledby="hq4-close-h">
    <div use:reveal>
      <p class="hud hq4-fkicker">SEC. 03 / THE CLOSE</p>
      <h2 id="hq4-close-h" class="hq4-h2">Built inside the<br />Build Challenge.</h2>
      <p class="hq4-body">
        The case study, the contest entry, and the product are the same object: Today OS was built
        inside It&rsquo;s Today Media&rsquo;s Build Challenge, on It&rsquo;s Today Media&rsquo;s own
        domain. Everything above runs on sample data — labeled sample. The README answers what it
        does, why this one, and what I&rsquo;d build next.
      </p>
      <div class="hq4-cta-row">
        <a href="/os" class="hq4-btn hq4-btn--solid">Enter Today OS &rarr;</a>
        <a href="/readme" class="hq4-btn hq4-btn--ghost">Read the thinking (README)</a>
      </div>
    </div>
  </section>

  <!-- ============================= FOOTER ============================= -->
  <footer class="hq4-foot">
    <div class="hq4-foot-grid">
      <div>
        <p class="hud hq4-foot-strong">IT&rsquo;S TODAY MEDIA, LLC</p>
        <p class="hud">12 W MADISON ST<br />BALTIMORE, MD 21201</p>
      </div>
      <div>
        <p class="hud hq4-foot-strong">POSITION</p>
        <p class="hud">39.2977&deg; N<br />76.6157&deg; W</p>
      </div>
      <div>
        <p class="hud hq4-foot-strong">INDEX</p>
        <p class="hud hq4-foot-links">
          <a href="/">BACK TO THE MAIN SITE</a><br />
          <a href="/os">ENTER TODAY OS</a><br />
          <a href="/readme">README</a><br />
          <a href="/haoqi">FIRST CUT (/HAOQI)</a><br />
          <a href="/haoqi2">MACHINE CUT (/HAOQI2)</a>
        </p>
      </div>
      <div class="hq4-foot-last">
        <p class="hud">
          TODAY OS · BLUEPRINT CUT<br />AN ALTERNATE LANDING — REACHED<br />DIRECTLY AT /HAOQI4
        </p>
      </div>
    </div>
  </footer>
</div>

<style>
  /* ── route-local palette: the classic blueprint inversion — a deep cobalt
        sheet with paper-white line work (scoped; never touches global tokens) ── */
  .hq4 {
    --hq4-sheet: oklch(25% 0.088 262);
    --hq4-paper: oklch(97.5% 0.008 250);
    --hq4-bright: oklch(88% 0.075 235);
    --hq4-amber: oklch(82% 0.13 85);
    --hq4-deep: oklch(31% 0.105 262);
    --hq4-line: color-mix(in oklch, var(--hq4-paper) 32%, transparent);
    --hq4-faint: color-mix(in oklch, var(--hq4-paper) 14%, transparent);
    --hq4-muted: color-mix(in oklch, var(--hq4-paper) 64%, transparent);
    --hq4-grid: color-mix(in oklch, var(--hq4-paper) 5%, transparent);
    --hq4-grid-major: color-mix(in oklch, var(--hq4-paper) 9%, transparent);

    position: relative;
    isolation: isolate;
    min-height: 100vh;
    background-color: var(--hq4-sheet);
    /* the drafting grid: a major line every fifth minor square. it belongs to
       the document, so it slides beneath the pinned stages — the sheet
       advancing under the plotter head */
    background-image:
      linear-gradient(var(--hq4-grid-major) 1px, transparent 1px),
      linear-gradient(90deg, var(--hq4-grid-major) 1px, transparent 1px),
      linear-gradient(var(--hq4-grid) 1px, transparent 1px),
      linear-gradient(90deg, var(--hq4-grid) 1px, transparent 1px);
    background-size:
      160px 160px,
      160px 160px,
      32px 32px,
      32px 32px;
    color: var(--hq4-paper);
    font-family: var(--font-display);
    overflow-x: clip;
  }

  /* ── the fixed sheet border (drawing frame) ── */
  .hq4-frame {
    position: fixed;
    inset: clamp(8px, 1.1vw, 16px);
    border: 1.5px solid var(--hq4-line);
    pointer-events: none;
    z-index: 40;
    display: none;
  }
  .hq4-frame::before {
    content: "";
    position: absolute;
    inset: 4px;
    border: 1px solid var(--hq4-faint);
  }
  @media (min-width: 768px) {
    .hq4-frame {
      display: block;
    }
  }

  /* registration cross — drafting tick */
  .hq4-cross {
    position: absolute;
    width: 17px;
    height: 17px;
    pointer-events: none;
    color: color-mix(in oklch, var(--hq4-paper) 30%, transparent);
  }
  .hq4-cross::before,
  .hq4-cross::after {
    content: "";
    position: absolute;
    background: currentColor;
  }
  .hq4-cross::before {
    left: 8px;
    top: 0;
    width: 1px;
    height: 17px;
  }
  .hq4-cross::after {
    top: 8px;
    left: 0;
    height: 1px;
    width: 17px;
  }
  @media (max-width: 640px) {
    /* the marks collide with the wrapped eyebrow + headline on phones */
    .hq4-hero > .hq4-cross {
      display: none;
    }
  }

  /* ============================= HERO ============================= */
  .hq4-hero {
    position: relative;
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    padding: 4.5rem 1.5rem 5rem;
  }
  .hq4-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(120% 85% at 20% 0%, var(--hq4-deep) 0%, transparent 55%);
    opacity: 0.75;
  }
  @media (min-width: 640px) {
    .hq4-hero {
      padding: 5rem 2.5rem 5rem;
    }
  }
  @media (min-width: 1024px) {
    .hq4-hero {
      padding: 5.5rem 4rem 5.5rem;
    }
  }

  .hq4-hero-inner {
    position: relative;
    z-index: 2;
    max-width: 64rem;
  }

  .hq4-eyebrow {
    display: inline-flex;
    align-items: flex-start;
    gap: 0.55rem;
    color: color-mix(in oklch, var(--hq4-paper) 80%, transparent);
    margin-bottom: 1.4rem;
  }
  .hq4-livedot {
    flex: 0 0 auto;
    width: 6px;
    height: 6px;
    margin-top: 0.28em; /* optically centers on the first line when the label wraps */
    border-radius: 9999px;
    background: var(--hq4-bright);
  }

  .hq4-titlewrap {
    position: relative;
  }

  .hq4-h1 {
    display: flex;
    flex-direction: column;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.045em;
    line-height: 0.88;
    /* vh term keeps the whole hero (title + lede + CTAs) above the fold on
       short viewports; vw term rules on tall ones */
    font-size: clamp(2.7rem, min(11vw, 17vh), 10.5rem);
    color: var(--hq4-paper);
  }
  .hq4-mask {
    display: block;
    overflow: hidden;
    padding-bottom: 0.06em; /* keep descender-free caps from clipping at tight line-height */
    margin-bottom: -0.06em;
  }
  .hq4-rise {
    display: block;
  }
  .hq4-h1-bright {
    color: var(--hq4-bright);
  }

  /* vertical dimension beside the title (wide desktop only) */
  .hq4-vdim {
    position: absolute;
    right: -3.4rem;
    top: 0.2rem;
    bottom: 0.2rem;
    display: none;
    align-items: center;
    gap: 0.7rem;
  }
  @media (min-width: 1180px) {
    .hq4-vdim {
      display: flex;
    }
  }
  .hq4-vdim-line {
    position: relative;
    width: 1px;
    height: 100%;
    background: var(--hq4-line);
    transform-origin: center top;
  }
  .hq4-vdim-line::before,
  .hq4-vdim-line::after {
    content: "";
    position: absolute;
    left: -4px;
    width: 9px;
    height: 1px;
    background: var(--hq4-line);
  }
  .hq4-vdim-line::before {
    top: 0;
  }
  .hq4-vdim-line::after {
    bottom: 0;
  }
  .hq4-vdim-label {
    writing-mode: vertical-rl;
    color: var(--hq4-muted);
  }

  /* horizontal dimension under the title */
  .hq4-dim {
    margin-top: 1.2rem;
    max-width: 46rem;
  }
  .hq4-dim-line {
    display: block;
    position: relative;
    height: 1px;
    background: var(--hq4-line);
    transform-origin: left center;
  }
  .hq4-dim-line::before,
  .hq4-dim-line::after {
    content: "";
    position: absolute;
    top: -4px;
    width: 1px;
    height: 9px;
    background: var(--hq4-line);
  }
  .hq4-dim-line::before {
    left: 0;
  }
  .hq4-dim-line::after {
    right: 0;
  }
  .hq4-dim-label {
    display: inline-block;
    margin-top: 0.7rem;
    color: var(--hq4-muted);
  }

  .hq4-lede {
    margin-top: 1.6rem;
    max-width: 34rem;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    line-height: 1.7;
    color: color-mix(in oklch, var(--hq4-paper) 80%, transparent);
  }

  .hq4-cta-row {
    margin-top: 2rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem 1.4rem;
  }

  /* buttons — a paper label pinned to the blueprint / a scribed outline */
  .hq4-btn {
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.09em;
    font-size: 0.78rem;
    padding: 0.95rem 1.7rem;
    border: 1px solid var(--hq4-line);
    transition:
      transform 120ms cubic-bezier(0.25, 1, 0.5, 1),
      background-color 160ms ease,
      color 160ms ease,
      border-color 160ms ease;
  }
  .hq4-btn--solid {
    background: var(--hq4-paper);
    border-color: var(--hq4-paper);
    color: oklch(28% 0.1 262);
  }
  .hq4-btn--solid:hover {
    background: color-mix(in oklch, var(--hq4-paper) 88%, var(--hq4-sheet));
    border-color: color-mix(in oklch, var(--hq4-paper) 88%, var(--hq4-sheet));
  }
  .hq4-btn--ghost {
    color: color-mix(in oklch, var(--hq4-paper) 84%, transparent);
    background: color-mix(in oklch, var(--hq4-paper) 5%, transparent);
  }
  .hq4-btn--ghost:hover {
    color: var(--hq4-paper);
    border-color: color-mix(in oklch, var(--hq4-paper) 48%, transparent);
  }
  @media (prefers-reduced-motion: no-preference) {
    .hq4-btn:active {
      transform: scale(0.97);
    }
  }

  .hq4-scrollcue {
    position: absolute;
    left: 1.5rem;
    bottom: 1.6rem;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--hq4-muted);
  }
  .hq4-nudge {
    display: inline-block;
    color: var(--hq4-bright);
  }
  @media (min-width: 640px) {
    .hq4-scrollcue {
      left: 2.5rem;
    }
  }

  /* ========================= TITLE BLOCK ========================= */
  .hq4-tblock {
    display: flex;
    flex-wrap: wrap;
    border-top: 1.5px solid var(--hq4-line);
    border-bottom: 1.5px solid var(--hq4-line);
    background: color-mix(in oklch, var(--hq4-paper) 3%, transparent);
  }
  .hq4-tcell {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    padding: 0.85rem 1.2rem;
    border-right: 1px solid var(--hq4-faint);
  }
  .hq4-tcell--wide {
    flex: 1 1 22rem;
    border-right: 0;
  }
  .hq4-tcell-k {
    font-size: 0.58rem;
    color: var(--hq4-muted);
  }
  .hq4-tcell-v {
    color: var(--hq4-paper);
  }
  .hq4-tcell--wide .hq4-tcell-v {
    color: var(--hq4-bright);
  }

  /* ======================= THE EXPLODED VIEW ======================= */
  .hq4-explode {
    position: relative;
    height: 540vh;
    /* phase vars written by the diagram action */
    --p: 0;
    --asm: 0;
    --env: 0;
    --stamp: 0;
  }

  /* heading: screen readers always; becomes the visible section head in the
     static (mobile / reduced-motion) composition */
  .hq4-mh {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  .hq4-mh-kicker {
    display: block;
    margin-bottom: 1rem;
  }

  .hq4-stage {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
  }

  /* HUD bar */
  .hq4-shud {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1.5rem;
    padding: 1.6rem 1.5rem 1.1rem;
  }
  @media (min-width: 640px) {
    .hq4-shud {
      /* extra right padding clears the fixed theme-toggle chrome in the corner */
      padding: 1.8rem 5.5rem 1.2rem 2.5rem;
    }
  }
  .hq4-shud-l {
    color: var(--hq4-muted);
  }
  .hq4-shud-c {
    color: var(--hq4-paper);
  }
  .hq4-shud-r {
    color: var(--hq4-muted);
    display: none;
  }
  @media (min-width: 1024px) {
    .hq4-shud-r {
      display: inline;
    }
  }

  .hq4-prog {
    position: absolute;
    top: 4.3rem;
    left: 1.5rem;
    right: 1.5rem;
    height: 1px;
    background: var(--hq4-faint);
  }
  @media (min-width: 640px) {
    .hq4-prog {
      left: 2.5rem;
      right: 2.5rem;
      top: 4.6rem;
    }
  }
  .hq4-prog-fill {
    position: absolute;
    inset: 0;
    background: var(--hq4-bright);
    transform: scaleX(var(--p));
    transform-origin: left center;
  }

  /* caption: big verb + line (stacked crossfade) */
  .hq4-capwrap {
    position: absolute;
    left: 1.5rem;
    top: 13vh;
    display: grid;
  }
  .hq4-clinewrap {
    position: absolute;
    left: 1.5rem;
    top: calc(13vh + clamp(3.6rem, 9vw, 8rem));
    display: grid;
    max-width: min(42rem, 80vw);
  }
  @media (min-width: 640px) {
    .hq4-capwrap,
    .hq4-clinewrap {
      left: 2.5rem;
    }
  }
  @media (min-width: 1024px) {
    .hq4-capwrap,
    .hq4-clinewrap {
      left: 4rem;
    }
  }
  .hq4-cverb,
  .hq4-cline {
    grid-area: 1 / 1;
    opacity: var(--o, 0);
    transform: translateY(calc((1 - var(--o, 0)) * 14px));
  }
  .hq4-cverb:first-child,
  .hq4-cline:first-child {
    --o: 1;
  }
  .hq4-cverb {
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.04em;
    line-height: 0.9;
    font-size: clamp(3rem, 9vw, 7.5rem);
    color: var(--hq4-paper);
  }
  .hq4-cline {
    font-family: var(--font-mono);
    font-size: 0.88rem;
    line-height: 1.7;
    color: color-mix(in oklch, var(--hq4-paper) 76%, transparent);
  }

  /* the drafting board: datum line + exploded parts */
  .hq4-board {
    position: absolute;
    left: 0;
    right: 0;
    top: 63vh;
    height: 0;
    --psz: clamp(84px, 10vw, 148px);
    --spread: clamp(26px, 5vw, 78px);
  }
  .hq4-datum {
    position: absolute;
    left: 6%;
    right: 6%;
    top: 0;
    height: 1px;
    background: var(--hq4-faint);
  }
  .hq4-datum--lit {
    background: var(--hq4-bright);
    opacity: 0.65;
    transform: scaleX(var(--p));
    transform-origin: left center;
  }

  /* one exploded part: assembled position is the base; the exploded scatter
     is pure transform, removed as --asm rises */
  .hq4-part {
    position: absolute;
    left: calc(50% + var(--px) * var(--psz) * 1.04);
    top: 0;
    width: var(--psz);
    height: var(--psz);
    color: color-mix(in oklch, var(--hq4-paper) calc(70% + var(--a, 0) * 30%), transparent);
    transform: translate(-50%, -50%)
      translateX(calc((1 - var(--asm, 0)) * var(--sx) * var(--spread)))
      translateY(calc((1 - var(--asm, 0)) * var(--ey, 0px)));
  }
  .hq4-part :global(svg) {
    display: block;
    width: 100%;
    height: 100%;
  }

  /* line-drawing reveal: each part's strokes draw over its --dr window */
  .d1,
  .d2,
  .d3,
  .d4 {
    stroke-dasharray: 1;
  }
  .d1 {
    stroke-dashoffset: clamp(0, calc((0.38 - var(--dr, 0)) / 0.38), 1);
  }
  .d2 {
    stroke-dashoffset: clamp(0, calc((0.55 - var(--dr, 0)) / 0.35), 1);
  }
  .d3 {
    stroke-dashoffset: clamp(0, calc((0.8 - var(--dr, 0)) / 0.35), 1);
  }
  .d4 {
    stroke-dashoffset: clamp(0, calc((1 - var(--dr, 0)) / 0.3), 1);
  }

  /* leader tag under each part */
  .hq4-part-tag {
    position: absolute;
    left: 50%;
    top: calc(100% + 0.2rem);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
    transform: translateX(-50%);
    white-space: nowrap;
  }
  .hq4-part-lead {
    width: 1px;
    height: 1.1rem;
    background: var(--hq4-bright);
    opacity: calc(min(1, var(--dr, 0) * 4) * (0.35 + var(--a, 0) * 0.65));
  }
  .hq4-part-n {
    font-size: 0.62rem;
    color: color-mix(in oklch, var(--hq4-paper) 88%, transparent);
    opacity: calc(min(1, var(--dr, 0) * 4) * (0.5 + var(--a, 0) * 0.5));
  }
  .hq4-part-read {
    font-size: 0.6rem;
    color: var(--hq4-bright);
    opacity: calc(
      min(1, var(--dr, 0) * 4) * (0.35 + var(--a, 0) * 0.65) * (1 - var(--asm, 0) * 0.85)
    );
  }

  /* envelope box around the assembled machine */
  .hq4-envwrap {
    position: absolute;
    left: 50%;
    top: 0;
    width: calc(var(--psz) * 5.6);
    height: calc(var(--psz) * 1.75);
    transform: translate(-50%, -50%);
    pointer-events: none;
  }
  .hq4-envsvg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
  }
  .hq4-envsvg rect {
    fill: none;
    stroke: var(--hq4-bright);
    stroke-width: 0.6;
    stroke-dasharray: 1;
    stroke-dashoffset: calc(1 - var(--env, 0));
    /* opacity gate keeps partially-computed dash strokes off the sheet
       until the envelope beat actually begins */
    opacity: calc(min(1, var(--env, 0) * 3) * 0.9);
  }
  .hq4-env-label {
    position: absolute;
    left: 0.4rem;
    top: -1.5rem;
    color: var(--hq4-bright);
    opacity: var(--env, 0);
  }

  /* the approval stamp */
  .hq4-stamp {
    position: absolute;
    left: calc(50% + var(--psz) * 1.9);
    top: calc(var(--psz) * -1.02);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
    padding: 0.8rem 1.2rem;
    border: 2px solid var(--hq4-bright);
    color: var(--hq4-bright);
    text-align: center;
    transform: translate(-50%, -50%) rotate(-8deg) scale(calc(1.7 - var(--stamp, 0) * 0.7));
    opacity: var(--stamp, 0);
  }
  .hq4-stamp-k,
  .hq4-stamp-b {
    color: inherit;
    font-size: 0.6rem;
  }
  .hq4-stamp-t {
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.01em;
    line-height: 1;
    font-size: clamp(1rem, 1.7vw, 1.55rem);
  }

  .hq4-sheetnote {
    position: absolute;
    left: 50%;
    bottom: 3.5vh;
    transform: translateX(-50%);
    white-space: nowrap;
    color: var(--hq4-muted);
  }

  /* the in-flow part list: hidden visually on the pinned desktop stage,
     the real composition on small screens / reduced motion */
  .hq4-plist {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }

  @media (max-width: 767px), (prefers-reduced-motion: reduce) {
    .hq4-explode {
      height: auto;
      padding: 5.5rem 1.5rem 6rem;
    }
    .hq4-stage {
      display: none;
    }
    .hq4-mh {
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
    .hq4-plist {
      position: static;
      width: auto;
      height: auto;
      overflow: visible;
      clip-path: none;
      display: flex;
      flex-direction: column;
      border: 1px solid var(--hq4-faint);
    }
    .hq4-prow {
      /* fully-drawn parts in the static composition */
      --dr: 1;
      --a: 0;
      --done: 1;
      display: flex;
      gap: 1.2rem;
      align-items: flex-start;
      padding: 1.5rem 1.3rem;
      border-top: 1px solid var(--hq4-faint);
    }
    .hq4-prow:first-child {
      border-top: 0;
    }
    .hq4-prow-art {
      flex: 0 0 auto;
      width: 56px;
      height: 56px;
      color: var(--hq4-paper);
    }
    .hq4-prow-art :global(svg) {
      display: block;
      width: 100%;
      height: 100%;
    }
    .hq4-prow-copy {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .hq4-prow-meta {
      color: var(--hq4-bright);
    }
    .hq4-prow-verb {
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: -0.02em;
      line-height: 1;
      font-size: clamp(1.7rem, 6vw, 2.6rem);
      color: var(--hq4-paper);
    }
    .hq4-prow-line {
      font-family: var(--font-mono);
      font-size: 0.84rem;
      line-height: 1.65;
      color: color-mix(in oklch, var(--hq4-paper) 74%, transparent);
      max-width: 44rem;
    }
  }
  @media (min-width: 768px) and (prefers-reduced-motion: reduce) {
    .hq4-explode {
      padding: 6rem 4rem 7rem;
    }
  }

  /* ======================= THE APPROVAL BLOCK ======================= */
  .hq4-appin {
    position: relative;
    height: 250vh;
    border-top: 1px solid var(--hq4-faint);
    /* phase vars written by the approval action */
    --ab: 0;
    --al: 0;
    --ar: 0;
    --as: 0;
  }
  .hq4-astage {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 1.5rem;
  }
  @media (min-width: 640px) {
    .hq4-astage {
      padding: 0 2.5rem;
    }
  }

  /* the sign-off block: four border strokes draw themselves */
  .hq4-ablock {
    position: relative;
    width: min(76rem, 100%);
    padding: clamp(1.6rem, 4vw, 3.5rem);
  }
  .hq4-abord {
    position: absolute;
    background: var(--hq4-line);
    pointer-events: none;
  }
  .hq4-abord--t {
    left: 0;
    right: 0;
    top: 0;
    height: 1.5px;
    transform: scaleX(var(--ab));
    transform-origin: left center;
  }
  .hq4-abord--b {
    left: 0;
    right: 0;
    bottom: 0;
    height: 1.5px;
    transform: scaleX(var(--ab));
    transform-origin: right center;
  }
  .hq4-abord--l {
    top: 0;
    bottom: 0;
    left: 0;
    width: 1.5px;
    transform: scaleY(var(--ab));
    transform-origin: center top;
  }
  .hq4-abord--r {
    top: 0;
    bottom: 0;
    right: 0;
    width: 1.5px;
    transform: scaleY(var(--ab));
    transform-origin: center bottom;
  }

  .hq4-akicker {
    color: var(--hq4-muted);
    margin-bottom: clamp(1.5rem, 3vw, 2.5rem);
    opacity: var(--ab);
  }

  .hq4-creed {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(1.5rem, 4vw, 4rem);
    align-items: end;
  }
  .hq4-sig {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    min-width: 0;
  }
  .hq4-sig-k {
    color: var(--hq4-muted);
  }
  .hq4-sig-t {
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.035em;
    line-height: 0.92;
    font-size: clamp(1.9rem, 4.6vw, 5rem);
    color: var(--hq4-paper);
  }
  .hq4-sig-t--b {
    color: var(--hq4-bright);
  }
  .hq4-sig-rule {
    height: 1px;
    background: var(--hq4-line);
  }
  .hq4-sig-m {
    font-size: 0.62rem;
    color: var(--hq4-muted);
  }
  .hq4-sig--l {
    opacity: var(--al);
    transform: translateX(calc((1 - var(--al)) * -24px));
  }
  .hq4-sig--r {
    opacity: var(--ar);
    transform: scale(calc(1.1 - var(--ar) * 0.1));
    transform-origin: left bottom;
  }

  /* revision table: proposals queuing for their verdicts */
  .hq4-revs {
    margin-top: clamp(2rem, 4vw, 3rem);
    display: flex;
    flex-direction: column;
    border: 1px solid var(--hq4-faint);
  }
  .hq4-rev {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 1rem;
    align-items: center;
    padding: 0.7rem 1rem;
    border-top: 1px solid var(--hq4-faint);
    font-family: var(--font-mono);
    font-size: 0.66rem;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: color-mix(in oklch, var(--hq4-paper) 80%, transparent);
    opacity: var(--in, 0);
    transform: translateY(calc((1 - var(--in, 0)) * 10px));
  }
  .hq4-rev:first-child {
    border-top: 0;
  }
  .hq4-rev-n {
    color: var(--hq4-muted);
  }
  .hq4-rev-stamp {
    padding: 0.15rem 0.5rem;
    border: 1.5px solid var(--hq4-bright);
    color: var(--hq4-bright);
    opacity: var(--stamp, 0);
    transform: rotate(-4deg) scale(calc(1.35 - var(--stamp, 0) * 0.35));
  }
  .hq4-rev[data-verdict="refused"] .hq4-rev-stamp {
    border-color: var(--hq4-amber);
    color: var(--hq4-amber);
  }

  .hq4-asub {
    margin-top: clamp(1.5rem, 3vw, 2.2rem);
    max-width: 40rem;
    color: var(--hq4-muted);
    opacity: var(--as);
    transform: translateY(calc((1 - var(--as)) * 8px));
  }

  @media (max-width: 767px) {
    .hq4-appin {
      height: 210vh;
    }
    .hq4-creed {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    .hq4-sig--r {
      transform-origin: left center;
    }
    .hq4-rev {
      grid-template-columns: auto 1fr;
    }
    .hq4-rev-label {
      white-space: normal;
    }
    .hq4-rev-stamp {
      grid-column: 2;
      justify-self: start;
    }
  }

  /* reduced motion: no pin, calm static composition (vars land at 1) */
  @media (prefers-reduced-motion: reduce) {
    .hq4-appin {
      height: auto;
    }
    .hq4-astage {
      position: static;
      height: auto;
      min-height: 0;
      padding: 6rem 1.5rem;
    }
  }

  /* ============================ THE CLOSE ============================ */
  .hq4-final {
    position: relative;
    padding: 6rem 1.5rem;
    border-top: 1px solid var(--hq4-faint);
  }
  @media (min-width: 640px) {
    .hq4-final {
      padding: 8rem 2.5rem;
    }
  }
  @media (min-width: 1024px) {
    .hq4-final {
      padding: 9rem 4rem;
    }
  }
  .hq4-fkicker {
    color: var(--hq4-muted);
    margin-bottom: 1.2rem;
  }
  .hq4-h2 {
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.03em;
    line-height: 0.9;
    font-size: clamp(2.4rem, 6.5vw, 5.4rem);
    color: var(--hq4-paper);
  }
  .hq4-body {
    margin-top: 1.6rem;
    max-width: 40rem;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    line-height: 1.75;
    color: color-mix(in oklch, var(--hq4-paper) 78%, transparent);
  }
  .hq4-final .hq4-cta-row {
    margin-top: 2.4rem;
  }

  /* ============================= FOOTER ============================= */
  .hq4-foot {
    border-top: 1px solid var(--hq4-faint);
    padding: 4rem 1.5rem 5rem;
  }
  @media (min-width: 640px) {
    .hq4-foot {
      padding: 4.5rem 2.5rem 5.5rem;
    }
  }
  @media (min-width: 1024px) {
    .hq4-foot {
      padding: 4.5rem 4rem 5.5rem;
    }
  }
  .hq4-foot-grid {
    display: grid;
    gap: 2.5rem;
    grid-template-columns: 1fr;
  }
  @media (min-width: 768px) {
    .hq4-foot-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  .hq4-foot .hud {
    line-height: 2;
  }
  .hq4-foot-strong {
    color: var(--hq4-paper);
    margin-bottom: 0.6rem;
  }
  .hq4-foot-links a {
    transition: color 140ms ease;
  }
  .hq4-foot-links a:hover {
    color: var(--hq4-paper);
  }
  .hq4-foot-links a:first-child {
    color: var(--hq4-bright);
  }
  .hq4-foot-links a:first-child:hover {
    color: var(--hq4-paper);
  }
  .hq4-foot-last {
    text-align: left;
  }
  @media (min-width: 768px) {
    .hq4-foot-last {
      text-align: right;
    }
  }
</style>
