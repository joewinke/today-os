/**
 * Today OS — the agency's lifecycle as the information architecture.
 *
 * The product isn't a set of pages, it's a machine a performance-marketing firm
 * runs: FIND advertisers → PITCH them → CLOSE them → RUN their accounts → PROVE
 * the result. Those five verbs are the OS nav. Existing surfaces slot in as the
 * tool for a stage (scan = FIND, studio = PITCH, ad-ops = RUN); CLOSE and PROVE
 * are OS-native surfaces (pipeline board, results ledger).
 *
 * Pure + client-safe config (no server imports) so the shell nav can import it.
 */

export interface Stage {
  key: string
  /** Nav label — the team's verb. */
  label: string
  /** One-line description of what happens here. */
  blurb: string
  /** The surface this stage opens. */
  href: string
}

export const STAGES: Stage[] = [
  { key: "find", label: "FIND", blurb: "Scan a site, score it, map its market", href: "/funnel-score" },
  { key: "pitch", label: "PITCH", blurb: "Personalized outreach video per prospect", href: "/os/outreach" },
  { key: "close", label: "CLOSE", blurb: "Work the pipeline from prospect to won", href: "/os/pipeline" },
  { key: "run", label: "RUN", blurb: "Operate their ad accounts behind a gate", href: "/admin" },
  { key: "prove", label: "PROVE", blurb: "Waste recovered, results reported", href: "/os/prove" },
]

// ── Cockpit chrome routing (seam #2: lift the shell to the root layout) ───────
// The operator app-shell (Sidebar + OperatorGate) mounts at the ROOT layout and
// renders only on operator surfaces — so the sidebar persists across /os, Ad Ops,
// and Studio as one app. Client-facing surfaces (/, /p, /report) never get it.

/** Operator surfaces that FORCE the OperatorGate ("Continue as Matt") when the
 *  operator hasn't entered yet — the "login moment". */
export function gatedRoute(path: string): boolean {
  const p = path.replace(/\/$/, "") || "/"
  return (
    p === "/os" || p.startsWith("/os/") || p === "/admin" || p.startsWith("/admin/") || p === "/studio" || p.startsWith("/studio/")
  )
}

/** Surfaces that show cockpit chrome once the operator has entered. Includes the
 *  dual-seat /funnel-score (prospect seat from the marketing scan, operator seat
 *  as the cockpit's FIND tool) — it shows the sidebar only when chosen and NEVER
 *  forces the gate, so the golden path's first step stays clean for visitors. */
export function cockpitRoute(path: string): boolean {
  const p = path.replace(/\/$/, "") || "/"
  return gatedRoute(p) || p === "/funnel-score" || p.startsWith("/funnel-score")
}

/** Which stage a pathname belongs to (for nav active state). */
export function stageForPath(path: string): string | null {
  const p = path.replace(/\/$/, "") || "/"
  if (p === "/os" || p === "/os/dashboard") return null // the home screen, not a stage
  if (p.startsWith("/funnel-score")) return "find"
  if (p.startsWith("/os/outreach") || p.startsWith("/studio")) return "pitch"
  if (p.startsWith("/os/pipeline")) return "close"
  if (p.startsWith("/admin")) return "run"
  if (p.startsWith("/os/prove") || p.startsWith("/os/report")) return "prove"
  return null
}
