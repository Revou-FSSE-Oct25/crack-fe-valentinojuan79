"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NO_FOOTER_PAGES = ["/login", "/register"];

export const Footer: React.FC = () => {
  const pathname = usePathname();

  if (NO_FOOTER_PAGES.some((p) => pathname === p)) return null;

  return (
    <footer className="bg-[#1A1410] text-white pt-20 pb-10 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          <div className="md:col-span-5 space-y-5">
            <Link href="/" className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#B07D3E] flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white" />
              </span>
              <span className="text-[17px] font-semibold tracking-tight">Solvio</span>
            </Link>
            <p className="text-[14px] text-white/50 leading-relaxed max-w-xs font-light">
              Solusi perawatan dan perbaikan rumah yang mudah, terpercaya, dan terjangkau untuk seluruh keluarga Indonesia.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="text-[10px] uppercase tracking-[0.12em] text-white/30 font-semibold mb-5">Layanan</p>
            <div className="flex flex-col gap-3">
              {["Servis AC", "Kelistrikan", "Perawatan Rumah", "Perpipaan"].map((item) => (
                <Link key={item} href="/services" className="text-[14px] text-white/60 hover:text-white transition-colors duration-200">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div className="md:col-span-4">
            <p className="text-[10px] uppercase tracking-[0.12em] text-white/30 font-semibold mb-5">Tautan</p>
            <div className="flex flex-col gap-3">
              <Link href="/about" className="text-[14px] text-white/60 hover:text-white transition-colors duration-200">Tentang Kami</Link>
              <Link href="/services" className="text-[14px] text-white/60 hover:text-white transition-colors duration-200">Semua Layanan</Link>
              <Link href="/register" className="text-[14px] text-white/60 hover:text-white transition-colors duration-200">Daftar sebagai Teknisi</Link>
              <span className="text-[14px] text-white/60">hello@solvio.id</span>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-[11px] text-white/25 tracking-widest uppercase">© 2026 Solvio Technologies.</p>
          <div className="flex gap-6">
            {["Privasi", "Ketentuan", "Cookie"].map((item) => (
              <span key={item} className="text-[11px] text-white/25 hover:text-white/50 cursor-pointer transition-colors tracking-widest uppercase">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
