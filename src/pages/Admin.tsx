import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Car,
  BarChart3,
  Headset,
  PlugZap,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function Admin() {
  const nav = useNavigate();

  return (
    <div className="min-h-[70vh]">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black text-white p-8">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(0,87,255,0.6),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(229,41,57,0.5),transparent_45%)]" />
        <div className="absolute inset-0 opacity-[0.18] bg-[linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.18)_1px,transparent_1px)] bg-[size:46px_46px]" />

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-black"
          >
            <Sparkles className="h-4 w-4" />
            Admin Ops • Reservations • Fleet • Channels • Tickets
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="mt-5 text-4xl md:text-5xl font-black"
          >
            Command Center
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mt-2 text-white/70 max-w-2xl"
          >
            One screen to control the business. Everything here is connected to your MySQL bookings table and updates live.
          </motion.p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Action
              icon={<CalendarDays className="h-5 w-5" />}
              title="Reservations Board"
              desc="Search + filters + confirm/reject + celebrate."
              onClick={() => nav("/admin/reservations")}
              primary
            />
            <Action
              icon={<Car className="h-5 w-5" />}
              title="Fleet Manager"
              desc="Coming next: add cars, pricing, disable, maintenance."
              onClick={() => alert("Next step: Fleet Manager screen")}
            />
            <Action
              icon={<PlugZap className="h-5 w-5" />}
              title="Partners / Channels"
              desc="Coming next: DiscoverCars / CarJet / Rentiles menu."
              onClick={() => alert("Next step: Channel Manager screen")}
            />
            <Action
              icon={<Headset className="h-5 w-5" />}
              title="Support Tickets"
              desc="Coming next: customers open tickets, staff reply."
              onClick={() => alert("Next step: Tickets screen")}
            />
            <Action
              icon={<BarChart3 className="h-5 w-5" />}
              title="Reports"
              desc="Coming next: revenue + occupancy + peak hours."
              onClick={() => alert("Next step: Reports screen")}
            />
            <Action
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Security"
              desc="Role-based access for admin/staff only."
              onClick={() => alert("Already supported via JWT role")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Action({
  icon,
  title,
  desc,
  onClick,
  primary,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <motion.button
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={[
        "text-left rounded-2xl border p-5 transition",
        primary
          ? "border-white/15 bg-white text-black shadow-[0_22px_70px_rgba(0,87,255,0.35)]"
          : "border-white/10 bg-white/5 text-white hover:bg-white/10",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <div
          className={[
            "h-10 w-10 rounded-2xl grid place-items-center",
            primary ? "bg-black text-white" : "bg-white/10 text-white",
          ].join(" ")}
        >
          {icon}
        </div>
        <div className="font-black text-lg">{title}</div>
      </div>
      <div className={primary ? "mt-3 text-black/70" : "mt-3 text-white/70"}>
        {desc}
      </div>
      <div className={primary ? "mt-4 font-black text-black" : "mt-4 font-black text-white"}>
        Open →
      </div>
    </motion.button>
  );
}