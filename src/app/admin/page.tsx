"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Booking, BookingStatus, Service, Category, User } from "@/types";
import { Button } from "@/components/ui";

function formatPrice(n: number) { return "Rp " + n.toLocaleString("id-ID"); }
function formatDate(s: string) {
  return new Date(s).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const STATUS_OPTIONS: BookingStatus[] = ["PENDING", "CONFIRMED", "ON_PROGRESS", "COMPLETED", "CANCELLED"];
const STATUS_COLOR: Record<BookingStatus, string> = {
  PENDING: "text-amber-700 bg-amber-50 border-amber-200",
  CONFIRMED: "text-blue-700 bg-blue-50 border-blue-200",
  ON_PROGRESS: "text-purple-700 bg-purple-50 border-purple-200",
  COMPLETED: "text-green-700 bg-green-50 border-green-200",
  CANCELLED: "text-red-600 bg-red-50 border-red-200",
};
const STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING: "Menunggu", CONFIRMED: "Dikonfirmasi", ON_PROGRESS: "Dikerjakan",
  COMPLETED: "Selesai", CANCELLED: "Dibatalkan",
};

type Tab = "bookings" | "services" | "categories";

interface Technician extends User {
  assignedTasks?: { id: string }[];
  specialities?: string;
  average_rating?: number | null;
  review_count?: number;
}

interface BookingDrawerProps {
  booking: Booking;
  technicians: Technician[];
  updating: boolean;
  onClose: () => void;
  onUpdateStatus: (bookingId: string, status: BookingStatus, provider_id?: string) => void;
}

