<script lang="ts">
	import { page } from '$app/state';
	import { slide } from 'svelte/transition';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	interface Props {
		children?: Snippet;
		data: LayoutData;
	}

	let { children, data }: Props = $props();

	const APP_MENU_ITEMS = [
		{ slug: '/admin/coach', name: 'coach' },
		{ slug: '/admin/gear', name: 'gear' },
		{ slug: '/admin/photos', name: 'photos' },
		{ slug: '/admin/coffee', name: 'coffee' },
		{ slug: '/admin/guitar', name: 'guitar' }
	];

	const isActive = (slug: string) =>
		page.url.pathname === slug || page.url.pathname.startsWith(`${slug}/`);

	let mobileOpen = $state(false);

	// Close the mobile panel on navigation.
	$effect(() => {
		page.url.pathname;
		mobileOpen = false;
	});
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
		<button
			class="cc-toggle"
			aria-label={mobileOpen ? 'close menu' : 'open menu'}
			aria-expanded={mobileOpen}
			onclick={() => (mobileOpen = !mobileOpen)}
		>
			{mobileOpen ? '✕' : '☰'}
		</button>
	</header>

	{#if mobileOpen}
		<nav class="cc-mobile-nav" transition:slide={{ duration: 150 }}>
			{#each APP_MENU_ITEMS as item (item.slug)}
				<a href={item.slug} class:active={isActive(item.slug)}>{item.name}</a>
			{/each}
			<div class="cc-mobile-footer">
				<span class="cc-user">@{data.user.login}</span>
				<a class="cc-logout" href="/auth/logout">logout</a>
			</div>
		</nav>
	{/if}

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

	.cc-toggle {
		display: none;
		margin-left: auto;
		background: none;
		border: none;
		color: var(--color-card-fg);
		font-size: 1.25rem;
		line-height: 1;
		padding: 0.25rem 0.4rem;
		cursor: pointer;
	}

	.cc-mobile-nav {
		display: none;
		flex-direction: column;
		position: sticky;
		top: 2.9rem;
		z-index: 1;
		background: var(--color-card-bg);
		color: var(--color-card-fg);
		font-family: var(--font-family-mono);
		font-size: 0.9rem;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.cc-mobile-nav a {
		color: var(--color-card-fg);
		text-decoration: none;
		opacity: 0.8;
		padding: 0.85rem 1.5rem;
	}

	.cc-mobile-nav a:active,
	.cc-mobile-nav a.active {
		opacity: 1;
		background: rgba(255, 255, 255, 0.06);
	}

	.cc-mobile-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.85rem 1.5rem;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
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

	/* Below 40rem: collapse the inline nav into the hamburger panel. */
	@media screen and (max-width: 39.99rem) {
		.cc-nav {
			display: none;
		}
		.cc-toggle {
			display: block;
		}
		.cc-mobile-nav {
			display: flex;
		}
	}
</style>
