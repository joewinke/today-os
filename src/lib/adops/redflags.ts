/**
 * redflags.ts — deterministic evaluation of the machine-checkable RED FLAGS
 * against an AdSpec snapshot.
 *
 * Pure: no DB, no network, no clock beyond the spec's own snapshot_at. Each
 * rule mirrors a bullet in the provider's doctrine RED FLAGS section
 * (src/lib/adops/doctrine/*.md) — the doctrine is the source of truth for
 * thresholds; the constants here are those documented defaults. Matches are
 * GUARANTEED recommendations: they never depend on the LLM and always fire
 * when their condition holds. Every rationale carries the real numbers from
 * the snapshot as evidence.
 */

import type { AdSpec, Campaign, AdGroup, MetricRow, Provider, RecommendationInput } from "./types"
import { fmtUsd, fmtPct, ctr } from "./types"

// ─── Documented default thresholds (see doctrine RED FLAGS sections) ─────────

/** Campaign share of account spend that counts as "material". */
const MATERIAL_SPEND_SHARE = 0.2
/** tCPA/tROAS/cost-cap need ~15–30 conv/30d to be stable. */
const SMART_BIDDING_MIN_CONVERSIONS = 15
/** Taboola: clicks with zero conversions → placement audit. */
const TABOOLA_CLICKS_NO_CONV = 500
/** Meta: frequency above this burns the audience. */
const META_MAX_FREQUENCY = 4
/** Creative age (days) presumed fatigued, per provider. */
const STALE_CREATIVE_DAYS: Partial<Record<Provider, number>> = {
  meta_ads: 60,
  tiktok_ads: 30,
}
/** CTR floors at an impression volume where the read is significant. */
const CTR_FLOORS: Record<Provider, { minImpressions: number; floor: number }> = {
  google_ads: { minImpressions: 10_000, floor: 0.01 },
  meta_ads: { minImpressions: 20_000, floor: 0.007 },
  taboola: { minImpressions: 100_000, floor: 0.0008 },
  tiktok_ads: { minImpressions: 50_000, floor: 0.004 },
}

const RULE_PREFIX: Record<Provider, string> = {
  google_ads: "gads",
  meta_ads: "meta",
  taboola: "tab",
  tiktok_ads: "tt",
}

// ─── Metric derivation helpers ───────────────────────────────────────────────

interface Totals {
  impressions: number
  clicks: number
  cost: number
  conversions: number
  frequency?: number
}

const ZERO: Totals = { impressions: 0, clicks: 0, cost: 0, conversions: 0 }

function addRow(t: Totals, r: MetricRow): Totals {
  return {
    impressions: t.impressions + r.impressions,
    clicks: t.clicks + r.clicks,
    cost: t.cost + r.cost_cents,
    conversions: t.conversions + r.conversions,
    frequency: r.frequency ?? t.frequency,
  }
}

/** Account totals: prefer explicit account-level rows, else sum campaign rows. */
export function accountTotals(spec: AdSpec): Totals {
  const acct = spec.metrics.rows.filter((r) => r.level === "account")
  const source = acct.length ? acct : spec.metrics.rows.filter((r) => r.level === "campaign")
  return source.reduce(addRow, ZERO)
}

/** Index metric rows of one level by external_id. */
export function metricIndex(spec: AdSpec, level: MetricRow["level"]): Map<string, Totals> {
  const idx = new Map<string, Totals>()
  for (const r of spec.metrics.rows) {
    if (r.level !== level) continue
    idx.set(r.external_id, addRow(idx.get(r.external_id) ?? ZERO, r))
  }
  return idx
}

/** Case-insensitive enabled check — providers differ (ENABLED / ACTIVE / enabled). */
function isEnabled(status: string): boolean {
  const s = status.trim().toLowerCase()
  return s === "enabled" || s === "active"
}

function isDisapproved(policyStatus: string | undefined): boolean {
  const s = (policyStatus ?? "").trim().toLowerCase()
  return s === "disapproved" || s === "rejected"
}

