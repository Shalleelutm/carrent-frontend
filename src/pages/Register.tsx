export default function Register() {
  return (
    <div className="min-h-screen bg-[#060A10] text-white">
      <div className="mx-auto max-w-md px-4 py-12">
        <h2 className="text-3xl font-black">Register</h2>
        <p className="text-white/70 mt-2">
          Next phase: customer profile + documents upload (license/passport).
        </p>

        <div className="mt-6 grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-6">
          <input
            className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-3 text-white placeholder:text-white/30 outline-none"
            placeholder="Full name"
          />
          <input
            className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-3 text-white placeholder:text-white/30 outline-none"
            placeholder="Email"
          />
          <input
            className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-3 text-white placeholder:text-white/30 outline-none"
            placeholder="Phone (optional)"
          />
          <input
            type="password"
            className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-3 text-white placeholder:text-white/30 outline-none"
            placeholder="Password"
          />

          <button className="mt-1 w-full px-5 py-3 rounded-2xl font-black text-black bg-gradient-to-r from-sky-400 to-emerald-400 hover:brightness-110 transition">
            Create account
          </button>

          <div className="text-xs text-white/60">
            By registering you agree to the rental terms and provide accurate
            details for safe trips.
          </div>
        </div>
      </div>
    </div>
  );
}