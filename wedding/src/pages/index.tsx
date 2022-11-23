import { SectionHeader } from '../components/SectionHeader';
import { Text } from '../components/Text';
import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import heroImage from '../../public/s/mt-evans.jpg';
import teaserDesktop from '../../public/s/teaser-desktop.png';
import teaserMobile from '../../public/s/teaser-mobile.png';
import css from './index.module.scss';
import { Countdown, getDaysRemaining } from '../components/Countdown';

export default function Home() {
  const teaserMode = process.env.NEXT_PUBLIC_TEASER_MODE === '1';
  const daysRemaining = getDaysRemaining();

  return (
    <>
      <Head>
        <title>Molly Dickinson and John Verrone&apos;s Wedding</title>
        <meta
          name="description"
          content="Your complete guide to the wedding of Molly Dickinson and John Verrone. Find travel information, registry details, and RSVP here."
        />
      </Head>

      {teaserMode ? (
        <>
          <div className={css.teaserImage}>
            <Image
              src={teaserDesktop}
              alt="The date Aug 26, 2023 overlayed on a picture of John and Molly on Mt. Evans"
              priority
              fill
              style={{
                objectFit: 'cover',
                objectPosition: '66%',
              }}
            />
          </div>
          <div className={css.teaserImageMobile}>
            <Image
              src={teaserMobile}
              alt="The date Aug 26, 2023 overlayed on a picture of John and Molly on Mt. Evans"
              priority
              fill
              style={{
                objectFit: 'cover',
                objectPosition: '66%',
              }}
            />
          </div>

          <div style={{ textAlign: 'center' }}>
            <br />
            <Text variant="body3">stay tuned for more details.</Text>
          </div>
        </>
      ) : (
        <div className={css.homeContainer}>
          <div className={css.splashImage}>
            <Image
              src={heroImage}
              alt="John & Molly on the summit of Mt. Evans"
              priority
              fill
              style={{
                objectFit: 'cover',
                objectPosition: '66%',
              }}
            />
          </div>
          <SectionHeader
            title="The Wedding"
            subtitle="August 26, 2023 &middot; Evergreen, CO"
            subsubtitle={`${daysRemaining} day${
              daysRemaining > 1 ? 's' : ''
            } to go!`}
          />
        </div>
      )}
    </>
  );
}
