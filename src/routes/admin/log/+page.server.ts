import { getEvents, getAccounts } from "$lib/adops/store"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async () => {
  const names = new Map(getAccounts().map((a) => [a.id, a.name]))
  return {
    events: getEvents().map((e) => ({
      ...e,
      account_name: e.account_id ? (names.get(e.account_id) ?? e.account_id) : null,
    })),
  }
}
