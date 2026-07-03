/**
 * Ad Ops engine tests — red flags, YAML round-trip, dedupe precedence,
 * defensive LLM parsing, and the fail-closed auto-apply gate matrix.
 */

import { describe, it, expect, beforeAll, beforeEach } from "vitest"
import { specToYaml, specFromYaml, type RecommendationInput } from "./types"
import { applyRedFlagChecks, detectedWasteCents } from "./redflags"
import { parseRecommendations, dedupeRecommendations, buildRecommendationPrompt } from "./recommend"
import { buildFixtureSpec, buildCleanSpec, ACCOUNT_SEEDS, FIXTURE_LLM_RECS } from "./fixtures"
import { loadDoctrine } from "./doctrine"
import {
  __resetStoreForTests,
  getAccounts,
  getAccount,
  getRecommendations,
  getEvents,
  getStats,
  latestSnapshot,
  listDue,
  runAudit,
  runSweep,
  approveRecommendation,
  dismissRecommendation,
  evaluateAutoApplyGate,
  type Account,
} from "./store"

// Force the fixture LLM lane in tests, regardless of the host environment.
beforeAll(() => {
  delete process.env.ANTHROPIC_API_KEY
})

const NOW = "2026-07-03T12:00:00.000Z"

function ruleIds(recs: RecommendationInput[]): string[] {
  return recs.map((r) => String(r.proposed_change["rule_id"]))
}

// ─── YAML round-trip ─────────────────────────────────────────────────────────

describe("AdSpec YAML round-trip", () => {
  for (const seed of ACCOUNT_SEEDS) {
    it(`round-trips the ${seed.provider} fixture spec`, () => {
      const spec = buildFixtureSpec(seed.id, NOW)
      const roundTripped = specFromYaml(specToYaml(spec))
      expect(roundTripped).toEqual(spec)
    })
  }

  it("rejects YAML that is not an AdSpec", () => {
    expect(() => specFromYaml("just: a\nrandom: doc")).toThrow()
    expect(() => specFromYaml("plain scalar")).toThrow()
  })
})

// ─── Red flags — fire on violations, silent on clean ─────────────────────────

describe("applyRedFlagChecks", () => {
  it("finds all 6 planted Google Ads violations (and no more)", () => {
    const recs = applyRedFlagChecks(buildFixtureSpec("acct-google", NOW))
    const ids = ruleIds(recs)
    expect(ids).toContain("gads-spend-zero-conversions")
    expect(ids).toContain("gads-budget-limited-converting")
    expect(ids).toContain("gads-premature-smart-bidding")
    expect(ids).toContain("gads-adgroup-single-ad")
    expect(ids).toContain("gads-zero-impression-keyword")
    expect(ids).toContain("gads-low-quality-score-spend")
    expect(recs).toHaveLength(6)

    const pause = recs.find((r) => r.type === "pause")!
    expect(pause.target_external_id).toBe("c-g2")
    expect(pause.risk).toBe("high")
    // Evidence: rationale carries the real spend number.
    expect(pause.rationale).toContain("$6,180")
  })

  it("finds all 5 planted Meta violations", () => {
    const recs = applyRedFlagChecks(buildFixtureSpec("acct-meta", NOW))
    const ids = ruleIds(recs)
    expect(ids).toContain("meta-spend-zero-conversions")
    expect(ids).toContain("meta-high-frequency")
    expect(ids).toContain("meta-stale-creative")
    expect(ids).toContain("meta-disapproved-ad")
    expect(ids).toContain("meta-low-ctr-high-impressions")
    expect(recs).toHaveLength(5)

    const freq = recs.find((r) => ruleIds([r])[0] === "meta-high-frequency")!
    expect(freq.target_external_id).toBe("c-m2")
    expect(freq.rationale).toContain("6.8")
  })

  it("finds all 4 planted Taboola violations", () => {
    const recs = applyRedFlagChecks(buildFixtureSpec("acct-taboola", NOW))
    const ids = ruleIds(recs)
    expect(ids).toContain("tab-spend-zero-conversions")
    expect(ids).toContain("tab-clicks-no-conversions")
    expect(ids).toContain("tab-low-ctr-high-impressions")
    expect(ids).toContain("tab-single-creative")
    expect(recs).toHaveLength(4)

    const placements = recs.find((r) => ruleIds([r])[0] === "tab-clicks-no-conversions")!
    expect(placements.rationale).toContain("9,880")
  })

  it("finds all 4 planted TikTok violations", () => {
    const recs = applyRedFlagChecks(buildFixtureSpec("acct-tiktok", NOW))
    const ids = ruleIds(recs)
    expect(ids).toContain("tt-spend-zero-conversions")
    expect(ids).toContain("tt-premature-cost-cap")
    expect(ids).toContain("tt-stale-creative")
    expect(ids).toContain("tt-adgroup-single-ad")
    expect(recs).toHaveLength(4)

    const stale = recs.find((r) => ruleIds([r])[0] === "tt-stale-creative")!
    expect(stale.target_external_id).toBe("ad-k1a-2")
    expect(stale.rationale).toContain("48 days")
  })

  it("fires NOTHING on a clean spec", () => {
    expect(applyRedFlagChecks(buildCleanSpec(NOW))).toHaveLength(0)
  })

  it("flags account-level missing conversion tracking when spend > 0 and conversions == 0", () => {
    const spec = buildCleanSpec(NOW)
    spec.metrics.rows = spec.metrics.rows.map((r) => ({ ...r, conversions: 0 }))
    const ids = ruleIds(applyRedFlagChecks(spec))
    expect(ids).toContain("gads-no-conversion-tracking")
  })

  it("carries monthly-normalized waste on pause flags", () => {
    const recs = applyRedFlagChecks(buildFixtureSpec("acct-google", NOW))
    // c-g2: $6,180 over 30 days → ~$6,262/mo (× 30.4/30)
    expect(detectedWasteCents(recs)).toBe(Math.round((618_000 / 30) * 30.4))
  })
})

