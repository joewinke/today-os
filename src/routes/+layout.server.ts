import type { LayoutServerLoad } from "./$types"
import { getManagedClients } from "$lib/os/store"
import { slugify } from "$lib/os/types"

/**
 * Feed the cockpit ClientSwitcher its options from the (server-only) OS store,
 * via props — cockpit components must never import $lib/os client-side. Slugs use
 * the canonical slugify so the links match /report/[client] resolution.
 */
export const load: LayoutServerLoad = async () => ({
  clients: getManagedClients().map((c) => ({ slug: slugify(c.company), label: c.company })),
})
