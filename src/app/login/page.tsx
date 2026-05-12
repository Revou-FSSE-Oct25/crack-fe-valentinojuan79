"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button, Input, Checkbox } from "@/components/ui";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", remember: false });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1800);
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel — decorative ── */}
      <div className="hidden lg:flex lg:w-[50%] bg-[#1A1410] flex-col justify-between p-14 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-[-80px] right-[-80px] w-[420px] h-[420px] rounded-full bg-[#B07D3E] opacity-[0.07] blur-[90px] pointer-events-none" />
        <div className="absolute bottom-[-60px] left-[-60px] w-[320px] h-[320px] rounded-full bg-[#B07D3E] opacity-[0.05] blur-[70px] pointer-events-none" />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 w-fit">
          <span className="w-7 h-7 rounded-full bg-[#B07D3E] flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-white" />
          </span>
          <span className="text-[18px] font-semibold tracking-[-0.02em] text-white">Solvio</span>
        </Link>

        {/* Center content */}
        <div className="space-y-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#B07D3E] font-semibold mb-5">Selamat Datang Kembali</p>
            <h2 className="text-[clamp(2rem,3.2vw,2.8rem)] font-normal text-white leading-[1.1]">
              Rumah Anda<br />
              <span className="italic text-[#E4CFA8]">menunggu perawatan.</span>
            </h2>
            <p className="mt-5 text-[15px] text-white/40 font-light leading-relaxed max-w-sm">
              Masuk untuk mengelola jadwal servis, melihat laporan kunjungan, dan menghubungi teknisi Anda.
            </p>
          </div>

          {/* Decorative stats */}
          <div className="grid grid-cols-2 gap-5">
            {[
              { val: "2.400+", label: "Pelanggan Aktif" },
              { val: "98%", label: "Kepuasan Pelanggan" },
              { val: "150+", label: "Teknisi Terlatih" },
              { val: "< 2 jam", label: "Rata-rata Respon" },
            ].map((s) => (
              <div key={s.label} className="bg-white/[0.04] border border-white/[0.07] rounded-2xl px-5 py-4">
                <p className="text-[22px] font-normal text-white font-display">{s.val}</p>
                <p className="text-[11px] text-white/35 mt-1 tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="border-t border-white/10 pt-8">
          <p className="text-[14px] text-white/35 font-light italic leading-relaxed">
            "AC saya sudah bersih kembali, teknisinya datang tepat waktu dan ramah."
          </p>
          <p className="text-[12px] text-white/25 mt-3 font-medium">— Siska A., Pelanggan Solvio</p>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-14 lg:px-20 py-16 bg-[#FDFCFB]">
        {/* Mobile logo */}
        <div className="lg:hidden mb-10">
          <Link href="/" className="flex items-center gap-2.5 w-fit">
            <span className="w-7 h-7 rounded-full bg-[#1A1410] flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B07D3E]" />
            </span>
            <span className="text-[18px] font-semibold tracking-[-0.02em] text-[#1A1410]">Solvio</span>
          </Link>
        </div>

        <div className="w-full max-w-[420px] mx-auto lg:mx-0">

          {/* Heading */}
          <div className="mb-9">
            <h1 className="text-[clamp(1.8rem,3vw,2.2rem)] font-normal text-[#1A1410] leading-tight mb-2">
              Masuk ke Akun
            </h1>
            <p className="text-[14px] text-[#7A6E64] font-light">
              Belum punya akun?{" "}
              <Link href="/auth/register" className="text-[#B07D3E] font-medium hover:underline underline-offset-4">
                Daftar sekarang
              </Link>
            </p>
          </div>

          {/* Google OAuth button */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 px-5 border border-[#DDD7CF] rounded-xl bg-white text-[14px] font-medium text-[#3D342D] hover:border-[#C2B9AF] hover:bg-[#FDFCFB] transition-all duration-200 mb-7"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Lanjutkan dengan Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-7">
            <div className="flex-1 h-px bg-[#EDE9E4]" />
            <span className="text-[12px] text-[#C2B9AF] font-medium">atau masuk dengan email</span>
            <div className="flex-1 h-px bg-[#EDE9E4]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="nama@email.com"
              fullWidth
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              leftIcon={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M1.333 4A1.333 1.333 0 0 1 2.667 2.667h10.666A1.333 1.333 0 0 1 14.667 4v8a1.333 1.333 0 0 1-1.334 1.333H2.667A1.333 1.333 0 0 1 1.333 12V4z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1.333 4l6.667 4.667L14.667 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
              required
            />

            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password"
              fullWidth
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              leftIcon={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2.667" y="7.333" width="10.666" height="7.334" rx="1.333" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M5.333 7.333V5.333a2.667 2.667 0 0 1 5.334 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              }
              rightIcon={
                showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M1.333 8S3.333 3.333 8 3.333 14.667 8 14.667 8 12.667 12.667 8 12.667 1.333 8 1.333 8z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="8" cy="8" r="1.667" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M1.333 8S3.333 3.333 8 3.333 14.667 8 14.667 8 12.667 12.667 8 12.667 1.333 8 1.333 8z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="8" cy="8" r="1.667" stroke="currentColor" strokeWidth="1.3"/>
                  </svg>
                )
              }
              onRightIconClick={() => setShowPassword(!showPassword)}
              required
            />

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between pt-1">
              <Checkbox
                label="Ingat saya"
                checked={form.remember}
                onChange={(e) => setForm({ ...form, remember: e.target.checked })}
              />
              <Link href="/auth/forgot-password" className="text-[13px] text-[#B07D3E] font-medium hover:underline underline-offset-4">
                Lupa password?
              </Link>
            </div>

            <div className="pt-2">
              <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
                {isLoading ? "Memproses…" : "Masuk"}
              </Button>
            </div>
          </form>

          {/* Footer note */}
          <p className="mt-8 text-[12px] text-[#C2B9AF] text-center leading-relaxed">
            Dengan masuk, Anda menyetujui{" "}
            <Link href="/ketentuan" className="underline underline-offset-2 hover:text-[#7A6E64]">Ketentuan Layanan</Link>
            {" "}dan{" "}
            <Link href="/privasi" className="underline underline-offset-2 hover:text-[#7A6E64]">Kebijakan Privasi</Link>{" "}kami.
          </p>
        </div>
      </div>
    </div>
  );
}
