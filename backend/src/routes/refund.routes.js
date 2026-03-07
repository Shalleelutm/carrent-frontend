const express = require("express");
const passport = require("../config/passport");
const pool = require("../db");

const router = express.Router();

const requireAuth = passport.authenticate("jwt", { session: false });

router.post("/booking/:id", requireAuth, async (req, res) => {

  try {

    const bookingId = Number(req.params.id);
    const userId = Number(req.user.id);

    const reason = String(req.body?.reason || "");

    await pool.query(
      `
      INSERT INTO booking_refunds
      (booking_id, user_id, reason)
      VALUES (?, ?, ?)
      `,
      [bookingId, userId, reason]
    );

    res.json({ ok: true });

  } catch (err) {

    console.error("REFUND REQUEST ERROR:", err);
    res.status(500).json({ error: "Refund request failed" });

  }

});

module.exports = router;