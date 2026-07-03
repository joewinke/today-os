<script lang="ts">
  import { page } from "$app/state"
  import type { LayoutServerData } from "./$types"

  let { children, data }: { children: import("svelte").Snippet; data: LayoutServerData } = $props()

  const nav = [
    { href: "/admin", label: "OVERVIEW" },
    { href: "/admin/inbox", label: "INBOX" },
    { href: "/admin/doctrine", label: "DOCTRINE" },
    { href: "/admin/log", label: "LOG" },
  ]

  function isActive(href: string): boolean {
    if (href === "/admin") {
      return page.url.pathname === "/admin" || page.url.pathname.startsWith("/admin/accounts")
    }
    return page.url.pathname.startsWith(href)
  }
</script>

<svelte:head>
  <title>Ad Ops — Today OS</title>
</svelte:head>

<div class="min-h-screen bg-base-100 text-base-content flex flex-col">
  <header class="border-b" style="border-color: var(--color-line)">
    <div class="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-8">
      <a href="/" class="hud transition-colors hover:text-base-content" aria-label="Back to Today OS home">
        &larr; TODAY&nbsp;OS
      </a>
      <span class="hud text-base-content">AD&nbsp;OPS</span>
      <span class="hidden select-none sm:inline" style="color: var(--color-line)">/</span>
      <nav class="flex flex-wrap items-center gap-x-5 gap-y-1" aria-label="Console">
        {#each nav as item (item.href)}
          <a
            href={item.href}
            class="hud transition-colors hover:text-base-content {isActive(item.href) ? 'text-primary' : ''}"
            aria-current={isActive(item.href) ? "page" : undefined}
          >
            {item.label}{#if item.label === "INBOX" && data.inboxCount > 0}&nbsp;[{data.inboxCount}]{/if}
          </a>
        {/each}
      </nav>
      <span class="hud ml-auto hidden md:inline" aria-hidden="true">AGENTIC AD OPS · IN-MEMORY · NO DB</span>
    </div>
  </header>

  <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8">
    {@render children()}
  </main>

  <footer class="border-t" style="border-color: var(--color-line)">
    <div class="mx-auto w-full max-w-6xl px-4 py-3 sm:px-8">
      <p class="hud">DISCOVER &rarr; SNAPSHOT &rarr; DIFF &rarr; RECOMMEND &rarr; APPROVE &rarr; APPLY</p>
    </div>
  </footer>
</div>
