import { GlobalStyles } from '@components/GlobalStyles';
import { ThemeProvider } from '@emotion/react';
import * as FullStory from '@fullstory/browser';
import { AppProps } from 'next/app';
import { useEffect } from 'react';
import '../styles/reset.css';
import theme from '../styles/theme';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    FullStory.init({ orgId: 'Q23YS' });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