/** Does the bid strategy look target-based (needs conversion volume)? */
function isTargetBidding(bidStrategy: string): boolean {
  return /target.?cpa|tcpa|target.?roas|troas|cost.?cap|smartbid.?target/i.test(bidStrategy)
}

function enabledAds(adGroup: AdGroup) {
  return adGroup.ads.filter((a) => isEnabled(a.status))
}

function ageDays(iso: string, asOf: string): number {
  return Math.floor((new Date(asOf).getTime() - new Date(iso).getTime()) / 86_400_000)
}

/** Normalize window spend to a ~monthly figure for "waste detected" stats. */
function monthlyize(cents: number, windowDays: number): number {
  return windowDays > 0 ? Math.round((cents / windowDays) * 30.4) : cents
}

function flag(
  ruleId: string,
  r: Omit<RecommendationInput, "proposed_change"> & { proposed_change?: Record<string, unknown> },
): RecommendationInput {
  return {
    ...r,
    proposed_change: { rule_id: ruleId, target_external_id: r.target_external_id, ...(r.proposed_change ?? {}) },
  }
}

// ─── The checks ──────────────────────────────────────────────────────────────

/**
 * Evaluate every machine-checkable rule against a snapshot. Returns the
 * guaranteed recommendations (possibly empty for a clean account).
 */
