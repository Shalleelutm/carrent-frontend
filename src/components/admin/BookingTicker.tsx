import React from "react";
import { motion } from "framer-motion";
import StatusBadge from "./StatusBadge";

export default function BookingTicker({ items }: { items: any[] }) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b flex items-center justify-between">
        <div className="text-sm font-bold">Live Booking Ticker</div>
        <div className="text-xs text-black/50">Auto-updates</div>
      </div>

      <div className="max-h-72 overflow-auto">
        {items?.length ? (
          items.map((x, idx) => (
            <motion.div
              key={`${x.id}-${idx}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-5 py-3 border-b flex items-center gap-3"
            >
              <div className="text-xs font-semibold text-black/60">#{x.id}</div>
              <div className="flex-1">
                <div className="text-sm font-semibold">
                  {x.customer_name || "Guest"} — {x.make} {x.model}
                </div>
                <div className="text-xs text-black/50">{x.plate_number || "AM38"}</div>
              </div>
              <StatusBadge status={x.status} />
            </motion.div>
          ))
        ) : (
          <div className="p-5 text-sm text-black/50">No bookings yet.</div>
        )}
      </div>
    </div>
  );
}