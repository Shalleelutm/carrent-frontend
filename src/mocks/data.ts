import type { CarType } from "../lib/types";

export const mockCars: CarType[] = [
  {
    id: "c1",
    name: "Toyota Vitz (Economy)",
    transmission: "AUTO",
    fuel: "PETROL",
    seats: 5,
    pricePerDayMUR: 1450,
    tags: ["Best value", "City friendly"],
  },
  {
    id: "c2",
    name: "Nissan Note (Comfort)",
    transmission: "AUTO",
    fuel: "PETROL",
    seats: 5,
    pricePerDayMUR: 1750,
    tags: ["Comfort", "Tourist favorite"],
  },
  {
    id: "c3",
    name: "SUV (Premium)",
    transmission: "AUTO",
    fuel: "DIESEL",
    seats: 5,
    pricePerDayMUR: 3200,
    tags: ["Family", "Road trips"],
  },
];