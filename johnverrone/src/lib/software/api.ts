import { HOBBIES_API_BASE } from '$lib/api/base';
import type { SoftwareIdea, SoftwareProject } from './types';

const API_BASE = `${HOBBIES_API_BASE}/software`;

export async function getProjects(fetch: typeof globalThis.fetch): Promise<SoftwareProject[]> {
	const res = await fetch(`${API_BASE}/projects`);
	if (!res.ok) throw new Error('Failed to fetch software projects');
	const { projects } = await res.json();
	return projects;
}

export async function getSkills(fetch: typeof globalThis.fetch): Promise<string[]> {
	const res = await fetch(`${API_BASE}/skills`);
	if (!res.ok) throw new Error('Failed to fetch software skills');
	const { skills } = await res.json();
	return skills;
}

export async function getIdeas(fetch: typeof globalThis.fetch): Promise<SoftwareIdea[]> {
	const res = await fetch(`${API_BASE}/ideas`);
	if (!res.ok) throw new Error('Failed to fetch software ideas');
	const { ideas } = await res.json();
	return ideas;
}
