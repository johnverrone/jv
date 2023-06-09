'use client';

import { A } from '@components/A';
import { AppContainer } from '@components/AppContainer';
import styled from '@emotion/styled';
import Link from 'next/link';

const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  h1 {
    font-size: 3rem;
    font-family: ${(props) => props.theme.fonts.heading};
    margin-bottom: 1rem;
  }
`;

export default function NotFound() {
  return (
    <AppContainer>
      <ErrorWrapper>
        <h1>oopsies</h1>
        <p>You just hit a route that doesn&#39;t exist 😅</p>
        <Link href="/" passHref legacyBehavior>
          <A>Go Home</A>
        </Link>
      </ErrorWrapper>
    </AppContainer>
  );
}