function BookingDrawer({ booking: b, technicians, updating, onClose, onUpdateStatus }: BookingDrawerProps) {
  const [newStatus, setNewStatus] = useState<BookingStatus>(b.status);
  const [newProvider, setNewProvider] = useState<string>(b.provider_id || "");

  const isFinished = ["COMPLETED", "CANCELLED"].includes(b.status);
  const customerCity = b.city || b.user?.city;
  const bookingCategory = b.services?.category?.category_name || "";

  const filteredTechs = bookingCategory
    ? technicians.filter((t) => {
        if (!t.specialities) return false;
        const specs = t.specialities.split(",").map((s) => s.trim().toLowerCase());
        return specs.includes(bookingCategory.toLowerCase());
      })
    : technicians;

  const techsToShow = filteredTechs.length > 0 ? filteredTechs : technicians;
  const isFiltered = filteredTechs.length > 0 && filteredTechs.length < technicians.length;
  

  const sortedTechs = [...techsToShow].sort((a, b) => {
    // 1. Prioritas kota sama
    const aCity = customerCity && a.city === customerCity;
    const bCity = customerCity && b.city === customerCity;
    if (aCity && !bCity) return -1;
    if (bCity && !aCity) return 1;
    // 2. Prioritas rating tertinggi
    const aRating = a.average_rating ?? -1;
    const bRating = b.average_rating ?? -1;
    return bRating - aRating;
  });

  function handleSave() {
    onUpdateStatus(b.id, newStatus, newProvider || undefined);
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative ml-auto w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
        <div className="sticky top-0 bg-white border-b border-[#F0EDE9] px-6 py-4 flex items-center justify-between z-10">
          <div>
            <p className="text-[11px] text-accent-500 font-semibold uppercase tracking-widest">
              #{b.id.slice(-8).toUpperCase()}
            </p>
            <h2 className="text-[18px] font-normal text-stone-900">{b.services?.services_name}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-100 transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 px-6 py-6 space-y-6">

          <span className={`inline-flex text-[12px] font-semibold px-3 py-1 rounded-full border ${STATUS_COLOR[b.status]}`}>
            {STATUS_LABEL[b.status]}
          </span>

          <section>
            <p className="text-[11px] uppercase tracking-widest text-stone-500 font-semibold mb-3">Pelanggan</p>
            <div className="bg-stone-50 rounded-2xl p-4 space-y-3 border border-stone-100">
              <Row label="Nama" value={b.user?.full_name || "—"} />
              <Row label="Email" value={b.user?.email || "—"} />
              <Row label="Telepon" value={b.user?.phone_number || "—"} />
              <Row label="Provinsi" value={
                b.province
                  ? <span className="font-semibold text-accent-500">{b.province}</span>
                  : b.user?.province
                  ? <span className="text-stone-500">{b.user.province}</span>
                  : <span className="text-stone-300 italic">Belum diisi</span>
              } />
              <Row label="Kota" value={
                b.city
                  ? <span className="font-semibold text-accent-500">{b.city}</span>
                  : b.user?.city
                  ? <span className="text-[text-stone-500]">{b.user.city}</span>
                  : <span className="text-[text-stone-300] italic">Belum diisi</span>
              } />
              {(b.address || b.user?.address) ? (
                <div>
                  <p className="text-[11px] text-[text-stone-300] uppercase tracking-widest mb-1">Alamat Kunjungan</p>
                  <p className="text-[13px] text-[text-stone-900] leading-relaxed bg-white rounded-xl px-3 py-2 border border-[border-stone-100]">
                    {b.address || b.user?.address}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-[11px] text-[text-stone-300] uppercase tracking-widest mb-1">Alamat Kunjungan</p>
                  <p className="text-[13px] text-red-400 italic bg-red-50 rounded-xl px-3 py-2 border border-red-100">
                    ⚠️ Pelanggan belum mengisi alamat
                  </p>
                </div>
              )}
            </div>
          </section>

          <section>
            <p className="text-[11px] uppercase tracking-widest text-[text-stone-500] font-semibold mb-3">Detail Reservasi</p>
            <div className="bg-[#bg-stone-50] rounded-2xl p-4 space-y-3 border border-[border-stone-100]">
              <Row label="Layanan" value={b.services?.services_name || "—"} />
              <Row label="Kategori" value={b.services?.category?.category_name || "—"} />
              <Row label="Jadwal" value={formatDate(b.schedule)} />
              <Row label="Total" value={
                <span className="font-semibold text-[text-stone-900]">{formatPrice(b.total_price)}</span>
              } />
            </div>
          </section>

          <section>
            <p className="text-[11px] uppercase tracking-widest text-[text-stone-500] font-semibold mb-3">Pembayaran</p>
            <div className="bg-[#bg-stone-50] rounded-2xl p-4 space-y-3 border border-[border-stone-100]">
              {b.payment ? (
                <>
                  <Row label="Metode" value={b.payment.method} />
                  <Row label="Nominal" value={formatPrice(b.payment.amount_to_pay)} />
                  <Row label="Status" value={
                    <span className={`text-[12px] font-semibold px-2 py-0.5 rounded-full border ${
                      b.payment.status === "SUCCESS"
                        ? "text-green-700 bg-green-50 border-green-200"
                        : b.payment.status === "FAILED"
                        ? "text-red-600 bg-red-50 border-red-200"
                        : "text-amber-700 bg-amber-50 border-amber-200"
                    }`}>
                      {b.payment.status === "SUCCESS" ? "Lunas" : b.payment.status === "FAILED" ? "Gagal" : "Menunggu"}
                    </span>
                  } />
                </>
              ) : (
                <p className="text-[13px] text-[text-stone-300] italic">Belum ada data pembayaran</p>
              )}
            </div>
          </section>

          <section>
            <p className="text-[11px] uppercase tracking-widest text-[text-stone-500] font-semibold mb-3">
              Assign Teknisi
              {filteredTechs.length > 0 && filteredTechs.length < technicians.length && (
                <span className="ml-2 normal-case text-[#text-accent-500] font-medium">— spesialis {bookingCategory}</span>
              )}
              {!isFiltered && customerCity && (
                <span className="ml-2 normal-case text-[#text-accent-500]">— prioritas kota {customerCity}</span>
              )}
            </p>
            {b.provider && !isFinished ? (
              <div className="bg-[#bg-stone-50] rounded-2xl p-4 border border-[border-stone-100] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[text-stone-900] flex items-center justify-center text-white text-[13px] font-semibold">
                    {b.provider.full_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[text-stone-900]">{b.provider.full_name}</p>
                    {b.provider.city && (
                      <p className="text-[12px] text-[#text-accent-500]">📍 {b.provider.city}</p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNewProvider("")}
                  className="text-[12px] text-[text-stone-500] hover:text-red-500 transition-colors"
                >
                  Ganti
                </button>
              </div>
            ) : isFinished ? (
              b.provider ? (
                <div className="bg-[#bg-stone-50] rounded-2xl p-4 border border-[border-stone-100]">
                  <p className="text-[14px] font-medium text-[text-stone-900]">{b.provider.full_name}</p>
                  {b.provider.city && <p className="text-[12px] text-[text-stone-500]">📍 {b.provider.city}</p>}
                </div>
              ) : (
                <p className="text-[13px] text-[text-stone-300] italic">Tidak ada teknisi</p>
              )
            ) : (
              <div className="space-y-2">
                {sortedTechs.length === 0 ? (
                  <p className="text-[13px] text-[text-stone-300] italic">Belum ada teknisi terdaftar</p>
                ) : (
                  sortedTechs.map((t) => {
                    const activeJobs = t.assignedTasks?.length || 0;
                    const isSameCity = customerCity && t.city === customerCity;
                    const isSelected = newProvider === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setNewProvider(isSelected ? "" : t.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-200 text-left ${
                          isSelected
                            ? "border-[text-stone-900] bg-[text-stone-900]"
                            : "border-[border-stone-100] bg-white hover:border-[text-stone-300]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold ${
                            isSelected ? "bg-white text-[text-stone-900]" : "bg-stone-100 text-[text-stone-900]"
                          }`}>
                            {t.full_name.charAt(0)}
                          </div>
                          <div>
                            <p className={`text-[13px] font-medium ${isSelected ? "text-white" : "text-[text-stone-900]"}`}>
                              {t.full_name}
                            </p>
                            <div className="flex items-center gap-2">
                              {t.city ? (
                                <p className={`text-[11px] ${isSameCity ? "text-[#text-accent-500] font-semibold" : isSelected ? "text-white/60" : "text-[text-stone-500]"}`}>
                                  📍 {t.city}
                                  {isSameCity && " ✓ Kota sama"}
                                </p>
                              ) : (
                                <p className={`text-[11px] italic ${isSelected ? "text-white/40" : "text-[text-stone-300]"}`}>
                                  Kota belum diisi
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-1 mt-0.5">
                              {(t.average_rating != null && t.average_rating !== undefined) ? (
                                <>
                                  <span className="text-amber-400 text-[11px]">{"★".repeat(Math.round(t.average_rating))}<span className={isSelected ? "text-white/20" : "text-stone-200"}>{"★".repeat(5 - Math.round(t.average_rating))}</span></span>
                                  <span className={`text-[10px] font-semibold ml-0.5 ${isSelected ? "text-white/70" : "text-[text-stone-500]"}`}>
                                    {t.average_rating.toFixed(1)} ({t.review_count} ulasan)
                                  </span>
                                </>
                              ) : (
                                <span className={`text-[10px] italic ${isSelected ? "text-white/40" : "text-[text-stone-300]"}`}>Belum ada ulasan</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                            activeJobs === 0
                              ? isSelected ? "bg-green-400/20 text-green-300" : "bg-green-50 text-green-700"
                              : isSelected ? "bg-amber-400/20 text-amber-300" : "bg-amber-50 text-amber-700"
                          }`}>
                            {activeJobs} aktif
                          </span>
                          {isSelected && <span className="text-white text-sm">✓</span>}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </section>

          {!isFinished && (
            <section>
              <p className="text-[11px] uppercase tracking-widest text-[text-stone-500] font-semibold mb-3">Update Status</p>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_OPTIONS.filter((s) => s !== b.status).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setNewStatus(s)}
                    className={`px-3 py-2.5 rounded-xl border-2 text-[12px] font-medium transition-all ${
                      newStatus === s
                        ? "border-stone-900 bg-stone-900 text-white"
                        : "border-stone-100 bg-white text-stone-500 hover:border-stone-300"
                    }`}
                  >
                    {STATUS_LABEL[s]}
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>

        {!isFinished && (
          <div className="sticky bottom-0 bg-white border-t border-[#F0EDE9] px-6 py-4 flex gap-3">
            <Button variant="outline" fullWidth onClick={onClose}>Tutup</Button>
            <Button
              fullWidth
              isLoading={!!updating}
              onClick={handleSave}
              disabled={newStatus === b.status && newProvider === (b.provider_id || "")}
            >
              Simpan Perubahan
            </Button>
          </div>
        )}
        {isFinished && (
          <div className="sticky bottom-0 bg-white border-t border-[#F0EDE9] px-6 py-4">
            <Button variant="outline" fullWidth onClick={onClose}>Tutup</Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-[12px] text-[text-stone-500] shrink-0">{label}</span>
      <span className="text-[13px] text-[text-stone-900] text-right">{value}</span>
    </div>
  );
}

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("bookings");

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    if (user.role !== "ADMIN") { router.push("/dashboard"); return; }
  }, [user]);

  if (!user || user.role !== "ADMIN") return null;

  return (
    <div className="min-h-screen pt-22 pb-24 px-8 bg-stone-25">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-[12px] uppercase tracking-[0.12em] text-text-accent-500 font-semibold mb-2">Admin Panel</p>
          <h1 className="text-[clamp(1.8rem,3vw,2.4rem)] font-normal text-[text-stone-900]">Solvio Dashboard</h1>
        </div>

        <div className="flex gap-1 bg-[#F0EDE9] rounded-xl p-1 mb-8 w-fit">
          {(["bookings", "services", "categories"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                tab === t ? "bg-white text-[text-stone-900] shadow-sm" : "text-[text-stone-500] hover:text-[text-stone-900]"
              }`}
            >
              {t === "bookings" ? "Reservasi" : t === "services" ? "Layanan" : "Kategori"}
            </button>
          ))}
        </div>

        {tab === "bookings" && <AdminBookings />}
        {tab === "services" && <AdminServices />}
        {tab === "categories" && <AdminCategories />}
      </div>
    </div>
  );
}

function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [updating, setUpdating] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const [bkgs, techs] = await Promise.all([
        api.get<Booking[]>("/bookings"),
        api.get<Technician[]>("/reviews/technicians"),
      ]);
      setBookings(bkgs);
      setTechnicians(techs);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(bookingId: string, status: BookingStatus, provider_id?: string) {
    setUpdating(true);
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status, provider_id });
      await load();
      setSelectedBooking((prev) =>
        prev?.id === bookingId
          ? { ...prev, status, provider_id: provider_id ?? prev.provider_id }
          : prev
      );
      setSelectedBooking(null);
    } catch (err: unknown) {
      alert((err instanceof Error ? err.message : undefined) || "Gagal update status");
    } finally {
      setUpdating(false);
    }
  }

  const displayed = bookings
    .filter((b) => filterStatus === "all" || b.status === filterStatus)
    .filter((b) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        b.user?.full_name?.toLowerCase().includes(q) ||
        b.user?.email?.toLowerCase().includes(q) ||
        b.services?.services_name?.toLowerCase().includes(q)
      );
    });

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "PENDING").length,
    active: bookings.filter((b) => ["CONFIRMED", "ON_PROGRESS"].includes(b.status)).length,
    done: bookings.filter((b) => b.status === "COMPLETED").length,
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-[#text-accent-500] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total", value: stats.total, color: "text-[text-stone-900]" },
          { label: "Menunggu", value: stats.pending, color: "text-amber-600" },
          { label: "Aktif", value: stats.active, color: "text-blue-600" },
          { label: "Selesai", value: stats.done, color: "text-green-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-stone-100 p-5">
            <p className={`text-[28px] font-normal ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-[text-stone-500] mt-1 uppercase tracking-widest">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        <div className="relative flex-1 min-w-55">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[text-stone-300]" width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Cari nama pelanggan atau layanan…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-xl text-[13px] text-[text-stone-900] placeholder:text-[text-stone-300] focus:outline-none focus:ring-2 focus:ring-[#text-accent-500]/20 focus:border-[#text-accent-500] bg-white"
          />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {["all", ...STATUS_OPTIONS].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all ${
              filterStatus === s
                ? "bg-stone-900 text-white border-stone-900"
                : "bg-white text-stone-500 border-stone-200 hover:border-stone-900"
            }`}
          >
            {s === "all" ? "Semua" : STATUS_LABEL[s as BookingStatus]}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F0EDE9]">
                {["Pelanggan", "Layanan", "Jadwal", "Status", "Total", "Teknisi", ""].map((h, i) => (
                  <th key={i} className="text-left px-5 py-3.5 text-[11px] font-semibold text-[text-stone-500] uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-[14px] text-[text-stone-300]">Tidak ada data</td></tr>
              )}
              {displayed.map((b) => (
                <tr
                  key={b.id}
                  className="border-b border-[#F0EDE9] last:border-0 hover:bg-stone-25 cursor-pointer"
                  onClick={() => setSelectedBooking(b)}
                >
                  <td className="px-5 py-4">
                    <p className="text-[13px] font-medium text-[text-stone-900]">{b.user?.full_name}</p>
                    <p className="text-[11px] text-[text-stone-300]">{b.user?.email}</p>
                    {(b.city || b.user?.city) && (
                      <p className="text-[11px] text-[#text-accent-500] mt-0.5">📍 {b.city || b.user?.city}</p>
                    )}
                    {!b.address && !b.user?.address && (
                      <p className="text-[10px] text-red-400 mt-0.5">⚠️ Alamat kosong</p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-[13px] text-[text-stone-900]">{b.services?.services_name}</p>
                    <p className="text-[11px] text-[text-stone-500]">{b.services?.category?.category_name}</p>
                  </td>
                  <td className="px-5 py-4 text-[12px] text-[text-stone-500]">{formatDate(b.schedule)}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLOR[b.status]}`}>
                      {STATUS_LABEL[b.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[13px] font-semibold text-[text-stone-900]">{formatPrice(b.total_price)}</td>
                  <td className="px-5 py-4">
                    {b.provider ? (
                      <div>
                        <p className="text-[12px] text-[text-stone-900] font-medium">{b.provider.full_name}</p>
                        {b.provider.city && (
                          <p className="text-[11px] text-[text-stone-500]">📍 {b.provider.city}</p>
                        )}
                      </div>
                    ) : (
                      <span className="text-[11px] text-red-400 italic">Belum diassign</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[12px] text-[#text-accent-500] font-medium hover:underline whitespace-nowrap">
                      Detail →
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBooking && (
        <BookingDrawer
          booking={selectedBooking}
          technicians={technicians}
          updating={updating}
          onClose={() => setSelectedBooking(null)}
          onUpdateStatus={updateStatus}
        />
      )}
    </div>
  );
}

function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({ services_name: "", price: "", category_id: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const [svcs, cats] = await Promise.all([
        api.get<Service[]>("/services"),
        api.get<Category[]>("/categories"),
      ]);
      setServices(svcs);
      setCategories(cats);
    } catch {} finally { setLoading(false); }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { services_name: form.services_name, price: Number(form.price), category_id: form.category_id };
      if (editing) {
        await api.patch(`/services/${editing.id}`, body);
      } else {
        await api.post("/services", body);
      }
      setShowForm(false);
      await load();
    } catch (err: unknown) {
      alert((err instanceof Error ? err.message : undefined) || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus layanan ini?")) return;
    try {
      await api.delete(`/services/${id}`);
      await load();
    } catch (err: unknown) {
      alert((err instanceof Error ? err.message : undefined) || "Gagal menghapus");
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#text-accent-500] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[18px] font-medium text-[text-stone-900]">Manajemen Layanan ({services.length})</h2>
        <Button size="sm" onClick={() => { setEditing(null); setForm({ services_name: "", price: "", category_id: "" }); setShowForm(true); }}>+ Tambah Layanan</Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-[18px] font-medium text-[text-stone-900] mb-6">
              {editing ? "Edit Layanan" : "Tambah Layanan"}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-stone-700 mb-1.5">Nama Layanan</label>
                <input
                  type="text" required value={form.services_name}
                  onChange={(e) => setForm({ ...form, services_name: e.target.value })}
                  placeholder="Contoh: Cuci AC Split"
                  className="w-full px-4 py-3 border border-border-stone-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#text-accent-500]/20 focus:border-[#text-accent-500]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-stone-700 mb-1.5">Harga Dasar (Rp)</label>
                <input
                  type="number" required min="0" value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="100000"
                  className="w-full px-4 py-3 border border-border-stone-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#text-accent-500]/20 focus:border-[#text-accent-500]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-stone-700 mb-1.5">Kategori</label>
                <select
                  required value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="w-full px-4 py-3 border border-border-stone-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#text-accent-500]/20 focus:border-[#text-accent-500] bg-white"
                >
                  <option value="">Pilih kategori</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.category_name}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" fullWidth onClick={() => setShowForm(false)}>Batal</Button>
                <Button type="submit" fullWidth isLoading={saving}>Simpan</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#F0EDE9]">
              {["Nama Layanan", "Kategori", "Harga", "Aksi"].map((h) => (
                <th key={h} className="text-left px-5 py-3.5 text-[11px] font-semibold text-[text-stone-500] uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {services.map((svc) => (
              <tr key={svc.id} className="border-b border-[#F0EDE9] last:border-0 hover:bg-stone-25">
                <td className="px-5 py-4 text-[14px] font-medium text-stone-900">{svc.services_name}</td>
                <td className="px-5 py-4">
                  <span className="text-[12px] bg-stone-100 text-stone-500 px-2.5 py-1 rounded-full">
                    {svc.category?.category_name}
                  </span>
                </td>
                <td className="px-5 py-4 text-[14px] font-semibold text-[text-stone-900]">{formatPrice(svc.price)}</td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing(svc); setForm({ services_name: svc.services_name, price: String(svc.price), category_id: svc.category_id }); setShowForm(true); }} className="text-[12px] text-[#text-accent-500] font-medium hover:underline">Edit</button>
                    <button onClick={() => handleDelete(svc.id)} className="text-[12px] text-red-500 font-medium hover:underline">Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);
  async function load() {
    try { setCategories(await api.get<Category[]>("/categories")); }
    catch {} finally { setLoading(false); }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.patch(`/categories/${editing.id}`, { category_name: name });
      } else {
        await api.post("/categories", { category_name: name });
      }
      setShowForm(false); setName(""); setEditing(null);
      await load();
    } catch (err: unknown) {
      alert((err instanceof Error ? err.message : undefined) || "Gagal menyimpan");
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus kategori ini?")) return;
    try { await api.delete(`/categories/${id}`); await load(); }
    catch (err: unknown) { alert((err instanceof Error ? err.message : undefined) || "Gagal menghapus"); }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#text-accent-500] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[18px] font-medium text-[text-stone-900]">Kategori ({categories.length})</h2>
        <Button size="sm" onClick={() => { setEditing(null); setName(""); setShowForm(true); }}>+ Tambah Kategori</Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm mx-4 shadow-2xl">
            <h3 className="text-[18px] font-medium text-[text-stone-900] mb-6">
              {editing ? "Edit Kategori" : "Tambah Kategori"}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-stone-700 mb-1.5">Nama Kategori</label>
                <input
                  type="text" required value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: AC, Kelistrikan"
                  className="w-full px-4 py-3 border border-border-stone-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#text-accent-500]/20 focus:border-[#text-accent-500]"
                />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" fullWidth onClick={() => setShowForm(false)}>Batal</Button>
                <Button type="submit" fullWidth isLoading={saving}>Simpan</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl border border-stone-100 p-5 flex items-center justify-between group hover:shadow-[0_4px_16px_rgb(26,20,16,0.07)] transition-all duration-200">
            <span className="text-[15px] font-medium text-[text-stone-900]">{cat.category_name}</span>
            <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setEditing(cat); setName(cat.category_name); setShowForm(true); }} className="text-[12px] text-[#text-accent-500] font-medium">Edit</button>
              <button onClick={() => handleDelete(cat.id)} className="text-[12px] text-red-500 font-medium">Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
