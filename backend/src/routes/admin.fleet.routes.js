const express = require("express");
const passport = require("passport");
const pool = require("../db");

const router = express.Router();

const auth = passport.authenticate("jwt", { session: false });

router.get("/fleet", auth, async (req, res) => {
  try {
    const [cars] = await pool.query("SELECT COUNT(*) AS total FROM cars");

    const [active] = await pool.query(`
      SELECT COUNT(*) AS rented
      FROM bookings
      WHERE status IN ('pending','confirmed')
      AND NOW() BETWEEN start_datetime AND end_datetime
    `);

    const [dueToday] = await pool.query(`
      SELECT COUNT(*) AS due_today
      FROM bookings
      WHERE status='confirmed'
      AND DATE(end_datetime)=CURDATE()
    `);

    const [overdue] = await pool.query(`
      SELECT COUNT(*) AS overdue
      FROM bookings
      WHERE status='confirmed'
      AND end_datetime < NOW()
    `);

    const totalCars = cars[0].total || 0;
    const rented = active[0].rented || 0;

    const available = totalCars - rented;

    const utilisation =
      totalCars === 0 ? 0 : Math.round((rented / totalCars) * 100);

    res.json({
      totalCars,
      rented,
      available,
      dueToday: dueToday[0].due_today,
      overdue: overdue[0].overdue,
      utilisation,
    });
  } catch (err) {
    console.error("FLEET ERROR", err);
    res.status(500).json({ error: "Fleet statistics failed" });
  }
});

module.exports = router;