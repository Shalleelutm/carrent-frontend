import type { Meta, StoryObj } from "@storybook/react";
import { Wallet, CalendarDays, Car } from "lucide-react";
import { StatsCard } from "./StatsCard";

const meta: Meta<typeof StatsCard> = {
  title: "App/StatsCard",
  component: StatsCard,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof StatsCard>;

export const TotalSpent: Story = {
  args: {
    label: "Total Spent",
    value: "Rs 12,450",
    icon: <Wallet className="h-5 w-5" />,
    hint: "Sum of all bookings placed by the customer.",
  },
};

export const TotalDays: Story = {
  args: {
    label: "Total Days",
    value: "8",
    icon: <CalendarDays className="h-5 w-5" />,
    hint: "Total rental duration across all reservations.",
  },
};

export const Bookings: Story = {
  args: {
    label: "Bookings",
    value: "3",
    icon: <Car className="h-5 w-5" />,
    hint: "Number of reservations created by the customer.",
  },
};