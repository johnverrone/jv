<script lang="ts">
	import { music2025, defaultTrackSearch } from '$lib/music/2025';

	const data = music2025;

	let shareState: 'idle' | 'copied' | 'error' = 'idle';
	let openSong = -1;

	const artistCounts = data.songs.reduce<Record<string, number>>((acc, song) => {
		acc[song.artist] = (acc[song.artist] || 0) + 1;
		return acc;
	}, {});

	const multipleArtists = Object.entries(artistCounts)
		.filter(([, count]) => count > 1)
		.sort((a, b) => b[1] - a[1]);

	const totalGenrePercent = data.genreMix.reduce((sum, slice) => sum + slice.percent, 0);

	const songUrl = (title: string, artist: string, url?: string) =>
		url || defaultTrackSearch(title, artist);

	const toggleSong = (index: number) => {
		openSong = openSong === index ? -1 : index;
	};

	const share = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);
			shareState = 'copied';
			setTimeout(() => (shareState = 'idle'), 2000);
		} catch (err) {
			console.error(err);
			shareState = 'error';
		}
	};
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta
		name="description"
		content="A minimal, shareable snapshot of my top songs and albums from 2025."
	/>
	<meta property="og:title" content={data.title} />
	<meta
		property="og:description"
		content="A minimal, shareable snapshot of my top songs and albums from 2025."
	/>
	<meta property="og:image" content="/images/music/2025/og.svg" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://johnverrone.com/music/2025" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.title} />
	<meta
		name="twitter:description"
		content="A minimal, shareable snapshot of my top songs and albums from 2025."
	/>
	<meta name="twitter:image" content="/images/music/2025/og.svg" />
</svelte:head>

<div id="top" aria-hidden="true"></div>
<section class="hero">
	<div class="hero-text">
		<p class="eyebrow">Year in Review</p>
		<h1>{data.title}</h1>
		<p class="subtitle">{data.subtitle}</p>
		<div class="actions">
			<a class="button primary" href={data.playlistUrl} target="_blank" rel="noreferrer">
				Open Spotify Playlist
			</a>
			<button class="button ghost" type="button" on:click={share} aria-live="polite">
				{shareState === 'copied'
					? 'Link copied'
					: shareState === 'error'
						? 'Could not copy'
						: 'Share'}
			</button>
		</div>
	</div>
	<div class="hero-art">
		<div class="vinyl">
			<div class="label">2025</div>
		</div>
	</div>
</section>

