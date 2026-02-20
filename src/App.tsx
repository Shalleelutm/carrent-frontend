import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import PageLoader from "./components/PageLoader";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Cars from "./pages/Cars";
import Login from "./pages/Login";
import OAuthCallback from "./pages/OAuthCallback";
import MyBookings from "./pages/MyBookings";
import Support from "./pages/Support";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <PageLoader />}

      <Navbar />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/login" element={<Login />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        <Route path="/support" element={<Support />} />
      </Routes>
    </>
  );
}