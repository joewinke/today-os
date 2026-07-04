import type { PageServerLoad } from "./$types"
import { getMetrics, getActivity, getProspects, getSetup } from "$lib/os/store"

/** Relative "2h ago" formatting done server-side so SSR and hydration agree. */
function ago(at: number, now: number): string {
  const s = Math.max(0, Math.round((now - at) / 1000))
  if (s < 60) return "just now"
  const m = Math.round(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.round(h / 24)}d ago`
}

export const load: PageServerLoad = async () => {
  const now = Date.now()
  return {
    metrics: getMetrics(),
    activity: getActivity(9).map((a) => ({ ...a, ago: ago(a.at, now) })),
    prospects: getProspects().slice(0, 6),
    setup: getSetup(),
  }
}
// "Advance a week" control removed from the dashboard (Joe: it exposed the sim
// interactively and competed for the primary-action slot). The cadence story is
// carried by the "overnight" framing + the seeded activity feed. advanceWeek()
// stays in the store (tests use it); it's just no longer wired to the UI.
