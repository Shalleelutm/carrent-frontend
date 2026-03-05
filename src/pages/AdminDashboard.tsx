import React from "react";
import { BarChart3, Car, BadgeCheck, Clock, XCircle, Coins } from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";
import BookingTicker from "@/components/admin/BookingTicker";
import { useAdminDashboardQuery, useAdminTickerQuery } from "@/lib/adminQueries";

export default function AdminDashboard() {
  const { data: dash, isLoading: loadingDash } = useAdminDashboardQuery();
  const { data: ticker, isLoading: loadingTicker } = useAdminTickerQuery();

  if (loadingDash) return <div className="p-10">Loading admin dashboard...</div>;

  return (
    <div className="p-10 space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-black">Admin Command Center</div>
          <div className="text-sm text-black/50">Live stats, bookings, and operations</div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatsCard title="Total Cars" value={dash?.totalCars ?? 0} icon={<Car className="h-5 w-5" />} />
        <StatsCard title="Total Bookings" value={dash?.totalBookings ?? 0} icon={<BarChart3 className="h-5 w-5" />} />
        <StatsCard title="Bookings Today" value={dash?.bookingsToday ?? 0} icon={<Clock className="h-5 w-5" />} />

        <StatsCard title="Pending" value={dash?.pendingBookings ?? 0} icon={<Clock className="h-5 w-5" />} />
        <StatsCard title="Confirmed" value={dash?.confirmedBookings ?? 0} icon={<BadgeCheck className="h-5 w-5" />} />
        <StatsCard title="Cancelled" value={dash?.cancelledBookings ?? 0} icon={<XCircle className="h-5 w-5" />} />

        <StatsCard title="Revenue Total" value={`Rs ${Number(dash?.revenueTotal ?? 0).toLocaleString()}`} icon={<Coins className="h-5 w-5" />} />
        <StatsCard title="Revenue Today" value={`Rs ${Number(dash?.revenueToday ?? 0).toLocaleString()}`} icon={<Coins className="h-5 w-5" />} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <BookingTicker items={ticker || []} />
        <div className="rounded-2xl border bg-white shadow-sm p-6">
          <div className="text-sm font-bold">Next</div>
          <div className="text-sm text-black/60 mt-2">
            Go to <span className="font-semibold">/admin/reservations</span> for the super table with status colors + search.
          </div>
        </div>
      </div>

      {loadingTicker ? <div className="text-sm text-black/40">Loading ticker...</div> : null}
    </div>
  );
}