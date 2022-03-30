import { SEO } from '@components/SEO';
import { SiteTitle } from '@components/SiteTitle';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const CoffeeDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <>
      <SEO title="Coffee" />
      <Link href="/" passHref>
        <SiteTitle>johnverrone</SiteTitle>
      </Link>
      <div>Coffee: {id}</div>
    </>
  );
};

export default CoffeeDetailPage;
