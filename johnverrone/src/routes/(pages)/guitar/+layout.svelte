<script lang="ts">
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();

	const NAV_ITEMS = [
		{ href: '/guitar/journal', label: 'Journal' },
		{ href: '/guitar/plan', label: 'Practice Plan' },
		{ href: '/guitar/songs', label: 'Songs' }
	];

	const isActive = (href: string) => {
		const path = page.url.pathname;
		return path === href || path.startsWith(href + '/');
	};
</script>

<div class="guitar-layout">
	<nav class="sidebar">
		<a href="/notes" class="back">&larr; notes</a>
		<ul>
			{#each NAV_ITEMS as item}
				<li>
					<a href={item.href} class:active={isActive(item.href)}>
						{item.label}
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	<main class="content">
		{@render children?.()}
	</main>
</div>

<style>
	.guitar-layout {
		display: flex;
		gap: 2rem;
		max-width: 100%;
	}

	.sidebar {
		position: sticky;
		top: 5rem;
		align-self: flex-start;
		min-width: 160px;
		padding-top: 0.5rem;
	}

	.sidebar .back {
		display: block;
		font-size: 0.8125rem;
		color: var(--color-text-secondary);
		text-decoration: none;
		margin-bottom: 1.5rem;
	}

	.sidebar .back:hover {
		color: var(--color-accent);
	}

	.sidebar ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.sidebar a {
		display: block;
		padding: 0.375rem 0.75rem;
		border-radius: var(--border-radius);
		text-decoration: none;
		color: var(--color-text-secondary);
		font-size: 0.875rem;
		font-family: var(--font-family-mono);
		transition: color 0.15s, background-color 0.15s;
	}

	.sidebar a:hover {
		color: var(--color-text-primary);
		background-color: var(--color-background-secondary);
	}

	.sidebar a.active {
		color: var(--color-text-primary);
		font-weight: 600;
		background-color: var(--color-background-secondary);
	}

	.content {
		flex: 1;
		min-width: 0;
	}

	@media screen and (max-width: 40rem) {
		.guitar-layout {
			flex-direction: column;
			gap: 1rem;
		}

		.sidebar {
			position: static;
			min-width: unset;
			border-bottom: 1px solid var(--color-background-secondary);
			padding-bottom: 1rem;
		}

		.sidebar ul {
			flex-direction: row;
			gap: 0.5rem;
		}

		.sidebar .back {
			margin-bottom: 0.75rem;
		}
	}
</style>
