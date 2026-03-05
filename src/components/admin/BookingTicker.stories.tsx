import type { Meta, StoryObj } from "@storybook/react";
import BookingTicker from "./BookingTicker";

const meta: Meta<typeof BookingTicker> = {
  title: "Admin/BookingTicker",
  component: BookingTicker,
};
export default meta;

type Story = StoryObj<typeof BookingTicker>;

export const Default: Story = {
  args: {
    items: [
      { id: 101, status: "pending", make: "Toyota", model: "Vitz", plate_number: "AM38-002", customer_name: "Test User" },
      { id: 102, status: "confirmed", make: "Suzuki", model: "Swift", plate_number: "AM38-001", customer_name: "John Doe" },
      { id: 103, status: "cancelled", make: "Honda", model: "Shuttle", plate_number: "AM38-008", customer_name: "Guest" },
    ],
  },
};