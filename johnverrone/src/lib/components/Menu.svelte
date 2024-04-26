<script lang="ts">
	import { page } from '$app/stores';
	import { slide } from 'svelte/transition';
	import { spring } from 'svelte/motion';
	import OutClick from 'svelte-outclick';
	import MenuItem from './MenuItem.svelte';

	const MENU_ITEMS = [
		{
			slug: '/work',
			name: 'web'
		},
		{
			slug: '/photo',
			name: 'photo'
		},
		{
			slug: '/video',
			name: 'video'
		},
		{
			slug: '/coffee',
			name: 'coffee'
		}
	];

	$: currentPage = MENU_ITEMS.find((i) => `/(pages)${i.slug}` === $page.route.id)?.name;

	let open = false;
	function toggleMenu() {
		open = !open;
	}

	let size = spring(1);
</script>

<OutClick on:outclick={() => (open = false)}>
	<div class="menu-wrapper">
		<button
			on:click={toggleMenu}
			on:mouseenter={() => size.set(1.2)}
			on:mouseleave={() => size.set(1)}
			on:mousedown={() => size.set(0.9)}
			on:mouseup={() => size.set(1)}
			style={`transform: scale(${$size})`}
		>
			{currentPage}
		</button>
		{#if open}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<ol transition:slide on:click={() => (open = false)}>
				{#each MENU_ITEMS.filter((i) => i.name !== currentPage) as item, index}
					<MenuItem {item} {index} />
				{/each}
			</ol>
		{/if}
	</div>
</OutClick>

<style>
	.menu-wrapper {
		position: relative;
	}

	button {
		position: relative;
		top: -1px;

		font-family: var(--font-family-mono);
		padding: 0;
		color: black;

		background: none;
		border: none;
		appearance: none;
		resize: none;
		cursor: pointer;
	}

	ol {
		position: absolute;
		top: 100%;
		left: -40px;

		font-family: var(--font-family-mono);
		background-color: var(--color-menu-bg);
		list-style-type: none;
		padding: 40px;
		margin-top: 4px;
		border-radius: var(--border-radius);
	}

	@media screen and (min-width: 35rem) {
		ol {
			left: revert;
			right: 0;
		}
	}
</style>
