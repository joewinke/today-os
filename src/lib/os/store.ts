/**
 * Today OS operating state — in-memory, per-visitor, no DB.
 *
 * This is the "it's an OS, not a slideshow" layer: a dashboard of live operating
 * numbers, a pipeline of prospects, and an activity feed. It's seeded with
 * plausible fixture history so the business looks like it's already running, and
 * it updates from the visitor's own session actions (a scan adds a prospect, a
 * sweep logs activity, closing a deal grows accounts-under-management, approving
 * a pause recovers waste). Scoped per session via the same AsyncLocalStorage
 * `sid` the ad-ops store uses, so one visitor's demo never bleeds into another's.
 *
 * Honest seam: these numbers are a demo substrate. Real persistence, real
 * connectors, and real sends are the "what we'd build next" — see the README.
 */

import { currentSession } from "$lib/server/session"
import type { Prospect, PipelineStage, ActivityItem, ActivityKind, DashboardMetric } from "./types"

export type { Prospect, PipelineStage, ActivityItem, ActivityKind, DashboardMetric }
export { PIPELINE_STAGES } from "./types"

interface OsState {
  seq: number
  prospects: Prospect[]
  activity: ActivityItem[]
  /** Accumulators that session actions bump on top of the fixture baseline. */
  accountsManaged: number
  wasteRecoveredCents: number
  pitchesSent: number
  meetingsBooked: number
}

// ── Session-scoped singleton (HMR-safe, no DB) ──────────────────────────────
const STASH = Symbol.for("itstoday.os.stores")
const g = globalThis as unknown as { [STASH]?: Map<string, OsState> }
if (!g[STASH]) g[STASH] = new Map<string, OsState>()
const stores = g[STASH]

function getState(): OsState {
  const sid = currentSession()
  let s = stores.get(sid)
  if (!s) {
    s = createSeeded()
    stores.set(sid, s)
  }
  return s
}

const MIN = 60_000
const HOUR = 60 * MIN

/**
 * Seed a fresh session with a running-business baseline. Timestamps are relative
 * to "now" at seed time so the activity feed always reads as recent.
 */
function createSeeded(): OsState {
  const now = Date.now()
  let n = 0
  const id = (p: string) => `${p}-${(++n).toString(36)}`

  const prospects: Prospect[] = [
    { id: id("p"), company: "Cobalt & Co.", city: "Richmond", offer: "a free funnel audit", vertical: "performance marketing", score: 41, stage: "contacted", createdAt: now - 30 * HOUR },
    { id: id("p"), company: "Harbor Point Dental", city: "Annapolis", offer: "a free new-patient audit", vertical: "local services", score: 55, stage: "meeting", createdAt: now - 26 * HOUR },
    { id: id("p"), company: "Vantage Roofing", city: "Columbus", offer: "a free inspection", vertical: "home services", score: 38, stage: "queued", createdAt: now - 20 * HOUR },
    { id: id("p"), company: "Lumen Aesthetics", city: "Scottsdale", offer: "a free consult", vertical: "health & medicare", score: 62, stage: "won", createdAt: now - 72 * HOUR, spawnedAccounts: true },
    { id: id("p"), company: "Pike & Rowe Law", city: "Hartford", offer: "a free case review", vertical: "legal services", score: 47, stage: "won", createdAt: now - 96 * HOUR, spawnedAccounts: true },
  ]

  const activity: ActivityItem[] = [
    { id: id("a"), at: now - 4 * HOUR, kind: "sweep", text: "2:00 AM sweep audited 3 accounts — 4 recommendations queued" },
    { id: id("a"), at: now - 3 * HOUR - 20 * MIN, kind: "reply", text: "Dana at Harbor Point Dental watched 80% of her pitch video" },
    { id: id("a"), at: now - 2 * HOUR - 40 * MIN, kind: "gate", text: "Autonomy gate held a $6,180/mo pause for review — over the cap" },
    { id: id("a"), at: now - 2 * HOUR, kind: "meeting", text: "Meeting booked with Harbor Point Dental — Thursday 2:30 PM" },
    { id: id("a"), at: now - 80 * MIN, kind: "render", text: "Pitch variant rendered for Vantage Roofing" },
    { id: id("a"), at: now - 40 * MIN, kind: "pitch", text: "Outreach sequence sent to 5 prospects in the Richmond market" },
  ]

  return {
    seq: n,
    prospects,
    activity,
    accountsManaged: 7,
    wasteRecoveredCents: 4_820_000, // $48,200 recovered this month (fixture baseline)
    pitchesSent: 34,
    meetingsBooked: 6,
  }
}

// ── Reads ───────────────────────────────────────────────────────────────────

function money(cents: number): string {
  return `$${Math.round(cents / 100).toLocaleString("en-US")}`
}

export function getMetrics(): DashboardMetric[] {
  const s = getState()
  const open = s.prospects.filter((p) => p.stage !== "won").length
  return [
    { key: "pipeline", label: "Prospects in pipeline", value: String(open), sub: `${s.prospects.length} total` },
    { key: "accounts", label: "Accounts under management", value: String(s.accountsManaged) },
    { key: "waste", label: "Waste recovered", value: money(s.wasteRecoveredCents), sub: "this month" },
    { key: "pitches", label: "Pitches sent", value: String(s.pitchesSent), sub: "this month" },
    { key: "meetings", label: "Meetings booked", value: String(s.meetingsBooked), sub: "this month" },
  ]
}

export function getActivity(limit = 12): ActivityItem[] {
  return [...getState().activity].sort((a, b) => b.at - a.at).slice(0, limit)
}

export function getProspects(): Prospect[] {
  return [...getState().prospects].sort((a, b) => b.createdAt - a.createdAt)
}

