<script lang="ts">
	import Menu from '$lib/components/Menu.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
</script>

<header>
	<div class="nav-container">
		<div class="page-title">
			<PageTitle href="/">johnverrone</PageTitle>
		</div>
		<hr class="divider" />
		<Menu />
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
	}

	@media screen and (min-width: 35rem) {
		.divider {
			display: none;
		}

		.page-title {
			margin-right: auto;
		}

		.nav-container {
			width: calc(100% - 80px);
			margin: 0 40px;
		}
	}
</style>
