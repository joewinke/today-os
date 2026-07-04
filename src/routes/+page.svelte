<script lang="ts">
  import "$lib/home/home.css"
  import { goto } from "$app/navigation"
  import { reveal } from "$lib/actions/reveal"
  import TerminalNav from "$lib/home/TerminalNav.svelte"
  import HudChrome from "$lib/home/HudChrome.svelte"
  import HeroScene from "$lib/home/HeroScene.svelte"
  import { markTourStarted } from "$lib/tour/tour"
  import { shake } from "$lib/actions/shake"

  // Hero scan handoff — build the funnel URL explicitly so no browser
  // form-serialization quirk can ever mangle it (this is the judge's first action).
  let heroUrl = $state("")
  let heroInput = $state<HTMLInputElement | null>(null)
  let heroShake = $state(0)
  let heroEmpty = $state(false)
  function scanFromHero(e: SubmitEvent) {
    e.preventDefault()
    const u = heroUrl.trim()
    if (!u) {
      // Empty submit must not silently no-op (the "Enter Today OS" link sits right
      // below, so a second click reads as "scan sent me to /os"). Prompt instead.
      heroEmpty = true
      heroShake++
      heroInput?.focus()
      return
    }
    heroEmpty = false
    markTourStarted()
    goto(`/funnel-score?url=${encodeURIComponent(u)}&run=1`)
  }

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

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

  // The five lifecycle moves — the product's stages, shown on the landing page.
  const tour = [
    {
      n: "01",
      title: "Find",
      body: "Scan any site — ten live conversion checks, one score in ~2 seconds — then map the rest of that market into a prospect queue.",
      href: "/funnel-score",
      cta: "SCAN A SITE",
      primary: true,
      external: false,
    },
    {
      n: "02",
      title: "Pitch",
      body: "One shoot becomes a personalized pitch video for every prospect — each with their own landing page and their own score.",
      href: "/os/outreach",
      cta: "OPEN OUTREACH",
      primary: false,
      external: false,
    },
    {
      n: "03",
      title: "Close",
      body: "Work the pipeline board. Close a deal and that client's ad accounts light up in the console, themed to them.",
      href: "/os/pipeline",
      cta: "OPEN THE PIPELINE",
      primary: false,
      external: false,
    },
    {
      n: "04",
      title: "Run",
      body: "Agents audit spend on a cadence and propose fixes with dollar impact — and a spend-cap gate refuses anything unsafe until a human approves.",
      href: "/admin",
      cta: "ENTER AD OPS",
      primary: false,
      external: false,
    },
    {
      n: "05",
      title: "Prove",
      body: "Every approval ticks recovered waste onto the ledger. Each client gets a monthly report. Then read the thinking in the README.",
      href: "/os/prove",
      cta: "SEE THE LEDGER",
      primary: false,
      external: false,
    },
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

</script>

<svelte:head>
  <title>Today OS · Acquire More Customers</title>
  <meta
    name="description"
    content="Today OS — the operating system for performance marketing. Find advertisers, pitch them with personalized video, run their accounts behind human gates, and prove the result on a ledger. Built for the It's Today Media Build Challenge."
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
        TODAY OS — THE OPERATING SYSTEM FOR PERFORMANCE MARKETING
      </p>
      <h1 class="statement text-[clamp(2.6rem,11.5vw,10.5rem)]">
        Acquire More<br />
        <span class="text-base-content">Customers.</span>
      </h1>
      <p class="text-base-content/75 mt-8 max-w-xl text-[15px] leading-relaxed">
        Find advertisers, pitch them with personalized video, run their accounts behind human gates,
        and prove the result on a ledger — the whole agency lifecycle in one operating system.
      </p>

      <!-- PRIMARY: enter the product (the gate is the sign-in). Secondary hook:
           scan any site — TodayOS builds the demo around it. -->
      <div class="pointer-events-auto mt-10 flex flex-col gap-5">
        <a
          href="/os"
          class="btn btn-primary btn-lg w-fit rounded-none px-8 font-mono text-sm tracking-[0.08em] uppercase"
        >
          Enter Today OS &rarr;
        </a>

        <div class="flex flex-col gap-2">
          <form
            action="/funnel-score"
            method="GET"
            onsubmit={scanFromHero}
            use:shake={heroShake}
            class="flex w-full max-w-md flex-col border backdrop-blur sm:flex-row {heroEmpty
              ? 'border-error'
              : 'border-line'} bg-base-100/70"
          >
            <input type="hidden" name="run" value="1" />
            <input
              bind:this={heroInput}
              bind:value={heroUrl}
              oninput={() => (heroEmpty = false)}
              name="url"
              type="text"
              inputmode="url"
              autocomplete="url"
              placeholder="or scan any site — e.g. acme.com"
              aria-label="Scan any website URL"
              class="text-base-content placeholder:text-base-content/40 min-w-0 flex-1 bg-transparent px-4 py-3 font-mono text-xs focus:outline-none"
            />
            <button
              type="submit"
              class="hud border-line text-base-content/70 hover:text-base-content border-t px-5 py-2.5 whitespace-nowrap transition-colors sm:border-t-0 sm:border-l"
            >
              Scan &rarr;
            </button>
          </form>
          <p class="hud {heroEmpty ? 'text-error' : 'text-base-content/40'}" role="status" aria-live="polite">
            {heroEmpty ? "type a domain first" : "or scan any site — TodayOS builds the demo around it"}
          </p>
        </div>
      </div>
    </div>

  </section>

  <!-- ===================== THE LIFECYCLE (five-up) ===================== -->
  <section id="lifecycle" class="border-line border-t px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
    <div class="mb-12 flex flex-col gap-4" use:reveal>
      <span class="hud">SEC. 01 / THE LIFECYCLE</span>
      <h2 class="statement text-[clamp(2.2rem,5.5vw,4.6rem)]">One System.<br />Five Moves.</h2>
      <p class="text-base-content/70 max-w-2xl text-[15px] leading-relaxed">
        Find &rarr; Pitch &rarr; Close &rarr; Run &rarr; Prove. The whole agency lifecycle, in one
        operating system. Sign in and operate every stage yourself.
      </p>
    </div>

    <div class="border-line divide-line divide-y border">
      {#each tour as step, i (step.n)}
        <a
          href="/os"
          class="tour-row hover:bg-base-200 group grid grid-cols-1 gap-3 p-6 sm:grid-cols-[70px_minmax(220px,300px)_1fr_auto] sm:items-baseline sm:gap-x-6 sm:gap-y-3 sm:p-8"
          use:reveal={{ delay: i * 0.06 }}
        >
          <span class="hud text-primary">{step.n}</span>
          <span class="statement text-2xl sm:text-3xl">{step.title}</span>
          <span class="text-base-content/60 max-w-md text-sm leading-relaxed">{step.body}</span>
          <span class="hud text-base-content/50 whitespace-nowrap transition-transform group-hover:translate-x-1">
            ENTER &rarr;
          </span>
        </a>
      {/each}
    </div>
  </section>

  <!-- ===================== FLAGSHIP CASE STUDY ===================== -->
  <section id="case" class="border-line relative overflow-hidden border-t px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
    <div class="mb-12 flex flex-col gap-3" use:reveal>
      <span class="hud">SEC. 02 / CASE STUDY</span>
      <h2 class="statement text-[clamp(2.2rem,5.5vw,4.6rem)]">This Site Is<br />the Case Study.</h2>
      <p class="text-base-content/70 max-w-2xl text-[15px] leading-relaxed">
        Today OS rebuilt It&rsquo;s Today Media. Every pixel, every video, every audit on this domain
        came out of the tool &mdash; same company, same headline, same Baltimore phone number. You
        are standing in the output.
      </p>
    </div>

    <div class="grid items-center gap-10 lg:grid-cols-[1fr_auto_1fr]">
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

      <div class="flex flex-col gap-5" use:reveal>
        <span class="hud text-primary">FIG. 01 — THE SITE, NOW · YOU ARE HERE</span>
        <p class="statement text-[clamp(1.8rem,4vw,3rem)]">See It<br />For Yourself.</p>
        <p class="text-base-content/70 max-w-md text-[15px] leading-relaxed">
          Want proof it&rsquo;s the same site, reskinned by the tool? Flip it back to the 2018
          original and forward again &mdash; the toggle is live.
        </p>
        <p class="hud text-primary">&darr; TOGGLE THE 2018 SKIN YOURSELF — CHIP AT BOTTOM-LEFT</p>
      </div>
    </div>
  </section>

  <!-- ===================== LIVE FIXTURES ===================== -->
  <section id="live" class="border-line border-t px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
    <div class="mb-8 flex flex-col gap-3" use:reveal>
      <span class="hud">SEC. 03 / LIVE FIXTURES</span>
      <h2 class="statement text-[clamp(2.2rem,5.5vw,4.6rem)]">Running<br />Right Now.</h2>
      <p class="text-base-content/70 max-w-2xl text-[15px] leading-relaxed">
        Account hygiene doesn&rsquo;t scale with account count. Inside Today OS the loop runs on a
        cadence, surfaces the waste, and waits for a human at the gate. These are its live demo
        fixtures.
      </p>
    </div>

    <p class="hud text-base-content/50">
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

  <!-- ===================== CONTEST ENTRY ===================== -->
  <section id="contest" class="border-line border-t px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
    <div class="flex flex-col gap-6" use:reveal>
      <span class="hud">SEC. 04 / CONTEST ENTRY</span>
      <h2 class="statement text-[clamp(2.2rem,5.5vw,4.6rem)]">Built for the<br />Build Challenge.</h2>
      <p class="text-base-content/70 max-w-2xl text-[15px] leading-relaxed">
        Today OS is my entry to the It&rsquo;s Today Media Build Challenge. The README answers the
        three questions the contest asks &mdash; what it does, why this one, and what I&rsquo;d build
        next with the substrate.
      </p>
      <div class="mt-2 flex flex-wrap items-center gap-5">
        <a
          href="/os"
          class="btn btn-primary btn-lg rounded-none px-10 font-mono text-sm tracking-[0.08em] uppercase"
        >
          See the Contest Entry &rarr;
        </a>
        <a href="/readme" class="hud text-primary transition-transform hover:translate-x-1">
          READ THE THINKING (README) &rarr;
        </a>
      </div>
    </div>
  </section>

  <!-- ===================== THE CLOSE ===================== -->
  <section class="border-line border-t px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
    <div class="flex flex-col gap-6" use:reveal>
      <span class="hud">SEC. 05 / THE CLOSE</span>
      <h2 class="statement text-[clamp(2.4rem,7vw,6rem)]">
        Sign in.<br />Operate it<br />yourself.
      </h2>
      <p class="text-base-content/70 max-w-2xl text-[15px] leading-relaxed">
        Everything here runs on sample data. Point it at real accounts and it&rsquo;s a marketing
        team that never sleeps &mdash; finding advertisers, pitching them, auditing spend behind your
        approval, and proving the result on a ledger. Step into the seat and drive it.
      </p>
      <div class="mt-2 flex flex-wrap items-center gap-5">
        <a
          href="/os"
          class="btn btn-primary btn-lg rounded-none px-10 font-mono text-sm tracking-[0.08em] uppercase"
        >
          Enter Today OS &rarr;
        </a>
        <a href="/readme" class="hud text-base-content/60 hover:text-primary transition-colors">
          OR READ THE PLAN (README) &rarr;
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
          <a href="/os" class="text-primary hover:text-base-content">ENTER TODAY OS</a><br />
          <a href="/funnel-score" class="hover:text-base-content">SCAN A SITE</a><br />
          <a href="/readme" class="hover:text-base-content">README</a>
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
