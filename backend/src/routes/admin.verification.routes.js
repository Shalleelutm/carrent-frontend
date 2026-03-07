const express = require("express");
const passport = require("../config/passport");
const pool = require("../db");

const router = express.Router();

const requireAuth = passport.authenticate("jwt", { session: false });

function requireAdmin(req, res, next) {
  const role = String(req.user?.role || "").toLowerCase();
  if (role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  next();
}

router.get("/verifications", requireAuth, requireAdmin, async (req, res) => {
  try {
    const status = String(req.query?.status || "").trim().toLowerCase();
    const q = String(req.query?.q || "").trim();

    const where = [];
    const params = [];

    if (status && ["pending", "approved", "rejected"].includes(status)) {
      where.push("u.verification_status = ?");
      params.push(status);
    }

    if (q) {
      where.push(`
        (
          u.email LIKE ? OR
          CONCAT(COALESCE(u.first_name,''), ' ', COALESCE(u.last_name,'')) LIKE ? OR
          CAST(u.id AS CHAR) LIKE ?
        )
      `);
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const [rows] = await pool.query(
      `
      SELECT
        u.id,
        u.email,
        u.role,
        u.first_name,
        u.last_name,
        u.phone,
        u.country,
        u.passport_file,
        u.license_file,
        u.selfie_file,
        u.verification_status,
        u.verified_by,
        u.verified_at,
        admin_user.email AS verified_by_email
      FROM app_users u
      LEFT JOIN app_users admin_user ON admin_user.id = u.verified_by
      ${whereSql}
      ORDER BY
        CASE
          WHEN u.verification_status = 'pending' THEN 0
          WHEN u.verification_status = 'rejected' THEN 1
          ELSE 2
        END,
        u.id DESC
      LIMIT 500
      `,
      params
    );

    res.json(
      rows.map((row) => ({
        ...row,
        full_name: `${row.first_name || ""} ${row.last_name || ""}`.trim() || "Unnamed user",
      }))
    );
  } catch (err) {
    console.error("ADMIN VERIFICATIONS LIST ERROR:", err);
    res.status(500).json({ error: "Failed to load verifications" });
  }
});

router.get("/verifications/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const userId = Number(req.params.id);

    const [[user]] = await pool.query(
      `
      SELECT
        u.id,
        u.email,
        u.role,
        u.first_name,
        u.last_name,
        u.phone,
        u.country,
        u.address_line1,
        u.city,
        u.passport_no,
        u.license_no,
        u.passport_file,
        u.license_file,
        u.selfie_file,
        u.verification_status,
        u.verified_by,
        u.verified_at,
        admin_user.email AS verified_by_email
      FROM app_users u
      LEFT JOIN app_users admin_user ON admin_user.id = u.verified_by
      WHERE u.id = ?
      LIMIT 1
      `,
      [userId]
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      ...user,
      full_name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Unnamed user",
    });
  } catch (err) {
    console.error("ADMIN VERIFICATION DETAIL ERROR:", err);
    res.status(500).json({ error: "Failed to load verification detail" });
  }
});

router.patch("/verifications/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const adminId = Number(req.user.id);
    const userId = Number(req.params.id);
    const verificationStatus = String(req.body?.verification_status || "").trim().toLowerCase();

    if (!["approved", "rejected", "pending"].includes(verificationStatus)) {
      return res.status(400).json({ error: "Invalid verification_status" });
    }

    await pool.query(
      `
      UPDATE app_users
      SET
        verification_status = ?,
        verified_by = ?,
        verified_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [verificationStatus, adminId, userId]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error("ADMIN VERIFICATION PATCH ERROR:", err);
    res.status(500).json({ error: "Failed to update verification status" });
  }
});

module.exports = router;