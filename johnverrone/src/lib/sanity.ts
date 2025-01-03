import { createClient, type QueryParams } from '@sanity/client';
import {
	PUBLIC_SANITY_API_VERSION,
	PUBLIC_SANITY_DATASET,
	PUBLIC_SANITY_PROJECT_ID,
	PUBLIC_SANITY_STUDIO_URL
} from '$env/static/public';

export const client = createClient({
	projectId: PUBLIC_SANITY_PROJECT_ID,
	dataset: PUBLIC_SANITY_DATASET,
	apiVersion: PUBLIC_SANITY_API_VERSION,
	useCdn: true,
	stega: {
		studioUrl: PUBLIC_SANITY_STUDIO_URL
	}
});

export async function loadQuery<QueryResponse>({
	query,
	params
}: {
	query: string;
	params?: QueryParams;
}) {
	const { result } = await client.fetch<QueryResponse>(query, params ?? {}, {
		filterResponse: false
	});

	return {
		data: result
	};
}
