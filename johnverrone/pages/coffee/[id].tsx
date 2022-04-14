import { A } from '@components/A';
import { AppContainer } from '@components/AppContainer';
import {
  PropertyList as PL,
  PropertyTitle as PT,
  PropertyValue as PV,
} from '@components/PropertyList';
import { SEO } from '@components/SEO';
import { SiteTitle } from '@components/SiteTitle';
import styled from '@emotion/styled';
import { getCoffeeBrewById } from '@lib/coffee/brews';
import { CoffeeBrew } from '@lib/coffee/types';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';

const Wrapper = styled.section`
  max-width: 500px;
  margin: 0 auto;
`;

const CoffeeTitle = styled.h2`
  margin-bottom: 20px;
`;

const PropertyList = styled(PL)`
  display: grid;
  grid-template-columns: max-content;
  gap: 20px;

  align-items: center;
`;

const PropertyTitle = styled(PT)`
  grid-column-start: 1;
`;

const PropertyValue = styled(PV)`
  grid-column-start: 2;
  margin: 0;
`;

interface CoffeeDetailPageProps {
  coffee: CoffeeBrew;
}

interface RouteProps extends ParsedUrlQuery {
  id: string;
}

const CoffeeDetailPage: React.FC<CoffeeDetailPageProps> = ({ coffee }) => {
  console.log({ coffee });
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
          <CoffeeTitle>{coffee.name}</CoffeeTitle>
          <PropertyList>
            <PropertyTitle>Roaster</PropertyTitle>
            <PropertyValue>roaster</PropertyValue>
            <PropertyTitle>Origin</PropertyTitle>
            <PropertyValue>origin</PropertyValue>
            <PropertyTitle>Flavors</PropertyTitle>
            <PropertyValue>flavors</PropertyValue>
            <PropertyTitle>Rating</PropertyTitle>
            <PropertyValue>rating</PropertyValue>
          </PropertyList>
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
  const coffee = await getCoffeeBrewById(params?.id);
  return { props: { coffee } };
};

export default CoffeeDetailPage;
