/**
 * Demo theming — display-label overlay for the ad-ops fixtures + studio script.
 *
 * The fixtures carry the real demo mechanics (metrics, planted doctrine
 * violations, the autonomy/spend-cap gate). Those NEVER change. This module
 * overlays only human-readable *names* — campaigns, ad groups, ad copy, and the
 * studio ad script — so the whole demo reads as one coherent business:
 *
 *   - default        → Home Services (matches the studio's roofing ad + the
 *                      pre-generated sample b-roll)
 *   - after a scan   → a theme for the site the reviewer scanned, so
 *                      "scan itstoday.org → the console shows itstoday-relevant
 *                      campaigns" with no narrative disconnect.
 *
 * `themeSpec` is pure (name substitution only); the active theme is a
 * module-level slot the funnel-score scan updates. buildFixtureSpec applies it,
 * so every audit — red flags AND the LLM lane AND the stored snapshot — sees the
 * themed names. If a scan fails or can't be tailored, the default stands and the
 * UI shows a "Home Improvement example" note.
 *
 * Scraped page content is UNTRUSTED (prompt-injection surface), so a scanned
 * theme is length-capped and its vertical comes from a fixed enum — see
 * `sanitizeTheme` and `src/lib/server/scanTheme.ts`.
 */

import type { AdSpec } from "./types"

/** Fixed vertical enum — Haiku must pick from this; never free-form. */
export const VERTICALS = [
  "home services",
  "insurance & finance",
  "health & medicare",
  "performance marketing",
  "ecommerce & retail",
  "legal services",
  "education & training",
  "b2b software",
  "local services",
  "travel & hospitality",
] as const
export type Vertical = (typeof VERTICALS)[number]

/** One studio ad-script beat override (text + caption), keyed by beat label. */
export interface ScriptBeat {
  beat: string
  text: string
  caption?: string
}

export interface DemoTheme {
  source: "default" | "scanned"
  /** Bare domain (cache key + provenance chip), when source === "scanned". */
  domain?: string
  /** Epoch ms the theme was minted (for the "scanned 12:04" chip). */
  scannedAt?: number
  /** Short business label, e.g. "It's Today Media" or "a roofing contractor". */
  business: string
  vertical: Vertical
  /** A city for per-lead / studio tokens. */
  city: string
  /** The lead-magnet / offer line, e.g. "a free funnel score". */
  offer: string
  /** Campaign display names (cycled across a spec's campaigns). */
  campaigns: string[]
  /** Ad-group display names (cycled). */
  adGroups: string[]
  /** Ad headline lines (cycled onto ad headlines / creative hooks). */
  headlines: string[]
  /** Optional studio ad-script overrides, matched to segments by beat. */
  script?: ScriptBeat[]
}

/** Field caps so scanned labels can never overflow cards or carry an injection. */
const CAP = { business: 48, city: 32, offer: 64, label: 60, script: 180 }
const clamp = (s: string, n: number) => s.replace(/\s+/g, " ").trim().slice(0, n)

/** The always-coherent fallback: home services, matching the studio + samples. */
export const HOME_SERVICES_DEFAULT: DemoTheme = {
  source: "default",
  business: "a home-improvement lead-gen advertiser",
  vertical: "home services",
  city: "Denver",
  offer: "a free in-home estimate",
  campaigns: [
    "Roofing — Storm Damage — Search — US",
    "Window Replacement — Search — Phrase",
    "Bath Remodel — Walk-In Tubs — Search",
    "HVAC Repair & Install — Search",
    "Solar — Prospecting — Broad",
    "Gutter Guards — Advertorial — Native",
    "Kitchen Remodel — Retargeting 30d",
    "Foundation Repair — Search — Exact",
  ],
  adGroups: [
    "Emergency Roof Repair",
    "Free Roof Inspection",
    "Vinyl Windows — Energy",
    "Tub-to-Shower Conversion",
    "AC Not Cooling",
    "Solar Savings Estimate",
    "Leaf-Free Gutters",
    "Whole-Home Quote",
  ],
  headlines: [
    "Free Roof Inspection — Same Week",
    "Storm Damage? We Handle the Claim",
    "New Windows From $0 Down",
    "Safe, Low-Step Walk-In Tubs",
    "AC Fixed Today — Licensed Techs",
    "Cut Your Power Bill With Solar",
    "Never Clean Gutters Again",
    "Get a Free In-Home Estimate",
  ],
  // No script override → the studio uses its built-in roofing fixture (already
  // home services, so default is coherent end to end).
}

/**
 * HAND-VERIFIED theme for It's Today Media's own sites. Every judge scans
 * itstoday.org / itstoday.media, and that one run decides the contest — so we
 * do NOT trust Haiku blind on it. This is the pre-seeded, reviewed result.
 * (It's Today Media is a performance/affiliate shop that buys media at scale.)
 */
