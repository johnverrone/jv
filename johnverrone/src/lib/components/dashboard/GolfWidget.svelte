<script lang="ts">
	import './widget.css';
	import type { GolfRound } from '$lib/golf/types';

	let { rounds }: { rounds: GolfRound[] } = $props();

	const latest = $derived(rounds[0]);
	const avgDiff = $derived.by(() => {
		const diffs = rounds.map((r) => r.handicap_differential).filter((d) => typeof d === 'number');
		if (!diffs.length) return null;
		return (diffs.reduce((sum, d) => sum + d, 0) / diffs.length).toFixed(1);
	});
</script>

{#if latest}
	<div class="w-headline">{latest.score} <span class="w-unit">@ {latest.course}</span></div>
	<div class="w-meta">{latest.date} · {latest.putts} putts · {latest.gir} GIR · {latest.fir} FIR</div>
	{#if avgDiff}
		<div class="w-meta w-dim">avg differential {avgDiff} · {rounds.length} rounds</div>
	{/if}
{:else}
	<div class="w-meta">No rounds logged yet.</div>
{/if}
