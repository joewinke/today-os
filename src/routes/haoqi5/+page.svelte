<script lang="ts">
  import "$lib/haoqi5/haoqi5.css"
  import { reveal } from "$lib/actions/reveal"
  import { ledger, opinion } from "$lib/haoqi5/scene"
  import { STATIONS, GATE_CHIPS, LEDE, FIXTURES, BOTTOM_LINE, OUTPUT_LINE, GATE_SUB } from "$lib/haoqi5/copy"
</script>

<svelte:head>
  <title>Today OS · Acquire More Customers — the ledger cut</title>
  <meta
    name="description"
    content="An alternate cut of the Today OS landing page set as the audited book of the acquisition engine: five lifecycle entries — Find, Pitch, Close, Run, Prove — post to the ledger, the waste-surfaced total ticks up to $20,905/mo, and the opinion is countersigned by a human. Agents propose. Humans approve."
  />
</svelte:head>

<div class="hq5">
  <!-- ============================= HERO — THE COVER ============================= -->
  <header class="hq5-hero">
    <span class="hq5-margin-rule" aria-hidden="true"></span>
    <span class="hq5-cross" style="right: 11%; top: 16%;" aria-hidden="true"></span>
    <span class="hq5-cross" style="right: 8%; bottom: 24%;" aria-hidden="true"></span>

    <div class="hud hq5-docrow hq5-fade" style="--d: 0;" aria-hidden="true">
      <span>FORM AE-5 — STATEMENT OF THE ACQUISITION ENGINE</span>
      <span class="hq5-docrow-r">PERIOD: MONTHLY &middot; UNITS: USD</span>
    </div>

    <div class="hq5-hero-inner">
      <p class="hud hq5-eyebrow hq5-fade" style="--d: 60;">
        <span class="hq5-livedot"></span>
        TODAY OS — THE OPERATING SYSTEM FOR PERFORMANCE MARKETING
      </p>

      <h1 class="hq5-h1">
        <span class="hq5-mask"><span class="hq5-rise" style="--d: 80;">Acquire</span></span>
        <span class="hq5-mask"><span class="hq5-rise" style="--d: 170;">More</span></span>
        <span class="hq5-mask"><span class="hq5-rise hq5-h1-blue" style="--d: 260;">Customers.</span></span>
      </h1>

      <div class="hq5-exhibit" aria-hidden="true">
        <span class="hq5-exhibit-line hq5-draw" style="--d: 620;"></span>
        <span class="hud hq5-exhibit-label hq5-fade" style="--d: 860;">EXHIBIT A — THE LIFECYCLE, STATED IN DOLLARS</span>
      </div>

      <p class="hq5-lede hq5-fade" style="--d: 520;">{LEDE}</p>

      <div class="hq5-cols2">
        <div class="hq5-cta-row hq5-fade" style="--d: 640;">
          <a href="/os" class="hq5-btn hq5-btn--solid">Enter Today OS &rarr;</a>
          <a href="/readme" class="hq5-btn hq5-btn--ghost">See the contest entry</a>
        </div>

        <!-- the bottom line, set like the cover figure of an annual report;
             every string is a verbatim piece of the FIXTURES seam -->
        <div class="hq5-bl hq5-fade" style="--d: 780;">
          <div class="hud hq5-bl-head">
            <span class="hq5-bl-feed">{BOTTOM_LINE.feed}</span>
            <span>BOTTOM LINE</span>
          </div>
          <div class="hq5-bl-fig">
            <span class="hq5-bl-amount">{BOTTOM_LINE.amount}</span>
            <span class="hud hq5-bl-unit">{BOTTOM_LINE.unit}</span>
          </div>
          <div class="hud hq5-bl-sub">
            <span>{BOTTOM_LINE.recs}</span>
            <span class="hq5-bl-blocked">{BOTTOM_LINE.blocked}</span>
          </div>
        </div>
      </div>
    </div>

    <p class="hud hq5-scrollcue hq5-fade" style="--d: 1100;" aria-hidden="true">
      SCROLL — THE LEDGER IS BELOW <span class="hq5-nudge">&darr;</span>
    </p>
  </header>

  <!-- ======================= THE LEDGER (pinned) ======================= -->
  <section class="hq5-ledger" use:ledger aria-labelledby="hq5-ledger-h">
    <h2 id="hq5-ledger-h" class="hq5-lh">
      <span class="hud hq5-lh-kicker">SEC. 01 / THE LEDGER</span>
      One book.<br />Five entries.
    </h2>

    <!-- the pinned sheet (decorative mirror of the entry list below) -->
    <div class="hq5-lstage" aria-hidden="true">
      <div class="hq5-lhud">
        <span class="hud hq5-lhud-l">SEC. 01 / THE LEDGER — POSTING</span>
        <span class="hud hq5-lhud-c">ENTRY <span data-count>01</span>/05</span>
        <span class="hud hq5-lhud-r">{FIXTURES}</span>
      </div>
      <span class="hq5-prog"><span class="hq5-prog-fill"></span></span>

      <!-- giant account-name watermark, crossfading behind the sheet -->
      <div class="hq5-marks">
        {#each STATIONS as s (s.n)}
          <span class="hq5-mark" data-mark>{s.verb}</span>
        {/each}
      </div>

      <div class="hq5-sheetwrap">
        <div class="hq5-sheet">
          <div class="hud hq5-sheet-head">
            <span>GENERAL LEDGER — ACQUISITION ENGINE</span>
            <span class="hq5-sheet-head-r">ALL FIGURES TABULAR &middot; USD</span>
          </div>
          <div class="hud hq5-colhead">
            <span>NO.</span>
            <span>ACCOUNT</span>
            <span>REF</span>
            <span>MEMO</span>
            <span class="hq5-c-r">POSTED</span>
          </div>

          {#each STATIONS as s (s.n)}
            <div class="hq5-erow" data-entry>
              <div class="hq5-erow-in">
                <span class="hq5-e-no">{s.n}</span>
                <span class="hq5-e-acct">{s.verb}</span>
                <span class="hud hq5-e-ref">{s.read}</span>
                <span class="hq5-e-memo">{s.line}</span>
                <span class="hq5-c-r"><span class="hq5-stamp">POSTED</span></span>
              </div>
            </div>
          {/each}

          <div class="hq5-totalrow">
            <span class="hud hq5-total-label">BOTTOM LINE — WASTE SURFACED &middot; RUNNING</span>
            <span class="hq5-total-fig">
              <span class="hq5-caret"></span>
              <span class="hq5-total-amount" data-total>$20,905</span>
              <span class="hud hq5-total-unit">/MO</span>
            </span>
          </div>
          <span class="hq5-dblrule" aria-hidden="true"></span>
        </div>
      </div>

      <p class="hud hq5-output">
        {OUTPUT_LINE} &middot; <span class="hq5-output-blue">LEDGER +</span> &middot; CARRIED FORWARD — NEXT PERIOD OPEN
      </p>
    </div>

    <!-- the five entries in flow: screen readers always, small screens and
         reduced motion visually -->
    <ol class="hq5-llist">
      {#each STATIONS as s, i (s.n)}
        <li class="hq5-lrow" use:reveal={{ animation: "fade-in", delay: i * 0.08 }}>
          <span class="hud hq5-lrow-no">{s.n}</span>
          <div class="hq5-lrow-copy">
            <h3 class="hq5-lrow-acct">{s.verb}</h3>
            <span class="hud hq5-lrow-ref">{s.read}</span>
            <p class="hq5-lrow-memo">{s.line}</p>
          </div>
        </li>
      {/each}
      <li class="hq5-lrow hq5-lrow--total" use:reveal={{ animation: "fade-in", delay: 0.4 }}>
        <span class="hud hq5-lrow-no" aria-hidden="true">&Sigma;</span>
        <div class="hq5-lrow-copy">
          <span class="hud hq5-lrow-ref">BOTTOM LINE — {BOTTOM_LINE.feed}</span>
          <p class="hq5-lrow-fig">
            <span class="hq5-lrow-amount">{BOTTOM_LINE.amount}</span>
            <span class="hud">{BOTTOM_LINE.unit} &middot; {BOTTOM_LINE.recs} &middot; {BOTTOM_LINE.blocked}</span>
          </p>
          <p class="hud hq5-lrow-out">{OUTPUT_LINE} &middot; LEDGER +</p>
        </div>
      </li>
    </ol>
  </section>

  <!-- ==================== THE AUDIT OPINION (pinned) ==================== -->
  <section class="hq5-oppin" use:opinion aria-labelledby="hq5-creed-h">
    <div class="hq5-ostage">
      <p class="hud hq5-okicker">SEC. 02 / THE AUDIT OPINION</p>

      <h2 id="hq5-creed-h" class="hq5-creed">
        <span class="hq5-creed-l">Agents propose.</span>
        <span class="hq5-creed-r">Humans approve.</span>
      </h2>

      <ul class="hq5-journal">
        {#each GATE_CHIPS as c (c.label)}
          <li class="hq5-jrow" data-jrow data-verdict={c.verdict}>
            <span class="hq5-jlabel">{c.label}</span>
            <span class="hq5-jstamp">{c.stamp}</span>
            <span class="hud hq5-jnote">{c.verdict === "refused" ? "NEVER POSTED" : "POSTED TO LEDGER"}</span>
          </li>
        {/each}
      </ul>

      <div class="hq5-sig">
        <div class="hq5-sig-block">
          <span class="hq5-sig-line hq5-sig-line--a" aria-hidden="true"></span>
          <span class="hud hq5-sig-label hq5-sig-label--a">PROPOSED BY — THE AGENTS</span>
        </div>
        <div class="hq5-sig-block">
          <span class="hq5-sig-line hq5-sig-line--b" aria-hidden="true"></span>
          <span class="hud hq5-sig-label hq5-sig-label--b">COUNTERSIGNED — A HUMAN, AT THE GATE</span>
        </div>
      </div>

      <p class="hud hq5-osub">{GATE_SUB}</p>
    </div>
  </section>

  <!-- ============================ THE CLOSE ============================ -->
  <section class="hq5-final" aria-labelledby="hq5-close-h">
    <div use:reveal>
      <p class="hud hq5-fkicker">SEC. 03 / THE CLOSE</p>
      <h2 id="hq5-close-h" class="hq5-h2">Built inside the<br />Build Challenge.</h2>
      <p class="hq5-body">
        The case study, the contest entry, and the product are the same object: Today OS was built
        inside It&rsquo;s Today Media&rsquo;s Build Challenge, on It&rsquo;s Today Media&rsquo;s own
        domain. Everything above runs on sample data — labeled sample. The README answers what it
        does, why this one, and what I&rsquo;d build next.
      </p>
      <div class="hq5-cta-row">
        <a href="/os" class="hq5-btn hq5-btn--solid">Enter Today OS &rarr;</a>
        <a href="/readme" class="hq5-btn hq5-btn--ghost">Read the thinking (README)</a>
      </div>
    </div>
  </section>

  <!-- ============================= FOOTER ============================= -->
  <footer class="hq5-foot">
    <div class="hq5-foot-grid">
      <div>
        <p class="hud hq5-foot-strong">IT&rsquo;S TODAY MEDIA, LLC</p>
        <p class="hud">12 W MADISON ST<br />BALTIMORE, MD 21201</p>
      </div>
      <div>
        <p class="hud hq5-foot-strong">POSITION</p>
        <p class="hud">39.2977&deg; N<br />76.6157&deg; W</p>
      </div>
      <div>
        <p class="hud hq5-foot-strong">INDEX</p>
        <p class="hud hq5-foot-links">
          <a href="/">BACK TO THE MAIN SITE</a><br />
          <a href="/os">ENTER TODAY OS</a><br />
          <a href="/readme">README</a><br />
          <a href="/haoqi">FIRST CUT (/HAOQI)</a><br />
          <a href="/haoqi2">MACHINE CUT (/HAOQI2)</a>
        </p>
      </div>
      <div class="hq5-foot-last">
        <p class="hud">
          TODAY OS · LEDGER CUT<br />AN ALTERNATE LANDING — REACHED<br />DIRECTLY AT /HAOQI5
        </p>
      </div>
    </div>
  </footer>
</div>

<style>
  /* ── route-local palette (scoped; never touches global tokens) ── */
  .hq5 {
    --hq5-ink: oklch(11.5% 0.015 262);
    --hq5-ink-2: oklch(14.5% 0.016 262);
    --hq5-paper: oklch(97% 0.006 250);
    --hq5-blue: oklch(58% 0.245 262);
    --hq5-blue-text: oklch(66% 0.21 260);
    --hq5-blue-deep: oklch(34% 0.17 264);
    --hq5-amber: oklch(78% 0.12 85);
    --hq5-line: color-mix(in oklch, var(--hq5-paper) 14%, transparent);
    --hq5-rule: color-mix(in oklch, var(--hq5-paper) 20%, transparent);
    --hq5-muted: color-mix(in oklch, var(--hq5-paper) 60%, transparent);

    position: relative;
    isolation: isolate;
    min-height: 100vh;
    background: var(--hq5-ink);
    color: var(--hq5-paper);
    font-family: var(--font-display);
    overflow-x: clip;
  }

  /* registration cross — the sheet's alignment tick */
  .hq5-cross {
    position: absolute;
    width: 17px;
    height: 17px;
    pointer-events: none;
    color: color-mix(in oklch, var(--hq5-paper) 26%, transparent);
  }
  .hq5-cross::before,
  .hq5-cross::after {
    content: "";
    position: absolute;
    background: currentColor;
  }
  .hq5-cross::before {
    left: 8px;
    top: 0;
    width: 1px;
    height: 17px;
  }
  .hq5-cross::after {
    top: 8px;
    left: 0;
    height: 1px;
    width: 17px;
  }
  @media (max-width: 640px) {
    .hq5-cross {
      display: none;
    }
  }

  /* ======================= HERO — THE COVER ======================= */
  .hq5-hero {
    position: relative;
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    padding: 5rem 1.5rem 5rem;
    /* ruled ledger paper: faint horizontal account rules */
    background-image: repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent calc(2.75rem - 1px),
      color-mix(in oklch, var(--hq5-paper) 4.5%, transparent) calc(2.75rem - 1px),
      color-mix(in oklch, var(--hq5-paper) 4.5%, transparent) 2.75rem
    );
  }
  .hq5-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(110% 80% at 84% 110%, var(--hq5-blue-deep) 0%, transparent 52%);
    opacity: 0.45;
  }
  @media (min-width: 640px) {
    .hq5-hero {
      padding: 5rem 2.5rem 5rem;
    }
  }
  @media (min-width: 1024px) {
    .hq5-hero {
      padding: 5.5rem 4rem 5.5rem 7rem;
    }
  }

  /* the bookkeeper's margin rule — a single cobalt hairline down the sheet */
  .hq5-margin-rule {
    position: absolute;
    left: 4.5rem;
    top: 0;
    bottom: 0;
    width: 1px;
    display: none;
    background: color-mix(in oklch, var(--hq5-blue) 42%, transparent);
    pointer-events: none;
  }
  @media (min-width: 1024px) {
    .hq5-margin-rule {
      display: block;
    }
  }

  .hq5-docrow {
    position: absolute;
    top: 1.6rem;
    left: 1.5rem;
    right: 1.5rem;
    display: flex;
    justify-content: space-between;
    gap: 1.5rem;
    color: var(--hq5-muted);
  }
  @media (min-width: 640px) {
    .hq5-docrow {
      left: 2.5rem;
      /* extra right padding clears the fixed theme-toggle chrome in the corner */
      right: 5.5rem;
    }
  }
  @media (min-width: 1024px) {
    .hq5-docrow {
      left: 7rem;
      right: 5.5rem;
    }
  }
  .hq5-docrow-r {
    display: none;
  }
  @media (min-width: 768px) {
    .hq5-docrow-r {
      display: inline;
    }
  }

  .hq5-hero-inner {
    position: relative;
    z-index: 2;
    max-width: 72rem;
  }

  .hq5-eyebrow {
    display: inline-flex;
    align-items: flex-start;
    gap: 0.55rem;
    color: color-mix(in oklch, var(--hq5-paper) 78%, transparent);
    margin-bottom: 1.4rem;
  }
  .hq5-livedot {
    flex: 0 0 auto;
    width: 6px;
    height: 6px;
    margin-top: 0.28em;
    border-radius: 9999px;
    background: var(--hq5-blue-text);
  }

  .hq5-h1 {
    display: flex;
    flex-direction: column;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.045em;
    line-height: 0.88;
    font-size: clamp(2.7rem, min(10.5vw, 16vh), 10rem);
    color: var(--hq5-paper);
  }
  .hq5-mask {
    display: block;
    overflow: hidden;
    padding-bottom: 0.06em;
    margin-bottom: -0.06em;
  }
  .hq5-rise {
    display: block;
  }
  .hq5-h1-blue {
    color: var(--hq5-blue-text);
  }

  /* exhibit rule under the headline */
  .hq5-exhibit {
    margin-top: 1.2rem;
    max-width: 46rem;
  }
  .hq5-exhibit-line {
    display: block;
    height: 1px;
    background: color-mix(in oklch, var(--hq5-paper) 34%, transparent);
    transform-origin: left center;
  }
  .hq5-exhibit-label {
    display: inline-block;
    margin-top: 0.7rem;
    color: var(--hq5-muted);
  }

  .hq5-lede {
    margin-top: 1.6rem;
    max-width: 34rem;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    line-height: 1.7;
    color: color-mix(in oklch, var(--hq5-paper) 76%, transparent);
  }

  .hq5-cols2 {
    margin-top: 2rem;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 2rem 4rem;
  }

  .hq5-cta-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem 1.4rem;
  }

  /* buttons — hardware-flat, square, mono label */
  .hq5-btn {
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.09em;
    font-size: 0.78rem;
    padding: 0.95rem 1.7rem;
    border: 1px solid var(--hq5-line);
    transition:
      transform 120ms cubic-bezier(0.25, 1, 0.5, 1),
      background-color 160ms ease,
      color 160ms ease,
      border-color 160ms ease;
  }
  .hq5-btn--solid {
    background: var(--hq5-blue);
    border-color: var(--hq5-blue);
    color: var(--hq5-paper);
  }
  .hq5-btn--solid:hover {
    background: oklch(64% 0.25 262);
    border-color: oklch(64% 0.25 262);
  }
  .hq5-btn--ghost {
    color: color-mix(in oklch, var(--hq5-paper) 82%, transparent);
    background: color-mix(in oklch, var(--hq5-paper) 4%, transparent);
  }
  .hq5-btn--ghost:hover {
    color: var(--hq5-paper);
    border-color: color-mix(in oklch, var(--hq5-paper) 42%, transparent);
  }
  @media (prefers-reduced-motion: no-preference) {
    .hq5-btn:active {
      transform: scale(0.97);
    }
  }

  /* the cover's bottom-line block: single rule over the figure, the
     accountant's double rule under it */
  .hq5-bl {
    min-width: min(21rem, 100%);
    border-top: 1px solid var(--hq5-rule);
    border-bottom: 4px double color-mix(in oklch, var(--hq5-paper) 46%, transparent);
    padding: 0.7rem 0 0.75rem;
  }
  .hq5-bl-head {
    display: flex;
    justify-content: space-between;
    gap: 1.5rem;
    color: var(--hq5-muted);
  }
  .hq5-bl-feed {
    color: var(--hq5-amber);
  }
  .hq5-bl-fig {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
    margin-top: 0.45rem;
  }
  .hq5-bl-amount {
    font-weight: 800;
    font-size: clamp(2rem, 4.5vw, 3rem);
    letter-spacing: -0.03em;
    line-height: 1;
    font-variant-numeric: tabular-nums;
    color: var(--hq5-paper);
  }
  .hq5-bl-unit {
    color: color-mix(in oklch, var(--hq5-paper) 72%, transparent);
  }
  .hq5-bl-sub {
    display: flex;
    justify-content: space-between;
    gap: 1.5rem;
    margin-top: 0.55rem;
    color: var(--hq5-muted);
  }
  .hq5-bl-blocked {
    color: var(--hq5-amber);
  }

  .hq5-scrollcue {
    position: absolute;
    left: 1.5rem;
    bottom: 1.6rem;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--hq5-muted);
  }
  .hq5-nudge {
    display: inline-block;
    color: var(--hq5-blue-text);
  }
  @media (min-width: 640px) {
    .hq5-scrollcue {
      left: 2.5rem;
    }
  }
  @media (min-width: 1024px) {
    .hq5-scrollcue {
      left: 7rem;
    }
  }

  /* =========================== THE LEDGER =========================== */
  .hq5-ledger {
    position: relative;
    height: 540vh;
    border-top: 1px solid var(--hq5-line);
    /* phase vars written by the ledger action */
    --p: 0;
    --rule: 0;
    --out: 0;
  }

  /* heading: screen readers always; becomes the visible section head in the
     static (mobile / reduced-motion) composition */
  .hq5-lh {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  .hq5-lh-kicker {
    display: block;
    margin-bottom: 1rem;
  }

  .hq5-lstage {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background:
      radial-gradient(90% 70% at 14% 112%, var(--hq5-blue-deep) 0%, transparent 55%),
      var(--hq5-ink-2);
  }

  /* HUD bar */
  .hq5-lhud {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1.5rem;
    padding: 1.4rem 1.5rem 1.1rem;
  }
  @media (min-width: 640px) {
    .hq5-lhud {
      /* extra right padding clears the fixed theme-toggle chrome in the corner */
      padding: 1.6rem 5.5rem 1.2rem 2.5rem;
    }
  }
  .hq5-lhud-l {
    color: var(--hq5-muted);
  }
  .hq5-lhud-c {
    color: var(--hq5-paper);
  }
  .hq5-lhud-c [data-count] {
    font-variant-numeric: tabular-nums;
  }
  .hq5-lhud-r {
    color: var(--hq5-muted);
    display: none;
  }
  @media (min-width: 1024px) {
    .hq5-lhud-r {
      display: inline;
    }
  }

  .hq5-prog {
    position: absolute;
    top: 4.1rem;
    left: 1.5rem;
    right: 1.5rem;
    height: 1px;
    background: var(--hq5-line);
  }
  @media (min-width: 640px) {
    .hq5-prog {
      left: 2.5rem;
      right: 2.5rem;
      top: 4.4rem;
    }
  }
  .hq5-prog-fill {
    position: absolute;
    inset: 0;
    background: var(--hq5-blue);
    transform: scaleX(var(--p));
    transform-origin: left center;
  }

  /* giant account-name watermark behind the sheet */
  .hq5-marks {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    pointer-events: none;
  }
  .hq5-mark {
    grid-area: 1 / 1;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.04em;
    line-height: 1;
    font-size: clamp(9rem, 24vw, 24rem);
    color: color-mix(in oklch, var(--hq5-blue-text) 9%, transparent);
    opacity: var(--o, 0);
    transform: translateY(calc((1 - var(--o, 0)) * 20px));
    white-space: nowrap;
  }
  .hq5-mark:first-child {
    --o: 1;
  }

  /* the sheet */
  .hq5-sheetwrap {
    position: relative;
    z-index: 2;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6rem 2.5rem 7rem;
  }
  .hq5-sheet {
    width: min(76rem, 100%);
  }
  .hq5-sheet-head {
    display: flex;
    justify-content: space-between;
    gap: 1.5rem;
    padding-bottom: 0.8rem;
    color: color-mix(in oklch, var(--hq5-paper) 82%, transparent);
    border-bottom: 1px solid color-mix(in oklch, var(--hq5-paper) 30%, transparent);
  }
  .hq5-sheet-head-r {
    color: var(--hq5-muted);
  }

  .hq5-colhead,
  .hq5-erow-in {
    display: grid;
    grid-template-columns: 2.6rem 9rem 10.5rem 1fr 6.5rem;
    gap: 1.25rem;
    align-items: baseline;
  }
  .hq5-colhead {
    padding: 0.7rem 0;
    color: var(--hq5-muted);
    border-bottom: 1px solid var(--hq5-rule);
  }
  .hq5-c-r {
    text-align: right;
  }

  /* an entry: the rule is always printed; the content posts onto it */
  .hq5-erow {
    border-bottom: 1px solid var(--hq5-rule);
    /* --in / --stamp written per-entry by the action */
  }
  .hq5-erow-in {
    padding: 0.95rem 0;
    opacity: var(--in, 0);
    transform: translateY(calc((1 - var(--in, 0)) * 10px));
  }
  .hq5-e-no {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    color: var(--hq5-muted);
    font-variant-numeric: tabular-nums;
  }
  .hq5-e-acct {
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.01em;
    font-size: clamp(1.1rem, 1.7vw, 1.55rem);
    line-height: 1;
    color: var(--hq5-paper);
  }
  .hq5-e-ref {
    color: var(--hq5-blue-text);
  }
  .hq5-e-memo {
    font-family: var(--font-mono);
    font-size: 0.76rem;
    line-height: 1.55;
    color: color-mix(in oklch, var(--hq5-paper) 68%, transparent);
  }
  .hq5-stamp {
    display: inline-block;
    font-family: var(--font-mono);
    font-size: 0.62rem;
    letter-spacing: 0.09em;
    padding: 0.18rem 0.5rem;
    border: 1px solid var(--hq5-blue-text);
    color: var(--hq5-blue-text);
    opacity: var(--stamp, 0);
    transform: rotate(-3deg) scale(calc(1.45 - var(--stamp, 0) * 0.45));
    transform-origin: center center;
  }

  /* the bottom line + the accountant's double rule */
  .hq5-totalrow {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1.5rem;
    padding: 1.05rem 0 0.9rem;
  }
  .hq5-total-label {
    color: color-mix(in oklch, var(--hq5-paper) 78%, transparent);
  }
  .hq5-total-fig {
    display: inline-flex;
    align-items: baseline;
    gap: 0.55rem;
  }
  .hq5-caret {
    width: 8px;
    height: 8px;
    align-self: center;
    background: var(--hq5-blue-text);
  }
  .hq5-total-amount {
    font-weight: 800;
    font-size: clamp(1.9rem, 3.2vw, 2.7rem);
    letter-spacing: -0.03em;
    line-height: 1;
    font-variant-numeric: tabular-nums;
    color: var(--hq5-paper);
  }
  .hq5-total-unit {
    color: var(--hq5-muted);
  }
  .hq5-dblrule {
    display: block;
    height: 0;
    border-bottom: 4px double color-mix(in oklch, var(--hq5-paper) 52%, transparent);
    transform: scaleX(var(--rule));
    transform-origin: left center;
  }

  .hq5-output {
    position: absolute;
    left: 50%;
    bottom: 8vh;
    z-index: 2;
    transform: translateX(-50%) translateY(calc((1 - var(--out)) * 12px));
    opacity: var(--out);
    white-space: nowrap;
    color: color-mix(in oklch, var(--hq5-paper) 80%, transparent);
  }
  .hq5-output-blue {
    color: var(--hq5-blue-text);
  }

  /* the in-flow entry list: hidden visually on the pinned desktop stage,
     the real composition on small screens / reduced motion */
  .hq5-llist {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }

  @media (max-width: 767px), (prefers-reduced-motion: reduce) {
    .hq5-ledger {
      height: auto;
      padding: 5.5rem 1.5rem 6rem;
    }
    .hq5-lstage {
      display: none;
    }
    .hq5-lh {
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
    .hq5-llist {
      position: static;
      width: auto;
      height: auto;
      overflow: visible;
      clip-path: none;
      display: flex;
      flex-direction: column;
      border-top: 1px solid color-mix(in oklch, var(--hq5-paper) 30%, transparent);
    }
    .hq5-lrow {
      display: flex;
      gap: 1.2rem;
      align-items: flex-start;
      padding: 1.5rem 0.2rem;
      border-bottom: 1px solid var(--hq5-rule);
    }
    .hq5-lrow-no {
      flex: 0 0 2.4rem;
      color: var(--hq5-muted);
      font-variant-numeric: tabular-nums;
    }
    .hq5-lrow-copy {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .hq5-lrow-acct {
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: -0.02em;
      line-height: 1;
      font-size: clamp(1.7rem, 6vw, 2.6rem);
      color: var(--hq5-paper);
    }
    .hq5-lrow-ref {
      color: var(--hq5-blue-text);
    }
    .hq5-lrow-memo {
      font-family: var(--font-mono);
      font-size: 0.84rem;
      line-height: 1.65;
      color: color-mix(in oklch, var(--hq5-paper) 70%, transparent);
      max-width: 44rem;
    }
    .hq5-lrow--total {
      border-bottom: 4px double color-mix(in oklch, var(--hq5-paper) 46%, transparent);
    }
    .hq5-lrow-fig {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 0.3rem 0.7rem;
    }
    .hq5-lrow-amount {
      font-weight: 800;
      font-size: clamp(1.9rem, 7vw, 2.7rem);
      letter-spacing: -0.03em;
      line-height: 1;
      font-variant-numeric: tabular-nums;
      color: var(--hq5-paper);
    }
    .hq5-lrow-out {
      color: var(--hq5-blue-text);
    }
  }
  @media (min-width: 768px) and (prefers-reduced-motion: reduce) {
    .hq5-ledger {
      padding: 6rem 4rem 7rem;
    }
  }

  /* ======================== THE AUDIT OPINION ======================== */
  .hq5-oppin {
    position: relative;
    height: 230vh;
    border-top: 1px solid var(--hq5-line);
    /* phase vars written by the opinion action */
    --ol: 0;
    --or: 0;
    --sig1: 0;
    --sig2: 0;
    --os: 0;
  }
  .hq5-ostage {
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
    background: var(--hq5-ink);
  }
  .hq5-okicker {
    color: var(--hq5-muted);
    opacity: calc(0.4 + var(--ol) * 0.6);
  }

  .hq5-creed {
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
  .hq5-creed-l {
    text-align: right;
    color: var(--hq5-paper);
    opacity: var(--ol);
    transform: translateX(calc((1 - var(--ol)) * -28px));
  }
  /* the countersignature: stamps in over the proposals */
  .hq5-creed-r {
    text-align: left;
    color: var(--hq5-blue-text);
    opacity: var(--or);
    transform: scale(calc(1.18 - var(--or) * 0.18));
    transform-origin: left center;
  }

  /* three journal entries at the gate */
  .hq5-journal {
    display: flex;
    flex-direction: column;
    width: min(46rem, 100%);
    border-top: 1px solid color-mix(in oklch, var(--hq5-paper) 30%, transparent);
  }
  .hq5-jrow {
    display: grid;
    grid-template-columns: 1fr auto auto;
    align-items: center;
    gap: 1rem;
    padding: 0.85rem 0.2rem;
    border-bottom: 1px solid var(--hq5-rule);
    opacity: var(--in, 0);
    transform: translateY(calc((1 - var(--in, 0)) * 12px));
  }
  .hq5-jlabel {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: color-mix(in oklch, var(--hq5-paper) 78%, transparent);
  }
  .hq5-jstamp {
    display: inline-block;
    font-family: var(--font-mono);
    font-size: 0.62rem;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    padding: 0.18rem 0.5rem;
    border: 1px solid var(--hq5-blue-text);
    color: var(--hq5-blue-text);
    opacity: var(--stamp, 0);
    transform: rotate(-3deg) scale(calc(1.45 - var(--stamp, 0) * 0.45));
  }
  .hq5-jnote {
    color: var(--hq5-muted);
    opacity: var(--stamp, 0);
  }
  .hq5-jrow[data-verdict="refused"] {
    border-bottom-color: color-mix(in oklch, var(--hq5-amber) calc(var(--stamp, 0) * 55%), var(--hq5-rule));
  }
  .hq5-jrow[data-verdict="refused"] .hq5-jstamp {
    border-color: var(--hq5-amber);
    color: var(--hq5-amber);
  }
  .hq5-jrow[data-verdict="refused"] .hq5-jnote {
    color: color-mix(in oklch, var(--hq5-amber) 80%, transparent);
  }

  /* the signature block */
  .hq5-sig {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3.5rem;
    width: min(46rem, 100%);
  }
  .hq5-sig-block {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }
  .hq5-sig-line {
    display: block;
    height: 1px;
    background: color-mix(in oklch, var(--hq5-paper) 42%, transparent);
    transform-origin: left center;
  }
  .hq5-sig-line--a {
    transform: scaleX(var(--sig1));
  }
  .hq5-sig-line--b {
    background: color-mix(in oklch, var(--hq5-blue-text) 72%, transparent);
    transform: scaleX(var(--sig2));
  }
  .hq5-sig-label--a {
    color: var(--hq5-muted);
    opacity: var(--sig1);
  }
  .hq5-sig-label--b {
    color: var(--hq5-blue-text);
    opacity: var(--sig2);
  }

  .hq5-osub {
    max-width: 34rem;
    text-align: center;
    color: var(--hq5-muted);
    opacity: var(--os);
    transform: translateY(calc((1 - var(--os)) * 10px));
  }

  @media (max-width: 767px), (prefers-reduced-motion: reduce) {
    .hq5-oppin {
      height: auto;
    }
    .hq5-ostage {
      position: static;
      height: auto;
      min-height: 0;
      overflow: visible;
      padding: 6rem 1.5rem;
      gap: 2.2rem;
    }
  }
  @media (max-width: 767px) {
    .hq5-creed {
      grid-template-columns: 1fr;
      gap: 0.6rem;
      text-align: center;
      font-size: clamp(2.3rem, 10vw, 4rem);
    }
    .hq5-creed-l,
    .hq5-creed-r {
      text-align: center;
    }
    .hq5-creed-r {
      transform-origin: center center;
    }
    .hq5-jrow {
      grid-template-columns: 1fr;
      gap: 0.45rem;
      justify-items: start;
    }
    .hq5-sig {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }

  /* ============================ THE CLOSE ============================ */
  .hq5-final {
    position: relative;
    padding: 6rem 1.5rem;
    border-top: 1px solid var(--hq5-line);
  }
  @media (min-width: 640px) {
    .hq5-final {
      padding: 8rem 2.5rem;
    }
  }
  @media (min-width: 1024px) {
    .hq5-final {
      padding: 9rem 4rem;
    }
  }
  .hq5-fkicker {
    color: var(--hq5-muted);
    margin-bottom: 1.2rem;
  }
  .hq5-h2 {
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.03em;
    line-height: 0.9;
    font-size: clamp(2.4rem, 6.5vw, 5.4rem);
    color: var(--hq5-paper);
  }
  .hq5-body {
    margin-top: 1.6rem;
    max-width: 40rem;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    line-height: 1.75;
    color: color-mix(in oklch, var(--hq5-paper) 74%, transparent);
  }
  .hq5-final .hq5-cta-row {
    margin-top: 2.4rem;
  }

  /* ============================= FOOTER ============================= */
  .hq5-foot {
    border-top: 1px solid var(--hq5-line);
    padding: 4rem 1.5rem 5rem;
  }
  @media (min-width: 640px) {
    .hq5-foot {
      padding: 4.5rem 2.5rem 5.5rem;
    }
  }
  @media (min-width: 1024px) {
    .hq5-foot {
      padding: 4.5rem 4rem 5.5rem;
    }
  }
  .hq5-foot-grid {
    display: grid;
    gap: 2.5rem;
    grid-template-columns: 1fr;
  }
  @media (min-width: 768px) {
    .hq5-foot-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  .hq5-foot .hud {
    line-height: 2;
  }
  .hq5-foot-strong {
    color: var(--hq5-paper);
    margin-bottom: 0.6rem;
  }
  .hq5-foot-links a {
    transition: color 140ms ease;
  }
  .hq5-foot-links a:hover {
    color: var(--hq5-paper);
  }
  .hq5-foot-links a:first-child {
    color: var(--hq5-blue-text);
  }
  .hq5-foot-links a:first-child:hover {
    color: var(--hq5-paper);
  }
  .hq5-foot-last {
    text-align: left;
  }
  @media (min-width: 768px) {
    .hq5-foot-last {
      text-align: right;
    }
  }
</style>
