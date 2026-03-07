import type { Place } from "../lib/types";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function MauritiusPlacesGrid({ items }: { items: Place[] }) {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="text-sm font-black text-[#e52939]">Explore Mauritius</div>
            <h2 className="mt-2 text-3xl md:text-4xl font-black text-black">
              Popular places — perfect for your itinerary.
            </h2>
            <p className="mt-2 text-black/60 max-w-2xl">
              Build trust with travel value: beaches, hikes, culture, and “how far from airport”.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <motion.div
              key={p.id}
              whileHover={{ y: -6 }}
              className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 text-sm font-black text-[#0057ff]">
                <MapPin className="h-4 w-4" />
                {p.region} • ~{p.minsFromAirport} min from SSR
              </div>

              <div className="mt-3 text-xl font-black text-black">{p.name}</div>
              <div className="mt-1 text-black/60">{p.highlight}</div>

              <div className="mt-5 rounded-2xl bg-black/5 p-4 text-sm text-black/70">
                Pro tip: book delivery to your hotel and start your trip immediately.
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}