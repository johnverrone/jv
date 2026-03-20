<script>
	let { data } = $props();

	function formatDate(dateStr) {
		const date = new Date(dateStr + 'T12:00:00');
		return date.toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	// Group entries by week
	const groupedEntries = $derived.by(() => {
		const groups = [];
		let currentWeek = null;

		for (const entry of data.entries) {
			const weekKey = `Week ${entry.week} — ${entry.theme}`;
			if (weekKey !== currentWeek) {
				groups.push({ weekLabel: weekKey, entries: [] });
				currentWeek = weekKey;
			}
			groups[groups.length - 1].entries.push(entry);
		}

		return groups;
	});
</script>

<h1>Practice Journal</h1>

<div class="journal-list">
	{#each groupedEntries as group}
		<div class="week-group">
			<h2>{group.weekLabel}</h2>
			<ul>
				{#each group.entries as entry}
					<li>
						<a href="/guitar/journal/{entry.date}">
							<span class="date">{formatDate(entry.date)}</span>
							<span class="duration">{entry.duration} hrs</span>
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

	.week-group {
		margin-bottom: 2rem;
	}

	.week-group h2 {
		font-size: 1rem;
		color: var(--color-text-secondary);
		margin-bottom: 0.5rem;
		font-family: var(--font-family-mono);
		font-weight: 500;
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
