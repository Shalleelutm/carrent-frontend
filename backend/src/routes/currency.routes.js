const express = require("express");
const { fetchRates } = require("../services/currency.service");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const rates = await fetchRates();

    res.json({
      base: "MUR",
      rates,
    });
  } catch (err) {
    console.error("CURRENCY ERROR:", err);
    res.status(500).json({ error: "Failed to fetch exchange rates" });
  }
});

module.exports = router;