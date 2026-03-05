import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function StatsCard({
  label,
  value,
  icon,
  hint,
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  hint?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.22 }}
      className="rounded-3xl border border-black/10 bg-white/90 p-4 shadow-sm backdrop-blur min-w-[150px]"
      title={hint}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-black/55 font-semibold">{label}</div>
        {icon ? (
          <div className="h-9 w-9 rounded-2xl bg-black/[0.04] grid place-items-center text-black/70">
            {icon}
          </div>
        ) : null}
      </div>

      <div className="mt-2 text-2xl font-black tracking-tight">{value}</div>

      {hint ? (
        <div className="mt-1 text-[11px] text-black/45 leading-snug">
          {hint}
        </div>
      ) : null}
    </motion.div>
  );
}