// ─── LLM lane: prompt, defensive parse, dedupe precedence ────────────────────

describe("buildRecommendationPrompt", () => {
  it("includes doctrine text and the YAML snapshot", () => {
    const spec = buildFixtureSpec("acct-google", NOW)
    const { system, user } = buildRecommendationPrompt(spec, loadDoctrine("google_ads"))
    expect(system).toContain("senior paid-media strategist")
    expect(user).toContain("RED FLAGS")
    expect(user).toContain("Medicare Advantage — Search — Broad — US")
  })
})

describe("parseRecommendations", () => {
  const valid = {
    type: "pause",
    target_level: "campaign",
    target_external_id: "c-1",
    title: "t",
    rationale: "r",
    proposed_change: { action: "pause_campaign" },
    risk: "high",
  }

  it("accepts a {recommendations: [...]} wrapper", () => {
    expect(parseRecommendations(JSON.stringify({ recommendations: [valid] }))).toHaveLength(1)
  })

  it("accepts a bare array and strips code fences", () => {
    expect(parseRecommendations("```json\n" + JSON.stringify([valid]) + "\n```")).toHaveLength(1)
  })

  it("returns [] on garbage and empty input", () => {
    expect(parseRecommendations("not json at all")).toEqual([])
    expect(parseRecommendations("")).toEqual([])
    expect(parseRecommendations('{"recommendations": "nope"}')).toEqual([])
  })

  it("drops invalid elements but keeps valid ones", () => {
    const mixed = [valid, { ...valid, risk: "catastrophic" }, { title: "missing everything" }]
    expect(parseRecommendations(JSON.stringify(mixed))).toHaveLength(1)
  })
})

