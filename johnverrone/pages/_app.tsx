import React from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@emotion/react';
import theme from '../styles/theme';
import { GlobalStyles } from '@components/GlobalStyles';
import { CoffeeButton } from '@components/CoffeeButton';
import '../styles/reset.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <CoffeeButton />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
