import { getToken } from "./storage";

const API = "http://localhost:4000/api";

export async function createBooking(data: {
  car_id: number;
  start_datetime: string;
  end_datetime: string;
}) {
  const token = getToken();

  const res = await fetch(`${API}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Booking failed");
  }

  return res.json();
}

export async function getMyBookings() {
  const token = getToken();

  const res = await fetch(`${API}/bookings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch bookings");

  return res.json();
}