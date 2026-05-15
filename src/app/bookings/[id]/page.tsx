"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Booking, BookingStatus, GatewayPaymentResponse } from "@/types";
import { Button, Badge } from "@/components/ui";

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

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

function isGatewayMethod(method: string) {
  if (!method) return false;
  const upper = method.toUpperCase().trim();
  if (upper === "TUNAI" || upper === "CASH") return false;
  return true;
}
function methodLabel(method: string) {
  const map: Record<string, string> = {
    VA_BCA: "Virtual Account BCA",
    VA_BNI: "Virtual Account BNI",
    VA_BRI: "Virtual Account BRI",
    VA_MANDIRI: "Virtual Account Mandiri",
    QRIS: "QRIS",
    GOPAY: "GoPay",
    TUNAI: "Tunai",
    CASH: "Tunai",
  };
  return map[method?.toUpperCase()] || method;
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

// ─── Komponen tombol bayar ────────────────────────────────────
function PaymentSection({
  booking,
  onPaymentSuccess,
}: {
  booking: Booking;
  onPaymentSuccess: () => void;
}) {
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  const payment = booking.payment;
  if (!payment) return null;

  const isGateway = isGatewayMethod(payment.method);
  const isConfirmed = booking.status === "CONFIRMED";
  const isPending = payment.status === "PENDING";
  const isSuccess = payment.status === "SUCCESS";
  const isFailed = payment.status === "FAILED";
  const isExpired =
    payment.expired_at && new Date(payment.expired_at) <= new Date();

  async function handleBayar() {
    if (!payment) return; // type guard untuk TypeScript
    setPaying(true);
    setPayError("");

    try {
      let snapToken = payment.snap_token;
      if (!snapToken || isExpired) {
        const res = await api.post<GatewayPaymentResponse>("/payments/gateway", {
          booking_id: booking.id,
          method: payment.method,
        });
        snapToken = res.snap_token;
      }

      if (!window.snap) {
        throw new Error("Midtrans Snap belum dimuat, coba refresh halaman");
      }

      window.snap.pay(snapToken, {
        onSuccess: () => {
          // Webhook backend sudah handle update status,
          // kita cukup reload data booking
          onPaymentSuccess();
        },
        onPending: () => {
          // Masih pending (user belum transfer), reload saja
          onPaymentSuccess();
        },
        onError: () => {
          setPayError("Pembayaran gagal. Silakan coba lagi.");
        },
        onClose: () => {
          // User tutup popup tanpa bayar — tidak perlu action
          setPaying(false);
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memulai pembayaran";
      setPayError(msg);
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-6">
      <p className="text-[12px] uppercase tracking-widest text-[#7A6E64] font-semibold mb-4">
        Pembayaran
      </p>

      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[14px] font-medium text-[#1A1410]">
            {methodLabel(payment.method)}
          </p>
          <p className="text-[12px] text-[#7A6E64] mt-0.5">
            {formatPrice(payment.amount_to_pay)}
          </p>
        </div>
        <span
          className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border ${
            isSuccess
              ? "text-green-700 bg-green-50 border-green-200"
              : isFailed
              ? "text-red-600 bg-red-50 border-red-200"
              : "text-amber-700 bg-amber-50 border-amber-200"
          }`}
        >
          {isSuccess ? "Lunas" : isFailed ? "Gagal / Kedaluwarsa" : "Menunggu"}
        </span>
      </div>

      {payment.va_number && isPending && (
        <div className="bg-[#F8F6F3] rounded-xl px-4 py-3 border border-[#EDE9E4] mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-[#7A6E64] mb-1">Nomor Virtual Account</p>
            <p className="text-[18px] font-mono font-semibold text-[#1A1410] tracking-wider">
              {payment.va_number}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(payment.va_number!.replace(/\s/g, ""))}
            className="text-[12px] font-medium text-[#B07D3E] bg-[#FDF6EE] px-3 py-1.5 rounded-lg border border-[#EADCC8] hover:bg-[#F5EAD4] transition-colors"
          >
            Salin
          </button>
        </div>
      )}

      {payment.expired_at && isPending && (
        <p className="text-[12px] text-[#7A6E64] mb-4">
          ⏱ Batas pembayaran:{" "}
          <span className={`font-medium ${isExpired ? "text-red-500" : "text-[#1A1410]"}`}>
            {formatDate(payment.expired_at)}
          </span>
          {isExpired && " (kedaluwarsa)"}
        </p>
      )}

      {payment.paid_at && isSuccess && (
        <p className="text-[12px] text-green-600 mb-4">
          ✓ Dibayar pada {formatDate(payment.paid_at)}
        </p>
      )}

      {payError && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-[13px] text-red-600">{payError}</p>
        </div>
      )}

      {isGateway && isConfirmed && !isSuccess && (
        <button
          onClick={handleBayar}
          disabled={paying}
          className="w-full py-3.5 px-6 bg-[#B07D3E] text-white text-[14px] font-semibold rounded-full hover:bg-[#9A6C32] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {paying ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Memuat…
            </>
          ) : isExpired ? (
            "🔄 Buat Ulang Tagihan"
          ) : payment.snap_token ? (
            "💳 Lanjutkan Pembayaran"
          ) : (
            "💳 Bayar Sekarang"
          )}
        </button>
      )}

      {!isGateway && isPending && (
        <div className="bg-[#F8F6F3] rounded-xl p-4 border border-[#EDE9E4]">
          <p className="text-[13px] font-medium text-[#1A1410] mb-1">💵 Bayar Tunai ke Teknisi</p>
          <p className="text-[12px] text-[#7A6E64]">
            Siapkan uang pas sebesar {formatPrice(payment.amount_to_pay)}. Teknisi akan mengkonfirmasi
            setelah pekerjaan selesai.
          </p>
        </div>
      )}

      {isSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <span className="text-xl">✅</span>
          <p className="text-[13px] font-medium text-green-700">Pembayaran telah dikonfirmasi</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function BookingDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  const snapClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

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
          <Link href="/dashboard"><Button>Kembali ke Dashboard</Button></Link>
        </div>
      </div>
    );
  }

  const currentStep = STATUS_STEP[booking.status];

  return (
    <>
      {snapClientKey && (
        <Script
          src={
            process.env.NEXT_PUBLIC_MIDTRANS_ENV === "production"
              ? "https://app.midtrans.com/snap/snap.js"
              : "https://app.sandbox.midtrans.com/snap/snap.js"
          }
          data-client-key={snapClientKey}
          strategy="lazyOnload"
        />
      )}

      <div className="min-h-screen pt-[88px] pb-24 px-8 bg-[#FDFCFB]">
        <div className="max-w-2xl mx-auto">

          <div className="flex items-center gap-2 text-[13px] text-[#7A6E64] mb-8">
            <Link href="/dashboard" className="hover:text-[#1A1410] transition-colors">Dashboard</Link>
            <span>›</span>
            <span className="text-[#1A1410]">Detail Reservasi</span>
          </div>

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

          {booking.status === "CONFIRMED" &&
            booking.payment &&
            isGatewayMethod(booking.payment.method) &&
            booking.payment.status === "PENDING" && (
            <div className="bg-[#FDF6EE] border border-[#EADCC8] rounded-2xl p-5 mb-6 flex items-start gap-3">
              <span className="text-xl mt-0.5">💳</span>
              <div>
                <p className="text-[14px] font-semibold text-[#B07D3E]">Selesaikan Pembayaran</p>
                <p className="text-[13px] text-[#7A6E64] mt-0.5">
                  Booking kamu sudah dikonfirmasi! Klik tombol bayar di bawah untuk menyelesaikan pembayaran via{" "}
                  {methodLabel(booking.payment.method)}.
                </p>
              </div>
            </div>
          )}

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

          {booking.payment && (
            <PaymentSection
              booking={booking}
              onPaymentSuccess={loadBooking}
            />
          )}

          {booking.proof_url && (
            <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-6">
              <p className="text-[12px] uppercase tracking-widest text-[#7A6E64] font-semibold mb-4">
                Bukti Pengerjaan
              </p>
              <img
                src={booking.proof_url}
                alt="Bukti pengerjaan"
                className="w-full rounded-xl border border-[#EDE9E4] object-cover max-h-64"
              />
            </div>
          )}

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
    </>
  );
}
