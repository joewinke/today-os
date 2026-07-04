<script lang="ts">
  import { untrack } from "svelte"
  import { enhance } from "$app/forms"
  import type { SubmitFunction } from "@sveltejs/kit"
  import { parseRedFlags } from "$lib/adops/doctrine/redflagParser"
  import { RISK_BADGE_CLASS } from "$lib/adops/ui"
  import type { PageServerData, ActionData } from "./$types"

  let { data, form }: { data: PageServerData; form: ActionData } = $props()

  let active = $state<string>(untrack(() => data.docs[0]?.provider ?? "google_ads"))
  let editing = $state(false)
  let draft = $state("")
  let saveForm: HTMLFormElement | undefined = $state()

  const activeDoc = $derived(data.docs.find((d) => d.provider === active) ?? data.docs[0])
  // Live PREVIEW parsed with the SAME grammar the engine reads back (redflagParser).
  const preview = $derived(editing ? parseRedFlags(draft) : null)
  const dirty = $derived(editing && draft !== activeDoc.markdown)

  function selectTab(provider: string) {
    active = provider
    editing = false
  }

  function startEdit() {
    draft = activeDoc.markdown
    editing = true
  }

  function onEditorKeydown(e: KeyboardEvent) {
    // ⌘/Ctrl + Enter saves without reaching for the mouse.
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault()
      saveForm?.requestSubmit()
    }
  }

  const handleSave: SubmitFunction = () => {
    return async ({ result, update }) => {
      await update() // rerun load + apply the action result
      if (result.type === "success") editing = false
    }
  }

  const handleReset: SubmitFunction = () => {
    return async ({ update }) => {
      await update()
      editing = false
    }
  }
</script>

<p class="hud mb-2">BEST-PRACTICES PLAYBOOKS</p>
<h1 class="statement text-4xl sm:text-5xl">Doctrine</h1>
<p class="mt-4 max-w-2xl text-sm leading-relaxed" style="color: var(--color-muted)">
  Doctrine is plain markdown. Marketers edit the playbook; the engine and the LLM both obey it. The prose grounds the
  LLM lane; the <span class="font-mono text-xs">RED FLAGS</span> section at the bottom of each file is the
  machine-checkable grammar the deterministic engine evaluates on every audit — no code change required to tune a
  threshold.
</p>
<p class="mt-2 max-w-2xl font-mono text-xs" style="color: var(--color-muted)">
  Sandbox — edits are scoped to this session's sweeps. Connect accounts to write doctrine for real.
</p>

