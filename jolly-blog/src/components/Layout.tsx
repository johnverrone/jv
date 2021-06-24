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
        <link rel="shortcut icon" href="/images/favicon.png" />
      </Head>
      <Header siteTitle="Jolly adventures" />
      <main>{children}</main>
    </ThemeProvider>
  );
};

export default Layout;
