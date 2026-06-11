import type { R2Bucket } from '@cloudflare/workers-types';

/** List all object keys in a bucket, newest-first (keys are timestamp-prefixed). */
export async function listKeys(bucket: R2Bucket): Promise<string[]> {
	const keys: string[] = [];
	let cursor: string | undefined;
	do {
		const res = await bucket.list({ cursor });
		for (const obj of res.objects) keys.push(obj.key);
		cursor = res.truncated ? res.cursor : undefined;
	} while (cursor);
	return keys.sort((a, b) => b.localeCompare(a));
}

export async function putObject(
	bucket: R2Bucket,
	key: string,
	data: ArrayBuffer,
	contentType: string
): Promise<string> {
	await bucket.put(key, data, { httpMetadata: { contentType } });
	return key;
}

export async function deleteObject(bucket: R2Bucket, key: string): Promise<void> {
	await bucket.delete(key);
}

/** A timestamped, slugified image key like "2026-06-10T2245-fjord.jpg". */
export function imageKey(originalName: string): string {
	const ts = new Date().toISOString().replace(/[:.]/g, '').slice(0, 15);
	const base =
		originalName
			.replace(/\.[^.]+$/, '')
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '')
			.slice(0, 40) || 'image';
	return `${ts}-${base}.jpg`;
}
