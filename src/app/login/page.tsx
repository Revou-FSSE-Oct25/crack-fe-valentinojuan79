"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, Checkbox } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";
import { Suspense } from "react";

const STATS = [
  { val: "2.400+", label: "Pelanggan Aktif" },
  { val: "98%", label: "Kepuasan Pelanggan" },
  { val: "150+", label: "Teknisi Terlatih" },
  { val: "< 2 jam", label: "Rata-rata Respon" },
];

const EyeIcon = ({ crossed }: { crossed?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M1.333 8S3.333 3.333 8 3.333 14.667 8 14.667 8 12.667 12.667 8 12.667 1.333 8 1.333 8z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8" cy="8" r="1.667" stroke="currentColor" strokeWidth="1.3"/>
    {crossed && <path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>}
  </svg>
);

const EmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M1.333 4A1.333 1.333 0 0 1 2.667 2.667h10.666A1.333 1.333 0 0 1 14.667 4v8a1.333 1.333 0 0 1-1.334 1.333H2.667A1.333 1.333 0 0 1 1.333 12V4z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1.333 4l6.667 4.667L14.667 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2.667" y="7.333" width="10.666" height="7.334" rx="1.333" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M5.333 7.333V5.333a2.667 2.667 0 0 1 5.334 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "", remember: false });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(form.email, form.password);
      const redirect = searchParams.get("redirect");
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        if (redirect) {
          router.push(redirect);
        } else if (u.role === "ADMIN") {
          router.push("/admin");
        } else if (u.role === "TECHNICIAN") {
          router.push("/technician");
        } else {
          router.push("/dashboard");
        }
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Email atau password salah";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#1A1410] flex-col justify-between p-14 relative overflow-hidden">
        <div className="absolute top-[-80px] right-[-80px] w-[420px] h-[420px] rounded-full bg-[#B07D3E] opacity-[0.07] blur-[90px] pointer-events-none" />
        <div className="absolute bottom-[-60px] left-[-60px] w-[320px] h-[320px] rounded-full bg-[#B07D3E] opacity-[0.05] blur-[70px] pointer-events-none" />

        <Link href="/" className="flex items-center gap-2.5 w-fit">
  <div className="bg-white w-10 h-10 flex items-center justify-center  rounded-full">
    <img src="/logo.svg" alt="Solvio Logo" width={60} height={60} />
  </div>

  <span className="text-[18px] font-semibold tracking-[-0.02em] text-white">
    Solvio
  </span>
</Link>

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
          <div className="grid grid-cols-2 gap-5">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white/[0.04] border border-white/[0.07] rounded-2xl px-5 py-4">
                <p className="text-[22px] font-normal text-white">{s.val}</p>
                <p className="text-[11px] text-white/35 mt-1 tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <p className="text-[14px] text-white/35 font-light italic leading-relaxed">
            &ldquo;AC saya sudah bersih kembali, teknisinya datang tepat waktu dan ramah.&rdquo;
          </p>
          <p className="text-[12px] text-white/25 mt-3 font-medium">— Siska A., Pelanggan Solvio</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-8 sm:px-14 lg:px-20 py-16 bg-[#FDFCFB]">
        <div className="lg:hidden mb-10">
          <Link href="/" className="flex items-center gap-2.5 w-fit">
            <span className="w-7 h-7 rounded-full bg-[#1A1410] flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B07D3E]" />
            </span>
            <span className="text-[18px] font-semibold tracking-[-0.02em] text-[#1A1410]">Solvio</span>
          </Link>
        </div>

        <div className="w-full max-w-[420px] mx-auto">
          <div className="mb-9">
            <h1 className="text-[clamp(1.8rem,3vw,2.2rem)] font-normal text-[#1A1410] leading-tight mb-2">
              Masuk ke Akun
            </h1>
            <p className="text-[14px] text-[#7A6E64] font-light">
              Belum punya akun?{" "}
              <Link href="/register" className="text-[#B07D3E] font-medium hover:underline underline-offset-4">
                Daftar sekarang
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-[13px] text-red-600 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="nama@email.com"
              fullWidth
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              leftIcon={<EmailIcon />}
              required
            />

            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password"
              fullWidth
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              leftIcon={<LockIcon />}
              rightIcon={<EyeIcon crossed={showPassword} />}
              onRightIconClick={() => setShowPassword(!showPassword)}
              required
            />

            <div className="flex items-center justify-between pt-1">
              <Checkbox
                label="Ingat saya"
                checked={form.remember}
                onChange={(e) => setForm({ ...form, remember: e.target.checked })}
              />
            </div>

            <div className="pt-2">
              <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
                {isLoading ? "Memproses…" : "Masuk"}
              </Button>
            </div>
          </form>

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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#B07D3E] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
