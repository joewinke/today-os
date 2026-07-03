<script lang="ts">
  import { enhance } from "$app/forms"
  import { PROVIDER_LABELS } from "$lib/adops/doctrine"
  import { AUTONOMY_LABELS, RISK_BADGE_CLASS, GATE_BADGE_CLASS, formatRecType } from "$lib/adops/ui"
  import { reveal } from "$lib/actions/reveal"
  import type { ActionData, PageServerData } from "./$types"
  import type { Recommendation } from "$lib/adops/types"

  let { data, form }: { data: PageServerData; form: ActionData } = $props()

  let processing = $state<string | null>(null)

  const totalProposed = $derived(data.groups.reduce((n, g) => n + g.proposed.length, 0))
  const totalApproved = $derived(data.groups.reduce((n, g) => n + g.approved.length, 0))

  function changeJson(rec: Recommendation): string {
    return JSON.stringify(rec.proposed_change, null, 2)
  }
</script>

<p class="hud mb-2">APPROVAL INBOX</p>
<h1 class="statement text-4xl sm:text-5xl">Inbox</h1>
<p class="hud mt-3">
  {totalProposed} PROPOSED · {totalApproved} APPROVED · EVERY CHANGE IS HUMAN-GATED BY THE AUTONOMY LADDER
</p>

