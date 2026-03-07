import type { Meta, StoryObj } from "@storybook/react";
import StatusBadge from "./StatusBadge";

const meta: Meta<typeof StatusBadge> = {
  title: "Admin/StatusBadge",
  component: StatusBadge,
};
export default meta;

type Story = StoryObj<typeof StatusBadge>;

export const Pending: Story = { args: { status: "pending" } };
export const Confirmed: Story = { args: { status: "confirmed" } };
export const Cancelled: Story = { args: { status: "cancelled" } };