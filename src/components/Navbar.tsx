"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-[#EDE9E4] shadow-[0_1px_12px_rgb(26,20,16,0.06)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-12">
          <a href="/" className="flex items-center gap-2 group">
            <span className="w-7 h-7 rounded-full bg-[#1A1410] flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B07D3E]" />
            </span>
            <span className="text-[17px] font-semibold tracking-[-0.02em] text-[#1A1410]">Solvio</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {["Layanan", "Standar", "Tentang"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-[13px] font-medium text-[#7A6E64] hover:text-[#1A1410] transition-colors duration-200 tracking-wide"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link href="/login" className="px-4 py-2 text-[13px] font-medium text-[#3D342D] hover:text-[#1A1410] transition-colors">
            Masuk
          </Link>
          <Link href="/register">
          <button className="px-5 py-2.5 text-[13px] font-semibold bg-[#1A1410] text-white rounded-full hover:bg-[#B07D3E] transition-all duration-300">
            Mulai
          </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
