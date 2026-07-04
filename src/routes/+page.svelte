<script lang="ts">
  import "$lib/home/home.css"
  import { reveal } from "$lib/actions/reveal"
  import TerminalNav from "$lib/home/TerminalNav.svelte"
  import HudChrome from "$lib/home/HudChrome.svelte"
  import HeroScene from "$lib/home/HeroScene.svelte"
  import { markTourStarted } from "$lib/tour/tour"

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  // Chrome defers autoplay for offscreen videos; nudge ambient loops when
  // they scroll into view (muted, so play() is always permitted).
  function playWhenVisible(node: HTMLVideoElement) {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && node.paused) node.play().catch(() => {})
      },
      { threshold: 0.1 },
    )
    io.observe(node)
    return { destroy: () => io.disconnect() }
  }

  // Scroll-linked recede for the 2018 "before" panel: writes --recede (0→1)
  // across the element's pass through the viewport. rAF-throttled, passive.
  function scrollRecede(node: HTMLElement) {
    if (prefersReduced) return
    let ticking = false
    const update = () => {
      ticking = false
      const r = node.getBoundingClientRect()
      const vh = window.innerHeight
      // Stay fully visible until the panel's top scrolls above 12% of the
      // viewport, then recede over the next half-screen as it exits upward.
      const p = Math.min(Math.max((vh * 0.12 - r.top) / (vh * 0.5), 0), 1)
      node.style.setProperty("--recede", p.toFixed(3))
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return {
      destroy() {
        window.removeEventListener("scroll", onScroll)
        window.removeEventListener("resize", onScroll)
      },
    }
  }

  // Activate an element (loop stage) once when it scrolls into view.
  function activateOnView(node: HTMLElement) {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("is-live")
          io.disconnect()
        }
      },
      { threshold: 0.5 },
    )
    io.observe(node)
    return { destroy: () => io.disconnect() }
  }

  // Count a numeral up from 0 → target when it first enters view.
  function countUp(node: HTMLElement, opts: { to: number; decimals?: number; suffix?: string }) {
    const { to, decimals = 0, suffix = "" } = opts
    const render = (v: number) => {
      node.textContent = v.toFixed(decimals) + suffix
    }
    if (prefersReduced) {
      render(to)
      return
    }
    render(0)
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const dur = 1100
        let start = 0
        const step = (t: number) => {
          if (!start) start = t
          const k = Math.min((t - start) / dur, 1)
          const eased = 1 - Math.pow(1 - k, 3)
          render(to * eased)
          if (k < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      },
      { threshold: 0.6 },
    )
    io.observe(node)
    return { destroy: () => io.disconnect() }
  }

  function smoothTo(id: string) {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" })
  }

  // The guided tour — the rail a first-time visitor follows.
  const tour = [
    {
      n: "01",
      title: "Run the Scan",
      body: "Point it at any site. Ten live conversion checks, one score, the fixes ranked. Start with itstoday.org.",
      href: "/funnel-score",
      cta: "OPEN THE DIAGNOSTIC",
      primary: true,
      external: false,
    },
    {
      n: "02",
      title: "Open the Console",
      body: "Run a sweep. Watch agents audit four ad accounts, then approve a change — and watch the gate refuse an unsafe one.",
      href: "/admin",
      cta: "ENTER AD OPS",
      primary: false,
      external: false,
    },
    {
      n: "03",
      title: "Enter the Studio",
      body: "Generate real AI b-roll from a line of script, then personalize the whole ad for every lead in the list.",
      href: "/studio",
      cta: "OPEN THE STUDIO",
      primary: false,
      external: false,
    },
    {
      n: "04",
      title: "Read the Thinking",
      body: "The three questions the contest asks — what it does, why this, what's next — answered in the README.",
      href: "/readme",
      cta: "READ THE THINKING",
      primary: false,
      external: false,
    },
  ]

  // The audit loop — activates stage by stage as it scrolls in.
  const loop = [
    { n: "01", title: "Connect", body: "Google, Meta, Taboola, TikTok — one login each. API when it's granted, browser agent on day one when it isn't." },
    { n: "02", title: "Snapshot", body: "Every account normalized into one canonical spec. Diffable YAML, queryable JSON. The single source of truth." },
    { n: "03", title: "Red Flags + LLM", body: "Deterministic rules a marketer edits in plain markdown, plus a model for the judgment calls. Both grounded in the same doctrine." },
    { n: "04", title: "Approve", body: "Every change proposed with evidence and risk. Nothing touches a live account until a human says so." },
    { n: "05", title: "Generate", body: "Fatigued creative routes to the studio. New b-roll and pages minted, personalized, sent back into the funnel." },
  ]

  // Real findings from the demo fixtures — the ticker copy.
  const findings = [
    "PAUSE — $6,180/MO · 21% OF SPEND · 0 CONVERSIONS",
    "FREQUENCY 4.7 — CREATIVE FATIGUE · REFRESH DUE",
    "AD GROUP 'MEDICARE-BROAD' — 1 AD · MIN 3 FOR ROTATION",
    "QUALITY SCORE 3 — LANDING-PAGE MISMATCH",
    "BUDGET-LIMITED · CONVERTING · RAISE CAP +30%",
    "TABOOLA — 14 PLACEMENTS · CLICKS · 0 CONV · BLOCK",
    "DISAPPROVED AD SERVING — POLICY: UNSUPPORTED CLAIM",
    "tCPA SET PRE-THRESHOLD · 8 CONV < 30 · REVERT TO MAX-CONV",
  ]

  const stats = [
    { to: 58, label: "TESTS GREEN", suffix: "" },
    { to: 12, label: "RED-FLAG RULES", suffix: "" },
    { to: 4, label: "AD PLATFORMS", suffix: "" },
    { to: 160, label: "SEC TO GENERATED B-ROLL", suffix: "" },
  ]

  const samples = [
    { src: "/video/samples/rooftops.mp4", cap: "AERIAL · ROOFTOPS" },
    { src: "/video/samples/crew.mp4", cap: "CREW · INSTALL" },
    { src: "/video/samples/signing.mp4", cap: "CLOSE · SIGN" },
  ]

  const services = [
    {
      index: "01",
      title: "Media Buying",
      body: "Full-funnel paid acquisition across Google, Meta, Taboola and TikTok. Budgets deployed against one metric: profitable volume.",
      tags: ["GOOGLE", "META", "TABOOLA", "TIKTOK"],
    },
    {
      index: "02",
      title: "Conversion Rate Optimization",
      body: "Every page treated as an instrument to calibrate. Hypothesis, test, read the gauges, ship the winner.",
      tags: null,
    },
    {
      index: "03",
      title: "Funnel Development",
      body: "Offer, landing page, email, SMS. The whole path from first click to repeat customer, built as one system.",
      tags: ["EMAIL", "SMS"],
    },
    {
      index: "04",
      title: "Analytics",
      body: "Attribution you can act on. Spend, clicks, conversions and downstream value reconciled in one ledger.",
      tags: null,
    },
  ]
