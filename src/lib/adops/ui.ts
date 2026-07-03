/**
 * ui.ts — small presentation helpers shared by the /admin console pages.
 * No DOM, no state — safe on server and client.
 */

// ─── Time ────────────────────────────────────────────────────────────────────

export function relativePast(iso: string | null): string {
  if (!iso) return "never"
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function relativeFuture(iso: string | null): string {
  if (!iso) return "not scheduled"
  const diff = new Date(iso).getTime() - Date.now()
  if (diff <= 0) return "due now"
  const mins = Math.floor(diff / 60_000)
  if (mins < 60) return `in ${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `in ${hrs}h`
  return `in ${Math.floor(hrs / 24)}d`
}

export function clockStamp(iso: string): string {
  const d = new Date(iso)
  return d.toISOString().replace("T", " ").slice(0, 19) + "Z"
}

// ─── Labels ──────────────────────────────────────────────────────────────────

export const AUTONOMY_LABELS: Record<string, string> = {
  propose: "PROPOSE",
  approve: "APPROVE",
  auto: "AUTO",
}

export const RISK_BADGE_CLASS: Record<string, string> = {
  low: "badge-success",
  medium: "badge-warning",
  high: "badge-error",
}

export const GATE_BADGE_CLASS: Record<string, string> = {
  eligible: "badge-success",
  manual_review: "badge-warning",
  blocked: "badge-error",
}

export function formatRecType(type: string): string {
  return type.replace(/_/g, " ").toUpperCase()
}

// ─── Tiny markdown renderer (doctrine pages only) ────────────────────────────
//
// Deliberately minimal: headings, bullet lists, blockquotes, hr, bold, inline
// code, paragraphs. Input is our own repo-controlled doctrine markdown, but
// everything is HTML-escaped first anyway.

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

function inline(s: string): string {
  return s
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
}

export function renderDoctrineHtml(md: string): string {
  const lines = escapeHtml(md).split("\n")
  const out: string[] = []
  let inList = false
  let inQuote = false
  let paragraph: string[] = []

  const closeList = () => {
    if (inList) {
      out.push("</ul>")
      inList = false
    }
  }
  const closeQuote = () => {
    if (inQuote) {
      out.push("</blockquote>")
      inQuote = false
    }
  }
  const flushParagraph = () => {
    if (paragraph.length) {
      out.push(`<p>${inline(paragraph.join(" "))}</p>`)
      paragraph = []
    }
  }

  for (const raw of lines) {
    const line = raw.trimEnd()

    if (/^---+$/.test(line.trim())) {
      flushParagraph()
      closeList()
      closeQuote()
      out.push("<hr>")
      continue
    }
    const heading = /^(#{1,4})\s+(.*)$/.exec(line)
    if (heading) {
      flushParagraph()
      closeList()
      closeQuote()
      const level = Math.min(heading[1].length + 1, 5) // h1→h2 … keep page h1 unique
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`)
      continue
    }
    // Lines were HTML-escaped above, so a markdown ">" quote is now "&gt;".
    if (/^&gt;\s?/.test(line)) {
      flushParagraph()
      closeList()
      if (!inQuote) {
        out.push("<blockquote>")
        inQuote = true
      }
      const content = line.replace(/^&gt;\s?/, "")
      if (content.trim()) out.push(`<p>${inline(content)}</p>`)
      continue
    }
    if (/^[-*]\s+/.test(line)) {
      flushParagraph()
      closeQuote()
      if (!inList) {
        out.push("<ul>")
        inList = true
      }
      out.push(`<li>${inline(line.replace(/^[-*]\s+/, ""))}</li>`)
      continue
    }
    if (!line.trim()) {
      flushParagraph()
      closeList()
      closeQuote()
      continue
    }
    paragraph.push(line.trim())
  }
  flushParagraph()
  closeList()
  closeQuote()
  return out.join("\n")
}
