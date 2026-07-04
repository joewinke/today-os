<script lang="ts">
  import GhostPanel from "$lib/ghostpanels/GhostPanel.svelte"
</script>

<GhostPanel
  eyebrow="OPERATIONS · ASK"
  title="Ask the OS"
  intent="A conversational layer over the same ledger RUN and PROVE read from — ask a plain question, get an answer that cites the actual recommendation or spend line it came from."
  seam="Conversational layer ships with the substrate — the ledger it would query already runs in RUN and PROVE."
>
  <div class="hud border-line flex items-center justify-between border-b px-5 py-2.5 sm:px-6">
    <span>SESSION</span>
    <span class="text-base-content/35">MOCK EXCHANGE</span>
  </div>
  <div class="divide-line divide-y">
    <div class="flex justify-end px-5 py-4 sm:px-6">
      <p class="bg-base-200 max-w-md rounded-none px-4 py-2.5 text-sm">
        Which accounts wasted the most this week?
      </p>
    </div>
    <div class="flex justify-start px-5 py-4 sm:px-6">
      <p class="border-line max-w-md border px-4 py-2.5 text-sm leading-relaxed">
        Vantage Roofing carried the most waste — $6,180/mo held at the autonomy gate for manual review,
        over its CPA cap. Harbor Point Dental is next, $1,240/mo across two low-confidence ad sets.
      </p>
    </div>
    <div class="px-5 py-4 sm:px-6">
      <label for="ask-input" class="sr-only">Ask a question about your accounts</label>
      <input
        id="ask-input"
        type="text"
        disabled
        placeholder="Ask a question about your accounts…"
        class="input input-bordered w-full rounded-none font-mono text-sm disabled:opacity-50"
      />
    </div>
  </div>
</GhostPanel>
