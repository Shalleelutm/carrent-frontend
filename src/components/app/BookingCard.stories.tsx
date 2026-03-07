import type { Meta, StoryObj } from "@storybook/react";
import { BookingCard } from "./BookingCard";

const meta: Meta<typeof BookingCard> = {
  title: "App/BookingCard",
  component: BookingCard,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof BookingCard>;

export const Pending: Story = {
  args: {
    booking: {
      id: 7,
      car_id: 174,
      make: "Toyota",
      model: "Corolla",
      daily_price: 1200,
      start_datetime: new Date(Date.now() + 86400000).toISOString(),
      end_datetime: new Date(Date.now() + 3 * 86400000).toISOString(),
      total_price: 2400,
      status: "pending",
    },
    onViewCar: (carId) => alert(`View car ${carId}`),
  },
};

export const Confirmed: Story = {
  args: {
    booking: {
      id: 8,
      car_id: 176,
      make: "Nissan",
      model: "Sentra",
      daily_price: 1550,
      start_datetime: new Date(Date.now() + 2 * 86400000).toISOString(),
      end_datetime: new Date(Date.now() + 6 * 86400000).toISOString(),
      total_price: 6200,
      status: "confirmed",
    },
    onViewCar: (carId) => alert(`View car ${carId}`),
  },
};