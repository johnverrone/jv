<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let showBean = $state(false);
	let showRoaster = $state(false);
</script>

<svelte:head><title>coffee · command center</title></svelte:head>

<a class="back" href="/admin">← command center</a>

<div class="head">
	<h1>coffee</h1>
	<button class="toggle" onclick={() => (showBean = !showBean)} disabled={data.roasters.length === 0}>
		{showBean ? 'cancel' : '+ add bean'}
	</button>
</div>

{#if form?.error}<p class="error">{form.error}</p>{/if}
{#if data.roasters.length === 0}
	<p class="empty">Add a roaster first (below) — beans need one.</p>
{/if}

{#if showBean}
	<form
		method="POST"
		action="?/createBean"
		class="add-form"
		use:enhance={() => async ({ update }) => {
			await update();
			showBean = false;
		}}
	>
		<div class="grid">
			<label>name<input name="name" required /></label>
			<label>roaster
				<select name="roaster" required>
					<option value="">select…</option>
					{#each data.roasters as r (r.slug)}<option value={r.slug}>{r.name}</option>{/each}
				</select>
			</label>
			<label>rating<input name="rating" type="number" min="1" max="5" /></label>
			<label>price 12oz ($)<input name="price_12oz" type="number" step="0.01" min="0" /></label>
			<label>origins<input name="origins" placeholder="Colombia, Ethiopia" /></label>
			<label>flavors<input name="flavors" placeholder="chocolate, citrus" /></label>
			<label>process<input name="process" placeholder="Washed" /></label>
			<label class="check"><input name="single_origin" type="checkbox" /> single origin</label>
			<label class="check"><input name="currently_brewing" type="checkbox" /> currently brewing</label>
			<label class="wide">notes<textarea name="notes" rows="2"></textarea></label>
		</div>
		<button type="submit" class="save">save bean</button>
	</form>
{/if}

{#if data.beans.length === 0}
	<p class="empty">No beans yet.</p>
{:else}
	<ul class="list">
		{#each data.beans as bean (bean.id)}
			<li>
				<a class="name" href="/admin/coffee/{bean.slug}">{bean.name}</a>
				<span class="meta">{bean.roasterSlug}</span>
				{#if bean.currentlyBrewing}<span class="badge">brewing</span>{/if}
				<form
					method="POST"
					action={bean.visibility === 'published' ? '?/unpublish' : '?/publish'}
					use:enhance
				>
					<input type="hidden" name="id" value={bean.id} />
					<button type="submit" class="vis" class:on={bean.visibility === 'published'}>
						{bean.visibility === 'published' ? '★ published' : '☆ draft'}
					</button>
				</form>
				<form
					method="POST"
					action="?/deleteBean"
					use:enhance={({ cancel }) => {
						if (!confirm(`Delete ${bean.name}?`)) cancel();
						return async ({ update }) => update();
					}}
				>
					<input type="hidden" name="id" value={bean.id} />
					<button type="submit" class="del" aria-label="delete bean">×</button>
				</form>
			</li>
		{/each}
	</ul>
{/if}

<section class="roasters">
	<div class="head">
		<h2>roasters</h2>
		<button class="toggle" onclick={() => (showRoaster = !showRoaster)}>
			{showRoaster ? 'cancel' : '+ add roaster'}
		</button>
	</div>

	{#if showRoaster}
		<form
			method="POST"
			action="?/createRoaster"
			class="add-form"
			use:enhance={() => async ({ update }) => {
				await update();
				showRoaster = false;
			}}
		>
			<div class="grid">
				<label>name<input name="name" required /></label>
				<label>location<input name="location" /></label>
				<label>website<input name="website" type="url" /></label>
				<label class="wide">notes<textarea name="notes" rows="2"></textarea></label>
			</div>
			<button type="submit" class="save">save roaster</button>
		</form>
	{/if}

	{#if data.roasters.length}
		<ul class="list">
			{#each data.roasters as r (r.id)}
				<li>
					<span class="name">{r.name}</span>
					<span class="meta">{r.location ?? ''}</span>
					<form
						method="POST"
						action="?/deleteRoaster"
						use:enhance={({ cancel }) => {
							if (!confirm(`Delete ${r.name}? Beans referencing it will break.`)) cancel();
							return async ({ update }) => update();
						}}
					>
						<input type="hidden" name="id" value={r.id} />
						<button type="submit" class="del" aria-label="delete roaster">×</button>
					</form>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<style>
	.back {
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		color: var(--color-text-secondary);
		text-decoration: none;
	}
	.head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin: 1rem 0 1.25rem;
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
	.toggle:disabled {
		opacity: 0.4;
		cursor: not-allowed;
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
	label.check {
		flex-direction: row;
		align-items: center;
		gap: 0.4rem;
	}
	.wide {
		grid-column: 1 / -1;
	}
	input,
	textarea,
	select {
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
	.list li {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.7rem 1rem;
		background: var(--color-background-secondary);
		border-radius: var(--border-radius);
	}
	.name {
		font-weight: 600;
		text-decoration: none;
		color: var(--color-text-primary);
	}
	.meta {
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		color: var(--color-text-secondary);
		margin-right: auto;
	}
	.badge {
		font-family: var(--font-family-mono);
		font-size: 0.65rem;
		text-transform: uppercase;
		padding: 0.15rem 0.5rem;
		border-radius: 999px;
		background: var(--color-hint);
	}
	.vis {
		font-family: var(--font-family-mono);
		font-size: 0.75rem;
		padding: 0.25rem 0.55rem;
		border: 1px solid var(--color-hint);
		border-radius: 4px;
		background: var(--color-background);
		cursor: pointer;
	}
	.vis.on {
		background: var(--color-card-bg);
		color: var(--color-card-fg);
		border-color: transparent;
	}
	.del {
		background: none;
		border: none;
		cursor: pointer;
		color: var(--color-text-secondary);
		font-size: 1.1rem;
		line-height: 1;
	}
	.del:hover {
		color: #c0392b;
	}
	.roasters {
		margin-top: 3rem;
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
