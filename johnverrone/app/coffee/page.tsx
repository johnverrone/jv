import { getAllCoffeeBrews } from '@lib/coffee/brews';
import { Metadata } from 'next';
import CoffeePage from './coffee-page';

export const metadata: Metadata = {
  title: 'coffee',
};

export default async function Page() {
  const coffees = await getAllCoffeeBrews();

  return <CoffeePage coffees={coffees} />;
}
