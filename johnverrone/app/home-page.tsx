'use client';

import { SEO } from '@components/SEO';
import styled from '@emotion/styled';
import Link from 'next/link';

const Title = styled.h1`
  width: 100%;
  margin: 0;
  margin-block: 3rem;
  text-align: center;
  font-family: var(--font-family-heading);
  font-size: 1.5rem;
`;

const Bio = styled.ul`
  margin: 0;
  padding: 0;

  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;

const Emphasis = styled.a`
  font-weight: bold;
  color: #bf8640;
  text-decoration: none;
`;

const IndexPage = () => (
  <>
    <SEO description="Personal blog" />
    <Title>johnverrone</Title>
    <Bio>
      <Link href="/work" passHref legacyBehavior>
        <Emphasis>dev</Emphasis>
      </Link>
      <Link href="/photo" passHref legacyBehavior>
        <Emphasis>photos</Emphasis>
      </Link>
      <Link href="/video" passHref legacyBehavior>
        <Emphasis>videos</Emphasis>
      </Link>
      <Link href="/coffee" passHref legacyBehavior>
        <Emphasis>coffee</Emphasis>
      </Link>
    </Bio>
  </>
);

export default IndexPage;
