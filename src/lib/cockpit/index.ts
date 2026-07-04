/**
 * Cockpit chrome — the Today OS operator app-shell.
 *
 * Mount seam (for the layout that consumes this): gate render behind
 * `isOperatorChosen()`, then wrap the page in `<Sidebar>` passing `NAV_GROUPS`
 * and the current pathname, with `<ClientSwitcher>` in the footer snippet.
 */

export { default as Sidebar } from "./Sidebar.svelte"
export { default as OperatorGate, isOperatorChosen, setOperator } from "./OperatorGate.svelte"
export { default as ClientSwitcher, type ClientOption } from "./ClientSwitcher.svelte"

export { NAV_GROUPS, allNavItems, activeHref, isNavItemActive, type NavGroup, type NavItem, type IconKey } from "./nav"

export { OPERATOR_KEY, readOperatorChoice, writeOperatorChoice, type OperatorRole } from "./operator"
