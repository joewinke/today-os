/**
 * /haoqi2 — vanilla scroll choreography for "the machine" cut.
 *
 * No dependencies. Two pinned scenes:
 *   machine — a workpiece travels a horizontal track through five stations and is
 *             progressively cut from rough stone into the polished gem; the final
 *             beat is a POWER-DOWN — the stage darkens to ink while the rail
 *             flashes into one hot line across the center, the line collapses
 *             from both ends into a bright dot (CRT-off), and the dot blinks
 *             out — so the un-pin hands off seamlessly to the gate section,
 *             whose vertical gate hairline picks up where the dot died.
 *   gate    — proposal chips queue at a center hairline; two cross with APPROVED
 *             stamps, one is refused and stays.
 *
 * Every effect drives ONLY transform / opacity (via CSS custom properties the
 * scoped stylesheet reads). Listeners are passive + rAF-throttled. Both actions
 * short-circuit to a static composition under prefers-reduced-motion (the page
 * CSS collapses the pins to normal flow in that case).
 */
import type { Action } from "svelte/action"

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true

/** Smooth Hermite ramp from 0→1 across [a,b]. */
function smooth(x: number, a: number, b: number): number {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1)
  return t * t * (3 - 2 * t)
}

/** Scroll progress (0→1) of a tall wrapper whose child is pinned. */
function progressOf(node: HTMLElement): number {
  const r = node.getBoundingClientRect()
  const total = r.height - window.innerHeight
  if (total <= 0) return 0
  return Math.min(Math.max(-r.top / total, 0), 1)
}

/* ────────────────────────────── the machine ────────────────────────────── */

