import type { Section } from './html';
import type { DailyVolume, ItemMapping, LatestPrice, SearchHit, WikiPage } from './wiki';

// Everything returned to the model goes through here. Output is plain text
// (not JSON — keys and quoting are pure token overhead) and is shaped so the
// model can fetch progressively: overview first, then only the sections it
// needs, with sizes up front so it can budget.

const approxTokens = (s: string) => Math.ceil(s.length / 4);

export function formatSearch(query: string, r: { hits: SearchHit[]; suggestion?: string; total: number }): string {
	if (!r.hits.length) {
		return `No wiki results for "${query}".${r.suggestion ? ` Did you mean "${r.suggestion}"?` : ''}`;
	}
	const lines = [`${r.total} results for "${query}" (top ${r.hits.length}):`];
	r.hits.forEach((h, i) => {
		const via = [h.redirectFrom && `via "${h.redirectFrom}"`, h.section && `§${h.section}`].filter(Boolean).join(', ');
		const snippet = h.snippet.length > 160 ? `${h.snippet.slice(0, 157)}…` : h.snippet;
		lines.push(`${i + 1}. ${h.title}${via ? ` (${via})` : ''}${snippet ? ` — ${snippet}` : ''}`);
	});
	if (r.suggestion) lines.push(`Did you mean "${r.suggestion}"?`);
	return lines.join('\n');
}

function header(page: WikiPage): string {
	const redirect = page.redirectedFrom ? ` (redirected from "${page.redirectedFrom}")` : '';
	return `# ${page.title}${redirect}\n${page.url} · rev ${page.revid}`;
}

export function formatOverview(page: WikiPage): string {
	const [lead, ...rest] = page.sections;
	const parts = [header(page)];
	if (page.infobox) parts.push(page.infobox);
	if (lead?.text) parts.push(lead.text);
	if (rest.length) {
		const outline = rest.map((s) => {
			const size = subtreeText(page.sections, s.index);
			return `${'  '.repeat(Math.max(0, s.level - 2))}${s.index}. ${s.title} (~${approxTokens(size)} tok)`;
		});
		parts.push(
			`Sections (pass numbers or names in \`sections\` to read; subsections are included):\n${outline.join('\n')}`
		);
	}
	return parts.join('\n\n');
}

export function formatSections(page: WikiPage, wanted: string[]): string {
	const parts = [header(page)];
	const missing: string[] = [];
	const included = new Set<number>();
	for (const w of wanted) {
		const s = findSection(page.sections, w);
		if (!s) {
			missing.push(w);
			continue;
		}
		if (included.has(s.index)) continue;
		for (const sub of subtree(page.sections, s.index)) included.add(sub.index);
		parts.push(subtreeText(page.sections, s.index) || `## ${s.title}\n(empty)`);
	}
	if (missing.length) {
		const available = page.sections
			.slice(1)
			.map((s) => `${s.index}. ${s.title}`)
			.join(', ');
		parts.push(`No section matching ${missing.map((m) => `"${m}"`).join(', ')}. Available: ${available || '(none)'}`);
	}
	return parts.join('\n\n');
}

export function findSection(sections: Section[], query: string): Section | undefined {
	const q = query.trim().toLowerCase();
	if (/^\d+$/.test(q)) return sections[Number(q)];
	if (q === 'lead' || q === 'summary' || q === 'intro') return sections[0];
	return (
		sections.find((s) => s.title.toLowerCase() === q) ??
		sections.find((s) => s.title.toLowerCase().startsWith(q)) ??
		sections.find((s) => s.title.toLowerCase().includes(q))
	);
}

/** The section plus every following section nested under it. */
function subtree(sections: Section[], index: number): Section[] {
	const root = sections[index];
	const out = [root];
	if (index === 0) return out;
	for (let i = index + 1; i < sections.length && sections[i].level > root.level; i++) out.push(sections[i]);
	return out;
}

