import { createView, DAY_NAMES, esc, md, MODALITY_ICON, type View } from './shared';

// Shapes from johnverrone/'s GET /api/coach/today (src/lib/server/db/coach.ts).
interface PlanSession {
	id: number;
	dayOfWeek: number;
	name: string;
	modality: string;
	durationMin: number | null;
	prescription: string | null;
	bareMin: string | null;
	bareMinDurationMin: number | null;
}

interface WorkoutLog {
	id: number;
	date: string;
	planSessionId: number | null;
	status: 'done' | 'skipped' | 'modified';
	variant: 'full' | 'bare_min';
	modality: string;
	durationMin: number | null;
	rpe: number | null;
	notes: string | null;
	source: string;
}

interface Today {
	date: string;
	sessions: PlanSession[];
	workouts: WorkoutLog[];
	latestCheckIn: { date: string; type: string; content: string } | null;
	weekAdherence: {
		planned: number;
		done: number;
		pct: number;
		days: { date: string; dayOfWeek: number; sessions: PlanSession[]; logs: WorkoutLog[] }[];
	};
}

const isOptionalDay = (dow: number) => dow === 0 || dow === 6;

createView<Today>('coach-today', (root, data, view) => {
	const { weekAdherence: week } = data;
	const unplanned = data.workouts.filter((w) => !data.sessions.some((s) => s.id === w.planSessionId));

	root.innerHTML = `
		<header class="row spread">
			<div>
				<h1>${esc(formatDate(data.date))}</h1>
				<p class="muted">${week.done} of ${week.planned} planned sessions this week</p>
			</div>
			<div class="ring" style="--pct:${week.pct}"><span>${week.pct}%</span></div>
		</header>

		<ol class="week">${week.days.map((d) => dayCell(d, data.date)).join('')}</ol>

		${data.sessions.length ? data.sessions.map((s) => sessionCard(s, data.workouts)).join('') : '<p class="muted">Nothing planned today.</p>'}

		${unplanned.length ? `<h2>Also logged</h2><ul class="logs">${unplanned.map(logLine).join('')}</ul>` : ''}

		${data.latestCheckIn ? `<details class="card"><summary>Coach check-in · ${esc(data.latestCheckIn.date)}</summary><div class="prose">${md(data.latestCheckIn.content)}</div></details>` : ''}
	`;

	root.querySelectorAll<HTMLFormElement>('form[data-session]').forEach((form) => {
		form.addEventListener('submit', (e) => e.preventDefault());
		form.querySelectorAll<HTMLButtonElement>('button[data-status]').forEach((btn) =>
			btn.addEventListener('click', () => logSession(form, btn, data, view))
		);
	});
});

async function logSession(form: HTMLFormElement, btn: HTMLButtonElement, data: Today, view: View<Today>) {
	const session = data.sessions.find((s) => s.id === Number(form.dataset.session))!;
	const status = btn.dataset.status as WorkoutLog['status'];
	const variant = (btn.dataset.variant ?? 'full') as WorkoutLog['variant'];
	const fd = new FormData(form);
	const rpe = Number(fd.get('rpe')) || undefined;
	const notes = String(fd.get('notes') ?? '').trim() || undefined;
	const duration = variant === 'bare_min' ? session.bareMinDurationMin : session.durationMin;

	form.querySelectorAll('button').forEach((b) => (b.disabled = true));
	try {
		await view.call('coach_log_workout', {
			date: data.date,
			status,
			variant,
			modality: session.modality,
			plan_session_id: session.id,
			...(status !== 'skipped' && duration ? { duration_min: duration } : {}),
			...(status !== 'skipped' && rpe ? { rpe } : {}),
			...(notes ? { notes } : {})
		});
		view.note(
			`User logged "${session.name}" on ${data.date} as ${status}${variant === 'bare_min' ? ' (bare minimum)' : ''}` +
				`${rpe ? `, RPE ${rpe}` : ''}${notes ? `, notes: ${notes}` : ''} via the Today card.`
		);
		view.render(await view.call<Today>('coach_get_today', { date: data.date }));
	} catch (e) {
		form.querySelectorAll('button').forEach((b) => (b.disabled = false));
		form.querySelector('.error')!.textContent = e instanceof Error ? e.message : String(e);
	}
}

