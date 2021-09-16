import React from 'react';
import Image from 'next/image';
import styled from '@emotion/styled';
import { SEO } from '@components/SEO';
import image from '@images/john.jpg';

const BackgroundWrapper = styled.div`
  position: relative;
  height: 100vh;
  z-index: -1;
`;

const IndexPage: React.FC = () => (
  <>
    <SEO title="John Verrone" description="Personal blog" />
    <BackgroundWrapper>
      <Image
        alt="john"
        src={image}
        layout="fill"
        objectFit="cover"
        objectPosition="50% 15%"
      />
    </BackgroundWrapper>
  </>
);

export default IndexPage;
