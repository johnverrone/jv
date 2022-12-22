import Head from 'next/head';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import { Text } from '../components/Text';
import css from './evergreen.module.scss';

type ThingToDo = {
  name: string;
  description: ReactNode;
  location: string;
  link: string;
};

const food: ThingToDo[] = [
  {
    name: 'Murphys',
    description: `Cozy creekside restaurant with cocktails and elevated bar food. Our favorites are the sangria and bison burgers with tots!`,
    location: 'Downtown Evergreen',
    link: 'https://goo.gl/maps/eeLdHUYKiGz6fPDy8',
  },
  {
    name: 'Lariatt Lodge',
    description: `A microbrewery with great pretzels, burgers, fries, and beer.
    Perched on a little hill with some biergarten-style outdoor
    seating and plenty of TVs indoor, this is a perfect spot for
    some casual grub or to catch a game.`,
    location: '3 minutes from Evergreen',
    link: 'https://goo.gl/maps/7DiLDcyxvH1d5de29',
  },
  {
    name: "Kiki's Bowls",
    description: `Fresh poke, juices, and acai bowls. Quick and easy and best for
    a pickup order.`,
    location: 'Downtown Evergreen',
    link: 'https://goo.gl/maps/1QEBgeiCvQ8wfMZw8',
  },
  {
    name: 'Wildflower Cafe',
    description: `Brunch spot with insane skillets, benedicts, and omelettes. They serve booze too so post up here with a mimosa or a bloody
    mary to really get the day started. It's usually pretty busy so expect a bit of a wait, especially if you have a large party.`,
    location: 'Downtown Evergreen',
    link: 'https://goo.gl/maps/pUjvoM3mHg19pi7n7',
  },
  {
    name: 'Muddy Buck',
    description: `Coffee shop in the former historic Evergreen Hotel with cozy
    couches, games, and giant cinnamon rolls.`,
    location: 'Downtown Evergreen',
    link: 'https://goo.gl/maps/AJyha3QWAnfcWUMs7',
  },
];

const hikes: ThingToDo[] = [
  {
    name: 'Three Sisters Park',
    description: `Easy to moderate hikes from this trailhead with great views of Evergreen and Mt. Evans.`,
    location: '6 minutes from Evergreen',
    link: 'https://goo.gl/maps/q2cTgAHfPDcvhekQ8',
  },
  {
    name: 'Bergen Peak',
    description: `Challenging 10+ mile hike starting in Elk Meadow Park that will reward you with some fantastic views.
    You'll need at least 5 - 6 hours to summit Bergen Peak and return to the trailhead so plan accordingly! We recommended
    strolling the trails of Elk Meadow without attempting a Bergen Peak summit if you are looking for something casual.`,
    location: '8 minutes from Evergreen',
    link: 'https://goo.gl/maps/iDpZvwfypiwWaXbY8',
  },
  {
    name: 'Evergreen Golf Course',
    description: `A short and unique golf course that's right along Evergreen lake. Beautiful scenery and you'll usually
    spot some wildlife. You won't need your driver but you will need some creativity to navigate some interesting hole layouts.`,
    location: '4 minutes from Evergreen',
    link: 'https://goo.gl/maps/iDpZvwfypiwWaXbY8',
  },
];

export default function Evergreen({}) {
  return (
    <>
      <Head>
        <title>Molly &amp; John&apos;s Evergreen Guide</title>
        <meta
          name="description"
          content="Molly and John's guide to Evergreen."
        />
      </Head>

      <section className={css.thingsContainer}>
        <div className={css.header}>
          <Text variant="body3" tag="p">
            Here are a few of our favorite things to do in the area.
          </Text>
        </div>

        <div className={css.category}>
          <i className="las la-utensils la-3x"></i>
          <Text variant="heading3">Food & Coffee</Text>
          <ul>
            {food.map((thing) => (
              <ThingToDo key={thing.name} thing={thing} />
            ))}
          </ul>
        </div>
        <div className={css.category}>
          <i className="las la-mountain la-3x"></i>
          <Text variant="heading3">Hike & Golf</Text>
          <ul>
            {hikes.map((thing) => (
              <ThingToDo key={thing.name} thing={thing} />
            ))}
          </ul>
        </div>
        <div className={css.category}>
          <i className="las la-binoculars la-3x"></i>
          <Text variant="heading3">Sightseeing</Text>
          <ul>
            <li>
              <Text variant="heading2">Elk wandering around</Text>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}

interface ThingToDoProps {
  thing: ThingToDo;
}

export const ThingToDo = ({ thing }: ThingToDoProps) => {
  return (
    <li className={css.thing}>
      <Text variant="heading2">{thing.name}</Text>
      <div className={css.locationInfo}>
        <div className={css.iconRow}>
          <i className="las la-map-marker" />
          <Text variant="body3">{thing.location}</Text>
        </div>
        <Link href={thing.link} className="link" target="_blank">
          <Text variant="body3">Map</Text>
        </Link>
      </div>
      <div className={css.description}>
        <Text variant="body2" tag="p">
          {thing.description}
        </Text>
      </div>
    </li>
  );
};
