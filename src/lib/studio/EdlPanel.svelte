<script lang="ts">
  interface Props {
    text: string
    label?: string
  }

  let { text, label = "EDL — LIVE" }: Props = $props()

  let copied = $state(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      copied = true
      clearTimeout(timer)
      timer = setTimeout(() => (copied = false), 1400)
    } catch {
      /* clipboard unavailable — no-op */
    }
  }
</script>

<div class="flex min-h-0 flex-col border border-[var(--color-line)] bg-base-200">
  <div class="flex items-center justify-between border-b border-[var(--color-line)] px-3 py-2">
    <span class="hud">{label}</span>
    <button
      type="button"
      class="hud cursor-pointer border border-[var(--color-line)] bg-transparent px-2 py-0.5 transition-colors hover:border-primary hover:text-primary"
      class:text-primary={copied}
      onclick={copy}
    >
      {copied ? "COPIED" : "COPY"}
    </button>
  </div>
  <pre
    class="min-h-0 flex-1 overflow-auto px-3 py-2 font-mono text-[0.6875rem] leading-relaxed whitespace-pre text-base-content/80">{text}</pre>
</div>
