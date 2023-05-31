import { Layout } from '../components//Layout';
import { AppProps } from 'next/app';
import { Catamaran } from 'next/font/google';
import localFont from 'next/font/local';
import * as FullStory from '@fullstory/browser';
import React, { useEffect } from 'react';
import 'swiper/scss';
import 'swiper/scss/pagination';
import 'swiper/scss/navigation';
import 'swiper/scss/a11y';
import '../styles/globals.scss';

const fionaFont = localFont({
  src: '../styles/fiona.woff2',
  variable: '--fiona-font',
  display: 'swap',
  declarations: [{ prop: 'size-adjust', value: '150%' }],
});

const catamaran = Catamaran({
  variable: '--catamaran-font',
  subsets: ['latin'],
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    FullStory.init({
      orgId: 'Q23YS',
      devMode: process.env.NODE_ENV !== 'production',
    });
  }, []);

  if (typeof window !== 'undefined' && window.document) {
    if (process.env.NEXT_PUBLIC_TEASER_MODE == '1') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    document.documentElement.setAttribute(
      'class',
      `${catamaran.variable} ${fionaFont.variable}`
    );
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default MyApp;
