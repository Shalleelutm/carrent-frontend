import { useEffect, useState } from "react";
import { getBookings, Booking } from "../lib/storage";
import { convertFromMUR, formatMoney, Currency } from "../lib/currency";

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currency, setCurrency] = useState<Currency>("MUR");

  useEffect(() => {
    setBookings(getBookings());
  }, []);

  function badge(status: string): string {
    switch (status) {
      case "Confirmed":
        return "bg-green-500/20 text-green-400";
      case "Cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-yellow-500/20 text-yellow-400";
    }
  }

  function money(amount: number): string {
    const converted = convertFromMUR(amount, currency);
    return formatMoney(converted, currency);
  }

  const sorted = [...bookings].sort((a, b) => {
    const ta = new Date(a.createdAt || 0).getTime();
    const tb = new Date(b.createdAt || 0).getTime();
    return tb - ta;
  });

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black mb-8">My Bookings</h1>

        <div className="mb-6">
          <label className="mr-3">Currency:</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="bg-black border border-white/20 px-3 py-2 rounded"
          >
            <option value="MUR">MUR</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
            <option value="ZAR">ZAR</option>
          </select>
        </div>

        {sorted.length === 0 && (
          <div className="text-white/50">No bookings yet.</div>
        )}

        <div className="grid gap-6">
          {sorted.map((b) => (
            <div
              key={b.id}
              className="border border-white/10 rounded-2xl p-6 bg-white/5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-semibold">{b.carName}</div>
                  <div className="text-sm text-white/60">
                    {b.startDate} → {b.endDate} • {b.pickup}
                  </div>
                  {b.pickupNote && (
                    <div className="text-xs text-white/50 mt-1">
                      Note: {b.pickupNote}
                    </div>
                  )}
                  <div className="text-xs text-white/40 mt-1">
                    Booking ID: {b.id}
                  </div>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-xs ${badge(
                    b.status
                  )}`}
                >
                  {b.status}
                </div>
              </div>

              {b.quote && (
                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                  <Info label="Days" value={String(b.quote.days)} />
                  <Info
                    label="Pay now"
                    value={money(b.quote.payNow)}
                  />
                  <Info
                    label="Pay at pickup"
                    value={money(b.quote.payAtPickup)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="text-white/50 text-xs">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}