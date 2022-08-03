import Head from 'next/head';
import React from 'react';
import { SectionHeader } from 'components/SectionHeader';
import css from '../styles/rsvp.module.css';
import { RSVPForm } from 'components/RSVPForm';

export default function Rsvp({}) {
  return (
    <>
      <Head>
        <title>John &amp; Molly RSVP</title>
        <meta name="description" content="Generated by create next app" />
      </Head>

      <SectionHeader title="RSVP" subtitle="so... you comin?" />

      <div className={css.pageContainer}>
        <RSVPForm />
      </div>
    </>
  );
}