export const machine: Action<HTMLElement> = (node) => {
  const track = node.querySelector<HTMLElement>("[data-track]")
  const piece = node.querySelector<HTMLElement>("[data-piece]")
  const states = Array.from(node.querySelectorAll<HTMLElement>("[data-state]"))
  const stations = Array.from(node.querySelectorAll<HTMLElement>("[data-station]"))
  const verbs = Array.from(node.querySelectorAll<HTMLElement>("[data-verb]"))
  const lines = Array.from(node.querySelectorAll<HTMLElement>("[data-line]"))
  const countEl = node.querySelector<HTMLElement>("[data-count]")
  const N = Math.max(stations.length, 1)

  const setVars = (p: number) => {
    // Phase map: travel (stations) → output chip → zoom INTO the gem.
    const t = smooth(p, 0.03, 0.68)
    const out = smooth(p, 0.7, 0.77)
    const z = smooth(p, 0.8, 0.995)
    // progress readouts (prog bar + lit rail) complete when the piece arrives
    node.style.setProperty("--p", Math.min(Math.max((p - 0.03) / 0.65, 0), 1).toFixed(4))
    node.style.setProperty("--out", out.toFixed(4))
    // power-down sub-phases: chrome fades, ink veil rises, the hot line flashes
    // across then collapses from both ends into a dot, the dot blinks out
    node.style.setProperty("--zf", smooth(z, 0, 0.22).toFixed(3))
    node.style.setProperty("--zv", smooth(z, 0.1, 0.42).toFixed(3))
    node.style.setProperty("--zl", (smooth(z, 0.12, 0.3) * (1 - smooth(z, 0.5, 0.82))).toFixed(3))
    node.style.setProperty("--zlo", (smooth(z, 0.1, 0.2) * (1 - smooth(z, 0.84, 0.92))).toFixed(3))
    node.style.setProperty("--zd", (0.4 + smooth(z, 0.72, 0.84) * 0.6).toFixed(3))
    node.style.setProperty("--zdo", (smooth(z, 0.72, 0.84) * (1 - smooth(z, 0.9, 0.985))).toFixed(3))

    // piece position along the track (px, measured)
    if (track && piece) {
      const w = track.clientWidth
      const x = (0.02 + 0.96 * t) * w
      piece.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0) translate(-50%, -50%)`
    }

    // station activation + completion
    for (let i = 0; i < stations.length; i++) {
      const cx = (i + 0.5) / N
      const d = Math.abs(t - cx)
      const a = 1 - smooth(d, 0.035, 0.1)
      const done = smooth(t - cx, 0.02, 0.055)
      stations[i].style.setProperty("--a", a.toFixed(3))
      stations[i].style.setProperty("--done", done.toFixed(3))
    }

    // big verb + line crossfade per station zone; dim as the output chip lands
    const dimOut = 1 - out * 0.9
    for (let i = 0; i < verbs.length; i++) {
      const rise = i === 0 ? 1 : smooth(t, i / N - 0.018, i / N + 0.03)
      const fall = i === verbs.length - 1 ? 0 : smooth(t, (i + 1) / N - 0.03, (i + 1) / N + 0.018)
      const o = rise * (1 - fall) * dimOut
      verbs[i].style.setProperty("--o", o.toFixed(3))
      lines[i]?.style.setProperty("--o", o.toFixed(3))
    }

    // workpiece morph: crossfade state i within its station zone
    for (let i = 0; i < states.length; i++) {
      const rise = i === 0 ? 1 : smooth(t, i / N - 0.025, i / N + 0.025)
      const fall = i === states.length - 1 ? 0 : smooth(t, (i + 1) / N - 0.025, (i + 1) / N + 0.025)
      states[i].style.setProperty("--m", (rise * (1 - fall)).toFixed(3))
    }

    // stage counter readout
    if (countEl) {
      const idx = Math.min(N, Math.max(1, Math.floor(t * N) + 1))
      const label = `0${idx}`
      if (countEl.textContent !== label) countEl.textContent = label
    }
  }

  if (reduced()) {
    // static composition: machine complete (CSS also collapses the pin)
    setVars(1)
    return {}
  }

  let ticking = false
  let lastP = -1
  const frame = () => {
    ticking = false
    const p = progressOf(node)
    if (Math.abs(p - lastP) < 0.0006) return
    lastP = p
    setVars(p)
  }
  const onScroll = () => {
    if (!ticking) {
      ticking = true
      requestAnimationFrame(frame)
    }
  }
  const onResize = () => {
    lastP = -1
    frame()
  }

  frame()
  window.addEventListener("scroll", onScroll, { passive: true })
  window.addEventListener("resize", onResize, { passive: true })
  return {
    destroy() {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
    },
  }
}

/* ─────────────────────────────── the gate ─────────────────────────────── */

export const gate: Action<HTMLElement> = (node) => {
  const chips = Array.from(node.querySelectorAll<HTMLElement>("[data-chip]"))

  const setVars = (g: number) => {
    node.style.setProperty("--g", g.toFixed(4))
    node.style.setProperty("--gl", smooth(g, 0.03, 0.26).toFixed(4)) // AGENTS PROPOSE.
    node.style.setProperty("--gate", smooth(g, 0.24, 0.42).toFixed(4)) // hairline arms
    node.style.setProperty("--gr", smooth(g, 0.52, 0.72).toFixed(4)) // HUMANS APPROVE.
    node.style.setProperty("--gs", smooth(g, 0.78, 0.9).toFixed(4)) // sub-line

    // chips: staggered arrival, then verdicts
    const starts = [0.3, 0.4, 0.5]
    for (let i = 0; i < chips.length; i++) {
      const s = starts[i] ?? 0.5
      const arrive = smooth(g, s - 0.12, s) // slide into the queue
      const cross = chips[i].dataset.verdict === "approved" ? smooth(g, s + 0.1, s + 0.24) : 0
      const stamp = smooth(g, s + 0.26, s + 0.34) // verdict stamp fades in
      chips[i].style.setProperty("--in", arrive.toFixed(3))
      chips[i].style.setProperty("--c", cross.toFixed(3))
      chips[i].style.setProperty("--stamp", stamp.toFixed(3))
    }
  }

  if (reduced()) {
    setVars(1)
    return {}
  }

  let ticking = false
  let lastG = -1
  const frame = () => {
    ticking = false
    const g = progressOf(node)
    if (Math.abs(g - lastG) < 0.0006) return
    lastG = g
    setVars(g)
  }
  const onScroll = () => {
    if (!ticking) {
      ticking = true
      requestAnimationFrame(frame)
    }
  }

  frame()
  window.addEventListener("scroll", onScroll, { passive: true })
  window.addEventListener("resize", onScroll, { passive: true })
  return {
    destroy() {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    },
  }
}
