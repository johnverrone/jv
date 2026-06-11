/**
 * One-time: copy portfolio photos from the GCS bucket into the johnverrone-photos
 * R2 bucket. The R2 key is the GCS object name minus the `portfolio-photos/`
 * prefix (the bucket is the category now).
 *
 * Requires GCS_CREDENTIALS (service-account JSON) in the env — same value the
 * old app used. @google-cloud/storage is a devDependency used only by this
 * script; it is never bundled into the Worker.
 *
 *   GCS_CREDENTIALS=... bun run migrate:photos            # local r2 (default)
 *   GCS_CREDENTIALS=... bun run migrate:photos --remote   # deployed r2 (go-live)
 *   GCS_CREDENTIALS=... bun run migrate:photos --dry-run  # list only, copy nothing
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { Storage } from '@google-cloud/storage';

const SRC_BUCKET = 'johnverrone';
const SRC_PREFIX = 'portfolio-photos/';
const DST_BUCKET = 'johnverrone-photos';

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const target = args.has('--remote') ? '--remote' : '--local';

async function main() {
	if (!process.env.GCS_CREDENTIALS) {
		throw new Error('GCS_CREDENTIALS env var is required (the GCS service-account JSON).');
	}
	const credentials = JSON.parse(process.env.GCS_CREDENTIALS.replace(/\n/g, '\\n'));
	const storage = new Storage({ credentials });

	const [files] = await storage.bucket(SRC_BUCKET).getFiles({ prefix: SRC_PREFIX });
	const jpgs = files.filter((f) => f.name.endsWith('.jpg'));
	console.log(
		`${jpgs.length} photos under ${SRC_PREFIX} -> ${dryRun ? 'DRY RUN' : `${DST_BUCKET} (${target})`}`
	);

	for (const f of jpgs) {
		const key = f.name.slice(SRC_PREFIX.length); // drop the prefix
		if (dryRun) {
			console.log(`  ${f.name} -> ${DST_BUCKET}/${key}`);
			continue;
		}
		const [buf] = await f.download();
		const tmp = join(mkdtempSync(join(tmpdir(), 'mig-photos-')), key);
		writeFileSync(tmp, buf);
		execFileSync(
			'wrangler',
			['r2', 'object', 'put', `${DST_BUCKET}/${key}`, `--file=${tmp}`, '--content-type=image/jpeg', target],
			{ stdio: 'inherit' }
		);
		console.log(`  ✓ ${key}`);
	}
	console.log('done.');
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
