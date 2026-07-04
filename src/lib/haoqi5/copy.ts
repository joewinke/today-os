/**
 * /haoqi5 — content for the fifth alternate TodayOS landing page ("the ledger" cut).
 *
 * Copy discipline: every product claim is imported VERBATIM from the haoqi2
 * copy module (the canonical set — same sentences the main LP uses). This file
 * adds only presentation constants: the fixture figure decomposed into the
 * pieces the bottom-line treatment renders, and the numeric total the
 * scroll-driven counter resolves to. No new claims are invented here.
 */

export { STATIONS, GATE_CHIPS, LEDE, FIXTURES } from "$lib/haoqi2/copy"
export type { Station, GateChip } from "$lib/haoqi2/copy"

/**
 * The one figure the running total is allowed to resolve to — the same
 * $20,905/MO the FIXTURES line (and the main LP) reports. Dollars, no cents.
 */
export const LEDGER_TOTAL = 20905

/**
 * FIXTURES, decomposed for the hero's bottom-line block. Each piece is a
 * verbatim substring of the FIXTURES sentence — recomposed, they read exactly
 * as the main LP's honest seam does.
 */
export const BOTTOM_LINE = {
  feed: "FEED: SAMPLE DATA",
  amount: "$20,905",
  unit: "/MO WASTE SURFACED",
  recs: "25 RECS",
  blocked: "1 BLOCKED",
} as const

/** Closing posting line — same output line the machine cut prints. */
export const OUTPUT_LINE = "OUTPUT: CUSTOMER ACQUIRED"

/** The gate sub-line, reused verbatim from /haoqi2's creed section. */
export const GATE_SUB =
  "EVERY AGENT FIX PASSES A SPEND-CAP GATE — NOTHING UNSAFE SHIPS WITHOUT A HUMAN AT THE SWITCH."
