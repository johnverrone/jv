<script lang="ts">
	import Card from '$lib/components/dashboard/Card.svelte';
	import GuitarWidget from '$lib/components/dashboard/GuitarWidget.svelte';
	import GolfWidget from '$lib/components/dashboard/GolfWidget.svelte';
	import CoffeeWidget from '$lib/components/dashboard/CoffeeWidget.svelte';
	import SoftwareWidget from '$lib/components/dashboard/SoftwareWidget.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>command center</title>
</svelte:head>

<h1 class="title">command center</h1>
<p class="subtitle">your life, at a glance</p>

<div class="grid">
	<Card title="guitar" href="/guitar/journal">
		{#await data.streamed.guitar}
			<div class="skeleton">loading…</div>
		{:then r}
			{#if r.ok}
				<GuitarWidget entries={r.data} />
			{:else}
				<div class="error">unavailable</div>
			{/if}
		{/await}
	</Card>

	<Card title="golf">
		{#await data.streamed.golf}
			<div class="skeleton">loading…</div>
		{:then r}
			{#if r.ok}
				<GolfWidget rounds={r.data} />
			{:else}
				<div class="error">unavailable</div>
			{/if}
		{/await}
	</Card>

	<Card title="coffee" href="/coffee">
		{#await data.streamed.coffee}
			<div class="skeleton">loading…</div>
		{:then r}
			{#if r.ok}
				<CoffeeWidget brewing={r.data} />
			{:else}
				<div class="error">unavailable</div>
			{/if}
		{/await}
	</Card>

	<Card title="software">
		{#await data.streamed.software}
			<div class="skeleton">loading…</div>
		{:then r}
			{#if r.ok}
				<SoftwareWidget projects={r.data.projects} ideas={r.data.ideas} />
			{:else}
				<div class="error">unavailable</div>
			{/if}
		{/await}
	</Card>
</div>

<style>
	.title {
		margin-bottom: 0.25rem;
	}

	.subtitle {
		margin: 0 0 2rem;
		color: var(--color-text-secondary);
		font-family: var(--font-family-mono);
		font-size: 0.85rem;
	}

	.grid {
		display: grid;
		gap: 12px;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	}

	.skeleton,
	.error {
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		opacity: 0.5;
	}

	.error {
		color: var(--color-accent);
		opacity: 0.8;
	}
</style>
