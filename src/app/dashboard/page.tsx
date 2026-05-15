"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Booking, BookingStatus } from "@/types";
import { Button, Badge } from "@/components/ui";

function formatPrice(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING: "Menunggu",
  CONFIRMED: "Dikonfirmasi",
  ON_PROGRESS: "Sedang Dikerjakan",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

const STATUS_COLOR: Record<BookingStatus, string> = {
  PENDING: "text-amber-700 bg-amber-50 border-amber-200",
  CONFIRMED: "text-blue-700 bg-blue-50 border-blue-200",
  ON_PROGRESS: "text-purple-700 bg-purple-50 border-purple-200",
  COMPLETED: "text-green-700 bg-green-50 border-green-200",
  CANCELLED: "text-red-600 bg-red-50 border-red-200",
};

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadBookings = useCallback(async () => {
    try {
      const data = await api.get<Booking[]>("/bookings/my");
      setBookings(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memuat data booking";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    if (user.role !== "CUSTOMER") {
      if (user.role === "ADMIN") router.push("/admin");
      else router.push("/technician");
      return;
    }
    loadBookings();
  }, [user, router, loadBookings]);

  async function handleCancel(bookingId: string) {
    if (!confirm("Yakin ingin membatalkan reservasi ini?")) return;
    setCancelling(bookingId);
    try {
      await api.patch(`/bookings/${bookingId}/cancel`, {});
      await loadBookings();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal membatalkan reservasi";
      alert(msg);
    } finally {
      setCancelling(null);
    }
  }

  const stats = {
    total: bookings.length,
    active: bookings.filter((b) => ["PENDING", "CONFIRMED", "ON_PROGRESS"].includes(b.status)).length,
    done: bookings.filter((b) => b.status === "COMPLETED").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-[88px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#B07D3E] border-t-transparent rounded-full animate-spin" />
          <p className="text-[14px] text-[#7A6E64]">Memuat dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[88px] pb-24 px-8 bg-[#FDFCFB]">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div>
            <Badge variant="accent" className="mb-3">Dashboard Pelanggan</Badge>
            <h1 className="text-[clamp(1.8rem,3.5vw,2.4rem)] font-normal text-[#1A1410] leading-tight">
              Halo, {user?.full_name.split(" ")[0]} 👋
            </h1>
            <p className="text-[15px] text-[#7A6E64] font-light mt-1">{user?.email}</p>
          </div>
          <Link href="/services">
            <Button>+ Reservasi Baru</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Total Reservasi", value: stats.total },
            { label: "Sedang Aktif", value: stats.active },
            { label: "Sudah Selesai", value: stats.done },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-stone-100 p-6">
              <p className="text-[clamp(1.8rem,3vw,2.5rem)] font-normal text-[#1A1410]">{s.value}</p>
              <p className="text-[12px] text-[#7A6E64] mt-1 uppercase tracking-widest font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-[13px] text-red-600">{error}</p>
          </div>
        )}

        {/* Booking list */}
        <div>
          <h2 className="text-[18px] font-medium text-[#1A1410] mb-5">Riwayat Reservasi</h2>

          {bookings.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center bg-white rounded-2xl border border-stone-100">
              <p className="text-5xl mb-5">📋</p>
              <p className="text-[18px] font-medium text-[#1A1410] mb-2">Belum ada reservasi</p>
              <p className="text-[14px] text-[#7A6E64] mb-6">Mulai pesan layanan servis rumah pertama Anda</p>
              <Link href="/services">
                <Button>Lihat Layanan</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-2xl border border-stone-100 p-6 hover:shadow-[0_4px_20px_rgb(26,20,16,0.06)] transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Link href={`/bookings/${booking.id}`}>
                          <h3 className="text-[16px] font-medium text-[#1A1410] hover:text-[#B07D3E] transition-colors cursor-pointer">
                            {booking.services?.services_name || "Layanan"}
                          </h3>
                        </Link>
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLOR[booking.status]}`}>
                          {STATUS_LABEL[booking.status]}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[13px] text-[#7A6E64]">
                          📅 {formatDate(booking.schedule)}
                        </p>
                        {booking.provider && (
                          <p className="text-[13px] text-[#7A6E64]">
                            👷 Teknisi: {booking.provider.full_name}
                          </p>
                        )}
                        {booking.payment && (
                          <p className="text-[13px] text-[#7A6E64]">
                            💳 {booking.payment.method} —{" "}
                            <span className={booking.payment.status === "SUCCESS" ? "text-green-600" : "text-amber-600"}>
                              {booking.payment.status === "SUCCESS" ? "Lunas" : "Menunggu Pembayaran"}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <p className="text-[17px] font-semibold text-[#1A1410]">
                        {formatPrice(booking.total_price)}
                      </p>
                      {(booking.status === "PENDING" || booking.status === "CONFIRMED") && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          disabled={cancelling === booking.id}
                          className="text-[12px] text-red-500 hover:text-red-700 font-medium transition-colors disabled:opacity-50"
                        >
                          {cancelling === booking.id ? "Membatalkan…" : "Batalkan"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
