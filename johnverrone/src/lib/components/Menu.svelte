<script lang="ts">
	import { slide } from 'svelte/transition';
	import { Spring } from 'svelte/motion';
	import MenuItem from './MenuItem.svelte';
	import Link from './Link.svelte';

	export interface MenuItemType {
		slug: string;
		name: string;
	}

	interface Props {
		menuItems: MenuItemType[];
		currentPage: string;
	}

	let { menuItems, currentPage }: Props = $props();

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

<div class="desktop-nav">
	<ul class="link-container">
		<Link href="/dev">dev</Link>
		<Link href="/coffee">coffee</Link>
		<Link href="/notes">notes</Link>
		<Link href="/photo">photos</Link>
		<Link href="/video">videos</Link>
	</ul>
</div>

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
			{#each menuItems.filter((i) => i.name !== currentPage) as item, index}
				<MenuItem {item} {index} />
			{/each}
		</ol>
	{/if}
</div>

<style>
	.desktop-nav {
		display: none;
	}

	.link-container {
		margin: 0;
		padding: 0;

		display: flex;
		gap: 1rem;
		align-items: center;
	}

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
		.desktop-nav {
			display: block;
		}
		.menu-wrapper {
			display: none;
		}
	}
</style>
