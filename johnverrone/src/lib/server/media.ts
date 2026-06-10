import type { R2Bucket } from '@cloudflare/workers-types';

/** All portfolio photos live under this R2 prefix. */
export const PHOTO_PREFIX = 'portfolio-photos/';

/** List portfolio photo keys, newest first (keys are timestamp-prefixed). */
export async function listPhotos(bucket: R2Bucket): Promise<string[]> {
	const keys: string[] = [];
	let cursor: string | undefined;
	do {
		const res = await bucket.list({ prefix: PHOTO_PREFIX, cursor });
		for (const obj of res.objects) keys.push(obj.key);
		cursor = res.truncated ? res.cursor : undefined;
	} while (cursor);
	return keys.sort((a, b) => b.localeCompare(a));
}

/** Store an image under the photo prefix; returns the generated key. */
export async function putPhoto(
	bucket: R2Bucket,
	data: ArrayBuffer,
	originalName: string,
	contentType: string
): Promise<string> {
	const key = `${PHOTO_PREFIX}${photoKey(originalName)}`;
	await bucket.put(key, data, { httpMetadata: { contentType } });
	return key;
}

/** Delete a photo. Guards against deleting anything outside the photo prefix. */
export async function deletePhoto(bucket: R2Bucket, key: string): Promise<void> {
	if (!key.startsWith(PHOTO_PREFIX)) {
		throw new Error(`refusing to delete key outside ${PHOTO_PREFIX}: ${key}`);
	}
	await bucket.delete(key);
}

function photoKey(originalName: string): string {
	const ts = new Date().toISOString().replace(/[:.]/g, '').replace('T', 'T').slice(0, 15);
	const base =
		originalName
			.replace(/\.[^.]+$/, '')
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '')
			.slice(0, 40) || 'photo';
	return `${ts}-${base}.jpg`;
}
