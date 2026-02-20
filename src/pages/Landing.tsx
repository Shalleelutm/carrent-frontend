import React, { useMemo, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  MapPin,
  ShieldCheck,
  Star,
  Zap,
  Sparkles,
  BadgeCheck,
  Activity,
  Users,
  Plane,
  Timer,
  Gift,
  Globe,
  HeartHandshake,
  Percent,
  Car,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type BookingForm = {
  location: string;
  pickupDate: string;
  returnDate: string;
};

function cx(...cls: Array<string | false | null | undefined>) {
  return cls.filter(Boolean).join(" ");
}

type Testimonial = {
  name: string;
  country: string;
  rating: number;
  quote: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Rayan",
    country: "France",
    rating: 5,
    quote: "Booked in under a minute. WhatsApp support was instant. Smooth handover at SSR.",
  },
  {
    name: "Amelia",
    country: "UK",
    rating: 5,
    quote: "Clear pricing, clean car, and pickup was exactly on time. Very professional.",
  },
  {
    name: "Nadia",
    country: "UAE",
    rating: 5,
    quote: "Loved the transparency and the airport delivery. Perfect for family travel.",
  },
  {
    name: "Kévin",
    country: "Belgium",
    rating: 5,
    quote: "Fast checkout style. No queue. Felt like a premium service.",
  },
];

const PLACES = [
  { title: "Le Morne", tag: "Beach & sunset", desc: "Iconic views + calm drives." },
  { title: "Chamarel", tag: "7 Colored Earth", desc: "Scenic curves + waterfalls." },
  { title: "Grand Baie", tag: "Nightlife", desc: "Restaurants + marina vibes." },
  { title: "Trou aux Cerfs", tag: "Crater", desc: "Quick stop + fresh air." },
  { title: "Port Louis", tag: "Capital", desc: "Market + waterfront." },
  { title: "Île aux Cerfs", tag: "Day trip", desc: "Lagoon + boat activities." },
];

export default function Landing() {
  const navigate = useNavigate();

  const [showTransfer, setShowTransfer] = useState(false);
  const [form, setForm] = useState<BookingForm>({
    location: "",
    pickupDate: "",
    returnDate: "",
  });

  const canSearch = useMemo(() => {
    return Boolean(form.location && form.pickupDate && form.returnDate);
  }, [form]);

  // tilt micro-interaction
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(my, { stiffness: 120, damping: 20 });
  const ry = useSpring(mx, { stiffness: 120, damping: 20 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    mx.set((dx / rect.width) * 10);
    my.set((-dy / rect.height) * 10);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  // small live activity (safe mock)
  const live = useMemo(() => {
    const viewers = 3 + Math.floor(Math.random() * 5);
    const mins = 6 + Math.floor(Math.random() * 18);
    const handover = 6 + Math.floor(Math.random() * 6);
    return {
      viewers,
      mins,
      handover,
    };
  }, []);

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-r from-brand.blue/10 via-white to-brand.red/10">
        {/* French split + glow + grid */}
        <div className="absolute inset-0">
          {/* split columns */}
          <div className="absolute inset-0 grid grid-cols-12">
            <div className="col-span-4 bg-brand.blue/[0.10]" />
            <div className="col-span-4 bg-white" />
            <div className="col-span-4 bg-brand.red/[0.10]" />
          </div>

          {/* soft grid overlay */}
          <div className="absolute inset-0 opacity-[0.22] bg-[linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[size:44px_44px]" />

          {/* animated glows */}
          <motion.div
            className="absolute -top-56 -left-56 h-[650px] w-[650px] rounded-full bg-brand.blue/30 blur-3xl"
            animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-60 -right-60 h-[720px] w-[720px] rounded-full bg-brand.red/25 blur-3xl"
            animate={{ x: [0, -45, 0], y: [0, -28, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,87,255,0.18),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(229,41,57,0.16),transparent_45%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pt-14 pb-10 md:pt-20 md:pb-16">
          <div className="grid gap-10 md:grid-cols-12 items-center">
            {/* LEFT */}
            <div className="md:col-span-6">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/75 px-3 py-1 text-sm text-black/70 backdrop-blur"
              >
                <Sparkles className="h-4 w-4 text-brand.blue" />
                <span>Premium booking • Airport delivery • No queues</span>
              </motion.div>

              {/* REPLACED H1 (your requested style) */}
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.05 }}
                className="mt-6 text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight"
              >
                <span className="text-brand.blue drop-shadow-lg">Book in 30 seconds</span>
                <br />
                <span className="bg-gradient-to-r from-brand.blue via-black to-brand.red bg-clip-text text-transparent">
                  Drive Mauritius with confidence.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.12 }}
                className="mt-4 text-lg text-black/65 max-w-xl"
              >
                Clear totals. No hidden fees. You land, walk out, and your car is waiting — with optional delivery, add-ons, and WhatsApp support.
              </motion.p>

              {/* CTA row */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.18 }}
                className="mt-7 flex flex-wrap items-center gap-3"
              >
               {/* BIG animated Book Now - FINAL PREMIUM VERSION */}
