"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Booking, BookingStatus } from "@/types";
import { Button, Badge } from "@/components/ui";

function formatPrice(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_COLOR: Record<BookingStatus, string> = {
  PENDING: "text-amber-700 bg-amber-50 border-amber-200",
  CONFIRMED: "text-blue-700 bg-blue-50 border-blue-200",
  ON_PROGRESS: "text-purple-700 bg-purple-50 border-purple-200",
  COMPLETED: "text-green-700 bg-green-50 border-green-200",
  CANCELLED: "text-red-600 bg-red-50 border-red-200",
};

const STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING: "Menunggu Konfirmasi",
  CONFIRMED: "Dikonfirmasi",
  ON_PROGRESS: "Sedang Dikerjakan",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

const STATUS_STEP: Record<BookingStatus, number> = {
  PENDING: 0,
  CONFIRMED: 1,
  ON_PROGRESS: 2,
  COMPLETED: 3,
  CANCELLED: -1,
};

const LANGKAH = ["Menunggu", "Dikonfirmasi", "Dikerjakan", "Selesai"];

export default function BookingDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  const loadBooking = useCallback(async () => {
    try {
      const data = await api.get<Booking>(`/bookings/${bookingId}`);
      setBooking(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memuat detail reservasi";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    loadBooking();
  }, [user, router, loadBooking]);

  async function handleCancel() {
    if (!confirm("Yakin ingin membatalkan reservasi ini?")) return;
    setCancelling(true);
    try {
      await api.patch(`/bookings/${bookingId}/cancel`, {});
      await loadBooking();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal membatalkan reservasi";
      alert(msg);
    } finally {
      setCancelling(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-[88px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#B07D3E] border-t-transparent rounded-full animate-spin" />
          <p className="text-[14px] text-[#7A6E64]">Memuat detail reservasi…</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen pt-[88px] flex items-center justify-center px-8">
        <div className="text-center max-w-sm">
          <p className="text-5xl mb-4">⚠️</p>
          <h2 className="text-[20px] font-medium text-[#1A1410] mb-2">Reservasi Tidak Ditemukan</h2>
          <p className="text-[14px] text-[#7A6E64] mb-6">{error || "Reservasi ini tidak ada atau Anda tidak punya akses."}</p>
          <Link href="/dashboard">
            <Button>Kembali ke Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentStep = STATUS_STEP[booking.status];

  return (
    <div className="min-h-screen pt-[88px] pb-24 px-8 bg-[#FDFCFB]">
      <div className="max-w-2xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] text-[#7A6E64] mb-8">
          <Link href="/dashboard" className="hover:text-[#1A1410] transition-colors">Dashboard</Link>
          <span>›</span>
          <span className="text-[#1A1410]">Detail Reservasi</span>
        </div>

        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <Badge variant="accent" className="mb-3">
              #{booking.id.slice(-8).toUpperCase()}
            </Badge>
            <h1 className="text-[clamp(1.6rem,3vw,2rem)] font-normal text-[#1A1410]">
              {booking.services?.services_name || "Reservasi Layanan"}
            </h1>
          </div>
          <span className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border whitespace-nowrap ${STATUS_COLOR[booking.status]}`}>
            {STATUS_LABEL[booking.status]}
          </span>
        </div>

        {/* Progress Tracker */}
        {booking.status !== "CANCELLED" && (
          <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-6">
            <p className="text-[12px] uppercase tracking-widest text-[#7A6E64] font-semibold mb-6">
              Status Reservasi
            </p>
            <div className="flex items-center justify-between relative">
              <div className="absolute top-4 left-0 right-0 h-px bg-[#EDE9E4]" />
              {LANGKAH.map((step, i) => (
                <div key={step} className="relative flex flex-col items-center gap-2 z-10">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[12px] font-bold transition-all
                    ${i < currentStep ? "bg-[#1A1410] border-[#1A1410] text-white"
                      : i === currentStep ? "bg-[#B07D3E] border-[#B07D3E] text-white"
                      : "bg-white border-[#DDD7CF] text-[#C2B9AF]"
                    }`}>
                    {i < currentStep ? "✓" : i + 1}
                  </div>
                  <span className={`text-[11px] font-medium text-center leading-tight max-w-[60px]
                    ${i <= currentStep ? "text-[#1A1410]" : "text-[#C2B9AF]"}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {booking.status === "CANCELLED" && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6 flex items-center gap-3">
            <span className="text-2xl">✕</span>
            <div>
              <p className="text-[14px] font-semibold text-red-700">Reservasi Dibatalkan</p>
              <p className="text-[13px] text-red-500 mt-0.5">Reservasi ini telah dibatalkan dan tidak dapat dilanjutkan.</p>
            </div>
          </div>
        )}

        {/* Detail Layanan */}
        <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-6 space-y-4">
          <p className="text-[12px] uppercase tracking-widest text-[#7A6E64] font-semibold mb-2">
            Detail Layanan
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] text-[#C2B9AF] uppercase tracking-widest mb-1">Layanan</p>
              <p className="text-[15px] font-medium text-[#1A1410]">{booking.services?.services_name}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#C2B9AF] uppercase tracking-widest mb-1">Kategori</p>
              <p className="text-[15px] font-medium text-[#1A1410]">{booking.services?.category?.category_name || "—"}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#C2B9AF] uppercase tracking-widest mb-1">Jadwal</p>
              <p className="text-[14px] text-[#1A1410]">{formatDate(booking.schedule)}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#C2B9AF] uppercase tracking-widest mb-1">Total Biaya</p>
              <p className="text-[17px] font-semibold text-[#1A1410]">{formatPrice(booking.total_price)}</p>
            </div>
          </div>

          {booking.provider && (
            <div className="pt-4 border-t border-[#F0EDE9]">
              <p className="text-[11px] text-[#C2B9AF] uppercase tracking-widest mb-2">Teknisi yang Ditugaskan</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#1A1410] flex items-center justify-center text-white text-[13px] font-semibold">
                  {booking.provider.full_name.charAt(0)}
                </div>
                <div>
                  <p className="text-[14px] font-medium text-[#1A1410]">{booking.provider.full_name}</p>
                  {booking.provider.phone_number && (
                    <p className="text-[12px] text-[#7A6E64]">{booking.provider.phone_number}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Pembayaran */}
        {booking.payment && (
          <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-6">
            <p className="text-[12px] uppercase tracking-widest text-[#7A6E64] font-semibold mb-4">
              Pembayaran
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14px] font-medium text-[#1A1410]">{booking.payment.method}</p>
                <p className="text-[12px] text-[#7A6E64] mt-0.5">{formatPrice(booking.payment.amount_to_pay)}</p>
              </div>
              <span className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border ${
                booking.payment.status === "SUCCESS"
                  ? "text-green-700 bg-green-50 border-green-200"
                  : booking.payment.status === "FAILED"
                  ? "text-red-600 bg-red-50 border-red-200"
                  : "text-amber-700 bg-amber-50 border-amber-200"
              }`}>
                {booking.payment.status === "SUCCESS" ? "Lunas" : booking.payment.status === "FAILED" ? "Gagal" : "Menunggu"}
              </span>
            </div>
          </div>
        )}

        {/* Aksi */}
        <div className="flex gap-3">
          <Link href="/dashboard" className="flex-1">
            <Button variant="outline" fullWidth>← Kembali ke Dashboard</Button>
          </Link>
          {(booking.status === "PENDING" || booking.status === "CONFIRMED") && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="flex-1 py-3 px-6 border-2 border-red-200 text-red-600 text-[14px] font-semibold rounded-full hover:bg-red-50 transition-all duration-200 disabled:opacity-50"
            >
              {cancelling ? "Membatalkan…" : "Batalkan Reservasi"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
