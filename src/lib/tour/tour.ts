/**
 * The guided tour spine.
 *
 * The demo is ONE flow with four payoffs — a live funnel SCORE, an autonomy
 * GATE that refuses a risky change, an on-theme VIDEO, and the README thinking.
 * Every tour surface renders the same persistent rail (see TourRail.svelte) so a
 * reviewer always knows which of the four stops they're on and the single next
 * thing to do. There is exactly one primary action per surface; everything else
 * is optional depth reachable from the rail's INDEX.
 *
 * This module is pure + client-safe (no server imports) so the rail can import
 * it directly.
 */

export interface RailNext {
  label: string
  href: string
}

export interface RailState {
  /** Current stop, 1..4 (0 = the pre-tour homepage "begin" state). */
  n: number
  total: number
  /** Milestone label shown in the rail pip. */
  label: string
  /** The single primary action to take on THIS surface. */
  here: string
  /** Where the rail's always-visible NEXT button leads (null at the end). */
  next: RailNext | null
}

/**
 * The four acts of the agency's funnel — HUNT → PITCH → OPERATE → the thinking.
 * The demo user is the performance-marketing firm: find advertisers, pitch them
 * with personalized video, then operate their accounts behind human gates.
 */
export const MILESTONES = ["SCAN", "OUTREACH", "OPERATE", "README"] as const

const TOTAL = 4

/**
 * Resolve the rail state for a pathname. Ordered most-specific-first so
 * `/admin/inbox` and `/studio/batch` win over their parents. Returns null for
 * paths that aren't part of the tour (the rail then doesn't render).
 */
export function railFor(path: string): RailState | null {
  const p = path.replace(/\/$/, "") || "/"

  if (p === "/")
    return { n: 0, total: TOTAL, label: "BEGIN", here: "Start the tour", next: { label: "Scan a site", href: "/funnel-score" } }

  // 1 · SCAN (hunt): score any site, then see the rest of its market as prospects.
  if (p.startsWith("/funnel-score"))
    return { n: 1, total: TOTAL, label: "SCAN", here: "Score a site — then see its market", next: { label: "Pitch the market → outreach", href: "/studio" } }

  // 2 · OUTREACH (pitch): personalized pitch videos to the prospect queue.
  if (p.startsWith("/studio/batch"))
    return { n: 2, total: TOTAL, label: "OUTREACH", here: "The outreach queue — one pitch, personalized per prospect", next: { label: "When they say yes → run their ads", href: "/admin" } }

  if (p.startsWith("/studio"))
    return { n: 2, total: TOTAL, label: "OUTREACH", here: "Record one pitch video for a prospect", next: { label: "Personalize per prospect → the queue", href: "/studio/batch" } }

  // 3 · OPERATE (close → run it): the audit + autonomy gate that the pitch sells.
  if (p.startsWith("/admin/inbox"))
    return { n: 3, total: TOTAL, label: "OPERATE", here: "Approve a change — watch the autonomy gate refuse it", next: { label: "Read the thinking", href: "/readme" } }

  if (p.startsWith("/admin"))
    return { n: 3, total: TOTAL, label: "OPERATE", here: "They said yes — audit + operate their ad accounts", next: { label: "Review the findings", href: "/admin/inbox" } }

  if (p.startsWith("/readme"))
    return { n: 4, total: TOTAL, label: "README", here: "The three answers the contest asks", next: null }

  return null
}

/** Free-roam INDEX targets — every surface, reachable without leaving the tour. */
export const INDEX_LINKS: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "1 · Scan + market", href: "/funnel-score" },
  { label: "2 · Outreach studio", href: "/studio" },
  { label: "2 · Outreach queue", href: "/studio/batch" },
  { label: "3 · Ad-ops console", href: "/admin" },
  { label: "3 · Approval inbox", href: "/admin/inbox" },
  { label: "4 · README", href: "/readme" },
]

const STARTED_KEY = "today-os-tour-started"

/** Mark the tour as started (persists across navigation, per browser). */
export function markTourStarted(): void {
  try {
    localStorage.setItem(STARTED_KEY, "1")
  } catch {
    /* private mode / storage disabled — the rail still renders on tour surfaces */
  }
  // Let the rail reveal itself immediately on the homepage, without a reload.
  try {
    window.dispatchEvent(new Event("today-os-tour-started"))
  } catch {
    /* SSR / no window */
  }
}

export function isTourStarted(): boolean {
  try {
    return localStorage.getItem(STARTED_KEY) === "1"
  } catch {
    return false
  }
}
