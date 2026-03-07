const express = require("express");
const passport = require("passport");
const pool = require("../db");

const router = express.Router();
const auth = passport.authenticate("jwt", { session: false });

function escapeCsv(value) {
  const s = String(value ?? "");
  return `"${s.replace(/"/g, '""')}"`;
}

function normalizeMoney(value) {
  const n = Number(value || 0);
  return Number.isFinite(n) ? n : 0;
}

// =====================================
// GET /api/admin/dashboard
// =====================================
router.get("/dashboard", auth, async (req, res) => {
  try {
    const [[row]] = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM cars) AS totalCars,
        (SELECT COUNT(*) FROM bookings) AS totalBookings,
        (SELECT COUNT(*) FROM bookings WHERE DATE(created_at) = CURDATE()) AS bookingsToday,
        (SELECT COUNT(*) FROM bookings WHERE status = 'pending') AS pendingBookings,
        (SELECT COUNT(*) FROM bookings WHERE status = 'confirmed') AS confirmedBookings,
        (SELECT COUNT(*) FROM bookings WHERE status = 'cancelled') AS cancelledBookings,
        (SELECT COUNT(*) FROM bookings WHERE status = 'completed') AS completedBookings,

        (SELECT COUNT(*) FROM bookings WHERE payment_status = 'paid') AS paidBookings,
        (SELECT COUNT(*) FROM bookings WHERE payment_status = 'partial') AS partialBookings,
        (SELECT COUNT(*) FROM bookings WHERE payment_status = 'unpaid') AS unpaidBookings,
        (SELECT COUNT(*) FROM bookings WHERE payment_status = 'pay_on_pickup') AS payOnPickupBookings,

        (SELECT COALESCE(SUM(total_price), 0) FROM bookings WHERE status IN ('confirmed', 'completed')) AS revenueTotal,
        (SELECT COALESCE(SUM(total_price), 0) FROM bookings WHERE DATE(created_at) = CURDATE() AND status IN ('confirmed', 'completed')) AS revenueToday,

        (SELECT COALESCE(SUM(paid_amount), 0) FROM bookings) AS totalCollected,
        (SELECT COALESCE(SUM(GREATEST(total_price - paid_amount, 0)), 0) FROM bookings WHERE status IN ('pending', 'confirmed', 'completed')) AS outstandingBalance,
        (SELECT COALESCE(SUM(deposit_amount), 0) FROM bookings) AS totalDeposits
    `);

    res.json(row);
  } catch (err) {
    console.error("ADMIN DASHBOARD ERROR:", err);
    res.status(500).json({ error: "Failed to load dashboard" });
  }
});

// =====================================
// GET /api/admin/bookings
// =====================================
router.get("/bookings", auth, async (req, res) => {
  try {
    const { status, payment_status, q } = req.query;

    let where = `WHERE 1 = 1`;
    const params = [];

    if (status && ["pending", "confirmed", "cancelled", "completed"].includes(String(status))) {
      where += ` AND b.status = ?`;
      params.push(String(status));
    }

    if (
      payment_status &&
      ["unpaid", "partial", "paid", "pay_on_pickup"].includes(String(payment_status))
    ) {
      where += ` AND b.payment_status = ?`;
      params.push(String(payment_status));
    }

    if (q && String(q).trim()) {
      const like = `%${String(q).trim()}%`;
      where += `
        AND (
          au.email LIKE ?
          OR CONCAT(COALESCE(au.first_name, ''), ' ', COALESCE(au.last_name, '')) LIKE ?
          OR c.make LIKE ?
          OR c.model LIKE ?
          OR c.plate_number LIKE ?
          OR CAST(b.id AS CHAR) LIKE ?
        )
      `;
      params.push(like, like, like, like, like, like);
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
        b.updated_at,
        b.assigned_staff_id,
        b.internal_notes,

        c.make,
        c.model,
        c.plate_number,
        c.daily_price,

        CONCAT(COALESCE(au.first_name, ''), ' ', COALESCE(au.last_name, '')) AS customer_name,
        au.email AS customer_email,
        au.phone AS customer_phone,

        GREATEST(COALESCE(b.total_price, 0) - COALESCE(b.paid_amount, 0), 0) AS balance_amount
      FROM bookings b
      LEFT JOIN cars c ON c.id = b.car_id
      LEFT JOIN app_users au ON au.id = COALESCE(b.user_id, b.customer_id)
      ${where}
      ORDER BY b.created_at DESC
      LIMIT 500
      `,
      params
    );

    const normalized = rows.map((r) => ({
      ...r,
      customer_name: String(r.customer_name || "").trim() || "Guest",
      total_price: normalizeMoney(r.total_price),
      deposit_amount: normalizeMoney(r.deposit_amount),
      paid_amount: normalizeMoney(r.paid_amount),
      balance_amount: normalizeMoney(r.balance_amount),
    }));

    res.json(normalized);
  } catch (err) {
    console.error("ADMIN BOOKINGS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch admin bookings" });
  }
});

