import { SectionHeader } from '../components/SectionHeader';
import { Text } from '../components/Text';
import { StoryImage } from '../components/StoryImage';
import Head from 'next/head';
import React, { ComponentProps } from 'react';
import css from './our-story.module.scss';
import * as photos from '../photos';

export default function OurStory({}) {
  return (
    <>
      <Head>
        <title>Molly &amp; John&apos;s Story</title>
        <meta
          name="description"
          content="Your complete guide to the wedding of Molly Dickinson and John Verrone. Find travel information, registry details, and RSVP here."
        />
      </Head>

      <SectionHeader title="The Story of Jolly" />

      <div className={css.storyWrapper}>
        <Text variant="body2" tag="p">
          When you think of romantic locations around the globe, what comes to
          mind? The Eiffel Tower sparkling at night? The California coastline
          during sunset? The chalk white buildings of Santorini, Greece? How
          about… a storage unit along Buford Highway in Chamblee, Georgia?
        </Text>
        <Text variant="body2" tag="p">
          That&apos;s right. The story of Molly and John began in a 5&apos; x
          10&apos; storage unit. In 2017, Molly made the tough decision to pack
          up her things in New York City and move down to Atlanta to pursue a
          career in User Experience Design. Molly&apos;s best friend, Laura,
          offered up her at-the-time fiancé now husband, Brian, and a few of his
          friends to assist Molly in unloading the U-Haul upon her arrival in
          ATL.
        </Text>
        <Text variant="body2" tag="p">
          We could go on, but we don&apos;t want to bore you with a novel.
          Instead, let&apos; embark on a photo journey. Please enjoy.
        </Text>
        {/* <YearSeparator year="2017" /> */}
        <StoryImage
          src={photos.storageUnit}
          alt="Molly in the storage unit"
          caption="Where it all started! John, Justin, and Brian help Molly pack away
            her belongings from NYC. (She moved in with Lauren & Wes
            temporarily)"
        />
        insert photo brian & lauras wedding
        {/* <YearSeparator year="2018" /> */}
        <StoryImage
          src={photos.running}
          alt="John and Molly after a run with the Atlanta skyling in the background"
          caption="In the early days, Molly joined in on TMRC (Tuesday Morning Run
            Club) to spend time with the Atlanta crew. Unbeknownst to John,
            Molly hated running but pretended to enjoy it to spend time with
            him. 🥹"
        />
        <StoryImage
          src={photos.prr}
          alt="Selfie of John and Molly after runnnig the Peachtre Road Race"
          caption="She even went as far as signing up and completing the 2018 Peachtree
            Road Race, an annual 10k held in Atlanta, GA."
        />
        <StoryImage
          src={photos.musicMidtown}
          alt="Selfie of John and Molly at the 2018 Music Midtown festival"
          caption="Fast forward past our first official date."
        />
        <StoryImage
          src={photos.pinkAgenda2018}
          alt="John and Molly at the annual Pink Agenda Gala"
          caption=""
        />
        <Text variant="body2" tag="p">
          And that brings us to today. We look forward to celebrating with you.
        </Text>
        <Text variant="body2" tag="p">
          &lt;3 jolly
        </Text>
      </div>
    </>
  );
}
