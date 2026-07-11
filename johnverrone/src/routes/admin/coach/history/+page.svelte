<script lang="ts">
	import { enhance } from '$app/forms';
	import { HABIT_LABELS } from '$lib/coach/types';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const dates = $derived([...new Set(data.workouts.map((w) => w.date))]);
	const workoutsFor = (date: string) => data.workouts.filter((w) => w.date === date);
	const habitFor = (date: string) => data.habits.find((h) => h.date === date);

	const habitSummary = (date: string) => {
		const habit = habitFor(date);
		if (!habit) return '';
		return (['noAddedSugar', 'noAlcohol', 'mobilityDone'] as const)
			.filter((f) => habit[f])
			.map((f) => HABIT_LABELS[f])
			.join(' · ');
	};
</script>

<svelte:head>
	<title>history · coach · command center</title>
</svelte:head>

<div class="head">
	<h1>history</h1>
</div>

{#if data.workouts.length === 0}
	<p class="empty">No workouts logged yet.</p>
{/if}

{#each dates as date (date)}
	<section>
		<h2>{date}{habitSummary(date) ? ` — ${habitSummary(date)}` : ''}</h2>
		{#each workoutsFor(date) as log (log.id)}
			<div class="log" class:skipped={log.status === 'skipped'}>
				<span class="modality">{log.modality}</span>
				<span class="status">
					{log.status}{log.variant === 'bare_min' ? ' · bare min' : ''}
				</span>
				<span class="detail">
					{#if log.durationMin}{log.durationMin}′{/if}
					{#if log.rpe}· RPE {log.rpe}{/if}
					{#if log.notes}· {log.notes}{/if}
				</span>
				<span class="source">{log.source}</span>
				<form method="POST" action="?/deleteLog" use:enhance>
					<input type="hidden" name="id" value={log.id} />
					<button type="submit" class="link danger">delete</button>
				</form>
			</div>
		{/each}
	</section>
{/each}

<nav class="pager">
	{#if data.page > 1}<a href="?page={data.page - 1}">← newer</a>{/if}
	{#if data.hasMore}<a href="?page={data.page + 1}">older →</a>{/if}
</nav>

<style>
	.head {
		margin-bottom: 1rem;
	}

	h2 {
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		color: var(--color-text-secondary);
		margin: 1.25rem 0 0.4rem;
	}

	.log {
		display: grid;
		grid-template-columns: 4.5rem 7rem 1fr auto auto;
		gap: 0.75rem;
		align-items: baseline;
		padding: 0.55rem 0.75rem;
		background: var(--color-background-secondary);
		border-radius: var(--border-radius);
		margin-bottom: 4px;
		font-size: 0.9rem;
	}

	.log.skipped {
		opacity: 0.6;
	}

	.modality {
		font-weight: 600;
	}

	.status,
	.source {
		font-family: var(--font-family-mono);
		font-size: 0.75rem;
		color: var(--color-text-secondary);
	}

	.detail {
		font-size: 0.85rem;
		color: var(--color-text-secondary);
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

	.pager {
		display: flex;
		gap: 1.5rem;
		margin-top: 1.5rem;
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
	}

	.pager a {
		color: var(--color-accent);
		text-decoration: none;
	}

	.empty {
		font-family: var(--font-family-mono);
		font-size: 0.85rem;
		color: var(--color-text-secondary);
	}

	@media (max-width: 35rem) {
		.log {
			grid-template-columns: 1fr auto;
		}
	}
</style>
