import Head from 'next/head';
import React from 'react';
import { Calendar, ICalendarEvent } from '../components/Calendar';
import { Text } from '../components/Text';
import css from './schedule.module.scss';

const events: ICalendarEvent[] = [
  // {
  //   id: 'golf',
  //   name: 'Golf Event (optional)',
  //   location: 'Hiwan Golf Club',
  //   locationUrl: 'https://g.page/Hiwan?share',
  //   description:
  //     "A fun round of golf at Hiwan Golf Club. We ask you pay the cost to cover greens fees. Maybe a fun game format with some light gambling will be in store? More details to come. Don't forget to accept 'Friday Golf Round' in your RSVP if interested so can book the appropriate number of tee times.",
  //   startTime: new Date(2023, 7, 25, 8),
  //   endTime: new Date(2023, 7, 25, 13),
  //   type: 'wedding',
  // },
  {
    id: 'welcome-party',
    name: 'Welcome Party',
    location: 'The Wild Game Evergreen',
    locationUrl: 'https://goo.gl/maps/rxeWAnAb2TREcyeMA',
    description:
      'Join us for drinks, games, and food in Evergreen as we kick off the weekend!',
    startTime: new Date(2023, 7, 25, 19),
    endTime: new Date(2023, 7, 25, 22),
    attire: 'Casual',
    type: 'wedding',
  },
  // {
  //   id: 'friday-free',
  //   name: 'Free Time',
  //   startTime: new Date(2023, 7, 25, 8),
  //   endTime: new Date(2023, 7, 25, 24),
  //   type: 'free',
  // },
  {
    id: 'ceremony',
    name: 'Ceremony & Reception',
    location: 'Hiwan Golf Club',
    locationUrl: 'https://g.page/Hiwan?share',
    description: (
      <>
        5:00 pm - Ceremony
        <br />
        5:30 pm - Cocktail Hour
        <br />
        6:30 pm - Reception
      </>
    ),
    startTime: new Date(2023, 7, 26, 17),
    endTime: new Date(2023, 7, 26, 23),
    attire: 'Semi-formal',
    type: 'wedding',
  },
  // {
  //   id: 'afterparty',
  //   name: 'After Party',
  //   location: 'Little Bear Saloon',
  //   description:
  //     'Join us late night at the classic divey mountain saloon as we sip on some yellow bellies and continue dancing. Word on the street there are bras and dollar bills hanging from the walls of this joint!',
  //   startTime: new Date(2023, 7, 26, 22, 30),
  //   endTime: new Date(2023, 7, 26, 24),
  //   day: 'Saturday',
  //   emoji: '💃🏼',
  //   type: 'wedding',
  // },
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
