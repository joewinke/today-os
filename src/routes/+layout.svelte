<script lang="ts">
  import "../app.css"
  import "$lib/animista.css"
  import "$lib/transitions.css"
  import "$lib/themecompare/before.css"
  import { page } from "$app/state"
  import TourRail from "$lib/tour/TourRail.svelte"
  import { ThemeCompare } from "$lib/themecompare"
  import { Sidebar, OperatorGate, ClientSwitcher, NAV_GROUPS, isOperatorChosen } from "$lib/cockpit"
  import { gatedRoute, cockpitRoute } from "$lib/os/stages"

  let { children, data } = $props()

  const path = $derived(page.url.pathname)
  const isHome = $derived(path === "/")
  // Prospect-facing (/p) + client-facing (/report) pages never get internal chrome.
  const external = $derived(/^\/(p|report)\//.test(path))

  // The operator gate reads sessionStorage (client-only), so decide the cockpit
  // render only after mount — SSR/first paint stays plain (no flash/mismatch).
  let mounted = $state(false)
  let chosen = $state(false)
  $effect(() => {
    mounted = true
    chosen = isOperatorChosen()
  })

  // The 2018 skin is a HOME-PAGE-ONLY preview. Anywhere else (esp. the cockpit)
  // force the "instrument" (now) look so the retro skin never competes with the
  // app chrome — even if a visitor left the toggle on "before" on the homepage.
  $effect(() => {
    if (typeof document === "undefined") return
    if (path !== "/") document.documentElement.setAttribute("data-theme", "instrument")
  })

  // Show the cockpit shell when an operator is on a cockpit surface, OR when a
  // gated surface is hit before entering (the shell sits behind the login gate).
  const inShell = $derived(mounted && ((cockpitRoute(path) && chosen) || (gatedRoute(path) && !chosen)))
</script>

{#if inShell}
  <div class="blueprint flex min-h-screen">
    <Sidebar groups={NAV_GROUPS} activePath={path}>
      {#snippet footer()}
        <ClientSwitcher clients={data.clients} activeSlug={null} />
      {/snippet}
    </Sidebar>
    <main class="min-w-0 flex-1">{@render children()}</main>
  </div>
  {#if gatedRoute(path) && !chosen}
    <OperatorGate onenter={() => (chosen = true)} />
  {/if}
{:else}
  {@render children()}
{/if}

<!-- Tour rail is superseded by the sidebar inside the cockpit; keep it only on
     non-cockpit, non-client surfaces (the marketing scan flow). -->
{#if !external && !inShell}
  <TourRail />
{/if}
<!-- 2018 ↔ NOW theme compare: homepage only (it's a marketing delight, and it
     competes with the cockpit chrome elsewhere). -->
{#if isHome}
  <ThemeCompare />
{/if}
