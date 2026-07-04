<script lang="ts">
  import "../app.css"
  import "$lib/animista.css"
  import "$lib/transitions.css"
  import { page } from "$app/state"
  import ThemeToggle from "$lib/ThemeToggle.svelte"
  import { Sidebar, OperatorGate, ClientSwitcher, NAV_GROUPS, isOperatorChosen } from "$lib/cockpit"
  import { gatedRoute, cockpitRoute } from "$lib/os/stages"

  let { children, data } = $props()

  const path = $derived(page.url.pathname)
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

<!-- SANDBOX mode badge — this is the real product in its safe mode (Stripe-test
     semantics). Shown on the operator cockpit surfaces, beside the theme toggle. -->
{#if inShell}
  <span
    class="hud border-warning/45 text-warning bg-base-100/90 fixed top-2.5 right-14 z-[60] border px-2.5 py-1.5 backdrop-blur"
    title="Sandbox — seeded accounts, no real spend. Connect accounts to go live."
  >
    ● SANDBOX
  </span>
{/if}
<!-- Light/dark toggle — one instance, fixed in the top-right header corner across
     every operator + marketing surface. Client-facing /p + /report inherit the
     theme but show no chrome control. -->
{#if !external}
  <ThemeToggle floating />
{/if}
