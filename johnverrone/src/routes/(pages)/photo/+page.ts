import supabase from '$lib/supabase';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async () => {
	const { data, error: supabaseErr } = await supabase.storage.from('portfolio').list(undefined, {
		sortBy: { column: 'name', order: 'desc' }
	});

	if (supabaseErr) {
		console.error(supabaseErr.message);
		error(500, 'failed to fetch images from supabase');
	}

	const photos = data.map((i) => {
		const { data: imageUrl } = supabase.storage.from('portfolio').getPublicUrl(i.name);
		return imageUrl.publicUrl;
	});

	return {
		photos
	};
};
