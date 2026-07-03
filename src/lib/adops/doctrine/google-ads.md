# Google Ads — Best Practices Doctrine

> **Purpose.** This is the playbook the audit engine diffs a live account against. The prose
> sections encode account-management doctrine the LLM reasons over; the final **RED FLAGS**
> section is a machine-checkable checklist the deterministic pre-check parses into guaranteed
> recommendations. Marketers edit this file; the engine and the LLM both obey it.

---

## Account structure

Google Ads has a fixed hierarchy: **Account → Campaign → Ad Group → (Keywords + Ads)**.
Structure is the single biggest lever on Quality Score, budget control, and reporting clarity —
budget, bid strategy, geo and schedule live at the **campaign** level; relevance (keyword ↔ ad
↔ landing page) is decided at the **ad group** level.

- **One theme per ad group.** Every keyword in an ad group maps to one searcher intent so a
  single ad set is genuinely relevant to all of them. Mixed-intent ad groups depress Quality Score.
- **Segment campaigns by the dimension you must control independently** — budget, geography,
  vertical margin, brand vs. non-brand. Two keyword sets that need different budgets belong in
  different campaigns, not different ad groups.
- **Separate brand and non-brand — always.** Brand terms convert at high rates and low CPCs and
  will flatter the blended numbers of prospecting campaigns, hiding poor performance. For an
  affiliate lead-gen book, this is doubly true: brand traffic is house money; non-brand is where
  margin is won or lost.
- **STAG over SKAG.** Group 3–15 tightly related keywords per ad group so Responsive Search Ads
  have query variety to optimize against. Single-keyword ad groups splinter conversion data below
  the volume Smart Bidding needs to learn.

## Budget & bid strategy

Match bid strategy to **conversion volume** — automated strategies need data to learn:

1. **Manual CPC / Maximize Clicks** — bootstrap only; migrate off as soon as conversions accrue.
2. **Maximize Conversions (no target)** — tracking is live but volume is thin.
3. **Target CPA** — only once a campaign reliably produces **~15–30 conversions / 30 days**.
4. **Target ROAS** — needs conversion *value* tracking and ~30+ valued conversions / 30d.

Do not skip rungs. A low-volume campaign jumped straight onto tCPA starves the learning phase
and produces volatile spend.

- **Budget-limited is a signal, not a steady state.** A campaign flagged "limited by budget"
  while converting profitably is leaving volume on the table — raise the budget or reallocate
  from an underperformer. A budget-limited campaign that is NOT converting should be fixed
  (targeting, bids) before it gets another dollar.
- **Daily budgets can overspend up to ~2× on a given day** (Google averages to daily × 30.4).
  Size against the monthly figure.
- **Reallocate toward marginal CPA, not average CPA** — move budget to campaigns where the
  *next* dollar still clears the allowable, away from campaigns past their efficient frontier.

## Keyword hygiene

- **Broad match only with Smart Bidding and a strong negative list.** Broad without negatives is
  the classic lead-gen budget-waster (searchers wanting *free*, *jobs*, *DIY*).
- **Shared negative lists are mandatory** — a global junk list applied across campaigns, plus
  brand negatives on non-brand campaigns and vice versa so the two never cannibalize.
- **Mine search terms weekly** on high-spend accounts. Converting queries become keywords;
  wasteful queries become negatives.
- **Prune zero-impression and long-term zero-conversion keywords** — they add management surface
  and mask the real term mix.

## Ad copy

- **≥ 2–3 enabled RSAs per ad group** is the durable floor; a single-ad ad group has no A/B
  signal and goes dark if that ad is disapproved. An enabled ad group with **zero** serving ads
  is dead spend surface.
- **10–15 distinct headlines, ≥ 4 descriptions** per RSA; include the theme keyword in a couple
  of headlines. Pin only what compliance requires.
- **Disapproved ads in enabled campaigns are emergencies** — for regulated lead-gen verticals
  (insurance, finance) a policy flag can silence a whole ad group overnight. Replace or appeal
  immediately.
- **CTR is the canary.** Search campaigns sustaining under ~1% CTR at meaningful volume have an
  ad-relevance or query-mix problem — refresh copy and check the term report before touching bids.

## Quality Score