export function applyRedFlagChecks(spec: AdSpec): RecommendationInput[] {
  const out: RecommendationInput[] = []
  const p = RULE_PREFIX[spec.provider]
  const account = accountTotals(spec)
  const byCampaign = metricIndex(spec, "campaign")
  const byKeyword = metricIndex(spec, "keyword")
  const window = spec.metrics.window_days

  // {p}-no-conversion-tracking — account spends, zero conversions anywhere.
  if (account.cost > 0 && account.conversions === 0) {
    out.push(
      flag(`${p}-no-conversion-tracking`, {
        type: "other",
        target_level: "account",
        target_external_id: spec.account.external_id,
        title: "No conversions recorded despite spend — tracking suspect",
        rationale: `The account spent ${fmtUsd(account.cost)} over the last ${window} days with 0 recorded conversions. Either conversion tracking is broken or every dollar is waste — both block all downstream optimization.`,
        risk: "high",
        proposed_change: { action: "verify_conversion_tracking", cost_cents_window: account.cost },
      }),
    )
  }

  for (const campaign of spec.campaigns) {
    const cm = byCampaign.get(campaign.external_id) ?? ZERO
    const enabled = isEnabled(campaign.status)
    const share = account.cost > 0 ? cm.cost / account.cost : 0

    // {p}-spend-zero-conversions — material spend, zero conversions → pause.
    if (enabled && account.cost > 0 && share >= MATERIAL_SPEND_SHARE && cm.conversions === 0) {
      out.push(
        flag(`${p}-spend-zero-conversions`, {
          type: "pause",
          target_level: "campaign",
          target_external_id: campaign.external_id,
          title: `Pause "${campaign.name}" — ${fmtPct(share, 0)} of spend, zero conversions`,
          rationale: `"${campaign.name}" spent ${fmtUsd(cm.cost)} (${fmtPct(share, 0)} of the account's ${fmtUsd(account.cost)}) over ${window} days with 0 conversions from ${cm.clicks.toLocaleString()} clicks. That is bleeding budget — pause and diagnose before it spends more.`,
          estimated_impact: `Stops ~${fmtUsd(monthlyize(cm.cost, window))}/mo of unconverting spend`,
          risk: "high",
          proposed_change: {
            action: "pause_campaign",
            spend_share: Number(share.toFixed(3)),
            cost_cents_window: cm.cost,
            waste_cents_monthly: monthlyize(cm.cost, window),
          },
        }),
      )
    }

    // tab-clicks-no-conversions — placement-quality audit (Taboola only).
    if (
      spec.provider === "taboola" &&
      enabled &&
      cm.clicks >= TABOOLA_CLICKS_NO_CONV &&
      cm.conversions === 0
    ) {
      out.push(
        flag("tab-clicks-no-conversions", {
          type: "other",
          target_level: "campaign",
          target_external_id: campaign.external_id,
          title: `Audit placements on "${campaign.name}" — ${cm.clicks.toLocaleString()} clicks, zero conversions`,
          rationale: `"${campaign.name}" bought ${cm.clicks.toLocaleString()} clicks for ${fmtUsd(cm.cost)} over ${window} days with 0 conversions. On native that is a placement-quality problem first — pull the Sites report and block the spending-but-not-converting placements before touching creative or bids.`,
          risk: "high",
          proposed_change: { action: "review_block_placements", clicks_window: cm.clicks, cost_cents_window: cm.cost },
        }),
      )
    }

    // meta-high-frequency — audience burn (Meta only; frequency on campaign row).
    if (spec.provider === "meta_ads" && enabled && (cm.frequency ?? 0) > META_MAX_FREQUENCY) {
      out.push(
        flag("meta-high-frequency", {
          type: "new_creative",
          target_level: "campaign",
          target_external_id: campaign.external_id,
          title: `Frequency ${cm.frequency?.toFixed(1)} on "${campaign.name}" — audience burn`,
          rationale: `"${campaign.name}" is averaging frequency ${cm.frequency?.toFixed(1)} over ${window} days (doctrine ceiling: ${META_MAX_FREQUENCY}). The audience is being burned — CTR sinks, CPM rises, negative feedback climbs. Rotate fresh concepts or widen the audience.`,
          risk: "high",
          proposed_change: { action: "refresh_creative", frequency: cm.frequency },
        }),
      )
    }

    // {p}-premature-*-bidding — target-based bidding below learning volume.
    if (enabled && isTargetBidding(campaign.bid_strategy) && cm.conversions < SMART_BIDDING_MIN_CONVERSIONS) {
      const ruleId =
        spec.provider === "google_ads"
          ? "gads-premature-smart-bidding"
          : spec.provider === "taboola"
            ? "tab-premature-smartbid-target"
            : spec.provider === "tiktok_ads"
              ? "tt-premature-cost-cap"
              : `${p}-premature-target-bidding`
      out.push(
        flag(ruleId, {
          type: "bid_change",
          target_level: "campaign",
          target_external_id: campaign.external_id,
          title: `"${campaign.name}" runs ${campaign.bid_strategy} on ${cm.conversions} conversions`,
          rationale: `"${campaign.name}" is on ${campaign.bid_strategy} with only ${cm.conversions} conversions in ${window} days — target-based bidding needs ~${SMART_BIDDING_MIN_CONVERSIONS}–30/30d to stabilize. Below that it optimizes on noise and starves delivery. Step down to a volume-based strategy until it earns the target.`,
          risk: "medium",
          proposed_change: {
            action: "change_bid_strategy",
            from: campaign.bid_strategy,
            observed_conversions: cm.conversions,
            required_conversions: SMART_BIDDING_MIN_CONVERSIONS,
          },
        }),
      )
    }

    // {p}-budget-limited-* — the budget-limited signal, split by whether it converts.
    if (enabled && campaign.is_budget_limited) {
      if (cm.conversions > 0) {
        const cpa = cm.cost / cm.conversions
        out.push(
          flag(`${p}-budget-limited-converting`, {
            type: "budget_change",
            target_level: "campaign",
            target_external_id: campaign.external_id,
            title: `Raise budget on "${campaign.name}" — budget-limited while converting`,
            rationale: `"${campaign.name}" is flagged limited-by-budget while producing ${cm.conversions} conversions at ${fmtUsd(Math.round(cpa))} CPA over ${window} days. A capped campaign that converts is leaving profitable volume unclaimed — raise the ${fmtUsd(campaign.budget.amount_cents)}/${campaign.budget.period} budget or reallocate from an underperformer.`,
            estimated_impact: "Unlocks conversion volume at the current CPA",
            risk: "medium",
            proposed_change: {
              action: "increase_budget",
              current_budget_cents: campaign.budget.amount_cents,
              period: campaign.budget.period,
              observed_cpa_cents: Math.round(cpa),
            },
          }),
        )
      } else {
        out.push(
          flag(`${p}-budget-limited-not-converting`, {
            type: "other",
            target_level: "campaign",
            target_external_id: campaign.external_id,
            title: `"${campaign.name}" is budget-limited but not converting — fix before funding`,
            rationale: `"${campaign.name}" is limited-by-budget with 0 conversions over ${window} days. Adding budget to a campaign that isn't converting scales waste — fix targeting/creative first.`,
            risk: "medium",
            proposed_change: { action: "fix_targeting_before_budget" },
          }),
        )
      }
    }

    // {p}-low-ctr-high-impressions — CTR below the provider floor at volume.
    const floorCfg = CTR_FLOORS[spec.provider]
    const campaignCtr = ctr(cm.impressions, cm.clicks)
    if (enabled && cm.impressions >= floorCfg.minImpressions && campaignCtr < floorCfg.floor) {
      out.push(
        flag(`${p}-low-ctr-high-impressions`, {
          type: "new_creative",
          target_level: "campaign",
          target_external_id: campaign.external_id,
          title: `CTR ${fmtPct(campaignCtr)} on "${campaign.name}" — below the ${fmtPct(floorCfg.floor)} floor`,
          rationale: `"${campaign.name}" is running ${fmtPct(campaignCtr)} CTR on ${cm.impressions.toLocaleString()} impressions over ${window} days — under the ${fmtPct(floorCfg.floor)} doctrine floor for this channel. The creative is no longer earning attention; refresh before optimizing anything downstream of the click.`,
          risk: "medium",
          proposed_change: {
            action: spec.provider === "google_ads" ? "improve_ad_strength" : "refresh_creative",
            ctr: Number(campaignCtr.toFixed(5)),
            floor: floorCfg.floor,
            impressions_window: cm.impressions,
          },
        }),
      )
    }

    // ── ad-group / ad / keyword level ──────────────────────────────────────
    for (const adGroup of campaign.ad_groups) {
      const agEnabled = isEnabled(adGroup.status)
      const serving = enabledAds(adGroup)

      // {p}-adgroup-no-active-ad / -single-ad — thin creative pool.
      if (agEnabled && enabled && serving.length === 0) {
        out.push(
          flag(`${p}-adgroup-no-active-ad`, {
            type: "new_creative",
            target_level: "ad_group",
            target_external_id: adGroup.external_id,
            title: `"${adGroup.name}" has no serving ad`,
            rationale: `Ad ${spec.provider === "meta_ads" ? "set" : "group"} "${adGroup.name}" is enabled with 0 serving ads — it cannot show and is dead spend surface.`,
            risk: "high",
            proposed_change: { action: "add_creative", enabled_ad_count: 0 },
          }),
        )
      } else if (agEnabled && enabled && serving.length === 1) {
        out.push(
          flag(
            spec.provider === "google_ads"
              ? "gads-adgroup-single-ad"
              : spec.provider === "meta_ads"
                ? "meta-adset-single-ad"
                : spec.provider === "taboola"
                  ? "tab-single-creative"
                  : "tt-adgroup-single-ad",
            {
              type: "new_creative",
              target_level: "ad_group",
              target_external_id: adGroup.external_id,
              title: `Only 1 active ad in "${adGroup.name}"`,
              rationale: `"${adGroup.name}" runs a single active ad — no A/B signal, nothing for the delivery system to rotate, and the ${spec.provider === "meta_ads" ? "ad set" : "ad group"} goes dark if that one ad is disapproved. Doctrine floor is 2–3+ actives.`,
              risk: "medium",
              proposed_change: { action: "add_creative_variants", enabled_ad_count: 1 },
            },
          ),
        )
      }

      const staleDays = STALE_CREATIVE_DAYS[spec.provider]
      for (const ad of adGroup.ads) {
        // {p}-disapproved-ad — policy-flagged ad in an enabled campaign.
        if (enabled && isEnabled(ad.status) && isDisapproved(ad.policy_status)) {
          out.push(
            flag(`${p}-disapproved-ad`, {
              type: "new_creative",
              target_level: "ad",
              target_external_id: ad.external_id,
              title: `Disapproved ad in "${adGroup.name}" — replace or appeal`,
              rationale: `Ad ${ad.external_id} ("${ad.headlines[0] ?? "untitled"}") is policy-disapproved inside the enabled campaign "${campaign.name}". Beyond the lost delivery, repeated policy flags in lead-gen verticals accumulate toward account-level penalties. Replace or appeal immediately.`,
              risk: "high",
              proposed_change: { action: "replace_disapproved_ad", policy_status: ad.policy_status },
            }),
          )
        }

        // meta/tt-stale-creative — creative fatigue by age.
        if (
          staleDays != null &&
          enabled &&
          agEnabled &&
          isEnabled(ad.status) &&
          ad.created_at &&
          cm.cost > 0 &&
          ageDays(ad.created_at, spec.snapshot_at) > staleDays
        ) {
          const age = ageDays(ad.created_at, spec.snapshot_at)
          out.push(
            flag(`${p}-stale-creative`, {
              type: "new_creative",
              target_level: "ad",
              target_external_id: ad.external_id,
              title: `Creative ${ad.external_id} is ${age} days old — past the ${staleDays}-day fatigue line`,
              rationale: `Ad ${ad.external_id} ("${ad.headlines[0] ?? "untitled"}") in "${adGroup.name}" has been live ${age} days while "${campaign.name}" spent ${fmtUsd(cm.cost)} this window. Doctrine presumes fatigue past ${staleDays} days on this channel — a successor should already be in flight.`,
              risk: "medium",
              proposed_change: { action: "refresh_creative", age_days: age, threshold_days: staleDays },
            }),
          )
        }
      }

      // Google-only keyword checks.
      if (spec.provider === "google_ads" && agEnabled && enabled) {
        for (const keyword of adGroup.keywords) {
          if (!isEnabled(keyword.status)) continue

          // gads-zero-impression-keyword — dead keywords (needs keyword rows).
          const km = byKeyword.get(keyword.text)
          if (km && km.impressions === 0) {
            out.push(
              flag("gads-zero-impression-keyword", {
                type: "pause",
                target_level: "keyword",
                target_external_id: keyword.text,
                title: `Prune "${keyword.text}" — zero impressions in ${window} days`,
                rationale: `Keyword "${keyword.text}" (${keyword.match_type}) in "${adGroup.name}" served 0 impressions over ${window} days. Dead keywords add management surface and mask the real query mix — prune or restructure.`,
                risk: "low",
                proposed_change: { action: "prune_keyword", match_type: keyword.match_type },
              }),
            )
          }

          // gads-low-quality-score-spend — QS ≤ 3 in a spending campaign.
          if (keyword.quality_score != null && keyword.quality_score <= 3 && cm.cost > 0) {
            out.push(
              flag("gads-low-quality-score-spend", {
                type: "structure",
                target_level: "keyword",
                target_external_id: keyword.text,
                title: `Quality Score ${keyword.quality_score} on spending keyword "${keyword.text}"`,
                rationale: `"${keyword.text}" carries QS ${keyword.quality_score}/10 while "${campaign.name}" spent ${fmtUsd(cm.cost)} this window — it overpays on every click and signals an ad/landing-page/ad-group mismatch. Fix the structure, not the bid.`,
                risk: "medium",
                proposed_change: {
                  action: "restructure_ad_group",
                  quality_score: keyword.quality_score,
                  match_type: keyword.match_type,
                },
              }),
            )
          }
        }
      }
    }
  }

  return out
}

/**
 * Sum the "detected waste" carried on pause-type red flags, normalized to a
 * monthly figure — powers the overview stat row.
 */
export function detectedWasteCents(recs: RecommendationInput[]): number {
  let total = 0
  for (const r of recs) {
    const w = r.proposed_change["waste_cents_monthly"]
    if (typeof w === "number") total += w
  }
  return total
}
