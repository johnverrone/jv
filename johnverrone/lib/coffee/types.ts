export interface CoffeeBrew {
  id: string;
  name: string;
  roaster: CoffeeRoaster;
  imageUrl?: string;
}

export interface CoffeeRoaster {
  id: string;
  name: string;
}
