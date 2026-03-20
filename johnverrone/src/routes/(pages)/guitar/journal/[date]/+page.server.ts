import { error } from '@sveltejs/kit';

const API = 'https://hobbies.johnverrone.workers.dev';

export async function load({ fetch, params }) {
	const res = await fetch(`${API}/guitar/journal/${params.date}`);
	if (!res.ok) {
		error(404, 'Journal entry not found');
	}
	const entry = await res.json();
	return { entry };
}
