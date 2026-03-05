import { cn } from "@/lib/utils";

type Status = "pending" | "confirmed" | "cancelled" | "completed";

export default function StatusBadge({ status }: { status: Status | string }) {
  const s = String(status).toLowerCase() as Status;

  const styles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    confirmed: "bg-emerald-100 text-emerald-800 border-emerald-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
    completed: "bg-slate-100 text-slate-800 border-slate-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
        "relative z-10 whitespace-nowrap",
        styles[s] || "bg-slate-100 text-slate-800 border-slate-200"
      )}
    >
      <span className="h-2 w-2 rounded-full bg-current opacity-60" />
      {s}
    </span>
  );
}