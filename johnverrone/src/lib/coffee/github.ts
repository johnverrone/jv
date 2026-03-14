import { dev } from '$app/environment';

const REPO_OWNER = 'johnverrone';
const REPO_NAME = 'hobbies';
const API = 'https://api.github.com';

function headers(token: string) {
	return {
		Authorization: `Bearer ${token}`,
		Accept: 'application/vnd.github+json',
		'Content-Type': 'application/json'
	};
}

async function ghFetch(token: string, path: string, init?: RequestInit) {
	const res = await fetch(`${API}${path}`, {
		...init,
		headers: { ...headers(token), ...init?.headers }
	});
	if (!res.ok) {
		const body = await res.text();
		throw new Error(`GitHub API error ${res.status}: ${body}`);
	}
	return res.json();
}

export async function createCoffeeBeanPR(
	token: string,
	slug: string,
	yamlContent: string,
	name: string
): Promise<string> {
	if (dev) {
		console.log(`[DEV] Would create PR "Add coffee bean: ${name}"`);
		console.log(`[DEV] File: hobbies/coffee/beans/${slug}.yaml`);
		console.log(`[DEV] YAML content:\n${yamlContent}`);
		return `https://github.com/${REPO_OWNER}/${REPO_NAME}/pull/dev-preview`;
	}

	// 1. Get SHA of main HEAD
	const ref = await ghFetch(token, `/repos/${REPO_OWNER}/${REPO_NAME}/git/ref/heads/main`);
	const mainSha = ref.object.sha;

	// 2. Create branch
	const branchName = `coffee/add-${slug}`;
	await ghFetch(token, `/repos/${REPO_OWNER}/${REPO_NAME}/git/refs`, {
		method: 'POST',
		body: JSON.stringify({
			ref: `refs/heads/${branchName}`,
			sha: mainSha
		})
	});

	// 3. Create/update file on branch
	const filePath = `hobbies/coffee/beans/${slug}.yaml`;
	const content = btoa(unescape(encodeURIComponent(yamlContent)));
	await ghFetch(token, `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`, {
		method: 'PUT',
		body: JSON.stringify({
			message: `Add coffee bean: ${name}`,
			content,
			branch: branchName
		})
	});

	// 4. Open PR
	const pr = await ghFetch(token, `/repos/${REPO_OWNER}/${REPO_NAME}/pulls`, {
		method: 'POST',
		body: JSON.stringify({
			title: `Add coffee bean: ${name}`,
			head: branchName,
			base: 'main',
			body: `Adds new coffee bean **${name}** via johnverrone.com/coffee/new`
		})
	});

	return pr.html_url;
}
