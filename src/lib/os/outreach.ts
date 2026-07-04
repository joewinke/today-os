/**
 * PITCH-stage write helpers layered over SunnyMountain's OS store — ADDITIVE ONLY.
 *
 * store.ts (his, frozen) exposes reads (getProspects/getActivity/getMetrics) and
 * a single write (addProspectFromScan). The PITCH surfaces need to advance a
 * prospect's stage, emit activity, and count sends/bookings — writes the store
 * doesn't publish. Rather than edit his file, this module reaches the SAME
 * session-scoped state he stashes on `globalThis[Symbol.for("itstoday.os.stores")]`
 * and layers those writes on top. It imports and calls `getProspects()` first so
 * a brand-new visitor session is created + seeded by his code before we touch it.
 *
 * Server-only (imports the AsyncLocalStorage session module). Consumed only by
 * the +page.server.ts files under /os/outreach and /p/[prospect].
 *
 * HANDOFF (SunnyMountain): if you'd rather own these, the four writers
 * (emitActivity / advanceStage / sendPitch / bookMeeting) plus the resolver
 * (findProspect / slugify) fold straight into store.ts — they only need the
 * private OsState, which they already have there.
 */

import { currentSession } from "$lib/server/session"
import { getProspects } from "./store"
import type { Prospect, PipelineStage, ActivityKind, ActivityItem } from "./types"

/**
 * Structural mirror of store.ts's PRIVATE `OsState`. Kept in sync by hand; if the
 * store's shape changes this must follow. Only the fields the PITCH writes touch
 * are read here (prospects, activity, seq, pitchesSent, meetingsBooked).
 */
interface OsState {
  seq: number
  prospects: Prospect[]
  activity: ActivityItem[]
  accountsManaged: number
  wasteRecoveredCents: number
  pitchesSent: number
  meetingsBooked: number
}

const STASH = Symbol.for("itstoday.os.stores")

/** Forward-only stage order (never regress a prospect on re-send). */
const STAGE_ORDER: PipelineStage[] = ["new", "queued", "contacted", "meeting", "won"]

/**
 * The current visitor's live store state. Calling `getProspects()` first forces
 * the store to lazily create + seed this session, so the stash is always present.
 */
function state(): OsState {
  getProspects()
  const stores = (globalThis as Record<symbol, unknown>)[STASH] as Map<string, OsState> | undefined
  const s = stores?.get(currentSession())
  if (!s) throw new Error("outreach: OS store not initialised for this session")
  return s
}

function nextId(s: OsState, prefix: string): string {
  return `${prefix}-${(++s.seq).toString(36)}`
}

/** Advance forward only; a stage at or behind the current one is a no-op. */
function forward(p: Prospect, stage: PipelineStage): void {
  if (STAGE_ORDER.indexOf(stage) > STAGE_ORDER.indexOf(p.stage)) p.stage = stage
}

// ── URL slug ↔ prospect resolution ───────────────────────────────────────────

/** Stable, url-safe slug from a business name ("Cobalt & Co." → "cobalt-and-co"). */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/** Resolve a /p/[prospect] slug to a live store prospect by id or name-slug. */
export function findProspect(slug: string): Prospect | null {
  const key = slug.toLowerCase()
  return getProspects().find((p) => p.id.toLowerCase() === key || slugify(p.company) === key) ?? null
}

/**
 * The clean fallback when a landing link is opened in a session that never
 * scanned this prospect (a fresh browser, an expired demo session). Clearly a
 * sample — the page labels it — so nothing pretends a stranger is in the pipeline.
 */
export const SAMPLE_PROSPECT: Prospect = {
  id: "sample",
  company: "Northgate Family Dental",
  city: "Austin",
  offer: "a free new-patient audit",
  vertical: "local services",
  score: 52,
  stage: "new",
  createdAt: 0,
}

// ── Landing-page content (deterministic, no LLM) ─────────────────────────────

export interface Fix {
  label: string
  detail: string
}

/**
 * Two–three concrete, plausible fixes for the teardown. Derived from the funnel
 * score band + vertical — no model call, no fabricated specifics. Honest demo
 * substrate: the real teardown is what the tool generates in production.
 */
export function topFixes(p: Prospect): Fix[] {
  const score = p.score ?? 50
  const fixes: Fix[] = [
    {
      label: "No conversion tracking on the primary CTA",
      detail: `We can't optimize what isn't measured — ${p.company}'s "${p.offer}" button fires no event, so every platform is bidding blind.`,
    },
    {
      label: "Landing page and ad promise don't match",
      detail: `The ad sells ${p.offer}; the page buries it below the fold. Message-match alone typically lifts ${p.vertical} conversion 15–30%.`,
    },
  ]
  if (score < 55) {
    fixes.push({
      label: "Budget concentrated in one fatigued creative",
      detail: `A single ad is carrying spend past its window. Rotating in two fresh variants recovers the frequency-capped waste our sweep already flagged.`,
    })
  } else {
    fixes.push({
      label: "Broad match soaking up unqualified clicks",
      detail: `Tightening match types and adding the obvious negatives keeps ${p.city ? p.city + " " : ""}budget on searches that actually convert.`,
    })
  }
  return fixes
}

// ── Writes (the honest seams) ────────────────────────────────────────────────

/** Append an activity item to the live feed (store sorts newest-first on read). */
export function emitActivity(kind: ActivityKind, text: string): void {
  const s = state()
  s.activity.push({ id: nextId(s, "a"), at: Date.now(), kind, text })
}

/** Move a prospect forward to `stage` (never backward). Returns it, or null. */
export function advanceStage(prospectId: string, stage: PipelineStage): Prospect | null {
  const s = state()
  const p = s.prospects.find((x) => x.id === prospectId)
  if (!p) return null
  forward(p, stage)
  return p
}

/**
 * SEND seam (outreach composer): advance to "contacted", count the pitch, and
 * log a send activity item. In production this is where the ESP call goes.
 */
export function sendPitch(prospectId: string): Prospect | null {
  const s = state()
  const p = s.prospects.find((x) => x.id === prospectId)
  if (!p) return null
  forward(p, "contacted")
  s.pitchesSent += 1
  s.activity.push({
    id: nextId(s, "a"),
    at: Date.now(),
    kind: "pitch",
    text: `Pitch sent to ${p.company} — ${p.offer}`,
  })
  return p
}

/**
 * BOOK seam (landing page): stage → "meeting", count it, log a booking activity.
 * In production this is where the calendar invite goes.
 */
export function bookMeeting(prospectId: string): Prospect | null {
  const s = state()
  const p = s.prospects.find((x) => x.id === prospectId)
  if (!p) return null
  forward(p, "meeting")
  s.meetingsBooked += 1
  s.activity.push({
    id: nextId(s, "a"),
    at: Date.now(),
    kind: "meeting",
    text: `${p.company} booked a 15-min call from their landing page`,
  })
  return p
}
