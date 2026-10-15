import { parse, HTMLElement, NodeType, TextNode, type Node } from 'node-html-parser';

// Converts the wiki's rendered page HTML (action=parse) into compact plain
// text split by section. Rendered HTML rather than wikitext because OSRS
// pages are mostly templates ({{Infobox Item}}, {{DropsLine}}, {{plink}}…)
// whose expanded output is the actual content; we then strip everything that
// costs tokens without carrying information: images, navboxes, edit links,
// citation markers, hidden switch-infobox data, inline styling, markup.

export interface Section {
	/** 0 = lead (text before the first heading). */
	index: number;
	/** 1 for the lead, otherwise the heading level (2 = h2…). */
	level: number;
	title: string;
	text: string;
}

export interface ParsedPage {
	/** Infobox tables pulled out of the lead, rendered as `key: value` lines. */
	infobox: string;
	sections: Section[];
}

// Matched in a single tree walk (see clean()) — node-html-parser's
// querySelectorAll costs ~10ms per selector on a large page, which adds up
// fast against Workers' CPU limits.
const STRIP_TAGS = new Set(['script', 'style', 'link', 'meta', 'noscript', 'img', 'figure']);
const STRIP_CLASSES = new Set([
	'mw-editsection',
	'navbox',
	'navigation-not-searchable',
	'toc',
	'reference',
	'mw-references-wrap',
	'references',
	'reflist',
	'printfooter',
	'catlinks',
	'mw-empty-elt',
	'infobox-switch-resources',
	'tabber__header',
	'thumb',
	'gallery',
	'mw-collapsible-toggle',
	'hidden',
	'sortkey'
]);

const BLOCK_TAGS = new Set([
	'p',
	'div',
	'section',
	'article',
	'blockquote',
	'center',
	'pre',
	'main',
	'aside',
	'header',
	'footer'
]);

const HEADING_RE = /^h([2-6])$/;

// Placeholder for list indentation so tidy()'s per-line trimming (which runs
// at every nesting level) can't eat it; swapped for spaces in finish().
const INDENT = '\u0001';

export function parsePage(html: string): ParsedPage {
	const doc = parse(dropTrailingNavboxes(html), { comment: false });
	const root = (doc.querySelector('.mw-parser-output') ?? doc) as HTMLElement;

	clean(root);

	const infoboxes: string[] = [];
	const sections: Section[] = [];
	let current: Section = { index: 0, level: 1, title: '(lead)', text: '' };
	let buf: string[] = [];

	const flush = () => {
		current.text = finish(buf.join(''));
		sections.push(current);
		buf = [];
	};

	for (const node of root.childNodes) {
		const heading = headingOf(node);
		if (heading) {
			flush();
			current = { index: sections.length, level: heading.level, title: heading.title, text: '' };
			continue;
		}
		if (current.index === 0 && node instanceof HTMLElement && isInfobox(node)) {
			infoboxes.push(finish(render(node)));
			continue;
		}
		if (current.index === 0 && node instanceof HTMLElement) {
			// Infoboxes are sometimes wrapped (floated divs, switch containers).
			for (const box of node.querySelectorAll('table.infobox')) {
				infoboxes.push(finish(render(box)));
				box.remove();
			}
		}
		buf.push(render(node));
	}
	flush();

	return { infobox: infoboxes.filter(Boolean).join('\n\n'), sections };
}

/**
 * Navboxes (the big "Weapons", "Slayer monsters"… link grids) trail the
 * content of almost every page and can be a large share of its HTML. Parsing
 * is the dominant CPU cost, so cut them off as a string before parsing when
 * they come after the last heading. Anything else is caught by clean().
 */
export function dropTrailingNavboxes(html: string): string {
	const nav = html.search(/<(table|div)\b[^>]*class="[^"]*\bnavbox\b/);
	if (nav === -1 || nav < html.lastIndexOf('<h2')) return html;
	return html.slice(0, nav);
}

