import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	try {
		const post = await import(`../../../../posts/${params.slug}.md`);

		if (!post || !post.metadata.published) {
			throw new Error('not published');
		}

		return {
			content: post.default,
			meta: post.metadata
		};
	} catch (e) {
		error(404, `${params.slug} not found`);
	}
};
