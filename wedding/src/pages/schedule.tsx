import Head from 'next/head';
import React from 'react';
import Image from 'next/image';
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
              attire="Casual"
              description="Join us for drinks, games, and food in Evergreen as we kick off the weekend!"
              location="The Wild Game Evergreen"
              locationUrl="https://goo.gl/maps/rxeWAnAb2TREcyeMA"
              name="Welcome Party"
              time="6:30 pm - 9:30 pm"
            />
          </Day>
          <Day label="Saturday">
            <CalendarEvent
              attire="Semi-formal"
              description="Have a seat as we make this thing official! If you plan on taking the provided shuttles from the hotel, please be ready by 4:15pm."
              location="Hiwan Golf Club"
              locationUrl="https://g.page/Hiwan?share"
              name="Ceremony"
              time="5:00 pm - 5:30 pm"
            />
            <CalendarEvent
              attire="Semi-formal"
              description="Grab a drink with us after the ceremony before we get the party started."
              location="Hiwan Golf Club"
              locationUrl="https://g.page/Hiwan?share"
              name="Cocktail Hour"
              time="5:30 pm - 6:30 pm"
            />
            <CalendarEvent
              attire="Semi-formal"
              description="Dinner, drinks, and dancing"
              location="Hiwan Golf Club"
              locationUrl="https://g.page/Hiwan?share"
              name="Reception"
              time="6:30 pm - 10:30 pm"
            />
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
