"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Booking, BookingStatus } from "@/types";
import { Badge } from "@/components/ui";

function formatPrice(n: number) { return "Rp " + n.toLocaleString("id-ID"); }
function formatDate(s: string) {
  return new Date(s).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
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
  PENDING: "Menunggu", CONFIRMED: "Dikonfirmasi", ON_PROGRESS: "Sedang Dikerjakan",
  COMPLETED: "Selesai", CANCELLED: "Dibatalkan",
};

interface CompleteModalProps {
  task: Booking;
  onClose: () => void;
  onSubmit: (proofUrl: string, cashConfirmed: boolean) => void;
  loading: boolean;
}

function CompleteModal({ task, onClose, onSubmit, loading }: CompleteModalProps) {
  const [proofUrl, setProofUrl] = useState("");
  const [cashConfirmed, setCashConfirmed] = useState(false);
  const isCash = ["tunai", "cash"].includes(task.payment?.method?.toLowerCase() || "");

  function handleSubmit() {
  if (!proofUrl.trim()) { alert("URL bukti pengerjaan tidak boleh kosong"); return; }
  
  const paymentAlreadySuccess = task.payment?.status === 'SUCCESS';
  if (!isCash && !paymentAlreadySuccess && !cashConfirmed) {
    alert("Pastikan kamu sudah konfirmasi pembayaran dari customer");
    return;
  }
  if (isCash && !cashConfirmed) { alert("Pastikan kamu sudah konfirmasi pembayaran tunai dari customer"); return; }
  
  onSubmit(proofUrl.trim(), cashConfirmed);
}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-[18px] font-semibold text-[#1A1410] mb-1">Tandai Tugas Selesai</h2>
        <p className="text-[13px] text-[#7A6E64] mb-5">
          {task.services?.services_name} · {task.user?.full_name}
        </p>

        <div className="mb-4">
          <label className="block text-[13px] font-medium text-[#1A1410] mb-1.5">
            URL Bukti Pengerjaan <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            value={proofUrl}
            onChange={(e) => setProofUrl(e.target.value)}
            placeholder="https://drive.google.com/... atau link foto"
            className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#B07D3E]/30 focus:border-[#B07D3E]"
          />
          <p className="text-[11px] text-[#7A6E64] mt-1">Masukkan link foto/video hasil pengerjaan (Google Drive, Imgur, dll)</p>
        </div>


<div className={`mb-5 p-4 rounded-xl border ${
  isCash 
    ? 'bg-amber-50 border-amber-200' 
    : 'bg-blue-50 border-blue-200'
}`}>
  <p className={`text-[13px] font-semibold mb-2 ${
    isCash ? 'text-amber-800' : 'text-blue-800'
  }`}>
    {isCash ? '💵 Pembayaran Tunai' : '💳 Konfirmasi Pembayaran'}
  </p>
  <label className="flex items-start gap-2.5 cursor-pointer">
    <input
      type="checkbox"
      checked={cashConfirmed}
      onChange={(e) => setCashConfirmed(e.target.checked)}
      className={`mt-0.5 w-4 h-4 cursor-pointer ${
        isCash ? 'accent-amber-600' : 'accent-blue-600'
      }`}
    />
    <span className={`text-[13px] ${
      isCash ? 'text-amber-800' : 'text-blue-800'
    }`}>
      {isCash
        ? `Saya konfirmasi customer ${task.user?.full_name} sudah membayar tunai sebesar ${formatPrice(task.total_price)}`
        : `Saya konfirmasi pembayaran ${task.payment?.method?.toUpperCase()} sebesar ${formatPrice(task.total_price)} sudah diterima (cek bukti transfer/screenshot dari customer)`
      }
    </span>
  </label>
</div>


        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 rounded-full border border-stone-200 text-[13px] font-medium text-[#7A6E64] hover:bg-stone-50 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2.5 rounded-full bg-green-600 text-white text-[13px] font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Menyimpan…" : "Konfirmasi Selesai ✓"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TeknisiPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [completeTarget, setCompleteTarget] = useState<Booking | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      const data = await api.get<Booking[]>("/bookings/tasks");
      setTasks(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memuat tugas";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    if (user.role !== "TECHNICIAN") { router.push("/dashboard"); return; }
    loadTasks();
  }, [user, router, loadTasks]);

  async function updateStatus(bookingId: string, status: "ON_PROGRESS") {
    setUpdating(bookingId);
    try {
      await api.patch(`/bookings/${bookingId}/progress`, { status });
      await loadTasks();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal update status");
    } finally {
      setUpdating(null);
    }
  }

  async function handleCompleteSubmit(proofUrl: string, cashConfirmed: boolean) {
    if (!completeTarget) return;
    setUpdating(completeTarget.id);
    try {
      await api.patch(`/bookings/${completeTarget.id}/progress`, {
        status: "COMPLETED",
        proof_url: proofUrl,
        cash_confirmed: cashConfirmed,
      });
      setCompleteTarget(null);
      await loadTasks();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal menyelesaikan tugas");
    } finally {
      setUpdating(null);
    }
  }

  const stats = {
    total: tasks.length,
    today: tasks.filter((t) => {
      const d = new Date(t.schedule); const n = new Date();
      return d.toDateString() === n.toDateString();
    }).length,
    done: tasks.filter((t) => t.status === "COMPLETED").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-[88px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#B07D3E] border-t-transparent rounded-full animate-spin" />
          <p className="text-[14px] text-[#7A6E64]">Memuat tugas…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {completeTarget && (
        <CompleteModal
          task={completeTarget}
          onClose={() => setCompleteTarget(null)}
          onSubmit={handleCompleteSubmit}
          loading={updating === completeTarget.id}
        />
      )}

      <div className="min-h-screen pt-[88px] pb-24 px-8 bg-[#FDFCFB]">
        <div className="max-w-4xl mx-auto">

          <div className="mb-10">
            <Badge variant="accent" className="mb-3">Portal Teknisi</Badge>
            <h1 className="text-[clamp(1.8rem,3.5vw,2.4rem)] font-normal text-[#1A1410] leading-tight">
              Halo, {user?.full_name.split(" ")[0]} 👷
            </h1>
            <p className="text-[15px] text-[#7A6E64] font-light mt-1">Daftar tugas yang ditugaskan kepada Anda</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { label: "Total Tugas", value: stats.total },
              { label: "Jadwal Hari Ini", value: stats.today },
              { label: "Selesai", value: stats.done },
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

          <h2 className="text-[18px] font-medium text-[#1A1410] mb-5">Semua Tugas</h2>

          {tasks.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center bg-white rounded-2xl border border-stone-100">
              <p className="text-5xl mb-5">📋</p>
              <p className="text-[18px] font-medium text-[#1A1410] mb-2">Belum ada tugas</p>
              <p className="text-[14px] text-[#7A6E64]">Admin akan meng-assign tugas kepada Anda</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="bg-white rounded-2xl border border-stone-100 p-6 hover:shadow-[0_4px_20px_rgb(26,20,16,0.06)] transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-[16px] font-medium text-[#1A1410]">
                          {task.services?.services_name}
                        </h3>
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLOR[task.status]}`}>
                          {STATUS_LABEL[task.status]}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <p className="text-[13px] text-[#7A6E64]">👤 Pelanggan: {task.user?.full_name}</p>
                        <p className="text-[13px] text-[#7A6E64]">📅 {formatDate(task.schedule)}</p>
                        <p className="text-[13px] text-[#7A6E64]">📞 {task.user?.phone_number || "–"}</p>
                        {task.user?.address && (
                          <p className="text-[13px] text-[#7A6E64]">📍 {task.user.address}</p>
                        )}
                        <p className="text-[13px] font-semibold text-[#1A1410]">
                          💰 {formatPrice(task.total_price)}
                          {task.payment && (
                            <span className="ml-2 font-normal text-[#7A6E64]">
                              · {task.payment.method}
                              {task.payment.status === "SUCCESS" && (
                                <span className="ml-1 text-green-600">✓ Lunas</span>
                              )}
                            </span>
                          )}
                        </p>
                        {task.proof_url && (
                          <a
                            href={task.proof_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[12px] text-[#B07D3E] hover:underline"
                          >
                            📎 Lihat bukti pengerjaan
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[150px]">
                      {task.status === "CONFIRMED" && (
                        <button
                          onClick={() => updateStatus(task.id, "ON_PROGRESS")}
                          disabled={updating === task.id}
                          className="px-4 py-2.5 bg-purple-600 text-white text-[13px] font-semibold rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50"
                        >
                          {updating === task.id ? "…" : "Mulai Kerjakan"}
                        </button>
                      )}
                      {task.status === "ON_PROGRESS" && (
                        <button
                          onClick={() => setCompleteTarget(task)}
                          disabled={updating === task.id}
                          className="px-4 py-2.5 bg-green-600 text-white text-[13px] font-semibold rounded-full hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          Tandai Selesai ✓
                        </button>
                      )}
                      {task.status === "PENDING" && (
                        <span className="text-[12px] text-amber-600 text-center py-2 bg-amber-50 border border-amber-200 rounded-xl px-3">
                          Menunggu konfirmasi admin
                        </span>
                      )}
                      {(task.status === "COMPLETED" || task.status === "CANCELLED") && (
                        <span className="text-[12px] text-[#C2B9AF] text-center py-2">
                          {task.status === "COMPLETED" ? "✓ Tugas selesai" : "✕ Dibatalkan"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
