'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import React, { ReactNode, useState } from 'react';
import { Text } from '@/components/Text';
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
    description: `A tiny little drive-thru shack for coffee and simple breakfast. 
    There's also a walk-up window and two outdoor tables but this is a great 
    option to grab something on the go.`,
    location: '7 minutes from Evergreen',
    link: 'https://goo.gl/maps/x62obRVnRfWrTFik7',
  },
  {
    name: 'Evergreen Bread & Cocktail Lounge',
    description: `More than just a bread shop. Cozy little breakfast spot not
     far off I-70 with great breakfast and sandwiches. They also serve alcohol
     if you are looking for a bloody mary or mimosa to pair with a BEC.`,
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
    description: `A famous Colorado course nestled in the foothils of Littleon with majestic red rock shards piercing through the fairways.
     A must play for everyone!`,
    location: '45 minutes from Evergreen',
    link: 'https://goo.gl/maps/NeK2TxuVGro7QhAi7',
  },
  {
    name: 'CommonGround Golf Course',
    description: `A Tom Doak designed course near the heart of Denver that's extremely fun for golfers 
    of any skill level.`,
    location: '1 hour from Evergreen',
    link: 'https://goo.gl/maps/BgrJQnktk162dDN49',
  },
];

const attractions: ThingToDo[] = [
  {
    name: 'Evergreen Lake',
    description: `The heart of Evergreen! A beautiful mountain lake bustling with life. In the summer, you will 
    find paddle boarders, fisherman, golfers, walkers, runners, and dogs surrounding the lake. In the winter, ice 
    skaters, hockey players, sledders, and ice fisherman. Definitely check out downtown Evergreen and walk around 
    the lake while you are in town.`,
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
    description: `Get a tour of one of the largest breweries in the world. Tours are 60 minutes long and require reservations!`,
    location: '33 minutes from Evergreen',
    link: 'https://goo.gl/maps/L9wW7sdBrX3u6EPH8',
  },
  {
    name: 'Mt. Evans / Echo Lake',
    description: `Echo Lake is a beautiful high altitude lake (10,000+ feet) nestled near Mt. Evans (one of Colorado's many 14ers).
     There are walking trails and picnic tables around the lake and it's a beautiful spot to hang out and enjoy views. If you are 
     so inclined to drive to the summit of Mt. Evans, know you will need at least 2 additional hours!`,
    location: '45 minutes from Evergreen',
    link: 'https://goo.gl/maps/Jz3cVkUsja68PJKj6',
  },
];

const towns: ThingToDo[] = [
  {
    name: 'Idaho Springs',
    description: `A small mountain town with a few breweries and restaurants. A cool place to grab some BBQ and learn about history of mining in the area.`,
    location: '30 minutes from Evergreen',
    link: 'https://goo.gl/maps/AtmuQ7eiT7TyQwH96',
  },
  {
    name: 'Golden',
    description: `Home to the Colorado School of Mines and Coors Brewing, Golden is a awesome little town with bars, restaurants, and nature.`,
    location: '30 minutes from Evergreen',
    link: 'https://goo.gl/maps/4fkDspZHgsJCGXR77',
  },
  {
    name: 'Denver',
    description: `Obviously the largest 'town' on the list. Denver is a capital of Colorado and is home to major league sports teams, businesses, concert halls
     as well as museums, zoos, and parks. We recommend exploring the Highlands or RiNo neighborhoods for food, drinks, and coffee shops.`,
    location: '45 minutes from Evergreen',
    link: 'https://goo.gl/maps/F1SsfRXKPme8myTo7',
  },
  {
    name: 'Boulder',
    description: `A beautiful city tucked in the foothills of the mountains. Check out the pedestrian mall downtown (Pearl Street)
    to explore art galleries, cafes, restaurants, and shopping.`,
    location: '1 hour from Evergreen',
    link: 'https://goo.gl/maps/52Qwem2fiLXcHK4M9',
  },
];

export default function Evergreen() {
  return (
    <section className={css.thingsContainer}>
      <div className={css.header}>
        <Text variant="body3" tag="p">
          Here are a few of our favorite things to do in the area.
        </Text>
      </div>

      <Category
        id="food"
        icon="la-utensils"
        name="Food & Coffee"
        items={food}
      />
      <Category id="hiking" icon="la-mountain" name="Hiking" items={hikes} />
      <Category id="golf" icon="la-golf-ball" name="Golf" items={golf} />
      <Category
        id="attractions"
        icon="la-binoculars"
        name="Sightseeing & Attractions"
        items={attractions}
      />
      <Category id="towns" icon="la-city" name="Nearby Towns" items={towns} />
    </section>
  );
}

interface CategoryProps {
  id: string;
  icon: string;
  name: string;
  items: ThingToDo[];
}

const Category = ({ id, icon, name, items }: CategoryProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={css.category} id={id}>
      <button
        className={css.categoryHeading}
        onClick={() => setOpen((p) => !p)}
      >
        <div className={css.categoryName}>
          <i className={`las ${icon} la-2x`}></i>
          <Text variant="heading2">{name}</Text>
        </div>
        {open ? (
          <i className="las la-minus la-2x" />
        ) : (
          <i className="las la-plus la-2x" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            key="answer"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
          >
            <div className={css.thingsList}>
              {items.map((thing) => (
                <ThingToDo key={thing.name} thing={thing} />
              ))}
            </div>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

interface ThingToDoProps {
  thing: ThingToDo;
}

const ThingToDo = ({ thing }: ThingToDoProps) => {
  return (
    <li className={css.thing}>
      <Text variant="heading3">{thing.name}</Text>
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
