import { getCoffeeBrewById } from '@lib/coffee/brews';
import { Metadata } from 'next';
import CoffeeDetailPage from './coffee-detail-page';

export const metadata: Metadata = {
  title: 'coffee',
};

export default async function Page({ params }: { params: { id: string } }) {
  const coffee = await getCoffeeBrewById(params.id);

  return <CoffeeDetailPage coffee={coffee} />;
}
