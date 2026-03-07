import { useCurrency } from "../lib/currency-context";

export default function CurrencySelect() {
  const { currency, setCurrency } = useCurrency();

  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value as any)}
      className="rounded-full border border-black/10 bg-white px-3 py-1 text-sm font-semibold"
    >
      <option value="MUR">MUR</option>
      <option value="EUR">EUR</option>
      <option value="USD">USD</option>
    </select>
  );
}