<div class="mt-8 flex flex-wrap items-center gap-2" role="tablist" aria-label="Doctrine files">
  {#each data.docs as doc (doc.provider)}
    <button
      type="button"
      role="tab"
      aria-selected={active === doc.provider}
      aria-controls="doctrine-panel"
      class="btn btn-xs font-mono uppercase tracking-wider {active === doc.provider ? 'btn-primary' : 'btn-outline'}"
      onclick={() => selectTab(doc.provider)}
    >
      {doc.label} · {doc.redFlagCount}{#if doc.overridden}<span title="Sandbox override active" aria-label="overridden"> •</span>{/if}
    </button>
  {/each}

  <div class="ml-auto flex items-center gap-2">
    {#if !editing}
      <button type="button" class="btn btn-xs btn-outline hidden font-mono uppercase tracking-wider sm:inline-flex" onclick={startEdit}>
        Edit
      </button>
    {/if}
  </div>
</div>

<p class="hud mt-3 sm:hidden">Sandbox editing is desktop-only — open this playbook on a larger screen to tune it.</p>

{#if form && "error" in form && form.error}
  <p class="hud mt-4 text-error" role="alert">{form.error}</p>
{:else if form && "ok" in form && form.ok && form.action === "save" && form.provider === active}
  <p class="hud mt-4" role="status" style="color: var(--color-primary)">
    Saved — {form.rules} rule{form.rules === 1 ? "" : "s"} parsed{#if form.errors > 0}, {form.errors} unparsed{/if}. Your override applies to this session's next sweep.
  </p>
{:else if form && "ok" in form && form.ok && form.action === "reset" && form.provider === active}
  <p class="hud mt-4" role="status" style="color: var(--color-muted)">Reset — {activeDoc.label} is back to the shipped default.</p>
{/if}

{#if editing}
  <!-- ── EDIT MODE ─────────────────────────────────────────────────────────── -->
  <div class="mt-6 grid gap-6 lg:grid-cols-2">
    <!-- Editor -->
    <form method="POST" action="?/save" use:enhance={handleSave} bind:this={saveForm}>
      <input type="hidden" name="provider" value={active} />
      <label for="doctrine-editor" class="hud mb-2 block">
        EDIT · {activeDoc.label} · src/lib/adops/doctrine/{activeDoc.provider.replace("_", "-")}.md
      </label>
      <textarea
        id="doctrine-editor"
        name="markdown"
        bind:value={draft}
        onkeydown={onEditorKeydown}
        spellcheck="false"
        aria-describedby="editor-hint"
        class="editor-area h-[30rem] w-full resize-y bg-base-200 p-4 font-mono text-xs leading-relaxed outline-none"
      ></textarea>
      <div class="mt-3 flex flex-wrap items-center gap-2">
        <button type="submit" class="btn btn-xs btn-primary font-mono uppercase tracking-wider" disabled={!dirty}>Save override</button>
        <button type="button" class="btn btn-xs btn-outline font-mono uppercase tracking-wider" onclick={() => (editing = false)}>Cancel</button>
        {#if activeDoc.overridden}
          <span class="mx-1"></span>
        {/if}
        <span id="editor-hint" class="hud" style="color: var(--color-muted)">
          <kbd class="kbd kbd-xs">⌘/Ctrl</kbd> + <kbd class="kbd kbd-xs">↵</kbd> to save
        </span>
      </div>
      {#if activeDoc.overridden}
        <p class="hud mt-2" style="color: var(--color-muted)">
          Editing your sandbox override — <button type="submit" formaction="?/reset" formnovalidate class="link">reset to the shipped default</button>.
        </p>
      {/if}
    </form>

    <!-- Live preview of the parsed RED FLAGS grammar -->
    <div>
      <p class="hud mb-2">
        MACHINE-CHECKABLE PREVIEW · {preview?.rules.length ?? 0} RULE{(preview?.rules.length ?? 0) === 1 ? "" : "S"}{#if preview && preview.errors.length}
          · <span class="text-error">{preview.errors.length} PARSE ERROR{preview.errors.length === 1 ? "" : "S"}</span>{/if}
      </p>

      <div class="guided mb-4 p-3" style="border:1px solid var(--color-primary)">
        <p class="hud mb-1" style="color: var(--color-primary)">TRY IT — TIGHTEN THE AUDIENCE-BURN CEILING</p>
        <p class="text-xs leading-relaxed" style="color: color-mix(in oklch, var(--color-base-content) 85%, transparent)">
          In <span class="font-mono">meta-high-frequency</span>, change <span class="font-mono">frequency_30d &gt; 4</span> to
          <span class="font-mono">frequency_30d &gt; 2.5</span>, Save, then run a sweep on the Meta account. The prospecting
          campaign sits at frequency 2.9 — just under the shipped ceiling, just over yours — so a fresh audience-burn
          finding appears on the next sweep, citing your edited rule. Reset restores the shipped playbook.
        </p>
      </div>

      {#if preview && !preview.hasRedFlagsSection}
        <p class="hud text-error" role="alert">
          No <span class="font-mono">## RED FLAGS</span> section found — the deterministic engine has nothing to evaluate. A
          sweep falls back to the shipped thresholds.
        </p>
      {/if}

      {#if preview && preview.errors.length}
        <ul class="mb-4 space-y-2">
          {#each preview.errors as err (err.line)}
            <li class="rule-error p-2" style="border-left:2px solid var(--color-error)">
              <p class="hud text-error">LINE {err.line} · {err.reason}</p>
              <p class="mt-1 truncate font-mono text-xs" style="color: var(--color-muted)">{err.text}</p>
            </li>
          {/each}
        </ul>
      {/if}

      <ul class="space-y-2">
        {#each preview?.rules ?? [] as rule (rule.ruleId)}
          <li class="rule-card p-3" style="border:1px solid var(--color-line)">
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-mono text-xs" style="color: var(--color-primary)">{rule.ruleId}</span>
              <span class="badge badge-xs {RISK_BADGE_CLASS[rule.risk] ?? 'badge-ghost'}">{rule.risk}</span>
              <span class="hud" style="color: var(--color-muted)">{rule.recommend} · {rule.action}</span>
            </div>
            <p class="mt-1 font-mono text-xs" style="color: color-mix(in oklch, var(--color-base-content) 80%, transparent)">
              when: {rule.when}
            </p>
            <p class="mt-1 text-xs leading-snug" style="color: var(--color-muted)">{rule.why}</p>
          </li>
        {/each}
      </ul>
    </div>
  </div>
{:else}
  <!-- ── READ MODE ─────────────────────────────────────────────────────────── -->
  {#if activeDoc.overridden}
    <div class="mt-6 flex flex-wrap items-center justify-between gap-3 p-3" style="border:1px solid var(--color-primary)">
      <p class="text-xs" style="color: color-mix(in oklch, var(--color-base-content) 85%, transparent)">
        <span class="hud" style="color: var(--color-primary)">SANDBOX OVERRIDE ACTIVE</span> — your edits to {activeDoc.label}
        apply to this session's sweeps.
      </p>
      <form method="POST" action="?/reset" use:enhance={handleReset}>
        <input type="hidden" name="provider" value={active} />
        <button type="submit" class="btn btn-xs btn-outline font-mono uppercase tracking-wider">Reset to default</button>
      </form>
    </div>
  {/if}

  <div id="doctrine-panel" role="tabpanel" tabindex="0" class="doctrine mt-6 border p-6 sm:p-8" style="border-color: var(--color-line)">
    <p class="hud mb-6">
      src/lib/adops/doctrine/{activeDoc.provider.replace("_", "-")}.md · {activeDoc.redFlagCount} MACHINE-CHECKABLE RULES{#if activeDoc.overridden}
        · <span style="color: var(--color-primary)">SANDBOX OVERRIDE</span>{/if}
    </p>
    <!-- eslint-disable-next-line svelte/no-at-html-tags — repo-controlled markdown, HTML-escaped before rendering -->
    {@html activeDoc.html}
  </div>
{/if}

<style>
  .editor-area {
    border: 1px solid var(--color-line);
    color: var(--color-base-content);
    tab-size: 2;
  }
  .editor-area:focus {
    border-color: var(--color-primary);
  }
  .rule-card,
  .rule-error,
  .guided {
    background: color-mix(in oklch, var(--color-base-200) 60%, transparent);
  }
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
