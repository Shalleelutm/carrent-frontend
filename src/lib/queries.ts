import { useQuery } from "@tanstack/react-query";
import { fetchCars } from "./api";

export function useCarsQuery() {
  return useQuery({
    queryKey: ["cars"],
    queryFn: fetchCars,
    staleTime: 60_000,
    retry: 1
  });
}