Quality Score (1–10) = expected CTR + ad relevance + landing-page experience. **Spending
keywords at QS ≤ 3 overpay on every click** and almost always signal a structural mismatch —
wrong ad group, weak ad, or a generic landing page. Fix the structure, not the bid.

## Conversion tracking

Everything above assumes conversions are measured. **An account spending with zero recorded
conversions is flying blind** — either tracking is broken or the account is pure waste; both are
critical. Verify at least one conversion action fired in the window before trusting any other
number.

---

## RED FLAGS

> **Machine-checkable checklist.** Each bullet is one rule the deterministic pre-check
> (`redflags.ts`) evaluates against the AdSpec snapshot. Grammar:
>
> `- rule_id — when: <condition> — recommend: <RecommendationType> — action: <slug> — risk: <low|medium|high> — why: <rationale>`
>
> `recommend` MUST be one of the nine canonical types
> (`budget_change | pause | enable | keyword_add | keyword_negative | bid_change | new_creative | structure | other`).
> Metrics are trailing-30-day unless suffixed. Thresholds here are the documented defaults.

- `gads-no-conversion-tracking` — when: `account.cost_30d > 0 AND account.conversions_30d == 0` — recommend: `other` — action: `add_conversion_tracking` — risk: `high` — why: An account spending with zero recorded conversions is unmeasurable; this blocks every downstream optimization.
- `gads-spend-zero-conversions` — when: `campaign.status == enabled AND campaign.cost_30d >= 0.20 * account.cost_30d AND campaign.conversions_30d == 0` — recommend: `pause` — action: `pause_campaign` — risk: `high` — why: A campaign consuming ≥20% of account spend with zero conversions is bleeding budget; pause and diagnose before it spends more.
- `gads-disapproved-ad` — when: `campaign.status == enabled AND ad.policy_status == disapproved` — recommend: `new_creative` — action: `replace_disapproved_ad` — risk: `high` — why: A disapproved ad in an enabled campaign silences delivery and, in regulated verticals, risks account-level policy strikes.
- `gads-adgroup-no-active-ad` — when: `ad_group.status == enabled AND enabled_ad_count == 0` — recommend: `new_creative` — action: `add_rsa` — risk: `high` — why: An enabled ad group with no serving ad cannot show; it is dead spend surface.
- `gads-adgroup-single-ad` — when: `ad_group.status == enabled AND enabled_ad_count == 1` — recommend: `new_creative` — action: `add_rsa` — risk: `medium` — why: One RSA gives no A/B signal and the ad group goes dark if that ad is disapproved.
- `gads-zero-impression-keyword` — when: `keyword.status == enabled AND keyword.impressions_30d == 0` — recommend: `pause` — action: `prune_keyword` — risk: `low` — why: Zero-impression keywords add management surface and mask the real query mix; prune or restructure.
- `gads-low-quality-score-spend` — when: `keyword.status == enabled AND keyword.quality_score <= 3 AND campaign.cost_30d > 0` — recommend: `structure` — action: `restructure_ad_group` — risk: `medium` — why: A spending keyword at QS ≤ 3 overpays on every click; fix the ad-group/ad/landing-page mismatch, not the bid.
- `gads-premature-smart-bidding` — when: `campaign.bid_strategy IN (target_cpa, target_roas) AND campaign.conversions_30d < 15` — recommend: `bid_change` — action: `change_bid_strategy` — risk: `medium` — why: tCPA/tROAS need ~15–30 conversions/30d to stabilize; below that the learning phase starves and spend goes volatile.
- `gads-budget-limited-converting` — when: `campaign.is_budget_limited == true AND campaign.conversions_30d > 0` — recommend: `budget_change` — action: `increase_budget` — risk: `medium` — why: A budget-capped campaign that is converting is leaving profitable volume unclaimed; raise or reallocate.
- `gads-budget-limited-not-converting` — when: `campaign.is_budget_limited == true AND campaign.conversions_30d == 0` — recommend: `other` — action: `fix_targeting_before_budget` — risk: `medium` — why: Adding budget to a campaign that isn't converting scales waste; fix targeting first.
- `gads-low-ctr-high-impressions` — when: `campaign.impressions_30d >= 10000 AND campaign.ctr_30d < 0.01` — recommend: `new_creative` — action: `improve_ad_strength` — risk: `medium` — why: Search CTR under 1% at ≥10k impressions signals weak ad relevance or a polluted query mix; refresh copy and mine the term report.
