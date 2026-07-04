<script lang="ts">
  import "$lib/haoqi7/haoqi7.css"
  import { reveal } from "$lib/actions/reveal"
  import { reel, creed } from "$lib/haoqi7/scene"
  import { SCENES, GATE_CHIPS, LEDE, FIXTURES } from "$lib/haoqi7/copy"
</script>

<svelte:head>
  <title>Today OS · Acquire More Customers — the film cut</title>
  <meta
    name="description"
    content="An alternate cut of the Today OS landing page staged as a cinematic title sequence: a countdown leader resolves into the title card, five scenes — Find, Pitch, Close, Run, Prove — scrub past inside a letterboxed frame, and the creed gets top billing. Agents propose. Humans approve."
  />
</svelte:head>

<div class="hq7">
  <!-- ============================= HERO — THE LEADER ============================= -->
  <header class="hq7-hero">
    <div class="hq7-bar hq7-bar--hero">
      <span class="hud hq7-bar-dim"><span class="hq7-livedot"></span>ACADEMY LEADER · PICTURE START</span>
      <span class="hud hq7-bar-dim hq7-bar-right">1.85:1 · 24 FPS · SANDBOX</span>
    </div>

    <div class="hq7-hero-center">
      <h1 class="hq7-title">
        <span class="hq7-mask"><span class="hq7-rise" style="--d: 2300;">Acquire</span></span>
        <span class="hq7-mask"><span class="hq7-rise" style="--d: 2400;">More</span></span>
        <span class="hq7-mask"><span class="hq7-rise hq7-title-blue" style="--d: 2500;">Customers.</span></span>
      </h1>

      <!-- billing block: presented-by line, then the logline -->
      <p class="hud hq7-presents hq7-fade" style="--d: 2750;">
        IT&rsquo;S TODAY MEDIA PRESENTS &middot; A TODAY OS PRODUCTION
      </p>
      <p class="hq7-logline hq7-fade" style="--d: 2850;">{LEDE}</p>

      <div class="hq7-cta-row hq7-fade" style="--d: 2980;">
        <a href="/os" class="hq7-btn hq7-btn--solid">Enter Today OS &rarr;</a>
        <a href="/readme" class="hq7-btn hq7-btn--ghost">See the contest entry</a>
      </div>

      <!-- honest seam: the certificate card -->
      <div class="hq7-cert hq7-fade" style="--d: 3120;">
        <p class="hud hq7-cert-line">CERTIFIED &middot; SAMPLE DATA</p>
        <p class="hud hq7-cert-fixtures">{FIXTURES}</p>
      </div>
    </div>

    <div class="hq7-bar hq7-bar--hero">
      <span class="hud hq7-bar-dim" aria-hidden="true">
        SCROLL — THE PICTURE IS BELOW <span class="hq7-nudge">&darr;</span>
      </span>
      <span class="hud hq7-bar-dim">REEL 01 FOLLOWS</span>
    </div>

    <!-- the countdown leader: covers the hero, plays 5·4·3·2, fades out.
         Purely decorative — default-hidden, only shown by the no-preference
         animation in haoqi7.css. -->
    <div class="hq7-leader" aria-hidden="true">
      <span class="hq7-leader-hline"></span>
      <span class="hq7-leader-vline"></span>
      <div class="hq7-ring">
        <span class="hq7-sweep"><span class="hq7-hand"></span></span>
        <span class="hq7-num" style="--k: 0;">5</span>
        <span class="hq7-num" style="--k: 1;">4</span>
        <span class="hq7-num" style="--k: 2;">3</span>
        <span class="hq7-num" style="--k: 3;">2</span>
      </div>
      <p class="hud hq7-leader-label">PICTURE START &middot; TODAY OS &middot; THE FILM CUT</p>
    </div>
  </header>

  <!-- ======================== REEL 01 — FIVE SCENES (pinned) ======================== -->
  <section class="hq7-reel" use:reel aria-labelledby="hq7-reel-h">
    <h2 id="hq7-reel-h" class="hq7-rh">
      <span class="hud hq7-rh-kicker">REEL 01 / THE LIFECYCLE</span>
      One picture.<br />Five scenes.
    </h2>

    <!-- the pinned frame (decorative mirror of the scene list below) -->
    <div class="hq7-stage" aria-hidden="true">
      <!-- dimmed backing footage behind SCENE 02 · PITCH — the product makes
           videos, so the pitch card plays over the shoot itself -->
      <div class="hq7-footage">
        <video data-footage src="/video/samples/crew.mp4" muted loop playsinline preload="metadata">
          <track kind="captions" />
        </video>
      </div>

      <div class="hq7-cards">
        {#each SCENES as s, i (s.n)}
          <div class="hq7-card" data-card>
            <p class="hud hq7-slate">SCENE {s.n} &middot; TAKE 01 &middot; {s.read}</p>
            <p class="hq7-verb" class:hq7-verb-blue={i === 4}>{s.verb}</p>
            <p class="hq7-subline">{s.line}</p>
          </div>
        {/each}
      </div>

      <!-- cut to black: the ink veil rises, the bars close, the slug flashes -->
      <div class="hq7-veil"></div>
      <p class="hud hq7-slug">CUT TO: THE CREED</p>

      <div class="hq7-bar hq7-sbar hq7-sbar--top">
        <span class="hud hq7-bar-dim">REEL 01 — THE LIFECYCLE</span>
        <span class="hud hq7-bar-bright">SCENE <span data-count>01</span>/05</span>
        <span class="hud hq7-bar-dim hq7-bar-wide hq7-bar-right">{FIXTURES}</span>
      </div>
      <div class="hq7-bar hq7-sbar hq7-sbar--bottom">
        <span class="hud hq7-bar-bright" data-tc>TC 00:00:00:00</span>
        <span class="hq7-scrub"><span class="hq7-scrub-fill"></span></span>
        <span class="hud hq7-bar-dim">1.85:1 &middot; 24 FPS</span>
      </div>
    </div>

    <!-- the five scenes in flow: screen readers always, small screens and
         reduced motion visually -->
    <ol class="hq7-list">
      {#each SCENES as s, i (s.n)}
        <li class="hq7-row" use:reveal={{ animation: "fade-in", delay: i * 0.08 }}>
          <span class="hq7-row-stripe" aria-hidden="true"></span>
          <div class="hq7-row-copy">
            <span class="hud hq7-row-meta">SCENE {s.n} &middot; TAKE 01 &middot; {s.read}</span>
            <h3 class="hq7-row-verb">{s.verb}</h3>
            <p class="hq7-row-line">{s.line}</p>
          </div>
        </li>
      {/each}
    </ol>
  </section>

  <!-- ===================== REEL 02 — THE CREED (pinned title card) ===================== -->
  <section class="hq7-creedpin" use:creed aria-labelledby="hq7-creed-h">
    <div class="hq7-cstage">
      <div class="hq7-bar hq7-cbar hq7-cbar--top">
        <span class="hud hq7-bar-dim">REEL 02 — THE CREED</span>
        <span class="hud hq7-bar-dim hq7-bar-right">TITLE CARD</span>
      </div>

      <p class="hud hq7-ckicker">THE PICTURE&rsquo;S ONE RULE</p>

      <h2 id="hq7-creed-h" class="hq7-creed">
        <span class="hq7-creed-a">Agents propose.</span>
        <span class="hq7-creed-b">Humans approve.</span>
      </h2>

      <!-- ratings card: proposals reviewed at the gate, verdicts stamped -->
      <div class="hq7-ratings">
        <p class="hud hq7-ratings-head">THE FOLLOWING PROPOSALS WERE REVIEWED AT THE SPEND-CAP GATE</p>
        <ul class="hq7-ratings-list">
          {#each GATE_CHIPS as c (c.label)}
            <li class="hq7-crow" data-row data-verdict={c.verdict}>
              <span class="hq7-crow-label">{c.label}</span>
              <span class="hq7-crow-stamp">{c.stamp}</span>
            </li>
          {/each}
        </ul>
        <p class="hud hq7-ratings-foot">CERT NO. HQ7-001 &middot; SANDBOX &middot; SAMPLE DATA</p>
      </div>

      <p class="hud hq7-csub">
        AGENTS AUDIT SPEND ON A CADENCE AND PROPOSE FIXES WITH DOLLAR IMPACT — A SPEND-CAP GATE REFUSES
        ANYTHING UNSAFE UNTIL A HUMAN APPROVES.
      </p>

      <div class="hq7-bar hq7-cbar hq7-cbar--bottom">
        <span class="hud hq7-bar-dim">NO UNSAFE CHANGE PASSES THE GATE</span>
        <span class="hud hq7-bar-dim">END OF REEL 02</span>
      </div>
    </div>
  </section>

  <!-- ========================= REEL 03 — END CREDITS ========================= -->
  <section class="hq7-credits" aria-labelledby="hq7-close-h">
    <div class="hq7-credits-inner" use:reveal>
      <p class="hud hq7-fkicker">REEL 03 / END CREDITS</p>
      <h2 id="hq7-close-h" class="hq7-h2">Built inside the<br />Build Challenge.</h2>
      <p class="hq7-body">
        The case study, the contest entry, and the product are the same object: Today OS was built
        inside It&rsquo;s Today Media&rsquo;s Build Challenge, on It&rsquo;s Today Media&rsquo;s own
        domain. Everything above runs on sample data — labeled sample. The README answers what it
        does, why this one, and what I&rsquo;d build next.
      </p>
      <div class="hq7-cta-row">
        <a href="/os" class="hq7-btn hq7-btn--solid">Enter Today OS &rarr;</a>
        <a href="/readme" class="hq7-btn hq7-btn--ghost">Read the thinking (README)</a>
      </div>
    </div>

    <!-- the credit roll -->
    <footer class="hq7-roll" use:reveal={{ delay: 0.1 }}>
      <div class="hq7-credit">
        <span class="hud hq7-credit-role">PRESENTED BY</span>
        <span class="hud hq7-credit-name">IT&rsquo;S TODAY MEDIA, LLC</span>
      </div>
      <div class="hq7-credit">
        <span class="hud hq7-credit-role">SHOT ON LOCATION</span>
        <span class="hud hq7-credit-name">12 W MADISON ST &middot; BALTIMORE, MD 21201</span>
      </div>
      <div class="hq7-credit">
        <span class="hud hq7-credit-role">POSITION</span>
        <span class="hud hq7-credit-name">39.2977&deg; N &middot; 76.6157&deg; W</span>
      </div>
      <div class="hq7-credit">
        <span class="hud hq7-credit-role">INDEX</span>
        <span class="hud hq7-credit-name hq7-credit-links">
          <a href="/">BACK TO THE MAIN SITE</a>
          <a href="/os">ENTER TODAY OS</a>
          <a href="/readme">README</a>
          <a href="/haoqi">FIRST CUT (/HAOQI)</a>
          <a href="/haoqi2">MACHINE CUT (/HAOQI2)</a>
        </span>
      </div>
      <p class="hud hq7-colophon">
        TODAY OS &middot; THE FILM CUT — AN ALTERNATE LANDING, REACHED DIRECTLY AT /HAOQI7
      </p>
      <p class="hq7-fin" aria-hidden="true">FIN<span class="hq7-fin-dot">.</span></p>
    </footer>
  </section>
</div>

<style>
  /* ── route-local palette (scoped; never touches global tokens) ── */
  .hq7 {
    --hq7-ink: oklch(11.5% 0.015 262);
    --hq7-ink-2: oklch(14.5% 0.016 262);
    --hq7-bar: oklch(7.5% 0.012 262);
    --hq7-paper: oklch(97% 0.006 250);
    --hq7-blue: oklch(58% 0.245 262);
    --hq7-blue-text: oklch(66% 0.21 260);
    --hq7-blue-deep: oklch(34% 0.17 264);
    --hq7-amber: oklch(78% 0.12 85);
    --hq7-line: color-mix(in oklch, var(--hq7-paper) 14%, transparent);
    --hq7-muted: color-mix(in oklch, var(--hq7-paper) 60%, transparent);

    position: relative;
    isolation: isolate;
    min-height: 100vh;
    background: var(--hq7-ink);
    color: var(--hq7-paper);
    font-family: var(--font-display);
    overflow-x: clip;
  }

  /* ── letterbox bar: the cinema frame, shared by hero and both stages ── */
  .hq7-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    min-height: clamp(2.7rem, 6vh, 3.6rem);
    padding: 0 1.5rem;
    background: var(--hq7-bar);
  }
  @media (min-width: 640px) {
    .hq7-bar {
      padding: 0 2.5rem;
    }
  }
  .hq7-bar-dim {
    color: var(--hq7-muted);
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    white-space: nowrap;
  }
  .hq7-bar-bright {
    color: var(--hq7-paper);
    white-space: nowrap;
  }
  .hq7-bar-right {
    /* clears the fixed theme-toggle chrome in the corner */
    padding-right: 3.5rem;
  }
  .hq7-bar-wide {
    display: none;
  }
  @media (min-width: 1180px) {
    .hq7-bar-wide {
      display: inline-flex;
    }
  }
  .hq7-livedot {
    flex: 0 0 auto;
    width: 6px;
    height: 6px;
    border-radius: 9999px;
    background: var(--hq7-blue-text);
  }
  .hq7-nudge {
    display: inline-block;
    color: var(--hq7-blue-text);
  }

  /* ============================= HERO ============================= */
  .hq7-hero {
    position: relative;
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .hq7-hero-center {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 3rem 1.5rem;
  }
  .hq7-hero-center::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(90% 75% at 50% 115%, var(--hq7-blue-deep) 0%, transparent 55%);
    opacity: 0.5;
  }
  .hq7-hero-center > * {
    position: relative;
    z-index: 1;
  }

  .hq7-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.045em;
    line-height: 0.88;
    /* vh term keeps the whole card (title + billing + CTAs) above the fold on
       short viewports; vw term rules on tall ones */
    font-size: clamp(2.9rem, min(12vw, 16vh), 11.5rem);
    color: var(--hq7-paper);
  }
  .hq7-mask {
    display: block;
    overflow: hidden;
    padding-bottom: 0.06em; /* keep descender-free caps from clipping at tight line-height */
    margin-bottom: -0.06em;
  }
  .hq7-rise {
    display: block;
  }
  .hq7-title-blue {
    color: var(--hq7-blue-text);
  }

  .hq7-presents {
    margin-top: 2rem;
    color: color-mix(in oklch, var(--hq7-paper) 80%, transparent);
    letter-spacing: 0.22em;
  }
  .hq7-logline {
    margin-top: 1rem;
    max-width: 38rem;
    font-family: var(--font-mono);
    font-size: 0.88rem;
    line-height: 1.7;
    color: color-mix(in oklch, var(--hq7-paper) 74%, transparent);
  }

  .hq7-cta-row {
    margin-top: 2.1rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 1rem 1.4rem;
  }

  /* buttons — hardware-flat, square, mono label */
  .hq7-btn {
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.09em;
    font-size: 0.78rem;
    padding: 0.95rem 1.7rem;
    border: 1px solid var(--hq7-line);
    transition:
      transform 120ms cubic-bezier(0.25, 1, 0.5, 1),
      background-color 160ms ease,
      color 160ms ease,
      border-color 160ms ease;
  }
  .hq7-btn--solid {
    background: var(--hq7-blue);
    border-color: var(--hq7-blue);
    color: var(--hq7-paper);
  }
  .hq7-btn--solid:hover {
    background: oklch(64% 0.25 262);
    border-color: oklch(64% 0.25 262);
  }
  .hq7-btn--ghost {
    color: color-mix(in oklch, var(--hq7-paper) 82%, transparent);
    background: color-mix(in oklch, var(--hq7-paper) 4%, transparent);
  }
  .hq7-btn--ghost:hover {
    color: var(--hq7-paper);
    border-color: color-mix(in oklch, var(--hq7-paper) 42%, transparent);
  }
  @media (prefers-reduced-motion: no-preference) {
    .hq7-btn:active {
      transform: scale(0.97);
    }
  }

  /* the certificate card — honest seam */
  .hq7-cert {
    margin-top: 2.6rem;
    border: 1px solid var(--hq7-line);
    padding: 0.85rem 1.3rem;
    max-width: min(92vw, 40rem);
  }
  .hq7-cert-line {
    color: var(--hq7-blue-text);
    letter-spacing: 0.2em;
  }
  .hq7-cert-fixtures {
    margin-top: 0.35rem;
    color: var(--hq7-muted);
    white-space: normal;
  }

  /* ── the countdown leader ── */
  .hq7-leader {
    position: absolute;
    inset: 0;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    background: var(--hq7-ink);
    opacity: 0; /* only the no-preference animation ever shows it */
    pointer-events: none;
  }
  .hq7-leader-hline,
  .hq7-leader-vline {
    position: absolute;
    background: color-mix(in oklch, var(--hq7-paper) 12%, transparent);
  }
  .hq7-leader-hline {
    left: 0;
    right: 0;
    top: 50%;
    height: 1px;
  }
  .hq7-leader-vline {
    top: 0;
    bottom: 0;
    left: 50%;
    width: 1px;
  }
  .hq7-ring {
    position: relative;
    width: clamp(180px, 30vmin, 260px);
    height: clamp(180px, 30vmin, 260px);
    border: 1px solid color-mix(in oklch, var(--hq7-paper) 32%, transparent);
    border-radius: 9999px;
  }
  .hq7-ring::before {
    content: "";
    position: absolute;
    inset: 14px;
    border: 1px solid color-mix(in oklch, var(--hq7-paper) 16%, transparent);
    border-radius: 9999px;
  }
  .hq7-sweep {
    position: absolute;
    inset: 0;
  }
  .hq7-hand {
    position: absolute;
    left: 50%;
    top: 4%;
    width: 1px;
    height: 46%;
    background: color-mix(in oklch, var(--hq7-blue-text) 75%, transparent);
    transform-origin: bottom center;
  }
  .hq7-num {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-weight: 800;
    font-size: clamp(5rem, 16vmin, 8rem);
    line-height: 1;
    color: var(--hq7-paper);
    opacity: 0;
  }
  .hq7-leader-label {
    color: var(--hq7-muted);
    letter-spacing: 0.24em;
  }

  /* ======================== REEL 01 — THE SCENES ======================== */
  .hq7-reel {
    position: relative;
    height: 560vh;
    /* phase vars written by the reel action */
    --p: 0;
    --cut: 0;
    --slug: 0;
    --v1: 0;
  }

  /* heading: screen readers always; becomes the visible section head in the
     static (mobile / reduced-motion) composition */
  .hq7-rh {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  .hq7-rh-kicker {
    display: block;
    margin-bottom: 1rem;
  }

  .hq7-stage {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
    background:
      radial-gradient(85% 65% at 50% 118%, var(--hq7-blue-deep) 0%, transparent 55%),
      var(--hq7-ink-2);
  }

  /* dimmed backing footage (SCENE 02 · PITCH) */
  .hq7-footage {
    position: absolute;
    inset: 0;
    z-index: 1;
    opacity: calc(var(--v1) * 0.22);
  }
  .hq7-footage video {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .hq7-footage::after {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
      120% 90% at 50% 50%,
      transparent 0%,
      var(--hq7-ink-2) 78%
    );
  }

  /* the stacked title cards */
  .hq7-cards {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: grid;
    place-items: center;
    padding: 14vh 1.5rem;
  }
  .hq7-card {
    grid-area: 1 / 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.4rem;
    max-width: min(88vw, 58rem);
    opacity: calc(var(--r, 0) * (1 - var(--f, 0)));
    transform: scale(calc(1.05 - var(--r, 0) * 0.05 + var(--f, 0) * 0.07));
    will-change: transform, opacity;
  }
  .hq7-card:first-child {
    --r: 1;
  }
  .hq7-slate {
    color: var(--hq7-blue-text);
    letter-spacing: 0.22em;
  }
  .hq7-verb {
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.04em;
    line-height: 0.88;
    font-size: clamp(3.6rem, 12vw, 11rem);
    color: var(--hq7-paper);
  }
  .hq7-verb-blue {
    color: var(--hq7-blue-text);
  }
  .hq7-subline {
    font-family: var(--font-mono);
    font-size: 0.88rem;
    line-height: 1.7;
    max-width: 38rem;
    color: color-mix(in oklch, var(--hq7-paper) 72%, transparent);
  }

  /* cut to black */
  .hq7-veil {
    position: absolute;
    inset: 0;
    z-index: 5;
    pointer-events: none;
    background: var(--hq7-ink);
    opacity: var(--cut);
  }
  .hq7-slug {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 7;
    transform: translate(-50%, -50%);
    color: var(--hq7-paper);
    letter-spacing: 0.3em;
    opacity: var(--slug);
    pointer-events: none;
  }

  /* the frame's own letterbox bars (they close during the cut) */
  .hq7-sbar {
    position: absolute;
    left: 0;
    right: 0;
    z-index: 6;
    height: clamp(3rem, 8vh, 4.5rem);
  }
  .hq7-sbar--top {
    top: 0;
    transform: scaleY(calc(1 + var(--cut) * 0.9));
    transform-origin: center top;
  }
  .hq7-sbar--bottom {
    bottom: 0;
    transform: scaleY(calc(1 + var(--cut) * 0.9));
    transform-origin: center bottom;
  }

  /* scrub bar in the bottom letterbox */
  .hq7-scrub {
    position: relative;
    flex: 1;
    max-width: clamp(8rem, 30vw, 22rem);
    height: 1px;
    background: var(--hq7-line);
  }
  .hq7-scrub-fill {
    position: absolute;
    inset: 0;
    background: var(--hq7-blue);
    transform: scaleX(var(--p));
    transform-origin: left center;
  }

  /* the in-flow scene list: hidden visually on the pinned desktop stage,
     the real composition on small screens / reduced motion */
  .hq7-list {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }

  @media (max-width: 767px), (prefers-reduced-motion: reduce) {
    .hq7-reel {
      height: auto;
      padding: 5.5rem 1.5rem 6rem;
    }
    .hq7-stage {
      display: none;
    }
    .hq7-rh {
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
    .hq7-list {
      position: static;
      width: auto;
      height: auto;
      overflow: visible;
      clip-path: none;
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
    }
    .hq7-row {
      border: 1px solid var(--hq7-line);
      background: var(--hq7-ink-2);
    }
    /* clapper stripe along the top of each scene card */
    .hq7-row-stripe {
      display: block;
      height: 7px;
      background: repeating-linear-gradient(
        -45deg,
        color-mix(in oklch, var(--hq7-paper) 26%, transparent) 0 9px,
        transparent 9px 18px
      );
      border-bottom: 1px solid var(--hq7-line);
    }
    .hq7-row-copy {
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
      padding: 1.4rem 1.3rem 1.6rem;
    }
    .hq7-row-meta {
      color: var(--hq7-blue-text);
      letter-spacing: 0.18em;
    }
    .hq7-row-verb {
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: -0.02em;
      line-height: 1;
      font-size: clamp(1.9rem, 7vw, 3rem);
      color: var(--hq7-paper);
    }
    .hq7-row-line {
      font-family: var(--font-mono);
      font-size: 0.84rem;
      line-height: 1.65;
      color: color-mix(in oklch, var(--hq7-paper) 70%, transparent);
      max-width: 44rem;
    }
  }
  @media (min-width: 768px) and (prefers-reduced-motion: reduce) {
    .hq7-reel {
      padding: 6rem 4rem 7rem;
    }
  }

  /* ===================== REEL 02 — THE CREED ===================== */
  .hq7-creedpin {
    position: relative;
    height: 230vh;
    /* phase vars written by the creed action */
    --gk: 0;
    --ga: 0;
    --gb: 0;
    --card: 0;
    --gs: 0;
  }
  .hq7-cstage {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2.6rem;
    padding: clamp(4rem, 10vh, 6rem) 1.5rem;
    background: var(--hq7-ink);
    text-align: center;
  }
  .hq7-cbar {
    position: absolute;
    left: 0;
    right: 0;
    height: clamp(3rem, 8vh, 4.5rem);
  }
  .hq7-cbar--top {
    top: 0;
  }
  .hq7-cbar--bottom {
    bottom: 0;
  }

  .hq7-ckicker {
    color: var(--hq7-muted);
    letter-spacing: 0.26em;
    opacity: var(--gk);
  }

  .hq7-creed {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.04em;
    line-height: 0.9;
    font-size: clamp(2.4rem, 8.5vw, 8.8rem);
  }
  .hq7-creed-a {
    color: var(--hq7-paper);
    opacity: var(--ga);
    transform: translateY(calc((1 - var(--ga)) * 26px));
  }
  .hq7-creed-b {
    color: var(--hq7-blue-text);
    opacity: var(--gb);
    transform: scale(calc(1.12 - var(--gb) * 0.12));
    transform-origin: center center;
  }

  /* the ratings card */
  .hq7-ratings {
    border: 1px solid var(--hq7-line);
    background: var(--hq7-ink-2);
    max-width: min(92vw, 46rem);
    padding: 1.1rem 1.3rem 1rem;
    opacity: var(--card);
    transform: translateY(calc((1 - var(--card)) * 16px));
  }
  .hq7-ratings-head {
    color: var(--hq7-muted);
    letter-spacing: 0.14em;
    white-space: normal;
    padding-bottom: 0.8rem;
    border-bottom: 1px solid var(--hq7-line);
  }
  .hq7-ratings-list {
    display: flex;
    flex-direction: column;
  }
  .hq7-crow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.2rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--hq7-line);
    font-family: var(--font-mono);
    font-size: 0.68rem;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    text-align: left;
    color: color-mix(in oklch, var(--hq7-paper) 78%, transparent);
    opacity: var(--in, 0);
    transform: translateY(calc((1 - var(--in, 0)) * 10px));
  }
  .hq7-crow-stamp {
    flex: 0 0 auto;
    display: inline-block;
    padding: 0.18rem 0.5rem;
    border: 1px solid var(--hq7-blue-text);
    color: var(--hq7-blue-text);
    opacity: var(--stamp, 0);
    transform: scale(calc(1.3 - var(--stamp, 0) * 0.3)) rotate(calc((1 - var(--stamp, 0)) * -6deg));
  }
  .hq7-crow[data-verdict="refused"] .hq7-crow-stamp {
    border-color: var(--hq7-amber);
    color: var(--hq7-amber);
  }
  .hq7-crow[data-verdict="refused"] .hq7-crow-label {
    color: color-mix(in oklch, var(--hq7-amber) 70%, var(--hq7-paper));
  }
  .hq7-ratings-foot {
    color: var(--hq7-muted);
    letter-spacing: 0.18em;
    padding-top: 0.8rem;
  }

  .hq7-csub {
    max-width: 40rem;
    color: var(--hq7-muted);
    white-space: normal;
    line-height: 1.9;
    opacity: var(--gs);
    transform: translateY(calc((1 - var(--gs)) * 10px));
  }

  @media (max-width: 767px), (prefers-reduced-motion: reduce) {
    .hq7-creedpin {
      height: auto;
    }
    .hq7-cstage {
      position: static;
      height: auto;
      min-height: 0;
      overflow: visible;
      padding: 6rem 1.5rem;
      gap: 2.2rem;
    }
    .hq7-cbar {
      display: none;
    }
    .hq7-ckicker,
    .hq7-creed-a,
    .hq7-creed-b,
    .hq7-ratings,
    .hq7-crow,
    .hq7-crow-stamp,
    .hq7-csub {
      opacity: 1;
      transform: none;
    }
    .hq7-creed {
      font-size: clamp(2.3rem, 10vw, 4.2rem);
    }
  }

  /* ===================== REEL 03 — END CREDITS ===================== */
  .hq7-credits {
    position: relative;
    border-top: 1px solid var(--hq7-line);
    padding: 6rem 1.5rem 4rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  @media (min-width: 640px) {
    .hq7-credits {
      padding: 8rem 2.5rem 5rem;
    }
  }
  .hq7-credits-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .hq7-fkicker {
    color: var(--hq7-muted);
    letter-spacing: 0.26em;
    margin-bottom: 1.2rem;
  }
  .hq7-h2 {
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.03em;
    line-height: 0.9;
    font-size: clamp(2.4rem, 6.5vw, 5.4rem);
    color: var(--hq7-paper);
  }
  .hq7-body {
    margin-top: 1.6rem;
    max-width: 40rem;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    line-height: 1.75;
    color: color-mix(in oklch, var(--hq7-paper) 74%, transparent);
  }
  .hq7-credits .hq7-cta-row {
    margin-top: 2.4rem;
  }

  /* the credit roll */
  .hq7-roll {
    margin-top: 5.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.6rem;
    text-align: center;
    width: 100%;
    max-width: 44rem;
    border-top: 1px solid var(--hq7-line);
    padding-top: 3.5rem;
  }
  .hq7-credit {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }
  .hq7-credit-role {
    color: var(--hq7-muted);
    letter-spacing: 0.26em;
  }
  .hq7-credit-name {
    color: var(--hq7-paper);
    letter-spacing: 0.12em;
    line-height: 1.9;
  }
  .hq7-credit-links {
    display: flex;
    flex-direction: column;
  }
  .hq7-credit-links a {
    transition: color 140ms ease;
  }
  .hq7-credit-links a:first-child {
    color: var(--hq7-blue-text);
  }
  .hq7-credit-links a:hover {
    color: var(--hq7-blue-text);
  }
  .hq7-colophon {
    margin-top: 1.4rem;
    color: var(--hq7-muted);
    letter-spacing: 0.18em;
    white-space: normal;
  }
  .hq7-fin {
    margin-top: 2.2rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-size: 2.6rem;
    line-height: 1;
    color: var(--hq7-paper);
  }
  .hq7-fin-dot {
    color: var(--hq7-blue-text);
  }
</style>
