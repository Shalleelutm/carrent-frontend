import type { Meta, StoryObj } from "@storybook/react";
import { CarCard } from "./CarCard";

const meta: Meta<typeof CarCard> = {
  title: "App/CarCard",
  component: CarCard,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CarCard>;

export const Default: Story = {
  args: {
    car: {
      id: 174,
      make: "Toyota",
      model: "Corolla",
      year: 2022,
      transmission: "Automatic",
      seats: 5,
      daily_price: 1200,
      category: "Sedan",
    },
    highlight: true,
    startDate: "2026-03-01",
    endDate: "2026-03-03",
    busy: false,
    onChangeStart: () => {},
    onChangeEnd: () => {},
    onBook: () => alert("Book clicked"),
  },
};