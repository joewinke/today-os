<!--
  Cockpit Sidebar — three-state operator rail.

  States (desktop, md+): expanded (15rem, icon + label) → rail (3.5rem, icon only)
  → collapsed (0, hidden). The cycle button in the header steps through them; when
  collapsed a fixed "reveal" button brings it back. State persists in sessionStorage
  under `todayos-sidebar`.

  Motion discipline: width SNAPS between states (never animated — width is a layout
  property). What animates is the label's opacity/transform as it fades in/out, and
  the mobile drawer's transform. All motion is gated behind motion-safe.

  Mobile (< md): the rail becomes an off-canvas overlay drawer opened by a hamburger,
  closed by a backdrop tap, Escape, or navigation.
-->
<script lang="ts">
  import { onMount, type Snippet } from "svelte"
  import { NAV_GROUPS, isNavItemActive, type IconKey, type NavGroup } from "./nav"

  let {
    groups = NAV_GROUPS,
    activePath = "",
    footer,
  }: {
    groups?: NavGroup[]
    activePath?: string
    /** Footer block (e.g. ClientSwitcher) — shown only in the expanded state. */
    footer?: Snippet
  } = $props()

  type Mode = "expanded" | "rail" | "collapsed"
  const STORAGE_KEY = "todayos-sidebar"
  const WIDTHS: Record<Mode, string> = { expanded: "15rem", rail: "3.5rem", collapsed: "0px" }

  let mode = $state<Mode>("expanded")
  let mobileOpen = $state(false)

  onMount(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (saved === "expanded" || saved === "rail" || saved === "collapsed") mode = saved
    } catch {
      /* private mode / no storage — keep default */
    }
  })

  function setMode(next: Mode): void {
    mode = next
    try {
      sessionStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }

  function cycle(): void {
    setMode(mode === "expanded" ? "rail" : mode === "rail" ? "collapsed" : "expanded")
  }

  // Close the mobile drawer whenever the route changes.
  $effect(() => {
    activePath
    mobileOpen = false
  })

  const showLabels = $derived(mode === "expanded")
  const isRail = $derived(mode === "rail")
  const cycleTitle = $derived(
    mode === "expanded" ? "Collapse to icons" : mode === "rail" ? "Hide sidebar" : "Expand sidebar",
  )
</script>

{#snippet icon(key: IconKey)}
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    {#if key === "dashboard"}
      <rect x="2" y="2" width="5" height="5" /><rect x="9" y="2" width="5" height="5" /><rect x="2" y="9" width="5" height="5" /><rect x="9" y="9" width="5" height="5" />
    {:else if key === "prospects"}
      <circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5 14 14" />
    {:else if key === "outreach"}
      <path d="M14 2 7 9" /><path d="M14 2l-4.5 12-2.5-5-5-2.5L14 2z" />
    {:else if key === "pipeline"}
      <rect x="2" y="2" width="3.5" height="12" /><rect x="6.25" y="2" width="3.5" height="8" /><rect x="10.5" y="2" width="3.5" height="10" />
    {:else if key === "adops"}
      <path d="M2 4h8M12 4h2M2 8h2M6 8h8M2 12h6M10 12h4" /><circle cx="11" cy="4" r="1.3" /><circle cx="5" cy="8" r="1.3" /><circle cx="9" cy="12" r="1.3" />
    {:else if key === "studio"}
      <rect x="2" y="3" width="12" height="10" rx="1" /><path d="M6.5 6l4 2-4 2z" />
    {:else if key === "ledger"}
      <rect x="3" y="2" width="10" height="12" rx="1" /><path d="M5.5 5.5l1 1 2-2M5.5 9.5l1 1 2-2M10.5 5h1M10.5 9h1" />
    {:else if key === "doctrine"}
      <path d="M8 3.5C6.5 2.5 4 2.5 2.5 3v9C4 11.5 6.5 11.5 8 12.5M8 3.5C9.5 2.5 12 2.5 13.5 3v9C12 11.5 9.5 11.5 8 12.5M8 3.5v9" />
    {:else if key === "log"}
      <path d="M5 4h9M5 8h9M5 12h9" /><circle cx="2.5" cy="4" r="0.8" /><circle cx="2.5" cy="8" r="0.8" /><circle cx="2.5" cy="12" r="0.8" />
    {:else if key === "connections"}
      <path d="M6 10l4-4M5 5L3.5 6.5a2.5 2.5 0 003.5 3.5M11 11l1.5-1.5a2.5 2.5 0 00-3.5-3.5" />
    {:else if key === "billing"}
      <rect x="2" y="3.5" width="12" height="9" rx="1" /><path d="M2 6.5h12M4.5 10h3" />
    {:else if key === "automations"}
      <path d="M8 1.5v2M8 12.5v2M2.6 4l1.4.8M12 11.2l1.4.8M2.6 12l1.4-.8M12 4.8l1.4-.8" /><circle cx="8" cy="8" r="2.6" />
    {:else if key === "team"}
      <circle cx="5.5" cy="6" r="2" /><circle cx="11" cy="6.5" r="1.6" /><path d="M2.5 13c0-2 1.5-3.2 3-3.2S8.5 11 8.5 13M9.5 12.5c.2-1.6 1.2-2.4 2.2-2.4s1.9.8 1.9 2.4" />
    {:else if key === "ask"}
      <path d="M2.5 3.5h11v7h-6l-3 3v-3h-2z" /><path d="M6.4 6.2a1.6 1.6 0 113 .5c0 1-1.4 1.1-1.4 2M8 10.4h.01" />
    {/if}
  </svg>
{/snippet}

<!-- Mobile: hamburger trigger (below the drawer + backdrop so it hides while open) -->
<button
  type="button"
  onclick={() => (mobileOpen = true)}
  class="hud border-line bg-base-100 text-base-content/70 hover:text-base-content fixed left-2 top-2 z-20 flex h-9 w-9 items-center justify-center border md:hidden"
  aria-label="Open navigation"
  aria-expanded={mobileOpen}
>
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" aria-hidden="true"><path d="M2.5 4h11M2.5 8h11M2.5 12h11" /></svg>
</button>

<!-- Desktop: reveal button when fully collapsed -->
{#if mode === "collapsed"}
  <button
    type="button"
    onclick={() => setMode("rail")}
    class="hud border-line bg-base-100 text-base-content/70 hover:text-base-content fixed left-2 top-2 z-20 hidden h-9 w-9 items-center justify-center border md:flex"
    aria-label="Show sidebar"
    title="Show sidebar"
  >
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3l5 5-5 5" /></svg>
  </button>
{/if}

<!-- Mobile backdrop -->
{#if mobileOpen}
  <button
    type="button"
    class="fixed inset-0 z-30 bg-base-300/70 md:hidden"
    aria-label="Close navigation"
    onclick={() => (mobileOpen = false)}
  ></button>
{/if}

<svelte:window
  onkeydown={(e) => {
    if (e.key === "Escape" && mobileOpen) mobileOpen = false
  }}
/>

<aside
  style="--sb-w: {WIDTHS[mode]}"
  class="border-line bg-base-100 fixed inset-y-0 left-0 z-40 flex w-[min(15rem,82vw)] flex-col overflow-hidden border-r
         {mobileOpen ? 'translate-x-0' : '-translate-x-full'}
         motion-safe:transition-transform motion-safe:duration-200
         md:static md:z-30 md:h-screen md:w-[var(--sb-w)] md:translate-x-0 md:transition-none"
  aria-label="Cockpit navigation"
  aria-hidden={mode === "collapsed" ? "true" : undefined}
>
  <!-- Header: brand + cycle -->
  <div class="border-line flex h-14 shrink-0 items-center gap-2 border-b px-3">
    {#if showLabels}
      <a href="/os" class="statement text-base leading-none">Today OS</a>
    {/if}
    <button
      type="button"
      onclick={cycle}
      class="border-line text-base-content/50 hover:text-base-content ml-auto flex h-7 w-7 items-center justify-center border {isRail ? 'mx-auto ml-0' : ''}"
      aria-label={cycleTitle}
      title={cycleTitle}
    >
      <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="2" y="2.5" width="12" height="11" rx="1" /><path d="M6.5 2.5v11" />
      </svg>
    </button>
  </div>

  <!-- Nav -->
  <nav class="flex-1 overflow-y-auto overflow-x-hidden py-1" aria-label="Primary">
    {#each groups as group, gi (group.label)}
      {#if showLabels}
        <p class="hud text-muted/70 px-3 pb-1 pt-3">{group.label}</p>
      {:else if gi > 0}
        <div class="border-line mx-2.5 my-1.5 border-t"></div>
      {/if}
      <ul>
        {#each group.items as item (item.href)}
          {@const active = isNavItemActive(item, activePath, groups)}
          <li>
            <a
              href={item.href}
              aria-current={active ? "page" : undefined}
              title={isRail ? item.label : undefined}
              class="hud relative flex items-center gap-3 px-3 py-2 transition-colors
                     {active ? 'text-primary bg-primary/10' : 'text-base-content/55 hover:text-base-content hover:bg-base-content/5'}
                     {item.planned && !active ? 'opacity-55' : ''}"
            >
              <span class="grid h-4 w-4 shrink-0 place-items-center [&>svg]:h-4 [&>svg]:w-4">
                {@render icon(item.icon)}
              </span>
              <span
                class="min-w-0 flex-1 truncate motion-safe:transition-all motion-safe:duration-200
                       {isRail ? '-translate-x-1 opacity-0' : 'translate-x-0 opacity-100'}"
              >
                {item.label}
              </span>
              {#if item.planned && showLabels}
                <span class="hud text-muted/60 shrink-0 text-[0.5625rem] tracking-widest">◦ PLANNED</span>
              {/if}
            </a>
          </li>
        {/each}
      </ul>
    {/each}
  </nav>

  <!-- Footer (e.g. ClientSwitcher) — expanded only -->
  {#if footer && showLabels}
    <div class="border-line shrink-0 border-t">
      {@render footer()}
    </div>
  {/if}
</aside>
