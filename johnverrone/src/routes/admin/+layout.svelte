<script lang="ts">
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	interface Props {
		children?: Snippet;
		data: LayoutData;
	}

	let { children, data }: Props = $props();

	const APP_MENU_ITEMS = [
		{ slug: '/admin/gear', name: 'gear' },
		{ slug: '/admin/photos', name: 'photos' }
	];

	const isActive = (slug: string) =>
		page.url.pathname === slug || page.url.pathname.startsWith(`${slug}/`);
</script>

<div class="cc">
	<header class="cc-header">
		<a class="cc-brand" href="/admin">command center</a>
		<a class="cc-brand" href="/">site</a>
		<nav class="cc-nav">
			{#each APP_MENU_ITEMS as item (item.slug)}
				<a href={item.slug} class:active={isActive(item.slug)}>{item.name}</a>
			{/each}
			<span class="cc-user">@{data.user.login}</span>
			<a class="cc-logout" href="/auth/logout">logout</a>
		</nav>
	</header>

	<main class="cc-main">
		{@render children?.()}
	</main>
</div>

<style>
	.cc {
		min-height: 100vh;
	}

	.cc-header {
		position: sticky;
		top: 0;
		z-index: 1;

		display: flex;
		align-items: center;
		gap: 1.5rem;
		padding: 0.75rem 1.5rem;

		background-color: var(--color-card-bg);
		color: var(--color-card-fg);
		font-family: var(--font-family-mono);
	}

	.cc-brand {
		color: var(--color-card-fg);
		text-decoration: none;
		font-weight: 600;
	}

	.cc-nav {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 1.25rem;
		font-size: 0.875rem;
	}

	.cc-nav a {
		color: var(--color-card-fg);
		text-decoration: none;
		opacity: 0.7;
	}

	.cc-nav a:hover,
	.cc-nav a.active {
		opacity: 1;
	}

	.cc-user {
		color: var(--color-card-fg);
		opacity: 0.5;
	}

	.cc-logout {
		color: var(--color-accent) !important;
	}

	.cc-main {
		max-width: 80rem;
		margin: 0 auto;
		padding: 1.5rem;
	}

	@media screen and (min-width: 40rem) {
		.cc-main {
			padding: 2.5rem;
		}
	}
</style>
