/**
 * Fixture project — a realistic marketing-video session.
 *
 * A ~90-second direct-response ad for a home-services lead-gen vertical
 * ("get a free roofing quote"), recorded once as raw takes across three
 * cameras (talent / b-roll / screen) plus one generated motion-graphics
 * source (gen). Beats follow the direct-response arc:
 * hook → problem → agitate → proof → offer → cta.
 *
 * {{tokens}} in captions/transcripts are the personalization layer —
 * see /studio/batch. Everything below is plain data; the engine is edl.ts.
 */

import { parseEdl, type Lead, type Seg } from "./edl"

// The session as a plain-text EDL — the point of the whole demo. A few takes
// are flubbed and marked CUT; some segments carry fx and on-screen captions.
export const FIXTURE_EDL = `
KEEP | hook    | 0.00   | 5.40   | talent | z=1.08;kb=in;fi=0.40;fo=0.00;spd=1.00;look=none | Your roof could be one storm away from a five-figure repair bill. | ONE STORM AWAY
CUT  | hook    | 5.40   | 10.20  | talent | - | Your roof could be one storm away from a five... ah hold on, let me take that again.
KEEP | hook    | 10.20  | 15.60  | broll  | - | And most homeowners find out the hard way, after the water is already inside.
KEEP | problem | 15.60  | 22.40  | talent | - | Here's the problem: roofers quote whatever they want, because you have no baseline.
KEEP | problem | 22.40  | 28.60  | screen | z=1.10;kb=off;fi=0.00;fo=0.00;spd=1.00;look=none | The average full replacement in {{city}} runs eighteen to twenty-eight thousand dollars. | $18,000 - $28,000
CUT  | problem | 28.60  | 34.00  | talent | - | The average full replacement runs eight... wait, is that the right number? Cut this.
KEEP | agitate | 34.00  | 40.80  | broll  | z=1.00;kb=in;fi=0.00;fo=0.00;spd=1.00;look=warm | Wait six months, and a small leak becomes mold, soaked insulation, structural rot.
KEEP | agitate | 40.80  | 46.60  | talent | - | And insurance will not cover neglect. The clock is not on your side.
KEEP | proof   | 46.60  | 53.20  | talent | - | Last month we matched over two thousand homeowners with vetted local crews.
KEEP | proof   | 53.20  | 59.40  | screen | z=1.15;kb=off;fi=0.00;fo=0.00;spd=1.00;look=none | Rated four point eight out of five across eleven thousand completed quotes. | 4.8 / 5 - 11,000+ QUOTES
CUT  | proof   | 59.40  | 64.20  | talent | - | Rated four point... sorry, sneezed. Going again.
KEEP | proof   | 64.20  | 70.40  | broll  | - | Real crews. Licensed, insured, photographed on real jobs in your area.
KEEP | offer   | 70.40  | 77.20  | talent | z=1.06;kb=off;fi=0.00;fo=0.00;spd=1.00;look=none | Right now {{company}} is offering a completely free, no-obligation roof inspection and quote.
KEEP | offer   | 77.20  | 83.00  | gen    | - | Free inspection. Free quote. Zero pressure. That is the whole deal. | {{offer}} - {{city}}
KEEP | cta     | 83.00  | 89.40  | talent | - | Tap the button, answer three questions, and get your number in under two minutes. | TAP BELOW - 2 MINUTES
CUT  | cta     | 89.40  | 94.60  | talent | - | Tap the butt... nope. One more.
KEEP | cta     | 94.60  | 100.20 | gen    | z=1.00;kb=in;fi=0.00;fo=0.00;spd=1.00;look=none | {{first_name}}, slots in {{city}} fill up every single week. | {{offer}}
KEEP | cta     | 100.20 | 105.80 | broll  | z=1.00;kb=off;fi=0.00;fo=0.80;spd=1.00;look=none | You have nothing to lose, except the leak you do not know about yet.
`

export function fixtureSegs(): Seg[] {
  return parseEdl(FIXTURE_EDL)
}

// ── Camera metadata (chart-safe theme tokens only) ───────────────────────────

export const CAM_META: Record<string, { label: string; color: string }> = {
  talent: { label: "TALENT", color: "var(--color-primary)" },
  broll: { label: "BROLL", color: "var(--color-secondary)" },
  screen: { label: "SCREEN", color: "var(--color-accent)" },
  gen: { label: "GEN", color: "var(--color-info)" },
}

export const BEATS = ["hook", "problem", "agitate", "proof", "offer", "cta"]

// ── Leads fixture (the video-CRM layer, /studio/batch) ───────────────────────

