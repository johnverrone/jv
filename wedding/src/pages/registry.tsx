import Head from 'next/head';
import React from 'react';
import { Text } from '../components/Text';
import css from './registry.module.scss';

export default function Home({}) {
  return (
    <>
      <Head>
        <title>Molly &amp; John&apos;s Registry</title>
        <meta
          name="description"
          content="Registry details for Molly and John's wedding."
        />
      </Head>

      <div className={css.registryWrapper}>
        <Text variant="body2">coming soon...</Text>
      </div>
    </>
  );
}
