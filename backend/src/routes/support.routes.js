const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const pool = require("../db");
const auth = require("../middleware/auth");

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

function normalizeRequesterType(v) {
  return String(v || "customer").toLowerCase() === "partner" ? "partner" : "customer";
}

function normalizeCategory(v) {
  const allowed = new Set([
    "general",
    "refund_request",
    "subscription_request",
    "forgot_password",
    "change_email",
    "billing",
    "migration",
    "cancellation",
    "breakdown",
    "addons",
    "booking_issue",
    "partner_support",
  ]);
  const val = String(v || "general").toLowerCase();
  return allowed.has(val) ? val : "general";
}

function normalizePriority(v) {
  const allowed = new Set(["low", "normal", "high", "urgent"]);
  const val = String(v || "normal").toLowerCase();
  return allowed.has(val) ? val : "normal";
}

function progressForStatus(status) {
  if (status === "resolved") return 100;
  if (status === "closed") return 100;
  return 25;
}

/* =========================
   CREATE TICKET
========================= */
router.post("/tickets", auth, upload.single("attachment"), async (req, res) => {
  try {
    const userId = req.user.id;

    const subject = String(req.body?.subject || "").trim();
    const message = String(req.body?.message || "").trim();
    const priority = normalizePriority(req.body?.priority);
    const category = normalizeCategory(req.body?.category);
    const requesterType = normalizeRequesterType(req.body?.requester_type);

    if (!subject) return res.status(400).json({ error: "subject required" });
    if (!message) return res.status(400).json({ error: "message required" });

    const [ticketResult] = await pool.query(
      `
      INSERT INTO support_tickets
      (user_id, subject, category, status, priority, requester_type, progress_percent, created_at, updated_at)
      VALUES (?, ?, ?, 'open', ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `,
      [userId, subject, category, priority, requesterType, progressForStatus("open")]
    );

    const ticketId = ticketResult.insertId;

    await pool.query(
      `
      INSERT INTO support_messages
      (ticket_id, sender_role, sender_user_id, message, attachment_path, attachment_name, attachment_mime, created_at)
      VALUES (?, 'customer', ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `,
      [
        ticketId,
        userId,
        message,
        req.file ? `/uploads/tickets/${req.file.filename}` : null,
        req.file ? req.file.originalname : null,
        req.file ? req.file.mimetype : null,
      ]
    );

    res.status(201).json({
      ok: true,
      id: ticketId,
      message: "Your ticket has been created and is now under review.",
      progress_percent: 25,
    });
  } catch (err) {
    console.error("support/tickets create error:", err);
    res.status(500).json({ error: "Failed to create ticket" });
  }
});

/* =========================
   LIST MY TICKETS
========================= */
router.get("/tickets", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `
      SELECT
        t.id,
        t.subject,
        t.category,
        t.status,
        t.priority,
        t.requester_type,
        t.progress_percent,
        t.created_at,
        t.updated_at,
        (
          SELECT MAX(m.created_at)
          FROM support_messages m
          WHERE m.ticket_id = t.id
        ) AS last_message_at
      FROM support_tickets t
      WHERE t.user_id = ?
      ORDER BY t.updated_at DESC
      LIMIT 200
      `,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("support/tickets list error:", err);
    res.status(500).json({ error: "Failed to load tickets" });
  }
});

/* =========================
   TICKET DETAIL
========================= */
router.get("/tickets/:id", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const ticketId = Number(req.params.id);

    const [[ticket]] = await pool.query(
      `
      SELECT
        id, user_id, subject, category, status, priority, requester_type, progress_percent, created_at, updated_at
      FROM support_tickets
      WHERE id = ? AND user_id = ?
      LIMIT 1
      `,
      [ticketId, userId]
    );

    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    const [messages] = await pool.query(
      `
      SELECT
        id,
        ticket_id,
        sender_role,
        sender_user_id,
        message,
        attachment_path,
        attachment_name,
        attachment_mime,
        created_at
      FROM support_messages
      WHERE ticket_id = ?
      ORDER BY created_at ASC
      LIMIT 1000
      `,
      [ticketId]
    );

    res.json({ ticket, messages });
  } catch (err) {
    console.error("support/tickets/:id error:", err);
    res.status(500).json({ error: "Failed to load ticket" });
  }
});

/* =========================
   CUSTOMER REPLY
========================= */
router.post("/tickets/:id/messages", auth, upload.single("attachment"), async (req, res) => {
  try {
    const userId = req.user.id;
    const ticketId = Number(req.params.id);
    const message = String(req.body?.message || "").trim();

    if (!message) return res.status(400).json({ error: "message required" });

    const [[ticket]] = await pool.query(
      `
      SELECT id, status
      FROM support_tickets
      WHERE id = ? AND user_id = ?
      LIMIT 1
      `,
      [ticketId, userId]
    );

    if (!ticket) return res.status(404).json({ error: "Ticket not found" });
    if (ticket.status !== "open") {
      return res.status(400).json({ error: "Only open tickets can receive replies" });
    }

    await pool.query(
      `
      INSERT INTO support_messages
      (ticket_id, sender_role, sender_user_id, message, attachment_path, attachment_name, attachment_mime, created_at)
      VALUES (?, 'customer', ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `,
      [
        ticketId,
        userId,
        message,
        req.file ? `/uploads/tickets/${req.file.filename}` : null,
        req.file ? req.file.originalname : null,
        req.file ? req.file.mimetype : null,
      ]
    );

    await pool.query(
      `
      UPDATE support_tickets
      SET updated_at = CURRENT_TIMESTAMP, progress_percent = 40
      WHERE id = ?
      `,
      [ticketId]
    );

    res.json({ ok: true, message: "Reply sent successfully." });
  } catch (err) {
    console.error("support message create error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

module.exports = router;