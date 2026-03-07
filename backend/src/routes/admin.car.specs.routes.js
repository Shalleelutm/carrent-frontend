const express = require("express");
const passport = require("passport");
const pool = require("../db");

const router = express.Router();
const auth = passport.authenticate("jwt", { session: false });

async function getExistingColumns(tableName) {
  const [rows] = await pool.query(
    `
    SELECT COLUMN_NAME
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = ?
    `,
    [tableName]
  );

  return new Set(rows.map((row) => row.COLUMN_NAME));
}

function selectColumn(columns, name, fallbackSql, alias = name) {
  return columns.has(name) ? `c.${name} AS ${alias}` : `${fallbackSql} AS ${alias}`;
}

function normalizeFeatures(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map((x) => String(x || "").trim()).filter(Boolean);
  }

  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return Array.isArray(parsed)
      ? parsed.map((x) => String(x || "").trim()).filter(Boolean)
      : [];
  } catch {
    return [];
  }
}

function requireAdmin(req, res) {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ error: "Admin access required" });
    return false;
  }
  return true;
}

router.get("/cars/specifications", auth, async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;

    const columns = await getExistingColumns("cars");

    const selectParts = [
      "c.id",
      selectColumn(columns, "make", "''"),
      selectColumn(columns, "model", "''"),
      selectColumn(columns, "year", "NULL"),
      selectColumn(columns, "category", "''"),
      selectColumn(columns, "transmission", "''"),
      selectColumn(columns, "seats", "0"),
      selectColumn(columns, "daily_price", "0"),
      selectColumn(columns, "engine", "NULL"),
      selectColumn(columns, "fuel_type", "NULL"),
      selectColumn(columns, "horsepower", "NULL"),
      selectColumn(columns, "luggage_capacity", "NULL"),
      selectColumn(columns, "fuel_consumption", "NULL"),
      selectColumn(columns, "zero_to_100", "NULL"),
      selectColumn(columns, "features_json", "NULL"),
    ];

    const [rows] = await pool.query(
      `
      SELECT *
      FROM (
        SELECT
          ${selectParts.join(",\n          ")}
        FROM cars c
      ) cars_view
      ORDER BY cars_view.make ASC, cars_view.model ASC, cars_view.id ASC
      `
    );

    res.json(
      rows.map((row) => ({
        ...row,
        features: normalizeFeatures(row.features_json),
      }))
    );
  } catch (err) {
    console.error("ADMIN CAR SPEC LIST ERROR:", err);
    res.status(500).json({ error: "Failed to fetch admin car specifications" });
  }
});

router.put("/cars/:id/specifications", auth, async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;

    const carId = Number(req.params.id);
    if (!carId) {
      return res.status(400).json({ error: "Invalid car id" });
    }

    const columns = await getExistingColumns("cars");

    const {
      transmission = "",
      engine = "",
      fuel_type = "",
      horsepower = null,
      luggage_capacity = null,
      fuel_consumption = "",
      zero_to_100 = "",
      features = [],
    } = req.body || {};

    const updates = [];
    const params = [];

    if (columns.has("transmission")) {
      updates.push("transmission = ?");
      params.push(String(transmission || "").trim() || null);
    }

    if (columns.has("engine")) {
      updates.push("engine = ?");
      params.push(String(engine || "").trim() || null);
    }

    if (columns.has("fuel_type")) {
      updates.push("fuel_type = ?");
      params.push(String(fuel_type || "").trim() || null);
    }

    if (columns.has("horsepower")) {
      updates.push("horsepower = ?");
      params.push(
        horsepower === "" || horsepower === null || horsepower === undefined
          ? null
          : Number(horsepower)
      );
    }

    if (columns.has("luggage_capacity")) {
      updates.push("luggage_capacity = ?");
      params.push(
        luggage_capacity === "" || luggage_capacity === null || luggage_capacity === undefined
          ? null
          : Number(luggage_capacity)
      );
    }

    if (columns.has("fuel_consumption")) {
      updates.push("fuel_consumption = ?");
      params.push(String(fuel_consumption || "").trim() || null);
    }

    if (columns.has("zero_to_100")) {
      updates.push("zero_to_100 = ?");
      params.push(String(zero_to_100 || "").trim() || null);
    }

    if (columns.has("features_json")) {
      const safeFeatures = Array.isArray(features)
        ? features.map((x) => String(x || "").trim()).filter(Boolean).slice(0, 50)
        : [];
      updates.push("features_json = ?");
      params.push(JSON.stringify(safeFeatures));
    }

    if (!updates.length) {
      return res.status(400).json({
        error: "Car specification columns are missing. Run the SQL migration first.",
      });
    }

    params.push(carId);

    await pool.query(
      `
      UPDATE cars
      SET ${updates.join(", ")}
      WHERE id = ?
      `,
      params
    );

    const selectParts = [
      "c.id",
      selectColumn(columns, "make", "''"),
      selectColumn(columns, "model", "''"),
      selectColumn(columns, "year", "NULL"),
      selectColumn(columns, "category", "''"),
      selectColumn(columns, "transmission", "''"),
      selectColumn(columns, "seats", "0"),
      selectColumn(columns, "daily_price", "0"),
      selectColumn(columns, "engine", "NULL"),
      selectColumn(columns, "fuel_type", "NULL"),
      selectColumn(columns, "horsepower", "NULL"),
      selectColumn(columns, "luggage_capacity", "NULL"),
      selectColumn(columns, "fuel_consumption", "NULL"),
      selectColumn(columns, "zero_to_100", "NULL"),
      selectColumn(columns, "features_json", "NULL"),
    ];

    const [[updated]] = await pool.query(
      `
      SELECT
        ${selectParts.join(",\n        ")}
      FROM cars c
      WHERE c.id = ?
      LIMIT 1
      `,
      [carId]
    );

    res.json({
      ...updated,
      features: normalizeFeatures(updated?.features_json),
    });
  } catch (err) {
    console.error("ADMIN CAR SPEC UPDATE ERROR:", err);
    res.status(500).json({ error: "Failed to update car specifications" });
  }
});

module.exports = router;