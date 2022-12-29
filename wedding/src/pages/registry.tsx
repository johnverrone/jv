import Head from 'next/head';
import React, { useEffect } from 'react';
import { Text } from '../components/Text';
import css from './registry.module.scss';

export default function Registry({}) {
  // useEffect(() => {
  //   const script = document.createElement('script');
  //   script.id = 'zola-wjs';
  //   script.src = 'https://widget.zola.com/js/widget.js';
  //   script.async = true;

  //   document.body.appendChild(script);

  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, []);

  return (
    <>
      <Head>
        <title>Molly &amp; John&apos;s Registry</title>
        <meta
          name="description"
          content="Registry details for Molly and John's wedding."
        />
      </Head>

      <div className={css.registryContainer}>
        <div className={css.header}>
          <Text variant="body3" tag="p">
            coming soon...
          </Text>
        </div>
        {/* <a
          className="zola-registry-embed"
          href="www.zola.com/registry/johnmolly"
          data-registry-key="johnmolly"
        >
          Our Zola Wedding Registry
        </a> */}
      </div>
    </>
  );
}
