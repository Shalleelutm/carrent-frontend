const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET ALL CARS
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM cars ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cars" });
  }
});

// GET SINGLE CAR
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM cars WHERE id = ?",
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch car" });
  }
});

// CREATE CAR
router.post("/", async (req, res) => {
  try {
    const {
      brand,
      model,
      year,
      daily_price,
      status
    } = req.body;

    await pool.query(
      `INSERT INTO cars (brand, model, year, daily_price, status)
       VALUES (?, ?, ?, ?, ?)`,
      [brand, model, year, daily_price, status || "available"]
    );

    res.status(201).json({ message: "Car created successfully" });

  } catch (error) {
    res.status(500).json({ error: "Failed to create car" });
  }
});

// UPDATE CAR
router.patch("/:id", async (req, res) => {
  try {
    const {
      brand,
      model,
      year,
      daily_price,
      status
    } = req.body;

    await pool.query(
      `UPDATE cars
       SET brand = ?, model = ?, year = ?, daily_price = ?, status = ?
       WHERE id = ?`,
      [brand, model, year, daily_price, status, req.params.id]
    );

    res.json({ message: "Car updated successfully" });

  } catch (error) {
    res.status(500).json({ error: "Failed to update car" });
  }
});

// DELETE CAR
router.delete("/:id", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM cars WHERE id = ?",
      [req.params.id]
    );

    res.json({ message: "Car deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: "Failed to delete car" });
  }
});

module.exports = router;