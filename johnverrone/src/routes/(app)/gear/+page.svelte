<script lang="ts">
	import { enhance } from '$app/forms';
	import { formatCents } from '$lib/gear/types';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let showForm = $state(false);
</script>

<svelte:head>
	<title>gear · command center</title>
</svelte:head>

<div class="head">
	<h1>gear</h1>
	<button class="toggle" onclick={() => (showForm = !showForm)}>
		{showForm ? 'cancel' : '+ add gear'}
	</button>
</div>

{#if showForm}
	<form
		method="POST"
		action="?/create"
		class="add-form"
		use:enhance={() => {
			return async ({ update }) => {
				await update();
			};
		}}
	>
		{#if form?.error}<p class="error">{form.error}</p>{/if}
		<div class="grid">
			<label>name<input name="name" required /></label>
			<label>category<input name="category" placeholder="guitar, bike, camera…" required /></label>
			<label>manufacturer<input name="manufacturer" /></label>
			<label>model<input name="model" /></label>
			<label>serial number<input name="serial_number" /></label>
			<label>acquired date<input name="acquired_date" type="date" /></label>
			<label>price ($)<input name="acquired_price" type="number" step="0.01" min="0" /></label>
			<label>image url<input name="image_url" type="url" /></label>
			<label class="wide">notes<textarea name="notes" rows="2"></textarea></label>
		</div>
		<button type="submit" class="save">save gear</button>
	</form>
{/if}

{#if data.items.length === 0}
	<p class="empty">No gear yet. Add your first item above.</p>
{:else}
	<ul class="list">
		{#each data.items as item (item.id)}
			<li>
				<a href="/gear/{item.slug}">
					<span class="name">{item.name}</span>
					<span class="cat">{item.category}</span>
					<span class="status status-{item.status}">{item.status}</span>
					<span class="price">{formatCents(item.acquiredPriceCents)}</span>
				</a>
			</li>
		{/each}
	</ul>
{/if}

<style>
	.head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: 1.5rem;
	}

	.toggle,
	.save {
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		padding: 0.4rem 0.75rem;
		border: 1px solid var(--color-background-secondary);
		border-radius: var(--border-radius);
		background: none;
		cursor: pointer;
	}

	.save {
		margin-top: 1rem;
		background: var(--color-card-bg);
		color: var(--color-card-fg);
		border: none;
	}

	.add-form {
		margin-bottom: 2rem;
		padding: 1.25rem;
		background: var(--color-background-secondary);
		border-radius: var(--border-radius);
	}

	.grid {
		display: grid;
		gap: 0.75rem;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-family: var(--font-family-mono);
		font-size: 0.7rem;
		text-transform: lowercase;
		color: var(--color-text-secondary);
	}

	.wide {
		grid-column: 1 / -1;
	}

	input,
	textarea {
		font-family: var(--font-family-body);
		font-size: 0.9rem;
		padding: 0.4rem 0.5rem;
		border: 1px solid var(--color-hint);
		border-radius: 4px;
		background: var(--color-background);
	}

	.list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.list a {
		display: grid;
		grid-template-columns: 2fr 1fr auto auto;
		gap: 1rem;
		align-items: center;
		padding: 0.85rem 1rem;
		text-decoration: none;
		color: var(--color-text-primary);
		background: var(--color-background-secondary);
		border-radius: var(--border-radius);
	}

	.list a:hover {
		outline: 2px solid var(--color-accent);
	}

	.name {
		font-weight: 600;
	}

	.cat {
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		color: var(--color-text-secondary);
	}

	.status {
		font-family: var(--font-family-mono);
		font-size: 0.7rem;
		text-transform: uppercase;
		padding: 0.15rem 0.5rem;
		border-radius: 999px;
		justify-self: start;
	}

	.status-active {
		background: var(--color-card-fg);
		color: var(--color-card-bg);
	}
	.status-stored {
		background: var(--color-hint);
	}
	.status-sold,
	.status-retired {
		background: var(--color-background-secondary);
		color: var(--color-text-secondary);
		border: 1px solid var(--color-hint);
	}

	.price {
		font-family: var(--font-family-mono);
		font-size: 0.85rem;
		color: var(--color-text-secondary);
	}

	.empty {
		color: var(--color-text-secondary);
		font-family: var(--font-family-mono);
		font-size: 0.85rem;
	}

	.error {
		color: #c0392b;
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		margin: 0 0 0.75rem;
	}
</style>
