<script lang="ts">
	import { mediaUrl } from '$lib/media';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="photo-grid">
	{#each data.keys as key (key)}
		<img src={mediaUrl('photos', key, { width: 600 })} alt="Portfolio by John" loading="lazy" />
	{/each}
</div>

<style>
	.photo-grid {
		display: grid;
		gap: 12px;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	}

	img {
		width: 100%;
		height: auto;
		object-fit: cover;
		aspect-ratio: 3/4;
	}
</style>
