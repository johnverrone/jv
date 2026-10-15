import { parsePage, stripTags, type ParsedPage } from './html';

export const WIKI_BASE = 'https://oldschool.runescape.wiki';
const API = `${WIKI_BASE}/api.php`;
const PRICES_API = 'https://prices.runescape.wiki/api/v1/osrs';

export interface Bindings {
	/** Optional KV namespace shared across isolates/colos for parsed pages. */
	CACHE?: KVNamespace;
	/** The wiki asks every API client for a descriptive User-Agent. */
	WIKI_USER_AGENT?: string;
	/** Seconds a parsed page is reused before re-fetching. */
	PAGE_TTL_SECONDS?: string;
}

const DEFAULT_UA = 'osrs-wiki-mcp/0.1 (Cloudflare Worker MCP server; github.com/johnverrone/jv)';

export class WikiError extends Error {}

// --- Caching ---------------------------------------------------------------
// Two tiers: a per-isolate memory map (free, survives between requests while
// the isolate is warm) and, when bound, KV (shared, survives cold starts).
// The Cache API isn't used because it's a no-op on *.workers.dev.

const memory = new Map<string, { expires: number; value: unknown }>();
const MEMORY_MAX = 200;

async function cached<T>(
	env: Bindings,
	key: string,
	ttlSeconds: number,
	load: () => Promise<T>,
	{ kv = true }: { kv?: boolean } = {}
): Promise<T> {
	const now = Date.now();
	const hit = memory.get(key);
	if (hit && hit.expires > now) return hit.value as T;

	if (kv && env.CACHE) {
		const stored = await env.CACHE.get<T>(key, 'json');
		if (stored !== null) {
			remember(key, stored, now + ttlSeconds * 1000);
			return stored;
		}
	}
	const value = await load();
	remember(key, value, now + ttlSeconds * 1000);
	if (kv && env.CACHE) {
		// KV's minimum expirationTtl is 60s.
		await env.CACHE.put(key, JSON.stringify(value), { expirationTtl: Math.max(60, ttlSeconds) });
	}
	return value;
}

function remember(key: string, value: unknown, expires: number) {
	memory.delete(key);
	memory.set(key, { expires, value });
	if (memory.size > MEMORY_MAX) memory.delete(memory.keys().next().value!);
}

async function getJson<T>(env: Bindings, url: string): Promise<T> {
	const host = new URL(url).host;
	let res: Response;
	try {
		res = await fetch(url, {
			headers: { 'User-Agent': env.WIKI_USER_AGENT || DEFAULT_UA, Accept: 'application/json' }
		});
	} catch (e) {
		throw new WikiError(`Could not reach ${host}: ${e instanceof Error ? e.message : e}`);
	}
	if (!res.ok) throw new WikiError(`${host} returned HTTP ${res.status}`);
	return (await res.json()) as T;
}

function apiUrl(params: Record<string, string>): string {
	const qs = new URLSearchParams({ format: 'json', formatversion: '2', ...params });
	return `${API}?${qs}`;
}

// --- Search ----------------------------------------------------------------

export interface SearchHit {
	title: string;
	snippet: string;
	section?: string;
	redirectFrom?: string;
}

export async function search(
	env: Bindings,
	query: string,
	limit: number
): Promise<{ hits: SearchHit[]; suggestion?: string; total: number }> {
	type Resp = {
		query?: {
			searchinfo?: { totalhits?: number; suggestion?: string };
			search: { title: string; snippet?: string; sectiontitle?: string; redirecttitle?: string }[];
		};
		error?: { info: string };
	};
	const data = await cached(
		env,
		`search:${limit}:${query.toLowerCase()}`,
		600,
		() =>
			getJson<Resp>(
				env,
				apiUrl({
					action: 'query',
					list: 'search',
					srsearch: query,
					srlimit: String(limit),
					srprop: 'snippet|sectiontitle|redirecttitle',
					srinfo: 'totalhits|suggestion'
				})
			),
		{ kv: false }
	);
	if (data.error) throw new WikiError(data.error.info);
	return {
		hits: (data.query?.search ?? []).map((r) => ({
			title: r.title,
			snippet: stripTags(r.snippet ?? ''),
			section: r.sectiontitle,
			redirectFrom: r.redirecttitle
		})),
		suggestion: data.query?.searchinfo?.suggestion,
		total: data.query?.searchinfo?.totalhits ?? 0
	};
}

