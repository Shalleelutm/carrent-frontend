const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/auth.middleware");

// CREATE BOOKING (PROTECTED)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { car_id, start_datetime, end_datetime } = req.body;

    const customer_id = req.user.id;

    if (!car_id || !start_datetime || !end_datetime) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const start = new Date(start_datetime);
    const end = new Date(end_datetime);

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      return res.status(400).json({ error: "Invalid dates" });
    }

    // CHECK CAR EXISTS
    const [carRows] = await pool.query(
      "SELECT daily_price FROM cars WHERE id = ?",
      [car_id]
    );

    if (!carRows.length) {
      return res.status(404).json({ error: "Car not found" });
    }

    const dailyPrice = carRows[0].daily_price;

    // CHECK AVAILABILITY
    const [existing] = await pool.query(
      `SELECT id FROM bookings 
       WHERE car_id = ?
       AND (
         (start_datetime <= ? AND end_datetime > ?)
         OR
         (start_datetime < ? AND end_datetime >= ?)
       )`,
      [car_id, start, start, end, end]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "Car already booked" });
    }

    const totalPrice = dailyPrice * days;

    await pool.query(
      `INSERT INTO bookings
      (customer_id, car_id, start_datetime, end_datetime, total_price)
      VALUES (?, ?, ?, ?, ?)`,
      [customer_id, car_id, start, end, totalPrice]
    );

    res.status(201).json({
      message: "Booking created successfully"
    });

  } catch (error) {
    console.error("BOOKING ERROR:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// GET ALL BOOKINGS
router.get("/", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM bookings ORDER BY id DESC"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

module.exports = router;