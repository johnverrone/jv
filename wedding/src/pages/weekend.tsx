import Head from 'next/head';
import React from 'react';
import { Waves } from '../components/Waves';
import { Calendar, WeddingEvent } from '../components/Calendar';
import { SectionHeader } from '../components/SectionHeader';
import { Text } from '../components/Text';
import css from './weekend.module.scss';

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

export default function Home({}) {
  return (
    <>
      <Head>
        <title>Molly &amp; John&apos;s Wedding Weekend</title>
        <meta
          name="description"
          content="Weekend schedule and Evergreen guide for Molly and John's wedding."
        />
      </Head>

      <div className={css.weekendContainer}>
        <section className={css.calendarContainer}>
          <SectionHeader title="Schedule">
            <Text variant="body3">
              <i>Tap on an event to see more details.</i>
            </Text>
          </SectionHeader>
          <Calendar events={events} />
        </section>

        <Waves />

        <section className={css.thingsBackground}>
          <div className={css.thingsContainer}>
            <SectionHeader title="Things to Do in Evergreen" />
            <div className={css.category}>
              <Text variant="heading3">Food</Text>
              <ul>
                <li>
                  <Text variant="body3">Murphys</Text>
                </li>
                <li>
                  <Text variant="body3">Lariatt Lodge</Text>
                </li>
                <li>
                  <Text variant="body3">Kiki&apos;s Bowls</Text>
                </li>
              </ul>
            </div>
            <div className={css.category}>
              <Text variant="heading3">Hiking</Text>
              <ul>
                <li>
                  <Text variant="body3">Three Sisters Park</Text>
                </li>
                <li>
                  <Text variant="body3">Bergen Peak</Text>
                </li>
              </ul>
            </div>
            <div className={css.category}>
              <Text variant="heading3">Golf</Text>
              <ul>
                <li>
                  <Text variant="body3">Evergreen Golf Course</Text>
                </li>
              </ul>
            </div>
            <div className={css.category}>
              <Text variant="heading3">Sightseeing</Text>
              <ul>
                <li>
                  <Text variant="body3">Murphys</Text>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <Waves inverted />
      </div>
    </>
  );
}
