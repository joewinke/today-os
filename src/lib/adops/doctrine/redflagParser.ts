/**
 * redflagParser.ts — the ONE parser for the machine-checkable RED FLAGS grammar.
 *
 * The doctrine markdown ends with a `## RED FLAGS` section whose bullets follow a
 * fixed grammar:
 *
 *   - `rule_id` — when: `condition` — recommend: `type` — action: `slug` — risk: `level` — why: prose
 *
 * This module turns that grammar into structured rules. It is PURE — plain string
 * work, no DOM, no session, no clock — so it runs identically in the browser (the
 * /admin/doctrine edit-mode PREVIEW parses the textarea live) and on the server
 * (the override resolver reads a tuned threshold back out of edited doctrine).
 *
 * Parsing is deliberately strict and HONEST: a bullet that starts like a rule but
 * doesn't satisfy the grammar becomes a `ParseError` rather than being silently
 * dropped, so the editor can show the reviewer exactly what their edit broke.
 */

/** One fully-parsed RED FLAGS rule. */
export interface ParsedRule {
  ruleId: string
  when: string
  recommend: string
  action: string
  risk: string
  why: string
}

/** A bullet inside the RED FLAGS section that looked like a rule but didn't parse. */
export interface ParseError {
  line: number
  text: string
  reason: string
}

export interface ParsedDoctrine {
  /** Whether a `## RED FLAGS` heading was found at all. */
  hasRedFlagsSection: boolean
  rules: ParsedRule[]
  errors: ParseError[]
}

// The em-dash (U+2014) separates the labelled fields. `why:` is last and may itself
// contain em-dashes ("Frequency above 4 burns the audience — CTR sinks"), so it is
// captured greedily to end-of-line.
const RULE_RE =
  /^-\s+`([^`]+)`\s+—\s+when:\s+`([^`]+)`\s+—\s+recommend:\s+`([^`]+)`\s+—\s+action:\s+`([^`]+)`\s+—\s+risk:\s+`([^`]+)`\s+—\s+why:\s+(.+)$/

// A bullet that at least opens with a backtick-quoted rule id — used to tell an
// intended-but-malformed rule apart from ordinary prose bullets.
const RULE_LIKE_RE = /^-\s+`[^`]+`/

const VALID_RISK = new Set(["low", "medium", "high"])

/** Slice out the `## RED FLAGS` section body (up to the next `## ` heading / EOF). */
function redFlagsSection(md: string): { body: string; startLine: number } | null {
  const lines = md.split("\n")
  let start = -1
  for (let i = 0; i < lines.length; i++) {
    if (/^##\s+RED FLAGS\s*$/i.test(lines[i].trim())) {
      start = i
      break
    }
  }
  if (start === -1) return null
  let end = lines.length
  for (let i = start + 1; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i])) {
      end = i
      break
    }
  }
  return { body: lines.slice(start + 1, end).join("\n"), startLine: start + 1 }
}

/**
 * Parse the RED FLAGS section of a doctrine markdown string. Rules that match the
 * grammar land in `rules`; rule-shaped bullets that don't land in `errors` with a
 * human reason. Everything else (prose, the `> Grammar:` note, blank lines) is
 * ignored.
 */
export function parseRedFlags(md: string): ParsedDoctrine {
  const section = redFlagsSection(md)
  if (!section) return { hasRedFlagsSection: false, rules: [], errors: [] }

  const rules: ParsedRule[] = []
  const errors: ParseError[] = []
  const bodyLines = section.body.split("\n")

  for (let i = 0; i < bodyLines.length; i++) {
    const raw = bodyLines[i]
    const line = raw.trimEnd()
    if (!RULE_LIKE_RE.test(line.trim())) continue // prose / notes / blanks

    const lineNo = section.startLine + i + 1 // 1-indexed, whole-file
    const m = RULE_RE.exec(line.trim())
    if (!m) {
      errors.push({
        line: lineNo,
        text: line.trim(),
        reason: describeMismatch(line.trim()),
      })
      continue
    }
    const [, ruleId, when, recommend, action, risk, why] = m
    if (!VALID_RISK.has(risk.trim().toLowerCase())) {
      errors.push({
        line: lineNo,
        text: line.trim(),
        reason: `risk must be low | medium | high, got \`${risk}\``,
      })
      continue
    }
    rules.push({
      ruleId: ruleId.trim(),
      when: when.trim(),
      recommend: recommend.trim(),
      action: action.trim(),
      risk: risk.trim().toLowerCase(),
      why: why.trim(),
    })
  }

  return { hasRedFlagsSection: true, rules, errors }
}

/** Best-effort explanation of why a rule-shaped bullet failed the grammar. */
function describeMismatch(line: string): string {
  const missing: string[] = []
  for (const label of ["when:", "recommend:", "action:", "risk:", "why:"]) {
    if (!line.includes(label)) missing.push(label.replace(":", ""))
  }
  if (missing.length) return `missing field${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}`
  return "each field's value must be wrapped in `backticks` and separated by —"
}

/**
 * The tunable knob the deterministic engine reads back: the meta audience-burn
 * frequency ceiling, parsed out of the `meta-high-frequency` rule's `when` clause
 * (`campaign.frequency_30d > N`). Returns null if the rule is absent or the clause
 * carries no numeric ceiling — callers fall back to the engine default.
 */
export function metaFrequencyCeiling(md: string): number | null {
  const { rules } = parseRedFlags(md)
  const rule = rules.find((r) => r.ruleId === "meta-high-frequency")
  if (!rule) return null
  const m = /frequency_30d\s*>\s*([\d.]+)/.exec(rule.when)
  if (!m) return null
  const n = Number(m[1])
  return Number.isFinite(n) ? n : null
}
