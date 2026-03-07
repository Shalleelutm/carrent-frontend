require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const passport = require("./config/passport");

const authRoutes = require("./routes/auth.routes");
const carRoutes = require("./routes/cars.routes");
const carSpecsRoutes = require("./routes/car.specs.routes");

const bookingRoutes = require("./routes/bookings.routes");
const bookingMessageRoutes = require("./routes/booking.messages.routes");

const invoiceRoutes = require("./routes/invoice.routes");
const refundRoutes = require("./routes/refund.routes");

const meRoutes = require("./routes/me.routes");

const adminRoutes = require("./routes/admin.routes");
const adminCarSpecsRoutes = require("./routes/admin.car.specs.routes");
const adminTicketRoutes = require("./routes/admin.tickets.routes");
const adminVerificationRoutes = require("./routes/admin.verification.routes");

const supportRoutes = require("./routes/support.routes");

const verificationRoutes = require("./routes/verification.routes");

const documentRoutes = require("./routes/documents.routes");

const fleetRoutes = require("./routes/admin.fleet.routes");
const currencyRoutes = require("./routes/currency.routes");
const channelRoutes = require("./routes/channel.routes");

const pool = require("./db");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(passport.initialize());

app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${ms}ms`);
  });

  next();
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "CarRent Pro API",
    version: "1.0",
    uptime: process.uptime(),
    time: new Date(),
  });
});

/* ===========================
   PUBLIC API ROUTES
=========================== */

app.use("/api/auth", authRoutes);

app.use("/api/cars", carRoutes);
app.use("/api/cars", carSpecsRoutes);

app.use("/api/bookings", bookingRoutes);
app.use("/api/bookings", bookingMessageRoutes);

app.use("/api/me", meRoutes);

app.use("/api/support", supportRoutes);

/* ===========================
   ADMIN API ROUTES
=========================== */

app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminTicketRoutes);
app.use("/api/admin", adminVerificationRoutes);
app.use("/api/admin", adminCarSpecsRoutes);
app.use("/api/admin", fleetRoutes);

/* ===========================
   OTHER SERVICES
=========================== */

app.use("/api/verification", verificationRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/refunds", refundRoutes);

/* ===========================
   PLATFORM SERVICES
=========================== */

app.use("/api/currency", currencyRoutes);
app.use("/api/channel", channelRoutes);
/* ===========================
   DATABASE CHECK
=========================== */

async function checkDatabase() {
  try {
    await pool.query("SELECT 1");
    console.log("DATABASE CONNECTED");
  } catch (err) {
    console.error("DATABASE CONNECTION FAILED");
    console.error(err);
    process.exit(1);
  }
}

checkDatabase();

/* ===========================
   ERROR HANDLER
=========================== */

app.use((err, req, res, _next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).json({
    error: "Internal Server Error",
  });
});

/* ===========================
   SERVER START
=========================== */

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`
====================================
🚗 CarRent Pro API
====================================

Server running:
http://localhost:${PORT}

Health check:
http://localhost:${PORT}/health

Cars API:
http://localhost:${PORT}/api/cars

Admin API:
http://localhost:${PORT}/api/admin

Support API:
http://localhost:${PORT}/api/support

Verification API:
http://localhost:${PORT}/api/verification

Invoices API:
http://localhost:${PORT}/api/invoices

Refund API:
http://localhost:${PORT}/api/refunds

====================================
`);
});