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
  const theme = $derived(data.theme)

  function scannedClock(ms: number | null): string {
    if (!ms) return ""
    const d = new Date(ms)
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
  }

  function isDue(nextRunAt: string | null): boolean {
    return nextRunAt != null && new Date(nextRunAt).getTime() <= Date.now()
  }

  // Narrate the sweep while the server works (~30-60s on the live LLM lane).
  // These are the real stages of the loop — same five the homepage teaches.
  const SWEEP_STAGES = [
    "Connecting to the due accounts",
    "Snapshotting each into one canonical spec",
    "Running the deterministic red-flag checks",
    "Asking the model for the judgment calls",
    "Writing findings to the approval inbox",
  ]
  let sweepStage = $state(-1)
  let sweepTimer: ReturnType<typeof setInterval> | null = null

  function startSweep() {
    sweeping = true
    sweepStage = 0
    if (sweepTimer) clearInterval(sweepTimer)
    // advance through the stages, but hold on the last until the server returns
    sweepTimer = setInterval(() => {
      if (sweepStage < SWEEP_STAGES.length - 1) sweepStage += 1
    }, 1700)
  }
  function endSweep() {
    sweeping = false
    sweepStage = -1
    if (sweepTimer) {
      clearInterval(sweepTimer)
      sweepTimer = null
    }
  }
  $effect(() => () => {
    if (sweepTimer) clearInterval(sweepTimer)
  })
</script>

