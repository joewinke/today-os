/**
 * /haoqi8 — vanilla scroll choreography for "the console cut, radar creed".
 *
 * No dependencies. Two pinned scenes:
 *   procs — /haoqi3's lifecycle as a live PROCESS TABLE: five processes flip
 *           QUEUED → RUNNING → DONE in sequence as you scroll; the active
 *           process's one-line description streams in word-by-word like log
 *           output (a per-line --lp var the CSS turns into a per-word opacity
 *           ramp), a ledger readout ticks up during PROVE, and the scene ends
 *           on a POWER-DOWN — chrome fades, an ink veil rises, the table's
 *           hot line flashes across center, collapses into a dot, and the
 *           dot blinks out (CRT-off) so the un-pin hands off ink-on-ink to
 *           the weapons-hold section.
 *   hold  — /haoqi6's creed as a WEAPONS-HOLD authorization moment:
 *           authorization requests queue at the hold line; two cross with
 *           APPROVED stamps, one is refused (amber) and held.
 *
 * Every effect drives ONLY transform / opacity (via CSS custom properties the
 * scoped stylesheet reads). Listeners are passive + rAF-throttled. Both
 * actions short-circuit to a static composition under prefers-reduced-motion
 * (the page CSS collapses the pins to normal flow in that case; on <768px the
 * pins also collapse and the CSS hard-sets the final composition).
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

/** Shared rAF-throttled scroll loop. */
function onScrollLoop(node: HTMLElement, setVars: (p: number) => void) {
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
    frame()
  }
  frame()
  window.addEventListener("scroll", onScroll, { passive: true })
  window.addEventListener("resize", onResize, { passive: true })
  return () => {
    window.removeEventListener("scroll", onScroll)
    window.removeEventListener("resize", onResize)
  }
}

/* ─────────────────────────── the process table ─────────────────────────── */

/** Fixture figure the ledger readout ticks toward ($20,905/MO, from FIXTURES). */
const LEDGER_TARGET = 20905

export const procs: Action<HTMLElement> = (node) => {
  const rows = Array.from(node.querySelectorAll<HTMLElement>("[data-proc]"))
  const verbs = Array.from(node.querySelectorAll<HTMLElement>("[data-verb]"))
  const lines = Array.from(node.querySelectorAll<HTMLElement>("[data-line]"))
  const countEl = node.querySelector<HTMLElement>("[data-count]")
  const ledgerEl = node.querySelector<HTMLElement>("[data-ledger]")
  const N = Math.max(rows.length, 1)

  const setVars = (p: number) => {
    // Phase map: run the table (t) → output line → power-down (CRT-off).
    const t = smooth(p, 0.03, 0.68)
    const out = smooth(p, 0.7, 0.77)
    const z = smooth(p, 0.8, 0.995)
    node.style.setProperty("--p", Math.min(Math.max((p - 0.03) / 0.65, 0), 1).toFixed(4))
    node.style.setProperty("--out", out.toFixed(4))
    // power-down sub-phases: chrome fades, ink veil rises, the hot line
    // flashes across then collapses from both ends into a dot, dot blinks out
    node.style.setProperty("--zf", smooth(z, 0, 0.22).toFixed(3))
    node.style.setProperty("--zv", smooth(z, 0.1, 0.42).toFixed(3))
    node.style.setProperty("--zl", (smooth(z, 0.12, 0.3) * (1 - smooth(z, 0.5, 0.82))).toFixed(3))
    node.style.setProperty("--zlo", (smooth(z, 0.1, 0.2) * (1 - smooth(z, 0.84, 0.92))).toFixed(3))
    node.style.setProperty("--zd", (0.4 + smooth(z, 0.72, 0.84) * 0.6).toFixed(3))
    node.style.setProperty("--zdo", (smooth(z, 0.72, 0.84) * (1 - smooth(z, 0.9, 0.985))).toFixed(3))

    // per-process status: QUEUED → RUNNING → DONE within zone [i/N, (i+1)/N]
    for (let i = 0; i < rows.length; i++) {
      const z0 = i / N
      const z1 = (i + 1) / N
      const rise = i === 0 ? smooth(t, 0.002, 0.02) : smooth(t, z0 + 0.004, z0 + 0.03)
      const done = i === N - 1 ? smooth(t, 0.97, 0.998) : smooth(t, z1 - 0.025, z1 + 0.005)
      rows[i].style.setProperty("--q", (1 - rise).toFixed(3))
      rows[i].style.setProperty("--r", (rise * (1 - done)).toFixed(3))
      rows[i].style.setProperty("--dn", done.toFixed(3))
    }

    // big verb crossfade per zone; dim as the output line lands
    const dimOut = 1 - out * 0.9
    for (let i = 0; i < verbs.length; i++) {
      const rise = i === 0 ? 1 : smooth(t, i / N - 0.018, i / N + 0.03)
      const fall = i === verbs.length - 1 ? 0 : smooth(t, (i + 1) / N - 0.03, (i + 1) / N + 0.018)
      const o = rise * (1 - fall) * dimOut
      verbs[i].style.setProperty("--o", o.toFixed(3))
      // the log line shares visibility with its verb, plus a stream progress
      // (--lp) the CSS turns into a word-by-word reveal
      const line = lines[i]
      if (line) {
        line.style.setProperty("--o", o.toFixed(3))
        const lp = Math.min(Math.max(((t - i / N) * N) / 0.6, 0), 1)
        line.style.setProperty("--lp", lp.toFixed(3))
      }
    }

    // PROC counter readout
    if (countEl) {
      const idx = Math.min(N, Math.max(1, Math.floor(t * N) + 1))
      const label = `0${idx}`
      if (countEl.textContent !== label) countEl.textContent = label
    }

    // ledger ticker — counts to the FIXTURES figure during PROVE
    if (ledgerEl) {
      const v = Math.round(LEDGER_TARGET * smooth(t, (N - 1) / N + 0.01, 0.99))
      const label = `$${v.toLocaleString("en-US")}`
      if (ledgerEl.textContent !== label) ledgerEl.textContent = label
    }
  }

  if (reduced()) {
    // static composition: table complete (CSS also collapses the pin)
    setVars(1)
    return {}
  }

  const stop = onScrollLoop(node, setVars)
  return { destroy: stop }
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

  const stop = onScrollLoop(node, setVars)
  return { destroy: stop }
}
