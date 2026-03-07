const axios = require("axios");

let ratesCache = null;
let lastFetch = 0;

const BASE = "MUR";

async function fetchRates() {
  const now = Date.now();

  if (ratesCache && now - lastFetch < 60 * 60 * 1000) {
    return ratesCache;
  }

  const res = await axios.get(
    "https://api.exchangerate.host/latest?base=MUR&symbols=USD,EUR,GBP,JPY"
  );

  ratesCache = res.data.rates;
  lastFetch = now;

  return ratesCache;
}

async function convert(amount, currency) {
  if (currency === "MUR") return amount;

  const rates = await fetchRates();

  const rate = rates[currency];

  if (!rate) return amount;

  return Number(amount) * rate;
}

module.exports = {
  fetchRates,
  convert,
};