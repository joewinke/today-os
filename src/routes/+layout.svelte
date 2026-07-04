<script lang="ts">
  import "../app.css"
  import "$lib/animista.css"
  import "$lib/transitions.css"
  import "$lib/themecompare/before.css"
  import { page } from "$app/state"
  import TourRail from "$lib/tour/TourRail.svelte"
  import { ThemeCompare } from "$lib/themecompare"

  let { children } = $props()

  // Suppress internal chrome (tour rail is handled inside it; theme-compare here)
  // on the prospect-facing /p and client-facing /report pages.
  const external = $derived(/^\/(p|report)\//.test(page.url.pathname))
</script>

{@render children()}
<TourRail />
{#if !external}
  <ThemeCompare />
{/if}
