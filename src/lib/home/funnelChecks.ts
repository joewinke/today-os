/**
 * Funnel Score — deterministic heuristic teardown of a landing page.
 * Server-side fetch + regex heuristics. No LLM: it always works live.
 * Weights sum to 100; pass = full points, warn = half, fail = 0.
 */

export type CheckStatus = "pass" | "warn" | "fail"

export interface CheckResult {
  id: string
  label: string
  weight: number
  status: CheckStatus
  points: number
  detail: string
  fix: string | null
}

export interface FunnelReport {
  url: string
  finalUrl: string
  score: number
  band: string
  checks: CheckResult[]
  fixFirst: string[]
  fetchedAt: string
  responseMs: number
  weightKb: number
}

const ACTION_VERB_RE =
  /\b(get|start|try|buy|shop|order|book|claim|join|apply|subscribe|sign\s?up|download|register|request|contact|schedule|learn\s?more|free|demo|quote|call|donate|enroll)\b/i

function makeCheck(
  id: string,
  label: string,
  weight: number,
  status: CheckStatus,
  detail: string,
  fix: string | null,
): CheckResult {
  const points = status === "pass" ? weight : status === "warn" ? Math.round(weight / 2) : 0
  return { id, label, weight, status, points, detail, fix: status === "pass" ? null : fix }
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
}

