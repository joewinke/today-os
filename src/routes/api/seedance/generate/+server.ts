import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import { createVideoTask, seedanceEnabled, type SeedanceRequest } from "$lib/server/seedance"

/**
 * In-memory rate limiter for live video generation.
 *
 * This endpoint is unauthenticated and every successful call spends REAL
 * Seedance credits (~40-80 per clip). A widely-shared demo URL could otherwise
 * drain the balance, so we cap generations per-IP and globally using simple
 * module-level sliding windows (timestamp arrays, pruned on each request — no
 * DB, no external store; resets when the server restarts, which is fine for a
 * demo). When a cap is hit we return { enabled: false }, and the studio client
 * already treats that as "attach a bundled sample instead" — so a rate-limited
 * visitor still sees a video, just a free pre-generated one, with no client
 * change needed.
 */
const PER_IP_LIMIT = 3 // max live generations per client IP...
const PER_IP_WINDOW_MS = 60 * 60 * 1000 // ...per rolling hour
const GLOBAL_LIMIT = 30 // max live generations across ALL clients...
const GLOBAL_WINDOW_MS = 24 * 60 * 60 * 1000 // ...per rolling 24h

const ipHits = new Map<string, number[]>()
let globalHits: number[] = []

function pruneOld(timestamps: number[], windowMs: number, now: number): number[] {
  const cutoff = now - windowMs
  return timestamps.filter((t) => t > cutoff)
}

/**
 * Check the rolling windows for this IP + globally. Does NOT record the hit —
 * call recordHit() only once a generation is actually submitted, so failed
 * submissions don't burn the caller's quota.
 */
function checkRateLimit(ip: string): { ok: true } | { ok: false; reason: string } {
  const now = Date.now()

  const global = pruneOld(globalHits, GLOBAL_WINDOW_MS, now)
  globalHits = global
  if (global.length >= GLOBAL_LIMIT) {
    return { ok: false, reason: "Daily demo generation limit reached. Showing a sample clip instead." }
  }

  const perIp = pruneOld(ipHits.get(ip) ?? [], PER_IP_WINDOW_MS, now)
  ipHits.set(ip, perIp)
  if (perIp.length >= PER_IP_LIMIT) {
    return { ok: false, reason: "You've hit the hourly generation limit. Showing a sample clip instead." }
  }

  return { ok: true }
}

/** Record a successful submission against both windows. */
function recordHit(ip: string): void {
  const now = Date.now()
  globalHits.push(now)
  ipHits.set(ip, [...(ipHits.get(ip) ?? []), now])
}

/**
 * Submit a Seedance generation task.
 * Body: { prompt, durationSecs?, aspectRatio?, resolution?, model?, imageUrls? }
 * 200: { enabled: true, taskId, credits }
 * 200 (no key): { enabled: false } — client falls back to sample assets.
 * 200 (rate limited): { enabled: false, rateLimited: true, reason } — same
 *   sample fallback, no Seedance call / no spend.
 */
export const POST: RequestHandler = async ({ request, getClientAddress }) => {
  if (!seedanceEnabled()) {
    return json({ enabled: false as const })
  }
  const body = (await request.json()) as SeedanceRequest
  if (!body?.prompt || typeof body.prompt !== "string" || body.prompt.length > 2000) {
    return json({ error: "prompt required (max 2000 chars)" }, { status: 400 })
  }

  // Rate limit BEFORE spending: an over-limit request never reaches Seedance.
  const ip = getClientAddress()
  const limit = checkRateLimit(ip)
  if (!limit.ok) {
    return json({ enabled: false as const, rateLimited: true as const, reason: limit.reason })
  }

  // Demo guardrails: fast model, short clips, capped resolution — credits are real.
  const task = await createVideoTask({
    prompt: body.prompt,
    model: "seedance-2-0-fast",
    durationSecs: Math.min(Math.max(body.durationSecs ?? 5, 4), 8),
    aspectRatio: body.aspectRatio ?? "16:9",
    resolution: body.resolution === "1080p" ? "1080p" : "720p",
    generateAudio: false,
    imageUrls: body.imageUrls?.slice(0, 2),
  })
  recordHit(ip)
  return json({ enabled: true as const, ...task })
}
