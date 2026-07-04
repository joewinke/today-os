<script lang="ts">
  /**
   * Shared frame for the OS's visioncasting "PLANNED" panels — the future
   * surfaces (Connections, Billing, Automations, Team, Ask) that make the
   * roadmap tangible without pretending they're built. Blueprint aesthetic,
   * one static mock visual per page (passed as `children`), an honest seam
   * line, and a link back to the roadmap.
   */
  import type { Snippet } from "svelte"
  import { reveal } from "$lib/actions/reveal"

  let {
    eyebrow,
    title,
    intent,
    seam,
    children,
  }: {
    eyebrow: string
    title: string
    intent: string
    seam: string
    children: Snippet
  } = $props()
</script>

<svelte:head>
  <title>{title} — Today OS</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-6 sm:px-8 lg:py-10">
  <header class="mb-6">
    <div class="flex flex-wrap items-center gap-3">
      <p class="hud text-base-content/50">{eyebrow}</p>
      <span class="badge badge-warning badge-outline badge-xs font-mono tracking-[0.08em]">PLANNED</span>
    </div>
    <h1 class="statement tracking-in-expand mt-2 text-4xl sm:text-5xl">{title}</h1>
    <p class="text-base-content/60 mt-3 max-w-2xl text-sm leading-relaxed">{intent}</p>
  </header>

  <div class="blueprint border-line border" use:reveal>
    {@render children()}
  </div>

  <p class="hud text-base-content/40 mt-6 max-w-2xl leading-relaxed normal-case">
    {seam}
  </p>

  <a href="/readme" class="hud text-primary mt-3 inline-flex items-center gap-1 transition-transform hover:translate-x-1">
    ROADMAP &rarr; /readme
  </a>
</div>
