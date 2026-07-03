<script lang="ts">
  import { untrack } from "svelte"
  import type { PageServerData } from "./$types"

  let { data }: { data: PageServerData } = $props()

  let active = $state(untrack(() => data.docs[0]?.provider ?? "google_ads"))

  const activeDoc = $derived(data.docs.find((d) => d.provider === active) ?? data.docs[0])
</script>

<p class="hud mb-2">BEST-PRACTICES PLAYBOOKS</p>
<h1 class="statement text-4xl sm:text-5xl">Doctrine</h1>
<p class="mt-4 max-w-2xl text-sm leading-relaxed" style="color: var(--color-muted)">
  Doctrine is plain markdown. Marketers edit the playbook; the engine and the LLM both obey it. The prose grounds the
  LLM lane; the <span class="font-mono text-xs">RED FLAGS</span> section at the bottom of each file is the
  machine-checkable grammar the deterministic engine evaluates on every audit — no code change required to tune a
  threshold.
</p>

<div class="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Doctrine files">
  {#each data.docs as doc (doc.provider)}
    <button
      type="button"
      role="tab"
      aria-selected={active === doc.provider}
      aria-controls="doctrine-panel"
      class="btn btn-xs font-mono uppercase tracking-wider {active === doc.provider ? 'btn-primary' : 'btn-outline'}"
      onclick={() => (active = doc.provider)}
    >
      {doc.label} · {doc.redFlagCount}
    </button>
  {/each}
</div>

<div
  id="doctrine-panel"
  role="tabpanel"
  tabindex="0"
  class="doctrine mt-6 border p-6 sm:p-8"
  style="border-color: var(--color-line)"
>
  <p class="hud mb-6">
    src/lib/adops/doctrine/{activeDoc.provider.replace("_", "-")}.md · {activeDoc.redFlagCount} MACHINE-CHECKABLE RULES
  </p>
  <!-- eslint-disable-next-line svelte/no-at-html-tags — repo-controlled markdown, HTML-escaped before rendering -->
  {@html activeDoc.html}
</div>

<style>
  .doctrine :global(h2) {
    font-family: var(--font-display);
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.01em;
    font-size: 1.25rem;
    margin: 0 0 1rem;
  }
  .doctrine :global(h3) {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-muted);
    margin: 2rem 0 0.75rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-line);
  }
  .doctrine :global(h4),
  .doctrine :global(h5) {
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin: 1.25rem 0 0.5rem;
  }
  .doctrine :global(p) {
    font-size: 0.875rem;
    line-height: 1.7;
    margin: 0.5rem 0;
    color: color-mix(in oklch, var(--color-base-content) 85%, transparent);
  }
  .doctrine :global(ul) {
    margin: 0.5rem 0 1rem;
    padding-left: 1.1rem;
    list-style: square;
  }
  .doctrine :global(li) {
    font-size: 0.875rem;
    line-height: 1.65;
    margin: 0.35rem 0;
    color: color-mix(in oklch, var(--color-base-content) 85%, transparent);
  }
  .doctrine :global(li::marker) {
    color: var(--color-primary);
  }
  .doctrine :global(code) {
    font-family: var(--font-mono);
    font-size: 0.8em;
    padding: 0.05rem 0.3rem;
    background: var(--color-base-200);
    border: 1px solid var(--color-line);
  }
  .doctrine :global(blockquote) {
    border-left: 1px solid var(--color-primary);
    padding: 0.25rem 0 0.25rem 1rem;
    margin: 1rem 0;
  }
  .doctrine :global(blockquote p) {
    color: var(--color-muted);
    font-size: 0.8125rem;
  }
  .doctrine :global(hr) {
    border: 0;
    border-top: 1px solid var(--color-line);
    margin: 1.75rem 0;
  }
  .doctrine :global(strong) {
    color: var(--color-base-content);
  }
</style>
