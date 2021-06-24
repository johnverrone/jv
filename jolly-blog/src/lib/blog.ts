import { Client } from '@notionhq/client';
import { isEmpty } from 'lodash';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const database_id = process.env.NOTION_DATABASE;

export interface Post {
  id: string;
  title: string;
}

let cache: Post[] = [];

export async function getAllPosts() {
  if (!isEmpty(cache)) {
    console.log('fetching from cache', cache[0]);
    return cache;
  }
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
      return {
        id: page.id,
        title: title,
      };
    });

    return cache;
  } catch (error) {
    console.log(error.body);
  }
}
