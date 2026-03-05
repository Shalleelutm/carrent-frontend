import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getToken, setToken, clearToken } from "./storage";
import { loginUser, registerUser } from "./api";

type Role = "admin" | "staff" | "user";

export type User = {
  id: number;
  email: string;
  role: Role;
};

type AuthContextType = {
  user: User | null;
  isAuthed: boolean;
  loginWithPassword: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthed: false,
  loginWithPassword: async () => {},
  register: async () => {},
  logout: () => {},
});

function decodeJwt(token: string): User | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: Number(payload.id),
      email: String(payload.email),
      role: (payload.role ?? "user") as Role,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // hydrate from token on refresh
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const u = decodeJwt(token);
    if (!u) {
      clearToken();
      setUser(null);
      return;
    }
    setUser(u);
  }, []);

  const loginWithPassword = async (email: string, password: string) => {
    const res = await loginUser(email, password); // expects { token }
    if (!res?.token) throw new Error("Login failed: token missing");
    setToken(res.token);

    const u = decodeJwt(res.token);
    if (!u) {
      clearToken();
      throw new Error("Login failed: invalid token");
    }
    setUser(u);
  };

  const register = async (email: string, password: string) => {
    const res = await registerUser(email, password); // expects { token }
    if (!res?.token) throw new Error("Register failed: token missing");
    setToken(res.token);

    const u = decodeJwt(res.token);
    if (!u) {
      clearToken();
      throw new Error("Register failed: invalid token");
    }
    setUser(u);
  };

  const logout = () => {
    clearToken();
    setUser(null);
    window.location.href = "/login";
  };

  const value = useMemo(
    () => ({
      user,
      isAuthed: !!user,
      loginWithPassword,
      register,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}