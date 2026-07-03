/**
 * Fixtures — 4 seeded ad accounts for the demo, shaped like a real affiliate
 * lead-gen book (insurance / home-services / finance verticals).
 *
 * Each AdSpec contains DELIBERATE doctrine violations so the deterministic
 * red-flag engine finds real issues live:
 *
 *   google_ads : budget-limited-while-converting, 21% spender w/ 0 conv,
 *                single-ad ad group, QS 2 keyword, zero-impression keyword,
 *                tCPA on 8 conversions
 *   meta_ads   : frequency 6.8 retargeting, 95-day-old creative, disapproved
 *                ad, 22% spender w/ 0 conv (which is also under the CTR floor)
 *   taboola    : 9.9k clicks w/ 0 conv (placement audit + pause), CTR under
 *                the native floor, single-creative campaign
 *   tiktok_ads : 48-day-old creative (30d fatigue line), cost cap on 9 conv,
 *                21% spender w/ 0 conv, single-ad ad group
 *
 * `buildFixtureSpec` stamps snapshot_at (and creative ages relative to it) at
 * call time so the checks fire on any wall-clock date.
 */

import type { AdSpec, Provider, RecommendationInput } from "../types"

// ─── Seed account rows (store metadata, not part of the AdSpec) ──────────────

export type Autonomy = "propose" | "approve" | "auto"

export interface AccountSeed {
  id: string
  provider: Provider
  name: string
  external_id: string
  autonomy: Autonomy
  cadence_hours: number
  spend_cap_cents: number | null
  enabled: boolean
  /** Offset (hours, may be negative = overdue) from seed time to next_run_at. */
  next_run_offset_hours: number
}

export const ACCOUNT_SEEDS: AccountSeed[] = [
  {
    id: "acct-google",
    provider: "google_ads",
    name: "Search — Lead Gen",
    external_id: "493-201-8846",
    autonomy: "approve",
    cadence_hours: 12,
    spend_cap_cents: 50_000, // $500 — approve tier w/ cap
    enabled: true,
    next_run_offset_hours: -2, // overdue → drained by "Run sweep"
  },
  {
    id: "acct-meta",
    provider: "meta_ads",
    name: "Prospecting + Retargeting",
    external_id: "act_2840159372",
    autonomy: "auto",
    cadence_hours: 6,
    spend_cap_cents: 100_000, // $1,000 — the auto-WITH-cap account (eligible path)
    enabled: true,
    next_run_offset_hours: -1,
  },
  {
    id: "acct-taboola",
    provider: "taboola",
    name: "Native — Advertorials",
    external_id: "taboola-1194822",
    autonomy: "auto",
    cadence_hours: 24,
    spend_cap_cents: null, // auto WITHOUT cap — demos the fail-closed BLOCKED verdict
    enabled: true,
    // DUE (overdue) so the guided "Run sweep → inbox → approve" path surfaces
    // a rec that BLOCKS on approval — the marquee fail-closed safety moment.
    next_run_offset_hours: -3,
  },
  {
    id: "acct-tiktok",
    provider: "tiktok_ads",
    name: "Spark Ads",
    external_id: "tt-7218849302",
    autonomy: "propose",
    cadence_hours: 48,
    spend_cap_cents: null,
    enabled: true,
    next_run_offset_hours: 20,
  },
]

// ─── Spec builders ───────────────────────────────────────────────────────────

const daysBefore = (iso: string, days: number) =>
  new Date(new Date(iso).getTime() - days * 86_400_000).toISOString()

