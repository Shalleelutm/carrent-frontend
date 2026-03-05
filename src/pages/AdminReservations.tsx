import React, { useMemo, useState } from "react";
import { Search, CheckCircle2, XCircle, Clock3, RotateCcw, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/admin/StatusBadge";
import { useAdminBookingsQuery, useAdminUpdateBookingMutation } from "@/lib/adminQueries";

type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

function statusLabel(s: string): BookingStatus {
  const v = String(s || "").toLowerCase();
  if (v === "confirmed") return "confirmed";
  if (v === "cancelled") return "cancelled";
  if (v === "completed") return "completed";
  return "pending";
}

function StatusPill({ status }: { status: BookingStatus }) {
  const s = statusLabel(status);

  const base =
    "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold border";
  if (s === "pending")
    return (
      <span className={`${base} bg-amber-50 text-amber-800 border-amber-200`}>
        <Clock3 className="h-4 w-4" />
        Pending
      </span>
    );

  if (s === "confirmed")
    return (
      <span className={`${base} bg-emerald-50 text-emerald-800 border-emerald-200`}>
        <CheckCircle2 className="h-4 w-4" />
        Confirmed
      </span>
    );

  if (s === "cancelled")
    return (
      <span className={`${base} bg-rose-50 text-rose-800 border-rose-200`}>
        <XCircle className="h-4 w-4" />
        Cancelled
      </span>
    );

  return (
    <span className={`${base} bg-sky-50 text-sky-800 border-sky-200`}>
      <Check className="h-4 w-4" />
      Completed
    </span>
  );
}

export default function AdminReservations() {
  const [status, setStatus] = useState<string>("all");
  const [q, setQ] = useState<string>("");

  const { data, isLoading } = useAdminBookingsQuery({
    status: status === "all" ? undefined : status,
    q: q.trim() ? q.trim() : undefined,
  });

  const updateMut = useAdminUpdateBookingMutation();

  const rows = data || [];

  const sorted = useMemo(() => {
    return [...rows].sort((a: any, b: any) => {
      const at = new Date(a.created_at || 0).getTime();
      const bt = new Date(b.created_at || 0).getTime();
      return bt - at;
    });
  }, [rows]);

  const setBookingStatus = async (
    id: number,
    newStatus: BookingStatus
  ) => {
    await updateMut.mutateAsync({ id, status: newStatus });
  };

  if (isLoading) return <div className="p-10">Loading reservations...</div>;

  return (
    <div className="p-6 md:p-10 space-y-6">
      {/* HEADER */}
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <div className="text-2xl font-black">Reservations Board</div>
          <div className="text-sm text-black/50">Search, filter, confirm, cancel</div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name / email / model / plate..."
              className="pl-9 pr-3 py-2 border rounded-xl w-[320px] max-w-[85vw]"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded-xl px-3 py-2"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-5 py-3 border-b text-xs font-semibold text-black/60">
          <div className="col-span-1">ID</div>
          <div className="col-span-3">Customer</div>
          <div className="col-span-3">Car</div>
          <div className="col-span-2">Dates</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {sorted.length ? (
          sorted.map((b: any) => {
            const st = statusLabel(b.status);

            const start = String(b.start_date || b.start_datetime || "").slice(0, 10);
            const end = String(b.end_date || b.end_datetime || "").slice(0, 10);

            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-12 gap-2 px-5 py-4 border-b items-center"
              >
                <div className="col-span-1 text-sm font-bold">#{b.id}</div>

                <div className="col-span-3 min-w-0">
                  <div className="text-sm font-semibold truncate">
                    {b.customer_name || "Guest"}
                  </div>
                  <div className="text-xs text-black/50 truncate">
                    {b.customer_email || "-"}
                  </div>
                </div>

                <div className="col-span-3 min-w-0">
                  <div className="text-sm font-semibold truncate">
                    {b.make} {b.model}
                  </div>
                  <div className="text-xs text-black/50 truncate">
                    {b.plate_number || "AM38"}
                  </div>
                </div>

                <div className="col-span-2 text-xs text-black/70">
                  <div>{start || "-"}</div>
                  <div>{end || "-"}</div>
                </div>

                {/* STATUS */}
                <div className="col-span-1 space-y-1">
                  <StatusPill status={st} />
                  {/* keep your existing badge if you want subtle info */}
                  <div className="hidden md:block">
                    <StatusBadge status={st} />
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="col-span-2 flex justify-end gap-2 flex-wrap">
                  {/* Pending -> Confirm / Cancel */}
                  {st === "pending" && (
                    <>
                      <Button
                        onClick={() => setBookingStatus(b.id, "confirmed")}
                        disabled={updateMut.isPending}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Confirm
                      </Button>

                      <Button
                        onClick={() => setBookingStatus(b.id, "cancelled")}
                        disabled={updateMut.isPending}
                        className="bg-rose-600 hover:bg-rose-700 text-white"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  )}

                  {/* Confirmed -> Complete / Cancel */}
                  {st === "confirmed" && (
                    <>
                      <Button
                        onClick={() => setBookingStatus(b.id, "completed")}
                        disabled={updateMut.isPending}
                        className="bg-sky-600 hover:bg-sky-700 text-white"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Complete
                      </Button>

                      <Button
                        onClick={() => setBookingStatus(b.id, "cancelled")}
                        disabled={updateMut.isPending}
                        className="bg-rose-600 hover:bg-rose-700 text-white"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  )}

                  {/* Cancelled -> Reopen */}
                  {st === "cancelled" && (
                    <Button
                      onClick={() => setBookingStatus(b.id, "pending")}
                      disabled={updateMut.isPending}
                      className="bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reopen
                    </Button>
                  )}

                  {/* Completed -> no actions */}
                  {st === "completed" && (
                    <Button
                      variant="outline"
                      disabled
                      className="opacity-70 cursor-not-allowed"
                    >
                      Completed
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="p-6 text-sm text-black/50">No bookings found.</div>
        )}
      </div>
    </div>
  );
}