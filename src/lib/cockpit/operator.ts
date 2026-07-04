/**
 * Operator-session helpers — pure, storage-injected so they unit-test in node.
 *
 * OperatorGate.svelte wraps these against the browser `sessionStorage` and
 * re-exports `isOperatorChosen()` / `setOperator()` as the layout-facing API.
 */

export type OperatorRole = "operator" | "guest"
export const OPERATOR_KEY = "todayos-operator"

type ReadableStorage = Pick<Storage, "getItem">
type WritableStorage = Pick<Storage, "setItem">

/** The role recorded in the given storage, or null if the gate hasn't been passed. */
export function readOperatorChoice(storage: ReadableStorage | undefined | null): OperatorRole | null {
  try {
    const v = storage?.getItem(OPERATOR_KEY)
    return v === "operator" || v === "guest" ? v : null
  } catch {
    return null
  }
}

/** Record a role in the given storage; swallows storage errors (private mode). */
export function writeOperatorChoice(storage: WritableStorage | undefined | null, role: OperatorRole): void {
  try {
    storage?.setItem(OPERATOR_KEY, role)
  } catch {
    /* ignore — the gate simply re-prompts next load */
  }
}
