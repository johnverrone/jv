const API = 'https://hobbies.johnverrone.workers.dev';

export async function load({ fetch }) {
	const [progress, plan] = await Promise.all([
		fetch(`${API}/guitar/progress`).then((r) => r.json()),
		fetch(`${API}/guitar/plan`).then((r) => r.json())
	]);

	return { progress: progress.content, plan: plan.content };
}
