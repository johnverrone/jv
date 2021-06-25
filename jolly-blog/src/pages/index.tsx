import React from 'react';
import Image from 'next/image';
import styled from '@emotion/styled';
import Layout from '../components/Layout';
import image from '../../public/images/mt-evans.jpg';

const BackgroundWrapper = styled.div`
  position: relative;
  height: 100vh;
  z-index: -1;
`;

const IndexPage: React.FC = () => (
  <>
    <Layout title="John and Molly" description="Adventures of digital nomads.">
      <BackgroundWrapper>
        <Image
          alt="splash image"
          src={image}
          layout="fill"
          objectFit="cover"
          objectPosition="63% 30%"
        />
      </BackgroundWrapper>
    </Layout>
  </>
);

export default IndexPage;
