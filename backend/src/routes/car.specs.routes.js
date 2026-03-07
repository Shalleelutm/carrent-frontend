const express = require("express");
const pool = require("../db");

const router = express.Router();

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

router.get("/:id/specs", async (req, res) => {
  try {
    const carId = Number(req.params.id);

    if (!carId) {
      return res.status(400).json({ error: "Invalid car id" });
    }

    const columns = await getExistingColumns("cars");

    const selectParts = [
      "c.id",
      selectColumn(columns, "make", "''"),
      selectColumn(columns, "model", "''"),
      selectColumn(columns, "year", "NULL"),
      selectColumn(columns, "color", "''"),
      selectColumn(columns, "seats", "0"),
      selectColumn(columns, "transmission", "''"),
      selectColumn(columns, "daily_price", "0"),
      selectColumn(columns, "image", "''"),
      selectColumn(columns, "image_url", "''"),
      selectColumn(columns, "category", "''"),
      selectColumn(columns, "plate_number", "''"),
      selectColumn(columns, "engine", "NULL"),
      selectColumn(columns, "fuel_type", "NULL"),
      selectColumn(columns, "horsepower", "NULL"),
      selectColumn(columns, "luggage_capacity", "NULL"),
      selectColumn(columns, "fuel_consumption", "NULL"),
      selectColumn(columns, "zero_to_100", "NULL"),
      selectColumn(columns, "features_json", "NULL"),
    ];

    const [[car]] = await pool.query(
      `
      SELECT
        ${selectParts.join(",\n        ")}
      FROM cars c
      WHERE c.id = ?
      LIMIT 1
      `,
      [carId]
    );

    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json({
      ...car,
      features: normalizeFeatures(car.features_json),
    });
  } catch (err) {
    console.error("CAR SPECS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch car specifications" });
  }
});

module.exports = router;