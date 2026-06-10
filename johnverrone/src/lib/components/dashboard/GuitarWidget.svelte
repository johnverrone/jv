<script lang="ts">
	import './widget.css';
	import type { JournalEntry } from '$lib/guitar/types';

	let { entries }: { entries: JournalEntry[] } = $props();

	const latest = $derived(entries[0]);
	const totalHours = $derived(
		Math.round(entries.reduce((sum, e) => sum + (e.duration ?? 0), 0) / 60)
	);
</script>

{#if latest}
	<div class="w-headline">{latest.theme}</div>
	<div class="w-meta">{latest.date} · {latest.duration} min</div>
	<div class="w-meta w-dim">{entries.length} sessions · ~{totalHours}h total</div>
{:else}
	<div class="w-meta">No practice logged yet.</div>
{/if}
