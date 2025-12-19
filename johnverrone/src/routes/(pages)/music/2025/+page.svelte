<script lang="ts">
	import { music2025 } from '$lib/music/2025';

	const data = music2025;

	const getYouTubeEmbed = (url: string | undefined) => {
		if (!url) return null;
		try {
			const parsed = new URL(url);
			if (parsed.hostname === 'youtu.be') {
				return `https://www.youtube.com/embed${parsed.pathname}`;
			}
			if (parsed.searchParams.has('v')) {
				return `https://www.youtube.com/embed/${parsed.searchParams.get('v')}`;
			}
			if (parsed.pathname.startsWith('/embed/')) {
				return `https://www.youtube.com${parsed.pathname}`;
			}
		} catch {
			return null;
		}
		return null;
	};
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta name="description" content="contributions to the annual music recap made by JV." />
	<meta property="og:title" content={data.title} />
	<meta property="og:description" content="contributions to the annual music recap made by JV." />
	<meta property="og:image" content="/images/music/2025/jv25.webp" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://johnverrone.com/music/2025" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.title} />
	<meta name="twitter:description" content="contributions to the annual music recap made by JV." />
	<meta name="twitter:image" content="/images/music/2025/jv25.webp" />
</svelte:head>

<div id="top" aria-hidden="true"></div>
<section class="hero">
	<div class="hero-text">
		<p class="eyebrow">Year in Review</p>
		<h1>{data.title}</h1>
		<p class="subtitle">{data.subtitle}</p>
		<p class="subtitle">- jv</p>
		<div class="actions">
			<a class="button primary" href={data.playlistUrl} target="_blank" rel="noreferrer">
				Open Spotify Playlist
			</a>
		</div>
	</div>
	<div class="hero-art">
		<img
			src="/images/music/2025/jv25.webp"
			alt="John Verrone's Top Music of 2025"
			width="300"
			height="300"
		/>
	</div>
</section>

<section aria-labelledby="top-songs">
	<div class="section-header">
		<h2 id="top-songs">Songs</h2>
		<p class="section-sub">
			My favorite twenty to twenty five tracks to wrap up twenty twenty five (with drink pairings).
		</p>
	</div>
	<ol class="song-list">
		{#each data.songs as song}
			<li class="song-card">
				<div class="song-row">
					<div class="rank">#{song.rank}</div>
					<div class="song-info">
						<a
							class="song-title"
							href={song.spotifyUrl}
							target="_blank"
							rel="noreferrer"
							on:click|stopPropagation
						>
							{song.title}
						</a>
						<p class="song-meta">
							{song.artist.join(',')}
							{song.album ? ` · ${song.album}` : ''}
						</p>
					</div>
				</div>
				<p class="note">{song.drinkPairing}</p>
			</li>
		{/each}
	</ol>
</section>

<section aria-labelledby="top-albums">
	<div class="section-header">
		<h2 id="top-albums">Albums</h2>
		<p class="section-sub">
			Unlike the rest of yas, I didn't do too much album listening. In fact, I just went through
			some music articles "top albums of 2025" lists and didn't recognize 99% of them. But I did see
			that Yellowcard dropped an album and I am sad I missed that one.
		</p>
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
				</div>
			</article>
		{/each}
	</div>
</section>

{#if data.favoritePerformance}
	<section aria-labelledby="live-highlight" class="performance">
		<div class="section-header">
			<h2 id="live-highlight">Favorite Live Performance</h2>
		</div>
		<div class="performance-card">
			{#if data.favoritePerformance.image}
				<img
					class="performance-image"
					src={data.favoritePerformance.image}
					alt={`Live performance image for ${data.favoritePerformance.artist}`}
					loading="lazy"
				/>
			{/if}
			<div>
				<h3>{data.favoritePerformance.artist}</h3>
				<p class="performance-where">
					{data.favoritePerformance.venue}
				</p>
			</div>
			<a
				class="performance-link"
				href={data.favoritePerformance.link}
				target="_blank"
				rel="noreferrer"
			>
				Watch on Apple TV+
			</a>
			<p class="performance-note">{data.favoritePerformance.note}</p>
			{#if getYouTubeEmbed(data.favoritePerformance.sampleLink)}
				<div class="performance-video">
					<iframe
						title={`${data.favoritePerformance.artist} performance sample`}
						src={getYouTubeEmbed(data.favoritePerformance.sampleLink)}
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						loading="lazy"
						referrerpolicy="strict-origin-when-cross-origin"
						allowfullscreen
					></iframe>
				</div>
			{/if}
		</div>
	</section>
{/if}

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
			height="720"
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
		--music-base: #1e1016;
		--music-dark: #1e1c1f;
		--music-accent: #e2b76d;
		--music-accent-2: #a56edb;
		--music-soft: #f4ecff;
		--music-surface: #fdfaff;
		--music-surface-soft: #fbf5ff;
		--music-border: #e6d8f3;
		--music-text-strong: #20162e;
		--music-text-muted: #98a39a;
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
		background: var(--music-accent);
		color: #1a1227;
		border-color: transparent;
		box-shadow: 0 10px 30px var(--music-glow);
	}

	.button.primary:hover,
	.button.primary:focus-visible {
		transform: translateY(-1px);
		box-shadow: 0 12px 32px rgba(226, 183, 109, 0.24);
	}

	.hero-art {
		justify-self: center;
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

	.note {
		color: var(--music-text-muted);
		font-size: 0.9rem;
		margin: 16px 4px 4px 4px;
		line-height: 1.4;
		font-style: italic;
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
		height: 400px;
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

	.performance-card {
		border: 1px solid var(--color-background-secondary);
		border-radius: 14px;
		padding: 16px;
		background: var(--music-base);
		color: #f3ecff;
		box-shadow: 0 14px 28px rgba(43, 31, 58, 0.25);
		display: grid;
		gap: 12px;
	}

	.performance-image {
		width: 100%;
		max-height: 320px;
		object-fit: cover;
		border-radius: 12px;
	}

	.performance-where {
		color: #d8cde5;
		margin-top: 4px;
	}

	.performance-note {
		margin-top: 12px;
		color: #f3ecff;
	}

	.performance-link {
		color: var(--music-accent);
		font-weight: 600;
		text-decoration: none;
	}

	.performance-link:hover {
		text-decoration: underline;
	}

	.performance-video {
		width: 100%;
		aspect-ratio: 16 / 9;
		border-radius: 12px;
		overflow: hidden;
		background: #120b15;
	}

	.performance-video iframe {
		width: 100%;
		height: 100%;
		border: 0;
	}

	.playlist {
		border: 1px solid var(--color-background-secondary);
		border-radius: 14px;
		padding: 12px;
		background: #fdfaff;
		box-shadow: 0 12px 24px rgba(43, 31, 58, 0.08);
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
	}
</style>
