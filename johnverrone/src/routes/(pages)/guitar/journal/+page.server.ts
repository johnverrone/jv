const API = 'https://hobbies.johnverrone.workers.dev';

export async function load({ fetch }) {
	const res = await fetch(`${API}/guitar/journal`);
	const { entries } = await res.json();
	return { entries };
}
