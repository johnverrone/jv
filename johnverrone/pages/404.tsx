import { AppContainer } from '@components/AppContainer';
import styled from '@emotion/styled';
import Head from 'next/head';

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

const NotFoundPage = () => (
  <>
    <Head>
      <title>oopsies</title>
    </Head>
    <AppContainer>
      <Error>
        <h1>oopsies</h1>
        <p>You just hit a route that doesn&#39;t exist 😅</p>
      </Error>
    </AppContainer>
  </>
);

export default NotFoundPage;
