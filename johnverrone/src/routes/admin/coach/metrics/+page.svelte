<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Sparkline over the loaded readings (they arrive newest-first).
	const points = $derived.by(() => {
		const rows = [...data.readings].reverse();
		if (rows.length < 2) return '';
		const values = rows.map((r) => r.value);
		const min = Math.min(...values);
		const max = Math.max(...values);
		const span = max - min || 1;
		return rows
			.map((r, i) => {
				const x = (i / (rows.length - 1)) * 300;
				const y = 40 - ((r.value - min) / span) * 36 - 2;
				return `${x.toFixed(1)},${y.toFixed(1)}`;
			})
			.join(' ');
	});
</script>

<svelte:head>
	<title>metrics · coach · command center</title>
</svelte:head>

<div class="head">
	<h1>metrics</h1>
</div>

{#if form?.error}<p class="error">{form.error}</p>{/if}

<div class="latest">
	{#each data.latest as metric (metric.id)}
		<a class="stat" class:active={metric.type === data.type} href="?type={metric.type}">
			<span class="stat-type">{metric.type}</span>
			<span class="stat-value">{metric.value}</span>
			<span class="stat-date">{metric.date}</span>
		</a>
	{:else}
		<p class="empty">No readings yet — log the first one below.</p>
	{/each}
</div>

<form method="POST" action="?/add" class="add-form" use:enhance>
	<div class="grid">
		<label>
			type
			<input name="type" list="metric-types" value={data.type} required />
			<datalist id="metric-types">
				<option value="weight_lb"></option>
				<option value="a1c"></option>
				<option value="resting_hr"></option>
			</datalist>
		</label>
		<label>value<input name="value" type="number" step="any" required /></label>
		<label>date<input name="date" type="date" /></label>
		<label>notes<input name="notes" /></label>
	</div>
	<button type="submit" class="save">log reading</button>
</form>

{#if points}
	<svg
		viewBox="0 0 300 40"
		class="spark"
		preserveAspectRatio="none"
		role="img"
		aria-label="{data.type} trend"
	>
		<polyline {points} fill="none" stroke="var(--color-accent)" stroke-width="1.5" />
	</svg>
{/if}

<ul class="list">
	{#each data.readings as reading (reading.id)}
		<li>
			<span class="r-date">{reading.date}</span>
			<span class="r-value">{reading.value}</span>
			<span class="r-notes">{reading.notes ?? ''}</span>
			<form method="POST" action="?/delete" use:enhance>
				<input type="hidden" name="id" value={reading.id} />
				<button type="submit" class="link danger">delete</button>
			</form>
		</li>
	{:else}
		<p class="empty">No {data.type} readings.</p>
	{/each}
</ul>

<style>
	.head {
		margin-bottom: 1rem;
	}

	.latest {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-bottom: 1.25rem;
	}

	.stat {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		padding: 0.6rem 0.9rem;
		border: 1px solid var(--color-hint);
		border-radius: var(--border-radius);
		text-decoration: none;
		color: var(--color-text-primary);
	}

	.stat.active {
		background: var(--color-card-bg);
		color: var(--color-card-fg);
		border-color: var(--color-card-bg);
	}

	.stat-type,
	.stat-date {
		font-family: var(--font-family-mono);
		font-size: 0.65rem;
		opacity: 0.7;
	}

	.stat-value {
		font-size: 1.2rem;
		font-weight: 600;
	}

	.add-form {
		padding: 1rem;
		background: var(--color-background-secondary);
		border-radius: var(--border-radius);
		margin-bottom: 1.25rem;
	}

	.grid {
		display: grid;
		gap: 0.75rem;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-family: var(--font-family-mono);
		font-size: 0.7rem;
		color: var(--color-text-secondary);
	}

	input {
		font-family: var(--font-family-body);
		font-size: 0.9rem;
		padding: 0.4rem 0.5rem;
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

	.spark {
		width: 100%;
		height: 60px;
		margin-bottom: 1rem;
	}

	.list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	li {
		display: grid;
		grid-template-columns: 7rem 5rem 1fr auto;
		gap: 0.75rem;
		align-items: baseline;
		padding: 0.5rem 0.75rem;
		background: var(--color-background-secondary);
		border-radius: var(--border-radius);
		font-size: 0.9rem;
	}

	.r-date {
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		color: var(--color-text-secondary);
	}

	.r-value {
		font-weight: 600;
	}

	.r-notes {
		color: var(--color-text-secondary);
		font-size: 0.8rem;
	}

	.link {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		font-family: var(--font-family-mono);
		font-size: 0.75rem;
	}

	.link.danger {
		color: #c0392b;
	}

	.empty {
		font-family: var(--font-family-mono);
		font-size: 0.85rem;
		color: var(--color-text-secondary);
	}

	.error {
		color: #c0392b;
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
	}
</style>
