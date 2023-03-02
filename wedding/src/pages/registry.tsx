import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import css from './registry.module.scss';
import zolaLogo from '../photos/registry/zola.png';
import amazonLogo from '../photos/registry/amazon.png';

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
        <ul className={css.registryGrid}>
          <a
            className={css.registryLink}
            href="https://www.zola.com/registry/johnmolly"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              src={zolaLogo}
              alt="Zola Logo"
              style={{ objectFit: 'contain', padding: 30 }}
              fill
              sizes="(max-width: 700px) 360px
                      450px"
            />
          </a>
          <a
            className={css.registryLink}
            href="https://www.zola.com/registry/johnmolly"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              src={amazonLogo}
              alt="Amazon Logo"
              style={{ objectFit: 'contain', padding: 30 }}
              fill
              sizes="(max-width: 700px) 360px
                      450px"
            />
          </a>
        </ul>
      </div>
    </>
  );
}
