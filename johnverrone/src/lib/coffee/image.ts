import sharp from 'sharp';
import convert from 'heic-convert';

type ImageMediaType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

function isHeic(buffer: Buffer, mimeType: string): boolean {
	if (mimeType === 'image/heic' || mimeType === 'image/heif') return true;
	if (buffer.length >= 12) {
		const ftyp = buffer.toString('ascii', 4, 8);
		if (ftyp === 'ftyp') {
			const brand = buffer.toString('ascii', 8, 12);
			if (['heic', 'heix', 'hevc', 'mif1'].includes(brand)) return true;
		}
	}
	return false;
}

async function convertHeic(buffer: Buffer): Promise<Buffer> {
	// @types/heic-convert incorrectly types buffer as ArrayBufferLike;
	// the library actually accepts Buffer | Uint8Array per its docs
	const converted = await convert({
		buffer: buffer as unknown as ArrayBufferLike,
		format: 'JPEG',
		quality: 0.85
	});
	return Buffer.from(converted);
}

/**
 * Normalize an image to JPEG: converts HEIC if needed, resizes to max dimension, outputs JPEG.
 */
export async function normalizeImage(
	buffer: Buffer,
	mimeType: string
): Promise<{ data: Buffer; mediaType: ImageMediaType }> {
	if (isHeic(buffer, mimeType)) {
		buffer = await convertHeic(buffer);
	}

	const image = sharp(buffer);
	const metadata = await image.metadata();

	let pipeline = image;
	const maxDim = 1500;
	if (metadata.width && metadata.width > maxDim) {
		pipeline = pipeline.resize({ width: maxDim, withoutEnlargement: true });
	} else if (metadata.height && metadata.height > maxDim) {
		pipeline = pipeline.resize({ height: maxDim, withoutEnlargement: true });
	}

	const data = await pipeline.jpeg({ quality: 85 }).toBuffer();
	return { data, mediaType: 'image/jpeg' as const };
}
