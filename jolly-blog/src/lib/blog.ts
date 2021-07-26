import { Client } from '@notionhq/client';
import { Page } from '@notionhq/client/build/src/api-types';
import { isEmpty } from 'lodash';
import { blocksToMarkdown } from './notion/utils/blockToMarkdown';
import { getPageProperties } from './notion/utils/getPageProperties';
import { getPageTitle } from './notion/utils/getPageTitle';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const database_id = process.env.NOTION_DATABASE || '';

export interface Post {
  id: string;
  title: string;
  date: { start: string; end?: string };
  content?: string;
}

const filterBadData = (page: Page) => !!getPageProperties(page)['Date'];

let cache: Post[] = [];

export const getAllPostIds = async (): Promise<string[]> => {
  if (!isEmpty(cache)) return cache.map(p => p.id);

  const posts = await getAllPosts();
  return posts.map(p => p.id);
};

export const getAllPosts = async (): Promise<Post[]> => {
  if (!isEmpty(cache)) return cache;

  try {
    const posts = await notion.databases.query({
      database_id,
    });

    cache = posts.results.filter(filterBadData).map(page => {
      const title = getPageTitle(page);
      const date = getPageProperties(page)['Date'].date;

      return {
        id: page.id,
        title,
        date,
      };
    });

    return cache;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getPost = async (id: string): Promise<Post | null> => {
  try {
    const page = await notion.pages.retrieve({ page_id: id });
    const blocks = await notion.blocks.children.list({ block_id: id });
    const title = getPageTitle(page);
    const date = getPageProperties(page)['Date'].date;
    const content = blocksToMarkdown(blocks.results);
    return {
      id: page.id,
      title,
      date,
      content,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};
