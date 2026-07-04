import type { PageServerLoad } from "./$types"
import { getProspects } from "$lib/os/store"

export const load: PageServerLoad = async () => ({
  prospects: getProspects(),
})
