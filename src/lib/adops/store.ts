/**
 * store.ts — in-memory store for the Ad Ops demo (module singleton).
 *
 * Stands in for the production Postgres store: accounts (with cadence +
 * autonomy + spend caps), snapshots (yaml + json), recommendations, and an
 * append-only audit-event log. Seeded from fixtures on first import; state is
 * stashed on globalThis so dev-server HMR doesn't wipe the demo mid-click.
 *
 * The AUTONOMY GATE here mirrors production semantics exactly and FAILS
 * CLOSED:
 *   propose / approve  → manual_review (a human applies the change)
 *   auto without a cap → blocked (never apply without a spend ceiling)
 *   auto + cap + high  → manual_review (high risk is human-gated regardless)
 *   auto + cap         → eligible (the apply path itself is a designed seam —
 *                        adapters would execute here; this demo stops at the
 *                        verdict on purpose)
 */

import type { AdSpec, GateVerdict, Recommendation, RecommendationInput, RecSource } from "./types"
import { specToYaml } from "./types"
import { applyRedFlagChecks, detectedWasteCents } from "./redflags"
import { getLlmRecommendations, dedupeRecommendations } from "./recommend"
import { loadDoctrine } from "./doctrine"
import { ACCOUNT_SEEDS, buildFixtureSpec, FIXTURE_LLM_RECS, type AccountSeed, type Autonomy } from "./fixtures"

export type { Autonomy }

// ─── Shapes ──────────────────────────────────────────────────────────────────

export interface Account extends Omit<AccountSeed, "next_run_offset_hours"> {
  last_run_at: string | null
  next_run_at: string | null
}

export interface Snapshot {
  id: string
  account_id: string
  taken_at: string
  yaml: string
  spec: AdSpec
}

export type AuditEventKind = "seed" | "audit" | "sweep" | "rec_approved" | "rec_dismissed"

export interface AuditEvent {
  id: string
  at: string
  account_id: string | null
  kind: AuditEventKind
  message: string
}

export interface GateResult {
  verdict: GateVerdict
  reason: string
}

export interface AuditRunResult {
  account: Account
  snapshot: Snapshot
  recommendations: Recommendation[]
  redFlagCount: number
  llmCount: number
  via: "anthropic" | "fixture"
}

interface StoreState {
  accounts: Map<string, Account>
  snapshots: Snapshot[]
  recommendations: Recommendation[]
  events: AuditEvent[]
  seq: number
}

// ─── Singleton (HMR-safe) ────────────────────────────────────────────────────

const STASH = Symbol.for("itstoday.adops.store")

function createState(): StoreState {
  return { accounts: new Map(), snapshots: [], recommendations: [], events: [], seq: 0 }
}

const g = globalThis as unknown as { [STASH]?: StoreState }
const needsSeed = !g[STASH]
if (!g[STASH]) g[STASH] = createState()
const state: StoreState = g[STASH]
// Seed AFTER `state` is bound — performAudit (used by seed) closes over it.
if (needsSeed) seed(state)

function nextId(prefix: string): string {
  return `${prefix}-${(++state.seq).toString(36).padStart(4, "0")}`
}

function logEvent(kind: AuditEventKind, accountId: string | null, message: string, at = new Date().toISOString()) {
  state.events.push({ id: nextId("evt"), at, account_id: accountId, kind, message })
}

// ─── The autonomy gate (fail-closed) ─────────────────────────────────────────

export function evaluateAutoApplyGate(account: Account, rec?: Recommendation | RecommendationInput): GateResult {
  if (account.autonomy === "propose") {
    return {
      verdict: "manual_review",
      reason: "account autonomy is propose — every change waits for a human to apply it",
    }
  }
  if (account.autonomy === "approve") {
    return {
      verdict: "manual_review",
      reason: "account autonomy is approve — approval recorded; the apply step stays human",
    }
  }
  // autonomy === "auto"
  if (account.spend_cap_cents == null) {
    return {
      verdict: "blocked",
      reason: "auto without a spend cap fails closed — set a cap before the agent may apply anything",
    }
  }
  if (rec?.risk === "high") {
    return {
      verdict: "manual_review",
      reason: "high-risk changes are human-gated regardless of autonomy",
    }
  }
  return {
    verdict: "eligible",
    reason: `within the ${fmtCap(account.spend_cap_cents)} spend cap — apply path is a designed seam (adapter not wired in this demo)`,
  }
}

