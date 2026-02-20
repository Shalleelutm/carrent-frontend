import { BadgeCheck, ShieldCheck, Star, Zap } from "lucide-react";

function Chip({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/85 p-4 shadow-sm backdrop-blur">
      <div className="flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-black text-white">
          {icon}
        </div>
        <div className="leading-tight">
          <div className="font-black text-black">{title}</div>
          <div className="text-xs text-black/60">{desc}</div>
        </div>
      </div>
    </div>
  );
}

export default function AwardsStrip() {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-3 md:grid-cols-4">
          <Chip icon={<Star className="h-4 w-4" />} title="Top Rated" desc="5★ customer satisfaction" />
          <Chip icon={<ShieldCheck className="h-4 w-4" />} title="Trusted" desc="Local + verified fleet" />
          <Chip icon={<Zap className="h-4 w-4" />} title="Fast Handover" desc="Airport delivery in minutes" />
          <Chip icon={<BadgeCheck className="h-4 w-4" />} title="Transparent" desc="Clear totals, no surprises" />
        </div>
      </div>
    </section>
  );
}