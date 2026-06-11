/**
 * One-time: copy portfolio photos from the public GCS bucket into the
 * johnverrone-photos R2 bucket. No credentials needed — the bucket allows
 * anonymous object listing AND read, so this lists via the GCS JSON API and
 * downloads public object URLs (same approach as migrate-coffee). The R2 key is
 * the object name minus the `portfolio-photos/` prefix (the bucket is the
 * category).
 *
 *   bun run migrate:photos             # local r2 (default)
 *   bun run migrate:photos --remote    # deployed r2 (go-live)
 *   bun run migrate:photos --dry-run   # list only, copy nothing
 *
 * Resilient: uploads retry; a persistently-failing one is skipped (re-runnable).
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const GCS_BUCKET = 'johnverrone';
const SRC_PREFIX = 'portfolio-photos/';
const DST_BUCKET = 'johnverrone-photos';
const PUBLIC = `https://storage.googleapis.com/${GCS_BUCKET}`;
const LIST_API = `https://storage.googleapis.com/storage/v1/b/${GCS_BUCKET}/o`;

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const target = args.has('--remote') ? '--remote' : '--local';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** List portfolio-photo object names via the public GCS JSON API (paginated). */
async function listNames(): Promise<string[]> {
	const names: string[] = [];
	let pageToken: string | undefined;
	do {
		const url = new URL(LIST_API);
		url.searchParams.set('prefix', SRC_PREFIX);
		url.searchParams.set('maxResults', '1000');
		if (pageToken) url.searchParams.set('pageToken', pageToken);
		const res = await fetch(url);
		if (!res.ok) throw new Error(`GCS list failed: ${res.status}`);
		const data = await res.json();
		for (const o of data.items ?? []) if (o.name.endsWith('.jpg')) names.push(o.name);
		pageToken = data.nextPageToken;
	} while (pageToken);
	return names.sort((a, b) => b.localeCompare(a));
}

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

async function main() {
	const names = await listNames();
	console.log(`${names.length} photos under ${SRC_PREFIX} -> ${dryRun ? 'DRY RUN' : `${DST_BUCKET} (${target})`}`);

	let skipped = 0;
	for (const name of names) {
		const key = name.slice(SRC_PREFIX.length);
		if (dryRun) {
			console.log(`  ${name} -> ${DST_BUCKET}/${key}`);
			continue;
		}
		const srcUrl = `${PUBLIC}/${name.split('/').map(encodeURIComponent).join('/')}`;
		const res = await fetch(srcUrl);
		if (!res.ok) {
			console.warn(`  ✗ download ${res.status}: ${name}`);
			skipped++;
			continue;
		}
		const tmp = join(mkdtempSync(join(tmpdir(), 'mig-photos-')), key);
		writeFileSync(tmp, Buffer.from(await res.arrayBuffer()));
		if (await wrangler(['r2', 'object', 'put', `${DST_BUCKET}/${key}`, `--file=${tmp}`, '--content-type=image/jpeg', target])) {
			console.log(`  ✓ ${key}`);
		} else {
			console.warn(`  ✗ upload failed (re-run): ${key}`);
			skipped++;
		}
	}
	console.log(`done — ${names.length - skipped}/${names.length} copied${skipped ? `, ${skipped} skipped` : ''}.`);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
