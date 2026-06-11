/**
 * One-time: migrate coffee beans + roasters from the legacy `hobbies` Worker
 * (YAML-backed JSON API) into D1, and their images from GCS into the
 * johnverrone-coffee R2 bucket.
 *
 *   bun run migrate:coffee             # apply to LOCAL d1/r2 (default)
 *   bun run migrate:coffee --remote    # apply to the deployed d1/r2 (go-live)
 *   bun run migrate:coffee --dry-run   # print the SQL + image ops, write nothing
 *
 * Resilient: image uploads retry, and a persistently-failing image is skipped
 * (that bean gets no image_key) so the run still completes. Idempotent —
 * INSERT OR REPLACE keyed by slug; re-run to fill in any skipped images.
 * Reads from $HOBBIES_API_BASE (default https://hobbies.johnverrone.workers.dev).
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const HOBBIES = process.env.HOBBIES_API_BASE ?? 'https://hobbies.johnverrone.workers.dev';
const BUCKET = 'johnverrone-coffee';
const DB = 'command-center';

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const target = args.has('--remote') ? '--remote' : '--local';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** SQL string literal (or NULL), single-quote escaped. */
const s = (v: unknown) => (v == null || v === '' ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`);
/** SQL integer literal (or NULL). */
const n = (v: unknown) => (v == null || v === '' ? 'NULL' : String(Number(v)));

/** Run a wrangler command with retries (the remote R2/D1 calls are flaky). */
async function wrangler(cmd: string[], retries = 4): Promise<boolean> {
	if (dryRun) {
		console.log('  $ wrangler ' + cmd.join(' '));
		return true;
	}
	for (let attempt = 1; attempt <= retries; attempt++) {
		try {
			execFileSync('wrangler', cmd, { stdio: 'pipe' });
			return true;
		} catch {
			if (attempt < retries) await sleep(attempt * 1500);
		}
	}
	return false;
}

/** Download a (public GCS) image and put it in the coffee bucket; returns the key, or null on failure. */
async function migrateImage(srcUrl: string, key: string): Promise<string | null> {
	if (dryRun) {
		console.log(`  [dry] ${srcUrl} -> ${BUCKET}/${key}`);
		return key;
	}
	let res: Response;
	try {
		res = await fetch(srcUrl);
	} catch {
		console.warn(`  ✗ download failed: ${srcUrl}`);
		return null;
	}
	if (!res.ok) {
		console.warn(`  ✗ download ${res.status}: ${srcUrl}`);
		return null;
	}
	const tmp = join(mkdtempSync(join(tmpdir(), 'mig-coffee-')), key);
	writeFileSync(tmp, Buffer.from(await res.arrayBuffer()));

	if (await wrangler(['r2', 'object', 'put', `${BUCKET}/${key}`, `--file=${tmp}`, '--content-type=image/jpeg', target])) {
		console.log(`  ✓ ${key}`);
		return key;
	}
	console.warn(`  ✗ upload failed (will re-run): ${key}`);
	return null;
}

async function main() {
	console.log(`coffee → ${dryRun ? 'DRY RUN' : target} (source: ${HOBBIES})`);

	const [roasters, beans] = await Promise.all([
		fetch(`${HOBBIES}/coffee/roasters`).then((r) => r.json()),
		fetch(`${HOBBIES}/coffee/beans`).then((r) => r.json())
	]);
	if (!Array.isArray(roasters) || !Array.isArray(beans)) {
		throw new Error('Unexpected response from hobbies Worker (expected arrays).');
	}
	console.log(`fetched ${roasters.length} roasters, ${beans.length} beans`);

	const stmts: string[] = [];
	let skipped = 0;

	// Roasters first (beans FK-reference them by slug).
	for (const r of roasters) {
		const imageKey = r.image_url ? await migrateImage(r.image_url, `roaster-${r.slug}.jpg`) : null;
		if (r.image_url && !imageKey) skipped++;
		stmts.push(
			`INSERT OR REPLACE INTO coffee_roaster (slug,name,location,website,notes,image_key) VALUES (` +
				`${s(r.slug)},${s(r.name)},${s(r.location)},${s(r.website)},${s(r.notes)},${s(imageKey)});`
		);
	}

	for (const b of beans) {
		const imageKey = b.image_url ? await migrateImage(b.image_url, `${b.slug}.jpg`) : null;
		if (b.image_url && !imageKey) skipped++;
		const cents = b.price_12oz == null ? null : Math.round(Number(b.price_12oz) * 100);
		stmts.push(
			`INSERT OR REPLACE INTO coffee_bean (slug,name,roaster_slug,rating,origins,flavors,process,single_origin,currently_brewing,price_12oz_cents,notes,image_key,visibility,created_at) VALUES (` +
				`${s(b.slug)},${s(b.name)},${s(b.roaster)},${n(b.rating)},` +
				`${s(JSON.stringify(b.origins ?? []))},${s(JSON.stringify(b.flavors ?? []))},` +
				`${s(b.process)},${b.single_origin ? 1 : 0},${b.currently_brewing ? 1 : 0},` +
				`${cents == null ? 'NULL' : cents},${s(b.notes)},${s(imageKey)},'published',${s(b.created)});`
		);
	}

	const sql = stmts.join('\n');
	if (dryRun) {
		console.log('\n--- SQL ---\n' + sql);
		return;
	}

	const sqlFile = join(mkdtempSync(join(tmpdir(), 'mig-coffee-')), 'coffee-seed.sql');
	writeFileSync(sqlFile, sql);
	if (!(await wrangler(['d1', 'execute', DB, `--file=${sqlFile}`, target], 3))) {
		throw new Error('d1 execute failed after retries — rows not written.');
	}
	console.log(`done — ${roasters.length} roasters, ${beans.length} beans${skipped ? `, ${skipped} images skipped (re-run to fill)` : ''}.`);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
