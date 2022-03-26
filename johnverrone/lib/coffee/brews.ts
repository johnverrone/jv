import { Database } from '@notionhq/client/build/src/api-types';
import { notion, databaseId } from './notion';
import { CoffeeBrew } from './types';

export const getAllCoffeeBrews = async (): Promise<CoffeeBrew[]> => {
  const brews = await notion.databases.query({
    database_id: databaseId,
  });

  return brews.results.map((value) => {
    // const name = value.title.join(',');
    return {
      id: value.id,
      name: 'name',
    };
  });
};
