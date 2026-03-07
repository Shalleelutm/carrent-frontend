import type { Meta, StoryObj } from "@storybook/react";
import { Car } from "lucide-react";
import StatsCard from "./StatsCard";

const meta: Meta<typeof StatsCard> = {
  title: "Admin/StatsCard",
  component: StatsCard,
};
export default meta;

type Story = StoryObj<typeof StatsCard>;

export const Default: Story = {
  args: { title: "Total Cars", value: 68, subtitle: "Fleet size", icon: <Car className="h-5 w-5" /> },
};