/**
 * EDL — "the edit is data".
 *
 * A zero-dependency model for a plain-text Edit Decision List, ported from
 * a production multicam editor. One line per segment:
 *
 *   KEEP | beat | start | end | camera | fx | transcript text [| caption]
 *
 * Because the edit is a text file, agents can operate on it: auto-cut,
 * auto-effects, per-segment personalization at batch scale.
 *
 * ROUND-TRIP GUARD: a canonical EDL written by serializeEdl() must satisfy
 *   serializeEdl(parseEdl(edl)) === edl   (byte-identical)
 * and a caption-less segment must emit a 7-field line (no trailing " | ").
 * Encoded as tests in edl.test.ts.
 */

export type KenBurns = "off" | "in" | "out"
export type Look = "none" | "bw" | "sepia" | "vivid" | "warm" | "cool"

export interface Fx {
  z: number // static zoom (1.0 = none; >1 tightens/crops in)
  kb: KenBurns // ken burns: slow zoom in / out over the shot
  fi: number // fade-in seconds (0 = none)
  fo: number // fade-out seconds (0 = none)
  spd: number // playback speed (1.0 = normal; 0.5 slow-mo; 2 fast)
  look: Look // color look
}

export const LOOKS: Look[] = ["none", "bw", "sepia", "vivid", "warm", "cool"]

/** The four sources of the studio session: three cameras + one generated. */
export const CAMERAS = ["talent", "broll", "screen", "gen"] as const
export type Camera = (typeof CAMERAS)[number]

export interface Seg {
  idx: number
  keep: boolean
  beat: string
  start: number // seconds in the raw recording
  end: number
  cam: string
  fx: Fx
  text: string // transcript (spoken text)
  caption: string // on-screen caption / overlay text ("" = none)
}

export const defaultFx = (): Fx => ({
  z: 1,
  kb: "off",
  fi: 0,
  fo: 0,
  spd: 1,
  look: "none",
})

export const fxIsDefault = (f: Fx) =>
  f.z === 1 &&
  f.kb === "off" &&
  f.fi === 0 &&
  f.fo === 0 &&
  f.spd === 1 &&
  f.look === "none"

export function parseFx(s: string): Fx {
  const f = defaultFx()
  if (!s || s === "-") return f
  for (const kv of s.split(";")) {
    const [k, v] = kv.split("=")
    if (k === "z") f.z = parseFloat(v)
    else if (k === "kb") f.kb = (v as KenBurns) || "off"
    else if (k === "fi") f.fi = parseFloat(v)
    else if (k === "fo") f.fo = parseFloat(v)
    else if (k === "spd") f.spd = parseFloat(v)
    else if (k === "look") f.look = (v as Look) || "none"
  }
  return f
}

export function serializeFx(f: Fx): string {
  if (fxIsDefault(f)) return "-"
  return `z=${f.z.toFixed(2)};kb=${f.kb};fi=${f.fi.toFixed(2)};fo=${f.fo.toFixed(2)};spd=${f.spd.toFixed(2)};look=${f.look}`
}

/** Short labels for active effects, for row badges. */
export function fxBadges(f: Fx): string[] {
  const b: string[] = []
  if (f.z > 1.001) b.push(`${f.z.toFixed(2).replace(/0$/, "")}x zoom`)
  if (f.kb !== "off") b.push(f.kb === "in" ? "kenburns in" : "kenburns out")
  if (f.fi > 0) b.push("fade-in")
  if (f.fo > 0) b.push("fade-out")
  if (f.spd !== 1) b.push(`${f.spd}x spd`)
  if (f.look !== "none") b.push(f.look)
  return b
}

const HEADER = [
  "# Today OS smart-cut EDL — edit this text, the edit IS the data",
  "# KEEP/CUT | beat | start | end | camera(talent|broll|screen|gen) | fx | transcript | caption?",
  "# fx: '-' = none, else z=zoom;kb=in/out;fi=fadein_s;fo=fadeout_s;spd=speed;look=grade",
  "",
]

// Field text is pipe-delimited, so "|" is reserved. Serialization strips it
// from free-text fields; that keeps parse → serialize byte-identical.
const clean = (s: string) => s.replaceAll("|", "/").trim()