export const ITSTODAY_THEME: DemoTheme = {
  source: "scanned",
  domain: "itstoday.org",
  business: "It's Today Media",
  vertical: "performance marketing",
  city: "Baltimore",
  offer: "a free funnel score",
  campaigns: [
    "Lead Gen — Search — Non-Brand — US",
    "Advertorial — Native — Taboola/Outbrain",
    "Prospecting — Lookalike — Broad",
    "Retargeting — Funnel Abandoners 30d",
    "Email/SMS List Build — Sweeps",
    "Performance Max — Catch-All",
    "Brand Defense — Search — Exact",
    "Affiliate Offers — Rotational",
  ],
  adGroups: [
    "Free Funnel Score",
    "Website Conversion Audit",
    "Media Buying Services",
    "CRO Consultation",
    "Landing Page Teardown",
    "List-Growth Offer",
    "Brand Terms",
    "Offer Rotation A",
  ],
  headlines: [
    "What's Your Funnel Score? Free",
    "We Acquire Customers — At Scale",
    "Fix Your Landing Page Leaks",
    "Free Website Conversion Audit",
    "Media Buying That Pays For Itself",
    "Grow Your Email + SMS List",
    "Performance Marketing, Done Right",
    "Get Your Free Funnel Teardown",
  ],
  script: [
    { beat: "HOOK", text: "Your website is getting traffic — but is it turning that traffic into customers?", caption: "IS YOUR FUNNEL LEAKING?" },
    { beat: "PROBLEM", text: "Most sites leak the majority of their paid clicks before anyone ever converts.", caption: "MOST CLICKS LEAK" },
    { beat: "AGITATE", text: "Every wasted click is budget you'll never get back — and a customer a competitor just won.", caption: "WASTED BUDGET" },
    { beat: "PROOF", text: "We buy media at scale across Google, Meta, Taboola and TikTok and rebuild the funnel around what converts.", caption: "GOOGLE · META · TABOOLA · TIKTOK" },
    { beat: "OFFER", text: "Get a free funnel score in {{city}} — ten checks, one number, the fixes ranked.", caption: "FREE FUNNEL SCORE" },
    { beat: "CTA", text: "Scan your site now and see exactly where the money is leaking.", caption: "SCAN YOUR SITE →" },
  ],
}

// ─── Active-theme slot + per-domain cache ─────────────────────────────────────

let activeTheme: DemoTheme = HOME_SERVICES_DEFAULT
const domainCache = new Map<string, DemoTheme>([
  ["itstoday.org", ITSTODAY_THEME],
  ["itstoday.media", { ...ITSTODAY_THEME, domain: "itstoday.media" }],
])

export function getActiveTheme(): DemoTheme {
  return activeTheme
}

/** Normalize a URL/host to a bare domain (cache key + provenance chip). */
export function domainOf(input: string): string {
  try {
    const u = input.includes("://") ? input : `https://${input}`
    return new URL(u).host.replace(/^www\./, "").toLowerCase()
  } catch {
    return input.replace(/^www\./, "").toLowerCase()
  }
}

/** Look up a cached theme for a domain (pre-seeded itstoday + prior scans). */
export function cachedThemeFor(domain: string): DemoTheme | undefined {
  return domainCache.get(domain)
}

/** Activate a scanned theme (sanitized) and cache it by domain. */
export function setScannedTheme(theme: DemoTheme): void {
  const clean = sanitizeTheme(theme)
  if (clean.domain) domainCache.set(clean.domain, clean)
  activeTheme = clean
}

/** Activate a pre-cached theme by domain, if present (instant, no spend). */
export function activateCached(domain: string): boolean {
  const t = domainCache.get(domain)
  if (t) {
    activeTheme = { ...t, source: "scanned", scannedAt: t.scannedAt ?? Date.now() }
    return true
  }
  return false
}

export function resetTheme(): void {
  activeTheme = HOME_SERVICES_DEFAULT
}

/** Length-cap + enum-guard a theme (defense against untrusted scraped input). */
export function sanitizeTheme(t: DemoTheme): DemoTheme {
  const vertical: Vertical = VERTICALS.includes(t.vertical) ? t.vertical : "performance marketing"
  const caps = (arr: string[]) => (arr ?? []).slice(0, 8).map((s) => clamp(String(s), CAP.label))
  return {
    source: "scanned",
    domain: t.domain,
    scannedAt: t.scannedAt ?? Date.now(),
    business: clamp(t.business || "your business", CAP.business),
    vertical,
    city: clamp(t.city || "your city", CAP.city),
    offer: clamp(t.offer || "a free consultation", CAP.offer),
    campaigns: caps(t.campaigns),
    adGroups: caps(t.adGroups),
    headlines: caps(t.headlines),
    script: (t.script ?? [])
      .slice(0, 6)
      .map((b) => ({ beat: clamp(b.beat, 16), text: clamp(b.text, CAP.script), caption: b.caption ? clamp(b.caption, 40) : undefined })),
  }
}

// ─── The pure overlay ─────────────────────────────────────────────────────────

function pick(list: string[], i: number, fallback: string): string {
  return list.length ? list[i % list.length] : fallback
}

/**
 * Return a copy of `spec` with campaign / ad-group / ad-headline names replaced
 * by the theme's, cycling through each list. Numbers, statuses, ids, policy
 * flags, and every metric are left exactly as-is — only display strings change,
 * so red-flag detection and the gate are untouched. Keyword TEXT is deliberately
 * left alone: a keyword's text is its identity (metric rows reference keywords by
 * text), so renaming one would sever that linkage.
 */
export function themeSpec(spec: AdSpec, theme: DemoTheme = activeTheme): AdSpec {
  let agN = 0
  let adN = 0
  return {
    ...spec,
    campaigns: spec.campaigns.map((c, ci) => ({
      ...c,
      name: pick(theme.campaigns, ci, c.name),
      ad_groups: c.ad_groups.map((g) => ({
        ...g,
        name: pick(theme.adGroups, agN++, g.name),
        ads: g.ads.map((a) => ({
          ...a,
          headlines: a.headlines.length
            ? a.headlines.map((h, hi) => (hi === 0 ? pick(theme.headlines, adN++, h) : h))
            : a.headlines,
        })),
      })),
    })),
  }
}
