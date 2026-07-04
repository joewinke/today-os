/**
 * /haoqi7 — content for the seventh alternate TodayOS landing page ("the film" cut).
 *
 * Same product story as the main LP, /haoqi, and /haoqi2: every claim below is
 * lifted VERBATIM from src/lib/haoqi2/copy.ts (itself verbatim from the main LP).
 * No new product claims are invented here — this file only reframes the same
 * sentences as a title sequence: stations become scenes, readouts become slates.
 */

export interface Scene {
  n: string
  verb: string
  line: string
  /** tiny mono readout shown on the scene's slate */
  read: string
}

/** FIND · PITCH · CLOSE · RUN · PROVE — the five scenes of the picture. */
export const SCENES: Scene[] = [
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
 * Proposals reviewed at the spend-cap gate, presented as a ratings card.
 * Labels are lifted from the live fixtures (same set the main LP's ticker uses);
 * the refused row is the "1 BLOCKED BY THE SPEND-CAP GATE" fixture.
 */
export const GATE_CHIPS: GateChip[] = [
  { label: "PAUSE — $6,180/MO · 21% OF SPEND · 0 CONVERSIONS", verdict: "approved", stamp: "APPROVED" },
  { label: "BUDGET-LIMITED · CONVERTING · RAISE CAP +30%", verdict: "approved", stamp: "APPROVED" },
  { label: "UNSAFE — EXCEEDS SPEND CAP", verdict: "refused", stamp: "REFUSED" },
]

/** The canonical one-sentence pitch, reused verbatim — the picture's logline. */
export const LEDE =
  "Find advertisers, pitch them with personalized video, run their accounts behind human gates, and prove the result on a ledger — the whole agency lifecycle in one operating system."

/** Honest-seam readout — same figures the main LP reports. */
export const FIXTURES = "FEED: SAMPLE DATA · $20,905/MO WASTE SURFACED · 25 RECS · 1 BLOCKED"
