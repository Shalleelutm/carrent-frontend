const express = require("express");
const pool = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        id, email, role,
        first_name, last_name, phone, dob,
        passport_no, license_no, country, address_line1, city,
        profile_completed
      FROM app_users
      WHERE id = ?
      LIMIT 1
      `,
      [req.user.id]
    );

    if (!rows.length) return res.status(404).json({ error: "User not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error("ME GET ERROR:", err);
    res.status(500).json({ error: "Failed to load profile" });
  }
});

router.put("/", auth, async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      phone,
      dob,
      passport_no,
      license_no,
      country,
      address_line1,
      city,
    } = req.body || {};

    const required = [
      first_name,
      last_name,
      phone,
      dob,
      passport_no,
      license_no,
      country,
      address_line1,
      city,
    ];

    const profile_completed = required.every((v) => String(v || "").trim().length > 0) ? 1 : 0;

    await pool.query(
      `
      UPDATE app_users
      SET
        first_name = ?,
        last_name = ?,
        phone = ?,
        dob = ?,
        passport_no = ?,
        license_no = ?,
        country = ?,
        address_line1 = ?,
        city = ?,
        profile_completed = ?
      WHERE id = ?
      `,
      [
        first_name || null,
        last_name || null,
        phone || null,
        dob || null,
        passport_no || null,
        license_no || null,
        country || null,
        address_line1 || null,
        city || null,
        profile_completed,
        req.user.id,
      ]
    );

    res.json({ ok: true, profile_completed: !!profile_completed });
  } catch (err) {
    console.error("ME PUT ERROR:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

module.exports = router;