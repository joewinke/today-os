import { describe, expect, it } from "vitest"
import { NAV_GROUPS, allNavItems, activeHref, isNavItemActive } from "./nav"
import { OPERATOR_KEY, readOperatorChoice, writeOperatorChoice } from "./operator"

describe("nav config shape", () => {
  it("has the three canonical groups in order", () => {
    expect(NAV_GROUPS.map((g) => g.label)).toEqual(["Growth", "Operations", "Planned"])
  })

  it("has the expected item counts per group", () => {
    expect(NAV_GROUPS[0].items).toHaveLength(4) // Growth
    expect(NAV_GROUPS[1].items).toHaveLength(5) // Operations
    expect(NAV_GROUPS[2].items).toHaveLength(5) // Planned
  })

  it("marks every Planned item (and only those) as planned", () => {
    const planned = allNavItems().filter((i) => i.planned)
    expect(planned.map((i) => i.href)).toEqual([
      "/os/connections",
      "/os/billing",
      "/os/automations",
      "/os/team",
      "/os/ask",
    ])
    // No non-Planned item is flagged planned.
    expect(NAV_GROUPS[0].items.some((i) => i.planned)).toBe(false)
    expect(NAV_GROUPS[1].items.some((i) => i.planned)).toBe(false)
  })

  it("wires the growth + operations hrefs to real surfaces", () => {
    const byLabel = Object.fromEntries(allNavItems().map((i) => [i.label, i.href]))
    expect(byLabel["Dashboard"]).toBe("/os")
    expect(byLabel["Prospects"]).toBe("/funnel-score")
    expect(byLabel["Ad Ops"]).toBe("/admin")
    expect(byLabel["Ledger"]).toBe("/os/prove")
    expect(byLabel["Doctrine"]).toBe("/admin/doctrine")
    expect(byLabel["Log"]).toBe("/admin/log")
  })

  it("has unique hrefs and a defined icon for every item", () => {
    const hrefs = allNavItems().map((i) => i.href)
    expect(new Set(hrefs).size).toBe(hrefs.length)
    expect(allNavItems().every((i) => typeof i.icon === "string" && i.icon.length > 0)).toBe(true)
  })
})

describe("activeHref resolution", () => {
  it("treats /os (Dashboard) as exact-only", () => {
    expect(activeHref("/os")).toBe("/os")
    expect(activeHref("/os/outreach")).toBe("/os/outreach") // not /os
  })

  it("prefix-matches nested paths to their item", () => {
    expect(activeHref("/os/outreach/123")).toBe("/os/outreach")
    expect(activeHref("/admin/log/42")).toBe("/admin/log")
    expect(activeHref("/funnel-score")).toBe("/funnel-score")
  })

  it("picks the most specific (longest) matching href", () => {
    expect(activeHref("/admin")).toBe("/admin")
    expect(activeHref("/admin/doctrine")).toBe("/admin/doctrine")
    expect(activeHref("/admin/log")).toBe("/admin/log")
  })

  it("normalizes a trailing slash", () => {
    expect(activeHref("/os/")).toBe("/os")
    expect(activeHref("/admin/doctrine/")).toBe("/admin/doctrine")
  })

  it("returns null when nothing matches", () => {
    expect(activeHref("/p/cobalt-and-co")).toBeNull()
    expect(activeHref("/")).toBeNull()
  })
})

describe("isNavItemActive", () => {
  const dashboard = NAV_GROUPS[0].items[0]
  const adOps = NAV_GROUPS[1].items[0]

  it("lights Dashboard only on /os", () => {
    expect(isNavItemActive(dashboard, "/os")).toBe(true)
    expect(isNavItemActive(dashboard, "/os/outreach")).toBe(false)
  })

  it("lights Ad Ops on /admin but not its more-specific siblings", () => {
    expect(isNavItemActive(adOps, "/admin")).toBe(true)
    expect(isNavItemActive(adOps, "/admin/doctrine")).toBe(false)
  })
})

describe("operator gate helper", () => {
  function fakeStorage(): Storage {
    const m = new Map<string, string>()
    return {
      getItem: (k) => m.get(k) ?? null,
      setItem: (k, v) => void m.set(k, v),
      removeItem: (k) => void m.delete(k),
      clear: () => m.clear(),
      key: () => null,
      get length() {
        return m.size
      },
    } as Storage
  }

  it("returns null before a choice is made", () => {
    expect(readOperatorChoice(fakeStorage())).toBeNull()
  })

  it("round-trips a written role", () => {
    const s = fakeStorage()
    writeOperatorChoice(s, "operator")
    expect(s.getItem(OPERATOR_KEY)).toBe("operator")
    expect(readOperatorChoice(s)).toBe("operator")
  })

  it("ignores an unknown stored value", () => {
    const s = fakeStorage()
    s.setItem(OPERATOR_KEY, "banana")
    expect(readOperatorChoice(s)).toBeNull()
  })

  it("is null-safe when storage is unavailable", () => {
    expect(readOperatorChoice(null)).toBeNull()
    expect(() => writeOperatorChoice(null, "guest")).not.toThrow()
  })
})
