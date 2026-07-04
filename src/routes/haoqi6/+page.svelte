<script lang="ts">
  import "$lib/haoqi6/haoqi6.css"
  import { reveal } from "$lib/actions/reveal"
  import { intercept, hold } from "$lib/haoqi6/scene"
  import { STATIONS, GATE_CHIPS, LEDE, FIXTURES, TARGET, CONTACTS } from "$lib/haoqi6/copy"

  /* ── scope geometry (deterministic — fixed constants, no randomness) ── */
  const DEG = Math.PI / 180
  const C = 200 // scope center in viewBox coords
  const R = 176 // outer range ring radius
  const RINGS = [44, 88, 132, 176]
  const pt = (b: number, rr: number) => ({ x: C + Math.sin(b * DEG) * rr, y: C - Math.cos(b * DEG) * rr })
  const f = (n: number) => Number(n.toFixed(1))

  /** bearing ticks: minor every 5°, major every 45° */
  const TICKS = Array.from({ length: 72 }, (_, i) => i * 5).map((deg) => ({
    deg,
    o: pt(deg, R),
    i: pt(deg, deg % 45 === 0 ? 160 : 170),
  }))
  const BRG = [
    { deg: 0, label: "000" },
    { deg: 90, label: "090" },
    { deg: 180, label: "180" },
    { deg: 270, label: "270" },
  ].map((b) => ({ ...b, p: pt(b.deg, 191) }))

  const tgt = pt(TARGET.b, TARGET.r * R)
  const trackEnd = pt(TARGET.b, TARGET.r * R - 14)
  const dots = CONTACTS.map((c) => pt(c.b, c.r * R))
</script>

<svelte:head>
  <title>Today OS · Acquire More Customers — the radar cut</title>
  <meta
    name="description"
    content="An alternate cut of the Today OS landing page drawn as an ops-room radar scope: the market is airspace, one contact is found, pitched, acquired, gated and proved on the ledger across five scroll-driven stages. Agents propose. Humans approve."
  />
</svelte:head>

