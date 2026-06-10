<script lang="ts">
	import './widget.css';
	import type { CoffeeBean } from '$lib/coffee/types';

	let { brewing }: { brewing: CoffeeBean[] } = $props();
</script>

{#if brewing.length}
	{#each brewing as bean (bean.slug)}
		<div class="w-row">
			{#if bean.image_url}
				<img class="w-thumb" src={bean.image_url} alt={bean.name} loading="lazy" />
			{/if}
			<div>
				<div class="w-name">{bean.name}</div>
				<div class="w-meta w-dim">{bean.origins?.join(', ')}</div>
			</div>
		</div>
	{/each}
{:else}
	<div class="w-meta">Nothing brewing right now.</div>
{/if}
