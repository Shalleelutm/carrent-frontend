import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";

import Landing from "./pages/Landing";
import Cars from "./pages/Cars";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBookings from "./pages/MyBookings";

import Admin from "./pages/Admin";
import AdminReservations from "./pages/AdminReservations";

import Support from "./pages/Support";
import AdminTickets from "./pages/AdminTickets";

import OAuthSuccess from "./pages/OAuthSuccess";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>

        {/* PUBLIC */}
        <Route path="/" element={<Landing />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* OAUTH */}
        <Route path="/oauth-success" element={<OAuthSuccess />} />

        {/* CUSTOMER */}
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/support" element={<Support />} />

        {/* ADMIN */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/reservations" element={<AdminReservations />} />
        <Route path="/admin/tickets" element={<AdminTickets />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Route>
    </Routes>
  );
}