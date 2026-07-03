/**
 * AdSpec — the canonical, provider-agnostic snapshot of one ad account.
 *
 * One document per account per capture: account → campaigns → ad_groups →
 * (keywords + ads) + trailing metric rows. Money is ALWAYS integer cents.
 * Round-trips to/from YAML so a snapshot is both human-diffable (yaml) and
 * queryable (json).
 *
 * Adapted from the production marketing-ops module (same author); providers
 * swapped to It's Today Media's actual buying platforms.
 */

import { z } from "zod"
import yaml from "js-yaml"

// ─── Closed vocabularies ─────────────────────────────────────────────────────

/** Ad platforms It's Today Media buys on. */
export const PROVIDERS = ["google_ads", "meta_ads", "taboola", "tiktok_ads"] as const

/** Reporting granularity a metric row (or recommendation) targets. */
export const METRIC_LEVELS = ["account", "campaign", "ad_group", "ad", "keyword"] as const

/** The kind of change a recommendation proposes (coarse, canonical). */
export const RECOMMENDATION_TYPES = [
  "budget_change",
  "pause",
  "enable",
  "keyword_add",
  "keyword_negative",
  "bid_change",
  "new_creative",
  "structure",
  "other",
] as const

export const RISK_LEVELS = ["low", "medium", "high"] as const

export const REC_STATUSES = ["proposed", "approved", "dismissed"] as const
export const REC_SOURCES = ["red_flag", "llm"] as const

export const ProviderSchema = z.enum(PROVIDERS)
export const MetricLevelSchema = z.enum(METRIC_LEVELS)
export const RecommendationTypeSchema = z.enum(RECOMMENDATION_TYPES)
export const RiskSchema = z.enum(RISK_LEVELS)

export type Provider = z.infer<typeof ProviderSchema>
export type MetricLevel = z.infer<typeof MetricLevelSchema>
export type RecommendationType = z.infer<typeof RecommendationTypeSchema>
export type Risk = z.infer<typeof RiskSchema>
export type RecStatus = (typeof REC_STATUSES)[number]
export type RecSource = (typeof REC_SOURCES)[number]

// ─── AdSpec structure ────────────────────────────────────────────────────────
//
// Entity statuses / campaign types / match types are loose strings — the
// vocabulary varies per provider (ENABLED vs ACTIVE vs enabled) and the
// canonical model tolerates whatever the adapter normalizes to.

const KeywordSchema = z.object({
  text: z.string(),
  match_type: z.string(),
  status: z.string(),
  quality_score: z.number().optional(),
})

const AdSchema = z.object({
  external_id: z.string(),
  type: z.string(),
  headlines: z.array(z.string()),
  descriptions: z.array(z.string()),
  asset_urls: z.array(z.string()),
  status: z.string(),
  /** approved | disapproved | limited | under_review — provider-loose. */
  policy_status: z.string().optional(),
  /** ISO date the creative was created — drives creative-fatigue checks. */
  created_at: z.string().optional(),
})

const AdGroupSchema = z.object({
  external_id: z.string(),
  name: z.string(),
  status: z.string(),
  keywords: z.array(KeywordSchema),
  ads: z.array(AdSchema),
})

const CampaignBudgetSchema = z.object({
  amount_cents: z.number().int(),
  /** daily | monthly | lifetime — kept loose; providers differ. */
  period: z.string(),
})

const CampaignSchema = z.object({
  external_id: z.string(),
  name: z.string(),
  status: z.string(),
  type: z.string(),
  budget: CampaignBudgetSchema,
  bid_strategy: z.string(),
  /** Provider "limited by budget" signal, when the adapter can read it. */
  is_budget_limited: z.boolean().optional(),
  ad_groups: z.array(AdGroupSchema),
})

const AdAccountSchema = z.object({
  external_id: z.string(),
  name: z.string(),
  currency: z.string(),
  timezone: z.string(),
})

