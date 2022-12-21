import Head from 'next/head';
import Link from 'next/link';
import React, { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Cloud, Coffee, MapPin } from 'react-feather';
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
    location: 'Downtown Evergreen',
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
    description: `Brunch spot with insane pancakes, omeletes, and hash bowls.`,
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
          <Coffee size={56} strokeWidth={1} />
          <Text variant="heading3">Food & Coffee</Text>
          <ul>
            {food.map((f) => (
              <ThingToDo key={f.name} thing={f} />
            ))}
          </ul>
        </div>
        <div className={css.category}>
          <Cloud size={56} strokeWidth={1} />
          <Text variant="heading3">Hiking</Text>
          <ul>
            <li>
              <Text variant="heading2">Three Sisters Park</Text>
            </li>
            <li>
              <Text variant="heading2">Bergen Peak</Text>
            </li>
          </ul>
        </div>
        <div className={css.category}>
          <Text variant="heading3">Golf</Text>
          <ul>
            <li>
              <Text variant="heading2">Evergreen Golf Course</Text>
            </li>
          </ul>
        </div>
        <div className={css.category}>
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
          <MapPin size={12} />
          <Text variant="body3">{thing.location}</Text>
        </div>
        <Link href={thing.link} className="link" target="_blank">
          <Text variant="body3">Map</Text>
        </Link>
      </div>
      <div className={css.description}>
        <Text variant="body2" tag="p" justify>
          {thing.description}
        </Text>
      </div>
    </li>
  );
};
