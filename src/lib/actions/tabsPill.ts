/**
 * use:tabsPill — drive a sliding `.t-tabs-pill` indicator under the active tab
 * (transitions.css "Tabs sliding"). Compliant with JST motion discipline: the
 * pill moves via transform translateX()+scaleX() only — no width/left tween, no
 * layout reflow.
 *
 * Put the action on the tablist container. The container must hold:
 *   - tab buttons matching `tabSelector` (default `[data-tab]`), in DOM order
 *   - one absolutely-positioned pill element matching `pillSelector`
 *     (default `.t-tabs-pill`) as a sibling of the tabs (same offset parent)
 *
 * Pass the active tab index; the pill re-measures and slides whenever it
 * changes (or on resize). Example:
 *
 *   <div class="relative inline-flex" use:tabsPill={active}>
 *     <span class="t-tabs-pill bg-primary/15 rounded-full"></span>
 *     {#each tabs as t, i}
 *       <button data-tab role="tab" aria-selected={active === i}
 *               onclick={() => active = i}>{t.label}</button>
 *     {/each}
 *   </div>
 *
 * The pill carries its own COLOR via a bg-* token in the markup; this action
 * owns only geometry. Position slides via an animated translateX; the pill's
 * width is set instantly (NOT transitioned) so corners stay crisp and there is
 * no reflow — honoring the JST "no layout-property animation" rule.
 */

export interface TabsPillOptions {
  active: number
  tabSelector?: string
  pillSelector?: string
}

type Arg = number | TabsPillOptions

function normalize(arg: Arg): Required<TabsPillOptions> {
  const o = typeof arg === "number" ? { active: arg } : arg
  return {
    active: o.active ?? 0,
    tabSelector: o.tabSelector ?? "[data-tab]",
    pillSelector: o.pillSelector ?? ".t-tabs-pill",
  }
}

export function tabsPill(node: HTMLElement, arg: Arg) {
  let opts = normalize(arg)

  function position(animate: boolean) {
    const pill = node.querySelector<HTMLElement>(opts.pillSelector)
    const tabs = Array.from(
      node.querySelectorAll<HTMLElement>(opts.tabSelector),
    )
    const tab = tabs[opts.active]
    if (!pill || !tab) return

    // Geometry relative to the pill's offset parent (the container).
    const parentLeft = node.getBoundingClientRect().left
    const r = tab.getBoundingClientRect()
    const x = r.left - parentLeft
    const w = r.width

    if (!animate) pill.style.transition = "none"
    // Width snaps instantly (no transition → no layout animation); only the
    // translateX position is animated by the .t-tabs-pill transition.
    pill.style.width = `${w}px`
    pill.style.transform = `translateX(${x}px)`
    if (!animate) {
      // Re-enable the transition next frame so subsequent moves animate.
      requestAnimationFrame(() => {
        pill.style.transition = ""
      })
    }
  }

  // First placement is instant (no slide from 0); later changes animate.
  requestAnimationFrame(() => position(false))

  const onResize = () => position(false)
  window.addEventListener("resize", onResize)

  return {
    update(next: Arg) {
      const prev = opts.active
      opts = normalize(next)
      position(opts.active !== prev)
    },
    destroy() {
      window.removeEventListener("resize", onResize)
    },
  }
}
