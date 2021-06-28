import React from 'react';
import Image from 'next/image';
import styled from '@emotion/styled';
import { SEO } from '@components/SEO';
import image from '@images/mt-evans.jpg';

const BackgroundWrapper = styled.div`
  position: relative;
  height: 100vh;
  z-index: -1;
`;

const IndexPage: React.FC = () => (
  <>
    <SEO title="John and Molly" description="Adventures of digital nomads.">
      <BackgroundWrapper>
        <Image
          alt="splash image"
          src={image}
          layout="fill"
          objectFit="cover"
          objectPosition="63% 30%"
        />
      </BackgroundWrapper>
    </SEO>
  </>
);

export default IndexPage;
