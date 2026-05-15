"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Category, Service, ServiceVariant } from "@/types";
import { Button, Badge } from "@/components/ui";

const CATEGORY_ICONS: Record<string, string> = {
  AC: "❄️", Listrik: "⚡", Kebersihan: "🏠", Pipa: "🔧",
  Elektronik: "💡", Renovasi: "🔨",
};

function formatPrice(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function getCatIcon(name: string) {
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (name.includes(key)) return icon;
  }
  return "🔧";
}

interface ServiceModalProps {
  service: Service;
  onClose: () => void;
  onBook: (service: Service, variant?: ServiceVariant) => void;
}

function ServiceModal({ service, onClose, onBook }: ServiceModalProps) {
  const hasVariants = service.variants && service.variants.length > 0;
  const [selectedVariant, setSelectedVariant] = useState<ServiceVariant | null>(null);

  const displayPrice = selectedVariant ? selectedVariant.price : service.price;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">

        <div className="bg-gradient-to-br from-stone-50 to-stone-100 px-8 pt-10 pb-8 flex flex-col items-center text-center">
          <span className="text-6xl mb-4">
            {getCatIcon(service.category?.category_name || "")}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#B07D3E] bg-[#FDF6EE] px-3 py-1 rounded-full border border-[#EADCC8] mb-2">
            {service.category?.category_name}
          </span>
          <h2 className="text-[22px] font-normal text-[#1A1410] leading-snug">
            {service.services_name}
          </h2>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-white hover:text-stone-900 transition-all text-sm"
        >
          ✕
        </button>

        <div className="px-6 py-6">
          {hasVariants ? (
            <>
              <p className="text-[12px] uppercase tracking-widest text-[#7A6E64] font-semibold mb-3">
                Pilih Ukuran / Tipe
              </p>
              <div className="space-y-2 mb-6">
                {service.variants!.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition-all duration-200 text-left ${
                      selectedVariant?.id === v.id
                        ? "border-[#1A1410] bg-[#1A1410] text-white"
                        : "border-[#EDE9E4] bg-stone-50 hover:border-[#C2B9AF] text-[#1A1410]"
                    }`}
                  >
                    <span className={`text-[14px] font-medium ${selectedVariant?.id === v.id ? "text-white" : "text-[#1A1410]"}`}>
                      {v.variant_name}
                    </span>
                    <span className={`text-[14px] font-semibold ${selectedVariant?.id === v.id ? "text-[#E4CFA8]" : "text-[#B07D3E]"}`}>
                      {formatPrice(v.price)}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between py-3 border-t border-[#F0EDE9] mb-5">
                <span className="text-[13px] text-[#7A6E64]">Harga terpilih</span>
                <span className="text-[18px] font-semibold text-[#1A1410]">
                  {selectedVariant ? formatPrice(selectedVariant.price) : "—"}
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between py-3 border-t border-[#F0EDE9] mb-5">
              <span className="text-[13px] text-[#7A6E64]">Harga</span>
              <span className="text-[22px] font-semibold text-[#1A1410]">
                {formatPrice(displayPrice)}
              </span>
            </div>
          )}

          <Button
            fullWidth
            size="lg"
            onClick={() => onBook(service, selectedVariant ?? undefined)}
            disabled={hasVariants && !selectedVariant}
          >
            {hasVariants && !selectedVariant ? "Pilih tipe terlebih dahulu" : "Pesan Sekarang"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function LayananPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [filtered, setFiltered] = useState<Service[]>([]);
  const [activeCat, setActiveCat] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalService, setModalService] = useState<Service | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [cats, svcs] = await Promise.all([
          api.get<Category[]>("/categories"),
          api.get<Service[]>("/services"),
        ]);
        setCategories(cats);
        setServices(svcs);
        setFiltered(svcs);
      } catch {
        setError("Gagal memuat layanan. Pastikan server berjalan.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    let result = services;
    if (activeCat !== "all") {
      result = result.filter((s) => s.category_id === activeCat);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.services_name.toLowerCase().includes(q) ||
          s.category?.category_name.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [activeCat, search, services]);

  const handleBook = useCallback((service: Service, variant?: ServiceVariant) => {
    if (!user) {
      router.push("/login");
      return;
    }
    const params = new URLSearchParams({ service_id: service.id });
    if (variant) params.set("variant_id", variant.id);
    router.push(`/bookings?${params.toString()}`);
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#B07D3E] border-t-transparent rounded-full animate-spin" />
          <p className="text-[14px] text-[#7A6E64]">Memuat layanan…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen pt-[88px] pb-24 px-8">
        <div className="max-w-7xl mx-auto">

          <div className="mb-12">
            <Badge variant="accent" className="mb-3">Layanan Kami</Badge>
            <h1 className="text-[clamp(2rem,4vw,3rem)] font-normal text-[#1A1410] leading-tight mb-4">
              Semua Layanan Solvio
            </h1>
            <p className="text-[16px] text-[#7A6E64] font-light max-w-lg">
              Pilih layanan servis rumah yang Anda butuhkan. Klik layanan untuk melihat detail harga dan pilihan.
            </p>
          </div>

          {error && (
            <div className="mb-8 px-5 py-4 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-[14px] text-red-600">{error}</p>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C2B9AF]" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Cari layanan…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-[#DDD7CF] rounded-xl text-[14px] text-[#1A1410] placeholder:text-[#C2B9AF] focus:outline-none focus:ring-2 focus:ring-[#B07D3E]/20 focus:border-[#B07D3E] bg-white transition-all duration-200"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setActiveCat("all")}
                className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-all duration-200 ${
                  activeCat === "all"
                    ? "bg-[#1A1410] text-white border-[#1A1410]"
                    : "bg-white text-[#7A6E64] border-[#DDD7CF] hover:border-[#1A1410]"
                }`}
              >
                Semua
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id)}
                  className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-all duration-200 ${
                    activeCat === cat.id
                      ? "bg-[#1A1410] text-white border-[#1A1410]"
                      : "bg-white text-[#7A6E64] border-[#DDD7CF] hover:border-[#1A1410]"
                  }`}
                >
                  {getCatIcon(cat.category_name)} {cat.category_name}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-24 text-center">
              <p className="text-5xl mb-5">🔍</p>
              <p className="text-[18px] font-medium text-[#1A1410] mb-2">Layanan tidak ditemukan</p>
              <p className="text-[14px] text-[#7A6E64]">Coba ubah kata kunci atau filter kategori</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((service) => {
                const hasV = service.variants && service.variants.length > 0;
                const minPrice = hasV
                  ? Math.min(...service.variants!.map((v) => v.price))
                  : service.price;

                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setModalService(service)}
                    className="text-left bg-white rounded-2xl border border-stone-100 hover:shadow-[0_12px_40px_rgb(26,20,16,0.09)] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer"
                  >
                    <div className="bg-gradient-to-br from-stone-50 to-stone-100 px-6 py-8 flex items-center justify-between">
                      <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                        {getCatIcon(service.category?.category_name || "")}
                      </span>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="text-[11px] font-medium text-[#7A6E64] bg-white px-3 py-1 rounded-full border border-stone-100">
                          {service.category?.category_name}
                        </span>
                        {hasV && (
                          <span className="text-[10px] font-semibold text-[#B07D3E] bg-[#FDF6EE] px-2 py-0.5 rounded-full border border-[#EADCC8]">
                            {service.variants!.length} pilihan
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-[18px] font-normal text-[#1A1410] mb-1 leading-snug group-hover:text-[#B07D3E] transition-colors duration-200">
                        {service.services_name}
                      </h3>
                      {hasV && (
                        <p className="text-[12px] text-[#7A6E64]">
                          {service.variants!.map((v) => v.variant_name).join(" · ")}
                        </p>
                      )}

                      <div className="mt-auto pt-5 border-t border-[#F0EDE9] flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-[#C2B9AF] uppercase tracking-widest font-medium mb-0.5">
                            {hasV ? "Mulai dari" : "Harga"}
                          </p>
                          <p className="text-[16px] font-semibold text-[#1A1410]">
                            {formatPrice(minPrice)}
                          </p>
                        </div>
                        <span className="w-9 h-9 rounded-full border border-stone-100 flex items-center justify-center text-stone-300 group-hover:border-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-all duration-300 text-sm">
                          →
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {modalService && (
        <ServiceModal
          service={modalService}
          onClose={() => setModalService(null)}
          onBook={(svc, variant) => {
            setModalService(null);
            handleBook(svc, variant);
          }}
        />
      )}
    </>
  );
}
