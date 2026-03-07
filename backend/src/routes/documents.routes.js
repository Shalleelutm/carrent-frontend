const express = require("express");
const passport = require("passport");
const multer = require("multer");
const pool = require("../db");

const router = express.Router();
const auth = passport.authenticate("jwt", { session: false });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/documents/");
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    const userId = req.user.id;
    const { document_type } = req.body;

    if (!document_type) {
      return res.status(400).json({ error: "document_type required" });
    }

    await pool.query(
      `
      INSERT INTO user_documents
      (user_id, document_type, file_path)
      VALUES (?, ?, ?)
      `,
      [userId, document_type, req.file.path]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("DOCUMENT UPLOAD ERROR:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM user_documents WHERE user_id=?`,
      [req.user.id]
    );

    res.json(rows);
  } catch (err) {
    console.error("FETCH DOCUMENT ERROR:", err);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

module.exports = router;