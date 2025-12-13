<script lang="ts">
	import { page } from '$app/state';
	import Menu from '$lib/components/Menu.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();

	const MENU_ITEMS = [
		{
			slug: '/dev',
			name: 'dev'
		},
		{
			slug: '/coffee',
			name: 'coffee'
		},
		{
			slug: '/notes',
			name: 'notes'
		},
		{
			slug: '/photo',
			name: 'photos'
		},
		{
			slug: '/video',
			name: 'videos'
		}
	];

	const currentPage = $derived(
		MENU_ITEMS.find((i) => page.route.id && page.route.id.startsWith(`/(pages)${i.slug}`))?.name
	);
</script>

<header>
	<div class="nav-container">
		<div class="page-title">
			<PageTitle href="/">johnverrone</PageTitle>
		</div>
		{#if currentPage}
			<hr class="divider" />
			<Menu menuItems={MENU_ITEMS} {currentPage} />
		{/if}
	</div>
</header>

<div class="app-container">
	{@render children?.()}
</div>

<style>
	.app-container {
		padding: 12px;
		margin: 0 auto;
		max-width: 80rem;
	}

	.divider {
		position: relative;
		top: 2px;
		align-self: center;
		height: 24px;
		margin: 0 8px;
		border: 1px solid;
		border-left-width: 0;
	}

	@media screen and (min-width: 40rem) {
		.app-container {
			padding: 3rem;
		}
	}

	header {
		position: sticky;
		top: 0;
		background-color: var(--color-background);
		z-index: 1;
	}

	.nav-container {
		margin: 0 auto;
		padding: 20px 0;
		width: 50%;
		display: flex;
		align-items: baseline;
		justify-content: center;
	}

	@media screen and (min-width: 35rem) {
		.divider {
			display: none;
		}

		.page-title {
			margin-right: auto;
		}

		.nav-container {
			padding-inline: 50px;
			width: min(90vw, 80rem);
		}
	}
</style>