{#if form && "error" in form && form.error}
  <p class="hud mt-3 text-error" role="alert">{form.error}</p>
{/if}

{#if data.groups.length === 0}
  <div class="mt-10 border p-10 text-center" style="border-color: var(--color-line)">
    <p class="hud">INBOX EMPTY</p>
    <p class="mt-3 text-sm" style="color: var(--color-muted)">
      No recommendations yet. Run a sweep from the <a href="/admin" class="link text-primary">overview</a> to audit the
      due accounts.
    </p>
  </div>
{/if}

{#each data.groups as group (group.account.id)}
  <section class="mt-10" id={group.account.id} aria-label="Recommendations for {group.account.name}">
    <div class="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b pb-2" style="border-color: var(--color-line)">
      <h2 class="text-lg font-semibold">
        <a href="/admin/accounts/{group.account.id}" class="hover:text-primary transition-colors">
          {group.account.name}
        </a>
      </h2>
      <span class="hud">{PROVIDER_LABELS[group.account.provider]}</span>
      <span class="hud">AUTONOMY: {AUTONOMY_LABELS[group.account.autonomy]}</span>
      {#if group.account.autonomy === "auto" && group.account.spend_cap_cents == null}
        <span class="hud text-error">NO SPEND CAP — AUTO FAILS CLOSED</span>
      {/if}
      <span class="hud ml-auto">
        {group.proposed.length} PROPOSED{group.dismissed > 0 ? ` · ${group.dismissed} DISMISSED` : ""}
      </span>
    </div>

    <div class="mt-4 space-y-4">
      {#each [...group.proposed, ...group.approved] as rec, i (rec.id)}
        <article
          class="border p-4 sm:p-5"
          style="border-color: var(--color-line)"
          use:reveal={{ animation: "fade-in", delay: Math.min(i, 6) * 0.05 }}
        >
          <div class="flex flex-wrap items-center gap-2">
            <span class="badge badge-outline badge-sm font-mono {RISK_BADGE_CLASS[rec.risk]}">
              {rec.risk.toUpperCase()} RISK
            </span>
            <span class="badge badge-outline badge-sm font-mono">{formatRecType(rec.type)}</span>
            <span class="badge badge-ghost badge-sm font-mono">
              {rec.source === "red_flag" ? "RED FLAG" : "LLM"}
            </span>
            {#if rec.source === "red_flag" && typeof rec.proposed_change["rule_id"] === "string"}
              <span class="hud">{rec.proposed_change["rule_id"]}</span>
            {/if}
          </div>

          <h3 class="mt-2.5 font-semibold">{rec.title}</h3>
          <p class="mt-1.5 text-sm leading-relaxed" style="color: var(--color-muted)">{rec.rationale}</p>

          <p class="hud mt-3" style="text-transform: none">
            TARGET&nbsp; <span class="text-base-content">{rec.target_level}</span> ·
            <span class="text-base-content">{rec.target_external_id}</span>
            {#if rec.estimated_impact}
              &nbsp;·&nbsp;<span class="text-success">{rec.estimated_impact}</span>
            {/if}
          </p>

          <details class="mt-3 group">
            <summary class="hud cursor-pointer list-none select-none transition-colors hover:text-base-content">
              <span class="inline-block transition-transform group-open:rotate-90">&rsaquo;</span>
              PROPOSED CHANGE (JSON)
            </summary>
            <pre
              class="mt-2 overflow-x-auto border bg-base-200 p-3 font-mono text-xs leading-relaxed"
              style="border-color: var(--color-line)">{changeJson(rec)}</pre>
          </details>

          {#if rec.status === "proposed"}
            <div class="mt-4 flex items-center gap-2 border-t pt-4" style="border-color: var(--color-line)">
              <form
                method="POST"
                action="?/approve"
                use:enhance={() => {
                  processing = rec.id
                  return async ({ update }) => {
                    processing = null
                    await update()
                  }
                }}
              >
                <input type="hidden" name="id" value={rec.id} />
                <button
                  type="submit"
                  class="btn btn-success btn-outline btn-xs font-mono uppercase tracking-wider"
                  disabled={processing !== null}
                >
                  {#if processing === rec.id}<span class="loading loading-spinner loading-xs"></span>{/if}
                  Approve
                </button>
              </form>
              <form
                method="POST"
                action="?/dismiss"
                use:enhance={() => {
                  processing = rec.id
                  return async ({ update }) => {
                    processing = null
                    await update()
                  }
                }}
              >
                <input type="hidden" name="id" value={rec.id} />
                <button
                  type="submit"
                  class="btn btn-ghost btn-xs font-mono uppercase tracking-wider text-error"
                  disabled={processing !== null}
                >
                  Dismiss
                </button>
              </form>
            </div>
          {:else if rec.status === "approved"}
            <div class="mt-4 flex flex-wrap items-center gap-2 border-t pt-4" style="border-color: var(--color-line)">
              <span class="badge badge-outline badge-sm font-mono">APPROVED</span>
              {#if rec.gate_verdict}
                <span class="badge badge-outline badge-sm font-mono {GATE_BADGE_CLASS[rec.gate_verdict]}">
                  GATE: {rec.gate_verdict.toUpperCase().replace("_", " ")}
                </span>
                <span class="hud" style="text-transform: none">{rec.gate_reason}</span>
              {/if}
            </div>
          {/if}
        </article>
      {/each}
    </div>
  </section>
{/each}

<!-- tour continuation: the console (stop 02) hands off to the studio (stop 03) -->
<div class="mt-16 border-t pt-10" style="border-color: var(--color-line)">
  <span class="hud text-primary">TOUR STOP 02 · THE CONSOLE — DONE · NEXT &rarr; 03</span>
  <h2 class="statement mt-4 mb-3 text-2xl sm:text-3xl">
    You&rsquo;ve seen how it finds the money.<br />Now see how it makes the creative.
  </h2>
  <p class="text-base-content/70 mb-8 max-w-xl text-sm leading-relaxed">
    Some of these findings are &ldquo;the creative is fatigued &mdash; make a new one.&rdquo; That
    hand-off is the studio: edit video like a document, generate AI b-roll from a line of script,
    and personalize the whole ad for every lead.
  </p>
  <a
    href="/studio"
    class="btn btn-primary btn-lg rounded-none px-10 font-mono text-sm tracking-[0.08em] uppercase"
  >
    Enter the Studio &rarr;
  </a>
</div>
