<script lang="ts">
  import { enhance } from "$app/forms"
  import type { PageServerData } from "./$types"

  let { data }: { data: PageServerData } = $props()

  const SAMPLES = ["/video/samples/rooftops.mp4", "/video/samples/crew.mp4", "/video/samples/signing.mp4"]

  const p = $derived(data.prospect)

  // Deterministic per-prospect clip so the same link always renders the same video.
  const videoSrc = $derived(
    SAMPLES[[...p.company].reduce((n, c) => n + c.charCodeAt(0), 0) % SAMPLES.length],
  )

  function scoreClass(score: number): string {
    return score >= 70 ? "text-success" : score >= 50 ? "text-warning" : "text-error"
  }

  let booked = $state(false)
</script>

<svelte:head>
  <title>{p.company} — a Today OS teardown</title>
  <meta name="description" content="Where {p.company}'s ad budget is leaking, and how to recover it." />
</svelte:head>

<div class="blueprint text-base-content min-h-screen">
  <div class="mx-auto max-w-2xl px-5 py-10 sm:px-8 sm:py-16">
    <!-- Eyebrow -->
    <div class="flex flex-wrap items-center gap-2">
      <p class="hud text-primary">PERSONALIZED FOR {p.company.toUpperCase()}</p>
      {#if data.isSample}
        <span class="hud border-line text-base-content/50 border px-2 py-0.5">SAMPLE</span>
      {/if}
    </div>

    <h1 class="statement mt-3 text-4xl leading-[0.95] sm:text-6xl">
      {p.company},<br />here's where your<br />ad budget is leaking.
    </h1>
    <p class="text-base-content/60 mt-4 text-sm sm:text-base">
      We ran your {p.vertical} funnel through Today OS{p.city ? ` against other ${p.city} advertisers` : ""}.
      This is the 90-second version.
    </p>

    <!-- Score readout -->
    {#if p.score != null}
      <div class="border-line mt-8 flex items-stretch border">
        <div class="flex flex-col justify-center px-5 py-4">
          <p class="hud text-base-content/50">FUNNEL SCORE</p>
          <p class="statement mt-1 text-5xl tabular-nums {scoreClass(p.score)}">{p.score}<span class="text-base-content/30 text-2xl">/100</span></p>
        </div>
        <div class="border-line text-base-content/70 flex flex-1 items-center border-l px-5 py-4 text-sm">
          Enough working traffic to fix fast — the gaps below are the difference between paying for clicks and booking {p.offer.replace(/^a\s+/, "")}.
        </div>
      </div>
    {/if}

    <!-- Personalized teardown video -->
    <figure class="border-line mt-6 border">
      <video
        class="block aspect-video w-full object-cover"
        src={videoSrc}
        autoplay
        muted
        loop
        playsinline
        aria-label="Personalized teardown for {p.company}"
      >
        <track kind="captions" />
      </video>
      <figcaption class="hud border-line text-base-content/45 flex items-center justify-between border-t px-4 py-2.5">
        <span>YOUR 90-SECOND TEARDOWN</span>
        <span>PREVIEW RENDER · SILENT</span>
      </figcaption>
    </figure>

    <!-- Top fixes -->
    <section class="mt-10">
      <p class="hud text-base-content/50">TOP FIXES WE FOUND</p>
      <ol class="mt-3 flex flex-col gap-px" style="background: var(--color-line)">
        {#each data.fixes as fix, i (fix.label)}
          <li class="bg-base-100 flex gap-4 px-4 py-4">
            <span class="statement text-primary/60 text-2xl leading-none tabular-nums">{i + 1}</span>
            <div class="min-w-0">
              <p class="text-base-content text-sm font-medium">{fix.label}</p>
              <p class="text-base-content/60 mt-1 text-[13px] leading-relaxed">{fix.detail}</p>
            </div>
          </li>
        {/each}
      </ol>
    </section>

    <!-- Booking seam -->
    <section class="border-line mt-10 border p-6 text-center sm:p-8">
      {#if booked}
        <p class="hud text-success">REQUEST RECEIVED</p>
        <h2 class="statement mt-2 text-2xl sm:text-3xl">We'll be in touch.</h2>
        <p class="text-base-content/60 mx-auto mt-2 max-w-md text-sm">
          Your 15-minute walkthrough is queued. We'll confirm a time by email and bring the full teardown.
        </p>
      {:else}
        <h2 class="statement text-2xl sm:text-3xl">See the whole teardown live.</h2>
        <p class="text-base-content/60 mx-auto mt-2 max-w-md text-sm">
          15 minutes. We'll walk every fix above against your real numbers — no pitch deck.
        </p>
        <form
          method="POST"
          action="?/book"
          class="mt-5"
          use:enhance={() => {
            return async ({ result, update }) => {
              await update({ reset: false })
              if (result.type === "success") booked = true
            }
          }}
        >
          <input type="hidden" name="id" value={p.id} />
          <input type="hidden" name="sample" value={data.isSample ? "1" : "0"} />
          <button
            type="submit"
            class="btn btn-primary rounded-none px-8 font-mono text-sm tracking-[0.08em] uppercase"
          >
            Book a 15-min call &rarr;
          </button>
        </form>
        <p class="hud text-base-content/35 mt-3">CONNECTS TO YOUR CALENDAR IN PRODUCTION</p>
      {/if}
    </section>

    <!-- Footer -->
    <footer class="border-line mt-12 flex items-center justify-between border-t pt-5">
      <a href="/os" class="hud text-base-content/40 hover:text-primary transition-colors">POWERED BY TODAY OS</a>
      <span class="hud text-base-content/25">{p.vertical.toUpperCase()}</span>
    </footer>
  </div>
</div>
