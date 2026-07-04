<script lang="ts">
  /**
   * BEFORE/AFTER theme compare — a bottom-left chip that blurs the whole
   * viewport and swaps `data-theme` on <html> between "instrument" (AFTER,
   * the Today OS look) and "before" (a tasteful evocation of the client's
   * 2018-era site — see before.css). Standalone: no jatui/JST dependency.
   *
   * Timing mirrors the blur-switch feel of jst's own ThemeSelector
   * (src/lib/components/ThemeSelector.svelte): blur in, swap the theme at
   * the blur's midpoint, blur back out. ~350ms total, filter/opacity only.
   */
  const STORAGE_KEY = "todayos-theme-compare"
  const BLUR_MS = 150
  const SWAP_DELAY_MS = 160
  const SETTLE_MS = 200

  let isBefore = $state(false)
  let isAnimating = $state(false)

  function prefersReducedMotion() {
    return (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
  }

  function applyTheme(before: boolean) {
    document.documentElement.setAttribute("data-theme", before ? "before" : "instrument")
    isBefore = before
    try {
      sessionStorage.setItem(STORAGE_KEY, before ? "before" : "after")
    } catch {
      // sessionStorage unavailable (private mode, etc.) — theme still applies for this view.
    }
  }

  $effect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "before") applyTheme(true)
    } catch {
      // sessionStorage unavailable — fall through to the AFTER default already in the DOM.
    }
  })

  function toggle() {
    if (isAnimating) return
    const next = !isBefore

    if (prefersReducedMotion()) {
      applyTheme(next)
      return
    }

    isAnimating = true
    document.documentElement.classList.add("tc-blurring")

    setTimeout(() => {
      applyTheme(next)
    }, SWAP_DELAY_MS)

    setTimeout(() => {
      document.documentElement.classList.remove("tc-blurring")
      isAnimating = false
    }, SWAP_DELAY_MS + SETTLE_MS)
  }
</script>

<button
  type="button"
  class="theme-compare-chip hud border-line bg-base-100/90 text-base-content/70 hover:text-base-content hover:border-base-content/40 fixed border px-2.5 py-1.5 transition-colors"
  aria-pressed={isBefore}
  aria-label={isBefore ? "Return to the Today OS style" : "Preview the client's 2018 site style"}
  onclick={toggle}
>
  {isBefore ? "[ BACK TO NOW ]" : "[ 2018 ↔ NOW ]"}
</button>

<style>
  .theme-compare-chip {
    left: 1rem;
    bottom: 2.75rem;
    /* Above the coordinate HUD readout (z-50), below the tour rail (z-60) —
       both are fixed-bottom chrome that can share the viewport with this. */
    z-index: 55;
  }

  /* The tour rail owns the footer while it's open — clear its taller bar too. */
  :global(body.tour-rail-open) .theme-compare-chip {
    bottom: 4.25rem;
  }

  :global(html) {
    transition:
      filter 200ms ease-out,
      opacity 200ms ease-out;
  }

  :global(html.tc-blurring) {
    filter: blur(10px);
    opacity: 0.82;
    transition:
      filter 150ms ease-in,
      opacity 150ms ease-in;
  }

  @media (prefers-reduced-motion: reduce) {
    :global(html),
    :global(html.tc-blurring) {
      filter: none !important;
      opacity: 1 !important;
      transition: none !important;
    }
  }
</style>
