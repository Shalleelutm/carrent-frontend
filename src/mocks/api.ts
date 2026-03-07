import { mockCars } from "./data";

export async function mockApi<T>(path: string): Promise<T> {
  await new Promise((r) => setTimeout(r, 250));

  if (path === "/cars") return mockCars as unknown as T;

  throw new Error(`Mock endpoint not found: ${path}`);
}