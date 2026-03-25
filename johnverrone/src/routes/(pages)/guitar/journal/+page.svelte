<script lang="ts">
	let { data } = $props();

	function formatDate(dateStr: string) {
		const date = new Date(dateStr + 'T12:00:00');
		return date.toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	// Group entries by month
	const groupedEntries = $derived.by(() => {
		const groups: { monthLabel: string; entries: typeof data.entries }[] = [];
		let currentMonth = null;

		for (const entry of data.entries) {
			const date = new Date(entry.date + 'T12:00:00');
			const monthKey = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
			if (monthKey !== currentMonth) {
				groups.push({ monthLabel: monthKey, entries: [] });
				currentMonth = monthKey;
			}
			groups[groups.length - 1].entries.push(entry);
		}

		return groups;
	});
</script>

<h1>Practice Journal</h1>

<div class="journal-list">
	{#each groupedEntries as group}
		<div class="month-group">
			<h2>{group.monthLabel}</h2>
			<ul>
				{#each group.entries as entry}
					<li>
						<a href="/guitar/journal/{entry.date}">
							<div class="entry-info">
								<span class="date">{formatDate(entry.date)}</span>
								<span class="theme">{entry.theme}</span>
							</div>
							<span class="duration">{entry.duration} mins</span>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</div>

<style>
	h1 {
		margin-bottom: 2rem;
	}

	.month-group {
		margin-bottom: 2rem;
	}

	.month-group h2 {
		font-size: 1rem;
		color: var(--color-text-secondary);
		margin-bottom: 0.5rem;
		font-family: var(--font-family-mono);
		font-weight: 500;
	}

	.entry-info {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.theme {
		font-size: 0.8125rem;
		color: var(--color-text-secondary);
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	li + li {
		border-top: 1px solid var(--color-background-secondary);
	}

	a {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 0.5rem;
		text-decoration: none;
		color: var(--color-text-primary);
		border-radius: var(--border-radius);
		transition: background-color 0.15s;
	}

	a:hover {
		background-color: var(--color-background-secondary);
	}

	.date {
		font-weight: 500;
	}

	.duration {
		font-size: 0.8125rem;
		color: var(--color-text-secondary);
		font-family: var(--font-family-mono);
	}
</style>