// =====================================
// PATCH /api/admin/bookings/:id
// Status + internal notes + assigned staff
// =====================================
router.patch("/bookings/:id", auth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid booking id" });

    const { status, internal_notes, assigned_staff_id } = req.body || {};

    const allowedStatus = ["pending", "confirmed", "cancelled", "completed"];
    if (status !== undefined && !allowedStatus.includes(String(status))) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const fields = [];
    const params = [];

    if (status !== undefined) {
      fields.push("status = ?");
      params.push(status);
    }

    if (internal_notes !== undefined) {
      fields.push("internal_notes = ?");
      params.push(internal_notes);
    }

    if (assigned_staff_id !== undefined) {
      fields.push("assigned_staff_id = ?");
      params.push(assigned_staff_id);
    }

    fields.push("updated_at = NOW()");

    params.push(id);

    await pool.query(
      `UPDATE bookings SET ${fields.join(", ")} WHERE id = ?`,
      params
    );

    const [[updated]] = await pool.query(
      `
      SELECT
        id,
        status,
        payment_status,
        deposit_amount,
        paid_amount,
        payment_method,
        internal_notes,
        assigned_staff_id,
        updated_at
      FROM bookings
      WHERE id = ?
      `,
      [id]
    );

    res.json(updated);
  } catch (err) {
    console.error("ADMIN UPDATE BOOKING ERROR:", err);
    res.status(500).json({ error: "Failed to update booking" });
  }
});

