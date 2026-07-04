/**
 * doctrineOverride.ts — per-session SANDBOX overrides of the doctrine markdown.
 *
 * The product claim is "marketers edit the playbook; the engine and the LLM both
 * obey." In the sandbox we make that true WITHOUT a database: a reviewer's edit to
 * a provider's doctrine is stashed against their `sid` session (the same isolation
 * the ad-ops store uses), so the NEXT sweep in that browser resolves the edited
 * doctrine instead of the shipped default. Another reviewer's session is untouched.
 *
 * Server-only — reads the request session via AsyncLocalStorage. Consumed by:
 *   • /admin/doctrine/+page.server.ts   (save / reset / render the effective text)
 *   • the redflags.ts deterministic seam (resolveMetaFrequencyCeiling — one line)
 *   • the store.ts LLM-lane seam          (getEffectiveDoctrine — one line)
 *
 * SAFETY: resolution NEVER throws. A missing/empty/unparseable override degrades
 * to the shipped default, so a broken edit can slow no sweep and crash nothing.
 *
 * HANDOFF (SunnyMountain): the two seams above are the only touches outside this
 * agent's scope. Exact diffs are in the review signal. Applying them makes the
 * proof loop live; without them this file is inert but harmless.
 */

import type { Provider } from "./types"
import { DOCTRINE } from "./doctrine"
import { currentSession } from "$lib/server/session"
import { metaFrequencyCeiling } from "./doctrine/redflagParser"

const STASH = Symbol.for("itstoday.adops.doctrineOverride")

type OverrideBag = Partial<Record<Provider, string>>

// Per-session override bags, stashed on globalThis so dev-server HMR doesn't wipe
// a reviewer's edit mid-demo (mirrors the store.ts singleton pattern).
const g = globalThis as unknown as { [STASH]?: Map<string, OverrideBag> }
if (!g[STASH]) g[STASH] = new Map<string, OverrideBag>()
const overrides = g[STASH]

function bag(): OverrideBag {
  const sid = currentSession()
  let b = overrides.get(sid)
  if (!b) {
    b = {}
    overrides.set(sid, b)
  }
  return b
}

/** The raw override markdown for this session, or null if none is set. */
export function getDoctrineOverride(provider: Provider): string | null {
  return bag()[provider] ?? null
}

/** Whether this session has a sandbox override for `provider`. */
export function hasDoctrineOverride(provider: Provider): boolean {
  return bag()[provider] != null
}

/** Set (or replace) this session's sandbox override for `provider`. */
export function setDoctrineOverride(provider: Provider, markdown: string): void {
  bag()[provider] = markdown
}

/** Drop this session's override — the next sweep sees the shipped default again. */
export function clearDoctrineOverride(provider: Provider): void {
  delete bag()[provider]
}

/** The doctrine text a sweep should use for THIS session: override, else default. */
export function getEffectiveDoctrine(provider: Provider): string {
  return getDoctrineOverride(provider) ?? DOCTRINE[provider] ?? ""
}

/**
 * Deterministic-engine seam: the meta audience-burn frequency ceiling in force for
 * THIS session. Returns the edited value when a valid override sets one, else the
 * engine's compiled default — so with no override the engine is byte-identical.
 */
export function resolveMetaFrequencyCeiling(fallback: number): number {
  const md = getDoctrineOverride("meta_ads")
  if (!md) return fallback
  const parsed = metaFrequencyCeiling(md)
  return parsed != null && parsed > 0 ? parsed : fallback
}
