import React from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@emotion/react';
import theme from '../styles/theme';
import '../styles/reset.css';
import { NavBar } from '../components/NavBar';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <NavBar siteTitle="John and Molly" />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
