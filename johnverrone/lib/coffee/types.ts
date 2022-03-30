export interface CoffeeBrew {
  id: string;
  name: string;
  roaster: CoffeeRoaster;
}

export interface CoffeeRoaster {
  id: string;
  name: string;
}
