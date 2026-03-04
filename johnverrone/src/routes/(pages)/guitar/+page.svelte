<script>
	import SvelteMarked from 'svelte-marked';

	let { data } = $props();
</script>

<div class="container">
	<a href="/notes" class="back">back</a>

	<article>
		<section class="prose">
			<SvelteMarked source={data.progress} />
		</section>

		<hr />

		<section class="prose">
			<SvelteMarked source={data.plan} />
		</section>
	</article>

	<hr />

	<section class="songs">
		<h2>Songs</h2>
		<div class="table-wrapper">
			<table>
				<thead>
					<tr>
						<th>Song</th>
						<th>Artist</th>
						<th>Difficulty</th>
						<th>Genre</th>
						<th>Key</th>
						<th>Tuning</th>
						<th>BPM</th>
						<th>Capo</th>
						<th>Progress</th>
					</tr>
				</thead>
				<tbody>
					{#each data.songs as song}
						<tr>
							<td><a href={song.tab_link} target="_blank" rel="noopener">{song.title}</a></td>
							<td>{song.artist}</td>
							<td>{song.difficulty}</td>
							<td>{song.genre}</td>
							<td>{song.key}</td>
							<td>{song.tuning}</td>
							<td>{song.bpm}</td>
							<td>{song.capo ?? '—'}</td>
							<td>{song.progress}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>
</div>

<style>
	.container {
		max-width: min(90vw, 500px);
		margin: 0 auto;

		.back {
			display: block;
			margin-bottom: 1rem;
		}
	}

	hr {
		margin: 3rem 0;
	}

	.songs {
		max-width: 90vw;
		margin: 0 auto;

		h2 {
			margin-bottom: 1rem;
		}
	}

	.table-wrapper {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
		white-space: nowrap;

		th,
		td {
			padding: 0.5rem 0.75rem;
			text-align: left;
			border-bottom: 1px solid var(--color-border, #e0e0e0);
		}

		th {
			font-weight: 600;
		}

		a {
			color: inherit;
		}
	}
</style>
