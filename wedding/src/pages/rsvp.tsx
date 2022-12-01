import Head from 'next/head';
import React from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { RSVPForm } from '../components/RSVPForm';
import css from './rsvp.module.scss';

export default function Rsvp({}) {
  return (
    <>
      <Head>
        <title>Molly &amp; John&apos;s Wedding RSVP</title>
        <meta
          name="description"
          content="RSVP here for Molly and John's wedding."
        />
      </Head>

      <div className={css.pageContainer}>
        <RSVPForm />
      </div>
    </>
  );
}
