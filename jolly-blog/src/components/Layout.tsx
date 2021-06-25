import React from 'react';
import Head from 'next/head';
import Header from './Header';
import { ThemeProvider } from '@emotion/react';
import theme from '../styles/theme';

interface LayoutProps {
  title: string;
  description?: string;
  meta?: ConcatArray<any>;
  lang?: string;
}

const Layout: React.FC<LayoutProps> = ({
  title,
  description = '',
  children,
}) => {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content={title} />
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:creator" content="@johnverrone" />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏔</text></svg>"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
      </Head>
      <Header siteTitle="John and Molly" />
      <main>{children}</main>
    </ThemeProvider>
  );
};

export default Layout;
