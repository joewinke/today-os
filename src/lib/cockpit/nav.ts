/**
 * Canonical cockpit navigation config.
 *
 * Pure + client-safe (no server or Svelte imports) so it can be imported by the
 * shell, unit-tested, and reasoned about in isolation. `Sidebar.svelte` holds the
 * inline-SVG icon map keyed by `NavItem.icon`; keeping the icons out of this file
 * lets the config stay plain data.
 *
 * The three groups mirror the agency's operating reality:
 *   GROWTH      — winning new business (find → pitch → close)
 *   OPERATIONS  — running what's been won (the accounts, the studio, the proof)
 *   PLANNED     — ghost routes that exist but aren't wired to the substrate yet;
 *                 they navigate to honest "what we'd build next" panels.
 */

/** Icon identifiers — the Sidebar maps each to a stroke-based inline SVG. */
export type IconKey =
  | "dashboard"
  | "prospects"
  | "outreach"
  | "pipeline"
  | "adops"
  | "studio"
  | "ledger"
  | "doctrine"
  | "log"
  | "connections"
  | "billing"
  | "automations"
  | "team"
  | "ask"

export interface NavItem {
  label: string
  href: string
  icon: IconKey
  /** Ghost route — renders a PLANNED tick + subdued styling, still navigable. */
  planned?: boolean
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Growth",
    items: [
      { label: "Dashboard", href: "/os", icon: "dashboard" },
      { label: "Prospects", href: "/funnel-score", icon: "prospects" },
      { label: "Outreach", href: "/os/outreach", icon: "outreach" },
      { label: "Pipeline", href: "/os/pipeline", icon: "pipeline" },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Ad Ops", href: "/admin", icon: "adops" },
      { label: "Studio", href: "/studio", icon: "studio" },
      { label: "Ledger", href: "/os/prove", icon: "ledger" },
      { label: "Doctrine", href: "/admin/doctrine", icon: "doctrine" },
      { label: "Log", href: "/admin/log", icon: "log" },
    ],
  },
  {
    label: "Planned",
    items: [
      { label: "Connections", href: "/os/connections", icon: "connections", planned: true },
      { label: "Billing", href: "/os/billing", icon: "billing", planned: true },
      { label: "Automations", href: "/os/automations", icon: "automations", planned: true },
      { label: "Team", href: "/os/team", icon: "team", planned: true },
      { label: "Ask the OS", href: "/os/ask", icon: "ask", planned: true },
    ],
  },
]

/** Strip a trailing slash; an empty result normalizes to "/". */
function normalizePath(path: string): string {
  const p = (path || "/").replace(/\/+$/, "")
  return p === "" ? "/" : p
}

/** Every item across all groups, flattened. */
export function allNavItems(groups: NavGroup[] = NAV_GROUPS): NavItem[] {
  return groups.flatMap((g) => g.items)
}

/**
 * The single best-matching nav href for a pathname — the longest href that is
 * either an exact match or a path-segment prefix of `path`. "/os" (Dashboard) is
 * treated as exact-only so it never lights up on `/os/outreach` etc. Returns null
 * when nothing matches (e.g. a route with no nav entry).
 */
export function activeHref(path: string, groups: NavGroup[] = NAV_GROUPS): string | null {
  const p = normalizePath(path)
  let best: string | null = null
  for (const item of allNavItems(groups)) {
    const h = normalizePath(item.href)
    const matches = h === "/os" ? p === "/os" : p === h || p.startsWith(h + "/")
    if (matches && (best === null || h.length > best.length)) best = h
  }
  return best
}

/** Whether a given item is the active one for `path`. */
export function isNavItemActive(item: NavItem, path: string, groups: NavGroup[] = NAV_GROUPS): boolean {
  return normalizePath(item.href) === activeHref(path, groups)
}
