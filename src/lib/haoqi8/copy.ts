/**
 * /haoqi8 — content for the eighth alternate TodayOS landing page
 * ("the console cut, radar creed" — /haoqi3's console with /haoqi6's creed).
 *
 * Copy discipline: every PRODUCT CLAIM on this page is the exact sentence set
 * from src/lib/haoqi2/copy.ts (itself lifted verbatim from the main LP) — this
 * module re-exports that set untouched. What this file adds is console CHROME
 * only: boot-log labels — none of which carries a new product claim (figures
 * come from FIXTURES; phrases like "spend-cap gate", "ledger", "a human at the
 * switch" are lifted from the approved set).
 */
import { FIXTURES } from "$lib/haoqi2/copy"

export { STATIONS, GATE_CHIPS, LEDE, FIXTURES } from "$lib/haoqi2/copy"
export type { Station, GateChip } from "$lib/haoqi2/copy"

export interface BootLine {
  text: string
  /** right-aligned status stamp (BIOS/POST style); omit for header lines */
  ok?: string
}

/** The hero boot sequence — POST output resolving into the page's purpose. */
export const BOOT_LINES: BootLine[] = [
  { text: "TODAY OS v1 — CONSOLE BOOT" },
  { text: "MOUNTING LEDGER", ok: "OK" },
  { text: "ARMING SPEND-CAP GATE", ok: "OK" },
  { text: "LOADING PROCESS TABLE — FIND / PITCH / CLOSE / RUN / PROVE", ok: "OK" },
  { text: FIXTURES, ok: "SANDBOX" },
  { text: "HUMAN AT THE SWITCH", ok: "REQUIRED" },
  { text: "BOOT COMPLETE — PURPOSE" },
]

/** Same closing line the machine cut prints under its creed — verbatim. */
export const GATE_SUB =
  "EVERY AGENT FIX PASSES A SPEND-CAP GATE — NOTHING UNSAFE SHIPS WITHOUT A HUMAN AT THE SWITCH."
