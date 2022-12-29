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
    name: 'Espresso Evergreen',
    description: ``,
    location: '7 minutes from Evergreen',
    link: 'https://goo.gl/maps/x62obRVnRfWrTFik7',
  },
  {
    name: 'Evergreen Bread & Cocktail Lounge',
    description: ``,
    location: '10 minutes from Evergreen',
    link: 'https://goo.gl/maps/uQNwPyeLh6BN8j5y8',
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
];

const golf: ThingToDo[] = [
  {
    name: 'Evergreen Golf Course',
    description: `A short and unique golf course that's right along Evergreen lake. Beautiful scenery and you'll usually
    spot some wildlife. You won't need your driver but you will need some creativity to navigate some interesting hole layouts.`,
    location: '4 minutes from Evergreen',
    link: 'https://goo.gl/maps/iDpZvwfypiwWaXbY8',
  },
  {
    name: 'Arrowhead Golf Course',
    description: `Aliquip duis ea adipisicing consectetur voluptate est. In eiusmod sint mollit veniam. Do exercitation consectetur anim adipisicing dolor consectetur Lorem officia laboris irure adipisicing. Magna ad laboris enim dolor nostrud culpa. Consequat reprehenderit reprehenderit aliqua sunt eu eiusmod aute anim do eu. Cillum ipsum commodo dolor aliqua et Lorem exercitation irure nostrud laborum. Nisi ut consectetur aliqua adipisicing eu veniam ex dolore proident dolor occaecat.`,
    location: '45 minutes from Evergreen',
    link: 'https://goo.gl/maps/NeK2TxuVGro7QhAi7',
  },
  {
    name: 'CommonGround Golf Course',
    description: `Irure ullamco occaecat commodo reprehenderit laboris qui voluptate deserunt in veniam ad. Ex nostrud culpa occaecat adipisicing id nulla reprehenderit in. Eu exercitation qui labore culpa enim veniam aliquip eiusmod ullamco qui tempor Lorem magna. Et mollit quis pariatur Lorem sit. Sit ullamco nostrud duis nostrud commodo magna commodo. Sit laboris dolore ipsum velit pariatur dolor nulla laborum Lorem mollit cupidatat. Anim ipsum cupidatat esse nulla officia dolore.`,
    location: '1 hour from Evergreen',
    link: 'https://goo.gl/maps/BgrJQnktk162dDN49',
  },
];

const attractions: ThingToDo[] = [
  {
    name: 'Evergreen Lake',
    description: `Amet Lorem voluptate magna cillum incididunt magna nostrud do ullamco adipisicing consectetur nulla ullamco. Ut minim aute est magna esse est laboris. Dolor mollit pariatur aliquip nisi amet ipsum voluptate id ipsum.`,
    location: 'Downtown Evergreen',
    link: 'https://goo.gl/maps/GrwpZ5kAJbnUA65T9',
  },
  {
    name: 'Red Rocks Amphitheatre',
    description: `World famous music venue tucked into incredible red stone cliffs. There are hiking and biking trails around
    the area as well. Definitely worth a visit if you haven't been.`,
    location: '24 minutes from Evergreen',
    link: 'https://goo.gl/maps/GrwpZ5kAJbnUA65T9',
  },
  {
    name: 'Coors Brewery Tour',
    description: ``,
    location: '33 minutes from Evergreen',
    link: 'https://goo.gl/maps/L9wW7sdBrX3u6EPH8',
  },
  {
    name: 'Mt. Evans / Echo Lake',
    description: ``,
    location: '45 minutes from Evergreen',
    link: 'https://goo.gl/maps/Jz3cVkUsja68PJKj6',
  },
];

const towns: ThingToDo[] = [
  {
    name: 'Idaho Springs',
    description: ``,
    location: '30 minutes from Evergreen',
    link: '',
  },
  {
    name: 'Golden',
    description: ``,
    location: '30 minutes from Evergreen',
    link: '',
  },
  {
    name: 'Denver',
    description: ``,
    location: '45 minutes from Evergreen',
    link: '',
  },
  {
    name: 'Boulder',
    description: ``,
    location: '1 hour from Evergreen',
    link: '',
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

        <div className={css.category} id="food">
          <i className="las la-utensils la-3x"></i>
          <Text variant="heading3">Food & Coffee</Text>
          <ul>
            {food.map((thing) => (
              <ThingToDo key={thing.name} thing={thing} />
            ))}
          </ul>
        </div>
        <div className={css.category} id="hiking">
          <i className="las la-mountain la-3x"></i>
          <Text variant="heading3">Hiking</Text>
          <ul>
            {hikes.map((thing) => (
              <ThingToDo key={thing.name} thing={thing} />
            ))}
          </ul>
        </div>
        <div className={css.category} id="golf">
          <i className="las la-golf-ball la-3x"></i>
          <Text variant="heading3">Golf</Text>
          <ul>
            {golf.map((thing) => (
              <ThingToDo key={thing.name} thing={thing} />
            ))}
          </ul>
        </div>
        <div className={css.category} id="attractions">
          <i className="las la-binoculars la-3x"></i>
          <Text variant="heading3">Sightseeing & Attractions</Text>
          <ul>
            {attractions.map((thing) => (
              <ThingToDo key={thing.name} thing={thing} />
            ))}
          </ul>
        </div>
        <div className={css.category} id="towns">
          <i className="las la-city la-3x"></i>
          <Text variant="heading3">Nearby Towns</Text>
          <ul>
            {towns.map((thing) => (
              <ThingToDo key={thing.name} thing={thing} />
            ))}
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