function clean(el: HTMLElement, inTh = false): void {
	// Rebuild each child list once: node-html-parser's remove()/replaceWith()
	// are O(siblings) each, i.e. quadratic on a long page.
	const kept: Node[] = [];
	for (const child of el.childNodes) {
		if (!(child instanceof HTMLElement)) {
			kept.push(child);
			continue;
		}
		const tag = child.rawTagName?.toLowerCase() ?? '';
		// Icons in header cells (e.g. the stab/slash/crush row of an item's
		// combat-bonus table) are the only place an image *is* the label.
		if (tag === 'img' && inTh) {
			kept.push(new TextNode(cleanAlt(child.getAttribute('alt') ?? ''), el));
			continue;
		}
		if (
			STRIP_TAGS.has(tag) ||
			child.id === 'toc' ||
			child.classList.value.some((c) => STRIP_CLASSES.has(c)) ||
			/display\s*:\s*none/i.test(child.getAttribute('style') ?? '')
		) {
			continue;
		}
		// Switch infoboxes (multiple versions of one item/NPC) only render the
		// default version; list the alternatives so the reader knows they exist.
		if (child.classList.contains('infobox-buttons')) {
			const names = child.childNodes
				.filter((b): b is HTMLElement => b instanceof HTMLElement && b.classList.contains('button'))
				.map((b) => collapse(b.text))
				.filter(Boolean);
			if (names.length) {
				const p = new HTMLElement('p', {}, '', el);
				p.childNodes.push(new TextNode(`Versions: ${names.join(', ')} (showing ${names[0]})`, p));
				kept.push(p);
			}
			continue;
		}
		clean(child, inTh || (tag === 'th' && !child.text.trim()));
		kept.push(child);
	}
	el.childNodes = kept;
}

function headingOf(node: Node): { level: number; title: string } | null {
	if (!(node instanceof HTMLElement)) return null;
	let el: HTMLElement | null = node;
	// MediaWiki ≥1.43 wraps headings: <div class="mw-heading mw-heading2"><h2>…
	if (node.classList.contains('mw-heading')) el = node.querySelector('h2, h3, h4, h5, h6');
	const m = el && HEADING_RE.exec(el.tagName.toLowerCase());
	if (!el || !m) return null;
	return { level: Number(m[1]), title: collapse(el.text) };
}

function isInfobox(el: HTMLElement): boolean {
	return el.tagName === 'TABLE' && el.classList.contains('infobox');
}

/** Render a node to lightweight markdown-ish text. */
export function render(node: Node, listDepth = 0): string {
	if (node.nodeType === NodeType.TEXT_NODE) return collapse(node.text, false);
	if (!(node instanceof HTMLElement)) return '';
	const tag = node.tagName?.toLowerCase() ?? '';
	const inner = () => node.childNodes.map((c) => render(c, listDepth)).join('');

	if (tag === 'br') return '\n';
	if (tag === 'table') return `\n\n${renderTable(node)}\n\n`;
	if (tag === 'ul' || tag === 'ol') return `\n${renderList(node, tag === 'ol', listDepth)}\n`;
	if (tag === 'dl') return `\n${renderDefinitionList(node)}\n`;
	const h = HEADING_RE.exec(tag);
	if (h) return `\n\n${'#'.repeat(Number(h[1]))} ${collapse(node.text)}\n\n`;
	if (node.classList.contains('tabbertab') || node.classList.contains('tabber__panel')) {
		const title =
			node.getAttribute('data-title') ?? node.getAttribute('data-mw-tabber-title') ?? node.getAttribute('title');
		return `\n\n${title ? `[Tab: ${title}]\n` : ''}${inner()}\n\n`;
	}
	if (BLOCK_TAGS.has(tag)) return `\n\n${inner()}\n\n`;
	return inner();
}

function renderList(list: HTMLElement, ordered: boolean, depth: number): string {
	const indent = INDENT.repeat(depth);
	let n = 0;
	const lines: string[] = [];
	for (const li of list.childNodes) {
		if (!(li instanceof HTMLElement) || li.tagName !== 'LI') continue;
		n++;
		const text: string[] = [];
		const nested: string[] = [];
		for (const c of li.childNodes) {
			if (c instanceof HTMLElement && (c.tagName === 'UL' || c.tagName === 'OL')) {
				nested.push(renderList(c, c.tagName === 'OL', depth + 1));
			} else {
				text.push(render(c, depth + 1));
			}
		}
		const own = tidy(text.join('')).replace(/\s*\n+\s*/g, ' ');
		if (own) lines.push(`${indent}${ordered ? `${n}.` : '-'} ${own}`);
		lines.push(...nested.filter(Boolean));
	}
	return lines.join('\n');
}

function renderDefinitionList(dl: HTMLElement): string {
	const lines: string[] = [];
	for (const c of dl.childNodes) {
		if (!(c instanceof HTMLElement)) continue;
		const text = tidy(render(c)).replace(/\n+/g, ' ');
		if (!text) continue;
		lines.push(c.tagName === 'DT' ? `${text}:` : `  ${text}`);
	}
	return lines.join('\n');
}

