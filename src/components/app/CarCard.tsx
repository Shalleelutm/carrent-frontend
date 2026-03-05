import { motion } from "framer-motion";
import { CalendarDays, Car as CarIcon } from "lucide-react";

export type CarCardData = {
  id: number;
  make: string;
  model: string;
  year: number;
  transmission: string;
  seats: number;
  daily_price: number;
  category?: string;
};

export function CarCard({
  car,
  highlight,
  startDate,
  endDate,
  busy,
  onChangeStart,
  onChangeEnd,
  onBook,
}: {
  car: CarCardData;
  highlight?: boolean;
  startDate: string;
  endDate: string;
  busy?: boolean;
  onChangeStart: (v: string) => void;
  onChangeEnd: (v: string) => void;
  onBook: () => void;
}) {
  const days = (() => {
    const s = new Date(startDate + "T00:00:00").getTime();
    const e = new Date(endDate + "T00:00:00").getTime();
    if (Number.isNaN(s) || Number.isNaN(e)) return 1;
    return Math.max(1, Math.ceil((e - s) / 86400000));
  })();

  const estTotal = Math.round(Number(car.daily_price || 0) * days);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.22 }}
      className={`rounded-3xl border bg-white shadow-sm overflow-hidden ${
        highlight ? "border-blue-400 ring-2 ring-blue-500/30" : "border-black/10"
      }`}
    >
      <div className="h-2 bg-gradient-to-r from-brand.blue via-white to-brand.red" />

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xl font-black">
              {car.make} {car.model}
            </div>
            <div className="text-xs text-black/55 mt-1">
              Car ID: <span className="font-semibold">{car.id}</span>
              {car.category ? <span className="ml-2">• {car.category}</span> : null}
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-black/55">Price/day</div>
            <div className="text-lg font-black">Rs {Number(car.daily_price).toLocaleString()}</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-black/70">
          <div>Year: <span className="font-semibold text-black">{car.year}</span></div>
          <div>Seats: <span className="font-semibold text-black">{car.seats}</span></div>
          <div>Transmission: <span className="font-semibold text-black">{car.transmission}</span></div>
          <div>Est total: <span className="font-black text-black">Rs {estTotal.toLocaleString()}</span></div>
        </div>

        <div className="mt-5 rounded-3xl border border-black/10 bg-black/[0.02] p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-black text-black/75">
            <CalendarDays className="h-4 w-4" /> Select dates
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1 text-[11px] text-black/55 font-semibold">
              Start
              <input
                type="date"
                value={startDate}
                onChange={(e) => onChangeStart(e.target.value)}
                className="rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm"
              />
            </label>

            <label className="grid gap-1 text-[11px] text-black/55 font-semibold">
              End
              <input
                type="date"
                value={endDate}
                onChange={(e) => onChangeEnd(e.target.value)}
                className="rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm"
              />
            </label>
          </div>

          <div className="flex items-center justify-between text-xs text-black/55">
            <span>{days} day(s)</span>
            <span className="font-black text-black">Est: Rs {estTotal.toLocaleString()}</span>
          </div>
        </div>

        <button
          disabled={!!busy}
          onClick={onBook}
          className="mt-5 w-full rounded-2xl px-4 py-3 font-black text-white bg-black hover:opacity-90 transition disabled:opacity-60 inline-flex items-center justify-center gap-2"
        >
          <CarIcon className="h-4 w-4" />
          {busy ? "Booking..." : "Book"}
        </button>
      </div>
    </motion.div>
  );
}