/** Extract the value of an attribute from a single tag string. */
function attr(tag: string, name: string): string | null {
  const m = tag.match(new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"))
  if (!m) return null
  return m[2] ?? m[3] ?? m[4] ?? ""
}

export function normalizeUrl(input: string): string {
  let u = input.trim()
  if (!/^https?:\/\//i.test(u)) u = `https://${u}`
  // throws TypeError on garbage — caller catches
  return new URL(u).href
}

export async function analyzeUrl(rawUrl: string): Promise<FunnelReport> {
  const url = normalizeUrl(rawUrl)

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 15_000)
  let res: Response
  let html = ""
  let responseMs = 0
  try {
    const started = performance.now()
    res = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; TodayOS-FunnelScore/1.0; +https://itstoday.org)",
        accept: "text/html,application/xhtml+xml",
      },
    })
    // time-to-headers, not full body read — fairer speed reading
    responseMs = Math.round(performance.now() - started)
    html = await res.text()
  } finally {
    clearTimeout(timer)
  }

  if (!res.ok) {
    throw new Error(`Target responded with HTTP ${res.status}`)
  }
  const ctype = res.headers.get("content-type") ?? ""
  if (ctype && !/text\/html|application\/xhtml/i.test(ctype)) {
    throw new Error(`Target returned ${ctype.split(";")[0]} — not an HTML page`)
  }

  const finalUrl = res.url || url
  const bytes = new TextEncoder().encode(html).length
  const weightKb = Math.round(bytes / 1024)
  const bodyHtml = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "")

  const checks: CheckResult[] = []

  // 1. HTTPS (10)
  const isHttps = finalUrl.startsWith("https://")
  checks.push(
    makeCheck(
      "https",
      "TRANSPORT",
      10,
      isHttps ? "pass" : "fail",
      isHttps ? "HTTPS" : "HTTP ONLY",
      "Serve the page over HTTPS. Browsers flag insecure pages and paid traffic quality scores punish them.",
    ),
  )

  // 2. Response time (12)
  const rtStatus: CheckStatus = responseMs < 800 ? "pass" : responseMs < 2000 ? "warn" : "fail"
  checks.push(
    makeCheck(
      "response-time",
      "RESPONSE TIME",
      12,
      rtStatus,
      `${responseMs} MS`,
      "Cut server response time under 800 ms: cache the HTML, use a CDN, drop blocking redirects. Every second of delay costs paid clicks.",
    ),
  )

  // 3. Page weight (8)
  const pwStatus: CheckStatus = weightKb < 100 ? "pass" : weightKb < 300 ? "warn" : "fail"
  checks.push(
    makeCheck(
      "page-weight",
      "HTML WEIGHT",
      8,
      pwStatus,
      `${weightKb} KB`,
      "Slim the HTML document: strip inlined framework payloads, defer non-critical markup. Heavy documents stall first paint on mobile.",
    ),
  )

  // 4. Title (10)
  const titleM = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  const title = titleM ? decodeEntities(stripTags(titleM[1])) : ""
  const titleStatus: CheckStatus = !title
    ? "fail"
    : title.length >= 15 && title.length <= 65
      ? "pass"
      : "warn"
  checks.push(
    makeCheck(
      "title",
      "TITLE TAG",
      10,
      titleStatus,
      title ? `${title.length} CH` : "MISSING",
      title
        ? "Rewrite the title to 15-65 characters: front-load the offer and the keyword the ad traffic searched for."
        : "Add a title tag. It is the headline of every search result and social share.",
    ),
  )

  // 5. Meta description (10)
  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? []
  let metaDesc = ""
  for (const tag of metaTags) {
    if ((attr(tag, "name") ?? "").toLowerCase() === "description") {
      metaDesc = decodeEntities(attr(tag, "content") ?? "")
      break
    }
  }
  const mdStatus: CheckStatus = !metaDesc
    ? "fail"
    : metaDesc.length >= 50 && metaDesc.length <= 160
      ? "pass"
      : "warn"
  checks.push(
    makeCheck(
      "meta-description",
      "META DESCRIPTION",
      10,
      mdStatus,
      metaDesc ? `${metaDesc.length} CH` : "MISSING",
      metaDesc
        ? "Tune the meta description to 50-160 characters with one clear benefit and one call to action."
        : "Add a meta description. Without one, search engines improvise your pitch for you.",
    ),
  )

  // 6. Single H1 (8)
  const h1Count = (bodyHtml.match(/<h1[\s>]/gi) ?? []).length
  const h1Status: CheckStatus = h1Count === 1 ? "pass" : h1Count === 0 ? "fail" : "warn"
  checks.push(
    makeCheck(
      "h1",
      "H1 HEADLINE",
      8,
      h1Status,
      h1Count === 1 ? "1 H1" : `${h1Count} H1S`,
      h1Count === 0
        ? "Add exactly one H1 that states the offer. Visitors decide in seconds; the headline does most of the convincing."
        : "Collapse to a single H1. Multiple H1s dilute the page's one message and confuse crawlers.",
    ),
  )

  // 7. CTA detection (14)
  const ctaTexts: string[] = []
  const anchorRe = /<(a|button)\b[^>]*>([\s\S]*?)<\/\1>/gi
  let am: RegExpExecArray | null
  while ((am = anchorRe.exec(bodyHtml)) !== null) {
    const text = decodeEntities(stripTags(am[2]))
    if (text && ACTION_VERB_RE.test(text)) ctaTexts.push(text)
    if (ctaTexts.length > 40) break
  }
  const inputCtas = (bodyHtml.match(/<input\b[^>]*type\s*=\s*["']?submit["']?[^>]*>/gi) ?? []).length
  const ctaCount = ctaTexts.length + inputCtas
  const ctaStatus: CheckStatus = ctaCount >= 2 ? "pass" : ctaCount === 1 ? "warn" : "fail"
  checks.push(
    makeCheck(
      "cta",
      "CALLS TO ACTION",
      14,
      ctaStatus,
      `${ctaCount} FOUND`,
      ctaCount === 0
        ? "No action-verb links or buttons found. Add a primary CTA above the fold and repeat it down the page."
        : "Only one CTA found. Repeat the primary action after each major section so the click is never far away.",
    ),
  )

  // 8. Lead capture form (12)
  const hasForm = /<form[\s>]/i.test(bodyHtml)
  checks.push(
    makeCheck(
      "form",
      "LEAD CAPTURE",
      12,
      hasForm ? "pass" : "fail",
      hasForm ? "FORM PRESENT" : "NO FORM",
      "No form tag found. A funnel page without capture is a brochure: add an email or SMS opt-in.",
    ),
  )

  // 9. Image alt coverage (6)
  const imgs = bodyHtml.match(/<img\b[^>]*>/gi) ?? []
  const withAlt = imgs.filter((t) => attr(t, "alt") !== null).length
  const altPct = imgs.length === 0 ? 100 : Math.round((withAlt / imgs.length) * 100)
  const altStatus: CheckStatus = altPct >= 90 ? "pass" : altPct >= 60 ? "warn" : "fail"
  checks.push(
    makeCheck(
      "alt",
      "IMAGE ALT TEXT",
      6,
      altStatus,
      imgs.length === 0 ? "NO IMAGES" : `${altPct}% OF ${imgs.length}`,
      "Add alt text to images. It is accessibility, SEO, and the fallback when images fail on slow connections.",
    ),
  )

  // 10. Viewport meta (10)
  const hasViewport = metaTags.some((t) => (attr(t, "name") ?? "").toLowerCase() === "viewport")
  checks.push(
    makeCheck(
      "viewport",
      "MOBILE VIEWPORT",
      10,
      hasViewport ? "pass" : "fail",
      hasViewport ? "PRESENT" : "MISSING",
      "Add a viewport meta tag. Most paid traffic is mobile; without it the page renders desktop-width and unreadable.",
    ),
  )

  const score = checks.reduce((s, c) => s + c.points, 0)
  const band = score >= 85 ? "DIALED IN" : score >= 70 ? "SOLID" : score >= 50 ? "LEAKING" : "CRITICAL"

  const fixFirst = checks
    .filter((c) => c.status !== "pass" && c.fix)
    .sort((a, b) => b.weight - a.weight || (a.status === "fail" ? -1 : 1))
    .map((c) => c.fix as string)

  return {
    url,
    finalUrl,
    score,
    band,
    checks,
    fixFirst,
    fetchedAt: new Date().toISOString(),
    responseMs,
    weightKb,
  }
}
