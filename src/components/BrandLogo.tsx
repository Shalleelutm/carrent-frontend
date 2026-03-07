import { motion } from "framer-motion";

export default function BrandLogo() {
  return (
    <motion.div
      className="flex items-center gap-3 cursor-pointer"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.img
        src="/logo38.png"
        alt="AM Thirty Eight"
        className="h-12 w-auto rounded-md shadow-lg border border-red-200"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        whileHover={{ scale: 1.05 }}
      />

      <div className="leading-tight">
        <div className="text-lg font-bold text-blue-700">
          AM Thirty Eight
        </div>
        <div className="text-xs text-teal-600">
          Rent a car
        </div>
      </div>
    </motion.div>
  );
}