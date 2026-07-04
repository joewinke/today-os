<script lang="ts">
  // The cockpit shell (Sidebar + OperatorGate) now lives in the ROOT layout so it
  // persists across /os, /admin, and /studio as one app. This layout is just a
  // pass-through for the /os/* content.
  let { children } = $props()
</script>

{@render children()}
