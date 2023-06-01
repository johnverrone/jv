import { Text } from '../components/Text';
import Image from 'next/image';
import React from 'react';
import { heroImage } from '../photos';
import css from './home.module.scss';

export default function Home() {
  return (
    <div className={css.homeContainer}>
      <div className={css.splashImage}>
        <Image
          src={heroImage}
          alt="A photo of Molly and John soft smiling from their engagement photo shoot"
          priority
          fill
          style={{
            objectFit: 'contain',
            objectPosition: '66%',
            borderRadius: 16,
          }}
        />
      </div>
      <div className={css.info}>
        <Text variant="heading1">August 26, 2023</Text>
        <div className={css.address}>
          <Text variant="body1">Hiwan Golf Club</Text>
          <Text variant="body2" tag="p">
            30671 Clubhouse Ln.
            <br />
            Evergreen, CO 80439
          </Text>
        </div>
      </div>
    </div>
  );
}
