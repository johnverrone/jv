<script lang="ts">
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();

	const TABS = [
		{ slug: '/admin/coach', name: 'home' },
		{ slug: '/admin/coach/metrics', name: 'metrics' },
		{ slug: '/admin/coach/history', name: 'history' },
		{ slug: '/admin/coach/sync', name: 'sync' }
	];

	const isActive = (slug: string) =>
		slug === '/admin/coach' ? page.url.pathname === slug : page.url.pathname.startsWith(slug);
</script>

<nav class="tabs">
	{#each TABS as tab (tab.slug)}
		<a href={tab.slug} class:active={isActive(tab.slug)}>{tab.name}</a>
	{/each}
</nav>

{@render children?.()}

<style>
	.tabs {
		display: flex;
		gap: 0.25rem;
		margin-bottom: 1.5rem;
		overflow-x: auto;
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
	}

	.tabs a {
		padding: 0.35rem 0.75rem;
		border-radius: 999px;
		text-decoration: none;
		color: var(--color-text-secondary);
		white-space: nowrap;
	}

	.tabs a:hover {
		color: var(--color-text-primary);
	}

	.tabs a.active {
		background: var(--color-card-bg);
		color: var(--color-card-fg);
	}
</style>
