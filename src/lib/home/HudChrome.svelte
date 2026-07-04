<script lang="ts">
  /**
   * Fixed instrument chrome: corner registration marks + live readouts.
   * Bottom-left: cursor coordinates. Bottom-center: scroll progress.
   * Bottom-right: Baltimore ET clock. Readouts hide on small screens
   * (marks + clock stay).
   */
  let clock = $state("--:--:--")
  let mx = $state(0)
  let my = $state(0)
  let scrollPct = $state(0)

  $effect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    const tick = () => {
      clock = fmt.format(new Date())
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  })

  $effect(() => {
    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
    }
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      scrollPct = max > 0 ? Math.round((window.scrollY / max) * 100) : 0
    }
    onScroll()
    window.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  })

  const pad4 = (n: number) => String(Math.max(0, Math.round(n))).padStart(4, "0")
  const pad3 = (n: number) => String(Math.max(0, Math.min(100, n))).padStart(3, "0")
</script>

<div aria-hidden="true">
  <span class="reg-mark reg-mark--tl"></span>
  <span class="reg-mark reg-mark--tr"></span>
  <span class="reg-mark reg-mark--bl"></span>
  <span class="reg-mark reg-mark--br"></span>
</div>

<div
  class="hud-readout pointer-events-none fixed inset-x-0 bottom-0 z-50 flex h-9 items-center justify-between px-8"
  aria-hidden="true"
>
  <span class="hud hidden md:inline">{pad4(mx)} X · {pad4(my)} Y</span>
  <span class="hud hidden sm:inline">SCR {pad3(scrollPct)}%</span>
  <span class="hud flex items-center gap-2">
    <span class="live-dot"></span>
    BALTIMORE MD · ET {clock}
  </span>
</div>
