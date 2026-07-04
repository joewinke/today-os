/**
 * /haoqi5 — vanilla scroll choreography for "the ledger" cut.
 *
 * No dependencies. Two pinned scenes:
 *   ledger  — the five lifecycle stages post to a ruled ledger sheet one by
 *             one as you scroll; each entry line-items in, takes a POSTED
 *             stamp, and a running WASTE SURFACED total ticks upward —
 *             deterministically, derived only from scroll progress — until it
 *             resolves to the fixture figure ($20,905). The closing beat draws
 *             the accountant's double rule under the bottom line and prints
 *             the output posting.
 *   opinion — the audit-opinion beat: "Agents propose. Humans approve." set
 *             as the signature block; three journal entries arrive, two take
 *             APPROVED stamps, one is REFUSED (amber) and never posts; two
 *             signature rules draw — proposed by the agents, countersigned by
 *             the human.
 *
 * Every effect drives ONLY transform / opacity (via CSS custom properties the
 * scoped stylesheet reads). The ticking total swaps textContent inside the rAF
 * frame — throttled, deterministic from progress, no randomness, no Date.now.
 * Listeners are passive + rAF-throttled. Both actions short-circuit to the
 * completed composition under prefers-reduced-motion AND under the mobile
 * breakpoint (<768px), where the page CSS collapses the pins to normal flow.
 */
import type { Action } from "svelte/action"
import { LEDGER_TOTAL } from "./copy"

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true

const mobile = () =>
  typeof window !== "undefined" && window.matchMedia?.("(max-width: 767px)").matches === true

/** Static composition mode: no pin, vars land at their completed values. */
const isStatic = () => reduced() || mobile()

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

/** rAF-throttled scroll plumbing shared by both actions.
 *  In static mode (reduced motion or <768px) the vars land at 1 — the
 *  completed composition — and the frame early-returns on every later tick. */
function drive(node: HTMLElement, setVars: (p: number) => void) {
  let ticking = false
  let last = -2
  const frame = () => {
    ticking = false
    const p = isStatic() ? 1 : progressOf(node)
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
    last = -2
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

/* ────────────────────────────── the ledger ────────────────────────────── */

export const ledger: Action<HTMLElement> = (node) => {
  const rows = Array.from(node.querySelectorAll<HTMLElement>("[data-entry]"))
  const marks = Array.from(node.querySelectorAll<HTMLElement>("[data-mark]"))
  const countEl = node.querySelector<HTMLElement>("[data-count]")
  const totalEl = node.querySelector<HTMLElement>("[data-total]")
  const N = Math.max(rows.length, 1)
  const zone = 1 / N

  const setVars = (p: number) => {
    // Phase map: entries post across the long middle → bottom line settles →
    // double rule draws → output posting prints.
    const t = smooth(p, 0.02, 0.78)
    node.style.setProperty("--p", Math.min(Math.max((p - 0.02) / 0.76, 0), 1).toFixed(4))
    node.style.setProperty("--rule", smooth(p, 0.79, 0.87).toFixed(3))
    node.style.setProperty("--out", smooth(p, 0.86, 0.94).toFixed(3))

    // entries: each posts (slides onto its rule) then takes its POSTED stamp
    let acc = 0
    for (let i = 0; i < rows.length; i++) {
      const s = i * zone
      const post = smooth(t, s + zone * 0.04, s + zone * 0.5)
      const stamp = smooth(t, s + zone * 0.56, s + zone * 0.86)
      rows[i].style.setProperty("--in", post.toFixed(3))
      rows[i].style.setProperty("--stamp", stamp.toFixed(3))
      // the running total surges as each entry lands — five deterministic ticks
      acc += smooth(t, s + zone * 0.08, s + zone * 0.92)
    }

    // giant account-name watermark behind the sheet, crossfading per zone
    for (let i = 0; i < marks.length; i++) {
      const rise = i === 0 ? 1 : smooth(t, i * zone - 0.02, i * zone + 0.03)
      const fall = i === marks.length - 1 ? 0 : smooth(t, (i + 1) * zone - 0.03, (i + 1) * zone + 0.02)
      marks[i].style.setProperty("--o", (rise * (1 - fall)).toFixed(3))
    }

    // the ticking figure: deterministic, monotone in scroll, resolves to the
    // fixture total exactly (never a different number)
    if (totalEl) {
      const v = Math.round(LEDGER_TOTAL * (acc / N))
      const label = `$${v.toLocaleString("en-US")}`
      if (totalEl.textContent !== label) totalEl.textContent = label
    }

    // ENTRY 0X/05 readout
    if (countEl) {
      const idx = Math.min(N, Math.max(1, Math.floor(t * N) + 1))
      const label = `0${idx}`
      if (countEl.textContent !== label) countEl.textContent = label
    }
  }

  return drive(node, setVars)
}

/* ─────────────────────────── the audit opinion ─────────────────────────── */

export const opinion: Action<HTMLElement> = (node) => {
  const entries = Array.from(node.querySelectorAll<HTMLElement>("[data-jrow]"))

  const setVars = (g: number) => {
    node.style.setProperty("--ol", smooth(g, 0.03, 0.24).toFixed(4)) // AGENTS PROPOSE.
    node.style.setProperty("--or", smooth(g, 0.5, 0.68).toFixed(4)) // HUMANS APPROVE. (countersign)
    node.style.setProperty("--sig1", smooth(g, 0.14, 0.3).toFixed(4)) // agents' signature rule
    node.style.setProperty("--sig2", smooth(g, 0.62, 0.78).toFixed(4)) // human countersignature rule
    node.style.setProperty("--os", smooth(g, 0.8, 0.92).toFixed(4)) // sub-line

    // journal entries: staggered arrival, then verdict stamps
    const starts = [0.26, 0.36, 0.46]
    for (let i = 0; i < entries.length; i++) {
      const s = starts[i] ?? 0.46
      const arrive = smooth(g, s - 0.1, s)
      const stamp = smooth(g, s + 0.16, s + 0.26)
      entries[i].style.setProperty("--in", arrive.toFixed(3))
      entries[i].style.setProperty("--stamp", stamp.toFixed(3))
    }
  }

  return drive(node, setVars)
}