<!-- the scope: range rings + bearing ticks + sweep; `stage` adds the intercept
     drama layers (target blip, track line, gate arc, tags, callout) -->
{#snippet scope(stage: boolean)}
  <div class="hq6-scope" aria-hidden="true">
    <span class="hq6-face"></span>
    <svg class="hq6-layer" viewBox="0 0 400 400">
      {#each RINGS as r (r)}
        <circle class="hq6-ring" cx={C} cy={C} {r} />
      {/each}
      {#each TICKS as t (t.deg)}
        <line class="hq6-tick" x1={f(t.o.x)} y1={f(t.o.y)} x2={f(t.i.x)} y2={f(t.i.y)} />
      {/each}
      <line class="hq6-axis" x1="24" y1={C} x2="376" y2={C} />
      <line class="hq6-axis" x1={C} y1="24" x2={C} y2="376" />
      {#each BRG as b (b.deg)}
        <text class="hq6-brg" x={f(b.p.x)} y={f(b.p.y)}>{b.label}</text>
      {/each}
      <circle class="hq6-center" cx={C} cy={C} r="2.5" />
      {#each dots as d, i (i)}
        <circle class="hq6-contact" cx={f(d.x)} cy={f(d.y)} r="3.2" />
      {/each}
    </svg>
    <span class="hq6-sweep"></span>
    {#if stage}
      <svg class="hq6-layer hq6-drama" viewBox="0 0 400 400">
        <!-- 02 PITCH — the track line extends toward the contact -->
        <line class="hq6-trackline" x1={C} y1={C} x2={f(trackEnd.x)} y2={f(trackEnd.y)} pathLength="1" />
        <!-- 01 FIND — the sweep passes; ping ring + blip light up -->
        <circle class="hq6-ping" cx={f(tgt.x)} cy={f(tgt.y)} r="26" />
        <circle class="hq6-blip-hollow" cx={f(tgt.x)} cy={f(tgt.y)} r="5" />
        <g class="hq6-blink">
          <circle class="hq6-blip-solid" cx={f(tgt.x)} cy={f(tgt.y)} r="5.5" />
        </g>
        <!-- 04 RUN — the protective gate arc draws around the contact -->
        <circle
          class="hq6-gatearc"
          cx={f(tgt.x)}
          cy={f(tgt.y)}
          r="24"
          pathLength="1"
          transform="rotate(-90 {f(tgt.x)} {f(tgt.y)})"
        />
        <!-- leader line from the callout box to the blip -->
        <line class="hq6-leader" x1="124" y1="56" x2={f(tgt.x - 16)} y2={f(tgt.y - 10)} pathLength="1" />
        <!-- 03 CLOSE — designation changes -->
        <text class="hq6-tag hq6-tag--acq" x={f(tgt.x)} y={f(tgt.y + 46)}>ACQUIRED</text>
        <!-- 05 PROVE — the contact banks a credit -->
        <text class="hq6-tag hq6-tag--ledg" x={f(tgt.x)} y={f(tgt.y - 38)}>LEDGER +</text>
      </svg>
      <div class="hq6-callout">
        {#each STATIONS as s (s.n)}
          <span class="hud hq6-callout-item" data-callout>{s.n} {s.verb} — {s.read}</span>
        {/each}
      </div>
    {/if}
  </div>
{/snippet}

<!-- per-station mini scope states for the static (mobile / reduced-motion) list -->
{#snippet scopeState(i: number)}
  <svg viewBox="0 0 100 100" role="presentation">
    <circle cx="50" cy="50" r="16" class="hq6-mini-ring" />
    <circle cx="50" cy="50" r="32" class="hq6-mini-ring" />
    <circle cx="50" cy="50" r="46" class="hq6-mini-ring" />
    <circle cx="50" cy="50" r="1.6" fill="var(--hq6-phos)" />
    {#if i === 0}
      <!-- found: the blip lights up, ping ring -->
      <circle cx="72.5" cy="32.5" r="3" fill="none" stroke="var(--hq6-phos)" stroke-width="1.6" />
      <circle cx="72.5" cy="32.5" r="8" fill="none" stroke="var(--hq6-phos)" stroke-width="1" opacity="0.45" />
    {:else if i === 1}
      <!-- pitched: track line extends toward the contact -->
      <line x1="50" y1="50" x2="68.5" y2="35.7" stroke="var(--hq6-blue-text)" stroke-width="1.4" />
      <circle cx="72.5" cy="32.5" r="3" fill="none" stroke="var(--hq6-phos)" stroke-width="1.6" />
    {:else if i === 2}
      <!-- closed: designation flips hollow → solid -->
      <line x1="50" y1="50" x2="68.5" y2="35.7" stroke="var(--hq6-blue-text)" stroke-width="1.4" opacity="0.5" />
      <circle cx="72.5" cy="32.5" r="3.4" fill="var(--hq6-phos)" />
    {:else if i === 3}
      <!-- run: the gate arc arms around it -->
      <circle cx="72.5" cy="32.5" r="3.4" fill="var(--hq6-phos)" />
      <circle cx="72.5" cy="32.5" r="9" fill="none" stroke="var(--hq6-blue-text)" stroke-width="1.4" />
    {:else}
      <!-- prove: the contact banks a credit -->
      <circle cx="72.5" cy="32.5" r="3.4" fill="var(--hq6-phos)" />
      <circle cx="72.5" cy="32.5" r="9" fill="none" stroke="var(--hq6-blue-text)" stroke-width="1.4" />
      <text x="87" y="20" fill="var(--hq6-phos)" font-size="11" text-anchor="middle" font-family="var(--font-mono)">+</text>
    {/if}
  </svg>
{/snippet}

<div class="hq6">
  <!-- ============================= HERO ============================= -->
  <header class="hq6-hero blueprint">
    <span class="hq6-cross" style="left: 8%; top: 16%;" aria-hidden="true"></span>
    <span class="hq6-cross" style="right: 10%; bottom: 20%;" aria-hidden="true"></span>

    <div class="hq6-hero-grid">
      <div class="hq6-hero-copy">
        <p class="hud hq6-eyebrow hq6-fade" style="--d: 40;">
          <span class="hq6-livedot"></span>
          TODAY OS — THE OPERATING SYSTEM FOR PERFORMANCE MARKETING
        </p>

        <h1 class="hq6-h1">
          <span class="hq6-mask"><span class="hq6-rise" style="--d: 60;">Acquire</span></span>
          <span class="hq6-mask"><span class="hq6-rise" style="--d: 150;">More</span></span>
          <span class="hq6-mask"><span class="hq6-rise hq6-h1-blue" style="--d: 240;">Customers.</span></span>
        </h1>

        <div class="hq6-dim" aria-hidden="true">
          <span class="hq6-dim-line hq6-draw" style="--d: 620;"></span>
          <span class="hud hq6-dim-label hq6-fade" style="--d: 860;">SCOPE 06 — MARKET AIRSPACE · SWEEP 5.2S</span>
        </div>

        <p class="hud hq6-briefing-k hq6-fade" style="--d: 460;">MISSION BRIEFING</p>
        <p class="hq6-lede hq6-fade" style="--d: 520;">{LEDE}</p>

        <div class="hq6-cta-row hq6-fade" style="--d: 640;">
          <a href="/os" class="hq6-btn hq6-btn--solid">Enter Today OS &rarr;</a>
          <a href="/readme" class="hq6-btn hq6-btn--ghost">See the contest entry</a>
        </div>
      </div>

      <div class="hq6-hero-scope hq6-fade" style="--d: 380;">
        {@render scope(false)}
        <p class="hud hq6-feed"><span class="hq6-feeddot" aria-hidden="true"></span>{FIXTURES}</p>
      </div>
    </div>

    <p class="hud hq6-scrollcue hq6-fade" style="--d: 1100;" aria-hidden="true">
      SCROLL — THE INTERCEPT IS BELOW <span class="hq6-nudge">&darr;</span>
    </p>
  </header>

  <!-- ==================== THE INTERCEPT (pinned) ==================== -->
  <section class="hq6-intercept" use:intercept aria-labelledby="hq6-lifecycle-h">
    <h2 id="hq6-lifecycle-h" class="hq6-ih">
      <span class="hud hq6-ih-kicker">SEC. 01 / THE INTERCEPT</span>
      One scope.<br />Five stages.
    </h2>

    <!-- the pinned stage (decorative mirror of the stage list below) -->
    <div class="hq6-istage" aria-hidden="true">
      <div class="hq6-ihud">
        <span class="hud hq6-ihud-l">SEC. 01 / THE INTERCEPT — SWEEP RUNNING</span>
        <span class="hud hq6-ihud-c">STAGE <span data-count>01</span>/05</span>
        <span class="hud hq6-ihud-r">{FIXTURES}</span>
      </div>
      <span class="hq6-prog"><span class="hq6-prog-fill"></span></span>

      <div class="hq6-verbwrap">
        {#each STATIONS as s (s.n)}
          <span class="hq6-verb" data-verb>{s.verb}</span>
        {/each}
      </div>
      <div class="hq6-linewrap">
        {#each STATIONS as s (s.n)}
          <p class="hq6-iline" data-line>{s.line}</p>
        {/each}
      </div>

      <div class="hq6-stagescope">
        {@render scope(true)}
      </div>

      <!-- sequence rail: the five stages as instrument stations -->
      <div class="hq6-rail">
        {#each STATIONS as s (s.n)}
          <span class="hq6-railitem" data-station>
            <span class="hq6-railnode"></span>
            <span class="hud hq6-raillabel">{s.n} {s.verb}</span>
          </span>
        {/each}
      </div>

      <p class="hud hq6-output">
        OUTPUT: CUSTOMER ACQUIRED · <span class="hq6-output-phos">LEDGER +</span> · LOOP RE-ARMED — NEXT PASS QUEUED
      </p>

      <!-- sweep hold: an ink veil rises so the un-pin hands off to the
           weapons-hold section on flat ink -->
      <div class="hq6-veil" aria-hidden="true"></div>
    </div>

    <!-- the five stages in flow: screen readers always, small screens and
         reduced motion visually -->
    <ol class="hq6-ilist">
      {#each STATIONS as s, i (s.n)}
        <li class="hq6-irow" use:reveal={{ animation: "fade-in", delay: i * 0.08 }}>
          <span class="hq6-irow-scope" aria-hidden="true">{@render scopeState(i)}</span>
          <div class="hq6-irow-copy">
            <span class="hud hq6-irow-meta">{s.n} / {s.read}</span>
            <h3 class="hq6-irow-verb">{s.verb}</h3>
            <p class="hq6-irow-line">{s.line}</p>
          </div>
        </li>
      {/each}
    </ol>
  </section>

  <!-- ================== THE CREED — WEAPONS HOLD (pinned) ================== -->
  <section class="hq6-holdpin" use:hold aria-labelledby="hq6-creed-h">
    <div class="hq6-gstage">
      <p class="hud hq6-gkicker">SEC. 02 / THE CREED — WEAPONS HOLD</p>

      <span class="hq6-gline" aria-hidden="true"></span>
      <span class="hud hq6-gline-label" aria-hidden="true">WEAPONS HOLD — AUTHORIZATION REQUIRED</span>

      <h2 id="hq6-creed-h" class="hq6-creed">
        <span class="hq6-creed-l">Agents propose.</span>
        <span class="hq6-creed-r">Humans approve.</span>
      </h2>

      <ul class="hq6-chips">
        {#each GATE_CHIPS as c, i (c.label)}
          <li class="hq6-chip" data-chip data-verdict={c.verdict}>
            <span class="hq6-chip-req">REQ-0{i + 1}</span>
            <span class="hq6-chip-label">{c.label}</span>
            <span class="hq6-chip-stamp">{c.stamp}</span>
          </li>
        {/each}
      </ul>

      <p class="hud hq6-gsub">
        EVERY AGENT FIX PASSES A SPEND-CAP GATE — NOTHING UNSAFE SHIPS WITHOUT A HUMAN AT THE SWITCH.
      </p>
    </div>
  </section>

  <!-- ============================ THE CLOSE ============================ -->
  <section class="hq6-final" aria-labelledby="hq6-close-h">
    <div use:reveal>
      <p class="hud hq6-fkicker">SEC. 03 / THE CLOSE</p>
      <h2 id="hq6-close-h" class="hq6-h2">Built inside the<br />Build Challenge.</h2>
      <p class="hq6-body">
        The case study, the contest entry, and the product are the same object: Today OS was built
        inside It&rsquo;s Today Media&rsquo;s Build Challenge, on It&rsquo;s Today Media&rsquo;s own
        domain. Everything above runs on sample data — labeled sample. The README answers what it
        does, why this one, and what I&rsquo;d build next.
      </p>
      <div class="hq6-cta-row">
        <a href="/os" class="hq6-btn hq6-btn--solid">Enter Today OS &rarr;</a>
        <a href="/readme" class="hq6-btn hq6-btn--ghost">Read the thinking (README)</a>
      </div>
    </div>
  </section>

  <!-- ============================= FOOTER ============================= -->
  <footer class="hq6-foot">
    <div class="hq6-foot-grid">
      <div>
        <p class="hud hq6-foot-strong">IT&rsquo;S TODAY MEDIA, LLC</p>
        <p class="hud">12 W MADISON ST<br />BALTIMORE, MD 21201</p>
      </div>
      <div>
        <p class="hud hq6-foot-strong">POSITION</p>
        <p class="hud">39.2977&deg; N<br />76.6157&deg; W</p>
      </div>
      <div>
        <p class="hud hq6-foot-strong">INDEX</p>
        <p class="hud hq6-foot-links">
          <a href="/">BACK TO THE MAIN SITE</a><br />
          <a href="/os">ENTER TODAY OS</a><br />
          <a href="/readme">README</a><br />
          <a href="/haoqi">FIRST CUT (/HAOQI)</a><br />
          <a href="/haoqi2">MACHINE CUT (/HAOQI2)</a>
        </p>
      </div>
      <div class="hq6-foot-last">
        <p class="hud">
          TODAY OS · RADAR CUT<br />AN ALTERNATE LANDING — REACHED<br />DIRECTLY AT /HAOQI6
        </p>
      </div>
    </div>
  </footer>
</div>

<style>
  /* ── route-local palette (scoped; never touches global tokens) ── */
  .hq6 {
    --hq6-ink: oklch(11.5% 0.015 262);
    --hq6-ink-2: oklch(14% 0.016 262);
    --hq6-paper: oklch(97% 0.006 250);
    --hq6-blue: oklch(58% 0.245 262);
    --hq6-blue-text: oklch(66% 0.21 260);
    --hq6-blue-deep: oklch(34% 0.17 264);
    --hq6-amber: oklch(78% 0.12 85);
    /* restrained phosphor green — the sweep wake + live contacts only */
    --hq6-phos: oklch(80% 0.17 152);
    --hq6-line: color-mix(in oklch, var(--hq6-paper) 14%, transparent);
    --hq6-muted: color-mix(in oklch, var(--hq6-paper) 60%, transparent);

    position: relative;
    isolation: isolate;
    min-height: 100vh;
    background: var(--hq6-ink);
    color: var(--hq6-paper);
    font-family: var(--font-display);
    overflow-x: clip;
  }

  /* registration cross — drafting tick */
  .hq6-cross {
    position: absolute;
    width: 17px;
    height: 17px;
    pointer-events: none;
    color: color-mix(in oklch, var(--hq6-paper) 26%, transparent);
  }
  .hq6-cross::before,
  .hq6-cross::after {
    content: "";
    position: absolute;
    background: currentColor;
  }
  .hq6-cross::before {
    left: 8px;
    top: 0;
    width: 1px;
    height: 17px;
  }
  .hq6-cross::after {
    top: 8px;
    left: 0;
    height: 1px;
    width: 17px;
  }
  @media (max-width: 640px) {
    .hq6-cross {
      display: none;
    }
  }

  /* ============================ THE SCOPE ============================ */
  .hq6-scope {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
  }
  /* scope face — a faint phosphor-tinted disc behind the rings */
  .hq6-face {
    position: absolute;
    inset: 6%;
    border-radius: 9999px;
    background: radial-gradient(
      circle at 50% 42%,
      color-mix(in oklch, var(--hq6-phos) 5%, var(--hq6-ink-2)) 0%,
      var(--hq6-ink-2) 72%
    );
  }
  .hq6-layer {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
  }
  .hq6-ring {
    fill: none;
    stroke: var(--hq6-line);
    stroke-width: 1;
  }
  .hq6-tick {
    stroke: color-mix(in oklch, var(--hq6-paper) 24%, transparent);
    stroke-width: 1;
  }
  .hq6-axis {
    stroke: color-mix(in oklch, var(--hq6-paper) 8%, transparent);
    stroke-width: 1;
  }
  .hq6-brg {
    fill: var(--hq6-muted);
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.1em;
    text-anchor: middle;
    dominant-baseline: central;
  }
  .hq6-center {
    fill: var(--hq6-phos);
  }
  .hq6-contact {
    fill: color-mix(in oklch, var(--hq6-phos) 34%, transparent);
  }
  /* the sweep arm + fading wake (rotation keyframe lives in haoqi6.css) */
  .hq6-sweep {
    position: absolute;
    inset: 6%;
    border-radius: 9999px;
    pointer-events: none;
    background: conic-gradient(
      from 0deg,
      transparent 0deg 250deg,
      color-mix(in oklch, var(--hq6-phos) 3%, transparent) 292deg,
      color-mix(in oklch, var(--hq6-phos) 15%, transparent) 352deg,
      color-mix(in oklch, var(--hq6-phos) 52%, transparent) 358.4deg,
      color-mix(in oklch, var(--hq6-phos) 88%, transparent) 359.4deg,
      transparent 360deg
    );
    will-change: transform;
  }

  /* ── drama layers (pinned stage only; driven by scroll vars) ── */
  .hq6-drama {
    z-index: 2;
  }
  .hq6-trackline {
    stroke: var(--hq6-blue-text);
    stroke-width: 1.4;
    stroke-dasharray: 1;
    stroke-dashoffset: calc(1 - var(--track, 0));
    opacity: 0.9;
  }
  .hq6-ping {
    fill: none;
    stroke: var(--hq6-phos);
    stroke-width: 1.2;
    transform-box: fill-box;
    transform-origin: center;
    transform: scale(calc(0.35 + var(--ping, 0) * 1.15));
    opacity: var(--pingo, 0);
  }
  .hq6-blip-hollow {
    fill: none;
    stroke: var(--hq6-phos);
    stroke-width: 1.6;
    opacity: calc(var(--blip, 0) * (1 - var(--acq, 0)));
  }
  .hq6-blip-solid {
    fill: var(--hq6-phos);
    opacity: calc(var(--blip, 0) * var(--acq, 0));
    filter: drop-shadow(0 0 7px color-mix(in oklch, var(--hq6-phos) 70%, transparent));
  }
  .hq6-gatearc {
    fill: none;
    stroke: var(--hq6-blue-text);
    stroke-width: 1.6;
    stroke-dasharray: 1;
    stroke-dashoffset: calc(1 - var(--gate, 0));
    opacity: 0.95;
  }
  .hq6-leader {
    stroke: color-mix(in oklch, var(--hq6-paper) 34%, transparent);
    stroke-width: 1;
    stroke-dasharray: 1;
    stroke-dashoffset: calc(1 - var(--blip, 0));
    opacity: 0.8;
  }
  .hq6-tag {
    font-family: var(--font-mono);
    font-size: 10.5px;
    letter-spacing: 0.12em;
    text-anchor: middle;
    transform-box: fill-box;
  }
  .hq6-tag--acq {
    fill: var(--hq6-blue-text);
    opacity: var(--acq, 0);
    transform: translateY(calc((1 - var(--acq, 0)) * 6px));
  }
  .hq6-tag--ledg {
    fill: var(--hq6-phos);
    opacity: var(--ledg, 0);
    transform: translateY(calc((1 - var(--ledg, 0)) * -6px));
  }

  /* callout box: leader-lined to the blip, content crossfades per stage */
  .hq6-callout {
    position: absolute;
    left: 2%;
    top: 4.5%;
    z-index: 3;
    display: grid;
    padding: 0.55rem 0.8rem;
    border: 1px solid var(--hq6-line);
    background: color-mix(in oklch, var(--hq6-ink) 88%, transparent);
    opacity: var(--blip, 0);
  }
  .hq6-callout-item {
    grid-area: 1 / 1;
    white-space: nowrap;
    color: color-mix(in oklch, var(--hq6-paper) 86%, transparent);
    opacity: var(--o, 0);
    transform: translateY(calc((1 - var(--o, 0)) * 6px));
  }
  .hq6-callout-item:first-child {
    --o: 1;
  }

  /* ============================= HERO ============================= */
  .hq6-hero {
    position: relative;
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    padding: 4.5rem 1.5rem 5rem;
  }
  .hq6-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(110% 80% at 16% 0%, var(--hq6-blue-deep) 0%, transparent 52%);
    opacity: 0.5;
  }
  @media (min-width: 640px) {
    .hq6-hero {
      padding: 5rem 2.5rem 5rem;
    }
  }
  @media (min-width: 1024px) {
    .hq6-hero {
      padding: 5.5rem 4rem 5.5rem;
    }
  }

  .hq6-hero-grid {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: 1fr;
    gap: 3.5rem;
    align-items: center;
  }
  @media (min-width: 1024px) {
    .hq6-hero-grid {
      grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
      gap: 4rem;
    }
  }

  .hq6-eyebrow {
    display: inline-flex;
    align-items: flex-start;
    gap: 0.55rem;
    color: color-mix(in oklch, var(--hq6-paper) 78%, transparent);
    margin-bottom: 1.4rem;
  }
  .hq6-livedot {
    flex: 0 0 auto;
    width: 6px;
    height: 6px;
    margin-top: 0.28em;
    border-radius: 9999px;
    background: var(--hq6-phos);
  }

  .hq6-h1 {
    display: flex;
    flex-direction: column;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.045em;
    line-height: 0.88;
    font-size: clamp(2.7rem, min(6.7vw, 15vh), 7.3rem);
    color: var(--hq6-paper);
  }
  .hq6-mask {
    display: block;
    overflow: hidden;
    padding-bottom: 0.06em;
    margin-bottom: -0.06em;
  }
  .hq6-rise {
    display: block;
  }
  .hq6-h1-blue {
    color: var(--hq6-blue-text);
  }

  .hq6-dim {
    margin-top: 1.2rem;
    max-width: 38rem;
  }
  .hq6-dim-line {
    display: block;
    position: relative;
    height: 1px;
    background: color-mix(in oklch, var(--hq6-paper) 34%, transparent);
    transform-origin: left center;
  }
  .hq6-dim-line::before,
  .hq6-dim-line::after {
    content: "";
    position: absolute;
    top: -4px;
    width: 1px;
    height: 9px;
    background: color-mix(in oklch, var(--hq6-paper) 34%, transparent);
  }
  .hq6-dim-line::before {
    left: 0;
  }
  .hq6-dim-line::after {
    right: 0;
  }
  .hq6-dim-label {
    display: inline-block;
    margin-top: 0.7rem;
    color: var(--hq6-muted);
  }

  .hq6-briefing-k {
    margin-top: 1.7rem;
    color: var(--hq6-blue-text);
  }
  .hq6-lede {
    margin-top: 0.7rem;
    max-width: 34rem;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    line-height: 1.7;
    color: color-mix(in oklch, var(--hq6-paper) 76%, transparent);
  }

  .hq6-cta-row {
    margin-top: 2rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem 1.4rem;
  }

  .hq6-btn {
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.09em;
    font-size: 0.78rem;
    padding: 0.95rem 1.7rem;
    border: 1px solid var(--hq6-line);
    transition:
      transform 120ms cubic-bezier(0.25, 1, 0.5, 1),
      background-color 160ms ease,
      color 160ms ease,
      border-color 160ms ease;
  }
  .hq6-btn--solid {
    background: var(--hq6-blue);
    border-color: var(--hq6-blue);
    color: var(--hq6-paper);
  }
  .hq6-btn--solid:hover {
    background: oklch(64% 0.25 262);
    border-color: oklch(64% 0.25 262);
  }
  .hq6-btn--ghost {
    color: color-mix(in oklch, var(--hq6-paper) 82%, transparent);
    background: color-mix(in oklch, var(--hq6-paper) 4%, transparent);
  }
  .hq6-btn--ghost:hover {
    color: var(--hq6-paper);
    border-color: color-mix(in oklch, var(--hq6-paper) 42%, transparent);
  }
  @media (prefers-reduced-motion: no-preference) {
    .hq6-btn:active {
      transform: scale(0.97);
    }
  }

  /* hero scope column */
  .hq6-hero-scope {
    width: min(78vw, 380px);
    margin: 0 auto;
  }
  @media (min-width: 1024px) {
    .hq6-hero-scope {
      width: min(38vw, 30rem);
      margin: 0;
      justify-self: end;
    }
  }
  .hq6-feed {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    margin-top: 1.1rem;
    color: var(--hq6-muted);
  }
  .hq6-feeddot {
    flex: 0 0 auto;
    width: 5px;
    height: 5px;
    margin-top: 0.28em;
    border-radius: 9999px;
    background: var(--hq6-phos);
  }

  .hq6-scrollcue {
    position: absolute;
    left: 1.5rem;
    bottom: 1.6rem;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--hq6-muted);
  }
  .hq6-nudge {
    display: inline-block;
    color: var(--hq6-phos);
  }
  @media (min-width: 640px) {
    .hq6-scrollcue {
      left: 2.5rem;
    }
  }

  /* ========================= THE INTERCEPT ========================= */
  .hq6-intercept {
    position: relative;
    height: 560vh;
    border-top: 1px solid var(--hq6-line);
    /* phase vars written by the intercept action */
    --p: 0;
    --out: 0;
    --zf: 0;
    --zv: 0;
    --blip: 0;
    --ping: 0;
    --pingo: 0;
    --track: 0;
    --acq: 0;
    --gate: 0;
    --ledg: 0;
  }

  /* heading: screen readers always; becomes the visible section head in the
     static (mobile / reduced-motion) composition */
  .hq6-ih {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  .hq6-ih-kicker {
    display: block;
    margin-bottom: 1rem;
  }

  .hq6-istage {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
    background:
      radial-gradient(90% 70% at 84% 60%, color-mix(in oklch, var(--hq6-blue-deep) 55%, transparent) 0%, transparent 58%),
      var(--hq6-ink-2);
  }

  /* HUD bar */
  .hq6-ihud {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 4;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1.5rem;
    padding: 1.4rem 1.5rem 1.1rem;
    opacity: calc(1 - var(--zf, 0));
  }
  @media (min-width: 640px) {
    .hq6-ihud {
      /* extra right padding clears the fixed theme-toggle chrome in the corner */
      padding: 1.6rem 5.5rem 1.2rem 2.5rem;
    }
  }
  .hq6-ihud-l {
    color: var(--hq6-muted);
  }
  .hq6-ihud-c {
    color: var(--hq6-paper);
  }
  .hq6-ihud-r {
    color: var(--hq6-muted);
    display: none;
  }
  @media (min-width: 1280px) {
    .hq6-ihud-r {
      display: inline;
    }
  }

  .hq6-prog {
    position: absolute;
    top: 4.1rem;
    left: 1.5rem;
    right: 1.5rem;
    z-index: 4;
    height: 1px;
    background: var(--hq6-line);
    opacity: calc(1 - var(--zf, 0));
  }
  @media (min-width: 640px) {
    .hq6-prog {
      left: 2.5rem;
      right: 2.5rem;
      top: 4.4rem;
    }
  }
  .hq6-prog-fill {
    position: absolute;
    inset: 0;
    background: var(--hq6-blue);
    transform: scaleX(var(--p));
    transform-origin: left center;
  }

  /* big verb + line (stacked crossfade), left column */
  .hq6-verbwrap {
    position: absolute;
    left: 2.5rem;
    top: 18vh;
    z-index: 3;
    display: grid;
    opacity: calc(1 - var(--zf, 0));
  }
  .hq6-linewrap {
    position: absolute;
    left: 2.5rem;
    top: calc(18vh + clamp(3.6rem, 8vw, 7.4rem));
    z-index: 3;
    display: grid;
    max-width: min(32rem, 44vw);
    opacity: calc(1 - var(--zf, 0));
  }
  @media (min-width: 1024px) {
    .hq6-verbwrap,
    .hq6-linewrap {
      left: 4rem;
    }
  }
  .hq6-verb,
  .hq6-iline {
    grid-area: 1 / 1;
    opacity: var(--o, 0);
    transform: translateY(calc((1 - var(--o, 0)) * 14px));
  }
  .hq6-verb:first-child,
  .hq6-iline:first-child {
    --o: 1;
  }
  .hq6-verb {
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.04em;
    line-height: 0.9;
    font-size: clamp(3rem, 7.4vw, 7rem);
    color: var(--hq6-paper);
  }
  .hq6-iline {
    font-family: var(--font-mono);
    font-size: 0.88rem;
    line-height: 1.7;
    color: color-mix(in oklch, var(--hq6-paper) 72%, transparent);
  }

  /* the scope on stage, right side */
  .hq6-stagescope {
    position: absolute;
    right: 2.5rem;
    top: 52%;
    z-index: 1;
    width: min(66vh, 40vw);
    transform: translateY(-50%);
    opacity: calc(1 - var(--zf, 0) * 0.55);
  }
  @media (min-width: 1280px) {
    .hq6-stagescope {
      right: 4rem;
    }
  }

  /* sequence rail */
  .hq6-rail {
    position: absolute;
    left: 2.5rem;
    bottom: 8.5vh;
    z-index: 3;
    display: flex;
    gap: clamp(1.2rem, 2.6vw, 2.6rem);
    opacity: calc(1 - var(--zf, 0));
  }
  @media (min-width: 1024px) {
    .hq6-rail {
      left: 4rem;
    }
  }
  .hq6-railitem {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
  }
  .hq6-railnode {
    width: 8px;
    height: 8px;
    border: 1px solid color-mix(in oklch, var(--hq6-paper) 45%, transparent);
    background: color-mix(in oklch, var(--hq6-blue) calc(var(--done, 0) * 100%), var(--hq6-ink-2));
    transform: rotate(45deg) scale(calc(1 + var(--a, 0) * 0.45));
  }
  .hq6-raillabel {
    color: color-mix(in oklch, var(--hq6-paper) calc(42% + var(--a, 0) * 50%), transparent);
    white-space: nowrap;
  }

  .hq6-output {
    position: absolute;
    left: 50%;
    bottom: 3.6vh;
    z-index: 3;
    transform: translateX(-50%) translateY(calc((1 - var(--out)) * 12px));
    opacity: calc(var(--out) * (1 - var(--zf, 0)));
    white-space: nowrap;
    color: color-mix(in oklch, var(--hq6-paper) 80%, transparent);
  }
  .hq6-output-phos {
    color: var(--hq6-phos);
  }

  /* sweep hold: ink veil for a seamless un-pin */
  .hq6-veil {
    position: absolute;
    inset: 0;
    z-index: 5;
    pointer-events: none;
    background: var(--hq6-ink);
    opacity: var(--zv, 0);
  }

  /* the in-flow stage list: hidden visually on the pinned desktop stage,
     the real composition on small screens / reduced motion */
  .hq6-ilist {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }

  @media (max-width: 767px), (prefers-reduced-motion: reduce) {
    .hq6-intercept {
      height: auto;
      padding: 5.5rem 1.5rem 6rem;
    }
    .hq6-istage {
      display: none;
    }
    .hq6-ih {
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
    .hq6-ilist {
      position: static;
      width: auto;
      height: auto;
      overflow: visible;
      clip-path: none;
      display: flex;
      flex-direction: column;
      border: 1px solid var(--hq6-line);
    }
    .hq6-irow {
      display: flex;
      gap: 1.2rem;
      align-items: flex-start;
      padding: 1.5rem 1.3rem;
      border-top: 1px solid var(--hq6-line);
    }
    .hq6-irow:first-child {
      border-top: 0;
    }
    .hq6-irow-scope {
      flex: 0 0 auto;
      width: 56px;
      height: 56px;
    }
    .hq6-irow-scope :global(svg) {
      display: block;
      width: 100%;
      height: 100%;
    }
    .hq6-irow-copy {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .hq6-irow-meta {
      color: var(--hq6-blue-text);
    }
    .hq6-irow-verb {
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: -0.02em;
      line-height: 1;
      font-size: clamp(1.7rem, 6vw, 2.6rem);
      color: var(--hq6-paper);
    }
    .hq6-irow-line {
      font-family: var(--font-mono);
      font-size: 0.84rem;
      line-height: 1.65;
      color: color-mix(in oklch, var(--hq6-paper) 70%, transparent);
      max-width: 44rem;
    }
  }
  @media (min-width: 768px) and (prefers-reduced-motion: reduce) {
    .hq6-intercept {
      padding: 6rem 4rem 7rem;
    }
  }
  .hq6-mini-ring {
    fill: none;
    stroke: var(--hq6-line);
    stroke-width: 1.2;
  }

  /* ==================== THE CREED — WEAPONS HOLD ==================== */
  .hq6-holdpin {
    position: relative;
    height: 230vh;
    /* no border-top: the intercept's veil exits on flat ink and this section
       opens on flat ink — a hairline here would draw a seam */
    /* phase vars written by the hold action */
    --g: 0;
    --gl: 0;
    --hold: 0;
    --gr: 0;
    --gs: 0;
  }
  .hq6-gstage {
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
    background: var(--hq6-ink);
  }
  .hq6-gkicker {
    color: var(--hq6-muted);
    opacity: calc(0.4 + var(--gl) * 0.6);
  }

  /* the hold hairline — the weapons-hold boundary requests must cross */
  .hq6-gline {
    position: absolute;
    left: 50%;
    top: 14vh;
    bottom: 14vh;
    width: 1px;
    background: color-mix(in oklch, var(--hq6-blue) calc(30% + var(--hold) * 70%), var(--hq6-line));
    transform: scaleY(var(--hold));
    transform-origin: center top;
    opacity: calc(0.35 + var(--hold) * 0.65);
  }
  .hq6-gline-label {
    position: absolute;
    left: calc(50% + 0.9rem);
    top: 27vh;
    writing-mode: vertical-rl;
    color: var(--hq6-muted);
    opacity: var(--hold);
  }

  .hq6-creed {
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
  .hq6-creed-l {
    text-align: right;
    color: var(--hq6-paper);
    opacity: var(--gl);
    transform: translateX(calc((1 - var(--gl)) * -28px));
  }
  .hq6-creed-r {
    text-align: left;
    color: var(--hq6-blue-text);
    opacity: var(--gr);
    transform: scale(calc(1.14 - var(--gr) * 0.14));
    transform-origin: left center;
  }

  /* authorization requests queuing at the hold */
  .hq6-chips {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.7rem;
    --cross: clamp(120px, 22vw, 260px);
  }
  .hq6-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.7rem;
    font-family: var(--font-mono);
    font-size: 0.66rem;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    padding: 0.55rem 0.85rem;
    border: 1px solid var(--hq6-line);
    background: var(--hq6-ink-2);
    color: color-mix(in oklch, var(--hq6-paper) 78%, transparent);
    white-space: nowrap;
    opacity: var(--in, 0);
    transform: translateX(calc(var(--cross) * -1 + var(--c, 0) * 2 * var(--cross)))
      translateY(calc((1 - var(--in, 0)) * 10px));
  }
  .hq6-chip-req {
    color: var(--hq6-muted);
  }
  .hq6-chip[data-verdict="refused"] {
    border-color: color-mix(in oklch, var(--hq6-amber) calc(var(--stamp, 0) * 70%), var(--hq6-line));
  }
  .hq6-chip-stamp {
    display: inline-block;
    padding: 0.15rem 0.45rem;
    border: 1px solid var(--hq6-blue-text);
    color: var(--hq6-blue-text);
    opacity: var(--stamp, 0);
    transform: scale(calc(1.25 - var(--stamp, 0) * 0.25));
  }
  .hq6-chip[data-verdict="refused"] .hq6-chip-stamp {
    border-color: var(--hq6-amber);
    color: var(--hq6-amber);
  }

  .hq6-gsub {
    position: relative;
    z-index: 2;
    max-width: 34rem;
    text-align: center;
    color: var(--hq6-muted);
    opacity: var(--gs);
    transform: translateY(calc((1 - var(--gs)) * 10px));
  }

  @media (max-width: 767px) {
    .hq6-holdpin {
      height: 190vh;
    }
    .hq6-gstage {
      gap: 2.2rem;
    }
    .hq6-gline,
    .hq6-gline-label {
      display: none;
    }
    .hq6-creed {
      grid-template-columns: 1fr;
      gap: 0.6rem;
      text-align: center;
      font-size: clamp(2.3rem, 10vw, 4rem);
    }
    .hq6-creed-l,
    .hq6-creed-r {
      text-align: center;
    }
    .hq6-creed-r {
      transform-origin: center center;
    }
    .hq6-chips {
      --cross: clamp(10px, 4vw, 22px);
    }
    .hq6-chip {
      white-space: normal;
      text-align: left;
      max-width: 82vw;
    }
  }

  /* reduced motion: no pin, calm static composition (vars land at 1) */
  @media (prefers-reduced-motion: reduce) {
    .hq6-holdpin {
      height: auto;
    }
    .hq6-gstage {
      position: static;
      height: auto;
      min-height: 0;
      padding: 6rem 1.5rem;
    }
  }

  /* ============================ THE CLOSE ============================ */
  .hq6-final {
    position: relative;
    padding: 6rem 1.5rem;
    border-top: 1px solid var(--hq6-line);
  }
  @media (min-width: 640px) {
    .hq6-final {
      padding: 8rem 2.5rem;
    }
  }
  @media (min-width: 1024px) {
    .hq6-final {
      padding: 9rem 4rem;
    }
  }
  .hq6-fkicker {
    color: var(--hq6-muted);
    margin-bottom: 1.2rem;
  }
  .hq6-h2 {
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.03em;
    line-height: 0.9;
    font-size: clamp(2.4rem, 6.5vw, 5.4rem);
    color: var(--hq6-paper);
  }
  .hq6-body {
    margin-top: 1.6rem;
    max-width: 40rem;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    line-height: 1.75;
    color: color-mix(in oklch, var(--hq6-paper) 74%, transparent);
  }
  .hq6-final .hq6-cta-row {
    margin-top: 2.4rem;
  }

  /* ============================= FOOTER ============================= */
  .hq6-foot {
    border-top: 1px solid var(--hq6-line);
    padding: 4rem 1.5rem 5rem;
  }
  @media (min-width: 640px) {
    .hq6-foot {
      padding: 4.5rem 2.5rem 5.5rem;
    }
  }
  @media (min-width: 1024px) {
    .hq6-foot {
      padding: 4.5rem 4rem 5.5rem;
    }
  }
  .hq6-foot-grid {
    display: grid;
    gap: 2.5rem;
    grid-template-columns: 1fr;
  }
  @media (min-width: 768px) {
    .hq6-foot-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  .hq6-foot :global(.hud),
  .hq6-foot .hud {
    line-height: 2;
  }
  .hq6-foot-strong {
    color: var(--hq6-paper);
    margin-bottom: 0.6rem;
  }
  .hq6-foot-links a {
    transition: color 140ms ease;
  }
  .hq6-foot-links a:hover {
    color: var(--hq6-paper);
  }
  .hq6-foot-links a:first-child {
    color: var(--hq6-blue-text);
  }
  .hq6-foot-links a:first-child:hover {
    color: var(--hq6-paper);
  }
  .hq6-foot-last {
    text-align: left;
  }
  @media (min-width: 768px) {
    .hq6-foot-last {
      text-align: right;
    }
  }
</style>
