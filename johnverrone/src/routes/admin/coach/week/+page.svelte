<script lang="ts">
	import { DAY_NAMES } from '$lib/coach/types';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const statusGlyph = (status: string, variant: string) => {
		if (status === 'done') return variant === 'bare_min' ? '✓ bare min' : '✓';
		if (status === 'modified') return '~ modified';
		return '✗ skipped';
	};
</script>

<svelte:head>
	<title>week · coach · command center</title>
</svelte:head>

<div class="head">
	<h1>week of {data.week.weekStart}</h1>
	<span class="pct">{data.week.done}/{data.week.planned} · {data.week.pct}%</span>
</div>

<nav class="pager">
	<a href="?start={data.prevStart}">← prev</a>
	<a href="/admin/coach/week">this week</a>
	<a href="?start={data.nextStart}">next →</a>
</nav>

<ul class="days">
	{#each data.week.days as day (day.date)}
		<li class:today={day.date === data.today} class:future={day.date > data.today}>
			<div class="day-head">
				<span class="day-name">{DAY_NAMES[day.dayOfWeek]}</span>
				<span class="day-date">{day.date}</span>
			</div>
			<div class="day-body">
				{#each day.sessions as session (session.id)}
					{@const log = day.logs.find((l) => l.planSessionId === session.id)}
					<div class="planned">
						<span class="name">{session.name}</span>
						{#if log}
							<span class="glyph" class:ok={log.status !== 'skipped'}>
								{statusGlyph(log.status, log.variant)}
							</span>
						{:else if day.date < data.today && session.modality !== 'rest'}
							<span class="glyph missed">missed</span>
						{/if}
					</div>
				{/each}
				{#each day.logs.filter((l) => !day.sessions.some((s) => s.id === l.planSessionId)) as log (log.id)}
					<div class="planned extra">
						<span class="name">{log.modality} (unplanned)</span>
						<span class="glyph ok">{statusGlyph(log.status, log.variant)}</span>
					</div>
				{/each}
			</div>
		</li>
	{/each}
</ul>

<style>
	.head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: 0.75rem;
	}

	.pct {
		font-family: var(--font-family-mono);
		font-size: 0.9rem;
	}

	.pager {
		display: flex;
		gap: 1rem;
		margin-bottom: 1.25rem;
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
	}

	.pager a {
		color: var(--color-accent);
		text-decoration: none;
	}

	.days {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	li {
		display: grid;
		grid-template-columns: 8rem 1fr;
		gap: 1rem;
		padding: 0.75rem 1rem;
		background: var(--color-background-secondary);
		border-radius: var(--border-radius);
	}

	li.today {
		outline: 2px solid var(--color-accent);
	}

	li.future {
		opacity: 0.6;
	}

	.day-name {
		font-weight: 600;
		display: block;
	}

	.day-date {
		font-family: var(--font-family-mono);
		font-size: 0.7rem;
		color: var(--color-text-secondary);
	}

	.planned {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		font-size: 0.9rem;
	}

	.planned.extra .name {
		color: var(--color-text-secondary);
	}

	.glyph {
		font-family: var(--font-family-mono);
		font-size: 0.75rem;
		color: var(--color-text-secondary);
	}

	.glyph.ok {
		color: #27ae60;
	}

	.glyph.missed {
		color: #c0392b;
	}

	@media (max-width: 30rem) {
		li {
			grid-template-columns: 1fr;
			gap: 0.25rem;
		}
	}
</style>
