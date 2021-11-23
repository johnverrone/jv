import React from 'react';
import Image from 'next/image';
import styled from '@emotion/styled';
import { SEO } from '@components/SEO';
import image from '@images/painted-wall-full.jpg';
import { NavBar } from '@components/Navigation';

const BackgroundWrapper = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: -1;
`;

const Title = styled.h1`
  position: absolute;
  top: 92px;
  width: 100%;
  margin: 0;
  text-align: center;
  font-family: var(--font-family-heading);
`;

const Bio = styled.p`
  position: absolute;
  top: 190px;
  width: 100%;
  margin: 0;
  text-align: center;
  line-height: 2;
`;

const Emphasis = styled.strong`
  font-weight: bold;
`;

const IndexPage: React.FC = () => (
  <>
    <SEO description="Personal blog" />
    <BackgroundWrapper>
      <Image
        alt="john"
        src={image}
        layout="fill"
        objectFit="cover"
        objectPosition="33% 66%"
        placeholder="blur"
        priority
      />
    </BackgroundWrapper>
    <NavBar />
    <Title>johnverrone</Title>
    <Bio>
      I primarily build things for the <Emphasis>web</Emphasis>.
      <br />I enjoy taking <Emphasis>pics</Emphasis> of cool places.
      <br />
      Occasionally I tell a story through <Emphasis>film</Emphasis>,
      <br />
      Very rarely will I <Emphasis>write</Emphasis> about stuff.
    </Bio>
  </>
);

export default IndexPage;
