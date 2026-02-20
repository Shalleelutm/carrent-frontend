import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function WhatsAppFab() {
  const phone = "2300000000"; // TODO: replace with your business number
  const text = encodeURIComponent("Hi AM Thirty Eight 👋 I want to book a car in Mauritius.");
  const url = `https://wa.me/${phone}?text=${text}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-[60] inline-flex items-center gap-2 rounded-full px-5 py-3 font-black text-white shadow-lg"
      style={{
        background:
          "linear-gradient(90deg, rgba(0,87,255,1), rgba(255,255,255,0.85), rgba(229,41,57,1))",
      }}
      animate={{
        boxShadow: [
          "0 0 0px rgba(0,87,255,0.4)",
          "0 0 30px rgba(0,87,255,0.65)",
          "0 0 0px rgba(0,87,255,0.4)",
        ],
      }}
      transition={{ duration: 2.2, repeat: Infinity }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      aria-label="WhatsApp Support"
      title="WhatsApp Support"
    >
      <MessageCircle className="h-5 w-5" />
      WhatsApp
    </motion.a>
  );
}