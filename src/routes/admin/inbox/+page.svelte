<script lang="ts">
  import { enhance } from "$app/forms"
  import { PROVIDER_LABELS } from "$lib/adops/doctrine"
  import { AUTONOMY_LABELS, RISK_BADGE_CLASS, GATE_BADGE_CLASS, formatRecType } from "$lib/adops/ui"
  import { reveal } from "$lib/actions/reveal"
  import type { ActionData, PageServerData } from "./$types"
  import type { Recommendation } from "$lib/adops/types"

  let { data, form }: { data: PageServerData; form: ActionData } = $props()

  let processing = $state<string | null>(null)
  // The rec just approved — flashes an in-place highlight + "✓ APPROVED" pop so
  // the re-sort to the bottom of the group reads as "recorded", not "vanished".
  let justApprovedId = $state<string | null>(null)
  let justApprovedTimer: ReturnType<typeof setTimeout> | null = null

  function flashApproved(id: string) {
    justApprovedId = id
    if (justApprovedTimer) clearTimeout(justApprovedTimer)
    justApprovedTimer = setTimeout(() => (justApprovedId = null), 2600)
  }
  $effect(() => () => {
    if (justApprovedTimer) clearTimeout(justApprovedTimer)
  })

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
          class="approve-card border p-4 sm:p-5"
          class:is-just-approved={rec.id === justApprovedId}
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
            {#if rec.status === "proposed" && rec.id === group.blockingRecId}
              <span class="badge badge-outline badge-sm badge-error font-mono">
                ⚑ APPROVE THIS TO SEE THE GATE REFUSE IT
              </span>
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
                  const approvedId = rec.id
                  processing = rec.id
                  return async ({ update, result }) => {
                    processing = null
                    await update()
                    // Flash unless the approve was rejected (e.g. already-approved).
                    if (result?.type !== "failure" && result?.type !== "error") flashApproved(approvedId)
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
              {#if rec.id === justApprovedId}
                <span
                  class="scale-in-center badge badge-sm badge-success font-mono"
                  role="status"
                  aria-live="polite"
                >
                  ✓ JUST APPROVED
                </span>
              {:else}
                <span class="badge badge-outline badge-sm font-mono">APPROVED</span>
              {/if}
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

<!-- tour continuation: operate (stop 03) done → the thinking (README) -->
<div class="mt-16 border-t pt-10" style="border-color: var(--color-line)">
  <span class="hud text-primary">STOP 03 · OPERATE — GATED</span>
  <h2 class="statement mt-4 mb-3 text-2xl sm:text-3xl">
    Find them. Pitch them. Win them.<br />Then run their accounts &mdash; safely.
  </h2>
  <p class="text-base-content/70 mb-8 max-w-xl text-sm leading-relaxed">
    That&rsquo;s the whole loop: a funnel score opens the door, a personalized pitch books the call,
    and this console operates the account behind a human approval gate. The README answers the three
    questions the contest asks &mdash; what it does, why this one, and what I&rsquo;d build next.
  </p>
  <a
    href="/readme"
    class="btn btn-primary btn-lg rounded-none px-10 font-mono text-sm tracking-[0.08em] uppercase"
  >
    Read the Thinking (README) &rarr;
  </a>
</div>

<style>
  /* In-place approval flash: a brief success ring that glows in and settles,
     so the re-sort to the bottom of the group reads as "recorded", not "gone".
     Transition-only (no @keyframes); driven by toggling .is-just-approved. */
  .approve-card {
    transition: box-shadow 500ms ease-out;
  }
  .approve-card.is-just-approved {
    box-shadow:
      0 0 0 1px var(--color-success),
      0 0 22px -6px var(--color-success);
  }
  @media (prefers-reduced-motion: reduce) {
    .approve-card {
      transition: none;
    }
  }
</style>
