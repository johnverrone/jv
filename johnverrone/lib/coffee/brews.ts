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
        console.log(properties);
        return {
          ...acc,
          [id]: {
            id: id,
            name: getTitle(properties).title[0].plain_text,
            roaster: {
              id: roastersById[properties['Roaster'].relation[0].id],
              name: getTitle(
                roastersById[properties['Roaster'].relation[0].id].properties
              ).title[0].plain_text,
            },
            ...rest,
          },
        };
      },
      {}
    );

  return Object.values(brewsById);
};

// const getTitle = <P extends Record<string, V>, V extends { type: string }>(
//   properties: P
// ): string => {
//   return Object.values(properties).find((p) => p.type === 'title')?.title[0]
//     .text.content;
// };

const hasProperties = <
  P extends Record<K, V>,
  K extends keyof P,
  V extends P[K]
>(
  page: P
): page is Extract<P, { properties: any }> => {
  return 'properties' in page;
};

const isTitle = <P extends Record<K, V>, K extends keyof P, V extends P[K]>(
  page: P
): page is Extract<P, { title: any }> => {
  return 'title' in page;
};

const getTitle = <P extends Record<K, V>, K extends keyof P, V extends P[K]>(
  properties: P
) => {
  const values = Object.values<V>(properties);
  return values.filter(isTitle)[0];

  // .find(
  //   (p: V): p is Extract<P, { title: string }> => {
  //     return 'type' in p ? p.type === 'title'
  // );
  // ? (properties[key] as unknown as Extract<P, Record<K, V>>)
  // : undefined;
};

// const getProperty = <P extends Record<K, V>, K extends keyof P, V extends P[K]>(
//   properties: P,
//   key: K,
//   value: string
// ) => {
//   const values = Object.values<V>(properties);
//   console.log(values);
//   return values.find((p: V): p is Extract<P, Record<K, V>> => p.type === value);
//   // ? (properties[key] as unknown as Extract<P, Record<K, V>>)
//   // : undefined;
// };
