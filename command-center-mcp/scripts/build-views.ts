// Bundles each views/<name>.ts into a single self-contained dist/views/<name>.html
// (MCP Apps hosts render the resource in a sandboxed iframe with no network
// access by default, so JS and CSS must be inlined). The worker imports these
// files as text — see src/ui.ts. Runs automatically before `wrangler dev` /
// `wrangler deploy` via the build command in wrangler.jsonc.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const VIEWS = ['today', 'plan', 'songs'];
const root = join(import.meta.dir, '..');
const outDir = join(root, 'dist/views');

const css = await readFile(join(root, 'views/styles.css'), 'utf8');
await mkdir(outDir, { recursive: true });

for (const name of VIEWS) {
	const result = await Bun.build({
		entrypoints: [join(root, `views/${name}.ts`)],
		target: 'browser',
		format: 'esm',
		minify: true
	});
	if (!result.success) {
		for (const log of result.logs) console.error(log);
		process.exit(1);
	}
	// Keep "</script" out of the inline bundle so it can't close the tag early.
	const js = (await result.outputs[0].text()).replaceAll('</script', '<\\/script');
	const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>${css}</style>
</head>
<body>
<div id="root"><p class="muted">Loading…</p></div>
<script type="module">${js}</script>
</body>
</html>
`;
	await writeFile(join(outDir, `${name}.html`), html);
	console.log(`views: dist/views/${name}.html (${(html.length / 1024).toFixed(0)} KB)`);
}
