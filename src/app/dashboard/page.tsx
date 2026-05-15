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

// ── Review Modal ──────────────────────────────────────────────
interface ReviewModalProps {
  booking: Booking;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  loading: boolean;
}
function ReviewModal({ booking, onClose, onSubmit, loading }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hovered, setHovered] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-[18px] font-semibold text-[#1A1410] mb-1">Beri Ulasan</h2>
        <p className="text-[13px] text-[#7A6E64] mb-5">
          {booking.services?.services_name} · Teknisi: {booking.provider?.full_name}
        </p>

        <div className="flex gap-1.5 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(star)}
              className="text-3xl transition-transform hover:scale-110"
            >
              <span className={(hovered || rating) >= star ? "text-amber-400" : "text-stone-200"}>★</span>
            </button>
          ))}
        </div>
        <p className="text-[12px] text-[#7A6E64] mb-4">
          {["", "Sangat Buruk", "Buruk", "Cukup", "Baik", "Sangat Baik"][rating]}
        </p>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Ceritakan pengalaman kamu (opsional)…"
          rows={3}
          className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-[13px] resize-none focus:outline-none focus:ring-2 focus:ring-[#B07D3E]/30 focus:border-[#B07D3E] mb-5"
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 rounded-full border border-stone-200 text-[13px] font-medium text-[#7A6E64] hover:bg-stone-50 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={() => onSubmit(rating, comment)}
            disabled={loading}
            className="flex-1 py-2.5 rounded-full bg-[#1A1410] text-white text-[13px] font-semibold hover:bg-[#2d241e] transition-colors disabled:opacity-50"
          >
            {loading ? "Mengirim…" : "Kirim Ulasan"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Invoice generator ─────────────────────────────────────────
function downloadInvoice(booking: Booking) {
  const dateStr = formatDate(booking.schedule);
  const now = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const html = `<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"><title>Invoice #${booking.id.slice(-8).toUpperCase()}</title>
<style>
  body{font-family:'Segoe UI',sans-serif;color:#1A1410;background:#fff;padding:40px;max-width:600px;margin:auto}
  .logo{font-size:22px;font-weight:700;letter-spacing:-0.5px;margin-bottom:4px}
  .subtitle{font-size:13px;color:#7A6E64;margin-bottom:32px}
  h1{font-size:28px;font-weight:300;margin:0 0 4px}
  .inv-id{font-size:13px;color:#7A6E64;margin-bottom:32px}
  table{width:100%;border-collapse:collapse;margin-bottom:24px}
  td{padding:8px 0;font-size:14px;vertical-align:top}
  td:first-child{color:#7A6E64;width:160px}
  .divider{border:none;border-top:1px solid #E8E2DC;margin:20px 0}
  .total-row td{font-size:17px;font-weight:600;padding-top:12px}
  .status-badge{display:inline-block;padding:3px 10px;border-radius:99px;font-size:12px;font-weight:600;background:#dcfce7;color:#166534;border:1px solid #bbf7d0}
  .footer{font-size:12px;color:#C2B9AF;text-align:center;margin-top:40px}
  @media print{body{padding:20px}}
</style></head>
<body>
  <div class="logo">Solvio</div>
  <div class="subtitle">Layanan Servis Profesional</div>
  <h1>Invoice</h1>
  <div class="inv-id">#${booking.id.slice(-8).toUpperCase()} · Diterbitkan ${now}</div>
  <hr class="divider">
  <table>
    <tr><td>Pelanggan</td><td><strong>${booking.user?.full_name || "–"}</strong><br><span style="color:#7A6E64;font-size:12px">${booking.user?.email || ""}</span></td></tr>
    <tr><td>Layanan</td><td>${booking.services?.services_name || "–"}</td></tr>
    <tr><td>Teknisi</td><td>${booking.provider?.full_name || "–"}</td></tr>
    <tr><td>Jadwal</td><td>${dateStr}</td></tr>
    <tr><td>Metode Bayar</td><td>${booking.payment?.method || "–"}</td></tr>
    <tr><td>Status Bayar</td><td><span class="status-badge">${booking.payment?.status === "SUCCESS" ? "Lunas" : "Menunggu"}</span></td></tr>
    ${booking.proof_url ? `<tr><td>Bukti Kerja</td><td><a href="${booking.proof_url}" style="color:#B07D3E">Lihat Foto</a></td></tr>` : ""}
  </table>
  <hr class="divider">
  <table>
    <tr class="total-row"><td>Total</td><td style="text-align:right">${formatPrice(booking.total_price)}</td></tr>
  </table>
  <div class="footer">Terima kasih telah menggunakan layanan Solvio &bull; Dokumen ini dicetak otomatis</div>
  <script>window.onload=()=>window.print()</script>
</body></html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Invoice-Solvio-${booking.id.slice(-8).toUpperCase()}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [paying, setPaying] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [reviewTarget, setReviewTarget] = useState<Booking | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  const loadBookings = useCallback(async () => {
    try {
      const data = await api.get<Booking[]>("/bookings/my");
      setBookings(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal memuat data booking");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    if (user.role !== "CUSTOMER") {
      router.push(user.role === "ADMIN" ? "/admin" : "/technician");
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
      alert(err instanceof Error ? err.message : "Gagal membatalkan reservasi");
    } finally {
      setCancelling(null);
    }
  }

  function handlePay(bookingId: string, e: React.MouseEvent) {
    e.stopPropagation();
    router.push(`/bookings/${bookingId}`);
  }

  async function handleReviewSubmit(rating: number, comment: string) {
    if (!reviewTarget) return;
    setReviewLoading(true);
    try {
      await api.post(`/reviews/${reviewTarget.id}`, { rating, comment });
      setReviewTarget(null);
      await loadBookings();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal mengirim ulasan");
    } finally {
      setReviewLoading(false);
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
    <>
      {reviewTarget && (
        <ReviewModal
          booking={reviewTarget}
          onClose={() => setReviewTarget(null)}
          onSubmit={handleReviewSubmit}
          loading={reviewLoading}
        />
      )}

      <div className="min-h-screen pt-[88px] pb-24 px-8 bg-[#FDFCFB]">
        <div className="max-w-5xl mx-auto">

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

          <div>
            <h2 className="text-[18px] font-medium text-[#1A1410] mb-5">Riwayat Reservasi</h2>

            {bookings.length === 0 ? (
              <div className="flex flex-col items-center py-20 text-center bg-white rounded-2xl border border-stone-100">
                <p className="text-5xl mb-5">📋</p>
                <p className="text-[18px] font-medium text-[#1A1410] mb-2">Belum ada reservasi</p>
                <p className="text-[14px] text-[#7A6E64] mb-6">Mulai pesan layanan servis rumah pertama Anda</p>
                <Link href="/services"><Button>Lihat Layanan</Button></Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => {
                  const canReview = booking.status === "COMPLETED" && !booking.review;
                  const hasReviewed = booking.status === "COMPLETED" && !!booking.review;
                  return (
                    <div
                      key={booking.id}
                      onClick={() => router.push(`/bookings/${booking.id}`)}
                      className="bg-white rounded-2xl border border-stone-100 p-6 hover:shadow-[0_4px_20px_rgb(26,20,16,0.06)] transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-[16px] font-medium text-[#1A1410] hover:text-[#B07D3E] transition-colors">
                              {booking.services?.services_name || "Layanan"}
                            </h3>
                            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLOR[booking.status]}`}>
                              {STATUS_LABEL[booking.status]}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[13px] text-[#7A6E64]">📅 {formatDate(booking.schedule)}</p>
                            {booking.provider && (
                              <p className="text-[13px] text-[#7A6E64]">👷 Teknisi: {booking.provider.full_name}</p>
                            )}
                            {booking.payment && (
                              <p className="text-[13px] text-[#7A6E64]">
                                💳 {booking.payment.method} —{" "}
                                <span className={booking.payment.status === "SUCCESS" ? "text-green-600 font-medium" : "text-amber-600"}>
                                  {booking.payment.status === "SUCCESS" ? "✓ Lunas" : "Menunggu Pembayaran"}
                                </span>
                              </p>
                            )}
                            {booking.proof_url && (
                              <a href={booking.proof_url} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[12px] text-[#B07D3E] hover:underline">
                                📎 Lihat bukti pengerjaan
                              </a>
                            )}
                            {hasReviewed && booking.review && (
                              <p className="text-[12px] text-[#7A6E64] flex items-center gap-1">
                                {"★".repeat(booking.review.rating)}<span className="text-stone-300">{"★".repeat(5 - booking.review.rating)}</span>
                                <span className="ml-1">Ulasan terkirim</span>
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <p className="text-[17px] font-semibold text-stone-900">
                            {formatPrice(booking.total_price)}
                          </p>

                          {booking.status === "COMPLETED" && (
                            <button
                              onClick={(e) => { e.stopPropagation(); downloadInvoice(booking); }}
                              className="text-[12px] text-accent-500 hover:underline font-medium"
                            >
                              ⬇ Unduh Invoice
                            </button>
                          )}

                          {canReview && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setReviewTarget(booking); }}
                              className="text-[12px] font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full transition-colors"
                            >
                              ★ Beri Ulasan
                            </button>
                          )}

                          {booking.status === "CONFIRMED" &&
                            booking.payment &&
                            booking.payment.status !== "SUCCESS" && (
                            <button
                              onClick={(e) => handlePay(booking.id, e)}
                              disabled={paying === booking.id}
                              className="text-[12px] font-semibold text-white bg-accent-500 hover:bg-[#9a6c33] px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
                            >
                              💳 Bayar Sekarang
                            </button>
                          )}

                          {(booking.status === "PENDING" || booking.status === "CONFIRMED") && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleCancel(booking.id); }}
                              disabled={cancelling === booking.id}
                              className="text-[12px] text-red-500 hover:text-red-700 font-medium transition-colors disabled:opacity-50"
                            >
                              {cancelling === booking.id ? "Membatalkan…" : "Batalkan"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
