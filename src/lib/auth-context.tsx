"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type UserRole = "CUSTOMER" | "ADMIN" | "TECHNICIAN";

export interface AuthUser {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  phone_number?: string;
  address?: string;
  city?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  full_name: string;
  email: string;
  password: string;
  role?: "CUSTOMER" | "TECHNICIAN";
  phone_number?: string;
  city?: string;
  specialities?: string;
  id_number?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Login gagal");

    // BE returns: { message, access_token, user }
    localStorage.setItem("access_token", json.access_token);
    localStorage.setItem("user", JSON.stringify(json.user));
    setToken(json.access_token);
    setUser(json.user);
  }

  async function register(data: RegisterData) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Registrasi gagal");
  }

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus digunakan di dalam AuthProvider");
  return ctx;
}