export function parseEdl(content: string): Seg[] {
  const segs: Seg[] = []
  let i = 0
  for (const line of content.split("\n")) {
    const t = line.trim()
    if (!t || t.startsWith("#")) continue
    const parts = t.split("|").map((p) => p.trim())
    if (parts.length < 5) continue
    const flag = parts[0].toUpperCase()
    if (flag !== "KEEP" && flag !== "CUT") continue
    // 7+ fields → fx at [5], transcript at [6]; optional caption at [7+].
    // 6 fields (legacy) → no fx, transcript at [5].
    const hasFx = parts.length >= 7
    let text: string
    let caption = ""
    if (!hasFx) {
      text = parts.slice(5).join("/").trim()
    } else {
      text = parts[6] ?? ""
      caption = parts.slice(7).join("/").trim()
    }
    segs.push({
      idx: i++,
      keep: flag === "KEEP",
      beat: parts[1],
      start: parseFloat(parts[2]),
      end: parseFloat(parts[3]),
      cam: parts[4],
      fx: hasFx ? parseFx(parts[5]) : defaultFx(),
      text,
      caption,
    })
  }
  return segs
}

export function serializeEdl(segs: Seg[]): string {
  const lines = [...HEADER]
  for (const s of segs) {
    // Caption-less segments emit the 7-field line EXACTLY — no trailing " | ".
    // Only a non-empty caption appends an 8th field, so a caption-less EDL
    // parse → serialize round-trips byte-identically.
    const base = `${s.keep ? "KEEP" : "CUT "} | ${s.beat} | ${s.start.toFixed(2)} | ${s.end.toFixed(2)} | ${s.cam} | ${serializeFx(s.fx)} | ${clean(s.text)}`
    lines.push(s.caption === "" ? base : `${base} | ${clean(s.caption)}`)
  }
  return lines.join("\n") + "\n"
}

// ── Timeline math ────────────────────────────────────────────────────────────

/** Output duration of a segment (source duration / playback speed). */
export const segDur = (s: Seg): number => (s.end - s.start) / s.fx.spd

/** Total output duration of kept segments. */
export const keptDuration = (segs: Seg[]): number =>
  segs.filter((s) => s.keep).reduce((a, s) => a + segDur(s), 0)

/** Total raw footage duration (kept + cut, at source speed). */
export const rawDuration = (segs: Seg[]): number =>
  segs.reduce((a, s) => a + (s.end - s.start), 0)

/** Per-camera share of the kept output, as fractions summing to 1. */
export function camShares(segs: Seg[]): Record<string, number> {
  const total = keptDuration(segs)
  const shares: Record<string, number> = {}
  if (total <= 0) return shares
  for (const s of segs) {
    if (!s.keep) continue
    shares[s.cam] = (shares[s.cam] ?? 0) + segDur(s) / total
  }
  return shares
}

export function fmtDur(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec - m * 60
  return `${m}:${s.toFixed(1).padStart(4, "0")}`
}

// ── Personalization tokens (the batch / video-CRM layer) ─────────────────────

export interface Lead {
  company: string
  city: string
  vertical: string
  first_name: string
  offer: string
}

export const TOKEN_RE = /\{\{(company|city|vertical|first_name|offer)\}\}/g

export function substituteTokens(text: string, lead: Lead): string {
  return text.replace(TOKEN_RE, (_, key: keyof Lead) => lead[key])
}

/** Split text into literal + substituted parts, for highlighted rendering. */
export function tokenParts(
  text: string,
  lead: Lead,
): { text: string; sub: boolean }[] {
  const parts: { text: string; sub: boolean }[] = []
  let last = 0
  for (const m of text.matchAll(TOKEN_RE)) {
    if (m.index > last) parts.push({ text: text.slice(last, m.index), sub: false })
    parts.push({ text: lead[m[1] as keyof Lead], sub: true })
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push({ text: text.slice(last), sub: false })
  return parts
}

/** Substitute tokens across a whole cut (transcripts + captions). */
export function personalizeSegs(segs: Seg[], lead: Lead): Seg[] {
  return segs.map((s) => ({
    ...s,
    fx: { ...s.fx },
    text: substituteTokens(s.text, lead),
    caption: substituteTokens(s.caption, lead),
  }))
}
