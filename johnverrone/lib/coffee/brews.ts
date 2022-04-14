import {
  notion,
  coffeeDatabaseId,
  roasterDatabaseId,
  hasProperties,
  getPageTitle,
  getProperty,
  getImageUrl,
} from './notion';
import { CoffeeBrew, CoffeeRoaster } from './types';

const CoffeeProperties = {
  currentlyBrewing: {
    name: 'Currently Brewing?',
    type: 'checkbox',
  },
  image: {
    name: 'Image',
    type: 'files',
  },
  roaster: {
    name: 'Roaster',
    type: 'relation',
  },
  slug: {
    name: 'Slug',
    type: 'rich_text',
  },
  rating: {
    name: 'Personal Rating',
    type: 'select',
  },
  origin: {
    name: 'Origin',
    type: 'multi_select',
  },
  singleOrigin: {
    name: 'Single Origin',
    type: 'checkbox',
  },
  flavors: {
    name: 'Flavors',
    type: 'multi_select',
  },
  process: {
    name: 'Process',
    type: 'select',
  },
} as const;

export const getAllCoffeeBrews = async (): Promise<CoffeeBrew[]> => {
  const brews = await notion.databases.query({
    database_id: coffeeDatabaseId,
  });

  const roasters = await notion.databases.query({
    database_id: roasterDatabaseId,
  });

  const roastersById = roasters.results
    .filter(hasProperties)
    .reduce<{ [id: string]: CoffeeRoaster }>(
      (acc, { id, properties }) => ({
        ...acc,
        [id]: {
          id,
          name: getPageTitle(properties),
        },
      }),
      {}
    );

  const brewsById = brews.results
    .filter(hasProperties)
    .reduce<{ [id: string]: CoffeeBrew }>((acc, { id, properties }) => {
      const currentlyBrewing = getProperty(
        properties,
        CoffeeProperties.currentlyBrewing
      ).checkbox;
      const roasterIds = getProperty(
        properties,
        CoffeeProperties.roaster
      ).relation.map((r) => r.id);
      const slug = getProperty(properties, CoffeeProperties.slug).rich_text;
      const rating =
        getProperty(properties, CoffeeProperties.rating).select?.name ?? '';
      const origin = getProperty(properties, CoffeeProperties.origin)
        .multi_select.map((o) => o.name)
        .join(', ');
      const singleOrigin = getProperty(
        properties,
        CoffeeProperties.singleOrigin
      ).checkbox;
      const flavors = getProperty(
        properties,
        CoffeeProperties.flavors
      ).multi_select.map((f) => f.name);
      const process =
        getProperty(properties, CoffeeProperties.process).select?.name ?? '';
      return {
        ...acc,
        [id]: {
          id: slug.length ? slug[0].plain_text : id,
          name: getPageTitle(properties) ?? '',
          roaster: roasterIds.map((id) => roastersById[id]),
          imageUrl: getImageUrl(
            getProperty(properties, CoffeeProperties.image)
          ),
          currentlyBrewing,
          rating,
          origin,
          singleOrigin,
          flavors,
          process,
        },
      };
    }, {});

  return Object.values(brewsById);
};

export const getCoffeeBrewById = async (id: string): Promise<CoffeeBrew> => {
  return Promise.resolve({
    id,
    name: `Coffee ${id}`,
    roaster: [],
    imageUrl: 'test',
    currentlyBrewing: false,
    rating: '1',
    origin: 'test',
    singleOrigin: false,
  });
};
