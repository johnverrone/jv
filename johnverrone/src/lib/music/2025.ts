export interface Song {
	rank: number;
	title: string;
	artist: string;
	album?: string;
	note: string;
	spotifyUrl?: string;
}

export interface Album {
	title: string;
	artist: string;
	cover?: string;
	note: string;
}

export interface GenreSlice {
	label: string;
	percent: number;
}

export interface Performance {
	artist: string;
	venue: string;
	link: string;
	note: string;
}

export interface MusicYearData {
	title: string;
	subtitle: string;
	playlistUrl: string;
	playlistId: string;
	songs: Song[];
	albums: Album[];
	genreMix: GenreSlice[];
	favoritePerformance?: Performance;
}

const playlistUrl =
	'https://open.spotify.com/playlist/7gDoQILUmrlZbRJKhArIA6?si=21f4755b3f12430b&pt=82f03efa47bc516346c96b7b1393b72e';

export const music2025: MusicYearData = {
	title: 'Music Week 2025',
	subtitle:
		"Your boy does it again. Another year of angsty, emotional heartbreak music that doesn't match the personal feelings at all. But it bangs. Get ready for some loud feelings and turn that shit to 11.",
	playlistUrl,
	playlistId: '7gDoQILUmrlZbRJKhArIA6',
	songs: [
		{
			rank: 1,
			title: 'cliche',
			artist: 'mgk',
			album: 'lost americana',
			note: 'Carried me through countless night drives with its shimmering chorus.',
			spotifyUrl: 'https://open.spotify.com/track/placeholder-midnight-signal'
		},
		{
			rank: 2,
			title: 'MAD',
			artist: 'Martin Garrix, Lauv',
			album: 'Skywriting',
			note: 'A hopeful slow-burn that felt like a compass during chaotic weeks.',
			spotifyUrl: 'https://open.spotify.com/track/placeholder-north-star'
		},
		{
			rank: 3,
			title: 'Loose Threads',
			artist: 'Velvet Theory',
			album: 'Patchwork',
			note: 'That bassline plus the handclaps—instant dopamine.',
			spotifyUrl: 'https://open.spotify.com/track/placeholder-loose-threads'
		},
		{
			rank: 4,
			title: 'Seabright',
			artist: 'June Harbor',
			album: 'Tidepools',
			note: 'Warm guitars and salt-air nostalgia; my Sunday morning ritual.',
			spotifyUrl: 'https://open.spotify.com/track/placeholder-seabright'
		},
		{
			rank: 5,
			title: 'Paper Planes (2025 mix)',
			artist: 'Aiko & The Satellites',
			album: 'Reprints',
			note: 'An airy remix that somehow made an old favorite feel brand new.',
			spotifyUrl: 'https://open.spotify.com/track/placeholder-paper-planes'
		},
		{
			rank: 6,
			title: 'Switchback',
			artist: 'Hillcrest Run',
			album: 'Summit Club',
			note: 'Perfectly timed beat drops for trail runs; never got old.',
			spotifyUrl: 'https://open.spotify.com/track/placeholder-switchback'
		},
		{
			rank: 7,
			title: 'Soft Landing',
			artist: 'Marisol Keane',
			album: 'Windowseat',
			note: 'A calm exhale after long days; strings that feel like sunlight.',
			spotifyUrl: 'https://open.spotify.com/track/placeholder-soft-landing'
		},
		{
			rank: 8,
			title: 'Downtown Static',
			artist: 'Analog Alley',
			album: 'Frequencies',
			note: 'Gritty synths that made every commute feel cinematic.',
			spotifyUrl: 'https://open.spotify.com/track/placeholder-downtown-static'
		},
		{
			rank: 9,
			title: 'Goldenhour',
			artist: 'Cielo Verde',
			album: 'Canyon Echoes',
			note: 'Acoustic glow with a subtle electronic heartbeat—great for sunsets.',
			spotifyUrl: 'https://open.spotify.com/track/placeholder-goldenhour'
		},
		{
			rank: 10,
			title: 'Palette Knife',
			artist: 'Studio Season',
			album: 'Wet Paint',
			note: 'Playful indie-pop with percussive surprises; kept me grinning.',
			spotifyUrl: 'https://open.spotify.com/track/placeholder-palette-knife'
		}
	],
	albums: [
		{
			title: 'Glass Cities',
			artist: 'Neon Lanes',
			cover: '/images/music/2025/glass-cities.svg',
			note: 'A neon-soaked ride that still leaves room to breathe.'
		},
		{
			title: 'Tidepools',
			artist: 'June Harbor',
			cover: '/images/music/2025/tidepools.svg',
			note: 'Beachlight folk that pairs perfectly with coffee and rain.'
		},
		{
			title: 'Patchwork',
			artist: 'Velvet Theory',
			cover: '/images/music/2025/patchwork.svg',
			note: 'Layered grooves, endlessly relistenable.'
		},
		{
			title: 'Summit Club',
			artist: 'Hillcrest Run',
			cover: '/images/music/2025/summit-club.svg',
			note: 'Built for motion; kept my cadence steady.'
		},
		{
			title: 'Windowseat',
			artist: 'Marisol Keane',
			cover: '/images/music/2025/windowseat.svg',
			note: 'Soft strings and citylights; ideal travel companion.'
		}
	],
	genreMix: [
		{ label: 'Indie pop', percent: 28 },
		{ label: 'Synthwave', percent: 18 },
		{ label: 'Alt R&B', percent: 14 },
		{ label: 'Indie folk', percent: 16 },
		{ label: 'Electronica', percent: 12 },
		{ label: 'Other', percent: 12 }
	],
	favoritePerformance: {
		artist: 'Gracie Abrams',
		venue: 'Red Rocks Amphitheatre',
		link: 'https://tv.apple.com/us/movie/apple-music-live-gracie-abrams/umc.cmc.6nxzlu368uol0e31d2diszv7i',
		note: 'Flooded the room with analog synth warmth and a wild light show; left grinning for days.'
	}
};

export const defaultTrackSearch = (title: string, artist: string) =>
	`https://open.spotify.com/search/${encodeURIComponent(`${title} ${artist}`)}`;
