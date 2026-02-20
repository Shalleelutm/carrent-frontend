export interface Booking {
  id: string;
  carName: string;
  startDate: string;
  endDate: string;
  pickup: string;
  pickupNote?: string;
  status: string;
  createdAt: string;
  quote?: {
    subtotal: number;
    days: number;
    payNow: number;
    payAtPickup: number;
  };
}

export interface TicketMessage {
  sender: string;
  text: string;
  date: string;
}

export interface Ticket {
  ticketNumber: string;
  userEmail: string;
  subject: string;
  status: string;
  messages: TicketMessage[];
}

function safeParse<T>(json: string | null, fallback: T): T {
  try {
    return json ? JSON.parse(json) : fallback;
  } catch {
    return fallback;
  }
}

export function getBookings(): Booking[] {
  return safeParse(localStorage.getItem("bookings"), []);
}

export function saveBookings(bookings: Booking[]): void {
  localStorage.setItem("bookings", JSON.stringify(bookings));
}

export function addBooking(booking: Booking): void {
  const all = getBookings();
  saveBookings([...all, booking]);
}

export function updateBooking(
  id: string,
  patch: Partial<Booking>
): Booking | undefined {
  const all = getBookings().map((b) =>
    b.id === id ? { ...b, ...patch } : b
  );
  saveBookings(all);
  return all.find((b) => b.id === id);
}

export function getTickets(): Ticket[] {
  return safeParse(localStorage.getItem("tickets"), []);
}

export function saveTickets(tickets: Ticket[]): void {
  localStorage.setItem("tickets", JSON.stringify(tickets));
}

export function addTicket(ticket: Ticket): void {
  const all = getTickets();
  saveTickets([...all, ticket]);
}

export function updateTicket(
  ticketNumber: string,
  patch: Partial<Ticket>
): Ticket | undefined {
  const tickets = getTickets().map((t) =>
    t.ticketNumber === ticketNumber ? { ...t, ...patch } : t
  );
  saveTickets(tickets);
  return tickets.find((t) => t.ticketNumber === ticketNumber);
}