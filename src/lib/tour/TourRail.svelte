<script lang="ts">
  import { page } from "$app/state"
  import { goto } from "$app/navigation"
  import { railFor, MILESTONES, INDEX_LINKS, isTourStarted } from "$lib/tour/tour"

  // localStorage is client-only; render the homepage rail only after mount so
  // SSR and the first client paint agree (no hydration mismatch).
  let mounted = $state(false)
  let started = $state(false)
  let indexOpen = $state(false)

  $effect(() => {
    mounted = true
    started = isTourStarted()
    const onStart = () => (started = true)
    window.addEventListener("today-os-tour-started", onStart)
    return () => window.removeEventListener("today-os-tour-started", onStart)
  })

  const rail = $derived(railFor(page.url.pathname))
  // On the homepage (stop 0) the rail only appears once the tour has begun; on
  // every real tour surface it's always present — the spine the reviewer follows.
  const show = $derived(!!rail && (rail.n !== 0 || (mounted && started)))

  // Give the document bottom padding so a page's last content clears the bar.
  $effect(() => {
    if (typeof document === "undefined") return
    document.body.classList.toggle("tour-rail-open", show)
    return () => document.body.classList.remove("tour-rail-open")
  })

  function go(href: string) {
    indexOpen = false
    goto(href)
  }
</script>

{#if show && rail}
  <nav class="tour-rail border-line bg-base-100/95 border-t" aria-label="Guided tour progress">
    <div class="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 sm:gap-5 sm:px-6">
      <!-- Progress: STOP n/4 + milestone pips -->
      <div class="flex shrink-0 items-center gap-2 sm:gap-3">
        <span class="hud text-base-content/50 whitespace-nowrap">
          STOP {rail.n || 1}<span class="text-base-content/30">/{rail.total}</span>
        </span>
        <div class="flex items-center gap-1.5" aria-hidden="true">
          {#each MILESTONES as m, i (m)}
            <span
              class="h-1.5 w-1.5 rounded-full transition-colors {i + 1 === rail.n
                ? 'bg-primary'
                : i + 1 < rail.n
                  ? 'bg-base-content/40'
                  : 'bg-base-content/15'}"
              title={m}
            ></span>
          {/each}
        </div>
        <span class="hud text-primary hidden whitespace-nowrap sm:inline">{rail.label}</span>
      </div>

      <!-- The single thing to do on this surface (hidden on mobile; the NEXT
           button + page carry the action there) -->
      <p class="text-base-content/70 hidden min-w-0 flex-1 truncate text-[13px] leading-tight sm:block">
        <span class="text-base-content/40">DO&nbsp;·&nbsp;</span>{rail.here}
      </p>
      <!-- keep the bar from collapsing when the hint is hidden -->
      <span class="flex-1 sm:hidden"></span>

      <!-- Always-visible advance to the next stop -->
      {#if rail.next}
        <button
          type="button"
          onclick={() => go(rail.next!.href)}
          class="border-primary text-primary hover:bg-primary hover:text-primary-content hud shrink-0 whitespace-nowrap border px-3 py-1.5 transition-colors"
        >
          {rail.next.label} &rarr;
        </button>
      {:else}
        <button
          type="button"
          onclick={() => go("/")}
          class="border-line text-base-content/60 hover:text-primary hud shrink-0 whitespace-nowrap border px-3 py-1.5 transition-colors"
        >
          Restart &circlearrowleft;
        </button>
      {/if}

      <!-- Collapsed multi-site nav → a single INDEX so the judge never faces a fan-out -->
      <div class="relative shrink-0">
        <button
          type="button"
          onclick={() => (indexOpen = !indexOpen)}
          aria-expanded={indexOpen}
          aria-controls="tour-index"
          aria-label="Open tour index"
          class="border-line text-base-content/50 hover:text-base-content hud border px-2.5 py-1.5 transition-colors"
        >
          ≡
        </button>
        {#if indexOpen}
          <ul
            id="tour-index"
            class="border-line bg-base-100 absolute right-0 bottom-full mb-2 w-56 border py-1 shadow-none"
          >
            <li class="hud text-base-content/40 px-3 py-1.5">JUMP TO ANY STOP</li>
            {#each INDEX_LINKS as link (link.href)}
              <li>
                <button
                  type="button"
                  onclick={() => go(link.href)}
                  class="hover:bg-base-200 text-base-content/80 hover:text-base-content block w-full px-3 py-1.5 text-left text-[13px] transition-colors"
                >
                  {link.label}
                </button>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>
  </nav>
{/if}

<style>
  .tour-rail {
    position: fixed;
    inset-inline: 0;
    bottom: 0;
    /* Above the decorative HUD readout (z-50) so the tour bar owns the footer. */
    z-index: 60;
    backdrop-filter: blur(8px);
  }
  /* Let the last of a page's normal-flow content clear the fixed bar. */
  :global(body.tour-rail-open) {
    padding-bottom: 3.25rem;
  }
  /* The tour rail IS the footer during the tour — retire the coordinate/scroll
     HUD readout so the two fixed bottom bars don't pile up on each other. */
  :global(body.tour-rail-open .hud-readout) {
    display: none;
  }
</style>
