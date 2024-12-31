<script lang="ts">
	import type { CoffeeBrew, CoffeeRoaster } from '$lib/coffee/types';
	import type { PageData } from './$types';
	import IconStar from '~icons/fa-solid/star';
	import CoffeeMaker from '~icons/material-symbols/coffee-maker';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

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
				{#if coffee.imageUrl}
					<img
						src={coffee.imageUrl}
						alt={`Coffee bag artwork for ${coffee.name}`}
						width={400}
						height={400}
					/>
				{/if}
			</div>
			<div class="coffee-info">
				<div>
					<div class="title-row">
						<h2>{coffee.name}</h2>
						<span class="rating">
							{#each Array(coffee.rating.length / 2) as i}
								<IconStar data-key={i} />
							{/each}
						</span>
					</div>
					<h4>{coffeeRoasterString(coffee.roaster)}</h4>
				</div>
				<div class="bottom-row">
					<span class="origin">{coffee.origin}</span>
					{#if coffee.currentlyBrewing}
						<span class="coffee-maker"><CoffeeMaker /></span>
					{/if}
				</div>
			</div>
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
		background-color: var(--color-card-bg);
		color: var(--color-card-fg);
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

	.coffee-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.title-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 8px;
	}

	.bottom-row {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 8px;
	}

	.rating {
		font-size: 0.5rem;
		display: flex;
		color: var(--color-rating);
	}

	.coffee-maker {
		font-size: 2rem;
		color: var(--color-hint);
	}

	h4 {
		font-weight: normal;
		opacity: 0.7;
		margin-bottom: 8px;
	}

	.origin {
		font-size: 0.875rem;
	}
</style>
