/**
 * Client-facing monthly report — the email an agency sends its client.
 *
 * Resolves [client] against the OS store's closed-won prospects (see
 * $lib/os/store getProspects()). The store has no per-client waste/spend
 * breakdown yet (it only tracks a firm-wide total) — see HANDOFF note in
 * jst-vx1fv.2.5 for the store helper this page would want. Until that lands,
 * a won client's "waste recovered" is the firm total divided across accounts
 * under management (labeled as attributed, not exact); everything else on
 * the page is seeded fixture data. An unknown slug renders a fully seeded
 * SAMPLE REPORT so the page always has something to show a fresh visitor.
 */

import type { PageServerLoad } from "./$types"
import { getMetrics, getProspects } from "$lib/os/store"
import { error } from "@sveltejs/kit"

const CREATIVE_SAMPLES = [
  { id: "crew", label: "Crew spotlight", src: "/video/samples/crew.mp4" },
  { id: "rooftops", label: "Service area flyover", src: "/video/samples/rooftops.mp4" },
  { id: "signing", label: "Customer testimonial", src: "/video/samples/signing.mp4" },
]

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

/** Deterministic pseudo-random generator seeded from the client slug, so a
 * report's fixture figures stay stable across reloads instead of jittering. */
function seededRandom(seed: string): () => number {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    h ^= h >>> 16
    return (h >>> 0) / 4294967296
  }
}

function money(cents: number): string {
  return `$${Math.round(cents / 100).toLocaleString("en-US")}`
}

function parseMoney(value: string): number {
  return Math.round(Number(value.replace(/[^0-9.]/g, "")) * 100)
}

export const load: PageServerLoad = async ({ params }) => {
  const slug = params.client
  if (!slug) throw error(404, "Unknown report")

  const metrics = getMetrics()
  const wonAccounts = getProspects().filter((p) => p.stage === "won" && p.spawnedAccounts)
  const match = wonAccounts.find((p) => slugify(p.company) === slug)

  const isSample = !match
  const rand = seededRandom(slug)

  const clientName = match?.company ?? "Sample Client"
  const city = match?.city ?? "Anytown"
  const vertical = match?.vertical ?? "home services"

  const now = new Date()
  const monthLabel = now.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  // Spend/conversions: fixture, seeded per-client so they stay stable on reload.
  const spendCents = Math.round((6_000 + rand() * 14_000) * 100)
  const conversions = Math.round(40 + rand() * 160)
  const cpaCents = Math.round(spendCents / Math.max(1, conversions))

  // Waste recovered: use the store's firm-wide total, attributed across won
  // accounts, when this is a real closed-won client; otherwise seed it.
  let wasteRecoveredValue: string
  let wasteRecoveredSource: "store" | "seeded"
  if (match) {
    const totalWasteCents = parseMoney(metrics.find((m) => m.key === "waste")?.value ?? "$0")
    const shareCents = Math.round(totalWasteCents / Math.max(1, wonAccounts.length))
    wasteRecoveredValue = money(shareCents)
    wasteRecoveredSource = "store"
  } else {
    wasteRecoveredValue = money(Math.round((2_000 + rand() * 6_000) * 100))
    wasteRecoveredSource = "seeded"
  }

  const actionsTaken = [
    { id: "a1", kind: "gate", text: `Autonomy gate held a pause on an underperforming ad set for review — approved` },
    { id: "a2", kind: "render", text: `Creative refreshed to counter ad fatigue on the top-spending campaign` },
    { id: "a3", kind: "sweep", text: `Weekly sweep audited the account — recommendations queued and approved` },
    { id: "a4", kind: "system", text: `Budget reallocated away from the lowest-converting ad group` },
    { id: "a5", kind: "meeting", text: `Monthly check-in held with ${clientName}` },
  ]

  const nextMonthPlan = [
    `Refresh creative rotation across the top-performing campaigns`,
    `Reallocate spend away from underperforming ad sets`,
    `Test messaging aimed at ${vertical} adjacent audiences`,
    `Review landing page conversion rate and recommend fixes`,
  ]

  return {
    client: { slug, name: clientName, city, vertical, isSample },
    monthLabel,
    spend: money(spendCents),
    conversions,
    cpa: money(cpaCents),
    wasteRecovered: { value: wasteRecoveredValue, source: wasteRecoveredSource },
    actionsTaken,
    creatives: CREATIVE_SAMPLES,
    nextMonthPlan,
  }
}
