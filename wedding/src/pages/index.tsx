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
    caption: 'Summit of Mt. Evans - May 2021',
    objectFit: 'cover',
    objectPosition: '66%',
  },
  {
    id: 'storage',
    src: photos.storageUnit,
    caption: 'The storage unit where Molly and John first met - August 2017',
  },
  {
    id: 'music-midtown',
    src: photos.musicMidtown,
    caption: 'Music Midtown festival - September 2018',
  },
  {
    id: 'pink-agenda',
    src: photos.pinkAgenda2018,
    caption: 'Annual Pink Agenda Gala in Atlanta - October 2018',
  },
  {
    id: 'arches',
    src: photos.arches,
    caption: 'Arches National Park - November 2021',
  },
  {
    id: 'austinF1',
    src: photos.austinF1,
    caption:
      'Downtown Austin before the Formula 1 US Grand Prix - October 2022',
  },
  {
    id: 'canyons',
    src: photos.canyons,
    caption: 'After a solid day on the slopes in Park City - January 2022',
  },
  {
    id: 'capitalReef',
    src: photos.capitalReef,
    caption: 'Capital Reef National Park - November 2021',
  },
  {
    id: 'devilsKitchen',
    src: photos.devilsKitchen,
    caption:
      "On the Devil's Kitchen trail in Grand Junction, CO - November 2021",
  },
  {
    id: 'f1',
    src: photos.f1,
    caption:
      'Sunset over Circuit of the Americas after the F1 race - October 2022',
  },
  {
    id: 'florence',
    src: photos.florence,
    caption: 'On the Ponte Vecchio in Florence, Italy - June 2022',
  },
  {
    id: 'getaway',
    src: photos.getaway,
    caption: 'Getaway Cabins in the North Georgia Mountains - February 2020',
  },
  {
    id: 'goingAway',
    src: photos.goingAway,
    caption:
      'Going away party thrown by amazing friends right before we ventured off for our nomad year - May 2021',
  },
  {
    id: 'grandJunction',
    src: photos.grandJunction,
    caption: 'Redlands Mesa Golf Club in Grand Junction, CO - October 2021',
  },
  {
    id: 'halloween',
    src: photos.halloween,
    caption:
      'Halloween! John was a bag of East Pole coffee beans and Molly was a Chemex - October 2021',
  },
  {
    id: 'jackies',
    src: photos.jackies,
    caption: "At Jackie's (John's cousin) wedding in Wilmington, NC - May 2021",
  },
  {
    id: 'lakeComo',
    src: photos.lakeComo,
    caption: 'Selfie on Lake Como - June 2022',
  },
  {
    id: 'mirrors',
    src: photos.mirrors,
    caption:
      "In Yayoi Kusama's Infinity Mirror Rooms exhibit in Atlanta - January 2019",
    objectFit: 'cover',
  },
  {
    id: 'moving',
    src: photos.moving,
    caption: 'Packed up and ready to drive across country - May 2021',
  },
  {
    id: 'proposalKnee',
    src: photos.proposalKnee,
    caption: 'John popping the question in Brooklyn, NY - June 2022',
  },
  {
    id: 'proposal',
    src: photos.proposal,
    caption: 'She said yes! June 2022',
  },
  {
    id: 'scottsdaleGolf',
    src: photos.scottsdaleGolf,
    caption: "Golfing in Scottsdale, AZ for Molly's 30th - January 2021",
  },
  {
    id: 'shivanas',
    src: photos.shivanas,
    caption:
      "Dancing at JJ and Shivana's wedding in Asheville, NC - September 2021",
  },
  {
    id: 'slcHike',
    src: photos.slcHike,
    caption:
      'Summit of Grandeur Peak just outside of Salt Lake City, UT - January 2022',
  },
  {
    id: 'snowbasin',
    src: photos.snowbasin,
    caption: "Top of Allen's Peak in Snowbasin - January 2022",
  },
  {
    id: 'steamboat',
    src: photos.steamboat,
    caption:
      'Hiking to Rabbit Ears Peak near Steamboat Springs, CO - July 2021',
  },
  {
    id: 'telluride',
    src: photos.telluride,
    caption:
      'Hiking the Bridal Veil Falls trail in Telluride, CO - November, 2021',
  },
  {
    id: 'theWorksFam',
    src: photos.theWorksFam,
    caption:
      "Grabbing pre dinner drinks with John's family at The Works in Atlanta - December 2021",
  },
  {
    id: 'theWorks',
    src: photos.theWorks,
    caption: 'All smiles for Bacchanalia - December 2021',
  },
  {
    id: 'vaFam',
    src: photos.vaFam,
    caption:
      "Celebrating Kyle's (Molly's brother) graduation from Darden in Charlottesville, VA - May 2022",
  },
  {
    id: 'zilker',
    src: photos.zilker,
    caption:
      'A beautiful day in Zilker Park after Molly & John finally settled in Austin, TX - May 2022',
  },
];

export default function Home() {
  const teaserMode = process.env.NEXT_PUBLIC_TEASER_MODE === '1';
  const daysRemaining = getDaysRemaining();

  return (
    <>
      <Head>
        <title>Molly & John - 8.26.23</title>
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
            slidesPerView={'auto'}
            loopedSlides={3}
            centeredSlides={true}
            keyboard={{ enabled: true }}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation={true}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            cssMode
          >
            {images.map(
              (
                { id, src, caption, objectFit = 'contain', objectPosition },
                idx
              ) => (
                <SwiperSlide key={id}>
                  <figure className={css.splashImage}>
                    <Image
                      src={src}
                      alt={caption}
                      priority={idx === 0}
                      fill
                      style={{
                        objectFit,
                        objectPosition,
                      }}
                      sizes="(max-width: 550px) 100vw,
                              (max-width: 1200px) 70vw,
                              50vw"
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
          <SectionHeader title="August 26, 2023">
            <Text variant="body1">Hiwan Golf Club</Text>
          </SectionHeader>
          <Text variant="body2" tag="p">
            30671 Clubhouse Ln.
            <br />
            Evergreen, CO 80439
          </Text>
        </div>
      )}
    </>
  );
}
