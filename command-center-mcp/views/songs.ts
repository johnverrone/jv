import { createView, esc, type View } from './shared';

// Shape from johnverrone/'s GET /api/guitar/songs.
interface Song {
	id: number;
	title: string;
	artist: string;
	difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
	genre: string;
	key: string;
	tuning: string;
	bpm: number;
	capo: number | null;
	progress: string;
	tabLink: string | null;
	notes: string | null;
}

// `progress` is free text on the site; these are the stages offered here,
// plus any other value already in use so a dropdown never hides it.
const STAGES = ['Not Started', 'Learning', 'Polishing', 'Mastered'];

const filters = { query: '', difficulty: '', progress: '' };

createView<Song[]>('guitar-songs', (root, songs, view) => {
	const stages = [...new Set([...STAGES, ...songs.map((s) => s.progress)])];
	const count = (p: string) => songs.filter((s) => s.progress === p).length;

	root.innerHTML = `
		<header class="row spread">
			<h1>Repertoire</h1>
			<span class="muted">${stages
				.filter(count)
				.map((p) => `${count(p)} ${esc(p.toLowerCase())}`)
				.join(' · ')}</span>
		</header>
		<div class="row filters">
			<input type="search" id="q" placeholder="Search title or artist" value="${esc(filters.query)}" />
			<select id="difficulty">
				<option value="">All levels</option>
				${['Beginner', 'Intermediate', 'Advanced'].map((d) => `<option${d === filters.difficulty ? ' selected' : ''}>${d}</option>`).join('')}
			</select>
			<select id="progress">
				<option value="">Any progress</option>
				${stages.map((p) => `<option${p === filters.progress ? ' selected' : ''}>${esc(p)}</option>`).join('')}
			</select>
		</div>
		<ul class="songs"></ul>
	`;

	const list = root.querySelector<HTMLUListElement>('.songs')!;
	const draw = () => {
		const q = filters.query.toLowerCase();
		const visible = songs.filter(
			(s) =>
				(!q || `${s.title} ${s.artist}`.toLowerCase().includes(q)) &&
				(!filters.difficulty || s.difficulty === filters.difficulty) &&
				(!filters.progress || s.progress === filters.progress)
		);
		list.innerHTML = visible.length
			? visible.map((s) => songRow(s, stages)).join('')
			: '<li class="muted">No songs match.</li>';
		list.querySelectorAll<HTMLSelectElement>('select[data-song]').forEach((sel) =>
			sel.addEventListener('change', () => setProgress(songs, Number(sel.dataset.song), sel, view))
		);
		list.querySelectorAll<HTMLAnchorElement>('a[data-href]').forEach((a) =>
			a.addEventListener('click', (e) => {
				e.preventDefault();
				view.app.openLink({ url: a.dataset.href! });
			})
		);
	};

	root.querySelector<HTMLInputElement>('#q')!.addEventListener('input', (e) => {
		filters.query = (e.target as HTMLInputElement).value;
		draw();
	});
	for (const key of ['difficulty', 'progress'] as const) {
		root.querySelector<HTMLSelectElement>(`#${key}`)!.addEventListener('change', (e) => {
			filters[key] = (e.target as HTMLSelectElement).value;
			draw();
		});
	}
	draw();
});

async function setProgress(songs: Song[], id: number, sel: HTMLSelectElement, view: View<Song[]>) {
	const song = songs.find((s) => s.id === id)!;
	const previous = song.progress;
	sel.disabled = true;
	try {
		await view.call('guitar_update_song', { id, progress: sel.value });
		view.note(`User changed "${song.title}" progress from ${previous} to ${sel.value} in the repertoire view.`);
		view.render(await view.call<Song[]>('guitar_list_songs'));
	} catch (e) {
		sel.value = previous;
		sel.disabled = false;
		sel.title = e instanceof Error ? e.message : String(e);
	}
}

function songRow(s: Song, stages: string[]) {
	const meta = [
		s.key,
		s.tuning !== 'Standard (EADGBE)' ? s.tuning : null,
		s.capo ? `capo ${s.capo}` : null,
		s.bpm ? `${s.bpm} bpm` : null
	].filter(Boolean);
	return `<li class="song">
		<div class="song-main">
			<div>
				<strong>${esc(s.title)}</strong> <span class="muted">${esc(s.artist)}</span>
				${s.tabLink ? `<a href="#" data-href="${esc(s.tabLink)}" class="small">tab ↗</a>` : ''}
			</div>
			<div class="muted small"><span class="chip ${s.difficulty.toLowerCase()}">${s.difficulty}</span> ${esc(meta.join(' · '))}</div>
		</div>
		<select data-song="${s.id}" aria-label="Progress for ${esc(s.title)}">
			${stages.map((p) => `<option${p === s.progress ? ' selected' : ''}>${esc(p)}</option>`).join('')}
		</select>
	</li>`;
}