const MetricRowSchema = z.object({
  level: MetricLevelSchema,
  external_id: z.string(),
  impressions: z.number(),
  clicks: z.number(),
  cost_cents: z.number().int(),
  conversions: z.number(),
  conversion_value_cents: z.number().int(),
  /** Avg impressions per user over the window (Meta/TikTok fatigue signal). */
  frequency: z.number().optional(),
})

const MetricsSchema = z.object({
  /** Rolling window the rows cover (e.g. 30 = last 30 days). */
  window_days: z.number(),
  rows: z.array(MetricRowSchema),
})

export const AdSpecSchema = z.object({
  /** Spec format version — bump on breaking shape changes. */
  version: z.literal(1),
  provider: ProviderSchema,
  account: AdAccountSchema,
  /** ISO timestamp the snapshot was captured. */
  snapshot_at: z.string(),
  campaigns: z.array(CampaignSchema),
  metrics: MetricsSchema,
})

export type Keyword = z.infer<typeof KeywordSchema>
export type Ad = z.infer<typeof AdSchema>
export type AdGroup = z.infer<typeof AdGroupSchema>
export type CampaignBudget = z.infer<typeof CampaignBudgetSchema>
export type Campaign = z.infer<typeof CampaignSchema>
export type AdAccount = z.infer<typeof AdAccountSchema>
export type MetricRow = z.infer<typeof MetricRowSchema>
export type Metrics = z.infer<typeof MetricsSchema>
export type AdSpec = z.infer<typeof AdSpecSchema>

// ─── Recommendations ─────────────────────────────────────────────────────────

/** What the engine emits (red-flag pass or LLM pass) before persistence. */
export const RecommendationInputSchema = z.object({
  type: RecommendationTypeSchema,
  target_level: MetricLevelSchema,
  target_external_id: z.string(),
  title: z.string(),
  rationale: z.string(),
  /** Opaque per-type payload; red flags stamp rule_id + action slugs here. */
  proposed_change: z.record(z.unknown()),
  estimated_impact: z.string().optional(),
  risk: RiskSchema,
})

export type RecommendationInput = z.infer<typeof RecommendationInputSchema>

/** A persisted recommendation, as the store holds it. */
export interface Recommendation extends RecommendationInput {
  id: string
  account_id: string
  status: RecStatus
  source: RecSource
  created_at: string
  /** Set on approval by the autonomy gate (fail-closed). */
  gate_verdict?: GateVerdict
  gate_reason?: string
}

export type GateVerdict = "manual_review" | "blocked" | "eligible"

// ─── Parse + YAML round-trip helpers ─────────────────────────────────────────

/** Validate an arbitrary value as an AdSpec (throws on failure). */
export function parseAdSpec(value: unknown): AdSpec {
  return AdSpecSchema.parse(value)
}

/** Serialize an AdSpec to a stable, diffable YAML string. */
export function specToYaml(spec: AdSpec): string {
  return yaml.dump(spec, {
    sortKeys: false, // preserve authored key order
    lineWidth: -1, // don't fold long headlines / asset urls
    noRefs: true, // no YAML anchors on repeated objects
  })
}

/** Parse a YAML string into a validated AdSpec. Throws on invalid shape. */
export function specFromYaml(yamlText: string): AdSpec {
  const doc = yaml.load(yamlText)
  if (!doc || typeof doc !== "object") {
    throw new Error("specFromYaml: YAML did not parse to an object")
  }
  return AdSpecSchema.parse(doc)
}

// ─── Money / derived-metric helpers (shared by engine + UI) ──────────────────

export function fmtUsd(cents: number, opts: { compact?: boolean } = {}): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
    ...(opts.compact ? { notation: "compact" as const } : {}),
  }).format(cents / 100)
}

export function ctr(impressions: number, clicks: number): number {
  return impressions > 0 ? clicks / impressions : 0
}

export function fmtPct(fraction: number, digits = 2): string {
  return `${(fraction * 100).toFixed(digits)}%`
}
