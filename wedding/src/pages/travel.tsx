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
            <b>7,662 ft</b>. Be sure to stay well hydrated during your stay! We
            recommend the <i>Hampton Inn Denver West</i> hotel (5,800 ft.) if
            you have any medical conditions or concerns with high elevation.
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
                  Closest hotel to downtown Evergreen and the venue! Et
                  voluptate non enim eu ex laborum mollit irure ullamco
                  adipisicing velit aute. Cupidatat esse id non Lorem. Consequat
                  qui aliqua ea eiusmod esse Lorem quis culpa ipsum enim. Tempor
                  duis excepteur velit minim sunt proident aliqua id id in est
                  labore cupidatat. Quis elit nisi excepteur laborum ut tempor
                  nulla consequat culpa adipisicing. Tempor aliqua sunt eiusmod
                  labore sunt occaecat consequat reprehenderit aliqua
                  adipisicing nulla eu aute ad.
                </Text>
              </div>
            </li>
            <li className={css.spot}>
              <Text variant="heading2">Hampton Inn Denver West/Golden</Text>
              <div className={css.description}>
                <Text variant="body2" tag="p">
                  Reprehenderit mollit officia mollit dolore ullamco Lorem
                  proident officia in magna aute laborum. Laborum dolor sunt
                  duis pariatur eiusmod. Fugiat aute non officia id tempor
                  occaecat voluptate pariatur officia mollit ex sit ipsum
                  dolore. Voluptate dolore excepteur quis ad mollit laborum
                  irure do. Qui sit sit incididunt officia aliqua cupidatat
                  consectetur sit eiusmod laboris anim laboris. Ullamco commodo
                  officia magna consectetur labore incididunt cillum sit nulla
                  excepteur anim nostrud culpa. Officia deserunt anim deserunt
                  eu mollit nisi minim voluptate quis aliqua dolore id et.
                </Text>
              </div>
            </li>
          </ul>
        </section>
        <section className={css.travelCategory} id="rentals">
          <i className="las la-home la-3x"></i>
          <Text variant="heading3">House & Rentals</Text>
          <div>
            <Text variant="heading2">Airbnb or Vrbo</Text>
            <Text variant="body2" tag="p">
              Good luck!
            </Text>
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
                  Non commodo ipsum nisi commodo in ea cillum et. Occaecat sint
                  amet ad et qui et Lorem culpa sunt Lorem id quis ea.
                  Consectetur cupidatat laboris ut enim adipisicing pariatur
                  irure. Labore dolore sunt nisi quis.
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
                  throughout the night.
                </Text>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
