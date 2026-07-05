# Today OS

**The operating system for a performance-marketing firm** — find advertisers, pitch them with personalized video, close them, run their accounts behind human gates, and prove the result on a ledger. Build Challenge submission — Joseph Winke, for It's Today Media.

> Type in any website — Today OS scans the funnel live and scores it in two seconds, then maps that market into a prospect queue. One shoot becomes a personalized pitch video for every prospect, each with their own landing page carrying their own score. Close a deal on the pipeline board and that client's ad accounts light up in the console — where agents audit spend on a cadence, propose fixes with evidence and dollar impact, and a spend-cap gate refuses anything unsafe until a human approves. Every approval ticks the recovered waste onto a ledger, and each client gets a monthly report. **Agents propose. Humans approve.**

- **Live:** https://todayos.marduk.app — enter as the operator; the app runs in **sandbox mode** (the real product on safe data, connect an account to go live).
- **The cockpit** (`/os`) — the operating home screen: pipeline, accounts under management, waste recovered, pitches, meetings, and a live activity feed, behind a three-state sidebar. The lifecycle is the navigation: **FIND · PITCH · CLOSE · RUN · PROVE.**
- **FIND** (`/funnel-score`) — scan any URL for a scored conversion teardown, live, and map that market into a prospect queue.
- **PITCH** (`/os/outreach`, `/studio`) — one shoot, personalized into a pitch video per prospect; each gets their own landing page with their own score.
- **CLOSE** (`/os/pipeline`) — work the board; closing a deal spawns that client's ad accounts into RUN, themed to them.
- **RUN** (`/admin`) — an agentic ad-ops loop: cadence audits, deterministic red-flag rules **you can edit in the browser**, LLM recommendations, a human approval inbox, and an autonomy ladder with fail-closed spend caps.
- **PROVE** (`/os/prove`) — approved changes tick the recovered-waste ledger; each client gets a monthly report.
- **Light or dark** — the whole instrument reskins from a single toggle in the header.

---

## What does this tool do?

**Today OS runs a performance-marketing firm end to end — find advertisers, pitch them, close them, run their accounts, prove the result.** The lifecycle is the product: **FIND → PITCH → CLOSE → RUN → PROVE.** It is not a set of features bolted together; it is one loop, and the through-line is a single click: close a prospect and their accounts appear in the console you'd operate them from.

- **FIND** — type any website; it scans the funnel live and scores it in ~2 seconds, then maps the rest of that market into a prospect queue.
- **PITCH** — one shoot becomes a personalized pitch video for every prospect, each with their own landing page carrying their own score.
- **CLOSE** — work the pipeline board; closing a deal spawns that client's ad accounts into the console, themed to them.
- **RUN** — agents audit spend on a cadence, propose fixes with evidence and dollar impact, and a spend-cap gate refuses anything unsafe until a human approves.
- **PROVE** — every approval ticks recovered waste onto the ledger; each client gets a monthly report.

The deepest engineering is RUN — the agentic ad-ops loop — because that's the boring, compounding problem: **account hygiene doesn't scale with account count.** Every platform (Google, Meta, Taboola, TikTok) is its own dashboard, API maturity, and tribal knowledge, so the compounding work (zero-conversion spend, budget-limited campaigns, disapproved ads, creative fatigue, missing negatives) gets done sporadically, by whoever has time. That loop:

1. **One canonical spec.** Every ad account normalizes into a single `AdSpec` shape — campaigns → ad groups → ads/keywords + metric rows, money in integer cents, serialized as diffable YAML and queryable JSON. Google, Meta, Taboola, and TikTok all become the *same* shape, so the audit brain is written once. This is the single-source-of-truth idea: business data in one agent-accessible place, not spidered across services.
2. **Agents audit on a cadence.** Each account has a cadence and a next-run time; a scheduler drains due accounts, snapshots them, and reviews the snapshot two ways:
   - **Deterministic RED FLAGS** — machine-checkable rules authored in plain markdown. **A marketer edits the playbook and the engine obeys — live, in the browser:** edit a threshold in `/admin/doctrine`, run a sweep, and a finding appears or disappears citing the rule you just changed. No LLM in the loop for these, so they are *guaranteed* findings with real evidence numbers in the rationale.
   - **LLM judgment calls** — the same doctrine files ground a model pass for the things rules can't express: structure, bid-strategy maturity, budget reallocation.
3. **Humans stay in charge.** Every finding lands in an approval inbox as a proposed change with rationale and risk. Autonomy is earned per-account (`propose → approve → auto`), and `auto` **fails closed** — no spend cap, no autonomy, no apply. Every decision is audit-logged.

The other surfaces demonstrate the adjacent bottlenecks: `/studio` treats creative production as data — a plain-text edit-decision list agents can operate on, with auto-effects, **real AI b-roll generation per segment via Seedance 2.0**, and per-lead personalization from one shoot — and `/funnel-score` runs a real heuristic conversion teardown of any URL, live, with no account or email gate.

