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

const SplashText = styled.div`
  font-family: ${props => props.theme.fonts.body};
  margin-top: 60px;
  padding: 24px;
  width: 100%;
  @media screen and (min-width: ${props => props.theme.responsive.medium}) {
    position: absolute;
    top: 20%;
    left: 8%;
    max-width: 275px;
    background-color: rgba(255, 255, 255, 0.6);
    border: thin solid grey;
    border-radius: 8px;
  }
  @media screen and (min-width: ${props => props.theme.responsive.large}) {
    position: absolute;
    top: 20%;
    left: 15%;
    background-color: rgba(255, 255, 255, 0.6);
    border: thin solid grey;
    border-radius: 8px;
  }
`;

const IndexPage: React.FC = () => (
  <>
    <Layout title="John and Molly" description="Adventures of digital nomads.">
      <SplashText>Hey gursssss, we&apos;re john and molly</SplashText>
      <BackgroundWrapper>
        <Image
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
