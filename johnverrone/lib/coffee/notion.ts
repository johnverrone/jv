import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_COFFEE_TOKEN });
const coffeeDatabaseId = process.env.NOTION_COFFEE_DATABASE_ID || '';
const roasterDatabaseId = process.env.NOTION_ROASTER_DATABASE_ID || '';

export { notion, coffeeDatabaseId, roasterDatabaseId };
