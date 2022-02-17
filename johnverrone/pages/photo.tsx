import React from 'react';
import Image from 'next/image';
import { SEO } from '@components/SEO';
import { AppContainer } from '@components/AppContainer';
import { WheelNav } from '@components/Navigation';
import { PhotoList } from '@components/PhotoList';
import iguana from '@images/photos/iguana.jpg';
import pelican from '@images/photos/pelican.jpg';
import seaLion from '@images/photos/sea-lion.jpg';
import styled from '@emotion/styled';

const CollectionTitle = styled.h3`
  font-family: var(--font-family-heading);
  text-align: center;
  margin-bottom: 12px;
`;

const PhotoPage: React.FC = () => {
  return (
    <>
      <SEO title="photo" />
      <WheelNav />
      <AppContainer>
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
      </AppContainer>
    </>
  );
};

export default PhotoPage;