function renderTable(table: HTMLElement): string {
	const rows: { cells: string[]; header: boolean[]; spans: number[] }[] = [];
	for (const tr of directRows(table)) {
		const cellEls = tr.childNodes.filter(
			(c): c is HTMLElement => c instanceof HTMLElement && (c.tagName === 'TD' || c.tagName === 'TH')
		);
		const cells = cellEls.map((c) => tidy(render(c)).replace(/\s*\n+\s*/g, '; '));
		if (cells.every((c) => !c)) continue;
		rows.push({
			cells,
			header: cellEls.map((c) => c.tagName === 'TH'),
			spans: cellEls.map((c) => Number(c.getAttribute('colspan') ?? 1) || 1)
		});
	}
	if (!rows.length) return '';
	const captionEl = table.childNodes.find((c): c is HTMLElement => c instanceof HTMLElement && c.tagName === 'CAPTION');
	const caption = captionEl ? collapse(captionEl.text) : '';
	const out: string[] = caption ? [caption] : [];

	// Infobox-shaped tables (label cell + value cell per row, with full-width
	// sub-headers) read best — and cheapest — as `label: value` lines.
	const keyValue = rows.every(
		(r) =>
			(r.cells.length === 2 && r.header[0] && !r.header[1]) ||
			(r.cells.length === 1 && (r.header[0] || r.spans[0] > 1))
	);
	if (keyValue) {
		for (const r of rows) {
			if (r.cells.length === 1) out.push(`[${r.cells[0]}]`);
			else if (r.cells[1]) out.push(`${r.cells[0]}: ${r.cells[1]}`);
		}
		return out.join('\n');
	}

	// Data tables: pipe-separated rows, header once, no markdown alignment row.
	// Columns that are empty in every body row (typically image-only columns)
	// are dropped; a colspan cell survives if any column it spans survives.
	const widthOf = (r: (typeof rows)[number]) => r.spans.reduce((a, b) => a + b, 0);
	const width = Math.max(...rows.map(widthOf));
	const body = rows.filter((r) => !r.header.every(Boolean));
	const keep = Array<boolean>(width).fill(false);
	for (const r of body.length ? body : rows) {
		if (widthOf(r) !== width) continue;
		let col = 0;
		r.cells.forEach((c, i) => {
			if (c) for (let k = col; k < col + r.spans[i]; k++) keep[k] = true;
			col += r.spans[i];
		});
	}
	for (const r of rows) {
		if (widthOf(r) !== width) {
			// Rows shortened by rowspan can't be aligned; keep what they have.
			out.push(r.cells.filter(Boolean).join(' | '));
			continue;
		}
		const cells: string[] = [];
		let col = 0;
		r.cells.forEach((c, i) => {
			if (keep.slice(col, col + r.spans[i]).some(Boolean)) cells.push(c);
			col += r.spans[i];
		});
		out.push(cells.join(' | '));
	}
	return out.join('\n');
}

function directRows(table: HTMLElement): HTMLElement[] {
	const rows: HTMLElement[] = [];
	for (const c of table.childNodes) {
		if (!(c instanceof HTMLElement)) continue;
		if (c.tagName === 'TR') rows.push(c);
		else if (c.tagName === 'THEAD' || c.tagName === 'TBODY' || c.tagName === 'TFOOT') {
			for (const tr of c.childNodes) if (tr instanceof HTMLElement && tr.tagName === 'TR') rows.push(tr);
		}
	}
	return rows;
}

function cleanAlt(alt: string): string {
	return alt
		.replace(/^File:/i, '')
		.replace(/\.(png|gif|jpe?g|svg|webp)$/i, '')
		.replace(/\s*icon$/i, '')
		.trim();
}

function collapse(s: string, trim = true): string {
	const out = decodeEntities(s).replace(/[\s ]+/g, ' ');
	return trim ? out.trim() : out;
}

const NAMED_ENTITIES: Record<string, string> = {
	amp: '&',
	lt: '<',
	gt: '>',
	quot: '"',
	apos: "'",
	nbsp: ' ',
	ndash: '–',
	mdash: '—',
	times: '×',
	hellip: '…',
	rarr: '→',
	larr: '←'
};

export function decodeEntities(s: string): string {
	return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
		if (e[0] === '#') {
			const code = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
			return Number.isFinite(code) ? String.fromCodePoint(code) : m;
		}
		return NAMED_ENTITIES[e.toLowerCase()] ?? m;
	});
}

/** Normalise whitespace: trim each line, collapse runs of blank lines. */
export function tidy(s: string): string {
	return s
		.split('\n')
		.map((l) => l.replace(/[ \t]+/g, ' ').trim())
		.join('\n')
		.replace(/\n{3,}/g, '\n\n')
		.trim();
}

function finish(s: string): string {
	return tidy(s).replaceAll(INDENT, '  ');
}

/** Strip tags from a short HTML fragment (search snippets). */
export function stripTags(html: string): string {
	return collapse(html.replace(/<[^>]*>/g, ''));
}