// =====================================
// PATCH /api/admin/bookings/:id/payment
// Update payment state + save history
// =====================================
router.patch("/bookings/:id/payment", auth, async (req, res) => {
  const conn = await pool.getConnection();

  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid booking id" });

    let {
      payment_status,
      deposit_amount,
      paid_amount,
      payment_method,
      note,
    } = req.body || {};

    const allowedPaymentStatus = ["unpaid", "partial", "paid", "pay_on_pickup"];
    if (!allowedPaymentStatus.includes(String(payment_status))) {
      return res.status(400).json({ error: "Invalid payment_status" });
    }

    const [[booking]] = await conn.query(
      `
      SELECT id, total_price, paid_amount, deposit_amount
      FROM bookings
      WHERE id = ?
      `,
      [id]
    );

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const total = normalizeMoney(booking.total_price);
    let deposit = normalizeMoney(deposit_amount);
    let paid = normalizeMoney(paid_amount);

    if (payment_status === "pay_on_pickup") {
      deposit = 0;
      paid = 0;
      payment_method = payment_method || "pay_on_pickup";
    }

    if (payment_status === "unpaid") {
      deposit = 0;
      paid = 0;
      payment_method = payment_method || null;
    }

    if (payment_status === "partial") {
      if (paid <= 0 || paid >= total) {
        return res.status(400).json({ error: "Partial payment must be greater than 0 and less than total price" });
      }
      if (deposit <= 0) {
        deposit = paid;
      }
    }

    if (payment_status === "paid") {
      paid = total;
      if (deposit <= 0) {
        deposit = total;
      }
      payment_method = payment_method || "bank_transfer";
    }

    await conn.beginTransaction();

    await conn.query(
      `
      UPDATE bookings
      SET
        payment_status = ?,
        deposit_amount = ?,
        paid_amount = ?,
        payment_method = ?,
        updated_at = NOW()
      WHERE id = ?
      `,
      [payment_status, deposit, paid, payment_method || null, id]
    );

    await conn.query(
      `
      INSERT INTO booking_payments (
        booking_id,
        admin_user_id,
        payment_status,
        payment_method,
        deposit_amount,
        paid_amount,
        note
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        id,
        req.user?.id || null,
        payment_status,
        payment_method || null,
        deposit,
        paid,
        note || null,
      ]
    );

    await conn.commit();

    const [[updated]] = await conn.query(
      `
      SELECT
        b.id,
        b.status,
        b.payment_status,
        b.deposit_amount,
        b.paid_amount,
        b.payment_method,
        b.total_price,
        GREATEST(COALESCE(b.total_price, 0) - COALESCE(b.paid_amount, 0), 0) AS balance_amount,
        b.updated_at
      FROM bookings b
      WHERE b.id = ?
      `,
      [id]
    );

    res.json(updated);
  } catch (err) {
    await conn.rollback();
    console.error("ADMIN UPDATE PAYMENT ERROR:", err);
    res.status(500).json({ error: "Failed to update payment" });
  } finally {
    conn.release();
  }
});

// =====================================
// GET /api/admin/bookings/:id/payments
// Payment history
// =====================================
router.get("/bookings/:id/payments", auth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid booking id" });

    const [rows] = await pool.query(
      `
      SELECT
        bp.id,
        bp.booking_id,
        bp.admin_user_id,
        bp.payment_status,
        bp.payment_method,
        bp.deposit_amount,
        bp.paid_amount,
        bp.note,
        bp.created_at
      FROM booking_payments bp
      WHERE bp.booking_id = ?
      ORDER BY bp.created_at DESC, bp.id DESC
      `,
      [id]
    );

    res.json(rows);
  } catch (err) {
    console.error("PAYMENT HISTORY ERROR:", err);
    res.status(500).json({ error: "Failed to fetch payment history" });
  }
});

// =====================================
// GET /api/admin/ticker
// =====================================
router.get("/ticker", auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT
        b.id,
        b.status,
        b.payment_status,
        b.created_at,
        c.make,
        c.model,
        c.plate_number,
        CONCAT(COALESCE(au.first_name, ''), ' ', COALESCE(au.last_name, '')) AS customer_name
      FROM bookings b
      LEFT JOIN cars c ON c.id = b.car_id
      LEFT JOIN app_users au ON au.id = COALESCE(b.user_id, b.customer_id)
      ORDER BY b.created_at DESC
      LIMIT 10
      `
    );

    const normalized = rows.map((r) => ({
      ...r,
      customer_name: String(r.customer_name || "").trim() || "Guest",
    }));

    res.json(normalized);
  } catch (err) {
    console.error("ADMIN TICKER ERROR:", err);
    res.status(500).json({ error: "Failed to load ticker" });
  }
});

// =====================================
// GET /api/admin/availability
// =====================================
router.get("/availability", auth, async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ error: "start and end required" });
    }

    const [rows] = await pool.query(
      `
      SELECT
        b.car_id,
        b.start_date,
        b.end_date,
        b.start_datetime,
        b.end_datetime,
        b.status,
        c.make,
        c.model,
        c.plate_number
      FROM bookings b
      LEFT JOIN cars c ON c.id = b.car_id
      WHERE b.status IN ('pending', 'confirmed')
        AND NOT (
          COALESCE(b.end_date, DATE(b.end_datetime)) <= ?
          OR COALESCE(b.start_date, DATE(b.start_datetime)) >= ?
        )
      `,
      [start, end]
    );

    res.json(rows);
  } catch (err) {
    console.error("ADMIN AVAILABILITY ERROR:", err);
    res.status(500).json({ error: "Failed to load availability" });
  }
});

