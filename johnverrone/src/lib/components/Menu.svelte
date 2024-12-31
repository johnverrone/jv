<script lang="ts">
	import { page } from '$app/state';
	import { slide } from 'svelte/transition';
	import { Spring } from 'svelte/motion';
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

	const currentPage = $derived(MENU_ITEMS.find((i) => `/(pages)${i.slug}` === page.route.id)?.name);

	let open = $state(false);
	function toggleMenu() {
		open = !open;
	}

	function outclick(node: HTMLElement) {
		const handleClick = (event: MouseEvent) => {
			if (event.target instanceof Element && !node.contains(event.target)) {
				node.dispatchEvent(new CustomEvent('outclick'));
			}
		};

		document.addEventListener('click', handleClick, true);

		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
			}
		};
	}

	let size = new Spring(1);
</script>

<div class="menu-wrapper" use:outclick onoutclick={() => (open = false)}>
	<button
		onclick={toggleMenu}
		onmouseenter={() => size.set(1.2)}
		onmouseleave={() => size.set(1)}
		onmousedown={() => size.set(0.9)}
		onmouseup={() => size.set(1)}
		style={`transform: scale(${size.current})`}
	>
		{currentPage}
	</button>
	{#if open}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<ol transition:slide onclick={() => (open = false)}>
			{#each MENU_ITEMS.filter((i) => i.name !== currentPage) as item, index}
				<MenuItem {item} {index} />
			{/each}
		</ol>
	{/if}
</div>

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
