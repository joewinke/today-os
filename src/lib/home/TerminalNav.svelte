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
        goto("/admin")
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  })
</script>

<header class="border-line bg-base-100/90 fixed inset-x-0 top-0 z-50 border-b">
  <nav class="flex h-12 items-center justify-between px-6 sm:px-10" aria-label="Primary">
    <a href="/" class="hud text-base-content hover:text-base-content">
      IT&rsquo;S TODAY MEDIA
    </a>
    <div class="flex items-center gap-4 sm:gap-7">
      <a href="/#work" class="hud hover:text-base-content hidden sm:inline">WORK</a>
      <a href="/#contact" class="hud hover:text-base-content hidden sm:inline">CONTACT</a>
      <a href="/studio" class="hud hover:text-base-content hidden md:inline">STUDIO</a>
      <a href="/funnel-score" class="hud hover:text-base-content">
        FUNNEL<span class="text-base-content/60">[F]</span>
      </a>
      <a href="/admin" class="hud hover:text-base-content">
        OS<span class="text-base-content/60">[/]</span>
      </a>
    </div>
  </nav>
</header>
