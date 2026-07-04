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
import { currentSession } from "$lib/server/session"

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

/**
 * A peer advertiser in the same market as the scanned business — the "scale out"
 * payoff (batch re-renders the ad for each). Illustrative, NOT a real client:
 * surfaced under an honest-seam label ("sample advertisers in this market").
 */
export interface PeerAdvertiser {
  company: string
  city: string
  offer: string
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
  /** A plausible contact first name for the batch "lead" (empty = omit). */
  contactName: string
  /** The lead-magnet / offer line, e.g. "a free funnel score". */
  offer: string
  /** Campaign display names (cycled across a spec's campaigns). */
  campaigns: string[]
  /** Ad-group display names (cycled). */
  adGroups: string[]
  /** Search keyword texts (cycled; linked metric rows are renamed in lockstep). */
  keywords: string[]
  /** Ad headline lines (cycled onto ad headlines / creative hooks). */
  headlines: string[]
  /** Optional studio ad-script overrides, matched to segments by beat. */
  script?: ScriptBeat[]
  /** Peer advertisers in the same market — the batch "scale out" payoff. */
  peers: PeerAdvertiser[]
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
  contactName: "",
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
  keywords: [
    "roof repair near me",
    "free roofing quote",
    "window replacement cost",
    "walk in tub installation",
    "ac repair same day",
    "solar panels for home",
    "gutter guard installation",
    "foundation repair estimate",
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
  peers: [
    { company: "Summit Exteriors", city: "Aurora", offer: "free roof inspection" },
    { company: "BlueRidge Home Pros", city: "Lakewood", offer: "$0-down window replacement" },
    { company: "FirstLight Solar", city: "Boulder", offer: "free solar savings estimate" },
    { company: "ClearView Baths", city: "Littleton", offer: "walk-in tub consultation" },
    { company: "Anchor Foundation Repair", city: "Arvada", offer: "free foundation estimate" },
  ],
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
  contactName: "Sam",
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
  keywords: [
    "free funnel score",
    "website conversion audit",
    "media buying agency",
    "landing page optimization",
    "cro consultant",
    "performance marketing agency",
    "email list building service",
    "affiliate marketing offers",
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
  peers: [
    { company: "Northbeam Performance", city: "Austin", offer: "a free funnel audit" },
    { company: "Tidewater Media Group", city: "Norfolk", offer: "a free landing-page teardown" },
    { company: "Meridian Growth Co.", city: "Denver", offer: "a free conversion score" },
    { company: "Harborline Digital", city: "Tampa", offer: "a free media-buying review" },
    { company: "Cardinal Demand Gen", city: "Charlotte", offer: "a free acquisition audit" },
  ],
}

// ─── Active theme (per-visitor session) + per-domain cache (shared) ───────────

// The ACTIVE theme is per session so one visitor's scan can't re-theme another
// visitor's view. The domain cache is shared — a domain's theme is the same
// whoever scanned it, so a repeat scan of a known domain is instant for everyone.
const sessionThemes = new Map<string, DemoTheme>()
const domainCache = new Map<string, DemoTheme>([
  ["itstoday.org", ITSTODAY_THEME],
  ["itstoday.media", { ...ITSTODAY_THEME, domain: "itstoday.media" }],
])

export function getActiveTheme(): DemoTheme {
  return sessionThemes.get(currentSession()) ?? HOME_SERVICES_DEFAULT
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

/** A theme is only useful (and cacheable) if it actually carries campaign labels. */
function isComplete(t: DemoTheme | undefined): t is DemoTheme {
  return !!t && t.campaigns.length > 0
}

/** Activate a scanned theme (sanitized) for THIS session, and cache it by domain. */
export function setScannedTheme(theme: DemoTheme): void {
  const clean = sanitizeTheme(theme)
  sessionThemes.set(currentSession(), clean)
  // Only cache complete themes, so a partial/empty result never gets pinned to a
  // domain and silently suppresses re-theming on a later scan.
  if (clean.domain && isComplete(clean)) domainCache.set(clean.domain, clean)
}

/** Activate a pre-cached COMPLETE theme for THIS session (instant, no spend). */
export function activateCached(domain: string): boolean {
  const t = domainCache.get(domain)
  if (isComplete(t)) {
    sessionThemes.set(currentSession(), { ...t, source: "scanned", scannedAt: t.scannedAt ?? Date.now() })
    return true
  }
  // Incomplete/stale cache entry → treat as a miss so the caller re-builds.
  if (t) domainCache.delete(domain)
  return false
}

export function resetTheme(): void {
  sessionThemes.delete(currentSession())
}

/**
 * The close-hinge: when a deal closes, RUN operates that client's accounts, so
 * point the active theme at them. Keeps the current theme's campaign/keyword
 * STRUCTURE (peers share the scanned business's market) and just swaps the
 * business identity — Ad Ops re-themes to the new client on its next audit.
 */
export function setThemeFromProspect(p: { company: string; city?: string; vertical?: string; offer?: string }): void {
  const cur = getActiveTheme()
  const vertical: Vertical = p.vertical && VERTICALS.includes(p.vertical as Vertical) ? (p.vertical as Vertical) : cur.vertical
  sessionThemes.set(currentSession(), {
    ...cur,
    source: "scanned",
    scannedAt: Date.now(),
    business: clamp(p.company || cur.business, CAP.business),
    city: p.city ? clamp(p.city, CAP.city) : cur.city,
    vertical,
    offer: p.offer ? clamp(p.offer, CAP.offer) : cur.offer,
  })
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
    contactName: t.contactName ? clamp(t.contactName, 24) : "",
    offer: clamp(t.offer || "a free consultation", CAP.offer),
    campaigns: caps(t.campaigns),
    adGroups: caps(t.adGroups),
    keywords: caps(t.keywords),
    headlines: caps(t.headlines),
    script: (t.script ?? [])
      .slice(0, 6)
      .map((b) => ({ beat: clamp(b.beat, 16), text: clamp(b.text, CAP.script), caption: b.caption ? clamp(b.caption, 40) : undefined })),
    peers: (t.peers ?? []).slice(0, 5).map((p) => ({
      company: clamp(String(p.company || "an advertiser"), CAP.business),
      city: clamp(String(p.city || ""), CAP.city),
      offer: clamp(String(p.offer || ""), CAP.offer),
    })),
  }
}

// ─── The pure overlay ─────────────────────────────────────────────────────────

function pick(list: string[], i: number, fallback: string): string {
  return list.length ? list[i % list.length] : fallback
}

/**
 * Return a copy of `spec` with campaign / ad-group / keyword / ad-headline names
 * replaced by the theme's, cycling through each list. Numbers, statuses, ids,
 * policy flags, and every metric VALUE are left exactly as-is — only display
 * strings change, so red-flag detection and the gate are untouched.
 *
 * A keyword's text IS its identity — metric rows reference keywords by text — so
 * renaming a keyword also renames its matching metric row (level "keyword"),
 * keeping the linkage intact.
 */
export function themeSpec(spec: AdSpec, theme: DemoTheme = getActiveTheme()): AdSpec {
  let agN = 0
  let adN = 0
  // Build the keyword rename map first (stable, positional across the spec), so
  // both the keyword texts and their linked metric rows rename in lockstep.
  const kwMap = new Map<string, string>()
  let kwN = 0
  for (const c of spec.campaigns)
    for (const g of c.ad_groups)
      for (const k of g.keywords)
        if (!kwMap.has(k.text)) kwMap.set(k.text, pick(theme.keywords, kwN++, k.text))

  return {
    ...spec,
    campaigns: spec.campaigns.map((c, ci) => ({
      ...c,
      name: pick(theme.campaigns, ci, c.name),
      ad_groups: c.ad_groups.map((g) => ({
        ...g,
        name: pick(theme.adGroups, agN++, g.name),
        keywords: g.keywords.map((k) => ({ ...k, text: kwMap.get(k.text) ?? k.text })),
        ads: g.ads.map((a) => ({
          ...a,
          headlines: a.headlines.length
            ? a.headlines.map((h, hi) => (hi === 0 ? pick(theme.headlines, adN++, h) : h))
            : a.headlines,
        })),
      })),
    })),
    metrics: {
      ...spec.metrics,
      rows: spec.metrics.rows.map((r) =>
        r.level === "keyword" && kwMap.has(r.external_id)
          ? { ...r, external_id: kwMap.get(r.external_id)! }
          : r,
      ),
    },
  }
}
