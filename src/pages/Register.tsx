import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Chrome, Facebook, Loader2, ShieldCheck, Mail, Lock } from "lucide-react";
import { oauthLogin } from "../lib/auth";
import { useAuth } from "../lib/auth-context";

export default function Register() {
  const { register, isAuthed } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("User786");
  const [confirm, setConfirm] = useState("User786");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // If already logged in, leave register page
  useEffect(() => {
    if (isAuthed) window.location.href = "/";
  }, [isAuthed]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!email || !password) return setErr("Email and password required");
    if (password.length < 6) return setErr("Password must be at least 6 characters");
    if (password !== confirm) return setErr("Passwords do not match");

    try {
      setLoading(true);
      await register(email, password);

      // After register, go HOME (not login page)
      window.location.href = "/";
    } catch (e: any) {
      setErr(e?.message || "Register failed");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-[#0057ff]/10 via-white to-[#e52939]/10 px-4 relative overflow-hidden">
      {/* safe WOW: glow orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-red-500/20 blur-[120px] rounded-full animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative w-full max-w-[460px] rounded-3xl border border-black/10 bg-white/95 p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="flex items-center gap-2 text-sm font-bold text-[#0057ff] tracking-wide">
          <ShieldCheck className="h-4 w-4" />
          Secure Registration
        </div>

        <div className="mt-2 text-3xl font-black text-black">Create account</div>
        <div className="mt-2 text-black/60 text-sm">
          Create your customer account and start booking instantly.
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="relative">
            <Mail className="h-4 w-4 text-black/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded-xl p-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="relative">
            <Lock className="h-4 w-4 text-black/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded-xl p-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div className="relative">
            <Lock className="h-4 w-4 text-black/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full border rounded-xl p-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          {err && <div className="text-red-600 text-sm font-semibold">{err}</div>}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={loading}
            type="submit"
            className="w-full bg-black text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating…
              </>
            ) : (
              "Register & Continue"
            )}
          </motion.button>
        </form>

        <div className="my-6 text-center text-xs text-black/50">OR continue with</div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => oauthLogin("google")}
          className="w-full rounded-xl py-3 font-semibold bg-white border shadow-sm"
          type="button"
        >
          <span className="flex items-center justify-center gap-2">
            <Chrome className="h-5 w-5" />
            Google
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => oauthLogin("facebook")}
          className="w-full rounded-xl py-3 mt-3 font-semibold bg-blue-600 text-white shadow-md"
          type="button"
        >
          <span className="flex items-center justify-center gap-2">
            <Facebook className="h-5 w-5" />
            Facebook
          </span>
        </motion.button>

        <div className="mt-6 text-center">
          <a className="text-sm font-semibold hover:underline" href="/login">
            Already have an account? Login
          </a>
        </div>
      </motion.div>
    </div>
  );
}