<div class="flex flex-wrap items-end justify-between gap-3">
  <div>
    <p class="hud mb-2">COMMAND CENTER</p>
    <h1 class="statement text-4xl sm:text-5xl">Ad Ops</h1>
  </div>
  {#if theme.source === "scanned" && theme.domain}
    <!-- provenance chip: make the scan-reactivity impossible to miss -->
    <p class="hud border-line text-primary flex items-center gap-2 border px-3 py-1.5">
      <span class="live-dot"></span>
      THEMED TO: {theme.domain.toUpperCase()}{scannedClock(theme.scannedAt) ? ` · SCANNED ${scannedClock(theme.scannedAt)}` : ""}
    </p>
  {/if}
</div>

<!-- ORIENTATION: what this is + the one path to follow (a reviewer lands here cold) -->
<div class="mt-8 grid gap-px border lg:grid-cols-[1fr_auto]" style="border-color: var(--color-line); background: var(--color-line)">
  <div class="bg-base-100 p-5 sm:p-6">
    <p class="hud text-primary mb-3">DEMO · HOW THIS WORKS</p>
    <p class="text-base-content/80 max-w-2xl text-sm leading-relaxed">
      <span class="text-base-content">Different layer from the funnel scan.</span> That graded a
      landing page &mdash; where traffic lands. This audits the <span class="text-base-content"
        >ad accounts buying the traffic</span
      > &mdash; Google, Meta, Taboola, TikTok &mdash; where the biggest budget leaks hide.
      {#if theme.source === "scanned"}
        These accounts are <span class="text-base-content">themed to {theme.domain} &mdash; {theme.business}</span>,
        so the campaigns match the site you scanned. <span class="text-base-content">Sample metrics, no real spend.</span>
      {:else}
        Four sample accounts here, seeded with realistic data and deliberate problems.
        <span class="text-base-content">No real spend.</span>
        <span class="text-base-content/60">(Showing the Home&nbsp;Improvement example &mdash; scan a site to tailor this to it.)</span>
      {/if}
      In production these are your live accounts, audited on a schedule. Drive the loop in three steps:
    </p>
    <ol class="mt-5 grid gap-4 sm:grid-cols-3">
      {#each [["01", "Run a sweep", stats.accountsDue > 0 ? `audits the ${stats.accountsDue} account${stats.accountsDue === 1 ? "" : "s"} that are due, all at once` : "all due accounts have been audited — open the inbox next"], ["02", "Open the inbox", "read each finding with its evidence and dollar impact"], ["03", "Approve one", "watch the spend-cap gate refuse an unsafe auto-apply"]] as [n, title, sub] (n)}
        <li class="flex flex-col gap-1">
          <span class="hud text-primary">{n}</span>
          <span class="font-mono text-sm font-semibold">{title}</span>
          <span class="text-base-content/55 text-xs leading-relaxed">{sub}</span>
        </li>
      {/each}
    </ol>
  </div>

  <!-- the one primary action -->
  <div class="bg-base-100 flex flex-col justify-center gap-3 p-5 sm:p-6 lg:min-w-72">
    {#if sweeping}
      <!-- live narration of the loop while the server audits -->
      <p class="hud text-primary" role="status">SWEEPING · AUDITING {stats.accountsDue} ACCOUNTS</p>
      <ol class="flex flex-col gap-1.5">
        {#each SWEEP_STAGES as stage, i (stage)}
          <li class="flex items-center gap-2 font-mono text-xs {i < sweepStage ? 'text-base-content/40' : i === sweepStage ? 'text-base-content' : 'text-base-content/25'}">
            <span class="w-3 shrink-0">
              {#if i < sweepStage}&check;{:else if i === sweepStage}<span class="loading loading-spinner loading-xs align-middle"></span>{:else}·{/if}
            </span>
            {stage}
          </li>
        {/each}
      </ol>
    {:else if stats.accountsDue > 0}
      <form method="POST" action="?/runSweep" use:enhance={() => {
        startSweep()
        return async ({ update }) => {
          await update()
          endSweep()
        }
      }}>
        <button type="submit" class="btn btn-primary btn-lg w-full rounded-none font-mono text-sm tracking-[0.08em] uppercase">
          Run a Sweep
        </button>
      </form>
      <p class="hud text-center">START HERE · {stats.accountsDue} ACCOUNT{stats.accountsDue === 1 ? "" : "S"} DUE</p>
    {:else}
      <!-- swept: the next step is the inbox -->
      <a href="/admin/inbox" class="btn btn-primary btn-lg w-full rounded-none font-mono text-sm tracking-[0.08em] uppercase">
        Review {stats.proposed} Finding{stats.proposed === 1 ? "" : "s"} &rarr;
      </a>
      <p class="hud text-center">STEP 01 DONE · NOW OPEN THE INBOX</p>
    {/if}
  </div>
</div>

{#if form && "action" in form && form.action === "sweep"}
  <!-- prominent result: what just happened + the one next step -->
  <div class="border-success/40 mt-4 flex flex-col gap-4 border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6" role="status" use:reveal={{ animation: "fade-in" }}>
    <div class="flex flex-col gap-1">
      <p class="hud text-success">✓ SWEEP COMPLETE</p>
      <p class="font-mono text-sm leading-relaxed">
        Audited <span class="text-base-content font-semibold">{form.drained}</span> account{form.drained === 1 ? "" : "s"} ·
        surfaced <span class="text-base-content font-semibold">{form.recommendations}</span> finding{form.recommendations === 1 ? "" : "s"},
        each with the evidence. Nothing has changed on any account &mdash; they&rsquo;re waiting for your call.
      </p>
    </div>
    <a href="/admin/inbox" class="btn btn-primary btn-md shrink-0 rounded-none font-mono text-xs tracking-wider uppercase">
      Review the Findings &rarr;
    </a>
  </div>
{:else if form && "error" in form && form.error}
  <p class="hud mt-3 text-error" role="alert">{form.error}</p>
{/if}

<!-- Stat row -->
<div
  class="mt-8 grid grid-cols-2 gap-px border lg:grid-cols-4"
  style="border-color: var(--color-line); background: var(--color-line)"
>
  {#each [{ label: "ACCOUNTS CONNECTED", value: String(stats.accounts), sub: "Google · Meta · Taboola · TikTok" }, { label: "RECS PROPOSED", value: String(stats.proposed), sub: "awaiting your approval" }, { label: "EST. MONTHLY WASTE", value: stats.wasteCentsMonthly > 0 ? fmtUsd(stats.wasteCentsMonthly) : "—", sub: `across the ${stats.accounts} ad accounts` }, { label: "LAST SWEEP", value: stats.lastSweepAt ? relativePast(stats.lastSweepAt) : "never", sub: "cron tick over due accounts" }] as stat, i (stat.label)}
    <div class="bg-base-100 p-4 sm:p-5" use:reveal={{ animation: "fade-in", delay: i * 0.06 }}>
      <p class="hud">{stat.label}</p>
      <p class="mt-2 font-mono text-2xl sm:text-3xl">{stat.value}</p>
      <p class="hud mt-1.5 text-base-content/40" style="letter-spacing: 0.02em">{stat.sub}</p>
    </div>
  {/each}
</div>

<!-- Accounts grid -->
<div class="mt-10 mb-3 flex flex-wrap items-baseline gap-x-3" id="accounts">
  <p class="hud">ACCOUNTS · {stats.accountsDue} DUE</p>
  <p class="hud text-base-content/40" style="text-transform: none; letter-spacing: 0.02em">
    — or audit one account at a time below
  </p>
</div>
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
            title="Audit only this account"
          >
            {#if auditing === account.id}<span class="loading loading-spinner loading-xs"></span>{/if}
            Audit this account
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

<p class="hud mt-8" style="text-transform: none; letter-spacing: 0.02em">
  A sweep is one simulated cron tick: every account whose schedule is due gets audited
  (snapshot &rarr; deterministic red flags &rarr; LLM lane &rarr; approval inbox), then rescheduled by its cadence.
  On a live deployment this runs unattended; here you trigger it so you can watch it work.
</p>
