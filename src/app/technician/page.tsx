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

export default function TeknisiPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState("");

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

  async function updateStatus(bookingId: string, status: "ON_PROGRESS" | "COMPLETED") {
    setUpdating(bookingId);
    try {
      await api.patch(`/bookings/${bookingId}/progress`, { status });
      await loadTasks();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal update status";
      alert(msg);
    } finally {
      setUpdating(null);
    }
  }

  const stats = {
    total: tasks.length,
    today: tasks.filter((t) => {
      const d = new Date(t.schedule);
      const n = new Date();
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
    <div className="min-h-screen pt-[88px] pb-24 px-8 bg-[#FDFCFB]">
      <div className="max-w-4xl mx-auto">

        <div className="mb-10">
          <Badge variant="accent" className="mb-3">Portal Teknisi</Badge>
          <h1 className="text-[clamp(1.8rem,3.5vw,2.4rem)] font-normal text-[#1A1410] leading-tight">
            Halo, {user?.full_name.split(" ")[0]} 👷
          </h1>
          <p className="text-[15px] text-[#7A6E64] font-light mt-1">Daftar tugas yang ditugaskan kepada Anda</p>
        </div>

        {/* Stats */}
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
                      <div className="flex items-center gap-2 text-[13px] text-[#7A6E64]">
                        <span>👤</span>
                        <span>Pelanggan: {task.user?.full_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[13px] text-[#7A6E64]">
                        <span>📅</span>
                        <span>{formatDate(task.schedule)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[13px] text-[#7A6E64]">
                        <span>📞</span>
                        <span>{task.user?.phone_number || "–"}</span>
                      </div>
                      {task.user?.address && (
                        <div className="flex items-center gap-2 text-[13px] text-[#7A6E64]">
                          <span>📍</span>
                          <span>{task.user.address}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-[13px] font-semibold text-[#1A1410]">
                        <span>💰</span>
                        <span>{formatPrice(task.total_price)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-2 min-w-[140px]">
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
                        onClick={() => updateStatus(task.id, "COMPLETED")}
                        disabled={updating === task.id}
                        className="px-4 py-2.5 bg-green-600 text-white text-[13px] font-semibold rounded-full hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {updating === task.id ? "…" : "Tandai Selesai ✓"}
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
  );
}
