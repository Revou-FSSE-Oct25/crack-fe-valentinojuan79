"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

const SOLID_NAV_PAGES = [
  "/login", "/register", "/profile", "/dashboard",
  "/admin", "/technician", "/bookings", "/services", "/about",
];

// Pages where navbar+footer should be hidden (auth pages)
const NO_SHELL_PAGES = ["/login", "/register"];

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isNoShell = NO_SHELL_PAGES.some((p) => pathname === p);
  const isSolidPage = SOLID_NAV_PAGES.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const isSolid = scrolled || isSolidPage;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide navbar on auth pages — they have their own layout
  if (isNoShell) return null;

  function handleLogout() {
    logout();
    router.push("/");
  }

  function getDashboardHref() {
    if (!user) return "/login";
    if (user.role === "ADMIN") return "/admin";
    if (user.role === "TECHNICIAN") return "/technician";
    return "/dashboard";
  }

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isSolid
          ? "bg-white/95 backdrop-blur-md border-b border-[#EDE9E4] shadow-[0_1px_12px_rgb(26,20,16,0.06)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 h-[72px] flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/logo.svg" alt="Solvio Logo" width={60} height={60} className="group-hover:scale-110 transition-transform duration-200" /> 
            <span className="text-[17px] font-semibold tracking-[-0.02em] text-[#1A1410]">Solvio</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/services"
              className="text-[13px] font-medium text-[#7A6E64] hover:text-[#1A1410] transition-colors duration-200 tracking-wide"
            >
              Layanan
            </Link>
            <Link
              href="/about"
              className="text-[13px] font-medium text-[#7A6E64] hover:text-[#1A1410] transition-colors duration-200 tracking-wide"
            >
              Tentang
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                href={getDashboardHref()}
                className="hidden sm:block px-4 py-2 text-[13px] font-medium text-[#3D342D] hover:text-[#1A1410] transition-colors"
              >
                {user.role === "ADMIN" ? "Admin Panel" : user.role === "TECHNICIAN" ? "Tugas Saya" : "Dashboard"}
              </Link>
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-[#F0EDE9] transition-colors">
                  <div className="w-7 h-7 rounded-full bg-[#1A1410] flex items-center justify-center text-white text-[11px] font-semibold">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-[13px] font-medium text-[#1A1410] max-w-[100px] truncate">
                    {user.full_name.split(" ")[0]}
                  </span>
                </button>
                <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-[#EDE9E4] rounded-xl shadow-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link href={getDashboardHref()} className="block px-4 py-3 text-[13px] text-[#3D342D] hover:bg-[#F8F6F3]">
                    Dashboard
                  </Link>
                  <Link href="/profile" className="block px-4 py-3 text-[13px] text-[#3D342D] hover:bg-[#F8F6F3] border-t border-[#EDE9E4]">
                    Edit Profil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-[13px] text-red-600 hover:bg-red-50 border-t border-[#EDE9E4]"
                  >
                    Keluar
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 text-[13px] font-medium text-[#3D342D] hover:text-[#1A1410] transition-colors">
                Masuk
              </Link>
              <Link href="/register">
                <button className="px-5 py-2.5 text-[13px] font-semibold bg-[#1A1410] text-white rounded-full hover:bg-[#B07D3E] transition-all duration-300">
                  Daftar
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
