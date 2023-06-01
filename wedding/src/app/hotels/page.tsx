import { Text } from '@/components/Text';
import React from 'react';
import css from './hotels.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { comfortSuites, hamptonInn } from '../../photos';

export const metadata = {
  title: "Molly & John's Wedding Travel",
  description: "Travel information for Molly and John's wedding.",
};

export default function Hotels() {
  return (
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
              The last date to make a reservation with the group rate is{' '}
              <b>July 24</b>.
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
              This hotel is a 20 min drive to Hiwan. We have a room block with a
              special rate of $209 per night.
            </Text>
            <br />
            <Text variant="body2" tag="p">
              To book:
            </Text>
            <ul style={{ textAlign: 'left' }}>
              <li>
                Use this link:{' '}
                <a
                  href="https://www.hilton.com/en/book/reservation/deeplink/?ctyhocn=DENGDHX&groupCode=CHHDVW&arrivaldate=2023-08-24&departuredate=2023-08-27&cid=OM,WW,HILTONLINK,EN,DirectLink&fromId=HILTONLINKDIRECT"
                  target="_blank"
                  rel="noreferrer"
                  className="link"
                >
                  <b>book now</b>
                </a>
                ; or
              </li>
              <li>
                Call the hotel{' '}
                <a href="tel:303-278-6600" className="link">
                  303-278-6600
                </a>{' '}
                and ask for the Dickinson Verrone Wedding (special booking code{' '}
                <strong>DVW</strong>)
              </li>
            </ul>
            <br />
            <Text variant="body2" tag="p">
              <i>
                Note: The hotel has guaranteed to honor our group rate for 3
                days prior to 8/24 and after 8/27. However; you must contact the
                hotel directly to do so (the link only works for Thursday -
                Sunday):
              </i>
            </Text>
            <div className={css.hotelContact}>
              <Text variant="body2" tag="div">
                <b>Cassie Willis</b>
              </Text>
              <Text variant="body2" tag="div">
                <a href="tel:303-278-6600,112" className="link">
                  303-278-6600 x 112
                </a>
              </Text>
            </div>
            <Text variant="body2" tag="p">
              The last date to make a reservation with the group rate is{' '}
              <b>July 24</b>.
            </Text>
            <br />
            <Link
              className="link"
              href="https://www.hilton.com/en/book/reservation/deeplink/?ctyhocn=DENGDHX&groupCode=CHHDVW&arrivaldate=2023-08-24&departuredate=2023-08-27&cid=OM,WW,HILTONLINK,EN,DirectLink&fromId=HILTONLINKDIRECT"
            >
              Visit Website
            </Link>
          </div>
        </li>
      </ul>
    </div>
  );
}
