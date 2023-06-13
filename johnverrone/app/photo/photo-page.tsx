'use client';

import { AppContainer } from '@components/AppContainer';
import { WheelNav } from '@components/Navigation';
import { PhotoList } from '@components/PhotoList';
import styled from '@emotion/styled';
import Image from 'next/image';

const CollectionWrapper = styled.div`
  margin-bottom: 48px;
`;

interface PhotoPageProps {
  images: string[];
}

export default function PhotoPage({ images }: PhotoPageProps) {
  return (
    <>
      <WheelNav />
      <AppContainer>
        <CollectionWrapper>
          <PhotoList>
            {images.map((i) => (
              <Image
                key={i}
                src={i}
                alt="Portfolio image by John"
                width={600}
                height={800}
                style={{
                  height: 'auto',
                  objectFit: 'cover',
                  aspectRatio: '3/4',
                }}
              />
            ))}
          </PhotoList>
        </CollectionWrapper>
      </AppContainer>
    </>
  );
}
