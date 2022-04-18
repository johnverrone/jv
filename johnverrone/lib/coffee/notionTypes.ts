import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';

export type PageProperties = Extract<
  QueryDatabaseResponse['results'][0],
  { properties: any }
>['properties'];

export type Property = PageProperties[string];

export type PropertyType = Property['type'];

export interface PageProperty {
  name: string;
  type: PropertyType;
}
