# Taboola — Best Practices Doctrine (Native / Advertorial)

> **Purpose.** Playbook the audit engine diffs a Taboola native account against. Prose grounds
> the LLM lane; the **RED FLAGS** section is machine-checkable. Marketers edit this file; the
> engine and the LLM both obey it.

---

## How native is different

Taboola buys attention on publisher content feeds. Traffic is cheap, intent is near zero, and
**quality varies wildly by placement (site)**. The whole discipline of native buying is
arbitrage hygiene: pay bottom-dollar CPCs, filter ruthlessly, and let the advertorial do the
selling that the click never promised.

- **The funnel is click → advertorial → lead form.** The ad's job is curiosity; the
  advertorial's job is conversion. A campaign with clicks and no conversions has a broken
  advertorial or garbage placements — the ad itself is usually fine.
- **In the AdSpec, Taboola campaigns carry one ad_group holding the creative pool.**

## Placement (site) hygiene — the core loop

- **Block relentlessly.** Review the "Sites" report at least weekly. Any placement that has
  spent **~2–3× the target CPA with zero conversions** gets blocked. Left alone, bot-heavy and
  low-quality feeds will quietly absorb the majority of budget.
- **Maintain a shared block list** across campaigns (the account's accumulated knowledge), plus
  campaign-level blocks for vertical-specific misfits.
- **A campaign with hundreds of clicks and zero conversions is a placement problem first.**
  Audit the sites report before touching creative or bids.

## Bidding & CPC floors

- **Start at the low end of the suggested CPC range and move in small steps.** Native is a
  bid-to-position market with no quality score; overbidding buys the same junk traffic faster.
- **Baseline non-brand lead-gen CPCs live around $0.25–$0.60** desktop, lower on mobile. A
  campaign averaging materially above its vertical norm without conversion efficiency to match
  is overpaying — cut the bid or let SmartBid work with a target.
- **SmartBid needs conversion volume** (same rule as everywhere: ~15+/30d) before target-based
  modes are trustworthy. Below that, fixed CPC with manual placement blocking wins.
- Separate **desktop / mobile / tablet into different campaigns** — CPCs and conversion rates
  differ enough to need independent bids and budgets.

## Creative & advertorial

- **CTR is the rent.** Healthy native CTR runs **~0.15–0.4%**; sustained CTR under ~0.08% at
  high impressions means the thumbnail/headline combo is invisible and Taboola will throttle
  delivery. Test 5–10 image+headline combos per campaign; kill the losers weekly.
- Curiosity-gap headlines with specificity ("Texas Homeowners Born Before 1975…") outperform
  generic benefit claims, but stay inside compliance — no fake news framing, no shock imagery.
- **Refresh the pool every 3–4 weeks**; native audiences see the same feeds daily and banner
  blindness sets in fast.
- Run **≥ 3 active creatives per campaign** so the network can rotate and you can read relative
  CTR; a single-creative campaign is unreadable.

## Measurement

Server-side (S2S) postback or the Taboola pixel must fire on the actual lead event. Spend with
zero recorded conversions across the account means tracking is dead — every optimization
decision downstream of that is fiction.

---

## RED FLAGS

> Grammar: `- rule_id — when: <condition> — recommend: <type> — action: <slug> — risk: <low|medium|high> — why: ...`
> Metrics are trailing-30-day. Thresholds are documented defaults.

- `tab-no-conversion-tracking` — when: `account.cost_30d > 0 AND account.conversions_30d == 0` — recommend: `other` — action: `fix_postback_tracking` — risk: `high` — why: Spend with zero recorded conversions means the S2S postback/pixel is dead; every downstream decision is fiction.
- `tab-spend-zero-conversions` — when: `campaign.status == enabled AND campaign.cost_30d >= 0.20 * account.cost_30d AND campaign.conversions_30d == 0` — recommend: `pause` — action: `pause_campaign` — risk: `high` — why: A campaign eating ≥20% of native spend with zero conversions is feeding bot-heavy placements; pause and audit the sites report.
- `tab-clicks-no-conversions` — when: `campaign.status == enabled AND campaign.clicks_30d >= 500 AND campaign.conversions_30d == 0` — recommend: `other` — action: `review_block_placements` — risk: `high` — why: Hundreds of clicks with zero conversions is a placement-quality problem first — block the spending-but-not-converting sites before touching creative or bids.
- `tab-low-ctr-high-impressions` — when: `campaign.impressions_30d >= 100000 AND campaign.ctr_30d < 0.0008` — recommend: `new_creative` — action: `refresh_creative` — risk: `medium` — why: Native CTR under 0.08% at high impressions means the thumbnail/headline combo is invisible and the network will throttle delivery.
- `tab-single-creative` — when: `ad_group.status == enabled AND enabled_ad_count <= 1` — recommend: `new_creative` — action: `add_creative_variants` — risk: `medium` — why: A single-creative campaign gives the network nothing to rotate and you nothing to read; run 3+ image/headline combos.
- `tab-premature-smartbid-target` — when: `campaign.bid_strategy IN (target_cpa, smartbid_target) AND campaign.conversions_30d < 15` — recommend: `bid_change` — action: `change_bid_strategy` — risk: `medium` — why: Target-based SmartBid below ~15 conversions/30d optimizes on noise; run fixed CPC with manual placement blocking until volume justifies it.
- `tab-budget-limited-converting` — when: `campaign.is_budget_limited == true AND campaign.conversions_30d > 0` — recommend: `budget_change` — action: `increase_budget` — risk: `medium` — why: A converting, budget-capped native campaign is leaving cheap leads unclaimed.
