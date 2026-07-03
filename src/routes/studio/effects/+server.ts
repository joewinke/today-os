/**
 * Auto-effects — the LLM lane of the creative studio.
 *
 * POST { segments: [{ idx, beat, text }] }
 *   →  { source: "anthropic" | "fixture", suggestions: EffectSuggestion[] }
 *
 * With ANTHROPIC_API_KEY set, the transcript goes to Claude with the
 * effects-contract prompt (transcript in → JSON placements out), parsed
 * defensively and validated against the real effects bank. Without a key
 * it degrades gracefully to realistic precomputed suggestions — the demo
 * always works.
 */
import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import {
  EFFECTS_BANK,
  EFFECT_KEYS,
  FALLBACK_SUGGESTIONS,
  type EffectSuggestion,
} from "$lib/studio/fixtures"

const MAX_SUGGESTIONS = 6

interface TranscriptSeg {
  idx: number
  beat: string
  text: string
}

function parseSegments(body: unknown): TranscriptSeg[] {
  if (!body || typeof body !== "object") return []
  const raw = (body as { segments?: unknown }).segments
  if (!Array.isArray(raw)) return []
  const out: TranscriptSeg[] = []
  for (const s of raw.slice(0, 60)) {
    if (!s || typeof s !== "object") continue
    const { idx, beat, text } = s as Record<string, unknown>
    if (typeof idx !== "number" || !Number.isInteger(idx) || idx < 0) continue
    if (typeof text !== "string" || !text.trim()) continue
    out.push({ idx, beat: String(beat ?? "-").slice(0, 24), text: text.slice(0, 400) })
  }
  return out
}

function buildPrompt(segments: TranscriptSeg[]): string {
  const transcript = segments
    .map((s) => `[seg ${s.idx} | ${s.beat}] ${s.text}`)
    .join("\n")
  const catalog = EFFECTS_BANK.map(
    (e) => `- ${e.key} (${e.kind}): ${e.label} — tags: ${e.tags.join(", ")}`,
  ).join("\n")
  return `You are "auto-delight", a tasteful editor scoring a DIRECT-RESPONSE AD for punch. You place a SMALL number of sound effects, visual overlays, and zoom punch-ins at exact segments — punctuation, not a laugh track.

The transcript (segment index and beat per line):
${transcript}

The ONLY sfx/overlay assets you may use (exact keys):
${catalog}

Rules:
- Propose AT MOST ${MAX_SUGGESTIONS} placements. Fewer is better.
- Match asset to moment: money/dollar amounts -> ka-ching; a problem/drudgery/dread -> sad-trombone or record-scratch; triumphant reveal/social proof -> angelic-choir or light-rays; suspense/build -> drumroll; a clean point landed -> ding; urgency/transition -> whoosh.
- A zoom punch-in is effect "zoom" with asset "z=1.15" (1.05-1.25 allowed) — use it on the single strongest line, usually the hook.
- One placement per segment, and never reuse an asset.
- "rationale" is one line quoting the exact script moment.

Respond with ONLY a JSON object, no prose:
{ "suggestions": [ { "segment": 4, "effect": "sfx"|"overlay"|"zoom", "asset": "ka-ching", "rationale": "..." } ] }`
}

function extractJSON(text: string): unknown {
  const fenced = text.replace(/```(?:json)?/gi, "").trim()
  const start = fenced.indexOf("{")
  const end = fenced.lastIndexOf("}")
  if (start === -1 || end === -1) return null
  try {
    return JSON.parse(fenced.slice(start, end + 1))
  } catch {
    return null
  }
}

function normalize(raw: unknown, segments: TranscriptSeg[]): EffectSuggestion[] {
  const validIdx = new Set(segments.map((s) => s.idx))
  const list = (raw as { suggestions?: unknown })?.suggestions
  if (!Array.isArray(list)) return []
  const out: EffectSuggestion[] = []
  const usedAssets = new Set<string>()
  const usedSegs = new Set<number>()
  for (const item of list) {
    if (out.length >= MAX_SUGGESTIONS) break
    if (!item || typeof item !== "object") continue
    const { segment, effect, asset, rationale } = item as Record<string, unknown>
    if (typeof segment !== "number" || !validIdx.has(segment) || usedSegs.has(segment)) continue
    if (effect !== "sfx" && effect !== "overlay" && effect !== "zoom") continue
    if (typeof asset !== "string") continue
    if (effect === "zoom") {
      const z = parseFloat(asset.replace(/^z=/, ""))
      if (!(z > 1 && z <= 1.5)) continue
    } else if (!EFFECT_KEYS.has(asset) || usedAssets.has(asset)) {
      continue
    } else {
      const meta = EFFECTS_BANK.find((e) => e.key === asset)
      if (meta && meta.kind !== effect) continue
    }
    out.push({
      id: `llm-${out.length + 1}`,
      segment,
      effect,
      asset: effect === "zoom" ? `z=${parseFloat(asset.replace(/^z=/, "")).toFixed(2)}` : asset,
      rationale: typeof rationale === "string" ? rationale.slice(0, 240) : "proposed by auto-effects",
    })
    usedSegs.add(segment)
    if (effect !== "zoom") usedAssets.add(asset)
  }
  return out
}

async function askClaude(apiKey: string, segments: TranscriptSeg[]): Promise<EffectSuggestion[]> {
  const { default: Anthropic } = await import("@anthropic-ai/sdk")
  const client = new Anthropic({ apiKey })
  const response = await client.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 2000,
    messages: [{ role: "user", content: buildPrompt(segments) }],
  })
  const text = response.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("")
  return normalize(extractJSON(text), segments)
}

export const POST: RequestHandler = async ({ request }) => {
  const segments = parseSegments(await request.json().catch(() => null))
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (apiKey && segments.length > 0) {
    try {
      const suggestions = await askClaude(apiKey, segments)
      if (suggestions.length > 0) return json({ source: "anthropic", suggestions })
      console.error("auto-effects: LLM returned no valid placements — using fixture lane")
    } catch (err) {
      console.error("auto-effects: Anthropic call failed — using fixture lane", err)
    }
  }

  // Graceful degradation: precomputed placements, filtered to the segments
  // the client actually sent (a re-cut session may have fewer kept segments).
  const validIdx = new Set(segments.map((s) => s.idx))
  const suggestions =
    segments.length > 0
      ? FALLBACK_SUGGESTIONS.filter((s) => validIdx.has(s.segment))
      : FALLBACK_SUGGESTIONS
  return json({ source: "fixture", suggestions })
}