function googleSpec(now: string): AdSpec {
  return {
    version: 1,
    provider: "google_ads",
    account: { external_id: "493-201-8846", name: "Search — Lead Gen", currency: "USD", timezone: "America/New_York" },
    snapshot_at: now,
    campaigns: [
      {
        external_id: "c-g1",
        name: "Medicare Advantage — Search — Broad — US",
        status: "enabled",
        type: "search",
        budget: { amount_cents: 25_000, period: "daily" },
        bid_strategy: "maximize_conversions",
        is_budget_limited: true, // VIOLATION: budget-limited while converting
        ad_groups: [
          {
            external_id: "ag-g1a",
            name: "Medicare Advantage Plans 2026",
            status: "enabled",
            keywords: [
              { text: "medicare advantage plans 2026", match_type: "broad", status: "enabled", quality_score: 8 },
              { text: "medicare advantage enrollment", match_type: "phrase", status: "enabled", quality_score: 7 },
              { text: "compare medicare plans", match_type: "broad", status: "enabled", quality_score: 7 },
            ],
            ads: [
              rsa("ad-g1a-1", "2026 Medicare Advantage Plans", "Compare top-rated plans in 2 minutes."),
              rsa("ad-g1a-2", "Medicare Enrollment Is Open", "See $0-premium plans in your ZIP."),
              rsa("ad-g1a-3", "Compare Medicare Plans Free", "Licensed agents. No obligation."),
            ],
          },
        ],
      },
      {
        external_id: "c-g2",
        name: "Home Warranty — Search — Phrase — TX/FL",
        status: "enabled",
        type: "search",
        budget: { amount_cents: 15_000, period: "daily" },
        bid_strategy: "maximize_conversions",
        ad_groups: [
          {
            external_id: "ag-g2a",
            name: "Home Warranty Quotes",
            status: "enabled",
            keywords: [
              // VIOLATION: QS 2 keyword in a spending campaign
              { text: "home warranty companies", match_type: "phrase", status: "enabled", quality_score: 2 },
              // VIOLATION: zero-impression keyword (see keyword metric row)
              { text: "best home warranty texas", match_type: "exact", status: "enabled", quality_score: 6 },
              { text: "home warranty cost", match_type: "phrase", status: "enabled", quality_score: 5 },
            ],
            // VIOLATION: single enabled ad
            ads: [rsa("ad-g2a-1", "Home Warranty From $39/mo", "Protect appliances + systems today.")],
          },
        ],
      },
      {
        external_id: "c-g3",
        name: "Auto Insurance — Search — Exact — Brand+Generic",
        status: "enabled",
        type: "search",
        budget: { amount_cents: 8_000, period: "daily" },
        bid_strategy: "target_cpa", // VIOLATION: tCPA on 8 conversions
        ad_groups: [
          {
            external_id: "ag-g3a",
            name: "Auto Insurance Quotes",
            status: "enabled",
            keywords: [
              { text: "cheap auto insurance quotes", match_type: "exact", status: "enabled", quality_score: 6 },
              { text: "auto insurance comparison", match_type: "exact", status: "enabled", quality_score: 7 },
            ],
            ads: [
              rsa("ad-g3a-1", "Auto Insurance From $29/mo", "Compare 10+ carriers in one search."),
              rsa("ad-g3a-2", "Overpaying For Car Insurance?", "Drivers save $412/yr on average."),
            ],
          },
        ],
      },
      {
        external_id: "c-g4",
        name: "Final Expense — Search — Broad — National",
        status: "enabled",
        type: "search",
        budget: { amount_cents: 20_000, period: "daily" },
        bid_strategy: "maximize_conversions",
        ad_groups: [
          {
            external_id: "ag-g4a",
            name: "Final Expense Insurance",
            status: "enabled",
            keywords: [
              { text: "final expense insurance", match_type: "broad", status: "enabled", quality_score: 8 },
              { text: "burial insurance for seniors", match_type: "phrase", status: "enabled", quality_score: 7 },
            ],
            ads: [
              rsa("ad-g4a-1", "Final Expense Coverage 50-85", "No medical exam. Rates from $18/mo."),
              rsa("ad-g4a-2", "Burial Insurance Quotes", "Lock in your rate today."),
              rsa("ad-g4a-3", "Seniors: Compare Coverage", "2-minute quote. No obligation."),
            ],
          },
        ],
      },
    ],
    metrics: {
      window_days: 30,
      rows: [
        row("campaign", "c-g1", 182_000, 6_370, 1_254_000, 402, 0),
        row("campaign", "c-g2", 51_500, 2_060, 618_000, 0, 0), // 21.4% of spend, 0 conv
        row("campaign", "c-g3", 22_000, 1_200, 420_000, 8, 0),
        row("campaign", "c-g4", 96_000, 3_100, 590_000, 61, 0),
        row("keyword", "home warranty companies", 18_400, 610, 214_000, 0, 0),
        row("keyword", "best home warranty texas", 0, 0, 0, 0, 0), // dead keyword
        row("keyword", "medicare advantage plans 2026", 104_000, 3_900, 760_000, 262, 0),
      ],
    },
  }
}

