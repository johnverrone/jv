export interface Song {
	rank: number;
	title: string;
	artist: string[];
	album?: string;
	spotifyUrl?: string;
	drinkPairing?: string;
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
			title: 'cliché',
			artist: ['mgk'],
			album: 'lost americana',
			drinkPairing: 'Black Cherry Whiskey Coke'
		},
		{
			rank: 2,
			title: 'MAD',
			artist: ['Martin Garrix', 'Lauv'],
			album: 'MAD',
			drinkPairing: 'Vodka Soda with Lime'
		},
		{
			rank: 3,
			title: 'Die For Me',
			artist: ['A Day To Remember'],
			album: 'Big Ole Album Vol. 1',
			drinkPairing: 'Ice Cold Coors Light'
		},
		{
			rank: 4,
			title: 'What Was That',
			artist: ['Lorde'],
			album: 'What Was That',
			drinkPairing: 'Natural Red Wine'
		},
		{
			rank: 5,
			title: "Will You Love Me When I'm Dead",
			artist: ['Amira Elfeky'],
			album: "Will You Love Me When I'm Dead",
			drinkPairing: 'Smoked Mezcal Negroni'
		},
		{
			rank: 6,
			title: 'All My Friends',
			artist: ['A Day To Remember'],
			album: 'Big Ole Album Vol. 1',
			drinkPairing: 'Tequila Shot and a Pitcher of Beer'
		},
		{
			rank: 7,
			title: 'Whatevrrrr',
			artist: ['Spacey Jane'],
			album: 'If That Makes Sense',
			drinkPairing: 'Iced Vanilla Latte'
		},
		{
			rank: 8,
			title: 'DAISIES',
			artist: ['Justin Bieber'],
			album: 'SWAG',
			drinkPairing: 'Aperol Spritz'
		},
		{
			rank: 9,
			title: 'SPEED DEMON',
			artist: ['Justin Bieber'],
			album: 'SWAG II',
			drinkPairing: 'Espresso Martini'
		},
		{
			rank: 10,
			title: 'vampire diaries',
			artist: ['mgk'],
			album: 'lost americana',
			drinkPairing: 'Cheap Red Wine in Stemless Glass'
		},
		{
			rank: 11,
			title: 'Slow Motion',
			artist: ['Marshmello', 'Jonas Brothers'],
			album: 'Slow Motion',
			drinkPairing: 'Gin & Tonic'
		},
		{
			rank: 12,
			title: 'TIT FOR TAT',
			artist: ['Tate McRae'],
			album: 'TIT FOR TAT',
			drinkPairing: 'Spicy Margarita'
		},
		{
			rank: 13,
			title: 'Blowing Smoke',
			artist: ['Gracie Abrams'],
			album: 'The Secret of Us',
			drinkPairing: 'Chamomile Tea'
		},
		{
			rank: 14,
			title: 'Story Of My Life (feat. Trippie Redd)',
			artist: ['ILLENIUM', 'Sueco', 'Trippie Redd'],
			album: 'Story Of My Life (feat. Trippie Redd)',
			drinkPairing: 'Twisted Tea'
		},
		{
			rank: 15,
			title: 'Say That You Love Me',
			artist: ['Letdown.'],
			album: 'Say That You Love Me',
			drinkPairing: 'Whiskey Neat'
		},
		{
			rank: 16,
			title: 'Elizabeth Taylor',
			artist: ['Taylor Swift'],
			album: 'The Life of a Showgirl',
			drinkPairing: 'French 75'
		},
		{
			rank: 17,
			title: 'No Broke Boys - AVELLO Remix',
			artist: ['Disco Lines', 'Tinashe', 'AVELLO'],
			album: 'No Broke Boys (AVELLO Remix)',
			drinkPairing: 'Watermelon High Noon'
		},
		{
			rank: 18,
			title: 'Dolphins',
			artist: ['Drax'],
			album: 'Dolphins',
			drinkPairing: 'Cold Brew'
		},
		{
			rank: 19,
			title: 'The Fate of Ophelia',
			artist: ['Taylor Swift'],
			album: 'The Life of a Showgirl',
			drinkPairing: 'Gin High Five'
		},
		{
			rank: 20,
			title: 'Trippin',
			artist: ['LYVIA'],
			album: 'Trippin',
			drinkPairing: 'Paloma'
		},
		{
			rank: 21,
			title: 'cliché - sad version',
			artist: ['mgk'],
			album: 'cliché (sad version)',
			drinkPairing: 'Hot Black Coffee'
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
