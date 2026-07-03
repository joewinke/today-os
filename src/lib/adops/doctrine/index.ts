/**
 * Doctrine loader — the best-practices markdown files, bundled as raw text.
 *
 * These files are the ONLY place provider doctrine lives. The deterministic
 * red-flag engine implements the RED FLAGS section of each; the LLM lane
 * receives the full text as grounding; the /admin/doctrine page renders them.
 */

import type { Provider } from "../types"

import googleAds from "./google-ads.md?raw"
import metaAds from "./meta-ads.md?raw"
import taboola from "./taboola.md?raw"
import tiktokAds from "./tiktok-ads.md?raw"

export const DOCTRINE: Record<Provider, string> = {
  google_ads: googleAds,
  meta_ads: metaAds,
  taboola: taboola,
  tiktok_ads: tiktokAds,
}

export function loadDoctrine(provider: Provider): string {
  return DOCTRINE[provider] ?? ""
}

export const PROVIDER_LABELS: Record<Provider, string> = {
  google_ads: "Google Ads",
  meta_ads: "Meta Ads",
  taboola: "Taboola",
  tiktok_ads: "TikTok Ads",
}
