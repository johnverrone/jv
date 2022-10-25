import { SectionHeader } from '../components/SectionHeader';
import { Text } from '../components/Text';
import Head from 'next/head';
import Image from "next/legacy/image";
import React from 'react';
import css from '../styles/home.module.css';

export default function Home() {
  const teaserMode = process.env.NEXT_PUBLIC_TEASER_MODE === '1';
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
              src="/s/teaser-desktop.png"
              alt="The date Aug 26, 2023 overlayed on a picture of John and Molly on Mt. Evans"
              priority
              layout="fill"
              objectFit="cover"
              objectPosition="66%"
            />
          </div>
          <div className={css.teaserImageMobile}>
            <Image
              src="/s/teaser-mobile.png"
              alt="The date Aug 26, 2023 overlayed on a picture of John and Molly on Mt. Evans"
              priority
              layout="fill"
              objectFit="cover"
              objectPosition="66%"
            />
          </div>

          <div style={{ textAlign: 'center' }}>
            <br />
            <Text variant="body3">stay tuned for more details.</Text>
          </div>
        </>
      ) : (
        <>
          <div className={css.splashImage}>
            <Image
              src="/s/mt-evans.jpg"
              alt="John & Molly on the summit of Mt. Evans"
              priority
              layout="fill"
              objectFit="cover"
              objectPosition="66%"
            />
          </div>
          <SectionHeader
            title="The Wedding"
            subtitle="August 26, 2023 &middot; Evergreen, CO"
          />
        </>
      )}
    </>
  );
}
