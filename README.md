# Today OS

**The operating system for a performance-marketing firm** — find advertisers, pitch them with personalized video, operate their accounts behind human gates. Build Challenge submission — Joseph Winke.

> It runs your actual business end to end. Type in any website — it scans it live and scores the funnel in two seconds. It maps the competitors in that market into a prospect queue, then personalizes a pitch video for every one of them from one shoot — real AI video, each prospect getting their own landing page with their own score on it. Close a deal on the pipeline board and that client's ad accounts light up in the console — where agents audit spend on a cadence, propose fixes with evidence and dollar impact, and a spend-cap gate refuses anything unsafe until a human approves. Every approval ticks the recovered waste onto your ledger.

- **Live demo:** https://itstoday.marduk.app
- **The dashboard** (`/os`) — the operating home screen: pipeline, accounts under management, waste recovered, pitches, meetings — plus a live activity feed. The lifecycle is the nav: **FIND · PITCH · CLOSE · RUN · PROVE.**
- **FIND** (`/funnel-score`) — scan any URL, get a scored conversion teardown live, and map that market into a prospect queue.
- **PITCH** (`/os/outreach`, `/studio`) — one shoot, personalized into a pitch video per prospect; each gets their own landing page with their own score.
- **CLOSE** (`/os/pipeline`) — work the board; closing a deal spawns that client's ad accounts into RUN.
- **RUN** (`/admin`) — an agentic ad-ops loop: cadence audits, deterministic red-flag rules + LLM recommendations, a human approval inbox, and an autonomy ladder with fail-closed spend caps.
- **PROVE** (`/os/prove`) — approved changes tick the recovered-waste ledger; each client gets a monthly report.
- **The front door** (`/`) — itstoday.org rebuilt; type your domain into the hero and watch the OS build the demo around you. This page is itself the landing-page-generation capability.

---

## What does this tool do?

Today OS attacks the highest-leverage boring problem in media buying: **account hygiene doesn't scale with account count.** Every platform — Google, Meta, Taboola, TikTok — is its own dashboard, its own API maturity, its own tribal knowledge. The compounding work (catching zero-conversion spend, budget-limited campaigns, disapproved ads, creative fatigue, missing negatives) gets done sporadically, by whoever has time.

The core loop:

1. **One canonical spec.** Every ad account normalizes into a single `AdSpec` shape — campaigns → ad groups → ads/keywords + metric rows, money in integer cents, serialized as diffable YAML and queryable JSON. Google, Meta, Taboola, and TikTok all become the *same* shape, so the audit brain is written once. This is the single-source-of-truth idea: business data in one agent-accessible place, not spidered across services.
2. **Agents audit on a cadence.** Each account has a cadence and a next-run time; a scheduler drains due accounts, snapshots them, and reviews the snapshot two ways:
   - **Deterministic RED FLAGS** — machine-checkable rules authored in plain markdown. A marketer edits the playbook; the engine obeys it. No LLM in the loop for these, so they are *guaranteed* findings with real evidence numbers in the rationale.
   - **LLM judgment calls** — the same doctrine files ground a model pass for the things rules can't express: structure, bid-strategy maturity, budget reallocation.
3. **Humans stay in charge.** Every finding lands in an approval inbox as a proposed change with rationale and risk. Autonomy is earned per-account (`propose → approve → auto`), and `auto` **fails closed** — no spend cap, no autonomy. Every decision is audit-logged.

