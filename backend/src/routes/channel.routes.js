const express = require("express");
const pool = require("../db");

const router = express.Router();

router.post("/booking", async (req, res) => {
  try {
    const { channel, external_id, car_id, start, end } = req.body;

    await pool.query(
      `
      INSERT INTO channel_sync
      (channel_name, external_booking_id, car_id, start_datetime, end_datetime)
      VALUES (?,?,?,?,?)
      `,
      [channel, external_id, car_id, start, end]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Channel booking failed" });
  }
});

module.exports = router;