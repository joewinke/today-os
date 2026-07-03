/**
 * Per-visitor demo session id, carried through the request via AsyncLocalStorage.
 *
 * The demo store and the active theme are per-visitor so one reviewer scanning a
 * site can't re-theme what another reviewer is looking at mid-review. Rather than
 * thread a session id through every store/theme function, hooks.server.ts runs
 * each request inside `withSession(sid, …)`, and store/theme code reads the
 * current sid with `currentSession()`. Fire-and-forget continuations (the async
 * theming after a scan) inherit the same context, so they update the right
 * session's theme.
 */

import { AsyncLocalStorage } from "node:async_hooks"

const als = new AsyncLocalStorage<string>()

/** The shared, non-isolated session used outside a request (module load / tests). */
export const DEFAULT_SESSION = "default"

export function withSession<T>(sid: string, fn: () => T): T {
  return als.run(sid, fn)
}

export function currentSession(): string {
  return als.getStore() ?? DEFAULT_SESSION
}
