import { motion } from "framer-motion";
import { BadgeCheck, Clock, Copy, ExternalLink, CalendarDays, Car } from "lucide-react";

export type BookingCardData = {
  id: number;
  car_id: number;
  make?: string;
  model?: string;
  daily_price?: number;
  start_datetime: string;
  end_datetime: string;
  total_price: number;
  status: string;
};

function formatDate(d: string) {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function daysBetween(a: string, b: string) {
  const A = new Date(a).getTime();
  const B = new Date(b).getTime();
  if (Number.isNaN(A) || Number.isNaN(B)) return 0;
  const ms = Math.max(0, B - A);
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

function StatusPill({ status }: { status: string }) {
  const s = (status || "").toLowerCase();
  const cls =
    s === "confirmed"
      ? "bg-green-100 text-green-800 border-green-200"
      : s === "pending"
      ? "bg-yellow-100 text-yellow-800 border-yellow-200"
      : "bg-gray-100 text-gray-700 border-gray-200";

  const Icon = s === "confirmed" ? BadgeCheck : Clock;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${cls}`}>
      <Icon className="h-4 w-4" />
      {s ? s.toUpperCase() : "UNKNOWN"}
    </span>
  );
}

export function BookingCard({
  booking,
  onViewCar,
}: {
  booking: BookingCardData;
  onViewCar?: (carId: number) => void;
}) {
  // ✅ Hard safety: booking might be undefined in a bad render - protect UI
  if (!booking) return null;

  const days = daysBetween(booking.start_datetime, booking.end_datetime);

  const carLabel =
    booking.make && booking.model
      ? `${booking.make} ${booking.model}`
      : `Car #${booking.car_id}`;

  const dailyLabel =
    typeof booking.daily_price === "number"
      ? `Rs ${Number(booking.daily_price).toLocaleString()}/day`
      : null;

  const copy = async (txt: string) => {
    try {
      await navigator.clipboard.writeText(txt);
    } catch {
      // ignore
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-lg font-black">{carLabel}</div>

          <div className="text-sm text-black/60 mt-1 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <Car className="h-4 w-4" />
              Car ID: <span className="font-semibold">{booking.car_id}</span>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              {days} day(s)
            </span>
            {dailyLabel ? (
              <>
                <span>•</span>
                <span>{dailyLabel}</span>
              </>
            ) : null}
          </div>
        </div>

        <StatusPill status={booking.status} />
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-black/10 bg-black/[0.02] p-4">
          <div className="text-xs text-black/50">Start</div>
          <div className="font-semibold">{formatDate(booking.start_datetime)}</div>
        </div>

        <div className="rounded-xl border border-black/10 bg-black/[0.02] p-4">
          <div className="text-xs text-black/50">End</div>
          <div className="font-semibold">{formatDate(booking.end_datetime)}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="text-sm text-black/60">Total price</div>
        <div className="text-xl font-black">
          Rs {Number(booking.total_price || 0).toLocaleString()}
        </div>
      </div>

      <div className="mt-4 flex gap-3 flex-wrap">
        <button
          className="inline-flex items-center gap-2 rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold hover:bg-black/5 transition"
          onClick={() => copy(String(booking.id))}
        >
          <Copy className="h-4 w-4" />
          Copy Booking ID
        </button>

        <button
          className="inline-flex items-center gap-2 rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold hover:bg-black/5 transition"
          onClick={() => copy(String(booking.car_id))}
        >
          <Copy className="h-4 w-4" />
          Copy Car ID
        </button>

        <button
          className="inline-flex items-center gap-2 rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold hover:bg-black/5 transition"
          onClick={() => onViewCar?.(booking.car_id)}
        >
          <ExternalLink className="h-4 w-4" />
          View Car
        </button>
      </div>
    </motion.div>
  );
}