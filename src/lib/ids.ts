export function makeTicketNumber() {
  // Example: AM38-TK-20260215-4F8K2
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `AM38-TK-${y}${m}${day}-${rand}`;
}

export function makeBookingId() {
  const rand = Math.random().toString(36).slice(2, 9).toUpperCase();
  return `AM38-BK-${rand}`;
}