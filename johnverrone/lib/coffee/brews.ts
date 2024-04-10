import 'server-only';

import {
  coffeeDatabaseId,
  getImageUrl,
  getPageTitle,
  getProperty,
  hasProperties,
  notion,
  roasterDatabaseId,
} from './notion';
import { PageProperties } from './notionTypes';
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
    type: 'formula',
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

export const getRoastersById = async (): Promise<{
  [id: string]: CoffeeRoaster;
}> => {
  const roasters = await notion.databases.query({
    database_id: roasterDatabaseId,
  });

  return roasters.results
    .filter(hasProperties)
    .reduce<{ [id: string]: CoffeeRoaster }>(
      (acc, { id, properties }) => ({
        ...acc,
        [id]: notionResultToRoaster(id, properties),
      }),
      {}
    );
};

export const getAllCoffeeBrews = async (): Promise<CoffeeBrew[]> => {
  const roastersById = await getRoastersById();

  const brews = await notion.databases.query({
    database_id: coffeeDatabaseId,
  });

  const brewsById = brews.results
    .filter(hasProperties)
    .reduce<{ [id: string]: CoffeeBrew }>((acc, { id, properties }) => {
      const coffee = notionResultToCoffeeBrew(id, properties, roastersById);
      return {
        ...acc,
        [id]: coffee,
      };
    }, {});

  return Object.values(brewsById);
};

export const getCoffeeBrewById = async (id: string): Promise<CoffeeBrew> => {
  const roastersById = await getRoastersById();

  const brewsQuery = await notion.databases.query({
    database_id: coffeeDatabaseId,
    filter: {
      property: CoffeeProperties.slug.name,
      [CoffeeProperties.slug.type]: {
        contains: id,
      },
    },
  });

  const brews = brewsQuery.results.filter(hasProperties);
  if (!brews.length) throw new Error(`Unable to find coffee with id: ${id}`);
  const brew = brews[0];

  return notionResultToCoffeeBrew(brew.id, brew.properties, roastersById);
};

const notionResultToCoffeeBrew = (
  id: string,
  properties: PageProperties,
  roastersById: { [id: string]: CoffeeRoaster }
): CoffeeBrew => {
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
  ).formula;
  const flavors = getProperty(
    properties,
    CoffeeProperties.flavors
  ).multi_select.map((f) => f.name);
  const process =
    getProperty(properties, CoffeeProperties.process).select?.name ?? '';

  return {
    id: slug.length ? slug[0].plain_text : id,
    name: getPageTitle(properties) ?? '',
    roaster: roasterIds.map((id) => roastersById[id]),
    imageUrl: getImageUrl(getProperty(properties, CoffeeProperties.image)),
    currentlyBrewing,
    rating,
    origin,
    singleOrigin: singleOrigin.type === 'boolean' ? singleOrigin.boolean ?? false : false,
    flavors,
    process,
  };
};

const notionResultToRoaster = (
  id: string,
  properties: PageProperties
): CoffeeRoaster => ({
  id,
  name: getPageTitle(properties),
});
