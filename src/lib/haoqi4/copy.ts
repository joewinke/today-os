/**
 * /haoqi4 — content for the fourth alternate TodayOS landing page ("the blueprint" cut).
 *
 * Every product claim is re-exported VERBATIM from the /haoqi2 copy module
 * (the canonical pitch sentences) — this file adds only drawing-sheet
 * furniture: title-block cells, revision letters, exploded-view geometry.
 * Zero new claims.
 */
export { STATIONS, GATE_CHIPS, LEDE, FIXTURES } from "$lib/haoqi2/copy"
export type { Station, GateChip } from "$lib/haoqi2/copy"

export interface TitleBlockCell {
  k: string
  v: string
}

/** The drawing frame's title block — sheet metadata, drafting-standard style. */
export const TITLE_BLOCK: TitleBlockCell[] = [
  { k: "TITLE", v: "ACQUISITION ENGINE" },
  { k: "DRAWN", v: "TODAY OS" },
  { k: "SHEET", v: "1 OF 1" },
  { k: "SCALE", v: "1:1" },
  { k: "REV", v: "A" },
]

/** Revision letters for the approval-block revision table rows. */
export const REV_LETTERS = ["A", "B", "C"]

/**
 * Caption shown while the exploded parts converge — drafting language about
 * THIS drawing, not a product claim ("five moves, one system" is the hero
 * spec annotation from /haoqi2, reused).
 */
export const ASSEMBLY_CAPTION = {
  verb: "Assemble.",
  line: "Five moves, one system — the exploded parts converge into a single engine, and the sheet takes its stamp.",
}

/** Vertical scatter (px) of each exploded part before it converges to the datum. */
export const PART_LIFT = [-46, 38, 0, 42, -40]
