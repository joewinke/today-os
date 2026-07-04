<!--
  OperatorGate — the login MOMENT, not real auth.

  A full-screen blueprint card that asks the visitor to step into the operator's
  seat. Both choices behave identically (this is a demo substrate); the honest seam
  line says so. Choosing records a flag in sessionStorage (`todayos-operator`) and
  calls `onenter` so the layout can drop the gate and render the cockpit.

  Real auth ships with the substrate — see /readme.
-->
<script module lang="ts">
  import { OPERATOR_KEY, readOperatorChoice, writeOperatorChoice, type OperatorRole } from "./operator"

  export { OPERATOR_KEY, type OperatorRole }

  const browserSession = (): Storage | null => (typeof sessionStorage === "undefined" ? null : sessionStorage)

  /** Whether the visitor has already stepped through the gate this session. */
  export function isOperatorChosen(): boolean {
    return readOperatorChoice(browserSession()) !== null
  }

  /** Record the chosen role for the session. */
  export function setOperator(role: OperatorRole): void {
    writeOperatorChoice(browserSession(), role)
  }
</script>

<script lang="ts">
  let { onenter }: { onenter?: (role: OperatorRole) => void } = $props()

  function choose(role: OperatorRole): void {
    setOperator(role)
    // NOTE: the os activity store (see $lib/os/store) is server-only and exposes
    // no client writer, so there is no store event to emit here — we intentionally
    // do NOT modify the store from the client. If a writer is added, log a "system"
    // activity ("operator session opened") at the seam.
    onenter?.(role)
  }
</script>

<div class="blueprint bg-base-100 fixed inset-0 z-50 grid place-items-center p-6">
  <div class="border-line bg-base-200/40 w-full max-w-sm border p-8">
    <p class="hud text-muted mb-1">Today OS · Operator Access</p>
    <h1 class="statement mb-6 text-3xl">Step into<br />the seat</h1>

    <div class="flex flex-col gap-2">
      <button
        type="button"
        onclick={() => choose("operator")}
        class="btn btn-primary hud w-full justify-center rounded-none"
      >
        Continue as Matt — Operator
      </button>
      <button
        type="button"
        onclick={() => choose("guest")}
        class="hud border-line text-base-content/70 hover:text-base-content hover:border-base-content/40 w-full border py-2.5 text-center transition-colors"
      >
        Guest — read-only
      </button>
    </div>

    <p class="hud text-muted/70 mt-6 leading-relaxed">
      Demo session — real auth ships with the substrate
      <a href="/readme" class="text-base-content/70 hover:text-primary underline underline-offset-2">(see /readme)</a>.
    </p>
  </div>
</div>
