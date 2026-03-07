import { useQuery } from "@tanstack/react-query";
import { fetchCars, fetchCarBookedRanges, fetchMe } from "./api";

export function useCarsQuery() {
  return useQuery({
    queryKey: ["cars"],
    queryFn: fetchCars,
  });
}

export function useCarBookedRangesQuery(carId: number | null) {
  return useQuery({
    queryKey: ["car-booked-ranges", carId],
    queryFn: () => fetchCarBookedRanges(Number(carId)),
    enabled: !!carId,
  });
}

export function useMeQuery(enabled: boolean) {
  return useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    enabled,
  });
}