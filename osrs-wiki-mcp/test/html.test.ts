import { describe, expect, test } from 'bun:test';
import { parsePage } from '../src/html';
import { findSection, formatOverview, formatSections, matchItems, paginate } from '../src/format';
import type { WikiPage } from '../src/wiki';

// Structural fixture modelled on action=parse output: legacy and ≥1.43
// heading markup, a switch infobox, an icon-headed bonus table, a drops
// table with an image-only column, and the noise we expect to strip.
const HTML = `<div class="mw-parser-output">
<div class="hatnote">For the tentacle, see Abyssal tentacle.</div>
<table class="infobox infobox-item">
  <tbody>
    <tr><th colspan="2" class="infobox-header">Abyssal whip</th></tr>
    <tr><td colspan="2" class="infobox-image"><img alt="Abyssal whip.png" src="x"></td></tr>
    <tr><th>Released</th><td><a href="/w/26_January">26 January</a> 2005</td></tr>
    <tr><th>Members</th><td>Yes</td></tr>
    <tr><th>Tradeable</th><td>Yes</td></tr>
    <tr><th>Weight</th><td>0.453&nbsp;kg</td></tr>
  </tbody>
</table>
<div class="infobox-buttons"><span class="button" data-switch-index="1">Normal</span><span class="button" data-switch-index="2">Frozen</span></div>
<div class="infobox-switch-resources hidden"><span data-attr-param="weight">LOTS OF HIDDEN DATA</span></div>
<p>The <b>abyssal whip</b> is a one-handed melee weapon<sup class="reference"><a href="#cite-1">[1]</a></sup> that requires 70 <a href="/w/Attack">Attack</a> to wield.</p>
<p><span style="display:none">hidden text</span>It is dropped by abyssal demons.</p>
<div class="mw-heading mw-heading2"><h2 id="Combat_stats">Combat stats</h2></div>
<table class="infobox infobox-bonuses">
  <tr><th><img alt="Stab icon.png"></th><th><img alt="Slash icon.png"></th><th><img alt="Crush icon.png"></th></tr>
  <tr><td>0</td><td>+82</td><td>0</td></tr>
</table>
<h2><span class="mw-headline" id="Drop_sources">Drop sources</span><span class="mw-editsection">[edit]</span></h2>
<table class="wikitable sortable item-drops">
  <thead><tr><th colspan="2">Item</th><th>Quantity</th><th>Rarity</th></tr></thead>
  <tbody>
    <tr><td class="inventory-image"><img alt="Abyssal whip 5.png"></td><td><a>Abyssal whip</a></td><td>1</td><td><span data-drop-fraction="1/512">1/512</span></td></tr>
    <tr><td class="inventory-image"><img alt="Coins.png"></td><td>Coins</td><td>132</td><td>1/4</td></tr>
  </tbody>
</table>
<div class="mw-heading mw-heading3"><h3 id="Special_attack">Special attack</h3></div>
<ul>
  <li>Energy Drain
    <ul><li>Drains 10% of the target's run energy</li></ul>
  </li>
  <li>Costs 50% special</li>
</ul>
<div class="mw-heading mw-heading2"><h2 id="Trivia">Trivia</h2></div>
<ol><li>First &amp; best whip.</li></ol>
<table class="navbox"><tr><td>Huge navbox of every weapon</td></tr></table>
<div class="mw-references-wrap"><ol class="references"><li>Citation text</li></ol></div>
</div>`;

const parsed = parsePage(HTML);
const page: WikiPage = {
	...parsed,
	title: 'Abyssal whip',
	revid: 1,
	url: 'https://oldschool.runescape.wiki/w/Abyssal_whip'
};

