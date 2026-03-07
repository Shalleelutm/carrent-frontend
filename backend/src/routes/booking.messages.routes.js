const express = require("express");
const passport = require("../config/passport");
const pool = require("../db");

const router = express.Router();

const requireAuth = passport.authenticate("jwt", { session: false });

function getUserId(req) {
  return Number(req.user?.id || req.user?.user_id);
}

/* GET BOOKING MESSAGES */
router.get("/:bookingId/messages", requireAuth, async (req, res) => {

  try {

    const bookingId = Number(req.params.bookingId);

    const [rows] = await pool.query(
      `
      SELECT
        id,
        booking_id,
        sender_role,
        sender_user_id,
        message,
        created_at
      FROM booking_messages
      WHERE booking_id = ?
      ORDER BY created_at ASC
      `,
      [bookingId]
    );

    res.json(rows);

  } catch (err) {

    console.error("BOOKING MESSAGES ERROR:", err);
    res.status(500).json({ error: "Failed to load booking messages" });

  }

});

/* SEND MESSAGE */
router.post("/:bookingId/messages", requireAuth, async (req, res) => {

  try {

    const bookingId = Number(req.params.bookingId);
    const userId = getUserId(req);
    const message = String(req.body?.message || "").trim();

    if (!message) {
      return res.status(400).json({ error: "message required" });
    }

    await pool.query(
      `
      INSERT INTO booking_messages
      (booking_id, sender_role, sender_user_id, message)
      VALUES (?, 'customer', ?, ?)
      `,
      [bookingId, userId, message]
    );

    res.json({ ok: true });

  } catch (err) {

    console.error("SEND BOOKING MESSAGE ERROR:", err);
    res.status(500).json({ error: "Failed to send message" });

  }

});

module.exports = router;