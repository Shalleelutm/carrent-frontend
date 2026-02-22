const jwt = require("jsonwebtoken");

function signJwt(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
}

function verifyJwt(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const decoded = verifyJwt(parts[1]);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = { signJwt, verifyJwt, authMiddleware };