import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/auth-context";

type Role = "admin" | "staff" | "user";

export default function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: Role;
}) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  const currentRole: Role = (user as any)?.role ?? "user";

  if (role && currentRole !== role) return <Navigate to="/" replace />;

  return <>{children}</>;
}