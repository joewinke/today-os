/**
 * B-roll generation lane — the studio's GEN source, made real.
 *
 * Per-segment "GENERATE B-ROLL" posts the segment transcript (plus style
 * directives) to /api/seedance/generate. With a SEEDANCE_API_KEY on the
 * server the client polls /api/seedance/tasks/[id] at 10s until the clip is
 * ready; without one the endpoint answers { enabled: false } and the UI
 * attaches a deterministic roofing-themed sample clip instead — same row UX,
 * zero-key demo mode.
 */

export type BrollSource = "seedance" | "sample"

/** A clip attached to a segment — lands in the effects.json sidecar. */
export interface BrollAttachment {
  url: string
  source: BrollSource
  taskId?: string
}

/** An in-flight (or failed) generation task for a segment. */
export interface BrollJob {
  status: "queued" | "generating" | "failed"
  taskId?: string
  startedAt: number // epoch ms — drives the GENERATING elapsed readout
  failedReason?: string
}

/** Fallback sample clips (roofing-themed) used when no key is configured. */
export const SAMPLE_VIDEOS = [
  "/video/samples/rooftops.mp4",
  "/video/samples/crew.mp4",
  "/video/samples/signing.mp4",
] as const

/** Deterministic sample pick — segment N always gets the same clip. */
export const sampleFor = (segIdx: number): string =>
  SAMPLE_VIDEOS[segIdx % SAMPLE_VIDEOS.length]

/** Prompt = the segment's spoken line + fixed commercial style directives. */
export const brollPrompt = (transcript: string): string =>
  `${transcript.trim()}, cinematic commercial b-roll, no text, no logos`
