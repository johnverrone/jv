<script lang="ts">
	import './widget.css';
	import type { SoftwareIdea, SoftwareProject } from '$lib/software/types';

	let { projects, ideas }: { projects: SoftwareProject[]; ideas: SoftwareIdea[] } = $props();

	const active = $derived(projects.filter((p) => p.status === 'Active'));
</script>

<div class="w-headline">{active.length} active <span class="w-unit">/ {projects.length} projects</span></div>
{#if ideas.length}
	<div class="w-meta w-dim">latest ideas</div>
	{#each ideas.slice(0, 3) as idea (idea.title)}
		<div class="w-meta">· {idea.title}</div>
	{/each}
{/if}
