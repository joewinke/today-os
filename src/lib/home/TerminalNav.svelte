<script lang="ts">
  /**
   * Nav as terminal controls. Keyboard: F → /funnel-score, / → /admin.
   * Shortcuts ignore typing targets and modifier combos.
   */
  import { goto } from "$app/navigation"

  $effect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return
      if (e.key === "f" || e.key === "F") {
        e.preventDefault()
        goto("/funnel-score")
      } else if (e.key === "/") {
        e.preventDefault()
        goto("/os")
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  })
</script>

<header class="border-line bg-base-100/90 fixed inset-x-0 top-0 z-50 border-b">
  <!-- right padding clears the fixed theme-toggle in the top-right corner -->
  <nav class="flex h-12 items-center justify-between pr-14 pl-6 sm:pr-16 sm:pl-10" aria-label="Primary">
    <a href="/" class="hud text-base-content hover:text-base-content"> TODAY OS </a>
    <div class="flex items-center gap-4 sm:gap-6">
      <a href="/readme" class="hud hover:text-base-content">README</a>
      <a href="/os" class="hud text-primary hover:text-base-content">
        ENTER TODAY OS<span class="text-base-content/50">[/]</span>
      </a>
    </div>
  </nav>
</header>
