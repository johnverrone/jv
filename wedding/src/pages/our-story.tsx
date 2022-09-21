import { SectionHeader } from '../components/SectionHeader';
import { Text } from '../components/Text';
import Head from 'next/head';
import React from 'react';
import css from '@styles/our-story.module.css';

export default function OurStory({}) {
  return (
    <>
      <Head>
        <title>John &amp; Molly&apos;s Story</title>
        <meta name="description" content="Generated by create next app" />
      </Head>

      <SectionHeader title="Our Story" subtitle="The story of Jolly" />

      <div className={css.storyWrapper}>
        <Text variant="body2" tag="p">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam a
          tortor convallis, placerat est id, placerat magna. Sed eu magna
          pellentesque, accumsan ex a, gravida urna. Maecenas in pulvinar felis.
          Fusce sit amet vehicula neque. Ut sagittis lorem eu nibh hendrerit
          rhoncus. Nam eget velit vitae turpis pellentesque laoreet. Phasellus
          egestas in diam id mattis. Aliquam volutpat eu lectus at facilisis.
          Aliquam vel mi vel mi viverra egestas. Suspendisse id urna posuere,
          eleifend purus non, euismod ipsum. Duis gravida id turpis vitae
          auctor. Duis ornare, eros eget interdum vehicula, lacus est mattis
          sem, vel consectetur odio ipsum eu ipsum. Fusce nec sapien convallis,
          tempus orci at, sagittis erat. Sed ultricies tincidunt ante, aliquam
          tincidunt enim viverra imperdiet. Vivamus maximus, eros sit amet
          accumsan rutrum, urna erat vestibulum eros, vel sollicitudin dui felis
          at purus. Vestibulum et convallis metus.
        </Text>
        <Text variant="body2" tag="p">
          Mauris mollis consequat magna, sed maximus enim pellentesque sit amet.
          Sed sodales, quam nec congue efficitur, neque sapien placerat ex, ac
          aliquam libero tortor quis diam. Mauris eros sem, pellentesque vel
          egestas ac, egestas ac orci. Morbi iaculis tristique maximus. Vivamus
          aliquam leo ex, id hendrerit tellus eleifend molestie. Suspendisse ut
          tincidunt nisl. In maximus ultricies odio eu mollis. Nulla libero
          quam, tincidunt a ullamcorper nec, pharetra vel felis. Maecenas
          vulputate risus sit amet neque vehicula blandit. Aenean vitae turpis
          dui. Proin id sem eu ligula euismod viverra a eu nulla. Morbi dictum,
          sem in imperdiet tristique, sem eros fringilla elit, at hendrerit arcu
          velit tincidunt nisl. Proin finibus tincidunt quam vitae pellentesque.
          Vivamus rhoncus, neque id malesuada cursus, sapien nulla pretium
          massa, in fringilla sapien turpis vel orci. Proin in laoreet mi, non
          molestie nisl.
        </Text>
      </div>
    </>
  );
}
