import { getRecommendations } from "$lib/adops/store"
import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async () => {
  return {
    inboxCount: getRecommendations({ status: "proposed" }).length,
  }
}
