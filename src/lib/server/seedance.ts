/**
 * Seedance 2.0 API client (seedance2.ai) — the video-generation lane.
 *
 * Used by the Creative Studio to generate real ad b-roll from segment
 * transcripts, and by the build pipeline to produce the site's ambient
 * background loops. Degrades gracefully: when SEEDANCE_API_KEY is absent,
 * callers fall back to pre-generated sample assets so the demo never breaks.
 *
 * API shape (https://seedance2.ai/api-docs):
 *   POST /v1/videos/generations  -> { taskId, credits }   (202)
 *   GET  /v1/tasks/:id           -> { status: queued|generating|completed|failed, data.results[0] }
 * Poll no more than every 10s. Result URLs expire — download promptly.
 */

const BASE_URL = process.env.SEEDANCE_API_URL ?? "https://api.seedance2.ai"

export type SeedanceModel = "seedance-2-0" | "seedance-2-0-fast"

export interface SeedanceRequest {
  prompt: string
  model?: SeedanceModel
  durationSecs?: number // 4-15
  aspectRatio?: "16:9" | "9:16" | "4:3" | "3:4" | "21:9" | "1:1" | "adaptive"
  resolution?: "480p" | "720p" | "1080p" | "4k"
  generateAudio?: boolean
  imageUrls?: string[] // 1-2 => image-to-video
}

export interface SeedanceTask {
  id: string
  status: "queued" | "generating" | "completed" | "failed"
  videoUrl: string | null
  failedReason: string | null
  credits: number | null
}

export function seedanceEnabled(): boolean {
  return Boolean(process.env.SEEDANCE_API_KEY)
}

function authHeaders(): Record<string, string> {
  const key = process.env.SEEDANCE_API_KEY
  if (!key) throw new Error("SEEDANCE_API_KEY not configured")
  return { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }
}

/** Submit a generation task. Returns the task id (poll with getTask). */
export async function createVideoTask(req: SeedanceRequest): Promise<{ taskId: string; credits: number }> {
  const generation_type = req.imageUrls?.length ? "image-to-video" : "text-to-video"
  const res = await fetch(`${BASE_URL}/v1/videos/generations`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      model: req.model ?? "seedance-2-0-fast",
      input: {
        prompt: req.prompt,
        generation_type,
        ...(req.imageUrls?.length ? { image_urls: req.imageUrls.slice(0, 2) } : {}),
        duration: req.durationSecs ?? 5,
        aspect_ratio: req.aspectRatio ?? "16:9",
        resolution: req.resolution ?? "720p",
        generate_audio: req.generateAudio ?? false,
        watermark: false,
        seed: -1,
      },
    }),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`seedance submit failed: HTTP ${res.status} ${body.slice(0, 300)}`)
  }
  const json = (await res.json()) as { taskId: string; credits: number }
  if (!json.taskId) throw new Error("seedance submit returned no taskId")
  return json
}

/** Fetch task status. Callers poll at >=10s intervals per API guidance. */
export async function getTask(taskId: string): Promise<SeedanceTask> {
  const res = await fetch(`${BASE_URL}/v1/tasks/${encodeURIComponent(taskId)}`, {
    headers: authHeaders(),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`seedance status failed: HTTP ${res.status} ${body.slice(0, 300)}`)
  }
  const json = (await res.json()) as {
    id: string
    status: SeedanceTask["status"]
    credits?: number
    failed_reason?: string | null
    data?: { results?: string[] }
  }
  return {
    id: json.id,
    status: json.status,
    videoUrl: json.data?.results?.[0] ?? null,
    failedReason: json.failed_reason ?? null,
    credits: json.credits ?? null,
  }
}
