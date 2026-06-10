import type { PageServerLoad } from './$types';
import { getJournalEntries } from '$lib/guitar/api';
import type { JournalEntry } from '$lib/guitar/types';
import { getRounds } from '$lib/golf/api';
import { getAllBeans } from '$lib/coffee/api';
import { getIdeas, getProjects } from '$lib/software/api';

type Settled<T> = { ok: true; data: T } | { ok: false; error: string };

/**
 * Convert a rejection into a value so each widget can fail independently — a
 * raw rejected promise returned from `load` still surfaces as a load error and
 * would blank the whole page.
 */
const settle = <T>(p: Promise<T>): Promise<Settled<T>> =>
	p
		.then((data) => ({ ok: true as const, data }))
		.catch((e) => ({ ok: false as const, error: String(e) }));

export const load: PageServerLoad = ({ fetch }) => {
	// Promises are returned un-awaited under `streamed` so SvelteKit streams each
	// widget's data independently; the slowest/broken domain doesn't block paint.
	return {
		streamed: {
			// Drop the heavy markdown `content` — the widget only needs date/theme/duration.
			guitar: settle(
				getJournalEntries(fetch).then((entries: JournalEntry[]) =>
					entries.map(({ content: _content, ...rest }) => rest)
				)
			),
			golf: settle(getRounds(fetch)),
			coffee: settle(getAllBeans(fetch).then((beans) => beans.filter((b) => b.currently_brewing))),
			software: settle(
				Promise.all([getProjects(fetch), getIdeas(fetch)]).then(([projects, ideas]) => ({
					projects,
					ideas
				}))
			)
		}
	};
};
