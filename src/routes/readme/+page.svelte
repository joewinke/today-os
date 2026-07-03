<script lang="ts">
  /**
   * /readme — TOUR STOP 04 · THE THINKING.
   *
   * The judge's tour ends here. The source repo (github.com/joewinke/today-os)
   * is private, so the README — which answers the three contest questions — is
   * hosted on-site. README.md is imported raw at build time, so edits to it flow
   * straight through. Rendered with a tiny escape-then-render markdown pass
   * (repo-controlled content, escaped first regardless).
   */
  import "$lib/home/home.css"
  import TerminalNav from "$lib/home/TerminalNav.svelte"
  import HudChrome from "$lib/home/HudChrome.svelte"
  import readme from "$lib/../../README.md?raw"

  const GITHUB_URL = "https://github.com/joewinke/today-os"

  // ─── Tiny markdown renderer (repo-controlled README only) ──────────────────
  // Escape first, then render a minimal subset: headings, ordered + unordered
  // lists, fenced code, blockquotes, hr, bold/italic/inline-code/links, paras.
  function escapeHtml(s: string): string {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
  }

  function inline(s: string): string {
    return s
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer noopener">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/(^|[^\w])_([^_]+)_(?=[^\w]|$)/g, "$1<em>$2</em>")
  }

  function renderMarkdown(md: string): string {
    const lines = escapeHtml(md).split("\n")
    const out: string[] = []
    let list: "ul" | "ol" | null = null
    let nested = false
    let inQuote = false
    let inCode = false
    let paragraph: string[] = []

    // One level of nesting: an indented "- " under an ordered item becomes a
    // sub-list attached to that item's <li> (README's "audit two ways" pair).
    const closeNested = () => {
      if (nested) {
        out.push("</ul></li>")
        nested = false
      }
    }
    const closeList = () => {
      closeNested()
      if (list) {
        out.push(`</${list}>`)
        list = null
      }
    }
    const closeQuote = () => {
      if (inQuote) {
        out.push("</blockquote>")
        inQuote = false
      }
    }
    const flushParagraph = () => {
      if (paragraph.length) {
        out.push(`<p>${inline(paragraph.join(" "))}</p>`)
        paragraph = []
      }
    }

    for (const raw of lines) {
      // Fenced code — escaped "```" is unchanged (backticks aren't escaped).
      if (/^```/.test(raw.trim())) {
        if (inCode) {
          out.push("</code></pre>")
          inCode = false
        } else {
          flushParagraph()
          closeList()
          closeQuote()
          out.push("<pre><code>")
          inCode = true
        }
        continue
      }
      if (inCode) {
        out.push(raw)
        continue
      }

      const line = raw.trimEnd()

      if (/^---+$/.test(line.trim())) {
        flushParagraph()
        closeList()
        closeQuote()
        out.push("<hr>")
        continue
      }

      const heading = /^(#{1,4})\s+(.*)$/.exec(line)
      if (heading) {
        flushParagraph()
        closeList()
        closeQuote()
        // h1→h2 … the page's own <h1> stays unique.
        const level = Math.min(heading[1].length + 1, 5)
        out.push(`<h${level}>${inline(heading[2])}</h${level}>`)
        continue
      }

      // Escaped ">" blockquote is now "&gt;".
      if (/^&gt;\s?/.test(line)) {
        flushParagraph()
        closeList()
        if (!inQuote) {
          out.push("<blockquote>")
          inQuote = true
        }
        const content = line.replace(/^&gt;\s?/, "")
        if (content.trim()) out.push(`<p>${inline(content)}</p>`)
        continue
      }

      // Indented bullet → nested sub-list on the previous <li>.
      const subBullet = /^\s+[-*]\s+(.*)$/.exec(raw)
      if (subBullet && list && !inQuote) {
        flushParagraph()
        if (!nested) {
          const last = out.pop() ?? ""
          out.push(last.replace(/<\/li>$/, ""))
          out.push("<ul>")
          nested = true
        }
        out.push(`<li>${inline(subBullet[1].trim())}</li>`)
        continue
      }

      const ordered = /^\d+\.\s+(.*)$/.exec(line)
      if (ordered) {
        flushParagraph()
        closeQuote()
        closeNested()
        if (list !== "ol") {
          closeList()
          out.push("<ol>")
          list = "ol"
        }
        out.push(`<li>${inline(ordered[1])}</li>`)
        continue
      }

      if (/^[-*]\s+/.test(line)) {
        flushParagraph()
        closeQuote()
        closeNested()
        if (list !== "ul") {
          closeList()
          out.push("<ul>")
          list = "ul"
        }
        out.push(`<li>${inline(line.replace(/^[-*]\s+/, ""))}</li>`)
        continue
      }

      if (!line.trim()) {
        flushParagraph()
        closeList()
        closeQuote()
        continue
      }

      paragraph.push(line.trim())
    }

    flushParagraph()
    closeList()
    closeQuote()
    if (inCode) out.push("</code></pre>")
    return out.join("\n")
  }

  // ─── Split the README into the three contest answers + framing ─────────────
  const parts = readme.split(/\n(?=## )/)
  const findSection = (prefix: string) => parts.find((p) => p.startsWith(prefix)) ?? ""
  const stripHeading = (s: string) => s.replace(/^##\s+.*\n?/, "").trim()

  const intro = parts[0] ?? ""
  const repoTour = findSection("## Repo tour")

  const answers = [
    {
      id: "what-it-does",
      tag: "01 · WHAT IT DOES",
      title: "The tool",
      html: renderMarkdown(stripHeading(findSection("## What does this tool do"))),
    },
    {
      id: "why-this-one",
      tag: "02 · WHY THIS ONE",
      title: "The wager",
      html: renderMarkdown(stripHeading(findSection("## Why did you build THIS"))),
    },
    {
      id: "whats-next",
      tag: "03 · WHAT'S NEXT",
      title: "The roadmap",
      html: renderMarkdown(stripHeading(findSection("## What would you build next"))),
    },
  ]

  const introHtml = renderMarkdown(intro)
  const repoHtml = renderMarkdown(repoTour)
</script>

<svelte:head>
  <title>The Thinking · It's Today Media</title>
  <meta
    name="description"
    content="The three questions the Build Challenge asks — what the tool does, why this one, what's next — answered on-site as the tour's final stop."
  />
</svelte:head>

<TerminalNav />
<HudChrome />

<main class="blueprint bg-base-100 text-base-content relative min-h-screen px-6 pt-28 pb-24 sm:px-10 lg:px-16">
  <span class="crosshair" style="right: 63px; top: 84px;" aria-hidden="true"></span>

  <!-- ============ HEADER ============ -->
  <header class="mb-14 max-w-4xl">
    <p class="hud mb-5 flex items-center gap-2">
      <span class="live-dot"></span>
      TOUR STOP 04 · THE THINKING
    </p>
    <h1 class="statement text-[clamp(3rem,9vw,7rem)]">The<br />Thinking.</h1>
    <p class="text-base-content/70 mt-6 max-w-xl text-[15px] leading-relaxed">
      The three questions the Build Challenge asks — answered. This is the README, hosted on-site so the tour never
      dead-ends.
    </p>

    <!-- jump index -->
    <nav class="mt-8 flex flex-wrap gap-2" aria-label="The three answers">
      {#each answers as a (a.id)}
        <a
          href={`#${a.id}`}
          class="btn btn-xs border-line rounded-none border bg-transparent font-mono tracking-[0.08em] uppercase"
        >
          {a.tag}
        </a>
      {/each}
    </nav>
  </header>

  <!-- ============ THE THREE ANSWERS ============ -->
  <div class="flex max-w-4xl flex-col gap-6">
    {#each answers as a (a.id)}
      <section id={a.id} class="border-line scroll-mt-24 border">
        <div class="border-line flex items-baseline justify-between border-b px-5 py-3 sm:px-8">
          <p class="hud">{a.tag}</p>
          <p class="hud text-base-content/40">README.md</p>
        </div>
        <div class="px-5 py-6 sm:px-8 sm:py-8">
          <h2 class="statement mb-5 text-2xl sm:text-3xl">{a.title}</h2>
          <div class="prose-readme">
            <!-- eslint-disable-next-line svelte/no-at-html-tags — repo-controlled README, HTML-escaped before rendering -->
            {@html a.html}
          </div>
        </div>
      </section>
    {/each}
  </div>

  <!-- ============ APPENDIX: FULL README CONTEXT ============ -->
  <div class="mt-16 max-w-4xl">
    <p class="hud mb-4">APPENDIX · THE ARTIFACT</p>
    <div class="border-line prose-readme border px-5 py-6 sm:px-8 sm:py-8">
      <!-- eslint-disable-next-line svelte/no-at-html-tags — repo-controlled README, HTML-escaped before rendering -->
      {@html introHtml}
    </div>

    <p class="hud mt-10 mb-4">APPENDIX · REPO TOUR</p>
    <div class="border-line prose-readme border px-5 py-6 sm:px-8 sm:py-8">
      <!-- eslint-disable-next-line svelte/no-at-html-tags — repo-controlled README, HTML-escaped before rendering -->
      {@html repoHtml}
    </div>
  </div>

  <!-- ============ CLOSE ============ -->
  <footer class="border-line mt-16 max-w-4xl border-t pt-8">
    <p class="hud mb-6">END OF TOUR</p>
    <div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <a href="/#begin" class="statement text-3xl sm:text-4xl hover:text-primary">&larr; Back to the start</a>
      <div class="flex flex-wrap gap-x-6 gap-y-2">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer noopener"
          class="hud hover:text-base-content">SOURCE · GITHUB</a
        >
        <a href="/admin" class="hud hover:text-base-content">OS · /ADMIN</a>
        <a href="/studio" class="hud hover:text-base-content">STUDIO</a>
        <a href="/funnel-score" class="hud hover:text-base-content">FUNNEL SCORE</a>
      </div>
    </div>
  </footer>
</main>

<style>
  .prose-readme :global(h2) {
    font-family: var(--font-display);
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.01em;
    font-size: 1.35rem;
    margin: 2rem 0 1rem;
  }
  .prose-readme :global(h2:first-child) {
    margin-top: 0;
  }
  .prose-readme :global(h3) {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-muted);
    margin: 2rem 0 0.75rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-line);
  }
  .prose-readme :global(h4),
  .prose-readme :global(h5) {
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin: 1.25rem 0 0.5rem;
  }
  .prose-readme :global(p) {
    font-size: 0.9375rem;
    line-height: 1.75;
    margin: 0.75rem 0;
    color: color-mix(in oklch, var(--color-base-content) 82%, transparent);
  }
  .prose-readme :global(ul),
  .prose-readme :global(ol) {
    margin: 0.75rem 0 1.25rem;
    padding-left: 1.35rem;
  }
  .prose-readme :global(ul) {
    list-style: square;
  }
  .prose-readme :global(ol) {
    list-style: decimal;
  }
  .prose-readme :global(li) {
    font-size: 0.9375rem;
    line-height: 1.7;
    margin: 0.5rem 0;
    padding-left: 0.35rem;
    color: color-mix(in oklch, var(--color-base-content) 82%, transparent);
  }
  .prose-readme :global(li > ul) {
    margin: 0.5rem 0 0.5rem;
  }
  .prose-readme :global(li::marker) {
    color: var(--color-primary);
  }
  .prose-readme :global(strong) {
    color: var(--color-base-content);
  }
  .prose-readme :global(a) {
    color: var(--color-primary);
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  .prose-readme :global(code) {
    font-family: var(--font-mono);
    font-size: 0.82em;
    padding: 0.05rem 0.3rem;
    background: var(--color-base-200);
    border: 1px solid var(--color-line);
  }
  .prose-readme :global(pre) {
    margin: 1.25rem 0;
    padding: 1rem 1.1rem;
    background: var(--color-base-300);
    border: 1px solid var(--color-line);
    overflow-x: auto;
  }
  .prose-readme :global(pre code) {
    font-size: 0.8125rem;
    line-height: 1.6;
    padding: 0;
    background: transparent;
    border: 0;
    white-space: pre;
  }
  .prose-readme :global(blockquote) {
    border-left: 1px solid var(--color-primary);
    padding: 0.25rem 0 0.25rem 1rem;
    margin: 1rem 0;
  }
  .prose-readme :global(blockquote p) {
    color: var(--color-muted);
    font-size: 0.875rem;
  }
  .prose-readme :global(hr) {
    border: 0;
    border-top: 1px solid var(--color-line);
    margin: 1.75rem 0;
  }
</style>
