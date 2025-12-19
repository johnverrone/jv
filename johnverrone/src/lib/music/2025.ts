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
	spotifyUrl?: string;
}

export interface Performance {
	artist: string;
	venue: string;
	link: string;
	sampleLink?: string;
	image: string;
	note: string;
}

export interface MusicYearData {
	title: string;
	subtitle: string;
	playlistUrl: string;
	playlistId: string;
	songs: Song[];
	albums: Album[];
	favoritePerformance?: Performance;
}

const playlistUrl =
	'https://open.spotify.com/playlist/7gDoQILUmrlZbRJKhArIA6?si=21f4755b3f12430b&pt=82f03efa47bc516346c96b7b1393b72e';

export const music2025: MusicYearData = {
	title: 'Music Week 2025',
	subtitle:
		"Your boy does it again. Another year of angsty, emotional heartbreak music that doesn't match the personal feelings at all. But it bangs. Get ready for some feelings if you actually listen to lyrics or just get ready to dance if you don't. Turn that shit to 11 and enjoy.",
	playlistUrl,
	playlistId: '7gDoQILUmrlZbRJKhArIA6',
	songs: [
		{
			rank: 1,
			title: 'cliché',
			artist: ['mgk'],
			album: 'lost americana',
			drinkPairing: 'Black Cherry Whiskey Coke',
			spotifyUrl: 'https://open.spotify.com/track/0dTdxwwH6FYsJL0l3TgSe2?si=a20ac482dd3b421e'
		},
		{
			rank: 2,
			title: 'MAD',
			artist: ['Martin Garrix', 'Lauv'],
			album: 'MAD',
			drinkPairing: 'Vodka Soda with Lime',
			spotifyUrl: 'https://open.spotify.com/track/6vM1GSndPtQk7AmqEmNAPH?si=52b06447499244a6'
		},
		{
			rank: 3,
			title: 'Die For Me',
			artist: ['A Day To Remember'],
			album: 'Big Ole Album Vol. 1',
			drinkPairing: 'Ice Cold Coors Light',
			spotifyUrl: 'https://open.spotify.com/track/6QaYsGdXgLWg8U9S1WYOn9?si=9c41e8069c82487d'
		},
		{
			rank: 4,
			title: 'What Was That',
			artist: ['Lorde'],
			album: 'What Was That',
			drinkPairing: 'Natural Red Wine',
			spotifyUrl: 'https://open.spotify.com/track/2jNyiavSywmA472t2m6ZBz?si=4a9e0e20ac5a4472'
		},
		{
			rank: 5,
			title: "Will You Love Me When I'm Dead",
			artist: ['Amira Elfeky'],
			album: "Will You Love Me When I'm Dead",
			drinkPairing: 'Smoked Mezcal Negroni',
			spotifyUrl: 'https://open.spotify.com/track/4z4JQxp5ddY3Z8ETnaPPAK?si=4a164df72ee5446d'
		},
		{
			rank: 6,
			title: 'All My Friends',
			artist: ['A Day To Remember'],
			album: 'Big Ole Album Vol. 1',
			drinkPairing: 'Tequila Shot and a Pitcher of Beer',
			spotifyUrl: 'https://open.spotify.com/track/2wdqcce0DKklq4aSD8zADU?si=6a6b9fd5fc424488'
		},
		{
			rank: 7,
			title: 'Whatevrrrr',
			artist: ['Spacey Jane'],
			album: 'If That Makes Sense',
			drinkPairing: 'Iced Vanilla Latte',
			spotifyUrl: 'https://open.spotify.com/track/7rmqj2wCUD7rmeFLrcEfNC?si=2e417b6d7ccd4024'
		},
		{
			rank: 8,
			title: 'DAISIES',
			artist: ['Justin Bieber'],
			album: 'SWAG',
			drinkPairing: 'Aperol Spritz',
			spotifyUrl: 'https://open.spotify.com/track/5BZsQlgw21vDOAjoqkNgKb?si=dda5ba119d394e9f'
		},
		{
			rank: 9,
			title: 'SPEED DEMON',
			artist: ['Justin Bieber'],
			album: 'SWAG II',
			drinkPairing: 'Espresso Martini',
			spotifyUrl: 'https://open.spotify.com/track/4YmS7BALpAU0h4EAF4fYuh?si=14fa65f2b941431a'
		},
		{
			rank: 10,
			title: 'vampire diaries',
			artist: ['mgk'],
			album: 'lost americana',
			drinkPairing: 'Cheap Red Wine in Stemless Glass',
			spotifyUrl: 'https://open.spotify.com/track/0cm2GfvNOuNUdvuVJ6vSgu?si=ea33f18029884f27'
		},
		{
			rank: 11,
			title: 'Slow Motion',
			artist: ['Marshmello', 'Jonas Brothers'],
			album: 'Slow Motion',
			drinkPairing: 'Gin & Tonic',
			spotifyUrl: 'https://open.spotify.com/track/2xijXb00w9o7Ol04MPCL6c?si=af92bae56b4a4eb6'
		},
		{
			rank: 12,
			title: 'TIT FOR TAT',
			artist: ['Tate McRae'],
			album: 'TIT FOR TAT',
			drinkPairing: 'Spicy Margarita',
			spotifyUrl: 'https://open.spotify.com/track/04a44cx2PJthIbN2aLMXhl?si=81273a612edf4045'
		},
		{
			rank: 13,
			title: 'Blowing Smoke',
			artist: ['Gracie Abrams'],
			album: 'The Secret of Us',
			drinkPairing: 'Chamomile Tea',
			spotifyUrl: 'https://open.spotify.com/track/7Eg4LsQTM6QOqeCS8EihZI?si=13281d198bbd423f'
		},
		{
			rank: 14,
			title: 'Story Of My Life (feat. Trippie Redd)',
			artist: ['ILLENIUM', 'Sueco', 'Trippie Redd'],
			album: 'Story Of My Life (feat. Trippie Redd)',
			drinkPairing: 'Twisted Tea',
			spotifyUrl: 'https://open.spotify.com/track/1g7j5AxiNKTGjryhFIlAsA?si=e3a93496ecab490f'
		},
		{
			rank: 15,
			title: 'Say That You Love Me',
			artist: ['Letdown.'],
			album: 'Say That You Love Me',
			drinkPairing: 'Whiskey Neat',
			spotifyUrl: 'https://open.spotify.com/track/5kcAl2B3o7oM26BCQVggKl?si=5da972f4f343413b'
		},
		{
			rank: 16,
			title: 'Elizabeth Taylor',
			artist: ['Taylor Swift'],
			album: 'The Life of a Showgirl',
			drinkPairing: 'French 75',
			spotifyUrl: 'https://open.spotify.com/track/1jgTiNob5cVyXeJ3WgX5bL?si=3fe449df05074b4a'
		},
		{
			rank: 17,
			title: 'No Broke Boys - AVELLO Remix',
			artist: ['Disco Lines', 'Tinashe', 'AVELLO'],
			album: 'No Broke Boys (AVELLO Remix)',
			drinkPairing: 'Watermelon High Noon',
			spotifyUrl: 'https://open.spotify.com/track/4zXG4SBvsjsW0EN1mjCxaV?si=5b8400aa778b4bec'
		},
		{
			rank: 18,
			title: 'Dolphins',
			artist: ['Drax'],
			album: 'Dolphins',
			drinkPairing: 'Cold Brew',
			spotifyUrl: 'https://open.spotify.com/track/2y1SuYTMnVVE47oftiOrvY?si=273c563df7fc4ed4'
		},
		{
			rank: 19,
			title: 'The Fate of Ophelia',
			artist: ['Taylor Swift'],
			album: 'The Life of a Showgirl',
			drinkPairing: 'Gin High Five',
			spotifyUrl: 'https://open.spotify.com/track/53iuhJlwXhSER5J2IYYv1W?si=ef38b940a6ae445d'
		},
		{
			rank: 20,
			title: 'Reload',
			artist: ['LYVIA'],
			album: 'Reload',
			drinkPairing: 'Paloma',
			spotifyUrl: 'https://open.spotify.com/track/6XM1aJu8c8Mn4Rq6S5GfGp?si=fcd1957e604f4cc5'
		},
		{
			rank: 21,
			title: 'cliché - sad version',
			artist: ['mgk'],
			album: 'cliché (sad version)',
			drinkPairing: 'Hot Black Coffee',
			spotifyUrl: 'https://open.spotify.com/track/6QrWzNrES7eYmM39SmbTL0?si=613781f1852542b7'
		}
	],
	albums: [
		{
			title: 'lost americana',
			artist: 'mgk',
			cover: '/images/music/2025/lost_americana.jpeg',
			spotifyUrl: 'https://open.spotify.com/album/30aIA1FrouOX9kHxP4dEr6?si=qbQBw5bjSTu_98rvne9adQ'
		},
		{
			title: 'Big Ole Album Vol. 1',
			artist: 'A Day To Remember',
			cover: '/images/music/2025/boav1.jpeg',
			spotifyUrl: 'https://open.spotify.com/album/1lAeYgoPZlOyPCudqqmSOg?si=72278761aefa47e8'
		},
		{
			title: 'The Life of a Showgirl',
			artist: 'Taylor Swift',
			cover: '/images/music/2025/tlos.jpeg',
			spotifyUrl: 'https://open.spotify.com/album/4a6NzYL1YHRUgx9e3YZI6I?si=d65e17c7babb422a'
		},
		{
			title: 'SWAG II',
			artist: 'Justin Bieber',
			cover: '/images/music/2025/swagii.jpeg',
			spotifyUrl: 'https://open.spotify.com/album/2KrREEyHxkdFGYAd1DmMdS?si=862411f1e1af41d2'
		}
	],
	favoritePerformance: {
		artist: 'Gracie Abrams',
		venue: 'Red Rocks Amphitheatre',
		link: 'https://tv.apple.com/us/movie/apple-music-live-gracie-abrams/umc.cmc.6nxzlu368uol0e31d2diszv7i',
		sampleLink: 'https://youtu.be/898fwnkHoHg?si=xYUdBkeT5iWdQvUJ',
		image: '/images/music/2025/gracie.webp',
		note: 'Okay you need Apple TV+ to watch this full performance so I included a sample of it from her YouTube. My fave girl playing my fave venue.'
	}
};
