import { notion, coffeeDatabaseId, roasterDatabaseId } from './notion';
import { CoffeeBrew } from './types';

export const getAllCoffeeBrews = async (): Promise<CoffeeBrew[]> => {
  const brews = await notion.databases.query({
    database_id: coffeeDatabaseId,
  });

  const roasters = await notion.databases.query({
    database_id: roasterDatabaseId,
  });

  const roastersById = roasters.results.reduce<{ [id: string]: any }>(
    (acc, curr) => ({
      ...acc,
      [curr.id]: curr,
    }),
    {}
  );

  const brewsById = brews.results
    .filter(hasProperties)
    .reduce<{ [id: string]: CoffeeBrew }>(
      (acc, { id, properties, ...rest }) => {
        return {
          ...acc,
          [id]: {
            id: id,
            name: getTitle(properties).title[0].plain_text ?? '',
            roaster: {
              id: roastersById[properties['Roaster'].relation[0].id],
              name:
                getTitle(
                  roastersById[properties['Roaster'].relation[0].id].properties
                ).title[0].plain_text ?? '',
            },
            ...rest,
          },
        };
      },
      {}
    );

  return Object.values(brewsById);
};

const hasProperties = <P>(page: P): page is Extract<P, { properties: any }> => {
  return 'properties' in page;
};

const getTitle = <V extends { type: string }>(
  properties: Record<string, V>
) => {
  const titleObject = Object.values(properties).find(
    (property: V): property is Extract<V, { type: 'title' }> =>
      property.type === 'title'
  );
  if (titleObject === undefined) {
    throw new Error('Error fetching title');
  }
  return titleObject;
};

const isTitle = <P extends Record<K, V>, K extends keyof P, V extends P[K]>(
  page: P
): page is Extract<P, { title: any }> => {
  return 'title' in page;
};
