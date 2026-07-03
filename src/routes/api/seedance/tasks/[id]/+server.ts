import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import { getTask, seedanceEnabled } from "$lib/server/seedance"

/** Poll a Seedance task. Clients poll at >=10s intervals. */
export const GET: RequestHandler = async ({ params }) => {
  if (!seedanceEnabled()) {
    return json({ enabled: false as const })
  }
  const task = await getTask(params.id)
  return json({ enabled: true as const, ...task })
}
