import { describe, it, expect } from "vitest"
import { ITSTODAY_SNAPSHOT, SNAPSHOT_HOSTS, hostKey } from "./snapshots"

describe("funnel-score flagship snapshot", () => {
  it("is a complete, real report (10 weighted checks summing to 100)", () => {
    expect(ITSTODAY_SNAPSHOT.checks).toHaveLength(10)
    const totalWeight = ITSTODAY_SNAPSHOT.checks.reduce((s, c) => s + c.weight, 0)
    expect(totalWeight).toBe(100)
    // score is the sum of awarded points, within range
    const points = ITSTODAY_SNAPSHOT.checks.reduce((s, c) => s + c.points, 0)
    expect(ITSTODAY_SNAPSHOT.score).toBe(points)
    expect(ITSTODAY_SNAPSHOT.score).toBeGreaterThan(0)
    expect(ITSTODAY_SNAPSHOT.score).toBeLessThanOrEqual(100)
  })

  it("resolves the flagship host with and without www", () => {
    expect(hostKey("https://itstoday.org")).toBe("itstoday.org")
    expect(hostKey("https://www.itstoday.org/")).toBe("itstoday.org")
    expect(SNAPSHOT_HOSTS.has(hostKey("https://itstoday.org"))).toBe(true)
    expect(SNAPSHOT_HOSTS.has(hostKey("https://www.itstoday.org/path"))).toBe(true)
  })

  it("does not claim non-flagship hosts", () => {
    expect(SNAPSHOT_HOSTS.has(hostKey("https://example.com"))).toBe(false)
    expect(hostKey("not a url")).toBe("")
  })

  it("has a fix-first list derived from its non-passing checks", () => {
    const nonPass = ITSTODAY_SNAPSHOT.checks.filter((c) => c.status !== "pass")
    expect(ITSTODAY_SNAPSHOT.fixFirst.length).toBe(nonPass.length)
  })
})