function subtreeText(sections: Section[], index: number): string {
	return subtree(sections, index)
		.map((s) => (s.index === 0 ? s.text : `${'#'.repeat(s.level)} ${s.title}${s.text ? `\n${s.text}` : ''}`))
		.join('\n\n');
}

/**
 * Hard cap on returned text, cut on a line boundary, with an explicit
 * continuation hint so a long section (e.g. a boss's drop table) can be paged
 * through instead of dumped all at once.
 */
export function paginate(text: string, offset: number, maxChars: number): string {
	if (offset >= text.length && offset > 0) return `[Offset ${offset} is past the end (${text.length} chars).]`;
	let end = Math.min(text.length, offset + maxChars);
	if (end < text.length) {
		const nl = text.lastIndexOf('\n', end);
		if (nl > offset + maxChars * 0.5) end = nl;
	}
	const body = text.slice(offset, end);
	if (end >= text.length && offset === 0) return body;
	const note =
		end < text.length
			? `[Truncated: chars ${offset}–${end} of ${text.length}. Call again with offset=${end} to continue.]`
			: `[End: chars ${offset}–${end} of ${text.length}.]`;
	return `${body}\n\n${note}`;
}

// --- Prices ------------------------------------------------------------------

const gp = (n: number | null | undefined) => (n == null ? '—' : n.toLocaleString('en-US'));

function ago(unixSeconds: number | null, now: number): string {
	if (!unixSeconds) return '';
	const s = Math.max(0, Math.round(now / 1000 - unixSeconds));
	if (s < 3600) return ` (${Math.round(s / 60)}m ago)`;
	if (s < 86400) return ` (${Math.round(s / 3600)}h ago)`;
	return ` (${Math.round(s / 86400)}d ago)`;
}

export function formatPrice(
	item: ItemMapping,
	latest: LatestPrice | undefined,
	daily: DailyVolume | undefined,
	now = Date.now()
): string {
	const bits = [
		`buy ${gp(latest?.high)}${ago(latest?.highTime ?? null, now)}`,
		`sell ${gp(latest?.low)}${ago(latest?.lowTime ?? null, now)}`
	];
	if (daily) {
		const avg = avgOf(daily);
		bits.push(`24h avg ${gp(avg)}, vol ${gp(daily.highPriceVolume + daily.lowPriceVolume)}`);
	}
	if (item.limit) bits.push(`limit ${gp(item.limit)}`);
	if (item.highalch) bits.push(`HA ${gp(item.highalch)}`);
	return `${item.name} [${item.id}${item.members ? ', mem' : ''}]: ${bits.join(' · ')}`;
}

function avgOf(d: DailyVolume): number | null {
	const vol = d.highPriceVolume + d.lowPriceVolume;
	if (d.avgHighPrice != null && d.avgLowPrice != null && vol > 0) {
		return Math.round((d.avgHighPrice * d.highPriceVolume + d.avgLowPrice * d.lowPriceVolume) / vol);
	}
	return d.avgHighPrice ?? d.avgLowPrice;
}

/**
 * Resolve a user-supplied item (name or id) against the mapping. An exact
 * name/id match wins; otherwise substring matches are returned (capped), so
 * "prayer potion" yields all four doses rather than an error.
 */
export function matchItems(mapping: ItemMapping[], query: string, cap = 5): { items: ItemMapping[]; more: number } {
	const q = query.trim().toLowerCase();
	if (/^\d+$/.test(q)) {
		const byId = mapping.find((m) => m.id === Number(q));
		return { items: byId ? [byId] : [], more: 0 };
	}
	const exact = mapping.find((m) => m.name.toLowerCase() === q);
	if (exact) return { items: [exact], more: 0 };
	const partial = mapping
		.filter((m) => m.name.toLowerCase().includes(q))
		.sort((a, b) => Number(!a.name.toLowerCase().startsWith(q)) - Number(!b.name.toLowerCase().startsWith(q)) || a.name.length - b.name.length);
	return { items: partial.slice(0, cap), more: Math.max(0, partial.length - cap) };
}