function metaSpec(now: string): AdSpec {
  return {
    version: 1,
    provider: "meta_ads",
    account: { external_id: "act_2840159372", name: "Prospecting + Retargeting", currency: "USD", timezone: "America/New_York" },
    snapshot_at: now,
    campaigns: [
      {
        external_id: "c-m1",
        name: "Prospecting — Home Services — Broad — US",
        status: "active",
        type: "conversions",
        budget: { amount_cents: 30_000, period: "daily" },
        bid_strategy: "lowest_cost",
        ad_groups: [
          {
            external_id: "ag-m1a",
            name: "Broad — Advantage+ Placements",
            status: "active",
            keywords: [],
            ads: [
              creative("ad-m1a-1", "video", "Your Roof Could Be Costing You Thousands", now, 12),
              creative("ad-m1a-2", "video", "Homeowners: This Gutter Upgrade Pays For Itself", now, 95), // VIOLATION: 95-day-old creative
              creative("ad-m1a-3", "image", "Free Roof Inspection — Book In 60 Seconds", now, 21),
              {
                // VIOLATION: disapproved ad in an enabled campaign
                external_id: "ad-m1a-4",
                type: "image",
                headlines: ["Are YOU Overpaying For Home Repairs?"],
                descriptions: ["Personal-attribute framing tripped policy review."],
                asset_urls: ["https://cdn.example.com/meta/repairs-static-04.jpg"],
                status: "active",
                policy_status: "disapproved",
                created_at: daysBefore(now, 9),
              },
            ],
          },
        ],
      },
      {
        external_id: "c-m2",
        name: "Retargeting — Site Visitors 30d",
        status: "active",
        type: "conversions",
        budget: { amount_cents: 8_000, period: "daily" },
        bid_strategy: "lowest_cost",
        ad_groups: [
          {
            external_id: "ag-m2a",
            name: "Visitors 30d — All Placements",
            status: "active",
            keywords: [],
            ads: [
              creative("ad-m2a-1", "video", "Still Thinking It Over? Quotes Expire Friday", now, 34),
              creative("ad-m2a-2", "carousel", "3 Neighbors Booked This Week", now, 18),
            ],
          },
        ],
      },
      {
        external_id: "c-m3",
        name: "Prospecting — Medicare — Interest Stack (legacy)",
        status: "active",
        type: "conversions",
        budget: { amount_cents: 12_000, period: "daily" },
        bid_strategy: "lowest_cost",
        ad_groups: [
          {
            external_id: "ag-m3a",
            name: "Interests: Medicare + AARP + Retirement",
            status: "active",
            keywords: [],
            ads: [
              creative("ad-m3a-1", "image", "New Medicare Benefits Announced", now, 41),
              creative("ad-m3a-2", "video", "Seniors: Check Your ZIP For Giveback", now, 39),
            ],
          },
        ],
      },
    ],
    metrics: {
      window_days: 30,
      rows: [
        rowF("campaign", "c-m1", 2_400_000, 21_600, 1_890_000, 610, 0, 2.1),
        rowF("campaign", "c-m2", 310_000, 4_030, 412_000, 155, 0, 6.8), // VIOLATION: frequency 6.8
        rowF("campaign", "c-m3", 800_000, 5_300, 640_000, 0, 0, 2.9), // 21.8% of spend, 0 conv + CTR 0.66%
      ],
    },
  }
}

