<script lang="ts">
	import { enhance } from '$app/forms';
	import { formatCents, GEAR_STATUSES } from '$lib/gear/types';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const item = $derived(data.item);
</script>

<svelte:head>
	<title>{item.name} · gear</title>
</svelte:head>

<a class="back" href="/gear">← gear</a>

<div class="header">
	{#if item.image_url}
		<img class="photo" src={item.image_url} alt={item.name} />
	{/if}
	<div>
		<h1>{item.name}</h1>
		<p class="sub">
			{[item.manufacturer, item.model].filter(Boolean).join(' ') || item.category}
		</p>
		<dl class="facts">
			<div><dt>category</dt><dd>{item.category}</dd></div>
			{#if item.serial_number}<div><dt>serial</dt><dd>{item.serial_number}</dd></div>{/if}
			{#if item.acquired_date}<div><dt>acquired</dt><dd>{item.acquired_date}</dd></div>{/if}
			<div><dt>price</dt><dd>{formatCents(item.acquired_price_cents)}</dd></div>
		</dl>
		{#if item.notes}<p class="notes">{item.notes}</p>{/if}

		<form method="POST" action="?/updateStatus" class="status-form" use:enhance>
			<input type="hidden" name="id" value={item.id} />
			<label>
				status
				<select name="status" value={item.status} onchange={(e) => e.currentTarget.form?.requestSubmit()}>
					{#each GEAR_STATUSES as s (s)}
						<option value={s}>{s}</option>
					{/each}
				</select>
			</label>
		</form>
	</div>
</div>

<section class="maint">
	<h2>maintenance</h2>

	<form method="POST" action="?/addMaintenance" class="add-maint" use:enhance>
		<input type="hidden" name="id" value={item.id} />
		{#if form?.error}<p class="error">{form.error}</p>{/if}
		<div class="grid">
			<label>date<input name="performed_date" type="date" required /></label>
			<label>type<input name="type" placeholder="string-change, service…" required /></label>
			<label>cost ($)<input name="cost" type="number" step="0.01" min="0" /></label>
			<label>by<input name="performed_by" placeholder="self / shop" /></label>
			<label class="wide">description<input name="description" /></label>
		</div>
		<button type="submit" class="save">log maintenance</button>
	</form>

	{#if data.maintenance.length === 0}
		<p class="empty">No maintenance logged yet.</p>
	{:else}
		<ul class="logs">
			{#each data.maintenance as log (log.id)}
				<li>
					<span class="ldate">{log.performed_date}</span>
					<span class="ltype">{log.type}</span>
					<span class="ldesc">{log.description ?? ''}</span>
					<span class="lcost">{formatCents(log.cost_cents)}</span>
					<form method="POST" action="?/deleteMaintenance" use:enhance>
						<input type="hidden" name="log_id" value={log.id} />
						<button type="submit" class="del" aria-label="delete entry">×</button>
					</form>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<form
	method="POST"
	action="?/deleteGear"
	class="danger"
	use:enhance={({ cancel }) => {
		if (!confirm(`Delete ${item.name} and its maintenance history?`)) cancel();
		return async ({ update }) => update();
	}}
>
	<input type="hidden" name="id" value={item.id} />
	<button type="submit">delete gear</button>
</form>

<style>
	.back {
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		color: var(--color-text-secondary);
		text-decoration: none;
	}

	.header {
		display: flex;
		gap: 1.5rem;
		margin: 1rem 0 2.5rem;
		flex-wrap: wrap;
	}

	.photo {
		width: 160px;
		height: 160px;
		object-fit: cover;
		border-radius: var(--border-radius);
	}

	h1 {
		margin: 0;
	}

	.sub {
		margin: 0.25rem 0 1rem;
		color: var(--color-text-secondary);
		font-family: var(--font-family-mono);
		font-size: 0.85rem;
	}

	.facts {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
		margin: 0 0 1rem;
	}
	.facts dt {
		font-family: var(--font-family-mono);
		font-size: 0.65rem;
		text-transform: uppercase;
		color: var(--color-text-secondary);
	}
	.facts dd {
		margin: 0.1rem 0 0;
		font-size: 0.95rem;
	}

	.notes {
		max-width: 50ch;
		color: var(--color-text-primary);
	}

	.status-form select {
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		padding: 0.3rem 0.5rem;
		border: 1px solid var(--color-hint);
		border-radius: 4px;
	}
	.status-form label {
		display: inline-flex;
		flex-direction: column;
		gap: 0.25rem;
		font-family: var(--font-family-mono);
		font-size: 0.65rem;
		text-transform: uppercase;
		color: var(--color-text-secondary);
	}

	.maint h2 {
		font-size: 1.1rem;
	}

	.add-maint {
		margin-bottom: 1.5rem;
		padding: 1rem;
		background: var(--color-background-secondary);
		border-radius: var(--border-radius);
	}

	.grid {
		display: grid;
		gap: 0.6rem;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		font-family: var(--font-family-mono);
		font-size: 0.65rem;
		text-transform: lowercase;
		color: var(--color-text-secondary);
	}

	.wide {
		grid-column: 1 / -1;
	}

	input {
		font-family: var(--font-family-body);
		font-size: 0.9rem;
		padding: 0.35rem 0.5rem;
		border: 1px solid var(--color-hint);
		border-radius: 4px;
		background: var(--color-background);
	}

	.save {
		margin-top: 0.75rem;
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		padding: 0.4rem 0.75rem;
		background: var(--color-card-bg);
		color: var(--color-card-fg);
		border: none;
		border-radius: var(--border-radius);
		cursor: pointer;
	}

	.logs {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.logs li {
		display: grid;
		grid-template-columns: auto auto 1fr auto auto;
		gap: 1rem;
		align-items: center;
		padding: 0.6rem 0.75rem;
		background: var(--color-background-secondary);
		border-radius: 4px;
		font-size: 0.9rem;
	}

	.ldate {
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		color: var(--color-text-secondary);
	}
	.ltype {
		font-weight: 600;
	}
	.ldesc {
		color: var(--color-text-secondary);
	}
	.lcost {
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
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

	.danger {
		margin-top: 3rem;
	}
	.danger button {
		font-family: var(--font-family-mono);
		font-size: 0.75rem;
		padding: 0.35rem 0.7rem;
		background: none;
		border: 1px solid #c0392b;
		color: #c0392b;
		border-radius: var(--border-radius);
		cursor: pointer;
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
		margin: 0 0 0.5rem;
	}
</style>
