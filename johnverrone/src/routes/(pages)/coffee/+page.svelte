<script lang="ts">
	import type { CoffeeBrew, CoffeeRoaster } from '$lib/coffee/types';
	import type { PageData } from './$types';
	import IconStar from '~icons/fa-solid/star';

	export let data: PageData;

	const coffeeRoasterString = (c: CoffeeRoaster[]) => c.map((r) => r.name).join(', ');
	const coffeeSortFn = (a: CoffeeBrew, b: CoffeeBrew) => {
		const currentFirst =
			a.currentlyBrewing === b.currentlyBrewing ? 0 : a.currentlyBrewing ? -1 : 1;
		const ratingDesc = b.rating.length - a.rating.length;
		return currentFirst || ratingDesc;
	};
</script>

<div class="coffee-grid">
	{#each data.coffees.sort(coffeeSortFn) as coffee}
		<article class="coffee-card">
			<div class="image-container">
				<img
					src={coffee.imageUrl}
					alt={`Coffee bag artwork for ${coffee.name}`}
					width={400}
					height={400}
				/>
			</div>
			<div class="title-row">
				<h2>{coffee.name}</h2>
				<span class="rating">
					{#each Array(coffee.rating.length / 2) as i}
						<IconStar data-key={i} />
					{/each}
				</span>
			</div>
			<h4>{coffeeRoasterString(coffee.roaster)}</h4>
			<span class="origin">{coffee.origin}</span>
		</article>
	{/each}
</div>

<style>
	.coffee-grid {
		margin: 0 auto;

		width: 90%;
		max-width: 80rem;

		display: grid;
		gap: 48px 24px;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	}

	.coffee-card {
		background-color: rgba(41, 118, 67, 0.08);
		border-radius: var(--border-radius);
		padding: 12px;

		overflow: hidden;
		display: flex;
		flex-flow: column;
	}

	.image-container {
		margin-bottom: 12px;
		height: 300px;
		border-radius: inherit;
	}

	.image-container img {
		border-radius: inherit;
		object-fit: cover;
		width: 100%;
		height: 100%;
	}

	.title-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 8px;
	}

	.rating {
		font-size: 0.5rem;
		display: flex;
		color: var(--color-rating);
	}

	h4 {
		font-weight: normal;
		color: var(--color-text-secondary);
		margin-bottom: 8px;
	}

	.origin {
		font-size: 0.875rem;
	}
</style>
