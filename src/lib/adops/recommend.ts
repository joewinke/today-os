/**
 * recommend.ts — the LLM lane of the two-layer review.
 *
 * The deterministic red flags (redflags.ts) are guaranteed; this lane adds
 * the judgment calls — structure, bid-strategy maturity, budget reallocation —
 * grounded in the SAME doctrine markdown the red-flag engine implements.
 *
 * Live path : Anthropic claude-sonnet-5, used ONLY when ANTHROPIC_API_KEY is
 *             set. Output is parsed defensively — a malformed response yields
 *             [] and never breaks an audit (red flags always survive).
 * Demo path : the account's precomputed fixture recommendations.
 *
 * Merge rule: dedupe by (type, target_level, target_external_id); earlier
 * entries win, and callers pass red flags FIRST so a guaranteed rec always
 * beats a duplicate LLM one.
 */

import type { AdSpec, RecommendationInput } from "./types"
import {
  RecommendationInputSchema,
  RECOMMENDATION_TYPES,
  METRIC_LEVELS,
  RISK_LEVELS,
  specToYaml,
} from "./types"
import { FIXTURE_LLM_RECS } from "./fixtures"

export const LLM_MODEL = "claude-sonnet-5"
export const LLM_MAX_TOKENS = 4096

// ─── Prompt (pure) ───────────────────────────────────────────────────────────

export interface BuiltPrompt {
  system: string
  user: string
}

/**
 * Build the (system, user) messages for the recommendation pass. Pure: takes
 * the snapshot + already-loaded doctrine text, returns the prompt. The AdSpec
 * is rendered as YAML — the same human-diffable form the store persists.
 */
export function buildRecommendationPrompt(spec: AdSpec, doctrineMd: string): BuiltPrompt {
  const system = [
    "You are a senior paid-media strategist auditing an ad account for an affiliate lead-generation business.",
    "You are given (1) the provider's best-practices doctrine and (2) a canonical snapshot of one ad account (AdSpec, YAML).",
    "Diff the snapshot against the doctrine and produce concrete, account-specific optimization recommendations.",
    "",
    "STRICT OUTPUT CONTRACT:",
    'Return ONLY a JSON object of the form {"recommendations": [...]}. No prose, no markdown fences.',
    "Each recommendation has exactly these fields:",
    `  - type: one of ${RECOMMENDATION_TYPES.join(" | ")}`,
    `  - target_level: one of ${METRIC_LEVELS.join(" | ")}`,
    "  - target_external_id: the external_id the change targets (account external_id for account-level advice; keyword text for keyword-level)",
    "  - title: a short imperative summary",
    "  - rationale: 1-2 sentences grounded in the doctrine AND the actual snapshot numbers",
    '  - proposed_change: a JSON object describing the change, including an "action" slug',
    "  - estimated_impact: optional short string",
    `  - risk: one of ${RISK_LEVELS.join(" | ")}`,
    "",
    "RULES:",
    "- Ground every recommendation in the doctrine and the snapshot — never invent metrics or entities not present.",
    "- Prefer judgment calls the deterministic layer can't make (structure, bid-strategy maturity, budget reallocation, creative strategy) over mechanical threshold checks.",
    "- If the account looks healthy, return an empty recommendations array.",
    "- Emit at most 8 recommendations, highest-impact first.",
  ].join("\n")

  const user = [
    "=== PROVIDER DOCTRINE ===",
    doctrineMd,
    "",
    "=== ACCOUNT SNAPSHOT (AdSpec, YAML) ===",
    specToYaml(spec),
  ].join("\n")

  return { system, user }
}

// ─── Defensive parse (pure) ──────────────────────────────────────────────────

/** Strip a ```json fence if the model wrapped its output anyway. */
function stripCodeFence(text: string): string {
  const trimmed = text.trim()
  const fence = /^```(?:json)?\s*\n?([\s\S]*?)\n?```$/i.exec(trimmed)
  return fence ? fence[1].trim() : trimmed
}

/**
 * Parse the model's raw output into RecommendationInput[]. Tolerant: accepts
 * a bare array or a {recommendations: [...]} wrapper, ignores fences, drops
 * elements that fail schema validation. Never throws — malformed output → [].
 */
export function parseRecommendations(raw: string): RecommendationInput[] {
  if (!raw || !raw.trim()) return []
  let parsed: unknown
  try {
    parsed = JSON.parse(stripCodeFence(raw))
  } catch {
    return []
  }
  const arr = Array.isArray(parsed) ? parsed : (parsed as { recommendations?: unknown })?.recommendations
  if (!Array.isArray(arr)) return []

  const out: RecommendationInput[] = []
  for (const item of arr) {
    const res = RecommendationInputSchema.safeParse(item)
    if (res.success) out.push(res.data)
  }
  return out
}

// ─── Merge + dedupe (pure) ───────────────────────────────────────────────────

/**
 * De-duplicate by (type, target_level, target_external_id). Earlier entries
 * win — pass the deterministic red flags FIRST so a guaranteed rec always
 * beats a duplicate LLM one (the red flag carries the stable rule_id).
 */
export function dedupeRecommendations(recs: RecommendationInput[]): RecommendationInput[] {
  const seen = new Set<string>()
  const out: RecommendationInput[] = []
  for (const r of recs) {
    const key = `${r.type}|${r.target_level}|${r.target_external_id}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push(r)
  }
  return out
}

// ─── The lane ────────────────────────────────────────────────────────────────

/**
 * Produce LLM-lane recommendations for a snapshot.
 *
 * With ANTHROPIC_API_KEY set → one live claude-sonnet-5 call, defensively
 * parsed. Without it (the standalone demo) → the account's precomputed
 * fixture recs. Any live-call failure degrades to the fixtures too, so an
 * audit never fails because of this lane.
 */
export async function getLlmRecommendations(
  spec: AdSpec,
  doctrineMd: string,
  accountId: string,
): Promise<{ recs: RecommendationInput[]; via: "anthropic" | "fixture" }> {
  const fixture = FIXTURE_LLM_RECS[accountId] ?? []

  if (!process.env.ANTHROPIC_API_KEY) {
    return { recs: fixture, via: "fixture" }
  }

  try {
    const { default: Anthropic } = await import("@anthropic-ai/sdk")
    const client = new Anthropic()
    const { system, user } = buildRecommendationPrompt(spec, doctrineMd)

    const response = await client.messages.create({
      model: LLM_MODEL,
      max_tokens: LLM_MAX_TOKENS,
      system,
      messages: [{ role: "user", content: user }],
    })

    if (response.stop_reason === "refusal") {
      return { recs: fixture, via: "fixture" }
    }

    const text = response.content
      .filter((b): b is Extract<(typeof response.content)[number], { type: "text" }> => b.type === "text")
      .map((b) => b.text)
      .join("")

    const recs = parseRecommendations(text)
    // A live call that produced nothing parseable degrades to fixtures so the
    // demo never renders an inexplicably empty LLM lane.
    return recs.length > 0 ? { recs, via: "anthropic" } : { recs: fixture, via: "fixture" }
  } catch (err) {
    console.warn("[adops] live LLM lane failed, degrading to fixtures:", err instanceof Error ? err.message : err)
    return { recs: fixture, via: "fixture" }
  }
}
