import { Text } from '../components/Text';
import Head from 'next/head';
import React from 'react';
import css from './hotels.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { comfortSuites, hamptonInn } from '../photos';

export default function Hotels({}) {
  return (
    <>
      <Head>
        <title>Molly &amp; John&apos;s Wedding Travel</title>
        <meta
          name="description"
          content="Travel information for Molly and John's wedding."
        />
      </Head>

      <div className={css.travelContainer}>
        <ul className={css.hotelList}>
          <li className={css.spot}>
            <div className={css.imageContainer}>
              <Image
                src={comfortSuites}
                alt="The Comfort Suites hotel exterior"
                fill
                style={{
                  objectFit: 'cover',
                  borderRadius: 8,
                }}
              />
            </div>
            <Text variant="heading2">Comfort Suites Golden West</Text>
            <div className={css.description}>
              <Text variant="body2" tag="p">
                Closest hotel to downtown Evergreen and the venue (less than 10
                minutes to Hiwan). Group rates start at $182 per night.
              </Text>
              <br />
              <Text variant="body2" tag="p">
                To book:
              </Text>
              <ol style={{ textAlign: 'left' }}>
                <li>
                  Call the hotel{' '}
                  <a href="tel:303-526-2000" className="link">
                    <b>303-526-2000</b>
                  </a>{' '}
                  and ask for reservations
                </li>
                <li>
                  Tell them you would like to make a reservation for the{' '}
                  <b>Dickinson/Verrone</b> group
                </li>
              </ol>
              <br />
              <Text variant="body2" tag="p">
                The last date to make a reservation is July 24. If you have any
                issues booking, please reach out to Molly or John.
              </Text>
              <br />
              <Link
                className="link"
                href="https://www.choicehotels.com/colorado/evergreen/comfort-suites-hotels/co129"
              >
                Visit Website
              </Link>
            </div>
          </li>
          <li className={css.spot}>
            <div className={css.imageContainer}>
              <Image
                src={hamptonInn}
                alt="The Hampton Inn hotel exterior"
                fill
                style={{
                  objectFit: 'cover',
                  borderRadius: 8,
                }}
              />
            </div>
            <Text variant="heading2">Hampton Inn Denver West/Golden</Text>
            <div className={css.description}>
              <Text variant="body2" tag="p">
                This hotel is a 20 min drive to Hiwan. We have a room block with
                a mix of king rooms ($257 per night) and double rooms ($265 per
                night).
              </Text>
              <br />
              <Text variant="body2" tag="p">
                To book:
              </Text>
              <ol style={{ textAlign: 'left' }}>
                <li>
                  Call the hotel{' '}
                  <a href="tel:303-278-6600" className="link">
                    <b>303-278-6600</b>
                  </a>
                </li>
                <li>
                  Give them our group confirmation number: <b>#84640251</b>
                </li>
                <li>Tell them your room preference: king or double</li>
              </ol>
              <br />
              <Text variant="body2" tag="p">
                The last date to make a reservation is August 3. If you have any
                issues booking, please reach out to Molly or John.
              </Text>
              <br />
              <Link
                className="link"
                href="https://www.hilton.com/en/hotels/dengdhx-hampton-denver-west-golden/?SEO_id=GMB-AMER-HX-DENGDHX&y_source=1_MjA4MjY0My03MTUtbG9jYXRpb24ud2Vic2l0ZQ%3D%3D"
              >
                Visit Website
              </Link>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}
