<script lang="ts">
	import { mediaUrl } from '$lib/media';
	import type { PageData } from './$types';
	import IconStar from '~icons/fa-solid/star';
	import CoffeeMaker from '~icons/material-symbols/coffee-maker';

	let { data }: { data: PageData } = $props();
	type Bean = PageData['beans'][number];

	const roasterName = (bean: Bean) =>
		data.roastersBySlug.get(bean.roasterSlug)?.name ?? bean.roasterSlug;

	const coffeeSortFn = (a: Bean, b: Bean) => {
		const currentFirst =
			a.currentlyBrewing === b.currentlyBrewing ? 0 : a.currentlyBrewing ? -1 : 1;
		return currentFirst || (b.rating ?? 0) - (a.rating ?? 0);
	};
</script>

{#if data.authenticated}
	<div class="add-link">
		<a href="/admin/coffee">+ manage coffee</a>
	</div>
{/if}

<div class="coffee-grid">
	{#each data.beans.sort(coffeeSortFn) as bean (bean.slug)}
		<article class="coffee-card">
			<div class="image-container">
				{#if bean.imageKey}
					<img
						src={mediaUrl('coffee', bean.imageKey, { width: 400 })}
						alt={`Coffee bag artwork for ${bean.name}`}
						loading="lazy"
					/>
				{/if}
			</div>
			<div class="coffee-info">
				<div>
					<div class="title-row">
						<h2>{bean.name}</h2>
						<span class="rating">
							{#each Array(bean.rating ?? 0) as _, i (i)}
								<IconStar />
							{/each}
						</span>
					</div>
					<h4>{roasterName(bean)}</h4>
				</div>
				<div class="bottom-row">
					<span class="origin">{bean.origins.join(', ')}</span>
					{#if bean.currentlyBrewing}
						<span class="coffee-maker"><CoffeeMaker /></span>
					{/if}
				</div>
			</div>
		</article>
	{/each}
</div>

<style>
	.add-link {
		text-align: right;
		width: 90%;
		max-width: 80rem;
		margin: 0 auto 1rem;
	}

	.add-link a {
		font-size: 0.875rem;
		opacity: 0.7;
	}

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