function taboolaSpec(now: string): AdSpec {
  return {
    version: 1,
    provider: "taboola",
    account: { external_id: "taboola-1194822", name: "Native — Advertorials", currency: "USD", timezone: "America/New_York" },
    snapshot_at: now,
    campaigns: [
      {
        external_id: "c-t1",
        name: "Advertorial — Gutter Guards — Desktop US",
        status: "enabled",
        type: "native",
        budget: { amount_cents: 10_000, period: "daily" },
        bid_strategy: "fixed_cpc",
        ad_groups: [
          {
            external_id: "ag-t1a",
            name: "Gutter Guards — Creative Pool",
            status: "enabled",
            keywords: [],
            ads: [
              native("ad-t1a-1", "Homeowners Are Ditching Gutter Cleaning For Good", now, 22),
              native("ad-t1a-2", "The Gutter Upgrade Contractors Don't Advertise", now, 15),
              native("ad-t1a-3", "Why Smart Homeowners Never Clean Gutters", now, 8),
            ],
          },
        ],
      },
      {
        external_id: "c-t2",
        name: "Advertorial — Medicare Giveback — Mobile",
        status: "enabled",
        type: "native",
        budget: { amount_cents: 12_000, period: "daily" },
        bid_strategy: "smartbid_target",
        ad_groups: [
          {
            external_id: "ag-t2a",
            name: "Medicare Giveback — Creative Pool",
            status: "enabled",
            keywords: [],
            ads: [
              native("ad-t2a-1", "Seniors In [state] Could Get $174 Back Monthly", now, 19),
              native("ad-t2a-2", "The Medicare 'Giveback' Few Seniors Claim", now, 11),
              native("ad-t2a-3", "Born Before 1965? Check Your ZIP", now, 6),
            ],
          },
        ],
      },
      {
        external_id: "c-t3",
        name: "Advertorial — Walk-in Tubs — Desktop",
        status: "enabled",
        type: "native",
        budget: { amount_cents: 6_000, period: "daily" },
        bid_strategy: "fixed_cpc",
        ad_groups: [
          {
            external_id: "ag-t3a",
            name: "Walk-in Tubs — Creative Pool",
            status: "enabled",
            keywords: [],
            // VIOLATION: single creative — nothing to rotate, nothing to read
            ads: [native("ad-t3a-1", "Walk-in Tubs Now Covered For Many Seniors", now, 27)],
          },
        ],
      },
    ],
    metrics: {
      window_days: 30,
      rows: [
        // VIOLATION: 9,880 clicks, $4,450, 0 conversions (37% of spend) →
        // placement audit + pause both fire
        row("campaign", "c-t1", 5_200_000, 9_880, 445_000, 0, 0),
        row("campaign", "c-t2", 9_800_000, 15_930, 531_000, 84, 0),
        // VIOLATION: CTR 0.074% — under the 0.08% native floor at 4.1M impressions
        row("campaign", "c-t3", 4_100_000, 3_050, 214_000, 12, 0),
      ],
    },
  }
}

