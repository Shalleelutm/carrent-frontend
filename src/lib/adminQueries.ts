import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdminBookings,
  updateAdminBooking,
  fetchAdminDashboard,
  fetchAdminTicker,
  fetchAdminAvailability,
} from "@/lib/api";

/* ======================================================
ADMIN DASHBOARD
====================================================== */

export function useAdminDashboardQuery() {
  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      return await fetchAdminDashboard();
    },
    refetchInterval: 10000,
  });
}

/* ======================================================
ADMIN BOOKINGS
====================================================== */

export function useAdminBookingsQuery(params?: { status?: string; q?: string }) {
  return useQuery({
    queryKey: ["admin-bookings", params?.status || "", params?.q || ""],
    queryFn: async () => {
      return await fetchAdminBookings();
    },
    refetchInterval: 8000,
  });
}

/* ======================================================
ADMIN TICKER
====================================================== */

export function useAdminTickerQuery() {
  return useQuery({
    queryKey: ["admin-ticker"],
    queryFn: async () => {
      return await fetchAdminTicker();
    },
    refetchInterval: 5000,
  });
}

/* ======================================================
ADMIN AVAILABILITY
====================================================== */

export function useAdminAvailabilityQuery(start: string, end: string) {
  return useQuery({
    queryKey: ["admin-availability", start, end],
    queryFn: async () => {
      return await fetchAdminAvailability(start, end);
    },
  });
}

/* ======================================================
UPDATE BOOKING STATUS
====================================================== */

export function useAdminUpdateBookingMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      id: number;
      status?: "pending" | "confirmed" | "cancelled";
      assigned_staff_id?: number | null;
      internal_notes?: string | null;
    }) => {
      const { id, ...body } = payload;
      return await updateAdminBooking(id, body);
    },

    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["admin-bookings"] }),
        qc.invalidateQueries({ queryKey: ["admin-dashboard"] }),
        qc.invalidateQueries({ queryKey: ["admin-ticker"] }),
      ]);
    },
  });
}