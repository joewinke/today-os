import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import { createVideoTask, seedanceEnabled, type SeedanceRequest } from "$lib/server/seedance"

/**
 * Submit a Seedance generation task.
 * Body: { prompt, durationSecs?, aspectRatio?, resolution?, model?, imageUrls? }
 * 200: { enabled: true, taskId, credits }
 * 200 (no key): { enabled: false } — client falls back to sample assets.
 */
export const POST: RequestHandler = async ({ request }) => {
  if (!seedanceEnabled()) {
    return json({ enabled: false as const })
  }
  const body = (await request.json()) as SeedanceRequest
  if (!body?.prompt || typeof body.prompt !== "string" || body.prompt.length > 2000) {
    return json({ error: "prompt required (max 2000 chars)" }, { status: 400 })
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
  return json({ enabled: true as const, ...task })
}
