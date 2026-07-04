import type { PageServerLoad } from "./$types"
import { getMetrics } from "$lib/os/store"

export const load: PageServerLoad = async () => ({
  metrics: getMetrics(),
})
