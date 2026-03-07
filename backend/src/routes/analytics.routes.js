const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/heatmap", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT location, COUNT(*) AS bookings
      FROM bookings
      GROUP BY location
      ORDER BY bookings DESC
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Heatmap failed" });
  }
});

module.exports = router;