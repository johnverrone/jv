import Head from 'next/head';
import Image from 'next/image';
import { Text } from '../components/Text';
import { Calendar, CalendarEvent, Day } from '../components/Calendar';
import { bedDance } from '../photos';
import css from './schedule.module.scss';

export default function Schedule() {
  return (
    <>
      <Head>
        <title>Molly &amp; John&apos;s Wedding Schedule</title>
        <meta
          name="description"
          content="Schedule of Molly and John's wedding."
        />
      </Head>

      <div className={css.scheduleContainer}>
        <Calendar>
          <Day label="Friday">
            <CalendarEvent
              attire="Smart casual"
              description="Join us for food, drinks, and games in Evergreen as we kick off the weekend!"
              location="The Wild Game Evergreen"
              locationUrl="https://goo.gl/maps/rxeWAnAb2TREcyeMA"
              name="Welcome Party"
              time="6:30 &ndash; 9:30pm"
            />
          </Day>
          <Day label="Saturday">
            <div className={css.shuttle}>
              <i className="las la-bus la-lg" />
              <Text variant="body3">
                shuttle from Comfort Suites to Hiwan @ 3:45pm
              </Text>
            </div>
            <div className={css.shuttle}>
              <i className="las la-bus la-lg" />
              <Text variant="body3">
                shuttle from Comfort Suites to Hiwan @ 4:15pm
              </Text>
            </div>
            <CalendarEvent
              attire="Semi-formal"
              description="Have a seat as we make this thing official! Please arrive by 4:45pm. The shuttle will make two trips from the Comfort Suites to the venue starting at a 3:45pm. Please be ready early and fill up the first bus so nobody misses the ceremony!"
              location="Hiwan Golf Club"
              locationUrl="https://g.page/Hiwan?share"
              name="Ceremony"
              time="5:00 &ndash; 5:30pm"
            />
            <CalendarEvent
              attire="Semi-formal"
              description="Grab a drink with us after the ceremony before we get the party started."
              location="Hiwan Golf Club"
              locationUrl="https://g.page/Hiwan?share"
              name="Cocktail Hour"
              time="5:30 &ndash; 6:30pm"
            />
            <CalendarEvent
              attire="Semi-formal"
              description="You know the drill! Dinner, drinks, and dancing."
              location="Hiwan Golf Club"
              locationUrl="https://g.page/Hiwan?share"
              name="Reception"
              time="6:30 &ndash; 10:30pm"
            />
            <div className={css.shuttle}>
              <i className="las la-bus la-lg" />
              <Text variant="body3">
                shuttle from Hiwan to Comfort Suites @ 10:45pm (tbd)
              </Text>
            </div>
            <div className={css.shuttle}>
              <i className="las la-bus la-lg" />
              <Text variant="body3">
                shuttle from Hiwan to afterparty @ 11:15pm (tbd)
              </Text>
            </div>
            <div className={css.shuttle}>
              <i className="las la-bus la-lg" />
              <Text variant="body3">
                shuttle from afterparty to Comfort Suites @ 12:15am (tbd)
              </Text>
            </div>
          </Day>
        </Calendar>

        <div className={css.scheduleImage}>
          <Image
            src={bedDance}
            alt="A photo of Molly and John soft smiling from their engagement photo shoot"
            priority
            fill
            style={{
              objectFit: 'cover',
              borderRadius: 16,
            }}
          />
        </div>
      </div>
    </>
  );
}
