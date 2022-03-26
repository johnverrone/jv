import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_COFFEE_TOKEN });
const databaseId = process.env.NOTION_COFFEE_DATABASE_ID || '';

export { notion, databaseId };