// --- Pages -----------------------------------------------------------------

export interface WikiPage extends ParsedPage {
	title: string;
	revid: number;
	redirectedFrom?: string;
	url: string;
}

export async function getPage(env: Bindings, rawTitle: string): Promise<WikiPage | null> {
	const title = normalizeTitle(rawTitle);
	const ttl = Number(env.PAGE_TTL_SECONDS) || 3600;
	// The cached value is the *parsed* page (a few KB of text), not the raw
	// HTML (often hundreds of KB) — parsing is the expensive part on CPU.
	return cached(env, `page:v1:${title}`, ttl, async () => {
		type Resp = {
			parse?: { title: string; revid: number; text: string; redirects?: { from: string; to: string }[] };
			error?: { code: string; info: string };
		};
		const data = await getJson<Resp>(
			env,
			apiUrl({
				action: 'parse',
				page: title,
				prop: 'text|revid',
				redirects: '1',
				disableeditsection: '1',
				disablelimitreport: '1',
				disabletoc: '1'
			})
		);
		if (data.error?.code === 'missingtitle' || data.error?.code === 'invalidtitle') return null;
		if (data.error || !data.parse) throw new WikiError(data.error?.info ?? 'Unexpected wiki response');
		const p = data.parse;
		return {
			...parsePage(p.text),
			title: p.title,
			revid: p.revid,
			redirectedFrom: p.redirects?.[0]?.from,
			url: pageUrl(p.title)
		};
	});
}

export function pageUrl(title: string): string {
	return `${WIKI_BASE}/w/${encodeURIComponent(title.replace(/ /g, '_')).replace(/%2F/g, '/').replace(/%3A/g, ':')}`;
}

/** Accepts "abyssal whip", "Abyssal_whip", or a full wiki URL. */
export function normalizeTitle(input: string): string {
	let t = input.trim();
	const m = /^https?:\/\/oldschool\.runescape\.wiki\/w\/([^?#]+)/i.exec(t);
	if (m) t = decodeURIComponent(m[1]);
	t = t.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
	return t.charAt(0).toUpperCase() + t.slice(1);
}

// --- Grand Exchange prices (real-time wiki API) ------------------------------

export interface ItemMapping {
	id: number;
	name: string;
	examine?: string;
	members: boolean;
	lowalch?: number;
	highalch?: number;
	limit?: number;
	value?: number;
}

export interface LatestPrice {
	high: number | null;
	highTime: number | null;
	low: number | null;
	lowTime: number | null;
}

export interface DailyVolume {
	avgHighPrice: number | null;
	highPriceVolume: number;
	avgLowPrice: number | null;
	lowPriceVolume: number;
}

export function getMapping(env: Bindings): Promise<ItemMapping[]> {
	// ~4k items; changes only on game updates. Memory-only: it's large and
	// re-fetching once per isolate per 6h is cheap.
	return cached(env, 'prices:mapping', 6 * 3600, () => getJson<ItemMapping[]>(env, `${PRICES_API}/mapping`), {
		kv: false
	});
}

export async function getLatest(env: Bindings): Promise<Record<string, LatestPrice>> {
	const data = await cached(
		env,
		'prices:latest',
		60,
		() => getJson<{ data: Record<string, LatestPrice> }>(env, `${PRICES_API}/latest`),
		{ kv: false }
	);
	return data.data;
}

export async function getDailyVolume(env: Bindings): Promise<Record<string, DailyVolume>> {
	const data = await cached(
		env,
		'prices:24h',
		600,
		() => getJson<{ data: Record<string, DailyVolume> }>(env, `${PRICES_API}/24h`),
		{ kv: false }
	);
	return data.data;
}
