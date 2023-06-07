import React from 'react';
import Image from "next/legacy/image";
import { SEO } from '@components/SEO';
import { AppContainer } from '@components/AppContainer';
import { WheelNav } from '@components/Navigation';
import { PhotoList } from '@components/PhotoList';
import iguana from '@images/photos/galapagos/iguana.jpg';
import pelican from '@images/photos/galapagos/pelican.jpg';
import seaLion from '@images/photos/galapagos/sea-lion.jpg';
import tinyHome from '@images/photos/zion/tiny-home.jpg';
import overlook from '@images/photos/zion/overlook.jpg';
import patriarchs from '@images/photos/zion/patriarchs.jpg';
import styled from '@emotion/styled';

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
          <CollectionTitle>Zion National Park, United States</CollectionTitle>
          <PhotoList>
            <Image
              src={overlook}
              alt="Sunrise view of Zion Canyon Overlook"
              objectFit="cover"
            />
            <Image
              src={patriarchs}
              alt="Court of the Patriarchs in Zion National Park"
              objectFit="cover"
            />
            <Image
              src={tinyHome}
              alt="Tiny home outside of Zion National Park"
              objectFit="cover"
            />
          </PhotoList>
        </CollectionWrapper>
        <CollectionWrapper>
          <CollectionTitle>Galápagos Islands, Ecuador</CollectionTitle>
          <PhotoList>
            <Image
              src={iguana}
              alt="Iguana in the Galápagos Islands, Ecuador"
              objectFit="cover"
            />
            <Image
              src={pelican}
              alt="Pelican in the Galápagos Islands, Ecuador"
              objectFit="cover"
            />
            <Image
              src={seaLion}
              alt="Sea Lion in the Galápagos Islands, Ecuador"
              objectFit="cover"
            />
          </PhotoList>
        </CollectionWrapper>
      </AppContainer>
    </>
  );
};

export default PhotoPage;
