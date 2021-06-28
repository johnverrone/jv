import { Client } from '@notionhq/client';
import { isEmpty } from 'lodash';
import { blocksToMarkdown } from './notion/utils/blockToMarkdown';
import { getPageProperties } from './notion/utils/getPageProperties';
import { getPageTitle } from './notion/utils/getPageTitle';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const database_id = process.env.NOTION_DATABASE;

export interface Post {
  id: string;
  title: string;
  date: string;
  content?: string;
}

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

    cache = posts.results.map(page => {
      const title = getPageTitle(page);
      const date = getPageProperties(page)['Date'].value;

      return {
        id: page.id,
        title,
        date,
      };
    });

    return cache;
  } catch (error) {
    console.log(error.body);
  }
};

export const getPost = async (id: string): Promise<Post> => {
  try {
    const page = await notion.pages.retrieve({ page_id: id });
    const blocks = await notion.blocks.children.list({ block_id: id });
    const title = getPageTitle(page);
    const date = getPageProperties(page)['Date'].value;
    const content = blocksToMarkdown(blocks.results);
    return {
      id: page.id,
      title,
      date,
      content,
    };
  } catch (error) {
    console.log(error.body);
  }
};
