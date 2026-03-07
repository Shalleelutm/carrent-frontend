import React from "react";
import { useMyBookings } from "../hooks/useBookings";
import { Button } from "@/components/ui/button";

function statusClass(status: string) {
  const s = String(status || "pending");
  if (s === "confirmed") return "bg-green-100 text-green-800 border-green-200";
  if (s === "cancelled") return "bg-red-100 text-red-800 border-red-200";
  return "bg-yellow-100 text-yellow-800 border-yellow-200";
}

export default function MyBookings() {
  const { data, isLoading } = useMyBookings();

  if (isLoading) return <div className="p-10 text-xl">Loading bookings...</div>;
  if (!data?.length) return <div className="p-10 text-xl">No bookings yet.</div>;

  return (
    <div className="p-10 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-3xl font-bold">My Bookings</h1>

        <Button onClick={() => (window.location.href = "/support")}>
          Need help? Open a ticket
        </Button>
      </div>

      {data.map((b: any) => (
        <div key={b.id} className="border rounded-2xl p-6 shadow-lg bg-white">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="text-xl font-semibold">
                {b.make} {b.model}
              </div>

              <div className="mt-2 text-gray-600">
                {new Date(b.start_datetime || b.start_date).toLocaleDateString()} →{" "}
                {new Date(b.end_datetime || b.end_date).toLocaleDateString()}
              </div>

              <div className="mt-2 font-bold text-black">
                Rs {Number(b.total_price || 0).toLocaleString()}
              </div>
            </div>

            <span
              className={
                "inline-flex items-center px-3 py-1 text-xs font-semibold border rounded-full " +
                statusClass(b.status)
              }
            >
              {String(b.status || "pending").toUpperCase()}
            </span>
          </div>

          <div className="mt-4 text-sm text-black/50">
            Booking ID: #{b.id}
          </div>
        </div>
      ))}
    </div>
  );
}