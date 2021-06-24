import { Client } from '@notionhq/client';
import { isEmpty } from 'lodash';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const database_id = process.env.NOTION_DATABASE;

export interface Post {
  id: string;
  title: string;
  date: string;
}

let cache: Post[] = [];

export const getAllPostIds = async (): Promise<string[]> => {
  if (!isEmpty(cache)) return cache.map(p => p.id);

  const posts = await getAllPosts();
  return posts.map(p => p.id);
};

export const getAllPosts = async () => {
  if (!isEmpty(cache)) return cache;

  try {
    const posts = await notion.databases.query({
      database_id,
    });

    cache = posts.results.map(page => {
      const title =
        page.properties['Name'].type === 'title'
          ? page.properties['Name'].title.reduce(
              (acc, curr) => (acc += curr.plain_text),
              ''
            )
          : '';
      const date =
        page.properties['Date'].type === 'date'
          ? page.properties['Date'].date.start
          : '';
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

export const getPost = async (id: string) => {
  try {
    const post = await notion.pages.retrieve({ page_id: id });
    const title =
      post.properties['Name'].type === 'title'
        ? post.properties['Name'].title.reduce(
            (acc, curr) => (acc += curr.plain_text),
            ''
          )
        : '';
    return {
      title,
    };
  } catch (error) {
    console.log(error.body);
  }
};