describe("dedupeRecommendations", () => {
  it("red flags win over duplicate LLM recs (earlier entry wins)", () => {
    const redFlag: RecommendationInput = {
      type: "pause",
      target_level: "campaign",
      target_external_id: "c-m3",
      title: "RED FLAG",
      rationale: "deterministic",
      proposed_change: { rule_id: "meta-spend-zero-conversions" },
      risk: "high",
    }
    const llmDupe = FIXTURE_LLM_RECS["acct-meta"].find(
      (r) => r.type === "pause" && r.target_external_id === "c-m3",
    )!
    expect(llmDupe).toBeTruthy() // the fixture plants this collision on purpose
    const merged = dedupeRecommendations([redFlag, llmDupe])
    expect(merged).toHaveLength(1)
    expect(merged[0].title).toBe("RED FLAG")
  })

  it("keeps distinct targets and types", () => {
    const a: RecommendationInput = {
      type: "pause",
      target_level: "campaign",
      target_external_id: "c-1",
      title: "a",
      rationale: "",
      proposed_change: {},
      risk: "high",
    }
    const b = { ...a, target_external_id: "c-2" }
    const c = { ...a, type: "budget_change" as const }
    expect(dedupeRecommendations([a, b, c])).toHaveLength(3)
  })
})

// ─── Doctrine markdown renderer ──────────────────────────────────────────────

describe("renderDoctrineHtml", () => {
  it("renders headings, bullets, and blockquotes; escapes raw HTML", async () => {
    const { renderDoctrineHtml } = await import("./ui")
    const html = renderDoctrineHtml("# Title\n\n> A quote\n\n- item `code`\n\n<script>alert(1)</script>")
    expect(html).toContain("<h2>Title</h2>")
    expect(html).toContain("<blockquote>")
    expect(html).toContain("<li>item <code>code</code></li>")
    expect(html).not.toContain("<script>")
    expect(html).toContain("&lt;script&gt;")
  })

  it("renders every doctrine file with a RED FLAGS section", () => {
    for (const provider of ["google_ads", "meta_ads", "taboola", "tiktok_ads"] as const) {
      expect(loadDoctrine(provider)).toContain("## RED FLAGS")
    }
  })
})

// ─── Autonomy gate — fail-closed matrix ──────────────────────────────────────

describe("evaluateAutoApplyGate (fail-closed)", () => {
  const base: Account = {
    id: "x",
    provider: "google_ads",
    name: "X",
    external_id: "x",
    autonomy: "propose",
    cadence_hours: 12,
    spend_cap_cents: null,
    enabled: true,
    last_run_at: null,
    next_run_at: null,
  }
  const lowRisk = { risk: "low" } as never
  const highRisk = { risk: "high" } as never

  it("propose → manual_review", () => {
    expect(evaluateAutoApplyGate({ ...base, autonomy: "propose" }, lowRisk).verdict).toBe("manual_review")
  })

  it("approve → manual_review (even with a cap)", () => {
    expect(evaluateAutoApplyGate({ ...base, autonomy: "approve", spend_cap_cents: 50_000 }, lowRisk).verdict).toBe(
      "manual_review",
    )
  })

  it("auto WITHOUT a spend cap → blocked (the fail-closed case)", () => {
    const gate = evaluateAutoApplyGate({ ...base, autonomy: "auto", spend_cap_cents: null }, lowRisk)
    expect(gate.verdict).toBe("blocked")
    expect(gate.reason).toContain("fails closed")
  })

  it("auto + cap + HIGH risk → manual_review (risk gate beats autonomy)", () => {
    expect(evaluateAutoApplyGate({ ...base, autonomy: "auto", spend_cap_cents: 100_000 }, highRisk).verdict).toBe(
      "manual_review",
    )
  })

  it("auto + cap + low risk → eligible, with the apply seam named", () => {
    const gate = evaluateAutoApplyGate({ ...base, autonomy: "auto", spend_cap_cents: 100_000 }, lowRisk)
    expect(gate.verdict).toBe("eligible")
    expect(gate.reason).toContain("$1,000")
  })
})

// ─── Store integration ───────────────────────────────────────────────────────

