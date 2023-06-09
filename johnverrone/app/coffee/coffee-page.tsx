'use client';

import { CoffeeCard, CoffeeCardList } from '@components/CoffeeCard';
import { WheelNav } from '@components/Navigation';
import { CoffeeBrew } from '@lib/coffee/types';

const coffeeSortFn = (a: CoffeeBrew, b: CoffeeBrew) => {
  const currentlyBrewingFirst =
    a.currentlyBrewing === b.currentlyBrewing ? 0 : a.currentlyBrewing ? -1 : 1;
  const ratingDescending = b.rating.length - a.rating.length;

  return currentlyBrewingFirst || ratingDescending;
};

interface CoffeePageProps {
  coffees: CoffeeBrew[];
}

const CoffeePage = ({ coffees }: CoffeePageProps) => {
  return (
    <>
      <WheelNav />
      <CoffeeCardList>
        {coffees.sort(coffeeSortFn).map((coffee) => (
          <CoffeeCard coffee={coffee} key={coffee.id} />
        ))}
      </CoffeeCardList>
    </>
  );
};

export default CoffeePage;
