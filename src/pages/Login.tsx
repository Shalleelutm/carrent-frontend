import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Chrome, Facebook, Loader2 } from "lucide-react";
import { loginUser } from "../lib/api";
import { setToken, getToken } from "../lib/storage";

function getOauthBase() {
  const raw = import.meta.env.VITE_API_URL || "http://localhost:4000";
  return raw.replace(/\/api\/?$/, "");
}

const OAUTH_BASE = getOauthBase();

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) window.location.href = "/my-bookings";
  }, []);

  const handleLogin = async () => {

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {

      setLoading(true);

      const res = await loginUser(email, password);

      setToken(res.token);

      window.location.href = "/my-bookings";

    } catch (err: any) {

      alert(err?.message || "Invalid credentials");

      setLoading(false);

    }

  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-[#0057ff]/10 via-white to-[#e52939]/10 px-4 relative overflow-hidden">

      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-red-500/20 blur-[120px] rounded-full animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-[420px] rounded-3xl border border-black/10 bg-white/95 p-8 shadow-2xl backdrop-blur-xl"
      >

        <div className="text-sm font-bold text-[#0057ff] tracking-wide">
          Secure Login
        </div>

        <div className="mt-2 text-2xl font-bold">
          Welcome back
        </div>

        <div className="mt-6 space-y-4">

          {/* EMAIL INPUT */}
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD INPUT */}
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </motion.button>

        </div>

        <div className="my-6 text-center text-sm text-gray-500">
          OR
        </div>

        <div className="space-y-3">

          <a
            href={`${OAUTH_BASE}/api/auth/google`}
            className="w-full rounded-xl py-3 font-semibold bg-white border shadow-sm flex items-center justify-center gap-2 hover:shadow-md transition"
          >
            <Chrome className="h-5 w-5" />
            Continue with Google
          </a>

          <a
            href={`${OAUTH_BASE}/api/auth/facebook`}
            className="w-full rounded-xl py-3 font-semibold bg-blue-600 text-white shadow-md flex items-center justify-center gap-2 hover:bg-blue-700 transition"
          >
            <Facebook className="h-5 w-5" />
            Continue with Facebook
          </a>

        </div>

      </motion.div>

    </div>
  );
}