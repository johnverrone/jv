import { Client } from '@notionhq/client';
import type { PageProperties, PageProperty, Property, PropertyType } from './notionTypes';
import {
	NOTION_COFFEE_TOKEN,
	NOTION_ROASTER_DATABASE_ID,
	NOTION_COFFEE_DATABASE_ID
} from '$env/static/private';

export const notion = new Client({ auth: NOTION_COFFEE_TOKEN });
export const coffeeDatabaseId = NOTION_COFFEE_DATABASE_ID || '';
export const roasterDatabaseId = NOTION_ROASTER_DATABASE_ID || '';

export const hasProperties = <P extends object>(
	page: P
): page is Extract<P, { properties: unknown }> => {
	return 'properties' in page;
};

export const getPageTitle = (properties: PageProperties): string => {
	const titleObject = Object.values(properties).find(
		(property): property is Extract<Property, { type: 'title' }> => property.type === 'title'
	);
	if (titleObject === undefined) {
		throw new Error('Error fetching title');
	}
	return titleObject.title[0].plain_text;
};

export const getProperty = <P extends PageProperty, T extends P['type']>(
	properties: PageProperties,
	prop: P
) => {
	const potentialProp = properties[prop.name];
	if (
		!Object.prototype.hasOwnProperty.call(properties, prop.name) ||
		!isType(potentialProp, prop.type)
	) {
		throw new Error(`Unable to find property: ${prop.name}`);
	}

	return potentialProp as Extract<Property, { type: T }>;
};

const isType = <T extends PropertyType>(p: Property, t: T): p is Extract<Property, { type: T }> => {
	return p.type === t;
};

export const getImageUrl = (filesObject: Extract<Property, { type: 'files' }>): string => {
	const image = filesObject.files[0];
	if (!image) return '';
	if (image.type === 'external') {
		return image.external.url;
	}
	if (image.type === 'file') {
		return image.file.url;
	}
	return '';
};
