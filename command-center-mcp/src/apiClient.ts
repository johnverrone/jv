export interface CommandCenterClientOptions {
	baseUrl: string;
	token: string;
}

export class CommandCenterApiError extends Error {}

/** Thin wrapper over johnverrone.com's /api/coach/* and /api/guitar/* contracts. No local state. */
export class CommandCenterClient {
	constructor(private opts: CommandCenterClientOptions) {}

	private async request(path: string, init: RequestInit = {}) {
		const res = await fetch(`${this.opts.baseUrl}${path}`, {
			...init,
			headers: {
				...init.headers,
				Authorization: `Bearer ${this.opts.token}`,
				...(init.body ? { 'Content-Type': 'application/json' } : {})
			}
		});
		const body = await res.json().catch(() => null);
		if (!res.ok) {
			const message = (body as { error?: string } | null)?.error ?? res.statusText;
			throw new CommandCenterApiError(`${path} → ${res.status}: ${message}`);
		}
		return body;
	}

	// --- Coach ---

	getToday(date?: string) {
		return this.request(`/api/coach/today${date ? `?date=${date}` : ''}`);
	}

	getSummary(days?: number) {
		return this.request(`/api/coach/summary${days ? `?days=${days}` : ''}`);
	}

	getPlan() {
		return this.request('/api/coach/plan');
	}

	updatePlanSession(body: Record<string, unknown>) {
		return this.request('/api/coach/plan', { method: 'POST', body: JSON.stringify(body) });
	}

	logWorkout(body: Record<string, unknown>) {
		return this.request('/api/coach/log/workout', { method: 'POST', body: JSON.stringify(body) });
	}

	logHabit(body: Record<string, unknown>) {
		return this.request('/api/coach/log/habit', { method: 'POST', body: JSON.stringify(body) });
	}

	postCheckin(body: Record<string, unknown>) {
		return this.request('/api/coach/checkin', { method: 'POST', body: JSON.stringify(body) });
	}

	// --- Guitar ---

	getGuitarJournal(date?: string) {
		return this.request(`/api/guitar/journal${date ? `?date=${date}` : ''}`);
	}

	updateGuitarJournalEntry(body: Record<string, unknown>) {
		return this.request('/api/guitar/journal', { method: 'POST', body: JSON.stringify(body) });
	}

	getGuitarPlan() {
		return this.request('/api/guitar/plan');
	}

	updateGuitarPlan(content: string) {
		return this.request('/api/guitar/plan', { method: 'POST', body: JSON.stringify({ content }) });
	}

	listGuitarSongs() {
		return this.request('/api/guitar/songs');
	}

	updateGuitarSong(body: Record<string, unknown>) {
		return this.request('/api/guitar/songs', { method: 'POST', body: JSON.stringify(body) });
	}
}
