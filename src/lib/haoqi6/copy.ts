/**
 * /haoqi6 — content for the sixth alternate TodayOS landing page ("the radar" cut).
 *
 * Same product story as the main LP (src/routes/+page.svelte), /haoqi and /haoqi2:
 * every claim below is copied VERBATIM from src/lib/haoqi2/copy.ts — no new claims.
 * This file adds only scene fixtures (fixed contact bearings/ranges) so the scope
 * renders deterministically on the server and the client.
 */

export interface Station {
  n: string
  verb: string
  line: string
  /** tiny mono readout shown in the scope callout + sequence rail */
  read: string
}

/** FIND · PITCH · CLOSE · RUN · PROVE — the five stages of the intercept. */
export const STATIONS: Station[] = [
  {
    n: "01",
    verb: "Find",
    line: "Scan any site — ten live conversion checks, one score in ~2 seconds — then map the rest of that market into a prospect queue.",
    read: "SCORE IN ~2S",
  },
  {
    n: "02",
    verb: "Pitch",
    line: "One shoot becomes a personalized pitch video for every prospect — each with their own landing page and their own score.",
    read: "1 SHOOT → N VIDEOS",
  },
  {
    n: "03",
    verb: "Close",
    line: "Work the pipeline board. Close a deal and that client's ad accounts light up in the console, themed to them.",
    read: "ACCOUNTS LIGHT UP",
  },
  {
    n: "04",
    verb: "Run",
    line: "Agents audit spend on a cadence and propose fixes with dollar impact — a spend-cap gate refuses anything unsafe until a human approves.",
    read: "GATE ARMED",
  },
  {
    n: "05",
    verb: "Prove",
    line: "Every approval ticks recovered waste onto the ledger. Each client gets a monthly report.",
    read: "LEDGER +",
  },
]

export interface GateChip {
  label: string
  /** what the human at the gate decides */
  verdict: "approved" | "refused"
  stamp: string
}

/**
 * Proposals queuing at the spend-cap gate — staged here as authorization
 * requests at a weapons hold. Labels are lifted from the live fixtures (same
 * set the main LP's ticker uses); the refused row is the "1 BLOCKED BY THE
 * SPEND-CAP GATE" fixture the main LP reports.
 */
export const GATE_CHIPS: GateChip[] = [
  { label: "PAUSE — $6,180/MO · 21% OF SPEND · 0 CONVERSIONS", verdict: "approved", stamp: "APPROVED" },
  { label: "BUDGET-LIMITED · CONVERTING · RAISE CAP +30%", verdict: "approved", stamp: "APPROVED" },
  { label: "UNSAFE — EXCEEDS SPEND CAP", verdict: "refused", stamp: "REFUSED" },
]

/** The canonical one-sentence pitch, reused verbatim from the main LP. */
export const LEDE =
  "Find advertisers, pitch them with personalized video, run their accounts behind human gates, and prove the result on a ledger — the whole agency lifecycle in one operating system."

/** Honest-seam readout for the scope's data-source line — same figures the main LP reports. */
export const FIXTURES = "FEED: SAMPLE DATA · $20,905/MO WASTE SURFACED · 25 RECS · 1 BLOCKED"

/* ────────────────────────── scope fixtures (scene) ────────────────────────── */

export interface Contact {
  /** bearing in degrees from north, clockwise */
  b: number
  /** normalized range 0..1 (fraction of the outer ring) */
  r: number
}

/** The prospect the intercept sequence plays on. Fixed — deterministic SSR. */
export const TARGET: Contact = { b: 52, r: 0.62 }

/** Background traffic — the rest of the market, unscanned. Fixed constants. */
export const CONTACTS: Contact[] = [
  { b: 118, r: 0.78 },
  { b: 205, r: 0.55 },
  { b: 262, r: 0.83 },
  { b: 322, r: 0.4 },
  { b: 12, r: 0.86 },
  { b: 170, r: 0.3 },
]
