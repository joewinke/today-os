# Meta Ads — Best Practices Doctrine

> **Purpose.** Playbook the audit engine diffs a Meta (Facebook/Instagram) account against.
> Prose grounds the LLM lane; the **RED FLAGS** section is machine-checkable. Marketers edit
> this file; the engine and the LLM both obey it.

---

## Account structure

Meta's hierarchy is **Account → Campaign → Ad Set → Ads**. In the AdSpec these map to
campaign → ad_group → ads (ad sets are recorded as ad groups).

- **Separate prospecting and retargeting — always.** They have different allowable CPAs,
  different creative jobs, and different frequency tolerances. Blending them lets cheap
  retargeting conversions subsidize (and hide) failing prospecting.
- **Consolidate, don't fragment.** Since the learning-phase overhaul, fewer ad sets with bigger
  budgets exit learning faster. An ad set needs **~50 conversions/week** to leave the learning
  phase — ad sets that never get there are permanently unstable. Merge thin ad sets.
- **Broad targeting + Advantage+ placements is the modern default** for lead gen. Creative is
  the targeting now: the algorithm finds the audience per-creative, so the account's edge lives
  in the creative pipeline, not stacked interest segments.
- **Exclude converters from prospecting** (customer-list and pixel exclusions) so prospecting
  spend never re-buys people who already submitted a lead.

## Creative doctrine — fatigue is the tax

Creative fatigue is the dominant failure mode on Meta. Watch two dials:

- **Frequency.** For prospecting, average frequency over a 30-day window should live at
  **~2–3**. **Above 4 the audience is being burned**: CTR sinks, CPM rises, and negative
  feedback climbs. Retargeting tolerates more (6–8) but only with a rotating creative pool.
- **Creative age.** A workhorse ad older than **~60 days** at sustained spend is living on
  borrowed time. High-spend accounts should land fresh concepts (not just recuts) every 2–4
  weeks. Track wear-out by creative, not by ad set: when CPA on a veteran creative drifts
  20–30% above its trailing norm, replace it before it drags the ad set back into learning.
- **3–6 active ads per ad set.** One ad = no signal for the delivery system to optimize
  across; ten+ = budget spread too thin for any to exit learning.
- **Format mix:** at minimum one vertical video (Reels/Stories), one static, one carousel per
  concept. UGC-style and "founder-to-camera" outperform polish for lead gen.

## Compliance

Lead-gen verticals (insurance, finance, home services) sit in Meta's special-ad-category and
personal-attribute minefield. **A disapproved or restricted ad in an enabled ad set is an
emergency** — beyond the lost delivery, repeated flags accumulate toward ad-account disabling,
which for an affiliate business is an existential risk. Never let disapprovals sit; fix copy
(no "you"-framing on personal attributes, no unrealistic claims) and resubmit or replace.

## Measurement

- **Pixel + Conversions API (CAPI), always both.** Post-iOS14 the pixel alone under-reports;
  CAPI restores signal. Spending with zero reported conversions means the plumbing is broken
  or the funnel is — either way, stop scaling until measured.
- Optimize for the deepest event with adequate volume (lead, not landing-page-view), and check
  in-platform conversions against the CRM weekly — Meta's attribution will flatter itself.

## Budget

- **CBO (Advantage campaign budget) for prospecting portfolios**, ad-set budgets for surgical
  retargeting tiers.
- Scale budgets **≤ ~20% per day**; bigger jumps re-enter learning.
- A campaign taking a large share of account spend with zero conversions in the window is not
  "still learning" — it is waste with a narrative. Pause it.

---

## RED FLAGS

> Grammar: `- rule_id — when: <condition> — recommend: <type> — action: <slug> — risk: <low|medium|high> — why: ...`
> Metrics are trailing-30-day. `ad_group` = Meta ad set. Thresholds are documented defaults.

- `meta-no-conversion-tracking` — when: `account.cost_30d > 0 AND account.conversions_30d == 0` — recommend: `other` — action: `fix_pixel_capi` — risk: `high` — why: Spend with zero reported conversions means the pixel/CAPI plumbing is broken or the funnel is; stop scaling until measured.
- `meta-spend-zero-conversions` — when: `campaign.status == enabled AND campaign.cost_30d >= 0.20 * account.cost_30d AND campaign.conversions_30d == 0` — recommend: `pause` — action: `pause_campaign` — risk: `high` — why: A campaign consuming ≥20% of account spend with zero conversions is waste with a narrative, not "learning"; pause and diagnose.
- `meta-high-frequency` — when: `campaign.frequency_30d > 4` — recommend: `new_creative` — action: `refresh_creative` — risk: `high` — why: Frequency above 4 burns the audience — CTR sinks, CPM rises, negative feedback climbs; rotate fresh concepts or widen the audience.
- `meta-stale-creative` — when: `ad.status == enabled AND ad.age_days > 60 AND campaign.cost_30d > 0` — recommend: `new_creative` — action: `refresh_creative` — risk: `medium` — why: A workhorse creative older than ~60 days at sustained spend is living on borrowed time; land fresh concepts before wear-out drags the ad set back into learning.
- `meta-disapproved-ad` — when: `campaign.status == enabled AND ad.policy_status == disapproved` — recommend: `new_creative` — action: `replace_disapproved_ad` — risk: `high` — why: Disapprovals in special-ad-category verticals accumulate toward account disabling — an existential risk for an affiliate business.
- `meta-adset-single-ad` — when: `ad_group.status == enabled AND enabled_ad_count <= 1` — recommend: `new_creative` — action: `add_creative_variants` — risk: `medium` — why: One ad gives the delivery system nothing to optimize across; run 3–6 per ad set.
- `meta-low-ctr-high-impressions` — when: `campaign.impressions_30d >= 20000 AND campaign.ctr_30d < 0.007` — recommend: `new_creative` — action: `refresh_creative` — risk: `medium` — why: Feed CTR under 0.7% at volume signals creative that no longer stops the scroll.
- `meta-budget-limited-converting` — when: `campaign.is_budget_limited == true AND campaign.conversions_30d > 0` — recommend: `budget_change` — action: `increase_budget` — risk: `medium` — why: A converting, budget-capped campaign is leaving cheap leads unclaimed; scale ≤20%/day to stay out of learning.
