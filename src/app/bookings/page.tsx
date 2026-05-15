"use client";

import React, { useEffect, useState, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Service, ServiceVariant, Booking } from "@/types";
import { Button, Badge } from "@/components/ui";
import Link from "next/link";

function formatPrice(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function VirtualAccountDetail({ bank, amount }: { bank: string; amount: number }) {
  const vaNumbers: Record<string, string> = {
    BCA: "8008 0012 3456 789",
    Mandiri: "8888 0098 7654 321",
    BNI: "9888 0011 2233 445",
    BRI: "0088 0123 4567 890",
  };
  const va = vaNumbers[bank] || "8000 XXXX XXXX XXX";

  return (
    <div className="bg-[#F8F6F3] rounded-2xl p-5 border border-[#EDE9E4] space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold uppercase tracking-widest text-[#7A6E64]">
          Virtual Account {bank}
        </span>
        <span className="text-[11px] text-[#B07D3E] bg-[#FDF6EE] px-2 py-1 rounded-full border border-[#EADCC8] font-medium">
          Bayar setelah dikonfirmasi
        </span>
      </div>
      <div className="bg-white rounded-xl px-5 py-4 border border-[#EDE9E4] flex items-center justify-between">
        <div>
          <p className="text-[11px] text-[#7A6E64] mb-1">Nomor Virtual Account</p>
          <p className="text-[20px] font-mono font-semibold text-[#1A1410] tracking-wider">{va}</p>
        </div>
        <button
          type="button"
          onClick={() => navigator.clipboard?.writeText(va.replace(/\s/g, ""))}
          className="text-[12px] font-medium text-[#B07D3E] bg-[#FDF6EE] px-3 py-1.5 rounded-lg border border-[#EADCC8] hover:bg-[#F5EAD4] transition-colors"
        >
          Salin
        </button>
      </div>
      <div className="flex items-center justify-between text-[14px]">
        <span className="text-[#7A6E64]">Total Pembayaran</span>
        <span className="font-semibold text-[#1A1410]">{formatPrice(amount)}</span>
      </div>
      <p className="text-[12px] text-[#7A6E64] leading-relaxed">
        ⓘ Nomor VA ini aktif setelah booking dikonfirmasi admin. Transfer tepat sesuai nominal untuk verifikasi otomatis.
      </p>
    </div>
  );
}

function QRISDetail({ amount }: { amount: number }) {
  return (
    <div className="bg-[#F8F6F3] rounded-2xl p-5 border border-[#EDE9E4] space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold uppercase tracking-widest text-[#7A6E64]">QRIS</span>
        <span className="text-[11px] text-[#B07D3E] bg-[#FDF6EE] px-2 py-1 rounded-full border border-[#EADCC8] font-medium">
          Bayar setelah dikonfirmasi
        </span>
      </div>
      <div className="flex flex-col items-center py-4">
        <div className="w-44 h-44 bg-white border-2 border-[#EDE9E4] rounded-2xl flex items-center justify-center text-6xl">
          📱
        </div>
        <p className="text-[13px] text-[#7A6E64] mt-3 text-center">
          QR Code akan tersedia setelah booking dikonfirmasi admin
        </p>
      </div>
      <div className="flex items-center justify-between text-[14px]">
        <span className="text-[#7A6E64]">Total Pembayaran</span>
        <span className="font-semibold text-[#1A1410]">{formatPrice(amount)}</span>
      </div>
      <p className="text-[12px] text-[#7A6E64] leading-relaxed">
        ⓘ Scan kode QR dengan aplikasi dompet digital manapun (GoPay, OVO, Dana, ShopeePay, dll.).
      </p>
    </div>
  );
}

function CashDetail({ amount }: { amount: number }) {
  return (
    <div className="bg-[#F8F6F3] rounded-2xl p-5 border border-[#EDE9E4] space-y-3">
      <span className="text-[12px] font-semibold uppercase tracking-widest text-[#7A6E64]">Tunai</span>
      <div className="flex items-center gap-3 py-2">
        <span className="text-3xl">💵</span>
        <div>
          <p className="text-[14px] font-medium text-[#1A1410]">Bayar langsung ke teknisi</p>
          <p className="text-[13px] text-[#7A6E64]">Siapkan uang pas untuk kemudahan transaksi</p>
        </div>
      </div>
      <div className="flex items-center justify-between text-[14px] pt-2 border-t border-[#EDE9E4]">
        <span className="text-[#7A6E64]">Total yang harus disiapkan</span>
        <span className="font-semibold text-[#1A1410]">{formatPrice(amount)}</span>
      </div>
      <p className="text-[12px] text-[#7A6E64] leading-relaxed">
        ⓘ Pembayaran dilakukan saat teknisi menyelesaikan pekerjaan di lokasi Anda.
      </p>
    </div>
  );
}

function SuccessScreen({ booking, onReset }: { booking: Booking; onReset: () => void }) {
  const payMethod = booking.payment?.method || "";
  const amount = booking.total_price;

  return (
    <div className="max-w-md mx-auto py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mb-6 text-3xl mx-auto">✓</div>
      <h2 className="text-[26px] font-normal text-[#1A1410] mb-2">Reservasi Dikirim!</h2>
      <p className="text-[15px] text-[#7A6E64] font-light leading-relaxed mb-8">
        Reservasi <strong className="text-[#1A1410]">#{booking.id.slice(-8).toUpperCase()}</strong> berhasil dibuat.
        Admin akan mengkonfirmasi dalam 1×24 jam.
      </p>

      <div className="text-left mb-8">
        <p className="text-[12px] uppercase tracking-widest text-[#7A6E64] font-semibold mb-3">Instruksi Pembayaran</p>
        {payMethod.startsWith("VA_") ? (
          <VirtualAccountDetail bank={payMethod.replace("VA_", "")} amount={amount} />
        ) : payMethod === "QRIS" || payMethod === "GOPAY" ? (
          <QRISDetail amount={amount} />
        ) : (
          <CashDetail amount={amount} />
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/dashboard" className="flex-1">
          <Button fullWidth>Lihat Semua Reservasi</Button>
        </Link>
        <Button variant="outline" fullWidth onClick={onReset}>
          Buat Reservasi Lain
        </Button>
      </div>
    </div>
  );
}

const PAYMENT_METHODS = [
  { id: "VA_BCA", label: "VA BCA", icon: "🏦", desc: "Virtual Account BCA" },
  { id: "VA_MANDIRI", label: "VA Mandiri", icon: "🏦", desc: "Virtual Account Mandiri" },
  { id: "VA_BNI", label: "VA BNI", icon: "🏦", desc: "Virtual Account BNI" },
  { id: "VA_BRI", label: "VA BRI", icon: "🏦", desc: "Virtual Account BRI" },
  { id: "QRIS", label: "QRIS", icon: "📱", desc: "Semua dompet digital" },
  { id: "GOPAY", label: "GoPay", icon: "💚", desc: "Dompet digital GoPay" },
  { id: "TUNAI", label: "Tunai", icon: "💵", desc: "Bayar ke teknisi" },
];

const PROVINCE_CITY: Record<string, string[]> = {
  "Aceh": ["Banda Aceh", "Langsa", "Lhokseumawe", "Sabang", "Subulussalam"],
  "Sumatera Utara": ["Medan", "Binjai", "Gunungsitoli", "Padangsidimpuan", "Pematangsiantar", "Sibolga", "Tanjungbalai", "Tebing Tinggi"],
  "Sumatera Barat": ["Padang", "Bukittinggi", "Padang Panjang", "Pariaman", "Payakumbuh", "Sawahlunto", "Solok"],
  "Riau": ["Pekanbaru", "Dumai"],
  "Kepulauan Riau": ["Tanjungpinang", "Batam"],
  "Jambi": ["Jambi", "Sungai Penuh"],
  "Sumatera Selatan": ["Palembang", "Lubuklinggau", "Pagar Alam", "Prabumulih"],
  "Kepulauan Bangka Belitung": ["Pangkalpinang"],
  "Bengkulu": ["Bengkulu"],
  "Lampung": ["Bandar Lampung", "Metro"],
  "DKI Jakarta": ["Jakarta Barat", "Jakarta Pusat", "Jakarta Selatan", "Jakarta Timur", "Jakarta Utara"],
  "Banten": ["Cilegon", "Serang", "Tangerang", "Tangerang Selatan"],
  "Jawa Barat": ["Bandung", "Bekasi", "Bogor", "Cimahi", "Cirebon", "Depok", "Sukabumi", "Tasikmalaya"],
  "Jawa Tengah": ["Semarang", "Magelang", "Pekalongan", "Purwokerto", "Salatiga", "Solo", "Tegal"],
  "DI Yogyakarta": ["Yogyakarta"],
  "Jawa Timur": ["Surabaya", "Batu", "Blitar", "Kediri", "Madiun", "Malang", "Mojokerto", "Pasuruan", "Probolinggo"],
  "Bali": ["Denpasar"],
  "Nusa Tenggara Barat": ["Mataram", "Bima"],
  "Nusa Tenggara Timur": ["Kupang"],
  "Kalimantan Barat": ["Pontianak", "Singkawang"],
  "Kalimantan Tengah": ["Palangkaraya"],
  "Kalimantan Selatan": ["Banjarmasin", "Banjarbaru"],
  "Kalimantan Timur": ["Samarinda", "Balikpapan", "Bontang"],
  "Kalimantan Utara": ["Tarakan"],
  "Sulawesi Utara": ["Manado", "Bitung", "Kotamobagu", "Tomohon"],
  "Gorontalo": ["Gorontalo"],
  "Sulawesi Tengah": ["Palu"],
  "Sulawesi Barat": ["Mamuju"],
  "Sulawesi Selatan": ["Makassar", "Palopo", "Parepare"],
  "Sulawesi Tenggara": ["Kendari", "Baubau"],
  "Maluku": ["Ambon", "Tual"],
  "Maluku Utara": ["Ternate", "Tidore Kepulauan"],
  "Papua Barat": ["Manokwari", "Sorong"],
  "Papua": ["Jayapura"],
};

function ReservasiForm() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get("service_id");
  const preselectedVariantId = searchParams.get("variant_id");

  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ServiceVariant | null>(null);
  const [schedule, setSchedule] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);

  const load = useCallback(async (userAddress: string, userPhone: string) => {
    try {
      const svcs = await api.get<Service[]>("/services");
      setServices(svcs);
      setAddress(userAddress);
      setPhone(userPhone);
      if (preselectedId) {
        const found = svcs.find((s) => s.id === preselectedId);
        if (found) {
          setSelectedService(found);
          if (preselectedVariantId && found.variants) {
            const v = found.variants.find((vr) => vr.id === preselectedVariantId);
            if (v) setSelectedVariant(v);
          }
        }
      }
    } catch {
      setError("Gagal memuat daftar layanan");
    } finally {
      setFetchLoading(false);
    }
  }, [preselectedId, preselectedVariantId]);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    load(user.address || "", user.phone_number || "");
  }, [user, router, load]);

  const finalPrice = selectedVariant
    ? selectedVariant.price
    : selectedService?.price ?? 0;

  const hasVariants = selectedService?.variants && selectedService.variants.length > 0;
  const needsVariant = hasVariants && !selectedVariant;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedService) { setError("Pilih layanan terlebih dahulu"); return; }
    if (needsVariant) { setError("Pilih varian/tipe layanan terlebih dahulu"); return; }
    if (!province) { setError("Pilih provinsi terlebih dahulu"); return; }
    if (!city) { setError("Pilih kota terlebih dahulu"); return; }
    if (!paymentMethod) { setError("Pilih metode pembayaran terlebih dahulu"); return; }
    setError("");
    setLoading(true);
    try {
      if (phone && phone !== (user?.phone_number || "")) {
        await api.patch("/users/me", { phone_number: phone });
      }
      const result = await api.post<Booking>("/bookings", {
        services_id: selectedService.id,
        variant_id: selectedVariant?.id,
        schedule: new Date(schedule).toISOString(),
        address,
        province,
        city,
        payment_method: paymentMethod,
      });
      setSuccessBooking(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal membuat reservasi";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setSuccessBooking(null);
    setSelectedService(null);
    setSelectedVariant(null);
    setSchedule("");
    setAddress("");
    setPhone("");
    setProvince("");
    setCity("");
    setPaymentMethod("");
  }

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-[#B07D3E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (successBooking) {
    return <SuccessScreen booking={successBooking} onReset={resetForm} />;
  }

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().slice(0, 16);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-10">
        <Badge variant="accent" className="mb-3">Reservasi Baru</Badge>
        <h1 className="text-[clamp(1.8rem,3.5vw,2.5rem)] font-normal text-[#1A1410] leading-tight">
          Jadwalkan Servis Rumah
        </h1>
        <p className="mt-3 text-[15px] text-[#7A6E64] font-light">
          Isi detail di bawah ini dan teknisi kami akan datang ke lokasi Anda.
        </p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-[13px] text-red-600 font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-7">
        <div>
          <label className="block text-[13px] font-medium text-[#3D342D] mb-2">Pilih Layanan</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
            {services.map((svc) => {
              const isSelected = selectedService?.id === svc.id;
              const minP = svc.variants && svc.variants.length > 0
                ? Math.min(...svc.variants.map((v) => v.price))
                : svc.price;
              const hasV = svc.variants && svc.variants.length > 0;
              return (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => {
                    setSelectedService(svc);
                    setSelectedVariant(null);
                  }}
                  className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    isSelected
                      ? "border-[#1A1410] bg-[#1A1410] text-white"
                      : "border-[#EDE9E4] bg-white hover:border-[#C2B9AF]"
                  }`}
                >
                  <p className={`text-[14px] font-semibold ${isSelected ? "text-white" : "text-[#1A1410]"}`}>
                    {svc.services_name}
                  </p>
                  <p className={`text-[12px] mt-0.5 ${isSelected ? "text-white/60" : "text-[#7A6E64]"}`}>
                    {svc.category?.category_name}
                  </p>
                  <p className={`text-[13px] font-semibold mt-2 ${isSelected ? "text-[#E4CFA8]" : "text-[#B07D3E]"}`}>
                    {hasV ? `Mulai ${formatPrice(minP)}` : formatPrice(minP)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {selectedService && hasVariants && (
          <div>
            <label className="block text-[13px] font-medium text-[#3D342D] mb-2">
              Pilih Tipe / Ukuran
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedService.variants!.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariant(v)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-200 text-left ${
                    selectedVariant?.id === v.id
                      ? "border-[#B07D3E] bg-[#FDF6EE]"
                      : "border-[#EDE9E4] bg-white hover:border-[#C2B9AF]"
                  }`}
                >
                  <span className="text-[14px] font-medium text-[#1A1410]">{v.variant_name}</span>
                  <span className="text-[14px] font-semibold text-[#B07D3E]">{formatPrice(v.price)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-[13px] font-medium text-[#3D342D] mb-2">Tanggal & Jam Kunjungan</label>
          <input
            type="datetime-local"
            min={minDateStr}
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            required
            className="w-full px-4 py-3 border border-[#DDD7CF] rounded-xl text-[14px] text-[#1A1410] focus:outline-none focus:ring-2 focus:ring-[#B07D3E]/20 focus:border-[#B07D3E] bg-white transition-all duration-200"
          />
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium text-[#3D342D] mb-2">Provinsi</label>
            <select
              value={province}
              onChange={(e) => { setProvince(e.target.value); setCity(""); }}
              required
              className="w-full px-4 py-3 border border-[#DDD7CF] rounded-xl text-[14px] text-[#1A1410] focus:outline-none focus:ring-2 focus:ring-[#B07D3E]/20 focus:border-[#B07D3E] bg-white transition-all duration-200"
            >
              <option value="">Pilih provinsi…</option>
              {Object.keys(PROVINCE_CITY).map((prov) => (
                <option key={prov} value={prov}>{prov}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#3D342D] mb-2">Kota / Kabupaten</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              disabled={!province}
              className="w-full px-4 py-3 border border-[#DDD7CF] rounded-xl text-[14px] text-[#1A1410] focus:outline-none focus:ring-2 focus:ring-[#B07D3E]/20 focus:border-[#B07D3E] bg-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <option value="">Pilih kota…</option>
              {province && PROVINCE_CITY[province]?.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-medium text-[#3D342D] mb-2">Alamat Lengkap</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Masukkan alamat lengkap termasuk RT/RW, kelurahan, kecamatan…"
            rows={3}
            required
            className="w-full px-4 py-3 border border-[#DDD7CF] rounded-xl text-[14px] text-[#1A1410] placeholder:text-[#C2B9AF] focus:outline-none focus:ring-2 focus:ring-[#B07D3E]/20 focus:border-[#B07D3E] bg-white transition-all duration-200 resize-none"
          />
          {user?.address && address !== user.address && (
            <button
              type="button"
              onClick={() => setAddress(user.address || "")}
              className="mt-1.5 text-[12px] text-[#B07D3E] hover:underline"
            >
              ↩ Gunakan alamat dari profil
            </button>
          )}
        </div>

        <div>
          <label className="block text-[13px] font-medium text-[#3D342D] mb-2">
            Nomor Telepon{" "}
            <span className="text-[#7A6E64] font-normal">(untuk konfirmasi & pembayaran)</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Contoh: 081234567890"
            className="w-full px-4 py-3 border border-[#DDD7CF] rounded-xl text-[14px] text-[#1A1410] placeholder:text-[#C2B9AF] focus:outline-none focus:ring-2 focus:ring-[#B07D3E]/20 focus:border-[#B07D3E] bg-white transition-all duration-200"
          />
          {user?.phone_number && phone !== user.phone_number && phone && (
            <button
              type="button"
              onClick={() => setPhone(user.phone_number || "")}
              className="mt-1.5 text-[12px] text-[#B07D3E] hover:underline"
            >
              ↩ Gunakan nomor dari profil
            </button>
          )}
        </div>

        <div>
          <label className="block text-[13px] font-medium text-[#3D342D] mb-3">Metode Pembayaran</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setPaymentMethod(m.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 text-left ${
                  paymentMethod === m.id
                    ? "border-[#1A1410] bg-[#1A1410]"
                    : "border-[#EDE9E4] bg-white hover:border-[#C2B9AF]"
                }`}
              >
                <span className="text-xl">{m.icon}</span>
                <div>
                  <p className={`text-[13px] font-semibold ${paymentMethod === m.id ? "text-white" : "text-[#1A1410]"}`}>
                    {m.label}
                  </p>
                  <p className={`text-[11px] ${paymentMethod === m.id ? "text-white/60" : "text-[#7A6E64]"}`}>
                    {m.desc}
                  </p>
                </div>
                {paymentMethod === m.id && (
                  <span className="ml-auto text-white text-sm">✓</span>
                )}
              </button>
            ))}
          </div>

          {paymentMethod && selectedService && !needsVariant && (
            <div className="mt-4">
              {paymentMethod.startsWith("VA_") ? (
                <VirtualAccountDetail bank={paymentMethod.replace("VA_", "")} amount={finalPrice} />
              ) : paymentMethod === "QRIS" || paymentMethod === "GOPAY" ? (
                <QRISDetail amount={finalPrice} />
              ) : (
                <CashDetail amount={finalPrice} />
              )}
            </div>
          )}
        </div>

        {selectedService && (
          <div className="bg-[#F8F6F3] rounded-2xl p-5 border border-[#EDE9E4]">
            <p className="text-[12px] font-semibold uppercase tracking-widest text-[#7A6E64] mb-4">Ringkasan Reservasi</p>
            <div className="space-y-2">
              <div className="flex justify-between text-[14px]">
                <span className="text-[#7A6E64]">Layanan</span>
                <span className="font-medium text-[#1A1410]">{selectedService.services_name}</span>
              </div>
              {selectedVariant && (
                <div className="flex justify-between text-[14px]">
                  <span className="text-[#7A6E64]">Tipe</span>
                  <span className="font-medium text-[#1A1410]">{selectedVariant.variant_name}</span>
                </div>
              )}
              {paymentMethod && (
                <div className="flex justify-between text-[14px]">
                  <span className="text-[#7A6E64]">Pembayaran</span>
                  <span className="font-medium text-[#1A1410]">{paymentMethod}</span>
                </div>
              )}
              <div className="border-t border-[#EDE9E4] my-2" />
              <div className="flex justify-between text-[15px]">
                <span className="font-semibold text-[#1A1410]">Total</span>
                <span className="font-semibold text-[#B07D3E]">
                  {needsVariant ? "Pilih tipe dahulu" : formatPrice(finalPrice)}
                </span>
              </div>
            </div>
          </div>
        )}

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={loading}
          disabled={loading || !selectedService || !paymentMethod || !!needsVariant}
        >
          {loading ? "Memproses…" : "Buat Reservasi"}
        </Button>
      </form>
    </div>
  );
}

export default function ReservasiPage() {
  return (
    <div className="min-h-screen pt-[88px] pb-24 px-8">
      <Suspense fallback={
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-2 border-[#B07D3E] border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <ReservasiForm />
      </Suspense>
    </div>
  );
}
