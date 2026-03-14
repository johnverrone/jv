import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Anthropic from '@anthropic-ai/sdk';
import { env } from '$env/dynamic/private';
import { getAllRoasters } from '$lib/coffee/api';
import { normalizeImage } from '$lib/coffee/image';
import type { ParsedCoffeeBean } from '$lib/coffee/types';

let client: Anthropic | null = null;

function getClient(): Anthropic {
	if (!client) {
		client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
	}
	return client;
}

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.authenticated) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	if (!env.ANTHROPIC_API_KEY) {
		return json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
	}

	const formData = await request.formData();
	const imageFile = formData.get('image') as File | null;
	const context = (formData.get('context') as string) || '';

	if (!imageFile || imageFile.size === 0) {
		return json({ error: 'Image is required' }, { status: 400 });
	}

	const [roasters, rawBuffer] = await Promise.all([
		getAllRoasters(),
		imageFile.arrayBuffer().then((ab) => Buffer.from(ab))
	]);
	const roasterList = roasters.map((r) => `${r.name} (slug: ${r.slug})`).join('\n');

	const { data: imageData, mediaType } = await normalizeImage(rawBuffer, imageFile.type);
	const base64Image = imageData.toString('base64');

	const prompt = `You are analyzing a photo of a coffee bag to extract details. Return ONLY a JSON object with these fields:

- name (string): the coffee name
- roaster (string): the roaster slug from the list below — pick the best match
- rating (number|null): null (user will set this later)
- origins (string[]): countries/regions of origin
- flavors (string[]): tasting notes / flavor descriptors
- process (string): processing method (e.g. "Washed", "Natural", "Honey")
- single_origin (boolean): true if single origin, false if blend
- currently_brewing (boolean): false
- price_12oz (number|null): price for 12oz if visible, else null
- notes (string): any other interesting details from the bag

Known roasters:
${roasterList}

${context ? `Additional context from user: ${context}` : ''}

Return ONLY valid JSON, no markdown fences, no explanation.`;

	const response = await getClient().messages.create({
		model: 'claude-sonnet-4-6',
		max_tokens: 1024,
		messages: [
			{
				role: 'user',
				content: [
					{
						type: 'image',
						source: { type: 'base64', media_type: mediaType, data: base64Image }
					},
					{ type: 'text', text: prompt }
				]
			}
		]
	});

	const textBlock = response.content.find((b) => b.type === 'text');
	if (!textBlock) {
		return json({ error: 'No response from Claude' }, { status: 500 });
	}

	try {
		const parsed: ParsedCoffeeBean = JSON.parse(textBlock.text);
		return json({ bean: parsed });
	} catch {
		return json({ error: 'Failed to parse Claude response', raw: textBlock.text }, { status: 500 });
	}
};