<motion.button
  whileHover={{ scale: 1.08 }}
  whileTap={{ scale: 0.95 }}
  animate={{ y: [0, -4, 0] }}
  transition={{ duration: 2.5, repeat: Infinity }}
  onClick={() => navigate("/cars")}
  className="relative inline-flex items-center gap-3 rounded-full px-10 py-4 font-black text-white text-xl overflow-hidden group shadow-[0_20px_60px_rgba(0,87,255,0.4)]"
>
  {/* animated french gradient */}
  <span className="absolute inset-0 bg-gradient-to-r from-[#0057FF] via-white to-[#E52939] animate-[gradientMove_4s_linear_infinite]" />

  {/* dark overlay that fades on hover */}
  <span className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition duration-500" />

  {/* moving shine sweep */}
  <span className="absolute -left-40 top-0 h-full w-32 rotate-12 bg-white/30 blur-lg opacity-0 group-hover:opacity-100 transition duration-700" />

  <span className="relative z-10 flex items-center gap-2 tracking-wide">
    🚀 BOOK NOW <ArrowRight className="h-6 w-6" />
  </span>
</motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowTransfer(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-6 py-3 font-extrabold text-brand.ink hover:bg-white transition backdrop-blur"
                >
                  Request transfer <HeartHandshake className="h-4 w-4 text-brand.red" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/cars")}
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-6 py-3 font-extrabold text-brand.ink hover:bg-white transition backdrop-blur"
                >
                  View fleet <Zap className="h-4 w-4 text-brand.red" />
                </motion.button>
              </motion.div>

              {/* Trust chips */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.24 }}
                className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4"
              >
                <TrustChip icon={<ShieldCheck className="h-4 w-4" />} text="Secure payments" />
                <TrustChip icon={<Star className="h-4 w-4" />} text="Top rated" />
                <TrustChip icon={<BadgeCheck className="h-4 w-4" />} text="Trusted local" />
                <TrustChip icon={<MapPin className="h-4 w-4" />} text="Airport delivery" />
              </motion.div>

              {/* Conversion panels (fills whitespace, aligned to booking) */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.28 }}
                className="mt-6 grid gap-3 sm:grid-cols-2"
              >
                <div className="rounded-3xl border border-black/10 bg-white/85 p-4 backdrop-blur">
                  <div className="text-sm font-black text-brand.ink">Why AM38</div>
                  <div className="mt-3 grid gap-2 text-sm text-black/65">
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="h-4 w-4 text-brand.blue" />
                      <span className="font-semibold text-black/75">No deposit</span>{" "}
                      <span className="text-black/55">(selected cars)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-brand.red" />
                      <span className="font-semibold text-black/75">24/7 WhatsApp support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Plane className="h-4 w-4 text-brand.blue" />
                      <span className="font-semibold text-black/75">Airport delivery included</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-brand.red" />
                      <span className="font-semibold text-black/75">EN/FR friendly</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-black/10 bg-white/85 p-4 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-black text-brand.ink">Live activity</div>
                    <div className="text-xs font-semibold text-black/45">Today</div>
                  </div>

                  <div className="mt-3 grid gap-2 text-sm text-black/65">
                    <div className="flex items-center justify-between rounded-2xl border border-black/10 bg-white px-3 py-2">
                      <span className="inline-flex items-center gap-2">
                        <Users className="h-4 w-4 text-brand.blue" />
                        {live.viewers} people viewing SUVs now
                      </span>
                      <span className="rounded-full bg-brand.red/10 px-2 py-1 text-xs font-bold text-brand.red">
                        High demand
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-black/10 bg-white px-3 py-2">
                      <span className="inline-flex items-center gap-2">
                        <Timer className="h-4 w-4 text-brand.red" />
                        Last booking: {live.mins} minutes ago
                      </span>
                      <span className="rounded-full bg-brand.blue/10 px-2 py-1 text-xs font-bold text-brand.blue">
                        SSR Airport
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-black/10 bg-white px-3 py-2">
                      <span className="inline-flex items-center gap-2">
                        <Zap className="h-4 w-4 text-brand.blue" />
                        Average handover
                      </span>
                      <span className="rounded-full bg-black/5 px-2 py-1 text-xs font-bold text-black/70">
                        {live.handover} min
                      </span>
                    </div>
                  </div>

                  {/* Quick actions tiles */}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <QuickAction
                      icon={<Car className="h-4 w-4 text-brand.blue" />}
                      title="Browse SUVs"
                      desc="Family + road trips"
                      onClick={() => navigate("/cars")}
                    />
                    <QuickAction
                      icon={<Percent className="h-4 w-4 text-brand.red" />}
                      title="Long-term deals"
                      desc="7+ day discounts"
                      onClick={() => navigate("/cars")}
                    />
                    <QuickAction
                      icon={<Plane className="h-4 w-4 text-brand.blue" />}
                      title="Airport pickup"
                      desc="SSR handover"
                      onClick={() => navigate("/support")}
                    />
                    <QuickAction
                      icon={<Gift className="h-4 w-4 text-brand.red" />}
                      title="Trip contest"
                      desc="Win discounts"
                      onClick={() => navigate("/explore")}
                    />
                  </div>
                </div>
              </motion.div>

              <div className="mt-4 text-xs text-black/55">
                <span className="font-semibold text-brand.red">Hot:</span> Limited airport slots today — book early.
              </div>
            </div>

            {/* RIGHT */}
            <div className="md:col-span-6">
              <div id="booking" className="h-1" />
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.08 }}
                className="relative"
                onMouseMove={onMove}
                onMouseLeave={onLeave}
                style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" as const }}
              >
                <motion.div
                  className="absolute inset-0 rounded-[30px] bg-gradient-to-br from-brand.blue/25 via-white to-brand.red/15 blur-xl"
                  animate={{ opacity: [0.55, 0.9, 0.55] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* BOOKING CARD GLOW BLUE (your requested class) */}
                <div
                  className="relative rounded-[30px] border border-brand.blue/30 bg-white/90 p-7 shadow-[0_25px_60px_rgba(0,87,255,0.25)] backdrop-blur-xl"
                  style={{ transform: "translateZ(20px)" }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-extrabold text-brand.blue">Booking Engine</div>
                      <h2 className="mt-1 text-2xl font-black text-brand.ink">Reserve Your Vehicle</h2>
                      <p className="mt-1 text-sm text-black/60">Transparent pricing • No counter queues</p>
                    </div>
                    <div className="hidden sm:flex flex-col items-end text-xs text-black/55">
                      <span className="font-semibold">Designed for conversion</span>
                      <span>Fast checkout style</span>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3">
                    <Field
                      icon={<MapPin className="h-4 w-4" />}
                      placeholder="Pick-up Location (e.g., SSR Airport)"
                      value={form.location}
                      onChange={(v) => setForm((s) => ({ ...s, location: v }))}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Field
                        icon={<Calendar className="h-4 w-4" />}
                        type="date"
                        value={form.pickupDate}
                        onChange={(v) => setForm((s) => ({ ...s, pickupDate: v }))}
                      />
                      <Field
                        icon={<Calendar className="h-4 w-4" />}
                        type="date"
                        value={form.returnDate}
                        onChange={(v) => setForm((s) => ({ ...s, returnDate: v }))}
                      />
                    </div>

                    <motion.button
                      whileHover={canSearch ? { scale: 1.01 } : {}}
                      whileTap={canSearch ? { scale: 0.99 } : {}}
                      disabled={!canSearch}
                      className={cx(
                        "mt-2 inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-4 font-black text-white transition",
                        canSearch
                          ? "bg-brand.red hover:brightness-110 shadow-[0_18px_55px_rgba(229,41,57,0.28)]"
                          : "bg-black/30 cursor-not-allowed"
                      )}
                      onClick={() => navigate("/cars")}
                    >
                      Search Available Cars <ArrowRight className="h-5 w-5" />
                    </motion.button>

                    <div className="text-center text-xs text-black/55">
                      Guest booking allowed • Instant confirmation • Secure payment
                    </div>

                    {/* “Live booking activity” strip (your requested strip under booking card) */}
                    <div className="mt-2 rounded-2xl border border-black/10 bg-white/90 px-3 py-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-black/60">
                        <span className="inline-flex items-center gap-2 font-semibold">
                          <Users className="h-4 w-4 text-brand.blue" />
                          {live.viewers} people viewing SUVs now
                        </span>
                        <span className="inline-flex items-center gap-2 font-semibold">
                          <Timer className="h-4 w-4 text-brand.red" />
                          Last booking: {live.mins} min ago (SSR)
                        </span>
                        <span className="inline-flex items-center gap-2 font-semibold">
                          <Zap className="h-4 w-4 text-brand.blue" />
                          Avg handover: {live.handover} min
                        </span>
                      </div>
                    </div>

                    {/* small tiles aligned to booking */}
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <MiniTile
                        icon={<Gift className="h-4 w-4 text-brand.red" />}
                        title="Trip Contest"
                        desc="Upload your trip photo later — win discounts."
                      />
                      <MiniTile
                        icon={<HeartHandshake className="h-4 w-4 text-brand.blue" />}
                        title="Add-ons Ready"
                        desc="Flowers, child seat, extra driver — coming next."
                      />
                    </div>

                    <button
                      onClick={() => setShowTransfer(true)}
                      className="mt-1 w-full rounded-2xl border border-black/10 bg-white py-3 font-black text-brand.blue hover:bg-brand.blue hover:text-white transition"
                    >
                      Need Airport Transfer? (Click)
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* PAGE BACKGROUND FADE (blue -> white -> light blue as you scroll) */}
      <div className="bg-gradient-to-b from-brand.blue/[0.06] via-white to-brand.blue/[0.04]">
        {/* TRANSFER */}
        <section className="py-14">
          <div className="mx-auto max-w-7xl px-4">
            <div className="rounded-3xl border border-black/10 bg-white p-6 md:p-10 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black text-brand.ink">Need a Private Transfer Instead?</h3>
                  <p className="mt-1 text-black/60">Airport to hotel with transparent KM pricing.</p>
                </div>

                <button
                  onClick={() => setShowTransfer((s) => !s)}
                  className="rounded-full border border-black/10 bg-white px-6 py-3 font-black text-brand.blue hover:bg-brand.blue hover:text-white transition"
                >
                  {showTransfer ? "Hide Transfer" : "Request Transfer"}
                </button>
              </div>

              {showTransfer && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-6 grid gap-3 md:grid-cols-3"
                >
                  <input placeholder="Pickup Location" className="w-full rounded-2xl border border-black/10 px-4 py-3" />
                  <input placeholder="Dropoff Location" className="w-full rounded-2xl border border-black/10 px-4 py-3" />
                  <button className="w-full rounded-2xl bg-brand.blue text-white py-3 font-black hover:brightness-110 transition">
                    Calculate Price
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* EXPLORE PLACES */}
        <section className="py-14">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-xs font-black text-brand.blue">Explore</div>
                <h3 className="mt-2 text-3xl font-black text-brand.ink">Great places to visit in Mauritius</h3>
                <p className="mt-1 text-black/60">
                  We’ll later connect this to itinerary + add-ons (boat, tours, hotels) after backend.
                </p>
              </div>

              <button
                onClick={() => navigate("/cars")}
                className="hidden sm:inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 font-black text-brand.ink hover:bg-white transition"
              >
                Browse cars <ArrowRight className="h-4 w-4 text-brand.red" />
              </button>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {PLACES.map((p) => (
                <motion.div
                  key={p.title}
                  whileHover={{ y: -4 }}
                  className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm hover:shadow-[0_18px_55px_rgba(0,87,255,0.14)] transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-black text-brand.ink">{p.title}</div>
                      <div className="mt-1 text-black/60 text-sm">{p.desc}</div>
                    </div>
                    <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-bold text-black/60">
                      {p.tag}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate("/support")}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-black text-brand.ink hover:bg-white transition"
                  >
                    Ask support <HeartHandshake className="h-4 w-4 text-brand.red" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* REVIEWS slider */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-xs font-black text-brand.blue">Reviews</div>
            <h3 className="mt-2 text-3xl font-black text-brand.ink">Tourists love how smooth AM38 feels.</h3>
            <p className="mt-1 text-black/60">
              Quick booking, clear totals, fast airport handover — designed for conversion.
            </p>

            <div className="mt-6 overflow-hidden rounded-3xl border border-black/10 bg-white">
              <motion.div
                className="flex gap-3 p-4"
                animate={{ x: [0, -520, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
              >
                {[...TESTIMONIALS, ...TESTIMONIALS].map((t, idx) => (
                  <div
                    key={`${t.name}-${idx}`}
                    className="min-w-[280px] max-w-[280px] rounded-2xl border border-black/10 bg-white p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-black text-brand.ink">{t.name}</div>
                      <div className="text-xs text-black/50">{t.country}</div>
                    </div>
                    <div className="mt-2 text-xs font-bold text-black/70">
                      {"★".repeat(t.rating)} <span className="text-black/40">(5.0)</span>
                    </div>
                    <div className="mt-2 text-sm text-black/65">“{t.quote}”</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function TrustChip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white/75 px-3 py-2 text-sm text-black/70 backdrop-blur">
      <span className="text-brand.blue">{icon}</span>
      <span className="font-semibold">{text}</span>
    </div>
  );
}

function Field({
  icon,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  icon: React.ReactNode;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-3">
      <span className="text-brand.blue">{icon}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent outline-none text-sm"
      />
    </div>
  );
}

function MiniTile({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-3">
      <div className="flex items-center gap-2 text-sm font-black text-brand.ink">
        {icon} {title}
      </div>
      <div className="mt-1 text-xs text-black/55">{desc}</div>
    </div>
  );
}

function QuickAction({
  icon,
  title,
  desc,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl border border-black/10 bg-white px-3 py-3 text-left hover:shadow-[0_18px_55px_rgba(0,87,255,0.12)] transition"
    >
      <div className="flex items-center gap-2 text-sm font-black text-brand.ink">
        {icon} {title}
      </div>
      <div className="mt-1 text-xs text-black/55">{desc}</div>
    </button>
  );
}