<!--
  ClientSwitcher — sidebar-footer client picker.

  Lists "All clients" plus the closed-won prospects whose accounts are live (the
  os store's managed clients). The store is server-only, so the caller reads it in
  a load function and passes the result down as `clients` — this component never
  imports the store.

  Selecting a client is conceptual for now: it navigates to /report/{slug}, the one
  per-client surface that exists. Full cross-surface filtering ships with the
  substrate (labeled honestly in the menu caption).

  Semantics: a real listbox — button[aria-haspopup=listbox] + ul[role=listbox] with
  arrow/Home/End/Escape keyboard navigation and roving focus onto the options.
-->
<script module lang="ts">
  export interface ClientOption {
    /** URL slug used to build /report/{slug}. */
    slug: string
    /** Display name, e.g. "Lumen Aesthetics". */
    label: string
  }
</script>

<script lang="ts">
  import { tick } from "svelte"

  let {
    clients = [],
    activeSlug = null,
  }: {
    clients?: ClientOption[]
    /** The currently-scoped client slug, if any (drives the button label). */
    activeSlug?: string | null
  } = $props()

  interface Row {
    slug: string | null
    label: string
    href: string
    sub: string
  }

  const rows = $derived<Row[]>([
    { slug: null, label: "All clients", href: "/os", sub: "unfiltered" },
    ...clients.map((c) => ({ slug: c.slug, label: c.label, href: `/report/${c.slug}`, sub: "monthly report" })),
  ])

  const activeLabel = $derived(
    (activeSlug && clients.find((c) => c.slug === activeSlug)?.label) || "ALL",
  )
  const selectedIndex = $derived(
    Math.max(0, rows.findIndex((r) => r.slug === activeSlug)),
  )

  let open = $state(false)
  let activeIndex = $state(0)
  let buttonEl: HTMLButtonElement
  let optionEls: HTMLAnchorElement[] = $state([])

  async function toggle(): Promise<void> {
    open = !open
    if (open) {
      activeIndex = selectedIndex
      await tick()
      optionEls[activeIndex]?.focus()
    }
  }

  function close(refocus = false): void {
    open = false
    if (refocus) buttonEl?.focus()
  }

  async function move(to: number): Promise<void> {
    activeIndex = Math.max(0, Math.min(rows.length - 1, to))
    await tick()
    optionEls[activeIndex]?.focus()
  }

  function onListKeydown(e: KeyboardEvent): void {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        move(activeIndex + 1)
        break
      case "ArrowUp":
        e.preventDefault()
        move(activeIndex - 1)
        break
      case "Home":
        e.preventDefault()
        move(0)
        break
      case "End":
        e.preventDefault()
        move(rows.length - 1)
        break
      case "Escape":
        e.preventDefault()
        close(true)
        break
    }
  }

  // Close when focus leaves the whole switcher (click-away or Tab-out).
  function onFocusOut(e: FocusEvent): void {
    const next = e.relatedTarget as Node | null
    if (next && e.currentTarget instanceof Node && e.currentTarget.contains(next)) return
    open = false
  }
</script>

<div class="relative p-2" onfocusout={onFocusOut}>
  <p class="hud text-muted/60 mb-1 px-1 text-[0.5625rem] leading-tight">
    client workspaces — full filtering ships with the substrate
  </p>

  <button
    bind:this={buttonEl}
    type="button"
    onclick={toggle}
    class="hud border-line text-base-content/70 hover:text-base-content hover:border-base-content/40 flex w-full items-center gap-2 border px-2 py-2 text-left transition-colors"
    aria-haspopup="listbox"
    aria-expanded={open}
    aria-label="Switch client workspace"
  >
    <span class="text-muted/70">CLIENT:</span>
    <span class="min-w-0 flex-1 truncate uppercase">{activeLabel}</span>
    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 {open ? 'rotate-180' : ''} motion-safe:transition-transform" aria-hidden="true"><path d="M4 6l4 4 4-4" /></svg>
  </button>

  {#if open}
    <ul
      role="listbox"
      aria-label="Client workspaces"
      tabindex="-1"
      onkeydown={onListKeydown}
      class="border-line bg-base-100 absolute bottom-full left-2 right-2 z-50 mb-1 max-h-64 overflow-y-auto border shadow-none"
    >
      {#each rows as row, i (row.href)}
        {@const selected = row.slug === activeSlug}
        <li role="option" aria-selected={selected}>
          <a
            bind:this={optionEls[i]}
            href={row.href}
            tabindex={i === activeIndex ? 0 : -1}
            onclick={() => close()}
            class="hud flex items-center gap-2 px-2 py-2 transition-colors
                   {selected ? 'text-primary bg-primary/10' : 'text-base-content/65 hover:text-base-content hover:bg-base-content/5'}"
          >
            <span class="min-w-0 flex-1 truncate uppercase">{row.label}</span>
            <span class="text-muted/50 shrink-0 text-[0.5625rem] normal-case">{row.sub}</span>
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</div>
