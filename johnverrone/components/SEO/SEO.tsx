import React from 'react';
import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  meta?: ConcatArray<any>;
  lang?: string;
}

export const SEO: React.FC<SEOProps> = ({ title = '', description = '' }) => {
  const fullTitle = `John Verrone | ${title}`;
  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content={fullTitle} />
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:creator" content="@johnverrone" />
        <meta property="twitter:title" content={fullTitle} />
        <meta property="twitter:description" content={description} />
      </Head>
    </>
  );
};