function tiktokSpec(now: string): AdSpec {
  return {
    version: 1,
    provider: "tiktok_ads",
    account: { external_id: "tt-7218849302", name: "Spark Ads", currency: "USD", timezone: "America/New_York" },
    snapshot_at: now,
    campaigns: [
      {
        external_id: "c-k1",
        name: "Spark — Home Improvement Leads — Broad",
        status: "enabled",
        type: "lead_generation",
        budget: { amount_cents: 15_000, period: "daily" },
        bid_strategy: "lowest_cost",
        ad_groups: [
          {
            external_id: "ag-k1a",
            name: "Spark — Creator Whitelist Pool",
            status: "enabled",
            keywords: [],
            ads: [
              creative("ad-k1a-1", "spark_video", "POV: your contractor quote just dropped 40%", now, 10),
              creative("ad-k1a-2", "spark_video", "i asked 3 roofers the same question…", now, 48), // VIOLATION: 48 days > 30-day fatigue line
              creative("ad-k1a-3", "spark_video", "the free inspection nobody tells homeowners about", now, 6),
              creative("ad-k1a-4", "spark_video", "renovation math that actually makes sense", now, 3),
            ],
          },
        ],
      },
      {
        external_id: "c-k2",
        name: "Spark — Solar Quiz — Cost Cap",
        status: "enabled",
        type: "lead_generation",
        budget: { amount_cents: 9_000, period: "daily" },
        bid_strategy: "cost_cap", // VIOLATION: cost cap on 9 conversions
        ad_groups: [
          {
            external_id: "ag-k2a",
            name: "Solar Quiz — Hooks",
            status: "enabled",
            keywords: [],
            ads: [
              creative("ad-k2a-1", "spark_video", "your power bill is lying to you", now, 14),
              creative("ad-k2a-2", "spark_video", "60-second solar quiz (no salesman)", now, 9),
            ],
          },
        ],
      },
      {
        external_id: "c-k3",
        name: "Non-Spark — Insurance — Legacy Dark Ads",
        status: "enabled",
        type: "lead_generation",
        budget: { amount_cents: 5_000, period: "daily" },
        bid_strategy: "lowest_cost",
        ad_groups: [
          {
            external_id: "ag-k3a",
            name: "Dark Ads — Insurance",
            status: "enabled",
            keywords: [],
            // VIOLATION: single active ad
            ads: [creative("ad-k3a-1", "video", "Compare Insurance Rates In Your State", now, 25)],
          },
        ],
      },
    ],
    metrics: {
      window_days: 30,
      rows: [
        row("campaign", "c-k1", 3_800_000, 41_800, 980_000, 720, 0),
        row("campaign", "c-k2", 1_900_000, 11_100, 385_000, 9, 0),
        // VIOLATION: 20.9% of spend, 0 conversions
        row("campaign", "c-k3", 1_600_000, 6_600, 360_000, 0, 0),
      ],
    },
  }
}

// ─── Tiny builders ───────────────────────────────────────────────────────────

function rsa(id: string, h1: string, d1: string) {
  return {
    external_id: id,
    type: "responsive_search_ad",
    headlines: [h1, "Get Your Free Quote", "Compare Top Providers"],
    descriptions: [d1, "Fast, free, no obligation."],
    asset_urls: [],
    status: "enabled",
  }
}

function creative(id: string, type: string, hook: string, now: string, ageDays: number) {
  return {
    external_id: id,
    type,
    headlines: [hook],
    descriptions: ["Learn more"],
    asset_urls: [`https://cdn.example.com/${id}.mp4`],
    status: "active",
    created_at: daysBefore(now, ageDays),
  }
}

function native(id: string, headline: string, now: string, ageDays: number) {
  return {
    external_id: id,
    type: "native_image",
    headlines: [headline],
    descriptions: [],
    asset_urls: [`https://cdn.example.com/${id}.jpg`],
    status: "enabled",
    created_at: daysBefore(now, ageDays),
  }
}

function row(
  level: "account" | "campaign" | "ad_group" | "ad" | "keyword",
  id: string,
  impressions: number,
  clicks: number,
  cost_cents: number,
  conversions: number,
  conversion_value_cents: number,
) {
  return { level, external_id: id, impressions, clicks, cost_cents, conversions, conversion_value_cents }
}

function rowF(
  level: "account" | "campaign" | "ad_group" | "ad" | "keyword",
  id: string,
  impressions: number,
  clicks: number,
  cost_cents: number,
  conversions: number,
  conversion_value_cents: number,
  frequency: number,
) {
  return { ...row(level, id, impressions, clicks, cost_cents, conversions, conversion_value_cents), frequency }
}

// ─── Public API ──────────────────────────────────────────────────────────────

