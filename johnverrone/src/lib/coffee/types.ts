export interface CoffeeBean {
	name: string;
	slug: string;
	roaster: string;
	rating: number | null;
	origins: string[];
	flavors: string[];
	process: string;
	single_origin: boolean;
	currently_brewing: boolean;
	price_12oz: number | null;
	notes: string;
	image_url: string;
	created: string;
}

export interface CoffeeRoaster {
	name: string;
	slug: string;
	location: string;
	website: string;
	notes: string;
	image_url: string;
}
