import { loadQuery } from '$lib/sanity';
import type { SanityDocument } from '@sanity/client';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const { data: post } = await loadQuery<SanityDocument>({
		query: `*[_type == "post" && slug.current == $slug][0]`,
		params
	});

	if (!post) {
		return redirect(302, '/');
	}

	return {
		post
	};
};
