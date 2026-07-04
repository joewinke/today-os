/**
 * /haoqi7 — vanilla scroll choreography for "the film" cut.
 *
 * No dependencies. Two pinned scenes:
 *   reel  — five full-frame title cards (FIND · PITCH · CLOSE · RUN · PROVE)
 *           crossfade inside a fixed letterboxed frame while a timecode readout
 *           and a scene counter scrub with the scroll; the PITCH card plays
 *           heavily-dimmed backing footage; the final beat is a CUT TO BLACK —
 *           the letterbox bars close, an ink veil rises, and a "CUT TO:" slug
 *           hands off to the creed section on flat ink.
 *   creed — the picture's biggest title card ("Agents propose. / Humans
 *           approve.") followed by a ratings-board certificate: three reviewed
 *           proposals stamped in sequence — two APPROVED, one REFUSED (amber).
 *
 * Every effect drives ONLY transform / opacity (via CSS custom properties the
 * scoped stylesheet reads). Listeners are passive + rAF-throttled. Both actions
 * short-circuit to a static composition under prefers-reduced-motion (the page
 * CSS collapses the pins to normal flow in that case), and backing footage is
 * never played under reduced motion or on small screens.
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

/** Timecode of a notional 60-second picture at 24 fps, scrubbed by t (0→1). */
function timecode(t: number): string {
  const total = t * 60
  const s = Math.floor(total)
  const f = Math.floor((total - s) * 24)
  const mm = String(Math.floor(s / 60)).padStart(2, "0")
  const ss = String(s % 60).padStart(2, "0")
  const ff = String(f).padStart(2, "0")
  return `00:${mm}:${ss}:${ff}`
}

/* ─────────────────────────────── the reel ─────────────────────────────── */

export const reel: Action<HTMLElement> = (node) => {
  const cards = Array.from(node.querySelectorAll<HTMLElement>("[data-card]"))
  const countEl = node.querySelector<HTMLElement>("[data-count]")
  const tcEl = node.querySelector<HTMLElement>("[data-tc]")
  const footage = node.querySelector<HTMLVideoElement>("[data-footage]")
  const N = Math.max(cards.length, 1)

  const setVars = (p: number) => {
    // Phase map: five title cards → cut to black.
    const t = smooth(p, 0.02, 0.86)
    const cut = smooth(p, 0.87, 0.95)
    node.style.setProperty("--p", Math.min(Math.max((p - 0.02) / 0.84, 0), 1).toFixed(4))
    node.style.setProperty("--cut", cut.toFixed(3))
    // the screenplay slug flashes once the veil is mostly up, then dies before un-pin
    node.style.setProperty("--slug", (smooth(p, 0.915, 0.945) * (1 - smooth(p, 0.965, 0.99))).toFixed(3))

    // card crossfade: --r (rise, incoming settle) and --f (fall, push-through exit)
    for (let i = 0; i < cards.length; i++) {
      const r = i === 0 ? 1 : smooth(t, i / N - 0.022, i / N + 0.022)
      const f = i === cards.length - 1 ? 0 : smooth(t, (i + 1) / N - 0.022, (i + 1) / N + 0.022)
      cards[i].style.setProperty("--r", r.toFixed(3))
      cards[i].style.setProperty("--f", f.toFixed(3))
      // PITCH (scene 02) carries the dimmed backing footage
      if (i === 1) node.style.setProperty("--v1", (r * (1 - f)).toFixed(3))
    }

    // scene counter readout
    if (countEl) {
      const idx = Math.min(N, Math.max(1, Math.floor(t * N) + 1))
      const label = `0${idx}`
      if (countEl.textContent !== label) countEl.textContent = label
    }
    // timecode readout
    if (tcEl) {
      const label = `TC ${timecode(t)}`
      if (tcEl.textContent !== label) tcEl.textContent = label
    }
  }

  if (reduced()) {
    // static composition: the picture at its final frame (CSS also collapses
    // the pin); backing footage never plays
    setVars(1)
    return {}
  }

  // play the dimmed backing footage only where the pinned stage is visible
  if (footage && window.matchMedia?.("(min-width: 768px)").matches) {
    footage.play().catch(() => {
      /* autoplay refusal is fine — the card reads without footage */
    })
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

/* ─────────────────────────────── the creed ─────────────────────────────── */

export const creed: Action<HTMLElement> = (node) => {
  const rows = Array.from(node.querySelectorAll<HTMLElement>("[data-row]"))

  const setVars = (g: number) => {
    node.style.setProperty("--gk", smooth(g, 0.03, 0.16).toFixed(4)) // kicker
    node.style.setProperty("--ga", smooth(g, 0.08, 0.3).toFixed(4)) // AGENTS PROPOSE.
    node.style.setProperty("--gb", smooth(g, 0.3, 0.52).toFixed(4)) // HUMANS APPROVE.
    node.style.setProperty("--card", smooth(g, 0.54, 0.68).toFixed(4)) // ratings card
    node.style.setProperty("--gs", smooth(g, 0.88, 0.96).toFixed(4)) // sub-line

    // certificate rows arrive staggered, then their verdicts stamp in sequence
    for (let i = 0; i < rows.length; i++) {
      const s = 0.6 + i * 0.06
      rows[i].style.setProperty("--in", smooth(g, s, s + 0.06).toFixed(3))
      rows[i].style.setProperty("--stamp", smooth(g, s + 0.12, s + 0.18).toFixed(3))
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
