import type { PageServerLoad } from "./$types"
import { getMetrics } from "$lib/os/store"

export const load: PageServerLoad = async () => ({
  waste: getMetrics().find((m) => m.key === "waste")?.value ?? "$0",
})
