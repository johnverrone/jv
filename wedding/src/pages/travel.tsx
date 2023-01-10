import { Text } from '../components/Text';
import Head from 'next/head';
import React, { useState } from 'react';
import css from './travel.module.scss';
import classNames from 'classnames';

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

      <div className={css.travelContainer}>
        <div className={css.header}>
          <Text variant="body3" tag="p">
            Travel recommendations for our out of town guests.
          </Text>
        </div>
        <div className={css.altitudeReminder}>
          <Text variant="body3">
            <b>High Altitude Reminder</b>
          </Text>
          <Text variant="body3" tag="p">
            Our ceremony and reception will take place at an elevation of{' '}
            <i>7,662 ft</i>. We recommend the{' '}
            <b>Hampton Inn Denver West/Golden</b> hotel (5,800 ft.) if you have
            any medical conditions or concerns with high elevation. Be sure to
            stay well hydrated during your stay!
          </Text>
        </div>
        <section className={css.travelCategory} id="flight">
          <i className="las la-plane la-3x"></i>
          <Text variant="heading3">Flight</Text>
          <div className={css.spot}>
            <Text variant="heading2">Denver International Airport</Text>
            <div className={css.description}>
              <Text variant="body2" tag="p">
                Unless you&apos;re flying private, this should be the
                destination airport for your flight. Public transit can get you
                from the airport to downtown Denver, but not all the way to our
                hotels or Evergreen. We strongly recommend renting a car so you
                have a way to explore Colorado in your free time.
              </Text>
            </div>
          </div>
        </section>
        <section className={css.travelCategory} id="hotels">
          <i className="las la-hotel la-3x"></i>
          <Text variant="heading3">Hotels</Text>
          <ul>
            <li className={classNames(css.spot)}>
              <Text variant="heading2">Comfort Suites Golden West</Text>
              <div className={css.description}>
                <Text variant="body2" tag="p">
                  Closest hotel to downtown Evergreen and the venue! This hotel
                  is at high elevation.
                </Text>
              </div>
            </li>
            <li className={css.spot}>
              <Text variant="heading2">Hampton Inn Denver West/Golden</Text>
              <div className={css.description}>
                <Text variant="body2" tag="p">
                  Hotel just down the mountain from Evergreen. This is the
                  closest group rate hotel to Denver. The room block
                  confirmation is <strong>#84640251</strong>. You must call this
                  hotel and ask to be added to the block directly. There are a
                  mix of king rooms ($257 per night) and double rooms ($265 per
                  night). Please let us know if your preferred option is booked
                  up or if there are any issues.
                </Text>
              </div>
            </li>
          </ul>
        </section>
        <section className={css.travelCategory} id="rentals">
          <i className="las la-home la-3x"></i>
          <Text variant="heading3">House Rentals</Text>
          <div className={css.spot}>
            <Text variant="heading2">Airbnb or Vrbo</Text>
            <div className={css.description}>
              <Text variant="body2" tag="p">
                There are many wonderful mountain homes around Evergreen but
                unfortunately not many on rental sites. If you come across any
                homes and are curious about the location, feel free to shoot
                Molly or John a text. Know that if you go this route, we will be
                unable to guarantee transportation (Ubers and Lyfts are
                extremely limited) so you may need to designate a sober driver.
              </Text>
            </div>
          </div>
        </section>
        <section className={css.travelCategory} id="transportation">
          <i className="las la-bus la-3x"></i>
          <Text variant="heading3">Transportation</Text>
          <ul>
            <li className={css.spot}>
              <Text variant="heading2">Rental Car</Text>
              <div className={css.description}>
                <Text variant="body2" tag="p">
                  We strongly recommend getting a rental car as transportation
                  around Evergreen is impossible without a vehicle. This will
                  also be helpful to get you to and from the airport.
                </Text>
              </div>
            </li>
            <li className={css.spot}>
              <Text variant="heading2">Shuttles</Text>
              <div className={css.description}>
                <Text variant="body2" tag="p">
                  We will provide shuttles that will run from the hotels to
                  Hiwan before the ceremony, from Hiwan to downtown Evergreen
                  after the reception, and from downtown Evergreen to hotels
                  throughout the night. We can not accomidate shuttles stopping
                  at every place where guests may be staying so if you plan to
                  utilize the shuttles and are not staying at the hotels, please
                  let us know so we can get an accurate head count!
                </Text>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
