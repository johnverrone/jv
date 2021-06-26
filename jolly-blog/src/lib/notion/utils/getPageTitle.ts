import { Page, TitlePropertyValue } from '@notionhq/client/build/src/api-types';
import { blockToString } from './blockToString';

export const getPageTitle = (page: Page) => {
  const titleProp = Object.keys(page.properties).find(
    key => page.properties[key].type === 'title'
  );
  return blockToString(
    (page.properties[titleProp] as TitlePropertyValue).title
  );
};
