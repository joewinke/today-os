<script lang="ts">
  import "$lib/home/home.css"
  import { page } from "$app/state"
  import { STAGES, stageForPath } from "$lib/os/stages"

  let { children } = $props()
  const active = $derived(stageForPath(page.url.pathname))
  const onDashboard = $derived(page.url.pathname.replace(/\/$/, "") === "/os")
</script>

<div class="blueprint min-h-screen lg:flex">
  <!-- ── OS rail: the lifecycle IS the nav ─────────────────────────────────── -->
  <aside
    class="border-line bg-base-100 sticky top-0 z-30 flex shrink-0 flex-col gap-1 border-b px-3 py-3 lg:h-screen lg:w-56 lg:border-r lg:border-b-0 lg:px-4 lg:py-6"
  >
    <a href="/os" class="mb-1 flex items-center gap-2 px-2 lg:mb-6">
      <span class="h-2 w-2 rounded-full {onDashboard ? 'bg-primary' : 'bg-base-content/40'}"></span>
      <span class="statement text-lg leading-none">Today OS</span>
    </a>

    <nav class="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible" aria-label="Lifecycle stages">
      <a
        href="/os"
        class="hud shrink-0 rounded-none px-2 py-1.5 transition-colors {onDashboard
          ? 'text-primary'
          : 'text-base-content/50 hover:text-base-content'}"
      >
        ◈ DASHBOARD
      </a>
      {#each STAGES as stage, i (stage.key)}
        <a
          href={stage.href}
          class="group shrink-0 rounded-none px-2 py-1.5 transition-colors lg:py-2 {active === stage.key
            ? 'text-primary'
            : 'text-base-content/60 hover:text-base-content'}"
          aria-current={active === stage.key ? "page" : undefined}
        >
          <span class="hud flex items-center gap-2">
            <span class="text-base-content/30">{i + 1}</span>
            {stage.label}
          </span>
          <span class="hidden text-[11px] leading-tight text-base-content/40 lg:block">{stage.blurb}</span>
        </a>
      {/each}
    </nav>

    <a
      href="/"
      class="hud text-base-content/30 hover:text-base-content mt-auto hidden px-2 pt-6 transition-colors lg:block"
    >
      ← MARKETING SITE
    </a>
  </aside>

  <!-- ── Stage surface ─────────────────────────────────────────────────────── -->
  <main class="min-w-0 flex-1">
    {@render children()}
  </main>
</div>