<section aria-labelledby="top-songs">
	<div class="section-header">
		<h2 id="top-songs">Top Songs</h2>
		<p class="section-sub">Ten tracks on repeat, ranked.</p>
	</div>
	<ol class="song-list">
		{#each data.songs as song, index}
			<li class={`song-card ${openSong === index ? 'open' : ''}`}>
				<div
					class="song-row"
					aria-expanded={openSong === index}
					role="button"
					tabindex="0"
					on:click={() => toggleSong(index)}
					on:keydown={(event) => {
						if (event.key === 'Enter' || event.key === ' ') {
							event.preventDefault();
							toggleSong(index);
						}
					}}
				>
					<div class="rank">#{song.rank}</div>
					<div class="song-info">
						<a
							class="song-title"
							href={songUrl(song.title, song.artist, song.spotifyUrl)}
							target="_blank"
							rel="noreferrer"
							on:click|stopPropagation
						>
							{song.title}
						</a>
						<p class="song-meta">
							{song.artist}
							{song.album ? ` · ${song.album}` : ''}
						</p>
					</div>
					<button
						class="note-toggle"
						type="button"
						aria-label={`Toggle note for ${song.title}`}
						aria-expanded={openSong === index}
						on:click|stopPropagation={() => toggleSong(index)}
					>
						<span>{openSong === index ? 'Hide note' : 'Show note'}</span>
					</button>
				</div>
				<p class="note">{song.note}</p>
			</li>
		{/each}
	</ol>
</section>

<section aria-labelledby="top-albums">
	<div class="section-header">
		<h2 id="top-albums">Top Albums</h2>
		<p class="section-sub">Five albums that anchored the year.</p>
	</div>
	<div class="album-grid">
		{#each data.albums as album}
			<article class="album-card">
				{#if album.cover}
					<img src={album.cover} alt={`Album cover for ${album.title}`} />
				{/if}
				<div class="album-body">
					<h3>{album.title}</h3>
					<p class="album-artist">{album.artist}</p>
					<p class="album-note">{album.note}</p>
				</div>
			</article>
		{/each}
	</div>
</section>

{#if data.favoritePerformance}
	<section aria-labelledby="live-highlight" class="performance">
		<div class="section-header">
			<h2 id="live-highlight">Favorite Live Performance</h2>
			<p class="section-sub">A single night that stuck with me.</p>
		</div>
		<div class="performance-card">
			<div>
				<h3>{data.favoritePerformance.artist}</h3>
				<p class="performance-where">
					{data.favoritePerformance.venue}
				</p>
			</div>
			<p class="performance-note">{data.favoritePerformance.note}</p>
		</div>
	</section>
{/if}

<section aria-labelledby="year-stats" class="stats">
	<div class="section-header">
		<h2 id="year-stats">Year Stats</h2>
		<p class="section-sub">Lightweight data viz—no libraries.</p>
	</div>
	<div class="stats-grid">
		<div>
			<h3>Genre mix</h3>
			<ul class="bars" aria-label="Genre breakdown">
				{#each data.genreMix as slice}
					<li>
						<div class="bar-label">
							<span>{slice.label}</span>
							<span>{slice.percent}%</span>
						</div>
						<div class="bar-track" aria-hidden="true">
							<div
								class="bar-fill"
								style={`width:${(slice.percent / totalGenrePercent) * 100}%`}
							></div>
						</div>
					</li>
				{/each}
			</ul>
		</div>
		<div>
			<h3>Artists with multiple appearances</h3>
			{#if multipleArtists.length === 0}
				<p class="muted">No repeats—variety win.</p>
			{:else}
				<ol class="artist-list">
					{#each multipleArtists as [artist, count]}
						<li>
							<span>{artist}</span>
							<span class="badge">{count}</span>
						</li>
					{/each}
				</ol>
			{/if}
		</div>
	</div>
</section>

<section aria-labelledby="playlist">
	<div class="section-header">
		<h2 id="playlist">Playlist</h2>
		<p class="section-sub">Stream the whole mix.</p>
	</div>
	<div class="playlist">
		<iframe
			title="Spotify playlist"
			style="border-radius:12px"
			src={`https://open.spotify.com/embed/playlist/${data.playlistId}?utm_source=generator`}
			width="100%"
			height="360"
			frameborder="0"
			allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
			loading="lazy"
		></iframe>
	</div>
</section>

<footer class="footer">
	<p>jv · 2025</p>
	<a class="back-to-top" href="#top">Back to top</a>
</footer>

<style>
	:global(:root) {
		--music-base: #2b1f3a;
		--music-dark: #1f152c;
		--music-accent: #e2b76d;
		--music-accent-2: #a56edb;
		--music-soft: #f4ecff;
		--music-surface: #fdfaff;
		--music-surface-soft: #fbf5ff;
		--music-border: #e6d8f3;
		--music-text-strong: #20162e;
		--music-text-muted: #b2a6c7;
		--music-text-contrast: #1a1227;
		--music-text-hero: #f3ecff;
		--music-text-hero-strong: #fff7f0;
		--music-text-hero-muted: #d8cde5;
		--music-text-hero-quiet: #c6b6de;
		--music-vinyl-mid: #3c2e54;
		--music-accent-soft: #f4e8c1;
		--music-glow: rgba(165, 110, 219, 0.18);
	}

	section {
		margin-bottom: 64px;
		scroll-margin-top: 90px;
	}

	.hero {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 32px;
		align-items: center;
		padding: 24px;
		background: radial-gradient(circle at 20% 20%, rgba(226, 183, 109, 0.12), transparent 38%),
			linear-gradient(135deg, var(--music-base), var(--music-dark));
		border-radius: 18px;
		color: var(--music-text-hero);
	}

	.hero-text h1 {
		font-size: clamp(2rem, 4vw, 2.8rem);
		line-height: 1.1;
		margin-bottom: 12px;
		color: var(--music-text-hero-strong);
	}

	.hero .subtitle {
		margin-bottom: 20px;
		color: var(--music-text-hero-muted);
	}

	.eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-size: 0.75rem;
		color: var(--music-text-hero-quiet);
		margin-bottom: 6px;
	}

	.actions {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
	}

	.button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 12px 16px;
		border-radius: 999px;
		border: 1px solid rgba(244, 236, 255, 0.22);
		background: transparent;
		color: inherit;
		cursor: pointer;
		text-decoration: none;
		transition:
			transform 0.15s ease,
			box-shadow 0.15s ease,
			background 0.15s ease;
	}

	.button.primary {
		background: linear-gradient(135deg, var(--music-accent), rgba(165, 110, 219, 0.9));
		color: #1a1227;
		border-color: transparent;
		box-shadow: 0 10px 30px var(--music-glow);
	}

	.button.ghost:hover,
	.button.ghost:focus-visible {
		background: rgba(243, 236, 255, 0.12);
	}

	.button.primary:hover,
	.button.primary:focus-visible {
		transform: translateY(-1px);
		box-shadow: 0 12px 32px rgba(226, 183, 109, 0.24);
	}

	.hero-art {
		justify-self: center;
	}

	.vinyl {
		width: 180px;
		height: 180px;
		border-radius: 50%;
		background: radial-gradient(
			circle at 30% 30%,
			var(--music-vinyl-mid) 0 40%,
			var(--music-dark) 70%,
			var(--music-base) 100%
		);
		position: relative;
		box-shadow: 0 24px 40px rgba(0, 0, 0, 0.3);
		display: grid;
		place-items: center;
	}

	.vinyl::after {
		content: '';
		position: absolute;
		inset: 20px;
		border: 2px solid rgba(255, 255, 255, 0.05);
		border-radius: 50%;
	}

	.label {
		width: 70px;
		height: 70px;
		border-radius: 50%;
		background: var(--music-accent);
		display: grid;
		place-items: center;
		font-weight: 700;
		color: var(--music-text-contrast);
	}

	.section-header {
		margin-bottom: 20px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	h2 {
		font-size: 1.4rem;
	}

	.section-sub {
		color: var(--color-text-secondary);
	}

	.song-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.song-card {
		border: 1px solid var(--color-background-secondary);
		border-radius: 12px;
		padding: 14px 14px 10px;
		background: var(--music-surface);
		box-shadow: 0 10px 24px rgba(43, 31, 58, 0.06);
		transition:
			border-color 0.15s ease,
			transform 0.15s ease;
	}

	.song-card:hover {
		border-color: var(--music-border);
		transform: translateY(-1px);
	}

	.song-row {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 10px;
		cursor: pointer;
	}

	.rank {
		width: 44px;
		height: 44px;
		border-radius: 12px;
		background: var(--music-soft);
		display: grid;
		place-items: center;
		font-weight: 700;
		color: var(--music-base);
	}

	.song-title {
		font-weight: 700;
		color: var(--color-text-primary);
		text-decoration: none;
	}

	.song-title:hover,
	.song-title:focus-visible {
		text-decoration: underline;
	}

	.song-meta {
		color: var(--color-text-secondary);
		font-size: 0.9rem;
	}

	.note-toggle {
		display: none;
		font-size: 0.9rem;
		color: var(--music-base);
		background: var(--music-surface-soft);
		border-radius: 999px;
		padding: 6px 10px;
		border: 1px solid var(--music-border);
		cursor: pointer;
	}

	.note {
		max-height: 0;
		overflow: hidden;
		transition: max-height 0.25s ease;
		color: var(--music-text-strong);
		margin: 8px 4px 4px 58px;
		line-height: 1.4;
	}

	.song-card:hover .note,
	.song-card:focus-within .note,
	.song-card.open .note {
		max-height: 120px;
	}

	.album-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 16px;
	}

	.album-card {
		border: 1px solid var(--color-background-secondary);
		border-radius: 14px;
		overflow: hidden;
		background: var(--music-surface);
		box-shadow: 0 10px 22px rgba(43, 31, 58, 0.06);
		display: flex;
		flex-direction: column;
	}

	.album-card img {
		width: 100%;
		height: 200px;
		object-fit: cover;
	}

	.album-body {
		padding: 12px;
		display: grid;
		gap: 6px;
	}

	.album-artist {
		color: var(--music-text-muted);
	}

	.album-note {
		color: var(--color-text-primary);
	}

	.performance-card {
		border: 1px solid var(--color-background-secondary);
		border-radius: 14px;
		padding: 16px;
		background: var(--music-base);
		color: #f3ecff;
		box-shadow: 0 14px 28px rgba(43, 31, 58, 0.25);
	}

	.performance-where {
		color: #d8cde5;
		margin-top: 4px;
	}

	.performance-note {
		margin-top: 12px;
		color: #f3ecff;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 18px;
	}

	.bars {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 10px;
	}

	.bar-label {
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: var(--color-text-primary);
	}

	.bar-track {
		height: 10px;
		background: var(--music-border);
		border-radius: 999px;
		overflow: hidden;
	}

	.bar-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--music-accent-2), var(--music-accent));
		border-radius: inherit;
	}

	.artist-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 10px;
	}

	.artist-list li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 12px;
		border-radius: 10px;
		background: var(--music-surface-soft);
		border: 1px solid var(--music-border);
	}

	.badge {
		background: var(--music-base);
		color: #f4e8c1;
		border-radius: 999px;
		padding: 4px 10px;
		font-weight: 700;
	}

	.playlist {
		border: 1px solid var(--color-background-secondary);
		border-radius: 14px;
		padding: 12px;
		background: #fdfaff;
		box-shadow: 0 12px 24px rgba(43, 31, 58, 0.08);
	}

	.muted {
		color: var(--color-text-secondary);
	}

	.footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 8px;
		border-top: 1px solid var(--color-background-secondary);
		padding: 16px 0 40px;
		color: var(--color-text-secondary);
	}

	.footer a {
		color: inherit;
	}

	.back-to-top {
		text-decoration: none;
		font-weight: 700;
		color: var(--color-text-primary);
	}

	@media (max-width: 720px) {
		.hero {
			padding: 18px;
		}

		.song-row {
			grid-template-columns: auto 1fr;
		}

		.note-toggle {
			display: inline-flex;
		}
	}
</style>
