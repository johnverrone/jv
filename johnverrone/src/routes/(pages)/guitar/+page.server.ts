const API = 'https://hobbies.johnverrone.workers.dev';

export async function load({ fetch }) {
	const [progress, plan, songs] = await Promise.all([
		fetch(`${API}/guitar/progress`).then((r) => r.json()),
		fetch(`${API}/guitar/plan`).then((r) => r.json()),
		fetch(`${API}/guitar/songs`).then((r) => r.json())
	]);

	return { progress: progress.content, plan: plan.content, songs: songs.songs };
}
