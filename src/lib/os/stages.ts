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
  { key: "pitch", label: "PITCH", blurb: "Personalized outreach video per prospect", href: "/studio" },
  { key: "close", label: "CLOSE", blurb: "Work the pipeline from prospect to won", href: "/os/pipeline" },
  { key: "run", label: "RUN", blurb: "Operate their ad accounts behind a gate", href: "/admin" },
  { key: "prove", label: "PROVE", blurb: "Waste recovered, results reported", href: "/os/prove" },
]

/** Which stage a pathname belongs to (for nav active state). */
export function stageForPath(path: string): string | null {
  const p = path.replace(/\/$/, "") || "/"
  if (p === "/os" || p === "/os/dashboard") return null // the home screen, not a stage
  if (p.startsWith("/funnel-score")) return "find"
  if (p.startsWith("/studio")) return "pitch"
  if (p.startsWith("/os/pipeline")) return "close"
  if (p.startsWith("/admin")) return "run"
  if (p.startsWith("/os/prove") || p.startsWith("/os/report")) return "prove"
  return null
}
