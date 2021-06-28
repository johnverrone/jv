import { Page } from '@notionhq/client/build/src/api-types';
import { blockToString } from './blockToString';

export const getPageTitle = (page: Page) => {
  const titleProp = Object.values(page.properties).find(
    value => value.type === 'title'
  );

  if (titleProp.type !== 'title') {
    throw new Error(`Unable to retrieve page title for page ${page.id}`);
  }

  return blockToString(titleProp.title);
};
