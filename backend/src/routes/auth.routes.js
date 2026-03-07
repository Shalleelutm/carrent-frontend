const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("../config/passport");
const pool = require("../db");

const router = express.Router();

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

/*
REGISTER
POST /api/auth/register
*/
router.post("/register", async (req, res) => {
  try {

    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    email = email.toLowerCase().trim();

    const [existing] = await pool.query(
      "SELECT id FROM app_users WHERE email=?",
      [email]
    );

    if (existing.length) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO app_users (email, password_hash, role)
       VALUES (?, ?, 'customer')`,
      [email, hash]
    );

    const user = {
      id: result.insertId,
      email,
      role: "customer"
    };

    const token = createToken(user);

    res.json({ token, user });

  } catch (err) {

    console.error("REGISTER ERROR", err);

    res.status(500).json({
      error: "Registration failed"
    });

  }
});


/*
LOGIN
POST /api/auth/login
*/
router.post("/login", async (req, res) => {
  try {

    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    email = email.toLowerCase().trim();

    const [rows] = await pool.query(
      "SELECT * FROM app_users WHERE email=?",
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = rows[0];

    if (!user.password_hash) {
      return res.status(401).json({
        error:
          "This account uses Google/Facebook login. Please use the social login button."
      });
    }

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = createToken(user);

    res.json({ token, user });

  } catch (err) {

    console.error("LOGIN ERROR", err);

    res.status(500).json({
      error: "Login failed"
    });

  }
});


/*
GOOGLE LOGIN
*/
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {

    const token = createToken(req.user);

    res.redirect(
      `http://localhost:5173/oauth-success?token=${token}`
    );

  }
);


/*
FACEBOOK LOGIN
*/
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  (req, res) => {

    const token = createToken(req.user);

    res.redirect(
      `http://localhost:5173/oauth-success?token=${token}`
    );

  }
);

module.exports = router;