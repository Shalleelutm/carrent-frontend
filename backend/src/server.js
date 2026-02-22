require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const carRoutes = require("./routes/cars.routes");
const bookingRoutes = require("./routes/bookings.routes");

const pool = require("./db");

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json());
app.use(morgan("dev"));

// Health check
app.get("/health", (req, res) =>
  res.json({ ok: true, service: "carrent-pro-api" })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/bookings", bookingRoutes);

// Test DB connection
pool.query("SELECT 1")
  .then(() => console.log("DATABASE CONNECTED"))
  .catch(err => console.error("DB ERROR:", err));

// Start server
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});