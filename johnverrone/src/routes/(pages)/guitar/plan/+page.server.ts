const API = 'https://hobbies.johnverrone.workers.dev';

export async function load({ fetch }) {
	const res = await fetch(`${API}/guitar/plan`);
	const { content } = await res.json();
	return { plan: content };
}
