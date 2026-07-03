/**
 * use:shake — replay the `t-input-shake` error shake (transitions.css) whenever
 * a reactive trigger value changes.
 *
 * The CSS animation only plays once per class application, so to replay it on a
 * second failed submit we remove the class, force a synchronous reflow, then
 * re-add it. This action encapsulates that reflow-restart dance.
 *
 * Usage — pass a value that CHANGES each time you want a shake (a counter you
 * bump on every validation failure, or a boolean you flip):
 *
 *   <script>
 *     import { shake } from "$lib/actions/shake"
 *     let errorTick = $state(0)
 *     function onInvalid() { errorTick++ }   // bump to trigger a shake
 *   </script>
 *   <input use:shake={errorTick} class:input-error={hasError} />
 *
 * The element keeps its own error COLOR (e.g. `input-error` / `border-error`);
 * this action only owns the motion. Respects prefers-reduced-motion (the CSS
 * guard zeroes the animation, and we skip the restart entirely).
 */

const SHAKE_CLASS = "t-input-shake"

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  )
}

export function shake(node: HTMLElement, trigger?: unknown) {
  let last = trigger
  // Clean up the class after the animation so the element isn't left mid-state.
  const onEnd = () => node.classList.remove(SHAKE_CLASS)
  node.addEventListener("animationend", onEnd)

  function play() {
    if (prefersReducedMotion()) return
    node.classList.remove(SHAKE_CLASS)
    // Force reflow so removing + re-adding the class restarts the animation.
    void node.offsetWidth
    node.classList.add(SHAKE_CLASS)
  }

  return {
    update(next: unknown) {
      // Only replay when the trigger actually changes (skip the initial mount,
      // and skip no-op updates from unrelated reactivity).
      if (next !== last) {
        last = next
        play()
      }
    },
    destroy() {
      node.removeEventListener("animationend", onEnd)
    },
  }
}
