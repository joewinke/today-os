<script lang="ts">
  import { enhance } from "$app/forms"
  import { fmtUsd, fmtPct } from "$lib/adops/types"
  import { PROVIDER_LABELS } from "$lib/adops/doctrine"
  import {
    relativePast,
    relativeFuture,
    clockStamp,
    AUTONOMY_LABELS,
    RISK_BADGE_CLASS,
    GATE_BADGE_CLASS,
    formatRecType,
  } from "$lib/adops/ui"
  import type { ActionData, PageServerData } from "./$types"

  let { data, form }: { data: PageServerData; form: ActionData } = $props()

  let auditing = $state(false)

  const account = $derived(data.account)

  const STATUS_BADGE: Record<string, string> = {
    proposed: "",
    approved: "badge-success",
    dismissed: "badge-error",
  }
</script>

<p class="hud mb-2">
  <a href="/admin" class="hover:text-base-content transition-colors">OVERVIEW</a>
  &nbsp;/&nbsp;ACCOUNT
</p>
<div class="flex flex-wrap items-end justify-between gap-4">
  <div>
    <h1 class="statement text-3xl sm:text-5xl">{account.name}</h1>
    <p class="hud mt-3">
      {PROVIDER_LABELS[account.provider]} · {account.external_id} · AUTONOMY {AUTONOMY_LABELS[account.autonomy]} ·
      CAP {account.spend_cap_cents != null ? fmtUsd(account.spend_cap_cents) : "NONE"} · EVERY {account.cadence_hours}H
      · LAST {relativePast(account.last_run_at)} · NEXT {relativeFuture(account.next_run_at)}
    </p>
  </div>
  <form
    method="POST"
    action="?/runAudit"
    use:enhance={() => {
      auditing = true
      return async ({ update }) => {
        auditing = false
        await update()
      }
    }}
  >
    <button type="submit" class="btn btn-primary btn-sm font-mono uppercase tracking-wider" disabled={auditing}>
      {#if auditing}<span class="loading loading-spinner loading-xs"></span>{/if}
      Run audit now
    </button>
  </form>
</div>

{#if form && "ok" in form && form.ok}
  <p class="hud mt-3 text-success" role="status">
    AUDIT COMPLETE — {form.redFlags} RED FLAGS + {form.llm} LLM ({form.via}) &rarr; {form.recommendations} PROPOSED
  </p>
{:else if form && "error" in form && form.error}
  <p class="hud mt-3 text-error" role="alert">{form.error}</p>
{/if}

{#if !data.snapshot}
  <div class="mt-10 border p-10 text-center" style="border-color: var(--color-line)">
    <p class="hud">NO SNAPSHOT YET</p>
    <p class="mt-3 text-sm" style="color: var(--color-muted)">Run an audit to capture the first AdSpec snapshot.</p>
  </div>
{:else}
  <!-- Campaign table -->
  <p class="hud mt-10 mb-3">
    SNAPSHOT · {clockStamp(data.snapshot.taken_at)} · TRAILING {data.snapshot.window_days}D METRICS
  </p>
  <div class="overflow-x-auto border" style="border-color: var(--color-line)">
    <table class="table table-sm font-mono text-xs">
      <thead>
        <tr class="hud border-b" style="border-color: var(--color-line)">
          <th class="font-normal">CAMPAIGN</th>
          <th class="font-normal">STATUS</th>
          <th class="font-normal">BID STRATEGY</th>
          <th class="text-right font-normal">BUDGET</th>
          <th class="text-right font-normal">SPEND</th>
          <th class="text-right font-normal">CLICKS</th>
          <th class="text-right font-normal">CTR</th>
          <th class="text-right font-normal">CONV</th>
          <th class="text-right font-normal">CPA</th>
        </tr>
      </thead>
      <tbody>
        {#each data.campaigns as c (c.external_id)}
          <tr class="border-b last:border-b-0" style="border-color: var(--color-line)">
            <td class="max-w-64 truncate" title={c.name}>{c.name}</td>
            <td>{c.status}{c.is_budget_limited ? " · LIMITED" : ""}</td>
            <td>{c.bid_strategy}</td>
            <td class="text-right">{fmtUsd(c.budget_cents)}/{c.budget_period === "daily" ? "d" : c.budget_period}</td>
            <td class="text-right">{fmtUsd(c.cost_cents)}</td>
            <td class="text-right">{c.clicks.toLocaleString()}</td>
            <td class="text-right {c.impressions > 0 && c.ctr < 0.005 ? 'text-warning' : ''}">{fmtPct(c.ctr)}</td>
            <td class="text-right {c.conversions === 0 && c.cost_cents > 0 ? 'text-error' : ''}">{c.conversions}</td>
            <td class="text-right">{c.cpa_cents != null ? fmtUsd(c.cpa_cents) : "—"}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <!-- Recommendation history -->
  <p class="hud mt-10 mb-3">RECOMMENDATION HISTORY · {data.recommendations.length}</p>
  {#if data.recommendations.length === 0}
    <p class="text-sm" style="color: var(--color-muted)">None yet.</p>
  {:else}
    <div class="border" style="border-color: var(--color-line)">
      {#each data.recommendations as rec (rec.id)}
        <div class="flex flex-wrap items-center gap-2 border-b px-4 py-2.5 last:border-b-0" style="border-color: var(--color-line)">
          <span class="badge badge-outline badge-xs font-mono {RISK_BADGE_CLASS[rec.risk]}">{rec.risk.toUpperCase()}</span>
          <span class="badge badge-outline badge-xs font-mono">{formatRecType(rec.type)}</span>
          <span class="badge badge-ghost badge-xs font-mono">{rec.source === "red_flag" ? "RED FLAG" : "LLM"}</span>
          <span class="min-w-0 flex-1 truncate text-sm" title={rec.title}>{rec.title}</span>
          <span class="badge badge-outline badge-xs font-mono {STATUS_BADGE[rec.status]}">{rec.status.toUpperCase()}</span>
          {#if rec.gate_verdict}
            <span class="badge badge-outline badge-xs font-mono {GATE_BADGE_CLASS[rec.gate_verdict]}">
              {rec.gate_verdict.toUpperCase().replace("_", " ")}
            </span>
          {/if}
        </div>
      {/each}
    </div>
  {/if}

  <!-- YAML snapshot -->
  <p class="hud mt-10 mb-3">ADSPEC SNAPSHOT (YAML — THE HUMAN-DIFFABLE SSOT)</p>
  <pre
    class="max-h-96 overflow-auto border bg-base-200 p-4 font-mono text-xs leading-relaxed"
    style="border-color: var(--color-line)">{data.snapshot.yaml}</pre>
{/if}

<!-- Audit event log -->
<p class="hud mt-10 mb-3">AUDIT EVENTS · {data.events.length}</p>
{#if data.events.length === 0}
  <p class="text-sm" style="color: var(--color-muted)">No events for this account yet.</p>
{:else}
  <div class="border font-mono text-xs" style="border-color: var(--color-line)">
    {#each data.events as event (event.id)}
      <div class="flex flex-wrap gap-x-4 gap-y-0.5 border-b px-4 py-2 last:border-b-0" style="border-color: var(--color-line)">
        <span style="color: var(--color-muted)">{clockStamp(event.at)}</span>
        <span class="uppercase text-primary">{event.kind}</span>
        <span class="min-w-0 flex-1">{event.message}</span>
      </div>
    {/each}
  </div>
{/if}
