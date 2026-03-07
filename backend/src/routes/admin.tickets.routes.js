const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const passport = require("../config/passport");
const pool = require("../db");

const router = express.Router();

const uploadDir = path.join(__dirname, "../../uploads/tickets");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
});

const requireAuth = passport.authenticate("jwt", { session: false });

function getUserId(req) {
  const id = req.user?.id || req.user?.user_id || req.user?.uid;
  if (!id) throw new Error("User id missing from token");
  return Number(id);
}

function requireAdmin(req, res, next) {
  const role = String(req.user?.role || "").toLowerCase();
  if (role !== "admin") return res.status(403).json({ error: "Admin only" });
  next();
}

function progressForStatus(status) {
  if (status === "resolved") return 100;
  if (status === "closed") return 100;
  return 60;
}

/* =========================
   LIST ALL TICKETS
========================= */
router.get("/tickets", requireAuth, requireAdmin, async (req, res) => {
  try {
    const status = String(req.query?.status || "").trim();
    const q = String(req.query?.q || "").trim();

    const where = [];
    const params = [];

    if (status) {
      where.push("t.status = ?");
      params.push(status);
    }

    if (q) {
      where.push(`(
        t.subject LIKE ? OR
        CAST(t.id AS CHAR) LIKE ? OR
        au.email LIKE ? OR
        CONCAT(COALESCE(au.first_name,''), ' ', COALESCE(au.last_name,'')) LIKE ?
      )`);
      params.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const [rows] = await pool.query(
      `
      SELECT
        t.id,
        t.user_id,
        t.subject,
        t.category,
        t.status,
        t.priority,
        t.requester_type,
        t.progress_percent,
        t.created_at,
        t.updated_at,
        au.email AS customer_email,
        CONCAT(COALESCE(au.first_name,''), ' ', COALESCE(au.last_name,'')) AS customer_name,
        (
          SELECT MAX(m.created_at)
          FROM support_messages m
          WHERE m.ticket_id = t.id
        ) AS last_message_at
      FROM support_tickets t
      LEFT JOIN app_users au ON au.id = t.user_id
      ${whereSql}
      ORDER BY t.updated_at DESC
      LIMIT 500
      `,
      params
    );

    res.json(
      rows.map((r) => ({
        ...r,
        customer_name: String(r.customer_name || "").trim() || "Guest",
        customer_email: r.customer_email || "-",
      }))
    );
  } catch (err) {
    console.error("ADMIN TICKETS LIST ERROR:", err);
    res.status(500).json({ error: "Failed to load admin tickets" });
  }
});

/* =========================
   TICKET DETAIL
========================= */
router.get("/tickets/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const ticketId = Number(req.params.id);

    const [[ticket]] = await pool.query(
      `
      SELECT
        t.id,
        t.user_id,
        t.subject,
        t.category,
        t.status,
        t.priority,
        t.requester_type,
        t.progress_percent,
        t.created_at,
        t.updated_at,
        au.email AS customer_email,
        CONCAT(COALESCE(au.first_name,''), ' ', COALESCE(au.last_name,'')) AS customer_name
      FROM support_tickets t
      LEFT JOIN app_users au ON au.id = t.user_id
      WHERE t.id = ?
      LIMIT 1
      `,
      [ticketId]
    );

    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    const [messages] = await pool.query(
      `
      SELECT
        m.id,
        m.ticket_id,
        m.sender_role,
        m.sender_user_id,
        m.message,
        m.attachment_path,
        m.attachment_name,
        m.attachment_mime,
        m.created_at,
        CASE
          WHEN m.sender_role = 'admin' THEN 'Admin'
          ELSE CONCAT(COALESCE(au.first_name,''), ' ', COALESCE(au.last_name,''), IF(au.email IS NOT NULL, CONCAT(' (', au.email, ')'), ''))
        END AS sender_label
      FROM support_messages m
      LEFT JOIN app_users au ON au.id = m.sender_user_id
      WHERE m.ticket_id = ?
      ORDER BY m.created_at ASC
      LIMIT 2000
      `,
      [ticketId]
    );

    res.json({
      ticket: {
        ...ticket,
        customer_name: String(ticket.customer_name || "").trim() || "Guest",
        customer_email: ticket.customer_email || "-",
      },
      messages,
    });
  } catch (err) {
    console.error("ADMIN TICKET DETAIL ERROR:", err);
    res.status(500).json({ error: "Failed to load ticket" });
  }
});

/* =========================
   ADMIN REPLY
========================= */
router.post("/tickets/:id/messages", requireAuth, requireAdmin, upload.single("attachment"), async (req, res) => {
  try {
    const adminId = getUserId(req);
    const ticketId = Number(req.params.id);
    const message = String(req.body?.message || "").trim();

    if (!message) return res.status(400).json({ error: "message required" });

    const [[ticket]] = await pool.query(
      `
      SELECT id, status
      FROM support_tickets
      WHERE id = ?
      LIMIT 1
      `,
      [ticketId]
    );

    if (!ticket) return res.status(404).json({ error: "Ticket not found" });
    if (ticket.status === "closed" || ticket.status === "resolved") {
      return res.status(400).json({ error: "Resolved or closed tickets cannot receive replies" });
    }

    await pool.query(
      `
      INSERT INTO support_messages
      (ticket_id, sender_role, sender_user_id, message, attachment_path, attachment_name, attachment_mime, created_at)
      VALUES (?, 'admin', ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `,
      [
        ticketId,
        adminId,
        message,
        req.file ? `/uploads/tickets/${req.file.filename}` : null,
        req.file ? req.file.originalname : null,
        req.file ? req.file.mimetype : null,
      ]
    );

    await pool.query(
      `
      UPDATE support_tickets
      SET updated_at = CURRENT_TIMESTAMP, progress_percent = 60
      WHERE id = ?
      `,
      [ticketId]
    );

    res.json({ ok: true, message: "Admin reply sent successfully." });
  } catch (err) {
    console.error("ADMIN REPLY ERROR:", err);
    res.status(500).json({ error: "Failed to send admin message" });
  }
});

/* =========================
   UPDATE TICKET
========================= */
router.patch("/tickets/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const ticketId = Number(req.params.id);
    const status = req.body?.status ? String(req.body.status).trim() : null;
    const priority = req.body?.priority ? String(req.body.priority).trim() : null;

    const allowedStatus = new Set(["open", "resolved", "closed"]);
    const allowedPriority = new Set(["low", "normal", "high", "urgent"]);

    const sets = [];
    const params = [];

    if (status) {
      if (!allowedStatus.has(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      sets.push("status = ?");
      params.push(status);
      sets.push("progress_percent = ?");
      params.push(progressForStatus(status));
    }

    if (priority) {
      if (!allowedPriority.has(priority)) {
        return res.status(400).json({ error: "Invalid priority" });
      }
      sets.push("priority = ?");
      params.push(priority);
    }

    if (!sets.length) {
      return res.status(400).json({ error: "Nothing to update" });
    }

    params.push(ticketId);

    await pool.query(
      `
      UPDATE support_tickets
      SET ${sets.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      params
    );

    res.json({ ok: true });
  } catch (err) {
    console.error("ADMIN TICKET PATCH ERROR:", err);
    res.status(500).json({ error: "Failed to update ticket" });
  }
});

module.exports = router;