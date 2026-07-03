<script lang="ts">
  import { enhance } from "$app/forms"
  import { fmtUsd } from "$lib/adops/types"
  import { PROVIDER_LABELS } from "$lib/adops/doctrine"
  import { relativePast, relativeFuture, AUTONOMY_LABELS } from "$lib/adops/ui"
  import { reveal } from "$lib/actions/reveal"
  import type { ActionData, PageServerData } from "./$types"

  let { data, form }: { data: PageServerData; form: ActionData } = $props()

  let sweeping = $state(false)
  let auditing = $state<string | null>(null)

  const stats = $derived(data.stats)

  function isDue(nextRunAt: string | null): boolean {
    return nextRunAt != null && new Date(nextRunAt).getTime() <= Date.now()
  }
</script>

<div class="flex flex-wrap items-end justify-between gap-4">
  <div>
    <p class="hud mb-2">COMMAND CENTER</p>
    <h1 class="statement text-4xl sm:text-5xl">Ad Ops</h1>
  </div>
  <form
    method="POST"
    action="?/runSweep"
    use:enhance={() => {
      sweeping = true
      return async ({ update }) => {
        sweeping = false
        await update()
      }
    }}
  >
    <button type="submit" class="btn btn-primary btn-sm font-mono uppercase tracking-wider" disabled={sweeping}>
      {#if sweeping}<span class="loading loading-spinner loading-xs"></span>{/if}
      Run sweep
    </button>
  </form>
</div>

{#if form && "action" in form && form.action === "sweep"}
  <p class="hud mt-3 text-success" role="status">
    SWEEP COMPLETE — {form.drained} ACCOUNT(S) DRAINED, {form.recommendations} RECOMMENDATIONS PROPOSED
  </p>
{:else if form && "error" in form && form.error}
  <p class="hud mt-3 text-error" role="alert">{form.error}</p>
{/if}

<!-- Stat row -->
<div
  class="mt-8 grid grid-cols-2 gap-px border lg:grid-cols-4"
  style="border-color: var(--color-line); background: var(--color-line)"
>
  {#each [{ label: "ACCOUNTS CONNECTED", value: String(stats.accounts) }, { label: "RECS PROPOSED", value: String(stats.proposed) }, { label: "EST. MONTHLY WASTE DETECTED", value: stats.wasteCentsMonthly > 0 ? fmtUsd(stats.wasteCentsMonthly) : "—" }, { label: "LAST SWEEP", value: stats.lastSweepAt ? relativePast(stats.lastSweepAt) : "never" }] as stat, i (stat.label)}
    <div class="bg-base-100 p-4 sm:p-5" use:reveal={{ animation: "fade-in", delay: i * 0.06 }}>
      <p class="hud">{stat.label}</p>
      <p class="mt-2 font-mono text-2xl sm:text-3xl">{stat.value}</p>
    </div>
  {/each}
</div>

<!-- Accounts grid -->
<p class="hud mt-10 mb-3" id="accounts">ACCOUNTS · {stats.accountsDue} DUE</p>
<div class="grid gap-px border sm:grid-cols-2" style="border-color: var(--color-line); background: var(--color-line)">
  {#each data.accounts as account, i (account.id)}
    <div class="bg-base-100 p-5" use:reveal={{ animation: "fade-in", delay: i * 0.05 }}>
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <p class="hud">{PROVIDER_LABELS[account.provider]}</p>
          <h2 class="mt-1 truncate text-lg font-semibold">
            <a href="/admin/accounts/{account.id}" class="hover:text-primary transition-colors">{account.name}</a>
          </h2>
          <p class="hud mt-0.5 normal-case tracking-normal" style="text-transform: none">{account.external_id}</p>
        </div>
        <span class="badge badge-outline badge-sm shrink-0 font-mono {account.autonomy === 'auto' ? 'badge-warning' : ''}">
          {AUTONOMY_LABELS[account.autonomy]}
        </span>
      </div>

      <dl class="mt-4 grid grid-cols-2 gap-x-6 gap-y-1.5">
        <div class="flex items-baseline justify-between gap-2">
          <dt class="hud">CADENCE</dt>
          <dd class="font-mono text-xs">{account.cadence_hours}h</dd>
        </div>
        <div class="flex items-baseline justify-between gap-2">
          <dt class="hud">SPEND CAP</dt>
          <dd class="font-mono text-xs {account.spend_cap_cents == null && account.autonomy === 'auto' ? 'text-error' : ''}">
            {account.spend_cap_cents != null ? fmtUsd(account.spend_cap_cents) : "none"}
          </dd>
        </div>
        <div class="flex items-baseline justify-between gap-2">
          <dt class="hud">LAST RUN</dt>
          <dd class="font-mono text-xs">{relativePast(account.last_run_at)}</dd>
        </div>
        <div class="flex items-baseline justify-between gap-2">
          <dt class="hud">NEXT RUN</dt>
          <dd class="font-mono text-xs {isDue(account.next_run_at) ? 'text-warning' : ''}">
            {relativeFuture(account.next_run_at)}
          </dd>
        </div>
      </dl>

      <div class="mt-4 flex items-center gap-3 border-t pt-4" style="border-color: var(--color-line)">
        <form
          method="POST"
          action="?/runAudit"
          use:enhance={() => {
            auditing = account.id
            return async ({ update }) => {
              auditing = null
              await update()
            }
          }}
        >
          <input type="hidden" name="accountId" value={account.id} />
          <button
            type="submit"
            class="btn btn-outline btn-xs font-mono uppercase tracking-wider"
            disabled={auditing !== null}
          >
            {#if auditing === account.id}<span class="loading loading-spinner loading-xs"></span>{/if}
            Run audit now
          </button>
        </form>

        {#if form && "action" in form && form.action === "audit" && form.accountId === account.id}
          <span class="hud text-success" role="status">
            {form.redFlags} RED FLAGS + {form.llm} LLM ({form.via}) &rarr; {form.recommendations} PROPOSED
          </span>
        {:else if account.proposed > 0}
          <a href="/admin/inbox#{account.id}" class="hud text-warning hover:text-base-content transition-colors">
            {account.proposed} IN INBOX &rarr;
          </a>
        {:else}
          <span class="hud">NO OPEN RECS</span>
        {/if}
      </div>
    </div>
  {/each}
</div>

<p class="hud mt-6" style="text-transform: none; letter-spacing: 0.02em">
  Run sweep = one simulated cron tick: every account whose next_run_at has passed is audited
  (snapshot &rarr; deterministic red flags &rarr; LLM lane &rarr; approval inbox), then rescheduled by its cadence.
</p>
