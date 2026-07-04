import type { PageServerLoad } from "./$types"
import { getMetrics, getManagedClients } from "$lib/os/store"

export const load: PageServerLoad = async () => ({
  metrics: getMetrics(),
  clients: getManagedClients().map((c) => ({ company: c.company, city: c.city, vertical: c.vertical, score: c.score })),
})
