import { Page, PropertyValue } from '@notionhq/client/build/src/api-types';

type PageProperty = PropertyValue & {
  value: string;
};

export const getPageProperties = (
  page: Page
): { [key: string]: PageProperty } => {
  const properties = Object.keys(page.properties).reduce((acc, key) => {
    const prop = page.properties[key];

    if (prop.type === 'title') return acc;

    if (prop.type === 'date') {
      const date = prop.date;

      return {
        ...acc,
        [key]: {
          ...page.properties[key],
          value: date.end ? `${date.start} - ${date.end}` : date.start,
        },
      };
    }

    return {
      ...acc,
      [key]: {
        ...page.properties[key],
        value: page.properties[key][page.properties[key].type],
      },
    };
  }, {});

  return properties;
};