export const LEADS: Lead[] = [
  { company: "Summit Roof Co",      city: "Denver",      vertical: "roofing",        first_name: "Marcus", offer: "FREE 21-POINT INSPECTION" },
  { company: "BayShore Exteriors",  city: "Tampa",       vertical: "storm repair",   first_name: "Dana",   offer: "FREE STORM DAMAGE QUOTE" },
  { company: "Lone Star Roofing",   city: "Austin",      vertical: "roofing",        first_name: "Priya",  offer: "$500 OFF FULL REPLACEMENT" },
  { company: "Cascade Roofworks",   city: "Portland",    vertical: "roofing",        first_name: "Ethan",  offer: "FREE MOSS + LEAK AUDIT" },
  { company: "Old Line Exteriors",  city: "Baltimore",   vertical: "siding + roof",  first_name: "Keisha", offer: "FREE EXTERIOR QUOTE" },
  { company: "Desert Peak Roofing", city: "Phoenix",     vertical: "roofing",        first_name: "Luis",   offer: "FREE HEAT-DAMAGE CHECK" },
  { company: "Great Lakes Roofing", city: "Cleveland",   vertical: "roofing",        first_name: "Anna",   offer: "FREE ICE-DAM INSPECTION" },
  { company: "Palmetto Roof Pros",  city: "Charleston",  vertical: "roofing",        first_name: "Trey",   offer: "FREE HURRICANE-PREP QUOTE" },
]

// ── Effects bank (mirrors static/effects/index.json) ─────────────────────────

export type EffectKind = "sfx" | "overlay" | "zoom"

export interface EffectAsset {
  key: string
  kind: "sfx" | "overlay"
  label: string
  file: string // under /effects/
  tags: string[]
}

export const EFFECTS_BANK: EffectAsset[] = [
  { key: "angelic-choir",  kind: "sfx",     label: "Angelic Choir Swell", file: "sfx/angelic-choir.mp3",  tags: ["triumph", "reveal", "uplift"] },
  { key: "sad-trombone",   kind: "sfx",     label: "Sad Trombone",        file: "sfx/sad-trombone.mp3",   tags: ["fail", "problem", "letdown"] },
  { key: "record-scratch", kind: "sfx",     label: "Record Scratch",      file: "sfx/record-scratch.mp3", tags: ["stop", "pivot", "interrupt"] },
  { key: "ka-ching",       kind: "sfx",     label: "Ka-ching",            file: "sfx/ka-ching.mp3",       tags: ["money", "revenue", "roi"] },
  { key: "whoosh",         kind: "sfx",     label: "Whoosh",              file: "sfx/whoosh.mp3",         tags: ["transition", "motion", "fast"] },
  { key: "ding",           kind: "sfx",     label: "Ding",                file: "sfx/ding.mp3",           tags: ["notify", "point", "correct"] },
  { key: "drumroll",       kind: "sfx",     label: "Drumroll",            file: "sfx/drumroll.mp3",       tags: ["anticipation", "build", "reveal"] },
  { key: "boing",          kind: "sfx",     label: "Boing",               file: "sfx/boing.mp3",          tags: ["bounce", "comedic", "pop"] },
  { key: "light-rays",     kind: "overlay", label: "Light Rays",          file: "overlays/light-rays.webm", tags: ["triumph", "halo", "glow"] },
]

export const EFFECT_KEYS = new Set(EFFECTS_BANK.map((e) => e.key))

// ── Effects suggestions contract ─────────────────────────────────────────────

export interface EffectSuggestion {
  id: string
  segment: number // Seg.idx the placement anchors to
  effect: EffectKind // sfx | overlay | zoom
  asset: string // effect key from the bank, or "z=1.15" for zoom
  rationale: string // one line quoting the script moment
}

/**
 * Precomputed suggestions — the graceful-degradation lane used when no
 * ANTHROPIC_API_KEY is present. Same shape the live LLM lane produces.
 */
export const FALLBACK_SUGGESTIONS: EffectSuggestion[] = [
  {
    id: "fx-1",
    segment: 0,
    effect: "zoom",
    asset: "z=1.15",
    rationale: 'Punch in on the hook — "one storm away from a five-figure repair bill" needs the lens in their face.',
  },
  {
    id: "fx-2",
    segment: 4,
    effect: "sfx",
    asset: "ka-ching",
    rationale: 'Money moment: "eighteen to twenty-eight thousand dollars" — the number is the scare, score it.',
  },
  {
    id: "fx-3",
    segment: 6,
    effect: "sfx",
    asset: "sad-trombone",
    rationale: 'The drudgery beat: "a small leak becomes mold, soaked insulation, structural rot" — lean into the dread.',
  },
  {
    id: "fx-4",
    segment: 9,
    effect: "overlay",
    asset: "light-rays",
    rationale: 'Halo the social proof: "four point eight out of five" is the reveal — glow it.',
  },
  {
    id: "fx-5",
    segment: 13,
    effect: "sfx",
    asset: "ding",
    rationale: 'A clean point landed: "That is the whole deal." — punctuate it.',
  },
  {
    id: "fx-6",
    segment: 16,
    effect: "sfx",
    asset: "whoosh",
    rationale: 'Urgency transition into "slots fill up every single week" — move the viewer to the button.',
  },
]