const BUILDERS: Record<string, (now: string) => AdSpec> = {
  "acct-google": googleSpec,
  "acct-meta": metaSpec,
  "acct-taboola": taboolaSpec,
  "acct-tiktok": tiktokSpec,
}

/** Build a fresh fixture snapshot for an account, stamped at `now`. */
export function buildFixtureSpec(accountId: string, now: string = new Date().toISOString()): AdSpec {
  const builder = BUILDERS[accountId]
  if (!builder) throw new Error(`No fixture spec for account "${accountId}"`)
  return builder(now)
}

/** A deliberately CLEAN spec (no violations) — used by tests as the control. */
export function buildCleanSpec(now: string = new Date().toISOString()): AdSpec {
  return {
    version: 1,
    provider: "google_ads",
    account: { external_id: "000-000-0000", name: "Clean Control", currency: "USD", timezone: "UTC" },
    snapshot_at: now,
    campaigns: [
      {
        external_id: "c-clean",
        name: "Healthy Campaign",
        status: "enabled",
        type: "search",
        budget: { amount_cents: 10_000, period: "daily" },
        bid_strategy: "maximize_conversions",
        ad_groups: [
          {
            external_id: "ag-clean",
            name: "Healthy Ad Group",
            status: "enabled",
            keywords: [{ text: "healthy keyword", match_type: "phrase", status: "enabled", quality_score: 8 }],
            ads: [
              rsa("ad-clean-1", "Great Offer", "It converts."),
              rsa("ad-clean-2", "Better Offer", "It also converts."),
              rsa("ad-clean-3", "Best Offer", "Everything converts."),
            ],
          },
        ],
      },
    ],
    metrics: {
      window_days: 30,
      rows: [
        row("campaign", "c-clean", 50_000, 2_500, 300_000, 120, 0),
        row("keyword", "healthy keyword", 50_000, 2_500, 300_000, 120, 0),
      ],
    },
  }
}

// ─── Precomputed LLM-lane recommendations (used when ANTHROPIC_API_KEY unset) ─
//
// These stand in for the judgment calls the deterministic layer can't make:
// structure, bid-strategy maturity, budget reallocation. Written to read like
// real strategist output grounded in the fixture numbers.

