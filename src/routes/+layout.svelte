<script lang="ts">
  import "../app.css"
  import "$lib/animista.css"
  import "$lib/transitions.css"
  import TourRail from "$lib/tour/TourRail.svelte"

  let { children } = $props()
</script>

{@render children()}
<TourRail />
