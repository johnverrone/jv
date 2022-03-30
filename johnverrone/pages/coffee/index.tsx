import React from 'react';
import { SEO } from '@components/SEO';
import Link from 'next/link';
import { getAllCoffeeBrews } from '@lib/coffee/brews';
import { GetServerSideProps } from 'next';
import { CoffeeBrew } from '@lib/coffee/types';
import { CoffeeCard, CoffeeCardList } from '@components/CoffeeCard';
import { SiteTitle } from '@components/SiteTitle';

interface CoffeePageProps {
  coffees: CoffeeBrew[];
}

const CoffeePage: React.FC<CoffeePageProps> = ({ coffees }) => {
  return (
    <>
      <SEO title="Coffee" />
      <Link href="/" passHref>
        <SiteTitle>johnverrone</SiteTitle>
      </Link>
      <CoffeeCardList>
        {coffees.map((coffee) => (
          <CoffeeCard coffee={coffee} key={coffee.id} />
        ))}
      </CoffeeCardList>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<CoffeePageProps> =
  async () => {
    const coffees = await getAllCoffeeBrews();
    return { props: { coffees } };
  };

export default CoffeePage;