</script>

<svelte:head>
  <title>It's Today Media · We Acquire Customers</title>
  <meta
    name="description"
    content="Performance digital advertising. Media buying, conversion rate optimization, funnel development and analytics on Google, Meta, Taboola and TikTok. Baltimore, MD."
  />
</svelte:head>

<TerminalNav />
<HudChrome />

<main class="blueprint bg-base-100 text-base-content relative min-h-screen">
  <!-- ===================== HERO ===================== -->
  <section class="relative flex min-h-screen flex-col justify-center overflow-hidden">
    <HeroScene />

    <span class="crosshair" style="left: calc(50% - 8px); top: 95px;" aria-hidden="true"></span>

    <div class="pointer-events-none relative z-10 px-6 pt-16 sm:px-10 lg:px-16">
      <p class="hud hero-eyebrow mb-6 inline-flex items-center gap-2">
        <span class="live-dot"></span>
        PERFORMANCE DIGITAL ADVERTISING · EST. BALTIMORE MD
      </p>
      <h1 class="statement text-[clamp(2.6rem,11.5vw,10.5rem)]">
        We Acquire<br />
        <span class="text-base-content">Customers.</span>
      </h1>
      <p class="hud mt-8 max-w-xl leading-relaxed">
        GOOGLE · META · TABOOLA · TIKTOK / PAID TRAFFIC IN, CUSTOMERS OUT. THE FUNNEL IS THE
        PRODUCT.
      </p>

      <!-- HERO = THE SCAN. The pitch's climax: type your domain, watch the OS
           build the whole demo around you. The input IS the primary action. -->
      <div class="pointer-events-auto mt-10 flex flex-col gap-4">
        <form
          action="/funnel-score"
          method="GET"
          onsubmit={() => markTourStarted()}
          class="border-line bg-base-100/70 flex w-full max-w-xl flex-col border backdrop-blur sm:flex-row"
        >
          <input type="hidden" name="run" value="1" />
          <input
            name="url"
            type="text"
            inputmode="url"
            autocomplete="url"
            placeholder="type your domain — e.g. acme.com"
            aria-label="Your website URL to scan"
            class="text-base-content placeholder:text-base-content/40 min-w-0 flex-1 bg-transparent px-4 py-4 font-mono text-sm focus:outline-none"
          />
          <button
            type="submit"
            class="btn btn-primary rounded-none border-0 px-8 font-mono text-sm tracking-[0.08em] whitespace-nowrap uppercase"
          >
            Scan my site &rarr;
          </button>
        </form>
        <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
          <a href="/os" class="hud text-primary transition-transform hover:translate-x-0.5">
            Or enter Today OS &rarr;
          </a>
          <span class="hud text-base-content/35">LIVE · SCANS ANY SITE · ~3 MIN END TO END</span>
        </div>
      </div>
    </div>

  </section>

  <!-- ===================== THE TRANSFORMATION (the foundation) ===================== -->
  <section id="begin" class="border-line relative overflow-hidden border-t px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
    <div class="mb-12 flex flex-col gap-3" use:reveal>
      <span class="hud">SEC. 01 / THE FOUNDATION</span>
      <h2 class="statement text-[clamp(2.2rem,5.5vw,4.6rem)]">We Didn&rsquo;t Mock<br />It Up.</h2>
      <p class="text-base-content/70 max-w-2xl text-[15px] leading-relaxed">
        This started as a job: transform It&rsquo;s Today Media&rsquo;s website. So we did &mdash;
        with the tool. What you&rsquo;re scrolling through is the output. The rest of this page is a
        live walk-through of the system that built it.
      </p>
    </div>

    <div class="grid items-center gap-10 lg:grid-cols-[1fr_auto_1fr]">
      <!-- BEFORE: the real 2018 site, receding as you scroll past -->
      <figure class="recede-old border-line border" use:scrollRecede>
        <img
          src="/img/before-2018.webp"
          alt="It's Today Media's website as it stood in 2018 — a flat clip-art hero on a white background"
          class="block h-auto w-full"
          loading="lazy"
        />
        <figcaption class="hud border-line flex items-center justify-between border-t px-4 py-3">
          <span>FIG. 00 — THE SITE, &copy; 2018</span>
          <span class="hidden sm:inline">WORDPRESS · CLIP ART</span>
        </figcaption>
      </figure>

      <div class="hud hidden text-center lg:block" aria-hidden="true">
        <div class="statement text-4xl">&rarr;</div>
      </div>

      <!-- AFTER: you're standing in it -->
      <div class="flex flex-col gap-5" use:reveal>
        <span class="hud text-primary">FIG. 01 — THE SITE, NOW · YOU ARE HERE</span>
        <p class="statement text-[clamp(1.8rem,4vw,3rem)]">You&rsquo;re<br />Standing<br />in It.</p>
        <p class="text-base-content/70 max-w-md text-[15px] leading-relaxed">
          Same company, same headline, same Baltimore phone number. Every pixel, every video, every
          audit on this domain came out of the tool — the same tool that would run your accounts on
          day one.
        </p>
        <button
          type="button"
          onclick={() => smoothTo("tour")}
          class="hud self-start text-primary transition-transform hover:translate-x-1"
        >
          NOW WALK THE SYSTEM &darr;
        </button>
      </div>
    </div>
  </section>

  <!-- ===================== THE TOUR ===================== -->
  <section id="tour" class="border-line border-t px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
    <div class="mb-12 flex flex-col gap-4" use:reveal>
      <span class="hud">SEC. 02 / THE TOUR</span>
      <h2 class="statement text-[clamp(2.2rem,5.5vw,4.6rem)]">Walk the<br />System</h2>
      <p class="text-base-content/70 max-w-2xl text-[15px] leading-relaxed">
        Everything that built this page is live and running. Four stops, in order — each one a real
        surface you operate yourself, not a slide. About two minutes end to end.
      </p>
    </div>

    <div class="border-line divide-line divide-y border">
      {#each tour as step, i (step.n)}
        <a
          href={step.href}
          rel={step.external ? "external" : undefined}
          class="tour-row hover:bg-base-200 group grid grid-cols-1 gap-3 p-6 sm:grid-cols-[70px_minmax(220px,300px)_1fr_auto] sm:items-baseline sm:gap-x-6 sm:gap-y-3 sm:p-8"
          use:reveal={{ delay: i * 0.06 }}
        >
          <span class="hud {step.primary ? 'text-primary' : ''}">{step.n}</span>
          <span class="statement text-2xl sm:text-3xl">{step.title}</span>
          <span class="text-base-content/60 max-w-md text-sm leading-relaxed">
            {step.body}
          </span>
          <span
            class="hud whitespace-nowrap {step.primary
              ? 'text-primary'
              : 'text-base-content/50'} transition-transform group-hover:translate-x-1"
          >
            {step.cta} &rarr;
          </span>
        </a>
      {/each}
    </div>
  </section>

  <!-- ===================== HOW THE LOOP WORKS ===================== -->
  <section id="loop" class="border-line border-t px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
    <div class="mb-12 flex flex-col gap-3" use:reveal>
      <span class="hud">SEC. 03 / THE LOOP</span>
      <h2 class="statement text-[clamp(2.2rem,5.5vw,4.6rem)]">One Cadence.<br />No Drift.</h2>
      <p class="text-base-content/70 max-w-2xl text-[15px] leading-relaxed">
        Account hygiene doesn&rsquo;t scale with account count. So it runs on a schedule, surfaces
        the waste, and waits for a human at the gate.
      </p>
    </div>

    <ol class="border-line divide-line grid divide-y border md:grid-cols-5 md:divide-x md:divide-y-0">
      {#each loop as stage (stage.n)}
        <li class="loop-stage flex flex-col gap-3 p-5 sm:p-6" use:activateOnView>
          <span class="hud text-primary">{stage.n}</span>
          <span class="statement text-lg sm:text-xl">{stage.title}</span>
          <span class="text-base-content/60 text-[13px] leading-relaxed">{stage.body}</span>
        </li>
      {/each}
    </ol>

    <p class="hud mt-6 text-base-content/50">
      LIVE DEMO FIXTURES — <span class="text-warning">$20,905/MO</span> WASTE SURFACED · 25
      RECOMMENDATIONS · 1 BLOCKED BY THE SPEND-CAP GATE
    </p>

    <!-- findings ticker -->
    <div
      class="border-line mt-8 overflow-hidden border-y py-3"
      aria-label="Sample audit findings"
    >
      <div class="ticker">
        {#each [...findings, ...findings] as f, i (i)}
          <span class="hud whitespace-nowrap px-6">
            <span class="text-error">◆</span>&nbsp;&nbsp;{f}
          </span>
        {/each}
      </div>
    </div>

    <!-- count-up stat row -->
    <div class="border-line divide-line mt-8 grid grid-cols-2 divide-x border sm:grid-cols-4">
      {#each stats as s (s.label)}
        <div class="flex flex-col gap-2 p-5 sm:p-6">
          <span class="statement text-4xl sm:text-5xl" use:countUp={{ to: s.to, suffix: s.suffix }}
            >{s.to}</span
          >
          <span class="hud text-base-content/50">{s.label}</span>
        </div>
      {/each}
    </div>
  </section>

  <!-- ===================== SERVICES ===================== -->
  <section id="work" class="border-line border-t px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
    <div class="mb-14 flex items-end justify-between gap-6" use:reveal>
      <h2 class="statement text-[clamp(2.2rem,5.5vw,4.6rem)]">
        Ways We Help<br />You Scale
      </h2>
      <span class="hud hidden pb-2 sm:inline">SEC. 04 / CAPABILITIES</span>
    </div>

    <div class="grid gap-px md:grid-cols-2">
      {#each services as s, i (s.index)}
        <article
          class="panel-card bg-base-100 flex min-h-56 flex-col justify-between gap-8 p-6 sm:p-8"
          use:reveal={{ delay: i * 0.08 }}
        >
          <div class="flex items-start justify-between">
            <span class="hud">{s.index}</span>
            {#if s.tags}
              <span class="hud text-base-content/40">{s.tags.join(" · ")}</span>
            {/if}
          </div>
          <div>
            <h3 class="statement mb-3 text-2xl sm:text-3xl">{s.title}</h3>
            <p class="text-base-content/70 max-w-md text-[15px] leading-relaxed">{s.body}</p>
          </div>
        </article>
      {/each}
    </div>
  </section>

  <!-- ===================== THE OPERATING SYSTEM ===================== -->
  <section class="border-line relative border-t px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
    <span class="crosshair" style="right: 63px; top: -9px;" aria-hidden="true"></span>
    <div class="mb-6" use:reveal>
      <span class="hud">SEC. 05 / TODAY OS</span>
      <h2 class="statement mt-4 text-[clamp(2.2rem,5.5vw,4.6rem)]">
        The Operating<br />System
      </h2>
    </div>

    <p class="text-base-content/70 mb-10 max-w-2xl text-[15px] leading-relaxed" use:reveal>
      This page was not designed by hand. It is the output of the tool: an AI marketing command
      center that audits ad accounts on a cadence, gates every change behind human approval, and
      generates the creative and the pages the traffic lands on.
    </p>

    <!-- proof panel: media on this page is minted by the tool's video lane -->
    <figure class="border-line mb-16 max-w-3xl border" use:reveal>
      <video
        class="ambient-video block h-auto w-full"
        use:playWhenVisible
        src="/video/vortex.mp4"
        autoplay
        muted
        loop
        playsinline
      ></video>
      <figcaption class="hud border-line flex items-center justify-between border-t px-4 py-3">
        <span>FIG. 03 — VIDEO CREATIVE, GENERATED BY TODAY OS</span>
        <span class="hidden sm:inline">SEEDANCE 2.0 LANE · 8S · SILENT LOOP</span>
      </figcaption>
    </figure>

    <!-- studio filmstrip: three real AI-generated ad clips -->
    <div class="mb-16" use:reveal>
      <p class="hud mb-4">FIG. 04 — AD B-ROLL, MINTED IN THE STUDIO · TAP TO OPEN</p>
      <div class="grid gap-px sm:grid-cols-3">
        {#each samples as clip (clip.src)}
          <a href="/studio" class="film-frame bg-base-100 border-line block border">
            <video
              class="ambient-video block aspect-video w-full object-cover"
              use:playWhenVisible
              src={clip.src}
              autoplay
              muted
              loop
              playsinline
              aria-hidden="true"
            ></video>
            <span class="hud flex items-center justify-between px-3 py-2">
              <span>{clip.cap}</span>
              <span class="text-base-content/40">SEEDANCE · 5S</span>
            </span>
          </a>
        {/each}
      </div>
    </div>

    <div class="border-line divide-line divide-y border" use:reveal>
      <a
        href="/admin"
        class="hover:bg-base-200 group grid grid-cols-1 gap-2 p-6 transition-colors sm:grid-cols-[90px_260px_1fr_auto] sm:items-baseline sm:gap-x-6 sm:p-8"
      >
        <span class="hud">OS/01</span>
        <span class="statement text-xl sm:text-2xl">Ad Ops Console</span>
        <span class="text-base-content/60 col-span-2 text-sm leading-relaxed sm:col-span-1">
          Agentic audits of live ad accounts. Red-flag doctrine written in plain markdown,
          approval inbox, spend caps that fail closed.
        </span>
        <span class="hud hidden transition-transform group-hover:translate-x-1 sm:inline">→</span>
      </a>
      <a
        href="/studio"
        class="hover:bg-base-200 group grid grid-cols-1 gap-2 p-6 transition-colors sm:grid-cols-[90px_260px_1fr_auto] sm:items-baseline sm:gap-x-6 sm:p-8"
      >
        <span class="hud">OS/02</span>
        <span class="statement text-xl sm:text-2xl">Creative Studio</span>
        <span class="text-base-content/60 col-span-2 text-sm leading-relaxed sm:col-span-1">
          Record once, personalize per lead. Video edited like a document: keep, cut, retake,
          batch a variant for every row of the list.
        </span>
        <span class="hud hidden transition-transform group-hover:translate-x-1 sm:inline">→</span>
      </a>
    </div>
  </section>

  <!-- ===================== FUNNEL SCORE CTA ===================== -->
  <section class="border-line relative overflow-hidden border-t px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
    <!-- ambient instrument-gauges loop, generated by the Seedance lane (see docs/BRIEF.md) -->
    <video
      class="ambient-video pointer-events-none absolute inset-0 h-full w-full object-cover"
      use:playWhenVisible
      src="/video/gauges.mp4"
      autoplay
      muted
      loop
      playsinline
      aria-hidden="true"
    ></video>
    <div
      class="from-base-100 via-base-100/70 pointer-events-none absolute inset-0 bg-gradient-to-r to-transparent"
      aria-hidden="true"
    ></div>
    <span class="hud absolute right-6 bottom-4 z-10 hidden sm:inline" aria-hidden="true"
      >FIG. 02 — AMBIENT MEDIA · GENERATED BY THE SEEDANCE LANE</span
    >
    <div class="relative z-10 flex flex-col items-start gap-10" use:reveal>
      <span class="hud">SEC. 06 / DIAGNOSTIC · TOUR STOP 01</span>
      <h2 class="statement text-[clamp(2.6rem,8vw,7.5rem)]">
        What&rsquo;s Your<br />Funnel Score?
      </h2>
      <p class="text-base-content/70 max-w-xl text-[15px] leading-relaxed">
        We&rsquo;ll analyze your website&rsquo;s conversion problems for free. Ten deterministic
        checks, one score out of 100, and the list of what to fix first. Runs live, right now — then
        it hands you to the console that fixes them.
      </p>
      <div class="flex flex-wrap items-center gap-4">
        <a
          href="/funnel-score"
          class="btn btn-primary btn-lg rounded-none px-10 font-mono text-sm tracking-[0.08em] uppercase"
        >
          Run the Scan
        </a>
        <a href="/funnel-score?url=itstoday.org&run=1" class="hud text-primary transition-transform hover:translate-x-1">
          OR SCAN ITSTODAY.ORG &rarr;
        </a>
      </div>
    </div>
  </section>

  <!-- ===================== THE CLOSE ===================== -->
  <section class="border-line border-t px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
    <div class="flex flex-col gap-6" use:reveal>
      <span class="hud">SEC. 07 / THE CLOSE</span>
      <h2 class="statement text-[clamp(2.4rem,7vw,6rem)]">
        This is a demo.<br />It could be<br />your operation.
      </h2>
      <p class="text-base-content/70 max-w-2xl text-[15px] leading-relaxed">
        Everything you just walked through runs on sample data. Point it at the real accounts and
        it&rsquo;s a marketing team that never sleeps &mdash; auditing spend, proposing fixes behind
        your approval, generating the creative and the pages the traffic lands on. The website was
        the first thing I built you. This is the second. Give me the keys and the README says what
        comes next.
      </p>
      <div class="mt-2 flex flex-wrap items-center gap-5">
        <a
          href="/readme"
          class="btn btn-primary btn-lg rounded-none px-10 font-mono text-sm tracking-[0.08em] uppercase"
        >
          Read the Plan
        </a>
        <a href="#begin" class="hud text-base-content/60 hover:text-primary transition-colors">
          OR WALK THE TOUR AGAIN &uarr;
        </a>
      </div>
    </div>
  </section>

  <!-- ===================== FOOTER ===================== -->
  <footer id="contact" class="border-line border-t px-6 pt-16 pb-20 sm:px-10 lg:px-16">
    <div class="grid gap-10 md:grid-cols-4">
      <div>
        <p class="hud text-base-content mb-3">IT&rsquo;S TODAY MEDIA, LLC</p>
        <p class="hud leading-loose">
          12 W MADISON ST<br />BALTIMORE, MD 21201
        </p>
      </div>
      <div>
        <p class="hud text-base-content mb-3">CONTACT</p>
        <p class="hud leading-loose">
          <a href="tel:+14109147398" class="hover:text-base-content">(410) 914-7398</a><br />
          MON&ndash;FRI · 9&ndash;5 ET
        </p>
      </div>
      <div>
        <p class="hud text-base-content mb-3">INDEX</p>
        <p class="hud leading-loose">
          <a href="/#work" class="hover:text-base-content">WORK</a><br />
          <a href="/funnel-score" class="hover:text-base-content">FUNNEL SCORE</a><br />
          <a href="/admin" class="hover:text-base-content">AD OPS CONSOLE</a><br />
          <a href="/studio" class="hover:text-base-content">CREATIVE STUDIO</a>
        </p>
      </div>
      <div class="md:text-right">
        <p class="hud leading-loose">
          &copy; {new Date().getFullYear()} IT&rsquo;S TODAY MEDIA, LLC<br />
          REBUILT AS A BUILD CHALLENGE<br />SUBMISSION BY JOSEPH WINKE
        </p>
      </div>
    </div>
  </footer>
</main>
