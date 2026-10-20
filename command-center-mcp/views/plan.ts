import { createView, DAY_NAMES, esc, md, MODALITY_ICON } from './shared';

// Shape from johnverrone/'s GET /api/coach/plan.
interface PlanSession {
	id: number;
	dayOfWeek: number;
	sortOrder: number;
	name: string;
	modality: string;
	durationMin: number | null;
	prescription: string | null;
	bareMin: string | null;
	bareMinDurationMin: number | null;
	active: boolean;
}

const FULL_DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** Monday-first, matching the site's DAY_ORDER. */
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

createView<PlanSession[]>('coach-plan', (root, sessions, view) => {
	const totalMin = sessions.filter((s) => s.active).reduce((n, s) => n + (s.durationMin ?? 0), 0);

	root.innerHTML = `
		<header class="row spread">
			<h1>Weekly plan</h1>
			<span class="muted">${(totalMin / 60).toFixed(1)} h planned</span>
		</header>
		<div class="plan">
			${DAY_ORDER.map((dow) => {
				const day = sessions.filter((s) => s.dayOfWeek === dow).sort((a, b) => a.sortOrder - b.sortOrder);
				return `<section class="plan-day">
					<h3>${DAY_NAMES[dow]}</h3>
					${day.length ? day.map(sessionCard).join('') : '<p class="muted small">—</p>'}
				</section>`;
			}).join('')}
		</div>
		<div id="detail"></div>
	`;

	const detail = root.querySelector<HTMLElement>('#detail')!;
	root.querySelectorAll<HTMLButtonElement>('button[data-session]').forEach((btn) =>
		btn.addEventListener('click', () => {
			const s = sessions.find((x) => x.id === Number(btn.dataset.session))!;
			root.querySelectorAll('button[data-session]').forEach((b) => b.classList.toggle('selected', b === btn));
			detail.innerHTML = `
				<section class="card">
					<div class="row spread">
						<h2>${MODALITY_ICON[s.modality] ?? ''} ${DAY_NAMES[s.dayOfWeek]} · ${esc(s.name)}</h2>
						${s.durationMin ? `<span class="chip">${s.durationMin} min</span>` : ''}
					</div>
					<div class="prose">${md(s.prescription)}</div>
					${s.bareMin ? `<p class="muted small"><strong>Bare minimum${s.bareMinDurationMin ? ` (${s.bareMinDurationMin} min)` : ''}:</strong> ${esc(s.bareMin)}</p>` : ''}
					<div class="row">
						<button type="button" class="primary" id="adjust">Adjust with Claude</button>
					</div>
				</section>`;
			detail.querySelector('#adjust')!.addEventListener('click', () =>
				view.app.sendMessage({
					role: 'user',
					content: [
						{
							type: 'text',
							text: `Let's adjust ${FULL_DAY_NAMES[s.dayOfWeek]}'s "${s.name}" session (plan session id ${s.id}).`
						}
					]
				})
			);
		})
	);
});

function sessionCard(s: PlanSession) {
	return `<button type="button" class="plan-session${s.active ? '' : ' inactive'}" data-session="${s.id}">
		<span class="icon">${MODALITY_ICON[s.modality] ?? ''}</span>
		<span class="name">${esc(s.name)}</span>
		${s.durationMin ? `<span class="muted small">${s.durationMin}m</span>` : ''}
	</button>`;
}
