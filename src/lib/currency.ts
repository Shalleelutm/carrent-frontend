export type Currency = "MUR" | "EUR" | "USD" | "GBP" | "ZAR";

const DEMO_RATES: Record<Currency, number> = {
  MUR: 1,
  EUR: 0.02,
  USD: 0.022,
  GBP: 0.018,
  ZAR: 0.42,
};

export function formatMoney(amount: number, currency: Currency = "MUR"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function convertFromMUR(
  amountMUR: number,
  toCurrency: Currency
): number {
  const rate = DEMO_RATES[toCurrency] ?? 1;
  return amountMUR * rate;
}