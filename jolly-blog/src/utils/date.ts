import { Post } from '../lib/journals';

export const formatDate = (date: Post['date']): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const start = new Date(date.start).toLocaleDateString('en-US', options);
  const end = date.end
    ? ` - ${new Date(date.end).toLocaleDateString('en-US', options)}`
    : '';
  return start + end;
};
