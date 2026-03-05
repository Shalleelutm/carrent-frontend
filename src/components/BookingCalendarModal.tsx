import * as React from "react";
import { addDays, format, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCarBookedRangesQuery } from "@/lib/queries";
import { createBooking } from "@/lib/api";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  car: any | null;
  onBooked?: () => void;
};

type Range = { from?: Date; to?: Date };

function toDate(d: any) {
  const x = new Date(d);
  return isNaN(x.getTime()) ? null : x;
}

export default function BookingCalendarModal({ open, onOpenChange, car, onBooked }: Props) {
  const carId = car?.id ? Number(car.id) : null;
  const { data: bookedRanges, isLoading } = useCarBookedRangesQuery(carId);

  const [range, setRange] = React.useState<Range>({});
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [suggestion, setSuggestion] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) {
      setRange({});
      setMessage(null);
      setSuggestion(null);
    }
  }, [open]);

  const intervals = React.useMemo(() => {
    const rows = Array.isArray(bookedRanges) ? bookedRanges : [];
    return rows
      .map((r: any) => {
        const s = toDate(r.start_datetime);
        const e = toDate(r.end_datetime);
        if (!s || !e) return null;
        return { start: startOfDay(s), end: endOfDay(e) };
      })
      .filter(Boolean) as { start: Date; end: Date }[];
  }, [bookedRanges]);

  const disabled = React.useMemo(() => {
    return (date: Date) => {
      const today = startOfDay(new Date());
      if (date < today) return true;
      return intervals.some((iv) => isWithinInterval(date, iv));
    };
  }, [intervals]);

  const pricePreview = React.useMemo(() => {
    if (!range.from || !range.to || !car) return null;
    const ms = range.to.getTime() - range.from.getTime();
    const days = Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
    const daily = Number(car.daily_price || 0);
    const total = (days * daily).toFixed(2);
    return { days, total };
  }, [range, car]);

  const computeSuggestion = React.useCallback(() => {
    // find first available 3-day window in next 60 days
    const today = startOfDay(new Date());
    for (let i = 1; i <= 60; i++) {
      const start = addDays(today, i);
      const end = addDays(start, 2);

      const hits = intervals.some((iv) => {
        // overlap if any day in [start,end] is within interval
        const s = startOfDay(start);
        const e = endOfDay(end);
        return !(e < iv.start || s > iv.end);
      });

      if (!hits) {
        return `Try ${format(start, "dd MMM")} → ${format(end, "dd MMM")}`;
      }
    }
    return null;
  }, [intervals]);

  const confirm = async () => {
    setMessage(null);
    setSuggestion(null);

    if (!carId || !range.from || !range.to) return;

    setBusy(true);
    try {
      await createBooking({
        car_id: carId,
        start_datetime: range.from.toISOString(),
        end_datetime: addDays(range.to, 1).toISOString(),
      });
      onOpenChange(false);
      onBooked?.();
    } catch (e: any) {
      const msg = e?.message || "Booking failed";

      if (msg === "PROFILE_REQUIRED") {
        setMessage("Please complete your profile before booking.");
      } else if (msg.toLowerCase().includes("already booked")) {
        setMessage("This car is not available for your selected dates.");
        const s = computeSuggestion();
        setSuggestion(s);
      } else {
        setMessage(msg);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[980px] bg-gradient-to-br from-white via-white to-blue-50">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Book your dates — {car?.make} {car?.model}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-[1fr_320px]">
          <div className="rounded-2xl border p-4 bg-white shadow-sm">
            <div className="text-xs font-semibold text-black/60 mb-2">
              Pick your rental period (unavailable days are disabled)
            </div>
            <Calendar
              mode="range"
              selected={range as any}
              onSelect={(v: any) => setRange(v || {})}
              numberOfMonths={2}
              disabled={disabled as any}
            />
            {isLoading && (
              <div className="mt-3 text-sm text-black/60">Loading availability...</div>
            )}
          </div>

          <div className="rounded-2xl border p-4 bg-white shadow-sm space-y-4">
            <div className="text-sm font-semibold">Summary</div>

            <div className="rounded-xl border p-3 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="text-xs text-black/60">Selected</div>
              <div className="font-semibold">
                {range.from ? format(range.from, "EEE, dd MMM yyyy") : "Start"}{" "}
                →{" "}
                {range.to ? format(range.to, "EEE, dd MMM yyyy") : "End"}
              </div>
            </div>

            <div className="text-sm text-black/60">
              Daily price:{" "}
              <span className="font-semibold text-black">
                Rs {Number(car?.daily_price || 0).toLocaleString()}
              </span>
            </div>

            {pricePreview ? (
              <div className="rounded-xl border p-3 bg-gradient-to-r from-emerald-50 to-lime-50">
                <div className="text-xs text-black/60">Estimated total</div>
                <div className="text-2xl font-bold">
                  Rs {Number(pricePreview.total).toLocaleString()}
                </div>
                <div className="text-sm text-black/60">{pricePreview.days} day(s)</div>
              </div>
            ) : (
              <div className="text-sm text-black/60">Select a range to see total.</div>
            )}

            {message && (
              <div className="rounded-xl border p-3 bg-red-50 text-red-700 text-sm">
                {message}
                {suggestion ? (
                  <div className="mt-1 font-semibold text-red-800">{suggestion}</div>
                ) : null}
              </div>
            )}

            <Button
              className="w-full"
              disabled={!range.from || !range.to || busy}
              onClick={confirm}
            >
              {busy ? "Confirming..." : "Confirm Booking"}
            </Button>

            <Button className="w-full" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}