function dayCell(day: Today['weekAdherence']['days'][number], today: string) {
	const planned = day.sessions.filter((s) => s.modality !== 'rest');
	const done = day.logs.some((l) => l.status !== 'skipped');
	const skipped = !done && day.logs.some((l) => l.status === 'skipped');
	const past = day.date < today;
	const state = done
		? 'done'
		: skipped
			? 'skipped'
			: past && planned.length && !isOptionalDay(day.dayOfWeek)
				? 'missed'
				: 'open';
	const icon = MODALITY_ICON[(day.logs[0] ?? day.sessions[0])?.modality ?? 'rest'] ?? '';
	const title = day.sessions.map((s) => s.name).join(', ') || 'Nothing planned';
	return `<li class="day ${state}${day.date === today ? ' today' : ''}" title="${esc(title)}">
		<span class="dow">${DAY_NAMES[day.dayOfWeek]}</span>
		<span class="icon">${icon}</span>
		<span class="mark">${state === 'done' ? '✓' : state === 'skipped' ? '–' : state === 'missed' ? '✕' : ''}</span>
	</li>`;
}

function sessionCard(s: PlanSession, workouts: WorkoutLog[]) {
	const logs = workouts.filter((w) => w.planSessionId === s.id);
	const header = `
		<div class="row spread">
			<h2>${MODALITY_ICON[s.modality] ?? ''} ${esc(s.name)}</h2>
			${s.durationMin ? `<span class="chip">${s.durationMin} min</span>` : ''}
		</div>`;
	const body = `
		<details${logs.length ? '' : ' open'}>
			<summary>Prescription</summary>
			<div class="prose">${md(s.prescription)}</div>
		</details>
		${s.bareMin ? `<p class="muted small"><strong>Bare minimum:</strong> ${esc(s.bareMin)}</p>` : ''}`;

	if (logs.length) {
		return `<section class="card">${header}<ul class="logs">${logs.map(logLine).join('')}</ul>${body}</section>`;
	}
	if (s.modality === 'rest') return `<section class="card">${header}${body}</section>`;

	return `<section class="card">${header}${body}
		<form data-session="${s.id}" class="log-form">
			<div class="row">
				<label>RPE <select name="rpe"><option value="">–</option>${Array.from({ length: 10 }, (_, i) => `<option>${i + 1}</option>`).join('')}</select></label>
				<input name="notes" placeholder="Notes (loads, how it felt…)" />
			</div>
			<div class="row">
				<button type="button" class="primary" data-status="done">Done</button>
				${s.bareMin ? '<button type="button" data-status="done" data-variant="bare_min">Bare min</button>' : ''}
				<button type="button" data-status="modified">Modified</button>
				<button type="button" class="ghost" data-status="skipped">Skip</button>
			</div>
			<p class="error"></p>
		</form>
	</section>`;
}

function logLine(w: WorkoutLog) {
	const bits = [
		w.variant === 'bare_min' ? 'bare min' : null,
		w.durationMin ? `${w.durationMin} min` : null,
		w.rpe ? `RPE ${w.rpe}` : null,
		w.source !== 'manual' && w.source !== 'api' ? w.source : null
	].filter(Boolean);
	return `<li><span class="status ${w.status}">${w.status}</span> ${MODALITY_ICON[w.modality] ?? ''} ${esc(bits.join(' · '))}${w.notes ? `<div class="muted small">${esc(w.notes)}</div>` : ''}</li>`;
}

function formatDate(iso: string) {
	return new Date(`${iso}T12:00:00`).toLocaleDateString(undefined, {
		weekday: 'long',
		month: 'short',
		day: 'numeric'
	});
}
