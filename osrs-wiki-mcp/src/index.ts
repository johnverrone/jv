import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createMcpHandler } from 'agents/mcp';
import { z } from 'zod';
import { formatOverview, formatPrice, formatSearch, formatSections, matchItems, paginate } from './format';
import { getDailyVolume, getLatest, getMapping, getPage, normalizeTitle, search, type Bindings } from './wiki';

// Stateless, read-only MCP server over the Old School RuneScape Wiki. No
// Durable Object or OAuth: every tool is a cached read of public data, so a
// fresh McpServer per request (createMcpHandler's stateless streamable-HTTP
// transport) is all that's needed.
//
// Token budget is the main design constraint. The intended flow is
//   osrs_wiki_search → osrs_wiki_page (overview) → osrs_wiki_page (sections)
// so the model only ever pulls the parts of a page it needs, as compact text.

const text = (t: string) => ({ content: [{ type: 'text' as const, text: t }] });
const errorText = (t: string) => ({ content: [{ type: 'text' as const, text: t }], isError: true });

function buildServer(env: Bindings): McpServer {
	const server = new McpServer({ name: 'osrs-wiki', version: '0.1.0' });

	server.registerTool(
		'osrs_wiki_search',
		{
			description:
				'Full-text search of the Old School RuneScape Wiki. Returns page titles with one-line snippets. Use when you do not know the exact page title.',
			inputSchema: {
				query: z.string().min(1),
				limit: z.number().int().min(1).max(20).optional().describe('default 5')
			},
			annotations: { readOnlyHint: true, openWorldHint: true }
		},
		async ({ query, limit }) => run(async () => formatSearch(query, await search(env, query, limit ?? 5)))
	);

	server.registerTool(
		'osrs_wiki_page',
		{
			description:
				'Read an OSRS Wiki page as compact text. Without `sections`: infobox + lead summary + a numbered section list with token sizes. Then call again with `sections` to read only what you need (e.g. ["Drops"], ["Strategy", "4"]). Titles are case-insensitive and redirects are followed; "Page#Section" also works.',
			inputSchema: {
				title: z.string().min(1).describe('Page title or wiki URL, e.g. "Abyssal whip"'),
				sections: z
					.array(z.string())
					.optional()
					.describe('Section numbers or names from the overview; subsections are included'),
				max_chars: z.number().int().min(500).max(50000).optional().describe('default 6000'),
				offset: z.number().int().min(0).optional().describe('continue a truncated response')
			},
			annotations: { readOnlyHint: true, openWorldHint: true }
		},
		async ({ title, sections, max_chars, offset }) =>
			run(async () => {
				const [name, fragment] = title.split('#', 2);
				const page = await getPage(env, name);
				if (!page) {
					const r = await search(env, normalizeTitle(name), 5);
					return `No page titled "${normalizeTitle(name)}".\n\n${formatSearch(name, r)}`;
				}
				const wanted = sections?.length ? sections : fragment ? [fragment.replace(/_/g, ' ')] : null;
				const body = wanted ? formatSections(page, wanted) : formatOverview(page);
				return paginate(body, offset ?? 0, max_chars ?? 6000);
			})
	);

	server.registerTool(
		'osrs_ge_prices',
		{
			description:
				'Real-time Grand Exchange prices from the wiki\'s price API (updates ~every minute). Per item: instant-buy and instant-sell prices with age, 24h average and volume, GE buy limit, high alch value. Accepts item names or ids; a partial name returns the closest matches (e.g. "prayer potion" → all doses).',
			inputSchema: {
				items: z.array(z.string().min(1)).min(1).max(20)
			},
			annotations: { readOnlyHint: true, openWorldHint: true }
		},
		async ({ items }) =>
			run(async () => {
				const [mapping, latest, daily] = await Promise.all([getMapping(env), getLatest(env), getDailyVolume(env)]);
				const lines: string[] = [];
				const seen = new Set<number>();
				for (const q of items) {
					const { items: matches, more } = matchItems(mapping, q);
					if (!matches.length) {
						lines.push(`"${q}": no tradeable item found (untradeable items have no GE price).`);
						continue;
					}
					for (const m of matches) {
						if (seen.has(m.id)) continue;
						seen.add(m.id);
						lines.push(formatPrice(m, latest[m.id], daily[m.id]));
					}
					if (more) lines.push(`  …${more} more items match "${q}"; be more specific.`);
				}
				return lines.join('\n');
			})
	);

	return server;
}

async function run(fn: () => Promise<string>) {
	try {
		return text(await fn());
	} catch (e) {
		return errorText(e instanceof Error ? e.message : String(e));
	}
}

export default {
	async fetch(request: Request, env: Bindings, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		if (url.pathname === '/mcp') return createMcpHandler(buildServer(env))(request, env, ctx);
		if (url.pathname === '/') {
			return new Response('OSRS Wiki MCP server. Connect an MCP client to /mcp (streamable HTTP).\n', {
				headers: { 'content-type': 'text/plain' }
			});
		}
		return new Response('Not found', { status: 404 });
	}
} satisfies ExportedHandler<Bindings>;
