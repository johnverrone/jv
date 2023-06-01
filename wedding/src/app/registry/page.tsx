import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import css from './registry.module.scss';
import zolaLogo from '../../photos/registry/zola.png';
import amazonLogo from '../../photos/registry/amazon.png';

export const metadata = {
  title: "Molly & John's Registry",
  description: "Registry details for Molly and John's wedding.",
};

export default function Registry() {
  return (
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
          href="https://www.amazon.com/wedding/share/jollycolorado"
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
  );
}
