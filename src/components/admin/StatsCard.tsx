import React from "react";
import { motion } from "framer-motion";

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-2xl border bg-white shadow-sm p-5 flex items-start gap-4"
    >
      <div className="h-12 w-12 rounded-2xl bg-black text-white flex items-center justify-center">
        {icon}
      </div>

      <div className="flex-1">
        <div className="text-xs font-semibold text-black/60">{title}</div>
        <div className="text-2xl font-black">{value}</div>
        {subtitle ? <div className="text-xs text-black/50 mt-1">{subtitle}</div> : null}
      </div>
    </motion.div>
  );
}