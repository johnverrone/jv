import { Text } from '../components/Text';
import Head from 'next/head';
import React from 'react';
import css from './travel.module.scss';

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
        <div className={css.travelCategory}>
          <i className="las la-plane la-3x"></i>
          <Text variant="heading3">Flight</Text>
          <div>
            <Text variant="heading2">Denver International Airport</Text>
            <Text variant="body2" tag="p">
              DIA is cool now.
            </Text>
          </div>
        </div>
        <div className={css.travelCategory}>
          <i className="las la-hotel la-3x"></i>
          <Text variant="heading3">Hotels</Text>
          <ul>
            <li>
              <Text variant="heading2">Comfort Suites Golden West</Text>
              <Text variant="body2" tag="p">
                Closest hotel to downtown Evergreen and the venue!
              </Text>
            </li>
            <li>
              <Text variant="heading2">Something Else in Denver West</Text>
              <Text variant="body2" tag="p">
                Closest hotel to downtown Evergreen and the venue!
              </Text>
            </li>
          </ul>
        </div>
        <div className={css.travelCategory}>
          <i className="las la-home la-3x"></i>
          <Text variant="heading3">House & Rentals</Text>
          <div>
            <Text variant="heading2">Airbnb or Vrbo</Text>
            <Text variant="body2" tag="p">
              Good luck!
            </Text>
          </div>
        </div>
        <div className={css.travelCategory}>
          <i className="las la-bus la-3x"></i>
          <Text variant="heading3">Shuttle</Text>
          <div className={css.spot}>
            <Text variant="heading2">
              Shuttle from hotels to Hiwan Golf Club
            </Text>
            <div className={css.description}>
              <Text variant="body2" tag="p">
                A shuttle will run from hotels to Hiwan before the ceremony,
                from Hiwan to downtown Evergreen after the reception, and from
                downtown Evergreen to hotels throughout the night.
              </Text>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
