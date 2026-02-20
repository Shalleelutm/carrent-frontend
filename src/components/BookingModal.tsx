import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin, ArrowRight } from "lucide-react";

type CarLite = {
  id?: string;
  name?: string;
  pricePerDay?: number;
};

export default function BookingModal({
  open,
  onClose,
  car,
}: {
  open: boolean;
  onClose: () => void;
  car: CarLite | null;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* dialog */}
          <motion.div
            className="relative w-full max-w-xl rounded-[28px] bg-white shadow-2xl border border-black/10 overflow-hidden"
            initial={{ y: 20, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 20, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* top accent */}
            <div className="h-2 w-full bg-gradient-to-r from-brand.blue via-white to-brand.red" />

            <div className="p-6 md:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-black text-brand.blue">
                    Checkout
                  </div>
                  <div className="mt-1 text-2xl font-black text-brand.ink">
                    {car?.name ?? "Confirm booking"}
                  </div>
                  <div className="mt-1 text-sm text-black/60">
                    Fast, secure, and transparent totals.
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="rounded-xl border border-black/10 p-2 hover:bg-black/5 transition"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 grid gap-3">
                <LabeledField label="Pick-up location" icon={<MapPin className="h-4 w-4" />}>
                  <input
                    className="w-full bg-transparent outline-none text-sm"
                    placeholder="SSR Airport, Mahebourg..."
                  />
                </LabeledField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <LabeledField label="Pick-up date" icon={<Calendar className="h-4 w-4" />}>
                    <input className="w-full bg-transparent outline-none text-sm" type="date" />
                  </LabeledField>
                  <LabeledField label="Return date" icon={<Calendar className="h-4 w-4" />}>
                    <input className="w-full bg-transparent outline-none text-sm" type="date" />
                  </LabeledField>
                </div>

                <div className="mt-2 rounded-2xl border border-black/10 bg-black/[0.02] p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-black/60">Estimated price/day</span>
                    <span className="font-black text-brand.ink">
                      Rs {car?.pricePerDay ?? "—"}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-black/50">
                    Final total calculated after dates + options.
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-4 font-black text-white shadow-glowRed bg-brand.red hover:brightness-110 transition"
                  onClick={() => {
                    alert("Phase 2: connect to backend checkout session.");
                    onClose();
                  }}
                >
                  Confirm & Continue <ArrowRight className="h-5 w-5" />
                </motion.button>

                <div className="text-center text-xs text-black/55">
                  Payment-ready design (Stripe / Checkout Session in Phase 2)
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function LabeledField({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[11px] font-semibold text-black/55">{label}</div>
        <div className="text-brand.blue">{icon}</div>
      </div>
      <div className="mt-1">{children}</div>
    </div>
  );
}