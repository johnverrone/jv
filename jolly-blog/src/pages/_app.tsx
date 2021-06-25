import React from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@emotion/react';
import theme from '../styles/theme';
import '../styles/reset.css';
import { NavBar } from '../components/NavBar';
import styled from '@emotion/styled';

const RootStyle = styled.div`
  font-family: ${props => props.theme.fonts.body};
  color: ${props => props.theme.colors.text};
`;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <RootStyle>
        <NavBar siteTitle="John and Molly" />
        <Component {...pageProps} />
      </RootStyle>
    </ThemeProvider>
  );
}
