'use client';

import { AppContainer } from '@components/AppContainer';
import { WheelNav } from '@components/Navigation';
import { PhotoList } from '@components/PhotoList';
import { SEO } from '@components/SEO';
import styled from '@emotion/styled';
import iguana from '@images/photos/galapagos/iguana.jpg';
import pelican from '@images/photos/galapagos/pelican.jpg';
import seaLion from '@images/photos/galapagos/sea-lion.jpg';
import overlook from '@images/photos/zion/overlook.jpg';
import patriarchs from '@images/photos/zion/patriarchs.jpg';
import tinyHome from '@images/photos/zion/tiny-home.jpg';
import Image from 'next/image';
import React from 'react';

const CollectionTitle = styled.h3`
  font-family: var(--font-family-heading);
  text-align: center;
  margin-bottom: 12px;
`;

const CollectionWrapper = styled.div`
  margin-bottom: 48px;
`;

const PhotoPage: React.FC = () => {
  return (
    <>
      <SEO title="photo" />
      <WheelNav />
      <AppContainer>
        <CollectionWrapper>
          {/* <CollectionTitle>Zion National Park, United States</CollectionTitle> */}
          <PhotoList>
            <Image
              src={overlook}
              alt="Sunrise view of Zion Canyon Overlook"
              style={{
                maxWidth: '100%',
                height: 'auto',
                objectFit: 'cover',
              }}
            />
            <Image
              src={patriarchs}
              alt="Court of the Patriarchs in Zion National Park"
              style={{
                maxWidth: '100%',
                height: 'auto',
                objectFit: 'cover',
              }}
            />
            <Image
              src={tinyHome}
              alt="Tiny home outside of Zion National Park"
              style={{
                maxWidth: '100%',
                height: 'auto',
                objectFit: 'cover',
              }}
            />
            {/* </PhotoList>
        </CollectionWrapper>
        <CollectionWrapper>
          <CollectionTitle>Galápagos Islands, Ecuador</CollectionTitle>
          <PhotoList> */}
            <Image
              src={iguana}
              alt="Iguana in the Galápagos Islands, Ecuador"
              style={{
                maxWidth: '100%',
                height: 'auto',
                objectFit: 'cover',
              }}
            />
            <Image
              src={pelican}
              alt="Pelican in the Galápagos Islands, Ecuador"
              style={{
                maxWidth: '100%',
                height: 'auto',
                objectFit: 'cover',
              }}
            />
            <Image
              src={seaLion}
              alt="Sea Lion in the Galápagos Islands, Ecuador"
              style={{
                maxWidth: '100%',
                height: 'auto',
                objectFit: 'cover',
              }}
            />
          </PhotoList>
        </CollectionWrapper>
      </AppContainer>
    </>
  );
};

export default PhotoPage;
