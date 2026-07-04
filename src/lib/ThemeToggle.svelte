<script lang="ts">
  /**
   * Light/dark theme toggle — a single sun/moon icon button in the header chrome.
   * Blur-switches between "instrument" (dark) and "instrument-light" (premium
   * light), persists to localStorage (default dark), and dispatches
   * `todayos-theme-changed` so the WebGL hero re-tints live. The no-flash init in
   * app.html applies the persisted theme before first paint; this button reflects
   * + toggles it. prefers-reduced-motion swaps instantly.
   */
  const KEY = "todayos-theme"
  const DARK = "instrument"
  const LIGHT = "instrument-light"
  const SWAP_MS = 160
  const SETTLE_MS = 200

  let { floating = false }: { floating?: boolean } = $props()

  let isLight = $state(false)
  let animating = $state(false)

  function reducedMotion(): boolean {
    return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }

  // Reflect whatever the no-flash script already put on <html>.
  $effect(() => {
    isLight = document.documentElement.getAttribute("data-theme") === LIGHT
  })

  function apply(light: boolean) {
    document.documentElement.setAttribute("data-theme", light ? LIGHT : DARK)
    isLight = light
    try {
      localStorage.setItem(KEY, light ? LIGHT : DARK)
    } catch {
      /* storage disabled — theme still applies for this view */
    }
    // Let the WebGL hero (and anything else theme-reactive) re-read the palette.
    try {
      window.dispatchEvent(new Event("todayos-theme-changed"))
    } catch {
      /* SSR / no window */
    }
  }

  function toggle() {
    if (animating) return
    const next = !isLight
    if (reducedMotion()) {
      apply(next)
      return
    }
    animating = true
    document.documentElement.classList.add("theme-switching")
    setTimeout(() => apply(next), SWAP_MS)
    setTimeout(() => {
      document.documentElement.classList.remove("theme-switching")
      animating = false
    }, SWAP_MS + SETTLE_MS)
  }
</script>

<button
  type="button"
  onclick={toggle}
  aria-pressed={isLight}
  aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
  title={isLight ? "Switch to dark theme" : "Switch to light theme"}
  class="theme-toggle border-line bg-base-100/90 text-base-content/70 hover:text-primary hover:border-base-content/40 flex h-9 w-9 items-center justify-center border transition-colors {floating
    ? 'fixed top-2.5 right-3 z-[70] backdrop-blur'
    : ''}"
>
  {#if isLight}
    <!-- moon: click to go dark -->
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
      <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8Z" stroke-linejoin="round" />
    </svg>
  {:else}
    <!-- sun: click to go light -->
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" stroke-linecap="round" />
    </svg>
  {/if}
</button>

<style>
  /* Blur-switch: the whole viewport blurs briefly while the theme swaps. */
  :global(html) {
    transition:
      filter 200ms ease-out,
      opacity 200ms ease-out;
  }
  :global(html.theme-switching) {
    filter: blur(10px);
    opacity: 0.82;
    transition:
      filter 150ms ease-in,
      opacity 150ms ease-in;
  }
  @media (prefers-reduced-motion: reduce) {
    :global(html),
    :global(html.theme-switching) {
      filter: none !important;
      opacity: 1 !important;
      transition: none !important;
    }
  }
</style>
