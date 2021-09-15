import React from 'react';
import Head from 'next/head';
import styled from '@emotion/styled';
import { AppContainer } from '@components/AppContainer';

const Error = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  h1 {
    font-size: 3rem;
    font-family: ${props => props.theme.fonts.heading};
    margin-bottom: 1rem;
  }
`;

const NotFoundPage: React.FC = () => (
  <>
    <Head>
      <title>coming soon!</title>
    </Head>
    <AppContainer>
      <Error>
        <h1>coming soon!</h1>
        <p>🚧 website currently under construction 🚧</p>
      </Error>
    </AppContainer>
  </>
);

export default NotFoundPage;
