<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="photo-grid">
	{#each data.photos as photo}
		<img src={photo} alt="Portfolio by John" width={600} height={800} />
	{/each}
</div>

<style>
	.photo-grid {
		display: grid;
		gap: 12px;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	}

	img {
		height: auto;
		object-fit: cover;
		aspect-ratio: 3/4;
	}
</style>
