export type CarDto = {
  id: string;
  name: string;
  category: "Economy" | "SUV" | "Sedan" | "Van" | string;
  transmission: "Auto" | "Manual" | string;
  seats: number;
  pricePerDayMUR: number;
  image?: string;
};

const API_URL = import.meta.env.VITE_API_URL as string | undefined;
const USE_MOCKS = String(import.meta.env.VITE_USE_MOCKS).toLowerCase() === "true";

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} — ${text}`);
  }
  return (await res.json()) as T;
}

export async function fetchCars(): Promise<CarDto[]> {
  // ✅ MOCK MODE: real network request to /mock/cars.json (shows in DevTools Network)
  if (USE_MOCKS) {
    return fetchJson<CarDto[]>("/mock/cars.json");
  }

  // ✅ REAL MODE: backend
  if (!API_URL) throw new Error("VITE_API_URL is missing");
  return fetchJson<CarDto[]>(`${API_URL.replace(/\/$/, "")}/cars`);
}