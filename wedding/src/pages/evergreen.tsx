import Head from 'next/head';
import React from 'react';
import { Text } from '../components/Text';
import css from './evergreen.module.scss';

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
          <Text variant="heading3">Food</Text>
          <ul>
            <li>
              <Text variant="heading2">Murphys</Text>
              <Text variant="body2">
                Local food with excellent bison burgers.
              </Text>
            </li>
            <li>
              <Text variant="heading2">Lariatt Lodge</Text>
              <Text variant="body2">Brewery vibes.</Text>
            </li>
            <li>
              <Text variant="heading2">Kiki&apos;s Bowls</Text>
              <Text variant="body2">
                Fresh poke bowls. Quick and easy and best for a pickup order.
              </Text>
            </li>
            <li>
              <Text variant="heading2">Wildflower Cafe</Text>
              <Text variant="body2">
                Brunch spot with insnae pancakes, omeletes, and hash bowls
              </Text>
            </li>
          </ul>
        </div>
        <div className={css.category}>
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
