/**
 * /haoqi4 — vanilla scroll choreography for "the blueprint" cut.
 *
 * No dependencies. Two pinned scenes:
 *   diagram  — the acquisition engine as an EXPLODED ENGINEERING DRAWING: five
 *              stroke-only parts draw themselves in one by one (SVG
 *              stroke-dashoffset on pathLength="1" paths), each with a leader
 *              tag and a mono callout; then the exploded parts CONVERGE onto
 *              the datum line into one assembled machine, an envelope box
 *              draws around the assembly, and an approval stamp slams onto
 *              the sheet ("OUTPUT: CUSTOMER ACQUIRED · LEDGER +").
 *   approval — the creed staged as the drawing's approval block: the block
 *              border draws, PROPOSED BY / "Agents propose." signs first, the
 *              revision-table rows arrive and take their verdict stamps (one
 *              REFUSED, in amber), then APPROVED BY / "Humans approve." signs.
 *
 * Every effect drives ONLY transform / opacity / stroke-dashoffset (via CSS
 * custom properties the scoped stylesheet reads). Listeners are passive +
 * rAF-throttled. Both actions short-circuit to the fully-drawn static
 * composition under prefers-reduced-motion (the page CSS collapses the pins
 * to normal flow in that case).
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

/** Shared wiring: reduced-motion short-circuit + passive rAF-throttled scroll. */
function wire(node: HTMLElement, setVars: (p: number) => void) {
  if (reduced()) {
    // static composition: the drawing is complete (CSS also collapses the pin)
    setVars(1)
    return {}
  }

  let ticking = false
  let last = -1
  const frame = () => {
    ticking = false
    const p = progressOf(node)
    if (Math.abs(p - last) < 0.0006) return
    last = p
    setVars(p)
  }
  const onScroll = () => {
    if (!ticking) {
      ticking = true
      requestAnimationFrame(frame)
    }
  }
  const onResize = () => {
    last = -1
    onScroll()
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

/* ──────────────────────────── the exploded view ──────────────────────────── */

export const diagram: Action<HTMLElement> = (node) => {
  const parts = Array.from(node.querySelectorAll<HTMLElement>("[data-part]"))
  const verbs = Array.from(node.querySelectorAll<HTMLElement>("[data-verb]"))
  const clines = Array.from(node.querySelectorAll<HTMLElement>("[data-cline]"))
  const countEl = node.querySelector<HTMLElement>("[data-count]")
  const N = Math.max(parts.length, 1)
  const zw = 0.56 / N // each part's draw zone width within [0.04, 0.60]

  const setVars = (p: number) => {
    // Phase map: draw the five parts [0.04..0.60] → converge [0.64..0.78]
    // → envelope box [0.79..0.86] → approval stamp [0.87..0.93] → hold.
    for (let i = 0; i < parts.length; i++) {
      const s = 0.04 + i * zw
      const dr = smooth(p, s, s + zw * 0.9) // line-drawing progress
      const a = 1 - smooth(Math.abs(p - (s + zw / 2)), 0.045, 0.1) // activation
      const done = smooth(p, s + zw * 0.9, s + zw * 0.9 + 0.03)
      parts[i].style.setProperty("--dr", dr.toFixed(3))
      parts[i].style.setProperty("--a", a.toFixed(3))
      parts[i].style.setProperty("--done", done.toFixed(3))
    }

    // datum line + progress hairline complete when the last part is drawn
    node.style.setProperty("--p", Math.min(Math.max((p - 0.04) / 0.55, 0), 1).toFixed(4))
    node.style.setProperty("--asm", smooth(p, 0.64, 0.78).toFixed(4))
    node.style.setProperty("--env", smooth(p, 0.79, 0.86).toFixed(4))
    node.style.setProperty("--stamp", smooth(p, 0.87, 0.93).toFixed(4))

    // caption crossfade: one zone per part + a final assembly caption
    const bounds: number[] = []
    for (let i = 0; i < N; i++) bounds.push(0.04 + i * zw)
    bounds.push(0.63)
    for (let i = 0; i < verbs.length; i++) {
      const rise = i === 0 ? 1 : smooth(p, bounds[i] - 0.02, bounds[i] + 0.03)
      const fall = i === verbs.length - 1 ? 0 : smooth(p, bounds[i + 1] - 0.03, bounds[i + 1] + 0.02)
      const o = rise * (1 - fall)
      verbs[i].style.setProperty("--o", o.toFixed(3))
      clines[i]?.style.setProperty("--o", o.toFixed(3))
    }

    // sheet counter readout
    if (countEl) {
      const idx = Math.min(N, Math.max(1, Math.floor((p - 0.04) / zw) + 1))
      const label = `0${idx}`
      if (countEl.textContent !== label) countEl.textContent = label
    }
  }

  return wire(node, setVars)
}

/* ──────────────────────────── the approval block ─────────────────────────── */

export const approval: Action<HTMLElement> = (node) => {
  const rows = Array.from(node.querySelectorAll<HTMLElement>("[data-row]"))

  const setVars = (g: number) => {
    node.style.setProperty("--ab", smooth(g, 0.02, 0.18).toFixed(4)) // block border draws
    node.style.setProperty("--al", smooth(g, 0.13, 0.3).toFixed(4)) // PROPOSED BY signs
    node.style.setProperty("--ar", smooth(g, 0.66, 0.82).toFixed(4)) // APPROVED BY signs
    node.style.setProperty("--as", smooth(g, 0.85, 0.93).toFixed(4)) // sub-line

    // revision rows: staggered arrival, then verdict stamps
    const starts = [0.34, 0.44, 0.54]
    for (let i = 0; i < rows.length; i++) {
      const s = starts[i] ?? 0.54
      rows[i].style.setProperty("--in", smooth(g, s - 0.1, s).toFixed(3))
      rows[i].style.setProperty("--stamp", smooth(g, s + 0.12, s + 0.2).toFixed(3))
    }
  }

  return wire(node, setVars)
}
