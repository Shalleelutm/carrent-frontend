import { convertFromMUR, formatMoney, Currency } from "./currency";

export interface AddOn {
  key: string;
  priceMUR: number;
}

export interface QuoteResult {
  days: number;
  subtotal: number;
  discount: number;
  deposit: number;
  payNow: number;
  payAtPickup: number;
}

function daysBetweenISO(startISO: string, endISO: string): number {
  const start = new Date(startISO).getTime();
  const end = new Date(endISO).getTime();

  if (isNaN(start) || isNaN(end)) return 1;

  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return Math.max(diff, 1);
}

function discountRateForDays(days: number): number {
  if (days >= 14) return 0.15;
  if (days >= 7) return 0.1;
  if (days >= 3) return 0.05;
  return 0;
}

function depositForSubtotal(subtotalMUR: number): number {
  return subtotalMUR * 0.2;
}

export function calculateQuote(params: {
  dailyRate: number;
  startDate: string;
  endDate: string;
  selectedAddOns?: Record<string, boolean>;
  addOnsList?: AddOn[];
}): QuoteResult {
  const {
    dailyRate,
    startDate,
    endDate,
    selectedAddOns = {},
    addOnsList = [],
  } = params;

  const days = daysBetweenISO(startDate, endDate);

  let subtotal = dailyRate * days;

  for (const addOn of addOnsList) {
    if (selectedAddOns[addOn.key]) {
      subtotal += addOn.priceMUR;
    }
  }

  const discountRate = discountRateForDays(days);
  const discount = subtotal * discountRate;
  const finalSubtotal = subtotal - discount;

  const deposit = depositForSubtotal(finalSubtotal);

  return {
    days,
    subtotal: finalSubtotal,
    discount,
    deposit,
    payNow: deposit,
    payAtPickup: finalSubtotal - deposit,
  };
}

export function money(amountMUR: number, currency: Currency = "MUR"): string {
  const converted = convertFromMUR(amountMUR, currency);
  return formatMoney(converted, currency);
}