## Why did you build THIS one?

Because the contest asks for the tool that matters most to a media-buying team, and this is it. The glamorous answer is creative generation — but an account that silently burns 20% of its spend on a zero-conversion campaign pays for a lot of creative. The compounding money is in the boring, unglamorous hygiene work that never scales with headcount, and that is exactly where an agentic loop earns its keep.

The design choice I care most about is **doctrine-as-markdown**: the difference between "an AI tool" and "a tool a marketing team trusts" is that the team can read and edit the rules it runs on, and every action routes through an approval surface with the evidence attached. That is why the demo lets you edit the playbook and re-run the audit — the trust model isn't described, it's operable.

And the scope is deliberate. Your own roadmap names a video-creative generator, ad-platform automation, and a landing-page generator; all three are represented here, working, on your own brand. Rather than mock three separate tools, I built the system they belong to — the operating layer that makes them one product instead of three point solutions. That is the judgment the brief is really testing: not "can this person build a feature," but "can this person walk into a business, find the highest-leverage problem, and build the thing that compounds."

## What would you build next if this were your full-time job?

**Today OS is the beginning of It's Today Media's move onto the AI frontier — not a tool the team logs into occasionally, but the layer the whole business runs on.** What ships here is the operating system's *experience*: the entire find → pitch → close → run → prove loop, made real and coherent, running in sandbox mode with honest seams. The next phase gives it its organs — a database, auth, real platform connectors, and real sends — and turns the sandbox into the live system that runs the accounts. In order:

1. **The apply path.** Sandbox proposes; production applies. API-first mutations for approved recommendations (Google Ads API, Meta Marketing API), each behind the same approval gate and spend caps, with dry-run diffs and one-click rollback. Where API access is slow to grant, **browser agents** log into the platform UI and execute the approved change, so an account can be audited and acted on from day one — then upgraded to the API path once tokens clear.
2. **The SSOT business database.** Fold offers, landing pages, creatives, spend, and revenue (network postbacks) into one schema so recommendations optimize for *margin per vertical*, not platform-local metrics. This is the difference between "pause the worst ad group" and "move budget to where EPC is actually earned."
3. **An MCP server over all of it.** Every table and every action (propose, approve, apply, generate) exposed as MCP tools, so the team's AI assistants operate the whole system conversationally — and so agents compose into workflows without custom glue.
4. **Close the creative loop.** Wire the studio to a render pipeline (HTML/GSAP compositions rendered to MP4, plus multicam EDL renders via ffmpeg) so "record once, personalize per lead" goes from demo to deliverable — creative-fatigue findings in the ad-ops inbox automatically mint new variant briefs in the studio.
5. **Landing-page factory.** The transformation that produced this site, productized: scrape a target page, extract a design and content spec, generate and deploy variants, and feed results back into the funnel scorer — a prospect URL to a deployed preview in minutes.

Each of these is a phase, not a wish — the demo is built so every one of them slots into a seam that already exists.

## Repo tour

```
src/lib/adops/        the engine: AdSpec (zod), red-flag evaluator, editable-doctrine resolver, LLM lane, store, fixtures, doctrine/*.md, tests
src/routes/admin/     the RUN command center: overview, approval inbox, account detail, editable doctrine, audit log
src/lib/cockpit/      the operator shell: three-state sidebar, operator gate, client switcher, nav config
src/lib/os/           the in-memory operating store: prospects, activity feed, ledger, session state
src/routes/os/        the cockpit: dashboard, pipeline (CLOSE), outreach (PITCH), prove (PROVE), and planned-surface panels
src/lib/studio/       EDL model (edit-as-data) + fixtures, tests
src/routes/studio/    the editor + b-roll generation + batch personalization
src/lib/server/seedance.ts   Seedance 2.0 client (video generation lane)
src/routes/funnel-score/     live URL teardown tool (deterministic checks, no LLM required)
src/routes/+page.svelte      the Today OS landing page (Three.js gemstone funnel, instrument HUD)
```

Stack: SvelteKit 2 · Svelte 5 (runes) · Tailwind 4 · DaisyUI 5 · Three.js · zod · vitest. **No database** — the app seeds an in-memory sandbox so every interaction runs the real engine against realistic data; state is per-session and resets cleanly, exactly as a sandbox should. Two optional env keys upgrade sandbox lanes to live ones, and everything degrades gracefully without them: `ANTHROPIC_API_KEY` switches the recommendation and auto-effects lanes from precomputed fallbacks to live model calls; `SEEDANCE_API_KEY` switches studio b-roll from bundled samples to live video generation.

```bash
npm install
npm run dev        # http://localhost:5199
npm test           # engine tests
npm run build      # production build (adapter-node)
```

Theming is token-only — one light theme, one dark, zero hex literals in components; the whole instrument reskins from `app.css` and toggles from the header.
