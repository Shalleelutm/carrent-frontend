export type Role = "ADMIN" | "STAFF" | "CUSTOMER";

export type Currency = "MUR" | "EUR" | "USD" | "GBP" | "ZAR";

export type CarType = {
  id: string;
  name: string;
  transmission: "AUTO" | "MANUAL";
  fuel: "PETROL" | "DIESEL" | "HYBRID" | "ELECTRIC";
  seats: number;
  pricePerDayMUR: number;
  image?: string;
  tags?: string[];
};

export type Testimonial = {
  id: string;
  name: string;
  country: string;
  rating: number; // 1..5
  text: string;
};

export type Place = {
  id: string;
  name: string;
  region: string;
  minsFromAirport: number;
  highlight: string;
  image?: string;
};

export type Booking = {
  id: string;
  carId: string;
  carName: string;
  pickup: string;
  startDate: string;
  endDate: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  createdAt: string;
  quote?: {
    days: number;
    subtotal: number;
    payNow: number;
    payAtPickup: number;
  };
  pickupNote?: string;
};