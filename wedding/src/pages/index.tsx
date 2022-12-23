import { Autoplay, Pagination, A11y, Navigation, Keyboard } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { SectionHeader } from '../components/SectionHeader';
import { Text } from '../components/Text';
import Head from 'next/head';
import Image from 'next/image';
import React, { ComponentPropsWithoutRef, CSSProperties } from 'react';
import heroImage from '../../public/s/mt-evans.jpg';
import teaserDesktop from '../../public/s/teaser-desktop.png';
import teaserMobile from '../../public/s/teaser-mobile.png';
import css from './index.module.scss';
import { getDaysRemaining } from '../components/Countdown';
import * as photos from '../photos';

type JollyImage = {
  id: string;
  src: ComponentPropsWithoutRef<typeof Image>['src'];
  caption: string;
  objectFit?: CSSProperties['objectFit'];
  objectPosition?: CSSProperties['objectPosition'];
};

const images: JollyImage[] = [
  {
    id: 'mt-evans',
    src: heroImage,
    caption: 'Molly and John on the summit of Mt. Evans',
    objectFit: 'cover',
    objectPosition: '66%',
  },
  {
    id: 'storage',
    src: photos.storageUnit,
    caption: 'Molly in the storage unit where Molly and John first met',
  },
  {
    id: 'music-midtown',
    src: photos.musicMidtown,
    caption: 'Molly and John at the 2018 Music Midtown festival',
  },
  {
    id: 'pink-agenda',
    src: photos.pinkAgenda2018,
    caption: 'Molly and John at the annual Pink Agenda Gala',
  },
  {
    id: 'arches',
    src: photos.arches,
    caption: '',
  },
  {
    id: 'austinF1',
    src: photos.austinF1,
    caption: '',
  },
  {
    id: 'canyons',
    src: photos.canyons,
    caption: '',
  },
  {
    id: 'capitalReef',
    src: photos.capitalReef,
    caption: '',
  },
  {
    id: 'devilsKitchen',
    src: photos.devilsKitchen,
    caption: '',
  },
  {
    id: 'f1',
    src: photos.f1,
    caption: '',
  },
  {
    id: 'florence',
    src: photos.florence,
    caption: '',
  },
  {
    id: 'getaway',
    src: photos.getaway,
    caption: '',
  },
  {
    id: 'goingAway',
    src: photos.goingAway,
    caption: '',
  },
  {
    id: 'grandJunction',
    src: photos.grandJunction,
    caption: '',
  },
  {
    id: 'halloween',
    src: photos.halloween,
    caption: '',
  },
  {
    id: 'jackies',
    src: photos.jackies,
    caption: '',
  },
  {
    id: 'lakeComo',
    src: photos.lakeComo,
    caption: '',
  },
  {
    id: 'mirrors',
    src: photos.mirrors,
    caption: '',
    objectFit: 'cover',
  },
  {
    id: 'moving',
    src: photos.moving,
    caption: '',
  },
  {
    id: 'proposal',
    src: photos.proposal,
    caption: '',
  },
  {
    id: 'proposalKnee',
    src: photos.proposalKnee,
    caption: '',
  },
  {
    id: 'scottsdaleGolf',
    src: photos.scottsdaleGolf,
    caption: '',
  },
  {
    id: 'shivanas',
    src: photos.shivanas,
    caption: '',
  },
  {
    id: 'slcHike',
    src: photos.slcHike,
    caption: '',
  },
  {
    id: 'snowbasin',
    src: photos.snowbasin,
    caption: '',
  },
  {
    id: 'steamboat',
    src: photos.steamboat,
    caption: '',
  },
  {
    id: 'telluride',
    src: photos.telluride,
    caption: '',
  },
  {
    id: 'theWorksFam',
    src: photos.theWorksFam,
    caption: '',
  },
  {
    id: 'theWorks',
    src: photos.theWorks,
    caption: '',
  },
  {
    id: 'vaFam',
    src: photos.vaFam,
    caption: '',
  },
  {
    id: 'zilker',
    src: photos.zilker,
    caption: '',
  },
];

export default function Home() {
  const teaserMode = process.env.NEXT_PUBLIC_TEASER_MODE === '1';
  const daysRemaining = getDaysRemaining();

  return (
    <>
      <Head>
        <title>Molly Dickinson and John Verrone&apos;s Wedding</title>
        <meta
          name="description"
          content="Your complete guide to the wedding of Molly Dickinson and John Verrone. Find travel information, registry details, and RSVP here."
        />
      </Head>

      {teaserMode ? (
        <>
          <div className={css.teaserImage}>
            <Image
              src={teaserDesktop}
              alt="The date Aug 26, 2023 overlayed on a picture of John and Molly on Mt. Evans"
              priority
              fill
              style={{
                objectFit: 'cover',
                objectPosition: '66%',
              }}
            />
          </div>
          <div className={css.teaserImageMobile}>
            <Image
              src={teaserMobile}
              alt="The date Aug 26, 2023 overlayed on a picture of John and Molly on Mt. Evans"
              priority
              fill
              style={{
                objectFit: 'cover',
                objectPosition: '66%',
              }}
            />
          </div>

          <div style={{ textAlign: 'center' }}>
            <br />
            <Text variant="body3">stay tuned for more details.</Text>
          </div>
        </>
      ) : (
        <div className={css.homeContainer}>
          <Swiper
            modules={[Autoplay, Pagination, A11y, Navigation, Keyboard]}
            spaceBetween={50}
            slidesPerView={1}
            keyboard={{ enabled: true }}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation={true}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            onSlideChange={() => console.log('slide change')}
          >
            {images.map(
              ({ id, src, caption, objectFit = 'contain', objectPosition }) => (
                <SwiperSlide key={id}>
                  <figure className={css.splashImage}>
                    <Image
                      src={src}
                      alt={caption}
                      priority
                      fill
                      style={{
                        objectFit,
                        objectPosition,
                      }}
                    />
                    {!!caption && (
                      <figcaption>
                        <Text variant="body3">{caption}</Text>
                      </figcaption>
                    )}
                  </figure>
                </SwiperSlide>
              )
            )}
          </Swiper>
          <SectionHeader title="The Wedding">
            <Text variant="body1">August 26, 2023 &middot; Evergreen, CO</Text>
            <Text variant="body1">{`${daysRemaining} day${
              daysRemaining > 1 ? 's' : ''
            } to go!`}</Text>
          </SectionHeader>
        </div>
      )}
    </>
  );
}