describe('parsePage', () => {
	test('extracts the infobox as key: value lines', () => {
		expect(parsed.infobox).toBe(
			['[Abyssal whip]', 'Released: 26 January 2005', 'Members: Yes', 'Tradeable: Yes', 'Weight: 0.453 kg'].join('\n')
		);
	});

	test('lead text is clean and noise-free', () => {
		const lead = parsed.sections[0].text;
		expect(lead).toContain('For the tentacle, see Abyssal tentacle.');
		expect(lead).toContain('Versions: Normal, Frozen (showing Normal)');
		expect(lead).toContain('The abyssal whip is a one-handed melee weapon that requires 70 Attack to wield.');
		expect(lead).not.toContain('[1]');
		expect(lead).not.toContain('hidden');
		expect(lead).not.toContain('HIDDEN DATA');
	});

	test('splits sections across both heading markups', () => {
		expect(parsed.sections.map((s) => [s.index, s.level, s.title])).toEqual([
			[0, 1, '(lead)'],
			[1, 2, 'Combat stats'],
			[2, 2, 'Drop sources'],
			[3, 3, 'Special attack'],
			[4, 2, 'Trivia']
		]);
		expect(parsed.sections[2].title).not.toContain('edit');
	});

	test('icon headers use alt text', () => {
		expect(parsed.sections[1].text).toBe('Stab | Slash | Crush\n0 | +82 | 0');
	});

	test('data tables drop image-only columns', () => {
		expect(parsed.sections[2].text).toBe('Item | Quantity | Rarity\nAbyssal whip | 1 | 1/512\nCoins | 132 | 1/4');
	});

	test('nested lists keep indentation', () => {
		expect(parsed.sections[3].text).toBe("- Energy Drain\n  - Drains 10% of the target's run energy\n- Costs 50% special");
	});

	test('navboxes and references are removed', () => {
		expect(parsed.sections[4].text).toBe('1. First & best whip.');
	});
});

describe('format', () => {
	test('overview lists sections with sizes, nested by level', () => {
		const out = formatOverview(page);
		expect(out).toContain('# Abyssal whip\nhttps://oldschool.runescape.wiki/w/Abyssal_whip · rev 1');
		expect(out).toMatch(/\n1\. Combat stats \(~\d+ tok\)/);
		expect(out).toMatch(/\n {2}3\. Special attack \(~\d+ tok\)/);
		expect(out).not.toContain('Abyssal whip | 1 | 1/512');
	});

	test('section lookup by number, exact, prefix, substring', () => {
		expect(findSection(page.sections, '4')?.title).toBe('Trivia');
		expect(findSection(page.sections, 'drop sources')?.title).toBe('Drop sources');
		expect(findSection(page.sections, 'drop')?.title).toBe('Drop sources');
		expect(findSection(page.sections, 'special')?.title).toBe('Special attack');
	});

	test('reading a section includes its subsections', () => {
		const out = formatSections(page, ['Drop sources']);
		expect(out).toContain('## Drop sources');
		expect(out).toContain('### Special attack');
		expect(out).not.toContain('Trivia');
	});

	test('missing section lists alternatives', () => {
		expect(formatSections(page, ['Shop locations'])).toContain('Available: 1. Combat stats, 2. Drop sources');
	});

	test('paginate cuts on a line and points at the next offset', () => {
		const text = Array.from({ length: 100 }, (_, i) => `line ${i}`).join('\n');
		const first = paginate(text, 0, 100);
		const m = /offset=(\d+)/.exec(first);
		expect(m).not.toBeNull();
		expect(first.split('\n\n[')[0].endsWith('\n')).toBe(false);
		const next = paginate(text, Number(m![1]), 100000);
		expect(next).toContain('line 99');
		expect(paginate('short', 0, 100)).toBe('short');
	});

	test('item matching: exact, id, and partial', () => {
		const mapping = [
			{ id: 4151, name: 'Abyssal whip', members: true },
			{ id: 2434, name: 'Prayer potion(4)', members: true },
			{ id: 139, name: 'Prayer potion(3)', members: true },
			{ id: 1, name: 'Super prayer potion(4)', members: true }
		];
		expect(matchItems(mapping, 'abyssal WHIP').items.map((i) => i.id)).toEqual([4151]);
		expect(matchItems(mapping, '4151').items.map((i) => i.id)).toEqual([4151]);
		expect(matchItems(mapping, 'prayer potion').items.map((i) => i.id)).toEqual([2434, 139, 1]);
	});
});

describe('dropTrailingNavboxes', () => {
	test('cuts navboxes after the last heading, keeps earlier ones', async () => {
		const { dropTrailingNavboxes } = await import('../src/html');
		const tail = '<h2>A</h2><p>x</p><table class="wikitable navbox">nav</table><p>after</p>';
		expect(dropTrailingNavboxes(tail)).toBe('<h2>A</h2><p>x</p>');
		const early = '<div class="navbox">n</div><h2>A</h2><p>x</p>';
		expect(dropTrailingNavboxes(early)).toBe(early);
		expect(dropTrailingNavboxes(HTML)).not.toContain('Huge navbox');
	});
});