export const FIXTURE_LLM_RECS: Record<string, RecommendationInput[]> = {
  "acct-google": [
    {
      type: "budget_change",
      target_level: "campaign",
      target_external_id: "c-g1",
      title: "Reallocate Home Warranty budget into Medicare Advantage",
      rationale:
        "Medicare Advantage converts 402 times at ~$31 CPA and is budget-limited, while Home Warranty burned $6,180 with zero conversions. Move the $150/day Home Warranty budget onto the proven winner instead of raising net spend.",
      proposed_change: { action: "reallocate_budget", from_campaign: "c-g2", to_campaign: "c-g1", amount_cents_daily: 15_000 },
      estimated_impact: "~$4,500/mo shifted from waste to ~$31 CPA volume",
      risk: "medium",
    },
    {
      type: "keyword_negative",
      target_level: "account",
      target_external_id: "493-201-8846",
      title: "Add a shared negative list before scaling broad match",
      rationale:
        "Two campaigns run broad match with no shared negative list in the snapshot. For lead-gen doctrine this is the single most common waste source — build a global junk list (free, jobs, salary, DIY, reviews) and apply it account-wide.",
      proposed_change: { action: "add_negative_keyword_list", list_name: "Global Junk — Lead Gen", terms: ["free", "jobs", "salary", "diy", "reviews"] },
      risk: "low",
    },
    {
      type: "structure",
      target_level: "campaign",
      target_external_id: "c-g3",
      title: "Split brand terms out of Auto Insurance before trusting its CPA",
      rationale:
        'Campaign "Auto Insurance — Exact — Brand+Generic" blends brand and generic exact-match terms. Brand clicks flatter the blended CPA and will mislead the tCPA target once volume recovers — separate brand into its own tightly-capped campaign.',
      proposed_change: { action: "separate_brand_campaign", campaign: "c-g3" },
      risk: "low",
    },
  ],
  "acct-meta": [
    // Deliberate duplicate of the meta-spend-zero-conversions red flag on c-m3:
    // demonstrates dedupe precedence (the red flag wins, this LLM copy is dropped).
    {
      type: "pause",
      target_level: "campaign",
      target_external_id: "c-m3",
      title: "Pause the legacy Medicare interest-stack campaign",
      rationale:
        "Interest-stack targeting is pre-Advantage+ era and this one spent $6,400 with zero conversions. Pause it; broad + creative-as-targeting has replaced this structure.",
      proposed_change: { action: "pause_campaign" },
      risk: "high",
    },
    {
      type: "structure",
      target_level: "campaign",
      target_external_id: "c-m1",
      title: "Fold Medicare prospecting into a broad CBO portfolio",
      rationale:
        "Doctrine: fewer, bigger ad sets exit learning faster (~50 conv/week needed). Rather than reviving the interest-stack, add a Medicare broad ad set inside the winning Home Services CBO structure where 610 conversions of learning signal already live.",
      proposed_change: { action: "restructure_campaign", into: "c-m1", add_ad_set: "Medicare — Broad" },
      risk: "medium",
    },
    {
      type: "budget_change",
      target_level: "campaign",
      target_external_id: "c-m2",
      title: "Trim retargeting budget until the pool supports it",
      rationale:
        "Retargeting is at frequency 6.8 on a 30-day pool — the budget is oversized for the audience. Cut ~30% and let prospecting refill the pool; scale back ≤20%/day once frequency sits near 3.",
      proposed_change: { action: "decrease_budget", current_budget_cents: 8_000, proposed_budget_cents: 5_500 },
      estimated_impact: "Lowers CPM pressure and negative feedback on a burned audience",
      risk: "medium",
    },
  ],
  "acct-taboola": [
    {
      type: "bid_change",
      target_level: "campaign",
      target_external_id: "c-t1",
      title: "Drop Gutter Guards CPC toward the floor while placements are audited",
      rationale:
        "At $0.45 average CPC with zero conversions, this campaign is paying mid-range prices for junk placements. While the site blocklist is rebuilt, cut the fixed CPC to the low end of the suggested range — overbidding just buys the same bot traffic faster.",
      proposed_change: { action: "decrease_bid", current_cpc_cents: 45, proposed_cpc_cents: 28 },
      risk: "medium",
    },
    {
      type: "structure",
      target_level: "campaign",
      target_external_id: "c-t3",
      title: "Split Walk-in Tubs desktop/mobile and rebuild its creative pool",
      rationale:
        "Walk-in Tubs runs one creative on a blended device mix at 0.074% CTR. Native doctrine wants device-split campaigns (independent bids) and 3+ creatives per pool so relative CTR is readable.",
      proposed_change: { action: "split_by_device", campaign: "c-t3", devices: ["desktop", "mobile"] },
      risk: "low",
    },
  ],
  "acct-tiktok": [
    {
      type: "structure",
      target_level: "campaign",
      target_external_id: "c-k3",
      title: "Retire the legacy dark-ads campaign into a Spark test cell",
      rationale:
        "Non-Spark dark ads under-CTR whitelisted creator posts on this account (1.1% vs 0.41%). Fold the insurance vertical into the Spark pipeline as a new creator cell instead of maintaining a separate legacy structure.",
      proposed_change: { action: "migrate_to_spark", campaign: "c-k3" },
      risk: "medium",
    },
    {
      type: "other",
      target_level: "account",
      target_external_id: "tt-7218849302",
      title: "Contract 2 more whitelisted creators to sustain refresh velocity",
      rationale:
        "The account ships ~2 new videos/week against a doctrine target of 3–5 per ad group. Fatigue is already visible (48-day-old asset still live). The bottleneck is creator supply, not media buying.",
      proposed_change: { action: "expand_creator_whitelist", target_creators: 5 },
      risk: "low",
    },
  ],
}
