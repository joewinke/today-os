/**
 * Client-safe OS types + constants. The store (which imports the server-only
 * session module) lives in store.ts; anything a `.svelte` component needs must
 * live here so the browser bundle never pulls in server code.
 */

export type PipelineStage = "new" | "queued" | "contacted" | "meeting" | "won"

export const PIPELINE_STAGES: { key: PipelineStage; label: string }[] = [
  { key: "new", label: "New" },
  { key: "queued", label: "Queued" },
  { key: "contacted", label: "Contacted" },
  { key: "meeting", label: "Meeting" },
  { key: "won", label: "Closed-won" },
]

export interface Prospect {
  id: string
  company: string
  city: string
  offer: string
  vertical: string
  score: number | null
  stage: PipelineStage
  /** Epoch ms it entered the pipeline. */
  createdAt: number
  /** True once CLOSED-WON has spawned this client's ad accounts into Ad Ops. */
  spawnedAccounts?: boolean
}

export type ActivityKind =
  | "scan"
  | "pitch"
  | "reply"
  | "meeting"
  | "sweep"
  | "gate"
  | "won"
  | "render"
  | "system"

export interface ActivityItem {
  id: string
  at: number
  kind: ActivityKind
  text: string
}

export interface DashboardMetric {
  key: string
  label: string
  value: string
  /** Optional sub-label, e.g. "this month". */
  sub?: string
}

/**
 * Stable, url-safe slug from a business name ("Cobalt & Co." → "cobalt-and-co").
 * Client-safe (pure) so components can build /p/{slug} + /report/{slug} links;
 * the server outreach module re-exports this so slugs never drift.
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
