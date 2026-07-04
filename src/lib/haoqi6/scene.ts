/**
 * /haoqi6 — vanilla scroll choreography for "the radar" cut.
 *
 * No dependencies. Two pinned scenes:
 *   intercept — the five lifecycle stages play out ON the scope: the sweep finds
 *               a contact (blip + ping), a track line extends toward it (pitch),
 *               its designation flips hollow → solid with an ACQUIRED tag
 *               (close), a protective gate arc draws around it (run), and the
 *               contact banks a LEDGER + credit (prove). The final beat is a
 *               SWEEP HOLD — the stage chrome dims and an ink veil rises so the
 *               un-pin hands off to the weapons-hold section on flat ink.
 *   hold      — authorization requests queue at the weapons-hold line; two cross
 *               with APPROVED stamps, one is refused (amber) and held.
 *
 * Every effect drives ONLY transform / opacity / stroke-dashoffset (via CSS
 * custom properties the scoped stylesheet reads). Listeners are passive +
 * rAF-throttled. Both actions short-circuit to the completed state under
 * prefers-reduced-motion (the page CSS collapses the pins to normal flow).
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

/* ───────────────────────────── the intercept ───────────────────────────── */

export const intercept: Action<HTMLElement> = (node) => {
  const verbs = Array.from(node.querySelectorAll<HTMLElement>("[data-verb]"))
  const lines = Array.from(node.querySelectorAll<HTMLElement>("[data-line]"))
  const callouts = Array.from(node.querySelectorAll<HTMLElement>("[data-callout]"))
  const stations = Array.from(node.querySelectorAll<HTMLElement>("[data-station]"))
  const countEl = node.querySelector<HTMLElement>("[data-count]")
  const N = 5

  const setVars = (p: number) => {
    // Phase map: travel (five stage zones) → output line → sweep hold (veil).
    const t = smooth(p, 0.03, 0.82)
    const out = smooth(p, 0.85, 0.92)
    const end = smooth(p, 0.94, 1)

    node.style.setProperty("--p", Math.min(Math.max((p - 0.03) / 0.79, 0), 1).toFixed(4))
    node.style.setProperty("--out", out.toFixed(4))
    // sweep hold: chrome fades first, then the ink veil rises over the scope
    node.style.setProperty("--zf", smooth(end, 0, 0.45).toFixed(3))
    node.style.setProperty("--zv", smooth(end, 0.3, 1).toFixed(3))

    // ── the intercept beats, staged inside each verb's zone ──
    // 01 FIND — the sweep passes and the contact lights up; a ping ring expands
    const blip = smooth(t, 0.05, 0.11)
    node.style.setProperty("--blip", blip.toFixed(3))
    node.style.setProperty("--ping", smooth(t, 0.05, 0.2).toFixed(3))
    node.style.setProperty("--pingo", (smooth(t, 0.05, 0.12) * (1 - smooth(t, 0.16, 0.26))).toFixed(3))
    // 02 PITCH — a track line extends from scope center toward the contact
    node.style.setProperty("--track", smooth(t, 0.24, 0.36).toFixed(3))
    // 03 CLOSE — designation flips hollow → solid, ACQUIRED tag stamps on
    node.style.setProperty("--acq", smooth(t, 0.44, 0.54).toFixed(3))
    // 04 RUN — the protective gate arc draws around the contact
    node.style.setProperty("--gate", smooth(t, 0.63, 0.75).toFixed(3))
    // 05 PROVE — the contact banks a credit; LEDGER + ticks on
    node.style.setProperty("--ledg", smooth(t, 0.84, 0.92).toFixed(3))

    // big verb + line + scope callout crossfade per stage zone; dim as the
    // output line lands
    const dimOut = 1 - out * 0.9
    for (let i = 0; i < verbs.length; i++) {
      const rise = i === 0 ? 1 : smooth(t, i / N - 0.018, i / N + 0.03)
      const fall = i === verbs.length - 1 ? 0 : smooth(t, (i + 1) / N - 0.03, (i + 1) / N + 0.018)
      const o = rise * (1 - fall) * dimOut
      verbs[i].style.setProperty("--o", o.toFixed(3))
      lines[i]?.style.setProperty("--o", o.toFixed(3))
      callouts[i]?.style.setProperty("--o", o.toFixed(3))
    }

    // sequence rail: activation + completion per stage
    for (let i = 0; i < stations.length; i++) {
      const cx = (i + 0.5) / N
      const d = Math.abs(t - cx)
      const a = 1 - smooth(d, 0.035, 0.1)
      const done = smooth(t - cx, 0.02, 0.055)
      stations[i].style.setProperty("--a", a.toFixed(3))
      stations[i].style.setProperty("--done", done.toFixed(3))
    }

    // stage counter readout
    if (countEl) {
      const idx = Math.min(N, Math.max(1, Math.floor(t * N) + 1))
      const label = `0${idx}`
      if (countEl.textContent !== label) countEl.textContent = label
    }
  }

  if (reduced()) {
    // static composition: intercept complete (CSS also collapses the pin)
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

/* ─────────────────────────── the weapons hold ─────────────────────────── */

export const hold: Action<HTMLElement> = (node) => {
  const chips = Array.from(node.querySelectorAll<HTMLElement>("[data-chip]"))

  const setVars = (g: number) => {
    node.style.setProperty("--g", g.toFixed(4))
    node.style.setProperty("--gl", smooth(g, 0.03, 0.26).toFixed(4)) // AGENTS PROPOSE.
    node.style.setProperty("--hold", smooth(g, 0.24, 0.42).toFixed(4)) // hold line arms
    node.style.setProperty("--gr", smooth(g, 0.52, 0.72).toFixed(4)) // HUMANS APPROVE.
    node.style.setProperty("--gs", smooth(g, 0.78, 0.9).toFixed(4)) // sub-line

    // authorization requests: staggered arrival, then verdicts
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
