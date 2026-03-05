import { getToken } from "./storage";

export const API_URL = "http://localhost:4000/api";

/* =====================================================
   CORE FETCH WRAPPER
===================================================== */

export async function api(
  path: string,
  options: RequestInit = {},
  authRequired = false
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as any),
  };

  if (authRequired) {
    const token = getToken();

    if (!token) {
      throw new Error("Not authenticated");
    }

    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  let data: any = null;

  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const msg =
      data?.error ||
      `API error (${res.status}) — please try again later`;

    throw new Error(msg);
  }

  return data;
}

/* =====================================================
   AUTH
===================================================== */

export function loginUser(email: string, password: string) {
  return api("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function registerUser(email: string, password: string) {
  return api("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/* =====================================================
   PROFILE
===================================================== */

export function fetchMe() {
  return api("/me", {}, true);
}

export function updateMe(payload: {
  first_name: string;
  last_name: string;
  phone: string;
  dob: string;
  passport_no: string;
  license_no: string;
  country: string;
  address_line1: string;
  city: string;
}) {
  return api(
    "/me",
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
    true
  );
}

/* =====================================================
   CARS
===================================================== */

export function fetchCars() {
  return api("/cars");
}

/* =====================================================
   BOOKINGS
===================================================== */

export function createBooking(payload: {
  car_id: number;
  start_datetime: string;
  end_datetime: string;
}) {
  return api(
    "/bookings",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    true
  );
}

export function fetchMyBookings() {
  return api("/bookings", {}, true);
}

export function fetchCarBookedRanges(carId: number) {
  return api(`/bookings/car/${carId}`);
}

/* =====================================================
   ADMIN BOOKINGS
===================================================== */

export function fetchAdminBookings() {
  return api("/admin/bookings", {}, true);
}

export function updateAdminBooking(
  id: number,
  payload: {
    status?: "pending" | "confirmed" | "cancelled" | "completed";
    internal_notes?: string;
    assigned_staff_id?: number | null;
  }
) {
  return api(
    `/admin/bookings/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
    true
  );
}

/* =====================================================
   ADMIN DASHBOARD
===================================================== */

export function fetchAdminDashboard() {
  return api("/admin/dashboard", {}, true);
}

/* =====================================================
   ADMIN TICKER
===================================================== */

export function fetchAdminTicker() {
  return api("/admin/ticker", {}, true);
}

/* =====================================================
   ADMIN AVAILABILITY
===================================================== */

export function fetchAdminAvailability(start: string, end: string) {
  return api(`/admin/availability?start=${start}&end=${end}`, {}, true);
}

/* =====================================================
   SUPPORT TICKETS
===================================================== */

export function fetchSupportTickets() {
  return api("/support/tickets", {}, true);
}

export function createSupportTicket(payload: {
  subject: string;
  message: string;
  priority?: "low" | "normal" | "high" | "urgent";
}) {
  return api(
    "/support/tickets",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    true
  );
}

export function fetchSupportTicket(id: number) {
  return api(`/support/tickets/${id}`, {}, true);
}

export function sendSupportMessage(id: number, message: string) {
  return api(
    `/support/tickets/${id}/messages`,
    {
      method: "POST",
      body: JSON.stringify({ message }),
    },
    true
  );
}