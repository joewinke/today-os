import type { Handle } from "@sveltejs/kit"
import { withSession } from "$lib/server/session"

/**
 * Give every visitor a stable, isolated demo session. The `sid` cookie scopes
 * the in-memory ad-ops store and the active demo theme per-browser, so one
 * reviewer's scan can't re-theme what another reviewer is viewing.
 *
 * The id is opaque and carries no PII; it only namespaces demo state. Generated
 * without Math.random (unavailable here) — a short counter + the request's high-
 * res time is plenty of entropy for isolating concurrent demo visitors.
 */
let counter = 0

export const handle: Handle = async ({ event, resolve }) => {
  let sid = event.cookies.get("sid")
  if (!sid) {
    sid = `s_${(++counter).toString(36)}_${Math.floor(performance.now()).toString(36)}`
    event.cookies.set("sid", sid, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24, // a day is plenty for a demo session
    })
  }
  return withSession(sid, () => resolve(event))
}