// =====================================
// GET /api/admin/exports/bookings.csv
// Excel-friendly CSV export
// =====================================
router.get("/exports/bookings.csv", auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT
        b.id,
        b.status,
        b.payment_status,
        b.deposit_amount,
        b.paid_amount,
        b.payment_method,
        b.total_price,
        GREATEST(COALESCE(b.total_price, 0) - COALESCE(b.paid_amount, 0), 0) AS balance_amount,
        b.start_datetime,
        b.end_datetime,
        b.created_at,
        c.make,
        c.model,
        c.plate_number,
        CONCAT(COALESCE(au.first_name, ''), ' ', COALESCE(au.last_name, '')) AS customer_name,
        au.email AS customer_email,
        au.phone AS customer_phone
      FROM bookings b
      LEFT JOIN cars c ON c.id = b.car_id
      LEFT JOIN app_users au ON au.id = COALESCE(b.user_id, b.customer_id)
      ORDER BY b.created_at DESC
      `
    );

    const header = [
      "Booking ID",
      "Customer",
      "Email",
      "Phone",
      "Car",
      "Plate",
      "Booking Status",
      "Payment Status",
      "Deposit",
      "Paid",
      "Balance",
      "Payment Method",
      "Total Price",
      "Start",
      "End",
      "Created At",
    ];

    const lines = [header.map(escapeCsv).join(",")];

    for (const r of rows) {
      lines.push(
        [
          r.id,
          String(r.customer_name || "").trim() || "Guest",
          r.customer_email || "",
          r.customer_phone || "",
          `${r.make || ""} ${r.model || ""}`.trim(),
          r.plate_number || "",
          r.status || "",
          r.payment_status || "",
          normalizeMoney(r.deposit_amount).toFixed(2),
          normalizeMoney(r.paid_amount).toFixed(2),
          normalizeMoney(r.balance_amount).toFixed(2),
          r.payment_method || "",
          normalizeMoney(r.total_price).toFixed(2),
          r.start_datetime || "",
          r.end_datetime || "",
          r.created_at || "",
        ]
          .map(escapeCsv)
          .join(",")
      );
    }

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=am38_bookings_audit.csv");
    res.send(lines.join("\n"));
  } catch (err) {
    console.error("BOOKINGS EXPORT ERROR:", err);
    res.status(500).json({ error: "Failed to export bookings CSV" });
  }
});

// =====================================
// GET /api/admin/exports/payments.csv
// Excel-friendly finance export
// =====================================
router.get("/exports/payments.csv", auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT
        bp.id,
        bp.booking_id,
        bp.payment_status,
        bp.payment_method,
        bp.deposit_amount,
        bp.paid_amount,
        bp.note,
        bp.created_at,
        b.total_price,
        CONCAT(COALESCE(au.first_name, ''), ' ', COALESCE(au.last_name, '')) AS customer_name,
        au.email AS customer_email,
        c.make,
        c.model,
        c.plate_number
      FROM booking_payments bp
      LEFT JOIN bookings b ON b.id = bp.booking_id
      LEFT JOIN cars c ON c.id = b.car_id
      LEFT JOIN app_users au ON au.id = COALESCE(b.user_id, b.customer_id)
      ORDER BY bp.created_at DESC, bp.id DESC
      `
    );

    const header = [
      "History ID",
      "Booking ID",
      "Customer",
      "Email",
      "Car",
      "Plate",
      "Payment Status",
      "Payment Method",
      "Deposit",
      "Paid",
      "Booking Total",
      "Note",
      "Created At",
    ];

    const lines = [header.map(escapeCsv).join(",")];

    for (const r of rows) {
      lines.push(
        [
          r.id,
          r.booking_id,
          String(r.customer_name || "").trim() || "Guest",
          r.customer_email || "",
          `${r.make || ""} ${r.model || ""}`.trim(),
          r.plate_number || "",
          r.payment_status || "",
          r.payment_method || "",
          normalizeMoney(r.deposit_amount).toFixed(2),
          normalizeMoney(r.paid_amount).toFixed(2),
          normalizeMoney(r.total_price).toFixed(2),
          r.note || "",
          r.created_at || "",
        ]
          .map(escapeCsv)
          .join(",")
      );
    }

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=am38_payment_report.csv");
    res.send(lines.join("\n"));
  } catch (err) {
    console.error("PAYMENTS EXPORT ERROR:", err);
    res.status(500).json({ error: "Failed to export payments CSV" });
  }
});

module.exports = router;