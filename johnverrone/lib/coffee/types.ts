export interface CoffeeBrew {
  currentlyBrewing: boolean;
  flavors?: string[];
  id: string;
  imageUrl?: string;
  name: string;
  origin: string;
  process?: string;
  roaster: CoffeeRoaster[];
  rating: string;
  singleOrigin: boolean;
}

export interface CoffeeRoaster {
  id: string;
  name: string;
}
