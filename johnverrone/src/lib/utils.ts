type DateStyle = Intl.DateTimeFormatOptions['dateStyle'];

export function formatDate(date: string, dateStyle: DateStyle = 'medium', locales = 'en') {
	const dateToFormat = parseDate(date);
	const dateFormatter = new Intl.DateTimeFormat(locales, { dateStyle, timeZone: 'UTC' });
	return dateFormatter.format(dateToFormat);
}

const parseDate = (date: string): Date => {
	const isoDateOnly = /^(\d{4})-(\d{2})-(\d{2})$/;
	const match = isoDateOnly.exec(date);

	if (match) {
		const [, year, month, day] = match;
		return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
	}

	return new Date(date);
};
