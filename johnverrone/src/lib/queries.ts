export const coffeeQuery = `*[_type == "coffee" && slug.current == $slug][0]`;

export interface CoffeeResult {
	name: string;
}
