import React, { createContext, useContext, useState } from "react";

type User = {
  email: string;
  role?: "admin" | "staff" | "user";
};

type AuthContextType = {
  user: User | null;
  login: (u: User) => void;
  logout: () => void;
  role?: "admin" | "staff" | "user";
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  function login(u: User) {
    setUser(u);
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, role: user?.role }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      user: null,
      login: () => {},
      logout: () => {},
      role: "user" as const,
    };
  }
  return ctx;
}