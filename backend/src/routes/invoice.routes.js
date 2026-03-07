const express = require("express");
const passport = require("passport");
const PDFDocument = require("pdfkit");
const pool = require("../db");

const router = express.Router();
const auth = passport.authenticate("jwt", { session: false });

function money(value) {
  return `Rs ${Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

router.get("/:bookingId", auth, async (req, res) => {
  try {
    const bookingId = Number(req.params.bookingId);
    if (!bookingId) {
      return res.status(400).json({ error: "Invalid booking id" });
    }

    const [rows] = await pool.query(
      `
      SELECT
        b.id,
        b.user_id,
        b.customer_id,
        b.car_id,
        b.start_date,
        b.end_date,
        b.start_datetime,
        b.end_datetime,
        b.status,
        b.payment_status,
        b.deposit_amount,
        b.paid_amount,
        b.payment_method,
        b.total_price,
        b.created_at,

        c.make,
        c.model,
        c.plate_number,
        c.daily_price,

        au.email,
        au.phone,
        au.first_name,
        au.last_name,
        au.address_line1,
        au.city,
        au.country,
        au.passport_no,
        au.license_no

      FROM bookings b
      LEFT JOIN cars c ON c.id = b.car_id
      LEFT JOIN app_users au ON au.id = COALESCE(b.user_id, b.customer_id)
      WHERE b.id = ?
      LIMIT 1
      `,
      [bookingId]
    );

    const booking = rows[0];

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const isAdmin = req.user?.role === "admin";
    const ownsBooking =
      Number(req.user?.id) === Number(booking.user_id) ||
      Number(req.user?.id) === Number(booking.customer_id);

    if (!isAdmin && !ownsBooking) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const deposit = Number(booking.deposit_amount || 0);
    const paid = Number(booking.paid_amount || 0);
    const total = Number(booking.total_price || 0);
    const remaining = Math.max(total - paid, 0);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=invoice-booking-${booking.id}.pdf`
    );

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    doc.pipe(res);

    // Header
    doc
      .fontSize(26)
      .fillColor("#111827")
      .text("AM38", 50, 45, { continued: true })
      .fillColor("#2563eb")
      .text(" Rentals");

    doc
      .fontSize(10)
      .fillColor("#6b7280")
      .text("Premium Car Booking Invoice", 50, 78);

    doc
      .fillColor("#111827")
      .fontSize(10)
      .text("AM38 Car Rental Services", 360, 45, { align: "right" })
      .fillColor("#6b7280")
      .text("Mauritius", 360, 60, { align: "right" })
      .text("Phone: +230 000 0000", 360, 75, { align: "right" })
      .text("Email: bookings@am38.local", 360, 90, { align: "right" });

    doc
      .moveTo(50, 115)
      .lineTo(545, 115)
      .strokeColor("#e5e7eb")
      .stroke();

    // Invoice meta
    doc
      .fontSize(11)
      .fillColor("#111827")
      .text(`Invoice #: INV-${booking.id}`, 50, 130)
      .text(`Booking ID: #${booking.id}`, 50, 147)
      .text(`Created: ${new Date(booking.created_at).toLocaleString()}`, 50, 164);

    doc
      .text(`Booking Status: ${String(booking.status || "").toUpperCase()}`, 330, 130)
      .text(`Payment Status: ${String(booking.payment_status || "").toUpperCase()}`, 330, 147)
      .text(`Payment Method: ${booking.payment_method || "Not set"}`, 330, 164);

    // Customer box
    doc
      .roundedRect(50, 200, 235, 110, 10)
      .fillAndStroke("#f8fafc", "#e5e7eb");

    doc
      .fillColor("#111827")
      .fontSize(12)
      .text("Customer Details", 65, 215)
      .fontSize(10)
      .fillColor("#374151")
      .text(`${booking.first_name || ""} ${booking.last_name || ""}`.trim() || "Guest", 65, 238)
      .text(booking.email || "-", 65, 254)
      .text(booking.phone || "-", 65, 270)
      .text(
        `${booking.address_line1 || ""}${booking.city ? `, ${booking.city}` : ""}${booking.country ? `, ${booking.country}` : ""}` || "-",
        65,
        286,
        { width: 205 }
      );

    // Booking box
    doc
      .roundedRect(310, 200, 235, 110, 10)
      .fillAndStroke("#f8fafc", "#e5e7eb");

    doc
      .fillColor("#111827")
      .fontSize(12)
      .text("Booking Details", 325, 215)
      .fontSize(10)
      .fillColor("#374151")
      .text(`${booking.make || ""} ${booking.model || ""}`.trim(), 325, 238)
      .text(`Plate: ${booking.plate_number || "-"}`, 325, 254)
      .text(`Start: ${booking.start_datetime ? new Date(booking.start_datetime).toLocaleString() : "-"}`, 325, 270, { width: 205 })
      .text(`End: ${booking.end_datetime ? new Date(booking.end_datetime).toLocaleString() : "-"}`, 325, 286, { width: 205 });

    // Pricing table
    doc
      .fillColor("#111827")
      .fontSize(12)
      .text("Charges & Payment Summary", 50, 340);

    const top = 365;
    const left = 50;
    const col1 = 340;
    const col2 = 155;

    doc
      .roundedRect(left, top, 495, 30, 8)
      .fillAndStroke("#111827", "#111827");

    doc
      .fillColor("#ffffff")
      .fontSize(10)
      .text("Description", left + 15, top + 10)
      .text("Amount", left + col1 + 15, top + 10);

    const rowsToPrint = [
      ["Rental Total", money(total)],
      ["Deposit Paid", money(deposit)],
      ["Amount Collected", money(paid)],
      ["Remaining Balance", money(remaining)],
      ["Payment Status", String(booking.payment_status || "").toUpperCase()],
      ["Payment Method", booking.payment_method || "Not set"],
      ["Add-ons", "None"],
    ];

    let y = top + 38;
    rowsToPrint.forEach((row, i) => {
      doc
        .roundedRect(left, y - 4, 495, 28, 6)
        .fillAndStroke(i % 2 === 0 ? "#f8fafc" : "#ffffff", "#e5e7eb");

      doc
        .fillColor("#111827")
        .fontSize(10)
        .text(row[0], left + 15, y + 5)
        .text(String(row[1]), left + col1 + 15, y + 5);

      y += 32;
    });

    // Footer
    doc
      .fontSize(10)
      .fillColor("#6b7280")
      .text(
        "Thank you for choosing AM38. Please keep this invoice for your records.",
        50,
        640,
        { width: 495, align: "center" }
      );

    doc.end();
  } catch (err) {
    console.error("INVOICE PDF ERROR:", err);
    res.status(500).json({ error: "Failed to generate invoice" });
  }
});

module.exports = router;