// ── Writes (live updates from session actions; wired incrementally) ──────────

function log(kind: ActivityKind, text: string): void {
  const s = getState()
  s.activity.push({ id: `a-${(++s.seq).toString(36)}`, at: Date.now(), kind, text })
}

/** A scan drops a new prospect card onto the board (CLOSE stage). */
export function addProspectFromScan(input: { company: string; city: string; offer: string; vertical: string; score: number | null }): Prospect {
  const s = getState()
  const existing = s.prospects.find((p) => p.company.toLowerCase() === input.company.toLowerCase())
  if (existing) return existing
  const p: Prospect = { id: `p-${(++s.seq).toString(36)}`, ...input, stage: "new", createdAt: Date.now() }
  s.prospects.unshift(p)
  log("scan", `Scanned ${p.company}${p.score != null ? ` — scored ${p.score}/100` : ""}`)
  return p
}

export function getProspect(id: string): Prospect | null {
  return getState().prospects.find((p) => p.id === id) ?? null
}

/** Deterministic, believable "quick-scan" score for an illustrative peer — low-
 *  to-mid (they have the same leaky-funnel problem the pitch is built on). */
function quickScore(name: string): number {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return 34 + (h % 31) // 34–64
}

/**
 * The market map becomes the prospect queue: after a scan, the peers in the same
 * market land on the board, each quick-scanned to its own score so their landing
 * pages show a real number (illustrative — these are sample advertisers). Skips
 * peers already on the board.
 */
export function addMarketProspects(
  peers: { company: string; city: string; offer: string }[],
  vertical: string,
): void {
  const s = getState()
  let added = 0
  for (const peer of peers) {
    if (!peer.company) continue
    if (s.prospects.some((p) => p.company.toLowerCase() === peer.company.toLowerCase())) continue
    s.prospects.push({
      id: `p-${(++s.seq).toString(36)}`,
      company: peer.company,
      city: peer.city,
      offer: peer.offer,
      vertical,
      score: quickScore(peer.company),
      stage: "new",
      createdAt: Date.now(),
    })
    added++
  }
  if (added) log("scan", `Quick-scanned ${added} prospects across the ${vertical} market`)
}

/**
 * Move a prospect to a stage and fire the side effects that make the OS feel
 * alive: contacting bumps pitches-sent, booking a meeting bumps meetings, and
 * CLOSING-WON is THE HINGE — it spawns the client's ad accounts into RUN
 * (accounts-under-management ticks up; the caller themes RUN to this client).
 * Returns the prospect, or null if unknown / already there.
 */
export function moveProspect(id: string, stage: PipelineStage): Prospect | null {
  const s = getState()
  const p = s.prospects.find((x) => x.id === id)
  if (!p) return null
  const was = p.stage
  if (was === stage) return p
  p.stage = stage

  if (stage === "contacted") {
    s.pitchesSent += 1
    log("pitch", `Pitch sent to ${p.company}`)
  } else if (stage === "meeting") {
    s.meetingsBooked += 1
    log("meeting", `Meeting booked with ${p.company}`)
  } else if (stage === "won" && !p.spawnedAccounts) {
    p.spawnedAccounts = true
    s.accountsManaged += 1
    log("won", `Closed-won: ${p.company} — spawned their ad accounts into RUN`)
  }
  return p
}

/** Closed-won convenience — the hinge action. */
export function closeWon(id: string): Prospect | null {
  return moveProspect(id, "won")
}

/** Clients whose accounts are live in RUN (spawned by a close). */
export function getManagedClients(): Prospect[] {
  return getState().prospects.filter((p) => p.spawnedAccounts)
}

/**
 * PROVE: approving a waste-carrying rec in RUN recovers that monthly spend —
 * the ledger ticks up and the activity feed records it. `cents` is the rec's
 * waste_cents_monthly.
 */
export function recordWasteRecovered(cents: number, label?: string): void {
  if (!(cents > 0)) return
  const s = getState()
  s.wasteRecoveredCents += cents
  log("gate", `Recovered ${money(cents)}/mo in wasted spend${label ? ` — ${label}` : ""}`)
}

const NEXT_STAGE: Record<PipelineStage, PipelineStage | null> = {
  new: "queued",
  queued: "contacted",
  contacted: "meeting",
  meeting: "won",
  won: null,
}

/**
 * POLISH: compress a week of operation into one click. The overnight cadence
 * sweeps the managed accounts and recovers waste, the pipeline advances, and new
 * outreach goes out — so the dashboard visibly accumulates. Deterministic-ish
 * (varies by state) so repeated clicks keep moving without a firehose.
 */
export function advanceWeek(): void {
  const s = getState()

  // Overnight cadence recovered waste across managed accounts.
  const recovered = 180_000 + (s.accountsManaged * 62_000 + (s.seq % 7) * 24_000)
  s.wasteRecoveredCents += recovered
  log("sweep", `Weekly cadence: swept ${s.accountsManaged} accounts — recovered ${money(recovered)}/mo`)

  // Advance the two furthest-along open prospects one stage each.
  const open = s.prospects.filter((p) => p.stage !== "won").sort((a, b) => a.createdAt - b.createdAt)
  for (const p of open.slice(0, 2)) {
    const next = NEXT_STAGE[p.stage]
    if (!next) continue
    p.stage = next
    if (next === "meeting") {
      s.meetingsBooked += 1
      log("meeting", `Meeting booked with ${p.company}`)
    } else if (next === "won") {
      p.spawnedAccounts = true
      s.accountsManaged += 1
      log("won", `Closed-won: ${p.company} — accounts spawned into RUN`)
    }
  }

  // New outreach went out to the market.
  s.pitchesSent += 3
  log("pitch", "Outreach sequence sent to 3 new prospects this week")
}
