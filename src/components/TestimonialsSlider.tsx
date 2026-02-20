import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { Testimonial } from "../lib/types";

function Stars({ n }: { n: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < n ? "text-yellow-500" : "text-black/15"}`}
          fill={i < n ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}

export default function TestimonialsSlider({ items }: { items: Testimonial[] }) {
  return (
    <section className="py-14 bg-black/[0.02]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-sm font-black text-[#0057ff]">Reviews</div>
            <h2 className="mt-2 text-3xl md:text-4xl font-black text-black">
              Tourists love how smooth AM38 feels.
            </h2>
            <p className="mt-2 text-black/60 max-w-2xl">
              Real feedback, conversion-focused: fast delivery, clean cars, zero surprises.
            </p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden">
          <motion.div
            className="flex gap-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          >
            {[...items, ...items].map((t, idx) => (
              <div
                key={`${t.id}-${idx}`}
                className="min-w-[300px] md:min-w-[380px] rounded-3xl border border-black/10 bg-white p-6 shadow-sm"
              >
                <Stars n={t.rating} />
                <div className="mt-3 text-black/80">{t.text}</div>
                <div className="mt-4 font-black text-black">{t.name}</div>
                <div className="text-xs text-black/60">{t.country}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}