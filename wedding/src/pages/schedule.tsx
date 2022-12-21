import Head from 'next/head';
import React from 'react';
import { Calendar, WeddingEvent } from '../components/Calendar';
import { Text } from '../components/Text';
import css from './schedule.module.scss';

const events: WeddingEvent[] = [
  {
    id: 'golf',
    name: 'Golf Event (optional)',
    location: 'Hiwan Golf Club',
    locationUrl: 'https://g.page/Hiwan?share',
    description:
      "A fun round of golf at Hiwan Golf Club. We ask you pay the cost to cover greens fees. Maybe a fun game format with some light gambling will be in store? More details to come. Don't forget to accept 'Friday Golf Round' in your RSVP if interested so can book the appropriate number of tee times.",
    startTime: new Date(2023, 7, 25, 8),
    endTime: new Date(2023, 7, 25, 13),
    day: 'Friday',
    emoji: '🏌️‍♂️',
  },
  {
    id: 'welcome-party',
    name: 'Welcome Party',
    location: 'Revival Brewing',
    description:
      'Join us for drinks and jolly good times in downtown Evergreen as we kick off the weekend!',
    startTime: new Date(2023, 7, 25, 18),
    endTime: new Date(2023, 7, 25, 21),
    day: 'Friday',
    emoji: '🥳',
  },
  {
    id: 'ceremony',
    name: 'Ceremony & Reception',
    location: 'Hiwan Golf Club',
    locationUrl: 'https://g.page/Hiwan?share',
    description:
      "Y'all know the drill! The big event! Dinner, drinks, and dancing to follow the ceremony.",
    startTime: new Date(2023, 7, 26, 16),
    endTime: new Date(2023, 7, 26, 22),
    day: 'Saturday',
    emoji: '👰‍♀️',
  },
  {
    id: 'afterparty',
    name: 'After Party',
    location: 'Little Bear Saloon',
    description:
      'Join us late night at the classic divey mountain saloon as we sip on some yellow bellies and continue dancing. Word on the street there are bras and dollar bills hanging from the walls of this joint!',
    startTime: new Date(2023, 7, 26, 22, 30),
    endTime: new Date(2023, 7, 26, 24),
    day: 'Saturday',
    emoji: '💃🏼',
  },
];

export default function Schedule({}) {
  return (
    <>
      <Head>
        <title>Molly &amp; John&apos;s Wedding Schedule</title>
        <meta
          name="description"
          content="Schedule of Molly and John's wedding."
        />
      </Head>

      <section className={css.calendarContainer}>
        <div className={css.header}>
          <Text variant="body3" tag="p">
            Tap on an event to see more details.
          </Text>
        </div>
        <Calendar events={events} />
      </section>
    </>
  );
}
