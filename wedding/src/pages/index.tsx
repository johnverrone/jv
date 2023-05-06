import { SectionHeader } from '../components/SectionHeader';
import { Text } from '../components/Text';
import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import { heroImage } from '../photos';
import css from './index.module.scss';
import { getDaysRemaining } from '../components/Countdown';

export default function Home() {
  const daysRemaining = getDaysRemaining();

  return (
    <>
      <Head>
        <title>Molly & John - 8.26.23</title>
        <meta
          name="description"
          content="Your complete guide to the wedding of Molly Dickinson and John Verrone. Find travel information, registry details, and RSVP here."
        />
      </Head>
      <div className={css.homeContainer}>
        <div className={css.splashImage}>
          <Image
            src={heroImage}
            alt="The date Aug 26, 2023 overlayed on a picture of John and Molly on Mt. Evans"
            priority
            fill
            style={{
              objectFit: 'contain',
              objectPosition: '66%',
            }}
          />
        </div>
        <div className={css.info}>
          <Text variant="heading1">August 26, 2023</Text>
          <div className={css.address}>
            <Text variant="body1">Hiwan Golf Club</Text>
            <Text variant="body2" tag="p">
              30671 Clubhouse Ln.
              <br />
              Evergreen, CO 80439
            </Text>
          </div>
        </div>
      </div>
    </>
  );
}
