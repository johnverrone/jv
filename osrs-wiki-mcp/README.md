# osrs-wiki-mcp

A read-only MCP server on Cloudflare Workers that serves live content from the
[Old School RuneScape Wiki](https://oldschool.runescape.wiki), shaped to use as
few tokens as possible.

## Tools

| Tool | What it returns |
| --- | --- |
| `osrs_wiki_search` | Page titles plus one-line snippets (full-text search). |
| `osrs_wiki_page` | Without `sections`: the infobox, the lead summary, and a numbered section list with a token estimate for each section. With `sections`: only those sections, including their subsections. |
| `osrs_ge_prices` | Real-time GE prices from the wiki's price API: instant buy and sell prices with how old each one is, the 24h average and volume, the buy limit and the high alch value. |

### How it saves tokens

- **Read pages a bit at a time.** The model first gets an overview (usually a
  few hundred tokens). That overview gives the size of every section, so the
  model fetches only the sections it needs, e.g. `["Drops"]`. It never has to
  pull a whole 30k-token boss page.
- **Plain text, not HTML or wikitext.** Pages come from the rendered HTML, so
  templates are already expanded. Images, navboxes, edit links, citation
  markers, hidden switch-infobox data and styling are all stripped.
- **Compact tables.** Infoboxes become `label: value` lines. Data tables become
  `a | b | c` rows with the header printed once and no markdown alignment row.
  Columns that are empty in every row, such as item-icon columns, are dropped.
- **A hard size cap with paging.** `max_chars` (6000 by default) cuts the text
  at a line break and says which `offset` to pass next.
- **Text replies, not JSON.** Results are plain text, so no tokens go to keys
  or quoting.

### Freshness and caching

| Data | Cached for |
| --- | --- |
| Pages | `PAGE_TTL_SECONDS`, 1 hour by default. The parsed text is cached, not the raw HTML. |
| Search results | 10 minutes |
| Latest prices | 60 seconds |
| 24h volume | 10 minutes |
| Item mapping | 6 hours |

Caching is per-isolate memory. If you bind the optional `CACHE` KV namespace,
parsed pages are also shared across isolates and locations (see
`wrangler.jsonc`).

Parsing a page costs CPU. A typical page takes a few ms to tens of ms, and a
very large one can take more. That can go over the Workers Free plan's 10 ms
CPU limit on a cache miss, so use the Paid plan or bind KV if large pages fail.

## Develop

```sh
bun install
bun run cf-typegen   # generates worker-configuration.d.ts
bun test
bun run type-check
bun run dev          # http://localhost:8787/mcp
```

`@modelcontextprotocol/sdk` is pinned to the exact version that `agents` depends
on. If the versions differ, the two `McpServer` types clash.

## Deploy and connect to Claude Code

```sh
bun run deploy
claude mcp add --transport http osrs-wiki https://osrs-wiki-mcp.<your-subdomain>.workers.dev/mcp
```

The server has no authentication because everything it serves is public wiki
data. Anyone who has the URL can use it, and its requests reach the wiki under
this worker's User-Agent.