The other two surfaces demonstrate the adjacent bottlenecks: `/studio` shows creative production as data (a plain-text edit-decision list agents can operate on — auto-effects, **real AI b-roll generation per segment via Seedance 2.0**, per-lead personalization from one shoot), and `/` + `/funnel-score` show the landing-page layer (this site *is* the generated artifact — including its video: the ambient loops on the front page were minted by the tool's own generation lane — and the funnel scorer runs real heuristic teardowns of any URL, live).

## Why did you build THIS one?

Because I've already built it for real. My production version of this system — a business operating system with all company data in one SSOT database, where a cron wakes an agent every day to log into PPC accounts, run an assay, update the internal DB, and propose ad changes and new creative — runs for private clients and is under NDA. Matt suggested the honest workaround: rebuild a lighter version openly and show the thinking. That's this repo.

I picked ad-ops as the centerpiece because it's where AI actually compounds for a media-buying team. Creative generation is glamorous, but an account that silently burns 20% of spend on a zero-conversion campaign pays for a lot of creative. The doctrine-as-markdown design is the part I care most about: the difference between "an AI tool" and "a tool a marketing team trusts" is that the team can read and edit the rules it runs on, and every action routes through an approval surface with evidence attached.

And because the contest brief said *build what matters to a media buying team* — your own roadmap lists a video creative generator, ad-platform automation, and a landing-page generator. All three are represented here, on your own brand, live.

## What would you build next if this were your full-time job?

**The substrate.** This demo is the operating system's *experience* — the whole find → pitch → close → run → prove loop, made real and coherent, running in-memory with honest seams. What it doesn't have yet are its organs: a database, auth, real platform connectors, and real sends. The win pays for those. In order:

1. **The apply path.** This demo proposes; production applies. API-first mutations for approved recommendations (Google Ads API, Meta Marketing API), each behind the same approval gate and spend caps, with dry-run diffs and one-click rollback. Where APIs are slow to grant access, **browser agents** log into the platform UI and execute the approved change — the same fallback I use in production to audit accounts on day one with nothing but an email and password, then upgrade to the API path when tokens clear.
2. **The SSOT business database.** Fold offers, landing pages, creatives, spend, and revenue (network postbacks) into one schema so recommendations optimize for *margin per vertical*, not platform-local metrics. This is the difference between "pause the worst ad group" and "move budget to where EPC is actually earned."
3. **An MCP server over all of it.** Every table and every action (propose, approve, apply, generate) exposed as MCP tools, so the team's AI assistants operate the whole system conversationally — and so agents can be composed into workflows without custom glue.
4. **Close the creative loop.** Wire the studio to a render farm (my production pipeline: HTML/GSAP compositions rendered to MP4, plus multicam EDL renders via ffmpeg) so "record once, personalize per lead" goes from demo to deliverable — creative fatigue findings in the ad-ops inbox automatically mint new variant briefs in the studio.
5. **Landing-page factory.** The transformation that produced this site's front page, productized: scrape a target page, extract a design/content spec, generate and deploy variants, feed results back into the funnel scorer. I run a version of this pattern today that takes a prospect URL to a deployed preview app in under 15 minutes.

## Repo tour

```
src/lib/adops/        the engine: AdSpec (zod), red-flag evaluator, LLM lane, store, fixtures, doctrine/*.md, tests
src/routes/admin/     the command center: overview, approval inbox, account detail, doctrine, audit log
src/lib/studio/       EDL model (edit-as-data) + fixtures, tests
src/routes/studio/    the editor demo + b-roll generation + batch personalization
src/lib/server/seedance.ts   Seedance 2.0 client (video generation lane)
src/routes/api/seedance/     generate + poll endpoints (10s poll discipline, graceful no-key fallback)
src/routes/funnel-score/  live URL teardown tool (deterministic checks, no LLM required)
src/routes/+page.svelte   the transformed front page (Three.js centerpiece, instrument HUD, generated ambient video)
```

Stack: SvelteKit 2 · Svelte 5 (runes) · Tailwind 4 · DaisyUI 5 · Three.js · zod · vitest. No database — the demo seeds an in-memory store so every judge interaction runs the real engine against realistic fixtures. Two optional env keys upgrade demo lanes to live ones, and everything degrades gracefully without them: `ANTHROPIC_API_KEY` switches the recommendation/auto-effects lanes from precomputed fallbacks to live model calls; `SEEDANCE_API_KEY` switches studio b-roll from bundled samples to live video generation.

```bash
npm install
npm run dev        # http://localhost:5199
npm test           # engine tests
npm run build      # production build (adapter-node)
```

Theming is token-only (one DaisyUI theme, zero hex literals in components) — the whole app reskins from one block in `app.css`.
