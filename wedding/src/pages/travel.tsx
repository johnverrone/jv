import { Text } from '../components/Text';
import Head from 'next/head';
import React from 'react';
import css from './travel.module.scss';
import { Cloud, Home, Send, Truck } from 'react-feather';

const iconSize = 56;

export default function Travel({}) {
  return (
    <>
      <Head>
        <title>Molly &amp; John&apos;s Wedding Travel</title>
        <meta
          name="description"
          content="Travel information for Molly and John's wedding."
        />
      </Head>

      <section className={css.travelContainer}>
        <div className={css.header}>
          <Text variant="body3" tag="p">
            Some recommendations for out of town guests.
          </Text>
        </div>
        <div className={css.travelInformation}>
          <div className={css.spot}>
            <Send size={iconSize} strokeWidth={1} />
            <Text variant="heading3">Flight</Text>
            <Text variant="heading2">Denver International Airport</Text>
            <Text variant="body2" tag="p">
              DIA is cool now.
            </Text>
          </div>

          <div className={css.spot}>
            <Cloud size={iconSize} strokeWidth={1} />
            <Text variant="heading3">Hotels</Text>
            <Text variant="heading2">Comfort Suites Golden West</Text>
            <Text variant="body2" tag="p">
              Closest hotel to downtown Evergreen and the venue!
            </Text>
          </div>

          <div className={css.spot}>
            <Home size={iconSize} strokeWidth={1} />
            <Text variant="heading3">House & Rentals</Text>
            <Text variant="heading2">Airbnb or Vrbo</Text>
            <Text variant="body2" tag="p">
              Good luck!
            </Text>
          </div>

          <div className={css.spot}>
            <Truck size={iconSize} strokeWidth={0.5} />
            <Text variant="heading3">Shuttle</Text>
            <Text variant="heading2">
              Shuttle from hotels to Hiwan Golf Club
            </Text>
            <Text variant="body2" tag="p">
              A shuttle will run from hotels to Hiwan before the ceremony, from
              Hiwan to downtown Evergreen after the reception, and from downtown
              Evergreen to hotels throughout the night.
            </Text>
          </div>
        </div>
      </section>
    </>
  );
}
