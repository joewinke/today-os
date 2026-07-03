# TikTok Ads — Best Practices Doctrine

> **Purpose.** Playbook the audit engine diffs a TikTok Ads account against. Prose grounds the
> LLM lane; the **RED FLAGS** section is machine-checkable. Marketers edit this file; the
> engine and the LLM both obey it.

---

## The platform's physics

TikTok is a creative-velocity machine. The algorithm finds the audience; the buyer's job is to
feed it a constant stream of native-feeling video. Everything that works on Meta works here
*faster*: learning is faster, fatigue is faster, and winners die younger.

- **Creative fatigue arrives in 1–2 weeks**, not the 4–8 weeks Meta allows. Any enabled ad
  older than **~30 days** at sustained spend is presumed fatigued and should already have a
  successor in flight.
- **Ship 3–5 new videos per ad group per week** on scaling accounts. Winners are found by
  volume of swings, not by polishing one asset.
- **Native or nothing.** Ads that look like ads get scrolled. UGC-style, creator-voiced,
  first-3-seconds hook, captions on. "Don't make ads, make TikToks" is the operating rule,
  not a slogan.

## Spark Ads

- **Prefer Spark Ads** (boosting real posts from a creator or brand handle) over dark ads —
  they carry social proof, keep engagement on the post, and consistently out-CTR white-label
  ads for lead gen.
- Maintain whitelisting agreements with 3–5 creators per vertical so the Spark pipeline never
  starves.

## Structure & learning phase

- Hierarchy is **Account → Campaign → Ad Group → Ads** (maps 1:1 onto the AdSpec).
- **~50 conversions per ad group per week** to exit learning — same physics as Meta.
  Consolidate: few ad groups, broad targeting, budget concentrated.
- **3–5 active ads per ad group.** One ad = nothing for ACO to rotate; ten = budget spread too
  thin to exit learning.
- Use **Smart/Automated creative optimization** to auto-rotate hooks, but keep reading
  per-creative CTR and CPA weekly — kill decayed assets manually; the platform is slow to.

## Bidding & budget

- Start on **Lowest Cost** (no bid cap) until an ad group clears the learning phase; only then
  layer Cost Cap at ~1.1–1.2× the achieved CPA. Cost caps on thin data strangle delivery.
- Scale budgets **≤ 50%/day at most** (TikTok tolerates faster scaling than Meta, but re-entry
  into learning is still the tax).
- **CTR floor:** healthy in-feed CTR runs **~0.8–1.5%** for lead gen. Sustained CTR under
  ~0.4% at ≥50k impressions means the hook is dead.

## Compliance & measurement

- Lead-gen verticals (insurance, finance, home services) face aggressive ad review; a rejected
  ad in an enabled ad group kills delivery silently. Replace immediately — repeated rejections
  degrade the account's standing.
- **Events API + pixel, both.** Optimize to the lead event, not clicks; verify platform
  conversions against the CRM weekly (TikTok's attribution flatters itself even more than
  Meta's).

---

## RED FLAGS

> Grammar: `- rule_id — when: <condition> — recommend: <type> — action: <slug> — risk: <low|medium|high> — why: ...`
> Metrics are trailing-30-day. Thresholds are documented defaults.

- `tt-no-conversion-tracking` — when: `account.cost_30d > 0 AND account.conversions_30d == 0` — recommend: `other` — action: `fix_events_api` — risk: `high` — why: Spend with zero reported conversions means the pixel/Events API is broken or the funnel is; stop scaling until measured.
- `tt-spend-zero-conversions` — when: `campaign.status == enabled AND campaign.cost_30d >= 0.20 * account.cost_30d AND campaign.conversions_30d == 0` — recommend: `pause` — action: `pause_campaign` — risk: `high` — why: A campaign consuming ≥20% of account spend with zero conversions is waste; pause and diagnose creative/landing fit.
- `tt-stale-creative` — when: `ad.status == enabled AND ad.age_days > 30 AND campaign.cost_30d > 0` — recommend: `new_creative` — action: `refresh_creative` — risk: `medium` — why: TikTok fatigue arrives in 1–2 weeks; an enabled ad past ~30 days at sustained spend is presumed fatigued — a successor should already be live.
- `tt-adgroup-single-ad` — when: `ad_group.status == enabled AND enabled_ad_count <= 1` — recommend: `new_creative` — action: `add_creative_variants` — risk: `medium` — why: One ad gives ACO nothing to rotate; run 3–5 actives per ad group.
- `tt-disapproved-ad` — when: `campaign.status == enabled AND ad.policy_status == disapproved` — recommend: `new_creative` — action: `replace_disapproved_ad` — risk: `high` — why: A rejected ad in an enabled ad group kills delivery silently, and repeated rejections degrade account standing.
- `tt-low-ctr-high-impressions` — when: `campaign.impressions_30d >= 50000 AND campaign.ctr_30d < 0.004` — recommend: `new_creative` — action: `refresh_creative` — risk: `medium` — why: In-feed CTR under 0.4% at volume means the hook is dead; ship new videos, don't tweak bids.
- `tt-premature-cost-cap` — when: `campaign.bid_strategy IN (cost_cap, target_cpa) AND campaign.conversions_30d < 15` — recommend: `bid_change` — action: `change_bid_strategy` — risk: `medium` — why: Cost caps on thin conversion data strangle delivery before learning completes; run Lowest Cost until volume justifies a cap.
- `tt-budget-limited-converting` — when: `campaign.is_budget_limited == true AND campaign.conversions_30d > 0` — recommend: `budget_change` — action: `increase_budget` — risk: `medium` — why: A converting, budget-capped ad group is leaving cheap leads unclaimed; TikTok tolerates ≤50%/day scaling.
