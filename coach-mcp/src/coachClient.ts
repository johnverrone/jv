export interface CoachClientOptions {
	baseUrl: string;
	token: string;
}

export class CoachApiError extends Error {}

/** Thin wrapper over the johnverrone.com /api/coach/* contract. No local state. */
export class CoachClient {
	constructor(private opts: CoachClientOptions) {}

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
			throw new CoachApiError(`${path} → ${res.status}: ${message}`);
		}
		return body;
	}

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
}
