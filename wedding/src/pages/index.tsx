import { SectionHeader } from '../components/SectionHeader';
import { Text } from '../components/Text';
import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import css from '../styles/home.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Molly &amp; John Wedding</title>
        <meta
          name="description"
          content="Official wedding website for Molly Dickinson and John Verrone! View photos, directions, registry details, and RSVP."
        />
      </Head>

      <div className={css.splashImage}>
        <Image
          src="/teaser.png"
          alt="The date Aug 26, 2023 overlayed on a picture of John and Molly on Mt. Evans"
          priority
          layout="fill"
          objectFit="cover"
          objectPosition="66%"
        />
      </div>
      <div className={css.splashImageMobile}>
        <Image
          src="/mobile-teaser.png"
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
      {/* <SectionHeader
        title="The Wedding"
        subtitle="July 22, 2023 &middot; Colorado"
      /> */}
    </>
  );
}
