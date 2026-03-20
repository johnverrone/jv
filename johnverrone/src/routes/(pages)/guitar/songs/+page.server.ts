const API = 'https://hobbies.johnverrone.workers.dev';

export async function load({ fetch }) {
	const res = await fetch(`${API}/guitar/songs`);
	const { songs } = await res.json();
	return { songs };
}
