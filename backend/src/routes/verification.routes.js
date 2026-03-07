const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const pool = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

const baseDir = path.join(__dirname, "../../uploads/documents");

fs.mkdirSync(path.join(baseDir, "passport"), { recursive: true });
fs.mkdirSync(path.join(baseDir, "license"), { recursive: true });
fs.mkdirSync(path.join(baseDir, "selfie"), { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    if (file.fieldname === "passport") {
      cb(null, path.join(baseDir, "passport"));
      return;
    }

    if (file.fieldname === "license") {
      cb(null, path.join(baseDir, "license"));
      return;
    }

    cb(null, path.join(baseDir, "selfie"));
  },
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
});

router.get("/me", auth, async (req, res) => {
  try {
    const [[user]] = await pool.query(
      `
      SELECT
        id,
        email,
        passport_file,
        license_file,
        selfie_file,
        verification_status,
        verified_by,
        verified_at
      FROM app_users
      WHERE id = ?
      LIMIT 1
      `,
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("VERIFICATION ME ERROR:", err);
    res.status(500).json({ error: "Failed to load verification profile" });
  }
});

router.post(
  "/upload",
  auth,
  upload.fields([
    { name: "passport", maxCount: 1 },
    { name: "license", maxCount: 1 },
    { name: "selfie", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const userId = req.user.id;

      const passportFile = req.files?.passport?.[0] || null;
      const licenseFile = req.files?.license?.[0] || null;
      const selfieFile = req.files?.selfie?.[0] || null;

      await pool.query(
        `
        UPDATE app_users
        SET
          passport_file = COALESCE(?, passport_file),
          license_file = COALESCE(?, license_file),
          selfie_file = COALESCE(?, selfie_file),
          verification_status = 'pending',
          verified_by = NULL,
          verified_at = NULL
        WHERE id = ?
        `,
        [
          passportFile ? `/uploads/documents/passport/${passportFile.filename}` : null,
          licenseFile ? `/uploads/documents/license/${licenseFile.filename}` : null,
          selfieFile ? `/uploads/documents/selfie/${selfieFile.filename}` : null,
          userId,
        ]
      );

      res.json({
        ok: true,
        message: "Documents uploaded. Awaiting admin approval.",
      });
    } catch (err) {
      console.error("VERIFICATION UPLOAD ERROR:", err);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

module.exports = router;