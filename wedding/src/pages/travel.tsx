import { SectionHeader } from '../components/SectionHeader';
import { Text } from '../components/Text';
import Head from 'next/head';
import React from 'react';
import css from './travel.module.scss';

export default function TravelAndFAQs({}) {
  return (
    <>
      <Head>
        <title>Molly &amp; John&apos;s Travel</title>
        <meta
          name="description"
          content="Travel information for Molly and John's wedding."
        />
      </Head>

      <section className={css.travelContainer}>
        <SectionHeader title="Travel Information" />
      </section>

      <section className={css.travelContainer}>
        <SectionHeader title="FAQs" />
      </section>
    </>
  );
}
