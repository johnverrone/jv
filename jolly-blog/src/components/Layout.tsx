import React from 'react';
import Head from 'next/head';

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
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content={title} />
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:creator" content="@johnverrone" />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Head>
      <main>{children}</main>
    </>
  );
};

export default Layout;