function fmtCap(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}`
}

// ─── Audit core ──────────────────────────────────────────────────────────────

function performAudit(
  account: Account,
  llmRecs: RecommendationInput[],
  via: "anthropic" | "fixture",
  now: Date,
): AuditRunResult {
  const nowIso = now.toISOString()
  const spec = buildFixtureSpec(account.id, nowIso)

  const snapshot: Snapshot = {
    id: nextId("snap"),
    account_id: account.id,
    taken_at: nowIso,
    yaml: specToYaml(spec),
    spec,
  }
  state.snapshots.push(snapshot)

  const redFlags = applyRedFlagChecks(spec)
  const redFlagSet = new Set<RecommendationInput>(redFlags)
  const merged = dedupeRecommendations([...redFlags, ...llmRecs])

  // Supersede the previous run's still-proposed recs so the inbox reflects
  // the latest snapshot (approved/dismissed history is kept).
  const before = state.recommendations.length
  state.recommendations = state.recommendations.filter(
    (r) => !(r.account_id === account.id && r.status === "proposed"),
  )
  const superseded = before - state.recommendations.length

  const persisted: Recommendation[] = merged.map((input) => ({
    ...input,
    id: nextId("rec"),
    account_id: account.id,
    status: "proposed",
    source: (redFlagSet.has(input) ? "red_flag" : "llm") as RecSource,
    created_at: nowIso,
  }))
  state.recommendations.push(...persisted)

  account.last_run_at = nowIso
  account.next_run_at = new Date(now.getTime() + account.cadence_hours * 3_600_000).toISOString()

  const llmSurvived = persisted.filter((r) => r.source === "llm").length
  logEvent(
    "audit",
    account.id,
    `audited ${account.name}: ${redFlags.length} red flags + ${llmRecs.length} llm (${via}) → ${persisted.length} proposed after dedupe` +
      (superseded > 0 ? `; superseded ${superseded} stale` : "") +
      (llmRecs.length !== llmSurvived ? `; ${llmRecs.length - llmSurvived} llm duplicate(s) lost to red flags` : ""),
    nowIso,
  )

  return {
    account,
    snapshot,
    recommendations: persisted,
    redFlagCount: redFlags.length,
    llmCount: llmRecs.length,
    via,
  }
}

/** Run one full audit: snapshot → red flags → llm lane → persist → reschedule. */
export async function runAudit(accountId: string): Promise<AuditRunResult> {
  const account = state.accounts.get(accountId)
  if (!account) throw new Error(`Unknown account: ${accountId}`)
  if (!account.enabled) throw new Error(`Account ${accountId} is disabled`)

  const now = new Date()
  const spec = buildFixtureSpec(accountId, now.toISOString())
  const { recs: llmRecs, via } = await getLlmRecommendations(spec, loadDoctrine(account.provider), accountId)
  return performAudit(account, llmRecs, via, now)
}

/** Accounts whose next_run_at is due at `now` (the cron predicate). */
export function listDue(now: Date = new Date()): Account[] {
  const t = now.getTime()
  return [...state.accounts.values()].filter(
    (a) => a.enabled && a.next_run_at != null && new Date(a.next_run_at).getTime() <= t,
  )
}

/** Simulated cron tick: drain every due account. */
export async function runSweep(): Promise<AuditRunResult[]> {
  const due = listDue()
  const results: AuditRunResult[] = []
  for (const account of due) {
    results.push(await runAudit(account.id))
  }
  logEvent(
    "sweep",
    null,
    due.length === 0
      ? "sweep tick: no accounts due"
      : `sweep tick: drained ${due.length} due account(s) — ${due.map((a) => a.name).join(", ")}`,
  )
  return results
}

// ─── Approve / dismiss ───────────────────────────────────────────────────────

export function approveRecommendation(recId: string): Recommendation {
  const rec = state.recommendations.find((r) => r.id === recId)
  if (!rec) throw new Error(`Unknown recommendation: ${recId}`)
  if (rec.status !== "proposed") throw new Error(`Recommendation ${recId} is already ${rec.status}`)
  const account = state.accounts.get(rec.account_id)
  if (!account) throw new Error(`Unknown account: ${rec.account_id}`)

  const gate = evaluateAutoApplyGate(account, rec)
  rec.status = "approved"
  rec.gate_verdict = gate.verdict
  rec.gate_reason = gate.reason
  logEvent("rec_approved", account.id, `approved "${rec.title}" → gate: ${gate.verdict} (${gate.reason})`)
  return rec
}

export function dismissRecommendation(recId: string): Recommendation {
  const rec = state.recommendations.find((r) => r.id === recId)
  if (!rec) throw new Error(`Unknown recommendation: ${recId}`)
  if (rec.status !== "proposed") throw new Error(`Recommendation ${recId} is already ${rec.status}`)
  rec.status = "dismissed"
  logEvent("rec_dismissed", rec.account_id, `dismissed "${rec.title}"`)
  return rec
}

// ─── Read API ────────────────────────────────────────────────────────────────

export function getAccounts(): Account[] {
  return [...state.accounts.values()]
}

export function getAccount(id: string): Account | undefined {
  return state.accounts.get(id)
}

export function getRecommendations(filter: { accountId?: string; status?: Recommendation["status"] } = {}): Recommendation[] {
  return state.recommendations.filter(
    (r) => (filter.accountId == null || r.account_id === filter.accountId) && (filter.status == null || r.status === filter.status),
  )
}

export function latestSnapshot(accountId: string): Snapshot | undefined {
  for (let i = state.snapshots.length - 1; i >= 0; i--) {
    if (state.snapshots[i].account_id === accountId) return state.snapshots[i]
  }
  return undefined
}

export function getSnapshots(accountId: string): Snapshot[] {
  return state.snapshots.filter((s) => s.account_id === accountId)
}

export function getEvents(accountId?: string): AuditEvent[] {
  const events = accountId ? state.events.filter((e) => e.account_id === accountId) : state.events
  return [...events].reverse() // newest first
}

export interface OverviewStats {
  accounts: number
  accountsDue: number
  proposed: number
  approved: number
  wasteCentsMonthly: number
  lastSweepAt: string | null
}

export function getStats(): OverviewStats {
  const open = state.recommendations.filter((r) => r.status === "proposed" || r.status === "approved")
  const lastAudit = [...state.events].reverse().find((e) => e.kind === "audit" || e.kind === "sweep")
  return {
    accounts: state.accounts.size,
    accountsDue: listDue().length,
    proposed: state.recommendations.filter((r) => r.status === "proposed").length,
    approved: state.recommendations.filter((r) => r.status === "approved").length,
    wasteCentsMonthly: detectedWasteCents(open),
    lastSweepAt: lastAudit?.at ?? null,
  }
}

/** Test hook: reset + reseed the singleton in place. */
export function __resetStoreForTests(): void {
  state.accounts = new Map()
  state.snapshots = []
  state.recommendations = []
  state.events = []
  state.seq = 0
  seed(state)
}

// ─── Seed ────────────────────────────────────────────────────────────────────

function seed(s: StoreState) {
  const now = new Date()
  for (const seedRow of ACCOUNT_SEEDS) {
    const { next_run_offset_hours, ...rest } = seedRow
    s.accounts.set(seedRow.id, {
      ...rest,
      last_run_at: null,
      next_run_at: new Date(now.getTime() + next_run_offset_hours * 3_600_000).toISOString(),
    })
  }
  s.events.push({
    id: `evt-${(++s.seq).toString(36).padStart(4, "0")}`,
    at: now.toISOString(),
    account_id: null,
    kind: "seed",
    message: `seeded ${ACCOUNT_SEEDS.length} accounts from fixtures (in-memory store, no DB)`,
  })

  // Pre-run ONE account (TikTok, autonomy=propose) so the inbox and account
  // detail have content on first load; Google + Meta stay overdue so the
  // "Run sweep" demo has accounts to drain. Uses the fixture LLM lane
  // directly — seeding never makes a network call.
  const tiktok = s.accounts.get("acct-tiktok")
  if (tiktok) {
    // performAudit reads the module-level `state`, which is `s` here — the
    // seed call happens after g[STASH] is assigned.
    performAudit(tiktok, FIXTURE_LLM_RECS["acct-tiktok"] ?? [], "fixture", now)
  }
}
