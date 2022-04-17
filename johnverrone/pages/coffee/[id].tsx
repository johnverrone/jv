import { A } from '@components/A';
import { AppContainer } from '@components/AppContainer';
import { CoffeeCard } from '@components/CoffeeCard';
import { SEO } from '@components/SEO';
import { SiteTitle } from '@components/SiteTitle';
import styled from '@emotion/styled';
import { getCoffeeBrewById } from '@lib/coffee/brews';
import { CoffeeBrew } from '@lib/coffee/types';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import React, { Fragment } from 'react';

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 500px;
`;

interface CoffeeDetailPageProps {
  coffee: CoffeeBrew;
}

interface RouteProps extends ParsedUrlQuery {
  id: string;
}

const CoffeeDetailPage: React.FC<CoffeeDetailPageProps> = ({ coffee }) => {
  const coffeeRoasterString = coffee.roaster.map((r) => r.name).join(', ');
  const coffeeRoasterNode: React.ReactNode = coffee.roaster.map(
    (roaster, i) => (
      <Fragment key={roaster.id}>
        <Link href={`/roaster/${roaster.id}`} passHref>
          <A>{roaster.name}</A>
        </Link>
        {i < coffee.roaster.length - 1 && ', '}
      </Fragment>
    )
  );

  return (
    <>
      <SEO title="Coffee" />
      <Link href="/" passHref>
        <SiteTitle>johnverrone</SiteTitle>
      </Link>
      <AppContainer>
        <Link href="/coffee" passHref>
          <A>← all coffee</A>
        </Link>
        <Wrapper>
          <CoffeeCard coffee={coffee} />
        </Wrapper>
      </AppContainer>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  CoffeeDetailPageProps,
  RouteProps
> = async ({ params }) => {
  if (!params) return { notFound: true };
  try {
    const coffee = await getCoffeeBrewById(params?.id);
    return { props: { coffee } };
  } catch (err) {
    return { notFound: true };
  }
};

export default CoffeeDetailPage;
