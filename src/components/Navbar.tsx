import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, LogOut, User as UserIcon } from "lucide-react";
import CurrencySelect from "./CurrencySelect";
import { useAuth } from "../lib/auth-context";

function cx(...cls: Array<string | false | null | undefined>) {
  return cls.filter(Boolean).join(" ");
}

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const role = user?.role;
  const displayName = user?.email || "Guest";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-black/60 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-4">

        {/* BRAND */}
        <Link to="/" className="flex items-center gap-3">

          <motion.img
            src="/logo38.png"
            alt="AM Thirty Eight"
            className="h-12 rounded-lg border border-white/20 shadow-lg"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            whileHover={{ scale: 1.05 }}
          />

          <div className="leading-tight">
            <div className="text-white font-black text-sm">
              AM Thirty Eight
            </div>
            <div className="text-white/70 text-[11px] -mt-0.5">
              Instant booking • Airport delivery
            </div>
          </div>
        </Link>

        {/* NAV */}
        <nav className="hidden md:flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-2 py-1">
          <NavItem to="/">Home</NavItem>
          <NavItem to="/cars">Cars</NavItem>
          <NavItem to="/explore">Explore</NavItem>
          <NavItem to="/my-bookings">My Bookings</NavItem>
          <NavItem to="/support">Support</NavItem>

          {(role === "admin" || role === "staff") && (
            <NavItem to="/admin">Admin</NavItem>
          )}
        </nav>

        {/* RIGHT */}
        <div className="flex items-center gap-2">

          <CurrencySelect />

          <div className="hidden md:flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3 py-2 text-white">
            <UserIcon className="h-4 w-4 text-white/80" />
            <div className="flex flex-col leading-none">
              <span className="text-sm font-black">{displayName}</span>
              <span className="text-[11px] text-white/60">
                {role ? role.toUpperCase() : "GUEST"}
              </span>
            </div>
          </div>

          {!user ? (
            <>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/login")}
                className="rounded-full bg-white/10 border border-white/10 px-4 py-2 text-white font-black"
              >
                <LogIn className="h-4 w-4 inline mr-2" />
                Login
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/register")}
                className="rounded-full px-4 py-2 font-black text-black bg-white"
              >
                Register
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => logout()}
              className="rounded-full bg-white/10 border border-white/10 px-4 py-2 text-white font-black"
            >
              <LogOut className="h-4 w-4 inline mr-2" />
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
          isActive
            ? "bg-white text-black"
            : "text-white/85 hover:bg-white/10"
        )
      }
    >
      {children}
    </NavLink>
  );
}