/**
 * /haoqi — vanilla scroll & pointer choreography for the alternate LP.
 *
 * No dependencies (no GSAP/lenis). Every effect drives ONLY transform / opacity
 * (and a <canvas> starburst). All listeners are passive + rAF-throttled, and each
 * action short-circuits to a static composition under prefers-reduced-motion.
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

/* ─────────────────────────── pointer parallax ───────────────────────────
   Child elements carrying [data-depth] drift opposite the cursor. Depth is a
   unitless multiplier (0 = pinned, 1 = ~24px of travel). */
export const parallax: Action<HTMLElement, number | undefined> = (node, strength = 1) => {
  const s = strength ?? 1
  if (reduced()) return {}

  const items = () => Array.from(node.querySelectorAll<HTMLElement>("[data-depth]"))
  let raf = 0
  let tx = 0
  let ty = 0

  const apply = () => {
    raf = 0
    for (const el of items()) {
      const d = parseFloat(el.dataset.depth || "0")
      el.style.transform = `translate3d(${(-tx * d * 24 * s).toFixed(1)}px, ${(-ty * d * 24 * s).toFixed(1)}px, 0)`
    }
  }
  const onMove = (e: MouseEvent) => {
    const r = node.getBoundingClientRect()
    tx = ((e.clientX - r.left) / r.width - 0.5) * 2
    ty = ((e.clientY - r.top) / r.height - 0.5) * 2
    if (!raf) raf = requestAnimationFrame(apply)
  }
  const onLeave = () => {
    for (const el of items()) el.style.transform = ""
  }

  node.addEventListener("mousemove", onMove, { passive: true })
  node.addEventListener("mouseleave", onLeave)
  return {
    destroy() {
      node.removeEventListener("mousemove", onMove)
      node.removeEventListener("mouseleave", onLeave)
      if (raf) cancelAnimationFrame(raf)
    },
  }
}

/* ─────────────────────────── hyperspace starburst ───────────────────────── */
interface Ray {
  angle: number
  r0: number
  len: number
  hue: number
  width: number
}

function makeRays(n: number): Ray[] {
  const rays: Ray[] = []
  for (let i = 0; i < n; i++) {
    rays.push({
      angle: (i / n) * Math.PI * 2 + (Math.random() - 0.5) * 0.22,
      r0: 0.015 + Math.random() * 0.05,
      len: 0.32 + Math.random() * 0.6,
      hue: Math.random() < 0.5 ? 194 : 278, // cyan | violet
      width: 0.5 + Math.random() * 1.6,
    })
  }
  return rays
}

function drawBurst(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  intensity: number,
  rays: Ray[],
  dpr: number,
) {
  ctx.clearRect(0, 0, w, h)
  if (intensity <= 0.001) return
  const cx = w / 2
  const cy = h / 2
  const maxR = Math.hypot(w, h) / 2
  const eased = intensity * intensity * (3 - 2 * intensity)
  ctx.globalCompositeOperation = "lighter"
  for (const ray of rays) {
    const cos = Math.cos(ray.angle)
    const sin = Math.sin(ray.angle)
    const rStart = ray.r0 * maxR
    const rEnd = maxR * (ray.r0 + ray.len * (0.12 + 0.88 * eased))
    const x0 = cx + cos * rStart
    const y0 = cy + sin * rStart
    const x1 = cx + cos * rEnd
    const y1 = cy + sin * rEnd
    const grad = ctx.createLinearGradient(x0, y0, x1, y1)
    const a = 0.05 + 0.6 * eased
    grad.addColorStop(0, `hsla(${ray.hue}, 92%, 66%, 0)`)
    grad.addColorStop(1, `hsla(${ray.hue}, 96%, 72%, ${a.toFixed(3)})`)
    ctx.strokeStyle = grad
    ctx.lineWidth = ray.width * dpr
    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)
    ctx.stroke()
  }
  // bright core bloom
  const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.28)
  core.addColorStop(0, `hsla(210, 100%, 82%, ${(0.5 * eased).toFixed(3)})`)
  core.addColorStop(1, "hsla(210, 100%, 82%, 0)")
  ctx.fillStyle = core
  ctx.fillRect(0, 0, w, h)
  ctx.globalCompositeOperation = "source-over"
}

/* ─────────────────────────── the pinned moment ───────────────────────────
   Attach to the tall (~300vh) wrapper. It owns the whole choreography: computes
   scroll progress p (0→1) across its own scroll length, writes CSS phase vars the
   scoped stylesheet reads (--p / --sweep / --head / --rel), and redraws the
   starburst <canvas[data-burst]> it contains. Reduced motion → one static frame. */
export const pinScene: Action<HTMLElement> = (node) => {
  const canvas = node.querySelector<HTMLCanvasElement>("canvas[data-burst]")
  const ctx = canvas?.getContext("2d") ?? null

  const setVars = (p: number) => {
    node.style.setProperty("--p", p.toFixed(4))
    node.style.setProperty("--sweep", smooth(p, 0.0, 0.34).toFixed(4))
    node.style.setProperty("--head", (smooth(p, 0.3, 0.46) * (1 - smooth(p, 0.82, 0.96))).toFixed(4))
    node.style.setProperty("--rel", smooth(p, 0.84, 1).toFixed(4))
  }

  let dpr = Math.min(window.devicePixelRatio || 1, 2)
  const resize = () => {
    if (!canvas) return
    const r = canvas.getBoundingClientRect()
    canvas.width = Math.max(1, Math.round(r.width * dpr))
    canvas.height = Math.max(1, Math.round(r.height * dpr))
  }

  // Burst is loudest through the middle of the pin.
  const burstOf = (p: number) => smooth(p, 0.26, 0.55) * (1 - smooth(p, 0.8, 0.98))

  if (reduced()) {
    resize()
    setVars(0.6)
    if (ctx && canvas) drawBurst(ctx, canvas.width, canvas.height, 0.5, makeRays(120), dpr)
    return {}
  }

  const rays = makeRays(150)
  let ticking = false
  let lastP = -1

  const progress = () => {
    const r = node.getBoundingClientRect()
    const total = r.height - window.innerHeight
    if (total <= 0) return 0
    return Math.min(Math.max(-r.top / total, 0), 1)
  }
  const frame = () => {
    ticking = false
    const p = progress()
    if (Math.abs(p - lastP) < 0.0008) return
    lastP = p
    setVars(p)
    if (ctx && canvas) drawBurst(ctx, canvas.width, canvas.height, burstOf(p), rays, dpr)
  }
  const onScroll = () => {
    if (!ticking) {
      ticking = true
      requestAnimationFrame(frame)
    }
  }
  const onResize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    resize()
    lastP = -1
    frame()
  }

  resize()
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
