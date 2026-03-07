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

router.get("/", async (_req, res) => {
  try {
    const columns = await getExistingColumns("cars");

    const selectParts = [
      "c.id",
      selectColumn(columns, "make", "''"),
      selectColumn(columns, "model", "''"),
      selectColumn(columns, "year", "NULL"),
      selectColumn(columns, "color", "''"),
      selectColumn(columns, "transmission", "''"),
      selectColumn(columns, "seats", "0"),
      selectColumn(columns, "daily_price", "0"),
      selectColumn(columns, "image", "''"),
      selectColumn(columns, "image_url", "''"),
      selectColumn(columns, "category", "''"),
      selectColumn(columns, "plate_number", "''"),
      selectColumn(columns, "is_featured", "0"),
      selectColumn(columns, "description", "''"),
    ];

    const [rows] = await pool.query(
      `
      SELECT *
      FROM (
        SELECT
          ${selectParts.join(",\n          ")}
        FROM cars c
      ) cars_view
      ORDER BY
        COALESCE(cars_view.is_featured, 0) DESC,
        COALESCE(cars_view.daily_price, 0) ASC,
        cars_view.id DESC
      `
    );

    res.json(rows);
  } catch (err) {
    console.error("CARS LIST ERROR:", err);
    res.status(500).json({ error: "Failed to fetch cars" });
  }
});

router.get("/:id", async (req, res) => {
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
      selectColumn(columns, "transmission", "''"),
      selectColumn(columns, "seats", "0"),
      selectColumn(columns, "daily_price", "0"),
      selectColumn(columns, "image", "''"),
      selectColumn(columns, "image_url", "''"),
      selectColumn(columns, "category", "''"),
      selectColumn(columns, "plate_number", "''"),
      selectColumn(columns, "is_featured", "0"),
      selectColumn(columns, "description", "''"),
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

    res.json(car);
  } catch (err) {
    console.error("CAR DETAILS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch car details" });
  }
});

module.exports = router;