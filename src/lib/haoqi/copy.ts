/**
 * /haoqi — content for the alternate TodayOS landing page.
 *
 * Same product story as the main LP (src/routes/+page.svelte), re-voiced for the
 * haoqi.design art-direction exploration. Copy references the canonical LP so the
 * two pages tell one story; this file exists only so the page template stays clean.
 */

export interface LifecycleMove {
  n: string
  verb: string
  line: string
  href: string
}

/** FIND · PITCH · CLOSE · RUN · PROVE — the five moves, one sentence each. */
export const MOVES: LifecycleMove[] = [
  {
    n: "01",
    verb: "Find",
    line: "Scan any site — ten live conversion checks, one score in ~2 seconds — then map the rest of that market into a prospect queue.",
    href: "/os",
  },
  {
    n: "02",
    verb: "Pitch",
    line: "One shoot becomes a personalized pitch video for every prospect — each with their own landing page and their own score.",
    href: "/os",
  },
  {
    n: "03",
    verb: "Close",
    line: "Work the pipeline board. Close a deal and that client's ad accounts light up in the console, themed to them.",
    href: "/os",
  },
  {
    n: "04",
    verb: "Run",
    line: "Agents audit spend on a cadence and propose fixes with dollar impact — a spend-cap gate refuses anything unsafe until a human approves.",
    href: "/os",
  },
  {
    n: "05",
    verb: "Prove",
    line: "Every approval ticks recovered waste onto the ledger. Each client gets a monthly report. Then read the thinking in the README.",
    href: "/os",
  },
]

/** Live red-flag findings — the marquee copy, lifted from the demo fixtures. */
export const FINDINGS: string[] = [
  "PAUSE — $6,180/MO · 21% OF SPEND · 0 CONVERSIONS",
  "FREQUENCY 4.7 — CREATIVE FATIGUE · REFRESH DUE",
  "QUALITY SCORE 3 — LANDING-PAGE MISMATCH",
  "TABOOLA — 14 PLACEMENTS · CLICKS · 0 CONV · BLOCK",
  "BUDGET-LIMITED · CONVERTING · RAISE CAP +30%",
  "DISAPPROVED AD SERVING — POLICY: UNSUPPORTED CLAIM",
]
