import { useState } from "react";
import { createBooking } from "../lib/api";
import { AlertTriangle, Loader2 } from "lucide-react";

export default function BookingModal({
  car,
  onClose,
}: {
  car: any;
  onClose: () => void;
}) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    if (!startDate || !endDate) {
      setError("Please select both dates.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createBooking({
        car_id: car.id,
        start_datetime: new Date(startDate).toISOString(),
        end_datetime: new Date(endDate).toISOString(),
      });

      alert("Booking created successfully!");
      onClose();
    } catch (err: any) {
      if (err.message.includes("already booked")) {
        setError("This car is unavailable for the selected dates.");
      } else {
        setError(err.message || "Booking failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-[420px] shadow-xl">

        <h2 className="text-xl font-bold mb-4">
          Book {car.name}
        </h2>

        <div className="space-y-3">
          <input
            type="date"
            className="w-full border p-2 rounded-xl"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <input
            type="date"
            className="w-full border p-2 rounded-xl"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          )}

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-xl flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Booking"
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full border py-2 rounded-xl"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}