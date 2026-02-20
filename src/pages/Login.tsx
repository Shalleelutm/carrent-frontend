import { motion } from "framer-motion";
import { oauthLogin } from "../lib/auth";
import { Chrome } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-r from-[#0057ff]/10 via-white to-[#e52939]/10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] rounded-3xl border border-black/10 bg-white/85 p-8 shadow-sm backdrop-blur"
      >
        <div className="text-sm font-black text-[#0057ff]">Secure Login</div>
        <div className="mt-2 text-3xl font-black text-black">Welcome back</div>
        <div className="mt-2 text-black/60">
          OAuth2 is ready. Backend will finalize it.
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => oauthLogin("google")}
          className="mt-6 w-full rounded-2xl py-4 font-black text-black overflow-hidden relative"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-[#0057ff] via-white to-[#e52939] animate-[gradientMove_4s_linear_infinite]" />
          <span className="relative z-10 inline-flex items-center justify-center gap-2">
            <Chrome className="h-5 w-5" />
            Continue with Google
          </span>
        </motion.button>

        <div className="mt-4 text-xs text-black/55">
          If backend is not connected yet, this will redirect and fail — that’s normal.
        </div>
      </motion.div>
    </div>
  );
}