describe("store", () => {
  beforeEach(() => {
    __resetStoreForTests()
  })

  it("seeds 4 accounts and pre-runs the TikTok account", () => {
    expect(getAccounts()).toHaveLength(4)
    const tiktok = getAccount("acct-tiktok")!
    expect(tiktok.last_run_at).not.toBeNull()
    expect(getRecommendations({ accountId: "acct-tiktok", status: "proposed" }).length).toBeGreaterThan(0)
    expect(latestSnapshot("acct-tiktok")).toBeTruthy()
  })

  it("listDue returns the overdue accounts (google + meta), not the pre-run/future ones", () => {
    const due = listDue().map((a) => a.id).sort()
    expect(due).toEqual(["acct-google", "acct-meta"])
  })

  it("runAudit persists red-flag + llm recs, dedupes, and advances the schedule", async () => {
    const result = await runAudit("acct-meta")
    expect(result.via).toBe("fixture")
    expect(result.redFlagCount).toBe(5)
    expect(result.llmCount).toBe(3)
    // 5 red flags + 3 llm − 1 planted duplicate (pause c-m3) = 7 persisted
    expect(result.recommendations).toHaveLength(7)

    const pause = result.recommendations.find((r) => r.type === "pause" && r.target_external_id === "c-m3")!
    expect(pause.source).toBe("red_flag") // the red flag won the collision
    expect(pause.proposed_change["rule_id"]).toBe("meta-spend-zero-conversions")

    const account = getAccount("acct-meta")!
    expect(account.last_run_at).not.toBeNull()
    expect(new Date(account.next_run_at!).getTime()).toBeGreaterThan(Date.now())
    expect(listDue().map((a) => a.id)).not.toContain("acct-meta")
  })

  it("re-running an audit supersedes the previous run's proposed recs (no inbox pile-up)", async () => {
    await runAudit("acct-google")
    const first = getRecommendations({ accountId: "acct-google", status: "proposed" }).length
    await runAudit("acct-google")
    expect(getRecommendations({ accountId: "acct-google", status: "proposed" })).toHaveLength(first)
  })

  it("runSweep drains every due account and logs the tick", async () => {
    const results = await runSweep()
    expect(results.map((r) => r.account.id).sort()).toEqual(["acct-google", "acct-meta"])
    expect(listDue()).toHaveLength(0)
    expect(getEvents().some((e) => e.kind === "sweep")).toBe(true)
  })

  it("approve stamps the gate verdict; TikTok (propose) reads manual_review", () => {
    const rec = getRecommendations({ accountId: "acct-tiktok", status: "proposed" })[0]
    const approved = approveRecommendation(rec.id)
    expect(approved.status).toBe("approved")
    expect(approved.gate_verdict).toBe("manual_review")
    expect(() => approveRecommendation(rec.id)).toThrow() // no double-approve
  })

  it("approving on the auto-without-cap account (Taboola) reads blocked", async () => {
    await runAudit("acct-taboola")
    const lowRisk = getRecommendations({ accountId: "acct-taboola", status: "proposed" }).find(
      (r) => r.risk !== "high",
    )!
    const approved = approveRecommendation(lowRisk.id)
    expect(approved.gate_verdict).toBe("blocked")
  })

  it("approving a low-risk rec on the auto-with-cap account (Meta) reads eligible; high risk stays manual", async () => {
    await runAudit("acct-meta")
    const proposed = getRecommendations({ accountId: "acct-meta", status: "proposed" })
    const low = proposed.find((r) => r.risk !== "high")!
    const high = proposed.find((r) => r.risk === "high")!
    expect(approveRecommendation(low.id).gate_verdict).toBe("eligible")
    expect(approveRecommendation(high.id).gate_verdict).toBe("manual_review")
  })

  it("dismiss removes a rec from the proposed queue and logs it", () => {
    const rec = getRecommendations({ accountId: "acct-tiktok", status: "proposed" })[0]
    dismissRecommendation(rec.id)
    expect(getRecommendations({ accountId: "acct-tiktok", status: "proposed" }).map((r) => r.id)).not.toContain(rec.id)
    expect(getEvents("acct-tiktok").some((e) => e.kind === "rec_dismissed")).toBe(true)
  })

  it("stats reflect proposed counts and detected monthly waste", async () => {
    await runSweep()
    const stats = getStats()
    expect(stats.accounts).toBe(4)
    expect(stats.proposed).toBeGreaterThan(10)
    // google c-g2 + meta c-m3 pause flags carry monthly waste; tiktok pre-run adds c-k3
    expect(stats.wasteCentsMonthly).toBeGreaterThan(1_000_000) // > $10k/mo detected
    expect(stats.lastSweepAt).not.toBeNull()
  })
})
