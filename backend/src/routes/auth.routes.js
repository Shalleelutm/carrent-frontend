const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();

// TEMP helper: allow TEMP password_hash to work as "TEMP" (we will fix later)
function isTempHash(pwHash) {
  return pwHash === "TEMP" || pwHash === null || pwHash === "";
}

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "email + password required" });
    }

    const [rows] = await pool.query(
      "SELECT id, email, password_hash, role FROM app_users WHERE email = ?",
      [email]
    );

    const user = rows[0];
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    let ok = false;

    if (isTempHash(user.password_hash)) {
      ok = password === "TEMP";
    } else {
      ok = await bcrypt.compare(password, user.password_hash);
    }

    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    // ✅ IMPORTANT: token must include "id"
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token, role: user.role, email: user.email, id: user.id });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;