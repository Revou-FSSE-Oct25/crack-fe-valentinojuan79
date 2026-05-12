"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button, Input, Checkbox } from "@/components/ui";

type Role = "pelanggan" | "teknisi";

const STEPS = ["Jenis Akun", "Data Diri", "Keamanan"];

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<Role>("pelanggan");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agree, setAgree] = useState(false);

  const [form, setForm] = useState({
    name: "", phone: "", email: "",
    city: "", password: "", confirmPassword: "",
    // teknisi only
    skill: "", experience: "",
  });

  function next(e: React.FormEvent) {
    e.preventDefault();
    if (step < STEPS.length - 1) { setStep(step + 1); return; }
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1800);
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  const EyeIcon = ({ crossed }: { crossed?: boolean }) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M1.333 8S3.333 3.333 8 3.333 14.667 8 14.667 8 12.667 12.667 8 12.667 1.333 8 1.333 8z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="8" cy="8" r="1.667" stroke="currentColor" strokeWidth="1.3"/>
      {crossed && <path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>}
    </svg>
  );

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-[50%] bg-stone-900 flex-col justify-between p-14 relative overflow-hidden">
        <div className="absolute -top-20 right-[-80px] w-[420px] h-[420px] rounded-full bg-[#B07D3E] opacity-[0.07] blur-[90px] pointer-events-none" />
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
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#B07D3E] font-semibold mb-5">Bergabung dengan Solvio</p>
            <h2 className="text-[clamp(2rem,3.2vw,2.8rem)] font-normal text-white leading-[1.1]">
              Mulai perjalanan<br />
              <span className="italic text-[#E4CFA8]">bersama kami.</span>
            </h2>
            <p className="mt-5 text-[15px] text-white/40 font-light leading-relaxed max-w-sm">
              Daftar sebagai pelanggan untuk memesan servis rumah, atau daftar sebagai teknisi untuk mulai melayani.
            </p>
          </div>

          {/* Benefits list */}
          <div className="space-y-4">
            {[
              { icon: "✓", text: "Pemesanan servis dalam hitungan menit" },
              { icon: "✓", text: "Teknisi terverifikasi & berpengalaman" },
              { icon: "✓", text: "Harga transparan, tanpa biaya tersembunyi" },
              { icon: "✓", text: "Laporan kunjungan digital di akun Anda" },
            ].map((b, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#B07D3E]/20 border border-[#B07D3E]/30 flex items-center justify-center text-[#B07D3E] text-[11px] font-bold shrink-0 mt-0.5">
                  {b.icon}
                </span>
                <span className="text-[14px] text-white/50 font-light leading-snug">{b.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8">
          <p className="text-[14px] text-white/35 font-light italic leading-relaxed">
            "Daftar teknisi di Solvio mudah dan cepat. Sekarang saya sudah punya banyak pelanggan tetap."
          </p>
          <p className="text-[12px] text-white/25 mt-3 font-medium">— Budi S., Teknisi AC Solvio</p>
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

        <div className="w-full max-w-[440px] mx-auto lg:mx-0">

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-[clamp(1.8rem,3vw,2.2rem)] font-normal text-[#1A1410] leading-tight mb-2">
              Buat Akun Baru
            </h1>
            <p className="text-[14px] text-[#7A6E64] font-light">
              Sudah punya akun?{" "}
              <Link href="/auth/login" className="text-[#B07D3E] font-medium hover:underline underline-offset-4">
                Masuk di sini
              </Link>
            </p>
          </div>

          {/* Step indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold transition-all duration-300 ${
                    i < step
                      ? "bg-[#1A1410] text-white"
                      : i === step
                      ? "bg-[#B07D3E] text-white"
                      : "bg-[#EDE9E4] text-[#C2B9AF]"
                  }`}>
                    {i < step ? (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : i + 1}
                  </div>
                  <span className={`text-[12px] font-medium ${i === step ? "text-[#1A1410]" : "text-[#C2B9AF]"}`}>
                    {s}
                  </span>
                  {i < STEPS.length - 1 && (
                    <div className={`w-8 h-px mx-2 transition-all duration-300 ${i < step ? "bg-[#1A1410]" : "bg-[#EDE9E4]"}`} />
                  )}
                </div>
              ))}
            </div>
            {/* Progress bar */}
            <div className="h-1 bg-[#EDE9E4] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#B07D3E] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <form onSubmit={next} className="space-y-5">

            {/* ── Step 0: Jenis Akun ── */}
            {step === 0 && (
              <div className="space-y-5 animate-fade-up">
                <p className="text-[13px] text-[#7A6E64] font-light">Pilih jenis akun yang ingin Anda buat:</p>
                <div className="grid grid-cols-2 gap-4">
                  {([
                    {
                      id: "pelanggan" as Role,
                      label: "Pelanggan",
                      desc: "Saya ingin memesan layanan servis rumah",
                      icon: (
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                          <rect x="4" y="14" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.6"/>
                          <path d="M2 14L14 4l12 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                          <rect x="10" y="18" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.4"/>
                        </svg>
                      ),
                    },
                    {
                      id: "teknisi" as Role,
                      label: "Teknisi",
                      desc: "Saya ingin menawarkan layanan servis",
                      icon: (
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                          <path d="M18 6a4 4 0 0 1-1.172 7.656L8 22.5l-3-.5-.5-3 8.844-8.828A4 4 0 0 1 18 6z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="18" cy="10" r="1.5" fill="currentColor"/>
                        </svg>
                      ),
                    },
                  ] as const).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setRole(opt.id)}
                      className={`flex flex-col items-start gap-3 p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                        role === opt.id
                          ? "border-[#1A1410] bg-[#1A1410] text-white"
                          : "border-[#EDE9E4] bg-white text-[#1A1410] hover:border-[#C2B9AF]"
                      }`}
                    >
                      <span className={role === opt.id ? "text-[#E4CFA8]" : "text-[#B07D3E]"}>{opt.icon}</span>
                      <div>
                        <p className="text-[15px] font-semibold">{opt.label}</p>
                        <p className={`text-[12px] mt-1 font-light leading-snug ${role === opt.id ? "text-white/55" : "text-[#7A6E64]"}`}>
                          {opt.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 1: Data Diri ── */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-up">
                <Input
                  label="Nama Lengkap"
                  type="text"
                  placeholder="Nama sesuai KTP"
                  fullWidth
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  leftIcon={
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="5.333" r="2.667" stroke="currentColor" strokeWidth="1.3"/>
                      <path d="M1.333 14c0-3.314 2.985-6 6.667-6s6.667 2.686 6.667 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  }
                  required
                />
                <Input
                  label="Nomor HP"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  fullWidth
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  leftIcon={
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="4" y="1.333" width="8" height="13.334" rx="1.333" stroke="currentColor" strokeWidth="1.3"/>
                      <circle cx="8" cy="12" r="0.667" fill="currentColor"/>
                    </svg>
                  }
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="nama@email.com"
                  fullWidth
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  leftIcon={
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M1.333 4A1.333 1.333 0 0 1 2.667 2.667h10.666A1.333 1.333 0 0 1 14.667 4v8a1.333 1.333 0 0 1-1.334 1.333H2.667A1.333 1.333 0 0 1 1.333 12V4z" stroke="currentColor" strokeWidth="1.3"/>
                      <path d="M1.333 4l6.667 4.667L14.667 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  }
                  required
                />
                <Input
                  label="Kota"
                  type="text"
                  placeholder="Contoh: Yogyakarta"
                  fullWidth
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  leftIcon={
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1.333A4.667 4.667 0 0 1 12.667 6c0 3.5-4.667 8.667-4.667 8.667S3.333 9.5 3.333 6A4.667 4.667 0 0 1 8 1.333z" stroke="currentColor" strokeWidth="1.3"/>
                      <circle cx="8" cy="6" r="1.667" stroke="currentColor" strokeWidth="1.3"/>
                    </svg>
                  }
                  required
                />

                {/* Extra fields for teknisi */}
                {role === "teknisi" && (
                  <>
                    <Input
                      label="Keahlian Utama"
                      type="text"
                      placeholder="Contoh: Servis AC, Instalasi Listrik"
                      fullWidth
                      value={form.skill}
                      onChange={(e) => setForm({ ...form, skill: e.target.value })}
                      leftIcon={
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M12 3a2.667 2.667 0 0 1-.781 5.104L5.333 14l-2-.333L3 11.667l5.896-5.886A2.667 2.667 0 0 1 12 3z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="5" r="1" fill="currentColor"/>
                        </svg>
                      }
                      hint="Pisahkan dengan koma jika lebih dari satu"
                      required
                    />
                    <Input
                      label="Pengalaman Kerja"
                      type="text"
                      placeholder="Contoh: 3 tahun"
                      fullWidth
                      value={form.experience}
                      onChange={(e) => setForm({ ...form, experience: e.target.value })}
                      leftIcon={
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <rect x="1.333" y="4" width="13.334" height="10.667" rx="1.333" stroke="currentColor" strokeWidth="1.3"/>
                          <path d="M5.333 4V2.667a.667.667 0 0 1 .667-.667h4a.667.667 0 0 1 .667.667V4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                          <path d="M8 8v2.667M6 9.333h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                        </svg>
                      }
                      required
                    />
                  </>
                )}
              </div>
            )}

            {/* ── Step 2: Keamanan ── */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-up">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 karakter"
                  fullWidth
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  leftIcon={
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="2.667" y="7.333" width="10.666" height="7.334" rx="1.333" stroke="currentColor" strokeWidth="1.3"/>
                      <path d="M5.333 7.333V5.333a2.667 2.667 0 0 1 5.334 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  }
                  rightIcon={<EyeIcon crossed={showPassword} />}
                  onRightIconClick={() => setShowPassword(!showPassword)}
                  hint="Gunakan huruf besar, angka, dan simbol"
                  required
                />

                {/* Password strength */}
                {form.password.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex gap-1.5">
                      {[
                        form.password.length >= 8,
                        /[A-Z]/.test(form.password),
                        /[0-9]/.test(form.password),
                        /[^A-Za-z0-9]/.test(form.password),
                      ].map((met, i) => (
                        <div
                          key={i}
                          className={`flex-1 h-1 rounded-full transition-all duration-300 ${met ? "bg-[#B07D3E]" : "bg-[#EDE9E4]"}`}
                        />
                      ))}
                    </div>
                    <p className="text-[11px] text-[#C2B9AF]">
                      {(() => {
                        const s = [
                          form.password.length >= 8,
                          /[A-Z]/.test(form.password),
                          /[0-9]/.test(form.password),
                          /[^A-Za-z0-9]/.test(form.password),
                        ].filter(Boolean).length;
                        return s <= 1 ? "Lemah" : s === 2 ? "Cukup" : s === 3 ? "Baik" : "Kuat";
                      })()}
                    </p>
                  </div>
                )}

                <Input
                  label="Konfirmasi Password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Ulangi password Anda"
                  fullWidth
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  leftIcon={
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="2.667" y="7.333" width="10.666" height="7.334" rx="1.333" stroke="currentColor" strokeWidth="1.3"/>
                      <path d="M5.333 7.333V5.333a2.667 2.667 0 0 1 5.334 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  }
                  rightIcon={<EyeIcon crossed={showConfirm} />}
                  onRightIconClick={() => setShowConfirm(!showConfirm)}
                  error={
                    form.confirmPassword.length > 0 && form.password !== form.confirmPassword
                      ? "Password tidak cocok"
                      : undefined
                  }
                  required
                />

                <div className="pt-1">
                  <Checkbox
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    label={
                      <span>
                        Saya setuju dengan{" "}
                        <Link href="/ketentuan" className="text-[#B07D3E] font-medium hover:underline underline-offset-2">
                          Ketentuan Layanan
                        </Link>{" "}
                        dan{" "}
                        <Link href="/privasi" className="text-[#B07D3E] font-medium hover:underline underline-offset-2">
                          Kebijakan Privasi
                        </Link>{" "}
                        Solvio
                      </span>
                    }
                    required
                  />
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className={`flex gap-3 pt-2 ${step > 0 ? "flex-row" : ""}`}>
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3.5 border border-[#DDD7CF] text-[#3D342D] text-[14px] font-medium rounded-full hover:border-[#1A1410] transition-all duration-200"
                >
                  ← Kembali
                </button>
              )}
              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={isLoading}
                disabled={step === 2 && (!agree || form.password !== form.confirmPassword)}
              >
                {isLoading
                  ? "Membuat akun…"
                  : step < STEPS.length - 1
                  ? "Lanjut →"
                  : "Buat Akun"}
              </Button>
            </div>
          </form>

          {/* Footer note */}
          <p className="mt-6 text-[12px] text-[#C2B9AF] text-center leading-relaxed">
            Sudah punya akun?{" "}
            <Link href="/auth/login" className="text-[#B07D3E] font-medium hover:underline underline-offset-2">
              Masuk sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
