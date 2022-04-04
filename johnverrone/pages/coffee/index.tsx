import React from 'react';
import { SEO } from '@components/SEO';
import Link from 'next/link';
import { getAllCoffeeBrews } from '@lib/coffee/brews';
import { GetServerSideProps } from 'next';
import { CoffeeBrew } from '@lib/coffee/types';
import { CoffeeCard, CoffeeCardList } from '@components/CoffeeCard';
import { SiteTitle } from '@components/SiteTitle';

const coffeeSortFn = (a: CoffeeBrew, b: CoffeeBrew) => {
  const currentlyBrewingFirst =
    a.currentlyBrewing === b.currentlyBrewing ? 0 : a.currentlyBrewing ? -1 : 1;
  const ratingDescending = b.rating.length - a.rating.length;

  return currentlyBrewingFirst || ratingDescending;
};

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
        {coffees.sort(coffeeSortFn).map((coffee) => (
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
