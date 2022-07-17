import { SectionHeader } from 'components/SectionHeader';
import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import css from '../styles/Home.module.css';

export default function Home({}) {
  return (
    <>
      <Head>
        <title>John &amp; Molly 2023</title>
        <meta name="description" content="Generated by create next app" />
      </Head>

      <div className={css.splashImage}>
        <Image
          src="/mt-evans.jpg"
          alt="John and Molly on Mt. Evans"
          priority
          width={5889}
          height={3926}
          layout="fill"
          objectFit="cover"
          objectPosition="66%"
        />
      </div>

      <SectionHeader
        title="The Wedding"
        subtitle="July 22, 2023 &middot; Buena Vista, CO"
      />
    </>
  );
}
