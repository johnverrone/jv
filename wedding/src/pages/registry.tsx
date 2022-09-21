import Head from 'next/head';
import React from 'react';
import { SectionHeader } from '../components/SectionHeader';
import css from '@styles/registry.module.css';

export default function Home({}) {
  return (
    <>
      <Head>
        <title>John &amp; Molly&apos;s Registry</title>
        <meta name="description" content="Generated by create next app" />
      </Head>

      <SectionHeader title="Registry" />

      <div className={css.registryWrapper}>
        <a href="https://www.google.com" target="_blank" rel="noreferrer">
          Registry Link 1
        </a>
        <a href="https://www.google.com" target="_blank" rel="noreferrer">
          Registry Link 2
        </a>
      </div>
    </>
  );
}