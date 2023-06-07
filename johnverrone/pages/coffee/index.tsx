import { CoffeeCard, CoffeeCardList } from '@components/CoffeeCard';
import { WheelNav } from '@components/Navigation';
import { SEO } from '@components/SEO';
import { getAllCoffeeBrews } from '@lib/coffee/brews';
import { CoffeeBrew } from '@lib/coffee/types';
import { GetServerSideProps } from 'next';

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
      <SEO title="Coffee" />
      <WheelNav />
      <CoffeeCardList>
        {coffees.sort(coffeeSortFn).map((coffee) => (
          <CoffeeCard coffee={coffee} key={coffee.id} />
        ))}
      </CoffeeCardList>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  CoffeePageProps
> = async () => {
  const coffees = await getAllCoffeeBrews();
  return { props: { coffees } };
};

export default CoffeePage;
