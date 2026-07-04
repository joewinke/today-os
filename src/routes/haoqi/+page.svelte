<script lang="ts">
  import "$lib/haoqi/haoqi.css"
  import { reveal } from "$lib/actions/reveal"
  import { parallax, pinScene } from "$lib/haoqi/scene"
  import { MOVES, FINDINGS } from "$lib/haoqi/copy"
</script>

<svelte:head>
  <title>Today OS · Acquire More Customers — haoqi cut</title>
  <meta
    name="description"
    content="An alternate cut of the Today OS landing page in the haoqi.design language — royal-blue, glossy, and choreographed around one pinned scroll moment: agents propose, humans approve."
  />
</svelte:head>

<div class="haoqi-page">
  <!-- ============================= HERO ============================= -->
  <section class="hq-hero blueprint" use:parallax={1}>
    <span class="crosshair" style="left: 12%; top: 24%;" aria-hidden="true"></span>
    <span class="crosshair" style="right: 14%; top: 62%;" aria-hidden="true"></span>

    <!-- floating stickers (mouse-parallax + idle float) -->
    <span class="hq-sticker hq-sticker--chip hq-float-a" data-depth="1.6" aria-hidden="true">TODAY&nbsp;OS</span>
    <span class="hq-sticker hq-sticker--plus hq-float-b" data-depth="2.4" aria-hidden="true">+</span>
    <span class="hq-sticker hq-sticker--gem hq-float-a" data-depth="1.1" aria-hidden="true">
      <svg viewBox="0 0 100 100" width="52" height="52" role="presentation">
        <polygon points="34,22 66,22 82,40 50,44 18,40" fill="var(--hq-gem-top)" />
        <polygon points="18,40 50,44 50,92" fill="var(--hq-gem-left)" />
        <polygon points="82,40 50,44 50,92" fill="var(--hq-gem-right)" />
        <polygon points="34,22 50,44 66,22" fill="var(--hq-gem-face)" />
      </svg>
    </span>
    <span class="hq-sticker hq-sticker--dot hq-float-b" data-depth="3" aria-hidden="true"></span>

    <div class="hq-hero-inner">
      <p class="hud hq-eyebrow"><span class="hq-livedot"></span> TODAY&nbsp;OS — THE OPERATING SYSTEM FOR PERFORMANCE MARKETING</p>

      <h1 class="hq-h1">
        Acquire<br />
        More<br />
        Customers.
      </h1>

      <!-- the glossy 3D script accent -->
      <span class="hq-gloss-wrap hq-gloss-sheen" data-depth="0.6" aria-hidden="true">
        <span class="hq-gloss">today</span>
      </span>

      <p class="hq-lede">
        Find advertisers, pitch them with personalized video, run their accounts behind human gates,
        and prove the result on a ledger — the whole agency lifecycle in one operating system.
      </p>

      <div class="hq-cta-row">
        <a href="/os" class="hq-btn hq-btn--solid">Enter Today OS &rarr;</a>
        <a href="/readme" class="hq-btn hq-btn--ghost">See the contest entry</a>
      </div>
    </div>

    <p class="hud hq-scrollcue" aria-hidden="true">SCROLL ↓</p>
  </section>

  <!-- =========================== LIFECYCLE =========================== -->
  <section class="hq-section">
    <div class="hq-section-head" use:reveal>
      <span class="hud hq-kicker">SEC. 01 / THE LIFECYCLE</span>
      <h2 class="hq-h2">One system.<br />Five moves.</h2>
      <p class="hq-body">
        Find → Pitch → Close → Run → Prove. The whole agency lifecycle in one operating system.
        Sign in and operate every stage yourself.
      </p>
    </div>

    <div class="hq-moves">
      {#each MOVES as move, i (move.n)}
        <a href={move.href} class="hq-move" use:reveal={{ delay: i * 0.06 }}>
          <span class="hq-move-n" aria-hidden="true">{move.n}</span>
          <span class="hq-move-verb">{move.verb}</span>
          <span class="hq-move-line">{move.line}</span>
          <span class="hud hq-move-go" aria-hidden="true">ENTER →</span>
        </a>
      {/each}
    </div>
  </section>

  <!-- ==================== THE SIGNATURE PINNED MOMENT ==================== -->
  <section class="hq-pin" use:pinScene aria-label="Agents propose. Humans approve.">
    <div class="hq-stage" data-stage>
      <canvas class="hq-burst" data-burst aria-hidden="true"></canvas>

      <!-- gemstone motif → scales into a viewport-filling diagonal sweep -->
      <div class="hq-sweep" aria-hidden="true">
        <svg viewBox="0 0 100 100" width="180" height="180" role="presentation">
          <polygon points="34,22 66,22 82,40 50,44 18,40" fill="var(--hq-gem-top)" />
          <polygon points="18,40 50,44 50,92" fill="var(--hq-gem-left)" />
          <polygon points="82,40 50,44 50,92" fill="var(--hq-gem-right)" />
          <polygon points="34,22 50,44 66,22" fill="var(--hq-gem-face)" />
          <line x1="8" y1="12" x2="94" y2="70" class="hq-streak" />
        </svg>
      </div>

      <div class="hq-pin-inner">
        <p class="hud hq-pin-kicker">SEC. 02 / THE CREED · INNOVATE WITH PURPOSE</p>
        <h2 class="hq-pin-head">
          <span>Agents</span>
          <span>propose.</span>
          <span class="hq-pin-accent">Humans approve.</span>
        </h2>
        <p class="hud hq-pin-sub">
          EVERY AGENT FIX PASSES A SPEND-CAP GATE — NOTHING UNSAFE SHIPS WITHOUT A HUMAN AT THE SWITCH.
        </p>
      </div>
    </div>
  </section>

  <!-- =========================== CASE STUDY =========================== -->
  <section class="hq-section hq-case">
    <div class="hq-section-head" use:reveal>
      <span class="hud hq-kicker">SEC. 03 / CASE STUDY</span>
      <h2 class="hq-h2">This site is<br />the case study.</h2>
      <p class="hq-body">
        Today OS rebuilt It’s Today Media. Every pixel, every video, every audit on this domain came
        out of the tool — same company, same headline, same Baltimore phone number. You are standing
        in the output.
      </p>
    </div>

    <div class="hq-case-grid">
      <figure class="hq-2018" use:reveal={{ animation: "scale-in-center" }}>
        <img
          src="/img/before-2018.webp"
          alt="It’s Today Media’s website as it stood in 2018 — a flat clip-art hero on a white background"
          loading="lazy"
        />
        <figcaption class="hud">FIG. 00 — THE SITE, © 2018 · WORDPRESS · CLIP ART</figcaption>
      </figure>

      <div class="hq-case-copy" use:reveal={{ delay: 0.1 }}>
        <span class="hud hq-kicker hq-kicker--accent">FIG. 01 — THE SITE, NOW · YOU ARE HERE</span>
        <p class="hq-h3">See it for yourself.</p>
        <p class="hq-body">
          Want proof it’s the same site, reskinned by the tool? On the main landing page a live
          <span class="hq-chip">[ 2018 ↔ NOW ]</span> chip flips the whole page back to the original
          skin and forward again.
        </p>
        <a href="/" class="hq-btn hq-btn--ghost">Open the main site →</a>
      </div>
    </div>

    <!-- live findings marquee -->
    <div class="hq-ticker-wrap" aria-label="Sample audit findings">
      <p class="hud hq-ticker-label">
        LIVE DEMO FIXTURES — <span class="hq-warn">$20,905/MO</span> WASTE SURFACED · 25 RECS · 1 BLOCKED BY THE GATE
      </p>
      <div class="hq-ticker">
        <div class="hq-marquee">
          {#each [...FINDINGS, ...FINDINGS] as f, i (i)}
            <span class="hud hq-finding"><span class="hq-diamond">◆</span> {f}</span>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <!-- ============================= CLOSE ============================= -->
  <section class="hq-section hq-close">
    <div use:reveal>
      <span class="hud hq-kicker">SEC. 04 / THE CLOSE</span>
      <h2 class="hq-h2 hq-h2--xl">Sign in.<br />Operate it<br />yourself.</h2>
      <p class="hq-body">
        Everything here runs on sample data. Point it at real accounts and it’s a marketing team that
        never sleeps — finding advertisers, pitching them, auditing spend behind your approval, and
        proving the result on a ledger.
      </p>
      <div class="hq-cta-row">
        <a href="/os" class="hq-btn hq-btn--solid">Enter Today OS &rarr;</a>
        <a href="/" class="hq-btn hq-btn--ghost">Back to the main site</a>
      </div>
    </div>
    <p class="hud hq-foot">TODAY OS · HAOQI CUT — AN ALTERNATE LANDING · REACHED DIRECTLY AT /HAOQI</p>
  </section>
</div>

<style>
  /* ── route-local palette (scoped; never touches global tokens) ── */
  .haoqi-page {
    /* royal-blue family (#1a1ac8-ish) translated to oklch */
    --hq-royal: oklch(42% 0.25 272);
    --hq-royal-deep: oklch(33% 0.22 274);
    --hq-royal-bright: oklch(58% 0.24 268);
    --hq-ink: oklch(11% 0.02 266);
    --hq-paper: oklch(97% 0.012 260);
    --hq-cyan: oklch(80% 0.14 208);
    --hq-violet: oklch(64% 0.22 292);
    --hq-line: color-mix(in oklch, var(--hq-paper) 16%, transparent);

    /* glossy "today" fill + extrusion */
    --hq-gloss-top: oklch(88% 0.06 244);
    --hq-gloss-mid: oklch(99% 0.006 250);
    --hq-gloss-bot: oklch(56% 0.24 266);
    --hq-gloss-edge: oklch(70% 0.2 266);
    --hq-gloss-shadow: oklch(30% 0.16 268);

    /* gem facets */
    --hq-gem-top: oklch(82% 0.13 246);
    --hq-gem-face: oklch(97% 0.02 250);
    --hq-gem-left: oklch(46% 0.24 270);
    --hq-gem-right: oklch(60% 0.22 264);

    position: relative;
    isolation: isolate;
    min-height: 100vh;
    background: var(--hq-ink);
    color: var(--hq-paper);
    font-family: var(--font-display);
    overflow-x: clip;
  }

  /* ============================= HERO ============================= */
  .hq-hero {
    position: relative;
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    padding: 5rem 1.5rem 4rem;
    background:
      radial-gradient(125% 95% at 26% 4%, var(--hq-royal) 0%, transparent 52%),
      radial-gradient(90% 80% at 96% 30%, var(--hq-royal-deep) 0%, transparent 46%),
      var(--hq-ink);
  }
  @media (min-width: 640px) {
    .hq-hero {
      padding: 6rem 2.5rem 5rem;
    }
  }
  @media (min-width: 1024px) {
    .hq-hero {
      padding: 7rem 4rem 6rem;
    }
  }

  .hq-hero-inner {
    position: relative;
    z-index: 3;
    max-width: 62rem;
  }

  .hq-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    color: color-mix(in oklch, var(--hq-paper) 82%, transparent);
    margin-bottom: 1.6rem;
  }
  .hq-livedot {
    width: 6px;
    height: 6px;
    border-radius: 9999px;
    background: var(--hq-cyan);
    box-shadow: 0 0 10px var(--hq-cyan);
  }

  .hq-h1 {
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.045em;
    line-height: 0.86;
    font-size: clamp(2.4rem, 11vw, 9.5rem);
    color: var(--hq-paper);
    transform: scaleY(1.06);
    transform-origin: left top;
  }

  .hq-lede {
    margin-top: 2.2rem;
    max-width: 34rem;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    line-height: 1.7;
    color: color-mix(in oklch, var(--hq-paper) 78%, transparent);
  }

  .hq-cta-row {
    margin-top: 2.4rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem 1.4rem;
  }

  /* buttons — hardware-flat, square, mono label */
  .hq-btn {
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.09em;
    font-size: 0.78rem;
    padding: 0.95rem 1.7rem;
    border: 1px solid var(--hq-line);
    transition:
      transform 120ms cubic-bezier(0.25, 1, 0.5, 1),
      background-color 160ms ease,
      color 160ms ease,
      border-color 160ms ease;
  }
  .hq-btn--solid {
    background: var(--hq-royal-bright);
    border-color: var(--hq-royal-bright);
    color: var(--hq-paper);
  }
  .hq-btn--solid:hover {
    background: oklch(64% 0.25 266);
    border-color: oklch(64% 0.25 266);
  }
  .hq-btn--ghost {
    color: color-mix(in oklch, var(--hq-paper) 82%, transparent);
    background: color-mix(in oklch, var(--hq-paper) 4%, transparent);
  }
  .hq-btn--ghost:hover {
    color: var(--hq-paper);
    border-color: color-mix(in oklch, var(--hq-paper) 42%, transparent);
  }
  @media (prefers-reduced-motion: no-preference) {
    .hq-btn:active {
      transform: scale(0.97);
    }
  }

  .hq-scrollcue {
    position: absolute;
    left: 1.5rem;
    bottom: 1.6rem;
    z-index: 3;
    color: color-mix(in oklch, var(--hq-paper) 55%, transparent);
  }
  @media (min-width: 640px) {
    .hq-scrollcue {
      left: 2.5rem;
    }
  }

  /* ── hero stickers ── */
  .hq-sticker {
    position: absolute;
    z-index: 2;
    pointer-events: none;
    will-change: transform;
  }
  .hq-sticker--chip {
    top: 18%;
    right: 8%;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    color: var(--hq-paper);
    background: var(--hq-royal-deep);
    border: 1px solid var(--hq-line);
    padding: 0.45rem 0.7rem;
  }
  .hq-sticker--plus {
    bottom: 20%;
    left: 7%;
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 3rem;
    line-height: 1;
    color: var(--hq-cyan);
  }
  .hq-sticker--gem {
    top: 60%;
    right: 16%;
    filter: drop-shadow(0 6px 14px oklch(0% 0 0 / 0.45));
  }
  .hq-sticker--dot {
    top: 30%;
    left: 12%;
    width: 14px;
    height: 14px;
    border-radius: 9999px;
    background: var(--hq-violet);
    box-shadow: 0 0 16px color-mix(in oklch, var(--hq-violet) 70%, transparent);
  }
  @media (max-width: 640px) {
    /* declutter on phones — the chip/gem/dot crowd the wrapped eyebrow + headline */
    .hq-sticker--gem,
    .hq-sticker--dot,
    .hq-sticker--chip {
      display: none;
    }
  }

  /* ── glossy "today" ── */
  .hq-gloss-wrap {
    position: absolute;
    z-index: 2;
    top: 4.5rem;
    right: 4%;
    display: inline-block;
    overflow: hidden;
    pointer-events: none;
    transform: rotate(-7deg);
    will-change: transform;
  }
  .hq-gloss {
    display: block;
    font-family: var(--font-display);
    font-style: italic;
    font-weight: 800;
    text-transform: lowercase;
    letter-spacing: -0.04em;
    font-size: clamp(2.6rem, 7.5vw, 6rem);
    line-height: 1;
    background: linear-gradient(176deg, var(--hq-gloss-top), var(--hq-gloss-mid) 46%, var(--hq-gloss-bot));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    filter: drop-shadow(0 1px 0 var(--hq-gloss-edge)) drop-shadow(0 2px 0 var(--hq-gloss-edge))
      drop-shadow(0 4px 0 var(--hq-gloss-shadow)) drop-shadow(0 12px 18px oklch(0% 0 0 / 0.55));
  }
  .hq-gloss-sheen::after {
    content: "";
    position: absolute;
    inset: 0;
    width: 40%;
    background: linear-gradient(
      90deg,
      transparent,
      color-mix(in oklch, var(--hq-paper) 85%, transparent),
      transparent
    );
    opacity: 0;
    transform: translateX(-120%) skewX(-18deg);
    mix-blend-mode: overlay;
  }
  @media (max-width: 900px) {
    .hq-gloss-wrap {
      position: static;
      transform: rotate(-5deg);
      margin: 1.4rem 0 0;
    }
  }

  /* ============================ SECTIONS ============================ */
  .hq-section {
    position: relative;
    padding: 6rem 1.5rem;
    border-top: 1px solid var(--hq-line);
  }
  @media (min-width: 640px) {
    .hq-section {
      padding: 8rem 2.5rem;
    }
  }
  @media (min-width: 1024px) {
    .hq-section {
      padding: 9rem 4rem;
    }
  }

  .hq-section-head {
    max-width: 44rem;
    margin-bottom: 3.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
  }
  .hq-kicker {
    color: color-mix(in oklch, var(--hq-paper) 55%, transparent);
  }
  .hq-kicker--accent {
    color: var(--hq-royal-bright);
  }

  .hq-h2 {
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.03em;
    line-height: 0.9;
    font-size: clamp(2.4rem, 6.5vw, 5.4rem);
    color: var(--hq-paper);
  }
  .hq-h2--xl {
    font-size: clamp(2.8rem, 9vw, 7.5rem);
  }
  .hq-h3 {
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    line-height: 0.95;
    font-size: clamp(1.8rem, 4.5vw, 3.4rem);
    color: var(--hq-paper);
  }
  .hq-body {
    max-width: 40rem;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    line-height: 1.75;
    color: color-mix(in oklch, var(--hq-paper) 74%, transparent);
  }

  /* ── lifecycle moves ── */
  .hq-moves {
    border: 1px solid var(--hq-line);
  }
  .hq-move {
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
    padding: 1.6rem 1.4rem;
    border-top: 1px solid var(--hq-line);
    overflow: hidden;
    transition:
      background-color 200ms ease,
      color 200ms ease;
  }
  .hq-move:first-child {
    border-top: 0;
  }
  .hq-move-n {
    position: absolute;
    right: 1rem;
    top: -1.4rem;
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 6rem;
    line-height: 1;
    color: color-mix(in oklch, var(--hq-paper) 6%, transparent);
    transition: color 200ms ease;
  }
  .hq-move-verb {
    font-family: var(--font-display);
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    font-size: clamp(1.9rem, 4vw, 3rem);
    line-height: 1;
    color: var(--hq-paper);
  }
  .hq-move-line {
    max-width: 46rem;
    font-family: var(--font-mono);
    font-size: 0.84rem;
    line-height: 1.65;
    color: color-mix(in oklch, var(--hq-paper) 66%, transparent);
    transition: color 200ms ease;
  }
  .hq-move-go {
    color: color-mix(in oklch, var(--hq-paper) 55%, transparent);
    transition: transform 200ms ease;
  }
  .hq-move:hover {
    background: var(--hq-royal);
  }
  .hq-move:hover .hq-move-line {
    color: color-mix(in oklch, var(--hq-paper) 92%, transparent);
  }
  .hq-move:hover .hq-move-n {
    color: color-mix(in oklch, var(--hq-paper) 14%, transparent);
  }
  @media (prefers-reduced-motion: no-preference) {
    .hq-move:hover .hq-move-go {
      transform: translateX(4px);
    }
  }
  @media (min-width: 720px) {
    .hq-move {
      grid-template-columns: 68px minmax(180px, 280px) 1fr auto;
      align-items: baseline;
      gap: 1.5rem;
      padding: 2.2rem;
    }
    .hq-move-n {
      position: static;
      font-size: 1.4rem;
      color: var(--hq-royal-bright);
    }
    .hq-move:hover .hq-move-n {
      color: var(--hq-paper);
    }
  }

  /* ===================== THE PINNED MOMENT ===================== */
  .hq-pin {
    position: relative;
    height: 300vh;
    /* phase vars written by pinScene */
    --p: 0;
    --sweep: 0;
    --head: 0;
    --rel: 0;
  }
  .hq-stage {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background:
      radial-gradient(120% 120% at 50% 50%, var(--hq-royal-deep) 0%, transparent 60%),
      oklch(7% 0.02 268);
    border-top: 1px solid var(--hq-line);
    border-bottom: 1px solid var(--hq-line);
  }
  .hq-burst {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    opacity: calc(0.35 + var(--sweep) * 0.65);
    pointer-events: none;
  }

  /* gemstone → diagonal sweep */
  .hq-sweep {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 2;
    pointer-events: none;
    transform: translate(-50%, -50%) rotate(calc(-42deg * var(--sweep)))
      scale(calc(0.4 + var(--sweep) * 8));
    /* bright as it fills, then recedes to a colored wash once the headline pins */
    opacity: calc((0.25 + var(--sweep) * 0.75) * (1 - var(--head) * 0.72) * (1 - var(--rel)));
    filter: drop-shadow(0 0 40px color-mix(in oklch, var(--hq-cyan) 40%, transparent));
    transform-origin: center;
  }
  .hq-streak {
    stroke: var(--hq-gloss-mid);
    stroke-width: 1.4;
    opacity: calc(var(--sweep) * 0.9);
  }

  .hq-pin-inner {
    position: relative;
    z-index: 3;
    text-align: center;
    padding: 0 1.5rem;
    max-width: 60rem;
    transform: translateY(calc(var(--rel) * -5vh));
    opacity: calc(1 - var(--rel) * 0.75);
  }
  .hq-pin-kicker {
    display: block;
    margin-bottom: 1.4rem;
    color: color-mix(in oklch, var(--hq-paper) 60%, transparent);
    opacity: var(--head);
  }
  .hq-pin-head {
    font-family: var(--font-display);
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.03em;
    line-height: 0.9;
    font-size: clamp(2.6rem, 8.5vw, 8rem);
    color: var(--hq-paper);
    text-shadow: 0 2px 34px oklch(8% 0.02 266 / 0.65);
  }
  .hq-pin-head span {
    display: block;
    opacity: var(--head);
    transform: translateY(calc((1 - var(--head)) * 22px));
  }
  .hq-pin-head span:nth-child(2) {
    transform: translateY(calc((1 - var(--head)) * 34px));
  }
  .hq-pin-accent {
    background: linear-gradient(92deg, var(--hq-cyan), var(--hq-gloss-mid) 50%, var(--hq-violet));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .hq-pin-sub {
    margin-top: 1.8rem;
    color: color-mix(in oklch, var(--hq-paper) 62%, transparent);
    opacity: var(--head);
  }
  @media (max-width: 640px) {
    /* shorter pin + gentler sweep on phones */
    .hq-pin {
      height: 220vh;
    }
    .hq-stage {
      height: 100svh;
    }
    .hq-sweep {
      transform: translate(-50%, -50%) rotate(calc(-38deg * var(--sweep)))
        scale(calc(0.4 + var(--sweep) * 5));
    }
  }

  /* reduced motion: collapse the pin to a normal-flow static composition —
     no 300vh of empty scroll, no pinning tricks */
  @media (prefers-reduced-motion: reduce) {
    .hq-pin {
      height: auto;
    }
    .hq-stage {
      position: static;
      height: auto;
      min-height: 78vh;
      padding: 6rem 0;
    }
    .hq-pin-inner {
      transform: none;
      opacity: 1;
    }
    .hq-pin-head span {
      transform: none;
    }
  }

  /* ============================ CASE STUDY ============================ */
  .hq-case-grid {
    display: grid;
    gap: 2.5rem;
    align-items: center;
  }
  @media (min-width: 900px) {
    .hq-case-grid {
      grid-template-columns: 1.1fr 1fr;
      gap: 4rem;
    }
  }
  .hq-2018 {
    border: 1px solid var(--hq-line);
    background: oklch(20% 0.01 260);
  }
  .hq-2018 img {
    display: block;
    width: 100%;
    height: auto;
  }
  .hq-2018 figcaption {
    padding: 0.85rem 1rem;
    border-top: 1px solid var(--hq-line);
    color: color-mix(in oklch, var(--hq-paper) 55%, transparent);
  }
  .hq-case-copy {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    align-items: flex-start;
  }
  .hq-chip {
    font-family: var(--font-mono);
    font-size: 0.8em;
    color: var(--hq-cyan);
    border: 1px solid color-mix(in oklch, var(--hq-cyan) 40%, transparent);
    padding: 0.05rem 0.4rem;
    white-space: nowrap;
  }

  /* ── findings ticker ── */
  .hq-ticker-wrap {
    margin-top: 4rem;
  }
  .hq-ticker-label {
    color: color-mix(in oklch, var(--hq-paper) 55%, transparent);
    margin-bottom: 1.2rem;
  }
  .hq-warn {
    color: var(--hq-cyan);
  }
  .hq-ticker {
    overflow: hidden;
    border-top: 1px solid var(--hq-line);
    border-bottom: 1px solid var(--hq-line);
    padding: 0.85rem 0;
  }
  .hq-finding {
    white-space: nowrap;
    padding: 0 1.6rem;
    color: color-mix(in oklch, var(--hq-paper) 72%, transparent);
  }
  .hq-diamond {
    color: var(--hq-violet);
  }

  /* ============================== CLOSE ============================== */
  .hq-close {
    display: flex;
    flex-direction: column;
    gap: 3.5rem;
  }
  .hq-close .hq-body {
    margin-top: 1.6rem;
  }
  .hq-close .hq-cta-row {
    margin-top: 2.2rem;
  }
  .hq-foot {
    color: color-mix(in oklch, var(--hq-paper) 45%, transparent);
    border-top: 1px solid var(--hq-line);
    padding-top: 2rem;
  }
</style>
