<script lang="ts">
  import "$lib/home/home.css"
  import { reveal } from "$lib/actions/reveal"
  import TerminalNav from "$lib/home/TerminalNav.svelte"
  import HudChrome from "$lib/home/HudChrome.svelte"
  import HeroScene from "$lib/home/HeroScene.svelte"

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
      <p class="hud mb-6 flex items-center gap-2">
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
    </div>

    <div
      class="hud pointer-events-none absolute inset-x-0 bottom-12 z-10 flex items-center justify-between px-6 sm:px-10 lg:px-16"
      aria-hidden="true"
    >
      <span>FIG. 01 / ACQUISITION VORTEX</span>
      <span class="hidden sm:inline">SCROLL ↓</span>
    </div>
  </section>

  <!-- ===================== SERVICES ===================== -->
  <section id="work" class="border-line border-t px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
    <div class="mb-14 flex items-end justify-between gap-6" use:reveal>
      <h2 class="statement text-[clamp(2.2rem,5.5vw,4.6rem)]">
        Ways We Help<br />You Scale
      </h2>
      <span class="hud hidden pb-2 sm:inline">SEC. 02 / CAPABILITIES</span>
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
      <span class="hud">SEC. 03 / TODAY OS</span>
      <h2 class="statement mt-4 text-[clamp(2.2rem,5.5vw,4.6rem)]">
        The Operating<br />System
      </h2>
    </div>

    <p class="text-base-content/70 mb-16 max-w-2xl text-[15px] leading-relaxed" use:reveal>
      This page was not designed by hand. It is the output of the tool: an AI marketing command
      center that audits ad accounts on a cadence, gates every change behind human approval, and
      generates the creative and the pages the traffic lands on.
    </p>

    <div class="border-line divide-line divide-y border" use:reveal>
      <a
        href="/admin"
        class="hover:bg-base-200 group grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-2 p-6 transition-colors sm:grid-cols-[90px_260px_1fr_auto] sm:p-8"
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
        class="hover:bg-base-200 group grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-2 p-6 transition-colors sm:grid-cols-[90px_260px_1fr_auto] sm:p-8"
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
    <div class="relative z-10 flex flex-col items-start gap-10" use:reveal>
      <span class="hud">SEC. 04 / DIAGNOSTIC</span>
      <h2 class="statement text-[clamp(2.6rem,8vw,7.5rem)]">
        What&rsquo;s Your<br />Funnel Score?
      </h2>
      <p class="text-base-content/70 max-w-xl text-[15px] leading-relaxed">
        We&rsquo;ll analyze your website&rsquo;s conversion problems for free. Ten deterministic
        checks, one score out of 100, and the list of what to fix first. Runs live, right now.
      </p>
      <a href="/funnel-score" class="btn btn-primary btn-lg rounded-none px-10 font-mono text-sm tracking-[0.08em] uppercase">
        Run the Scan
      </a>
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
