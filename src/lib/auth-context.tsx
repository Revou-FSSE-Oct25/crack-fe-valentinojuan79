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
  province?: string;
  city?: string;
  specialities?: string;
  id_number?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as AuthUser;
        setToken(storedToken);
        setUser(parsedUser);
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
      }
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

    const { access_token, user: u } = json as { access_token: string; user: AuthUser };

    localStorage.setItem("access_token", access_token);
    localStorage.setItem("user", JSON.stringify(u));
    setCookie("access_token", access_token);
    setCookie("user_role", u.role);

    setToken(access_token);
    setUser(u);
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
    deleteCookie("access_token");
    deleteCookie("user_role");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
