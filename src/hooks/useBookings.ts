import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking, getMyBookings } from "../lib/booking-api";

export function useMyBookings() {
  return useQuery({
    queryKey: ["my-bookings"],
    queryFn: getMyBookings,
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-bookings"] });
    },
  });
}