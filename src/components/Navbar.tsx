import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, LogOut, User as UserIcon } from "lucide-react";
import CurrencySelect from "./CurrencySelect";
import { useAuth } from "../lib/auth-context";

type Role = "admin" | "staff" | "user";
type SafeUser = {
  id?: string;
  email?: string;
  role?: Role;
  name?: string;
  fullName?: string;
  displayName?: string;
};

function cx(...cls: Array<string | false | null | undefined>) {
  return cls.filter(Boolean).join(" ");
}

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const u = (user ?? undefined) as unknown as SafeUser | undefined;
  const role: Role | undefined = u?.role;
  const displayName =
    u?.name || u?.fullName || u?.displayName || u?.email || "Guest";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-black/60 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-brand.blue via-white to-brand.red grid place-items-center border border-white/20">
            <div className="h-6 w-6 rounded-full bg-black/80 grid place-items-center">
              <span className="text-white text-xs font-black">38</span>
            </div>
          </div>
          <div className="leading-tight">
            <div className="text-white font-black text-sm">AM Thirty Eight</div>
            <div className="text-white/70 text-[11px] -mt-0.5">
              Instant booking • Airport delivery
            </div>
          </div>
        </Link>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-2 py-1">
          <NavItem to="/">Home</NavItem>
          <NavItem to="/cars">Cars</NavItem>
          <NavItem to="/explore">Explore</NavItem>
          <NavItem to="/my-bookings">My Bookings</NavItem>
          <NavItem to="/support">Support</NavItem>

          {/* ✅ FIX 1: role is lower-case union: admin/staff/user */}
          {(role === "admin" || role === "staff") && (
            <NavItem to="/admin">Admin</NavItem>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Currency */}
          <div className="hidden sm:block">
            <CurrencySelect />
          </div>

          {/* User chip */}
          <div className="hidden md:flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3 py-2 text-white">
            <UserIcon className="h-4 w-4 text-white/80" />
            <div className="flex flex-col leading-none">
              {/* ✅ FIX 2: user.name may not exist on your User type */}
              <span className="text-sm font-black">{displayName}</span>
              <span className="text-[11px] text-white/60">
                {role ? role.toUpperCase() : "GUEST"}
              </span>
            </div>
          </div>

          {/* Auth buttons */}
          {!user ? (
            <>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/login")}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-2 text-white font-black hover:bg-white/15 transition"
              >
                <LogIn className="h-4 w-4" />
                Log in
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/register")}
                className="relative overflow-hidden inline-flex items-center gap-2 rounded-full px-4 py-2 font-black text-black"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-brand.blue via-white to-brand.red animate-[gradientMove_4s_linear_infinite]" />
                <span className="relative z-10">Register</span>
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => logout()}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-2 text-white font-black hover:bg-white/15 transition"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </motion.button>
          )}
        </div>
      </div>
    </header>
  );
}

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cx(
          "rounded-full px-4 py-2 text-sm font-black transition",
          isActive ? "bg-white text-black" : "text-white/85 hover:bg-white/10"
        )
      }
    >
      {children}
    </NavLink>
  );
}