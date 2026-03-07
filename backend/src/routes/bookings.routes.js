const express = require("express");
const passport = require("passport");
const pool = require("../db");

const router = express.Router();
const auth = passport.authenticate("jwt", { session: false });

function toMysqlDateTime(value) {
const d = new Date(value);
if (Number.isNaN(d.getTime())) return null;
return d.toISOString().slice(0, 19).replace("T", " ");
}

function diffDaysInclusiveCeil(start, end) {
const ms = end.getTime() - start.getTime();
const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
return Math.max(days, 1);
}

router.post("/", auth, async (req, res) => {
const conn = await pool.getConnection();

try {
const userId = req.user.id;

const {
  car_id,
  start_datetime,
  end_datetime,
  addons = [],
  coupon_discount = 0,
  loyalty_discount = 0,
} = req.body || {};

if (!car_id || !start_datetime || !end_datetime) {
  return res.status(400).json({ error: "Missing booking fields" });
}

const start = new Date(start_datetime);
const end = new Date(end_datetime);

if (end <= start) {
  return res.status(400).json({ error: "Invalid booking dates" });
}

const startSql = toMysqlDateTime(start_datetime);
const endSql = toMysqlDateTime(end_datetime);

const [[car]] = await conn.query(
  "SELECT id, daily_price FROM cars WHERE id=?",
  [car_id]
);

if (!car) {
  return res.status(404).json({ error: "Car not found" });
}

const [conflicts] = await conn.query(
  `
  SELECT id
  FROM bookings
  WHERE car_id = ?
  AND status IN ('pending','confirmed')
  AND NOT (
    end_datetime <= ?
    OR start_datetime >= ?
  )
  LIMIT 1
  `,
  [car_id, startSql, endSql]
);

if (conflicts.length) {
  return res.status(409).json({ error: "Car already booked for those dates" });
}

const days = diffDaysInclusiveCeil(start, end);

const basePrice = Number(car.daily_price || 0) * days;

const finalPrice =
  basePrice - Number(coupon_discount || 0) - Number(loyalty_discount || 0);

const [result] = await conn.query(
  `
  INSERT INTO bookings (
    user_id,
    customer_id,
    car_id,
    start_date,
    end_date,
    start_datetime,
    end_datetime,
    status,
    payment_status,
    deposit_amount,
    paid_amount,
    payment_method,
    total_price,
    base_price,
    final_price,
    addons_json,
    coupon_discount,
    loyalty_discount,
    created_at,
    updated_at
  )
  VALUES (
    ?, ?, ?, DATE(?), DATE(?),
    ?, ?, 'pending', 'unpaid',
    0,0,NULL,
    ?,?,?,?, ?,?,
    NOW(),NOW()
  )
  `,
  [
    userId,
    userId,
    car_id,
    startSql,
    endSql,
    startSql,
    endSql,
    finalPrice,
    basePrice,
    finalPrice,
    JSON.stringify(addons),
    coupon_discount,
    loyalty_discount,
  ]
);

const [[booking]] = await conn.query(
  "SELECT * FROM bookings WHERE id=?",
  [result.insertId]
);

res.status(201).json(booking);

} catch (err) {
console.error(err);
res.status(500).json({ error: "Booking failed" });
} finally {
conn.release();
}
});

module.exports = router;