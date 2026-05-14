"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Button, Input, Card } from "@/components/ui";


const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);
const IconPhone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11.6a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);
const IconMapPin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconHome = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconId = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M16 10h2M16 14h2M6 10h6M6 14h2"/>
  </svg>
);
const IconCamera = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>
  </svg>
);
const IconWrench = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
  </svg>
);
const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const IconShield = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);


interface ProfileData {
  id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  address?: string;
  city?: string;
  id_number?: string;
  id_photo?: string;
  specialities?: string;
  role: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
}

interface FormState {
  full_name: string;
  phone_number: string;
  address: string;
  city: string;
  id_number: string;
  id_photo: string;
  specialities: string;
}


const CITIES = [
  "Jakarta", "Surabaya", "Bandung", "Medan", "Semarang",
  "Yogyakarta", "Palembang", "Tangerang", "Depok", "Bekasi",
  "Bogor", "Denpasar", "Makassar", "Batam", "Pekanbaru",
  "Banjarmasin", "Malang", "Padang", "Manado", "Pontianak",
];

const SPECIALITIES_OPTIONS = [
  "AC", "Listrik", "Plumbing", "Elektronik", "Furniture",
  "Cat & Dinding", "Atap & Genteng", "Pest Control", "Kebersihan", "Lainnya",
];


function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}


export default function ProfilePage() {
  const { user: authUser, logout } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [form, setForm] = useState<FormState>({
    full_name: "",
    phone_number: "",
    address: "",
    city: "",
    id_number: "",
    id_photo: "",
    specialities: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
  const successTimer = useRef<ReturnType<typeof setTimeout>>();


  useEffect(() => {
    if (!authUser) { router.push("/login"); return; }
    loadProfile();
    return () => { if (successTimer.current) clearTimeout(successTimer.current); };
  }, [authUser]);

  async function loadProfile() {
    try {
      const data = await api.get<ProfileData>("/users/me");
      setProfile(data);
      const specs = data.specialities ? data.specialities.split(",").map((s) => s.trim()).filter(Boolean) : [];
      setSelectedSpecs(specs);
      setForm({
        full_name: data.full_name || "",
        phone_number: data.phone_number || "",
        address: data.address || "",
        city: data.city || "",
        id_number: data.id_number || "",
        id_photo: data.id_photo || "",
        specialities: data.specialities || "",
      });
    } catch (err: any) {
      setError(err.message || "Gagal memuat profil");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    if (success) setSuccess(false);
  }

  function toggleSpec(spec: string) {
    setSelectedSpecs((prev) => {
      const next = prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec];
      setForm((f) => ({ ...f, specialities: next.join(", ") }));
      return next;
    });
  }

  function validate(): boolean {
    const errs: Partial<FormState> = {};
    if (!form.full_name.trim()) errs.full_name = "Nama lengkap wajib diisi";
    if (form.phone_number && !/^(\+62|08)[0-9]{8,12}$/.test(form.phone_number)) {
      errs.phone_number = "Format nomor telepon tidak valid (contoh: 08123456789)";
    }
    if (profile?.role === "TECHNICIAN") {
      if (!form.city) errs.city = "Kota wajib diisi untuk teknisi";
      if (form.id_number && !/^[0-9]{16}$/.test(form.id_number)) {
        errs.id_number = "Nomor KTP harus 16 digit angka";
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    setError("");
    try {
      const payload: Partial<FormState> = {
        full_name: form.full_name,
        phone_number: form.phone_number || undefined,
        address: form.address || undefined,
        city: form.city || undefined,
      };
      if (profile?.role === "TECHNICIAN") {
        payload.id_number = form.id_number || undefined;
        payload.id_photo = form.id_photo || undefined;
        payload.specialities = form.specialities || undefined;
      }
      await api.patch<ProfileData>("/users/me", payload);
      await loadProfile();
      setSuccess(true);
      successTimer.current = setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan perubahan");
    } finally {
      setSaving(false);
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen pt-[88px] flex items-center justify-center bg-[#FAF9F7]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#B07D3E] border-t-transparent rounded-full animate-spin" />
          <p className="text-[14px] text-[#7A6E64]">Memuat profil…</p>
        </div>
      </div>
    );
  }

  const isTechnician = profile?.role === "TECHNICIAN";
  const completionFields = isTechnician
    ? ["full_name", "phone_number", "address", "city", "id_number", "id_photo", "specialities"]
    : ["full_name", "phone_number", "address", "city"];
  const filledCount = completionFields.filter((f) => !!form[f as keyof FormState]).length;
  const completionPct = Math.round((filledCount / completionFields.length) * 100);


  return (
    <div className="min-h-screen bg-[#FAF9F7] pt-[88px] pb-20">
      <div className="max-w-2xl mx-auto px-4">

        {/* ── Back ── */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[13px] text-[#7A6E64] hover:text-[#1A1410] transition-colors mb-6 group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">
            <IconArrowLeft />
          </span>
          Kembali
        </button>

        {/* ── Header card ── */}
        <div className="bg-white border border-[#EDE9E4] rounded-2xl p-6 mb-5 flex items-start gap-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#B07D3E] to-[#8B5E2A] flex items-center justify-center text-white text-xl font-semibold tracking-wider select-none">
              {getInitials(form.full_name || profile?.full_name || "U")}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-white text-[9px] ${isTechnician ? "bg-[#B07D3E]" : "bg-[#4A90D9]"}`}>
              {isTechnician ? <IconWrench /> : <IconUser />}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-[18px] font-semibold text-[#1A1410] truncate">
                {profile?.full_name || "Pengguna"}
              </h1>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${isTechnician ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-blue-50 text-blue-700 border border-blue-200"}`}>
                {isTechnician ? "Teknisi" : "Pelanggan"}
              </span>
            </div>
            <p className="text-[13px] text-[#7A6E64] mb-3">{profile?.email}</p>

            {/* Completion bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-[#7A6E64]">Kelengkapan profil</span>
                <span className={`text-[11px] font-semibold ${completionPct === 100 ? "text-green-600" : "text-[#B07D3E]"}`}>{completionPct}%</span>
              </div>
              <div className="h-1.5 bg-[#EDE9E4] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#B07D3E] to-[#D4A054] rounded-full transition-all duration-700"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              {completionPct < 100 && (
                <p className="text-[11px] text-[#7A6E64] mt-1.5">
                  {isTechnician
                    ? "Lengkapi profil agar admin mudah assign tugas berdasarkan lokasi & spesialisasi kamu."
                    : "Lengkapi profil agar pemesanan layanan lebih mudah."}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Info banner teknisi ── */}
        {isTechnician && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
            <div className="text-amber-600 mt-0.5 flex-shrink-0"><IconShield /></div>
            <p className="text-[12px] text-amber-800 leading-relaxed">
              Profil teknisi lengkap membantu admin assign pesanan berdasarkan <strong>kota</strong> dan <strong>spesialisasi</strong> kamu. Pastikan data KTP valid untuk verifikasi identitas.
            </p>
          </div>
        )}

        {/* ── Success / Error alerts ── */}
        {success && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-5 animate-pulse-once">
            <div className="text-green-600"><IconCheck /></div>
            <p className="text-[13px] text-green-800 font-medium">Profil berhasil diperbarui!</p>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
            <p className="text-[13px] text-red-700">{error}</p>
          </div>
        )}

        {/* ── Form: Informasi Dasar ── */}
        <Card className="mb-4 p-6">
          <h2 className="text-[15px] font-semibold text-[#1A1410] mb-5 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#F8F6F3] border border-[#EDE9E4] flex items-center justify-center text-[#B07D3E]">
              <IconUser />
            </span>
            Informasi Dasar
          </h2>

          <div className="flex flex-col gap-4">
            {/* Nama */}
            <Input
              label="Nama Lengkap"
              placeholder="Masukkan nama lengkap"
              value={form.full_name}
              onChange={(e) => handleChange("full_name", e.target.value)}
              error={errors.full_name}
              leftIcon={<IconUser />}
              fullWidth
            />

            {/* Email (readonly) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#3D342D]">Email</label>
              <div className="w-full bg-[#F8F6F3] border border-[#DDD7CF] rounded-xl px-4 py-3 text-[14px] text-[#7A6E64] select-none">
                {profile?.email}
              </div>
              <p className="text-[11px] text-[#7A6E64]">Email tidak dapat diubah</p>
            </div>

            {/* No HP */}
            <Input
              label="Nomor Telepon"
              placeholder="08123456789"
              value={form.phone_number}
              onChange={(e) => handleChange("phone_number", e.target.value)}
              error={errors.phone_number}
              leftIcon={<IconPhone />}
              hint="Format: 08xxxxxxxxxx atau +628xxxxxxxxxx"
              fullWidth
            />
          </div>
        </Card>

        {/* ── Form: Lokasi ── */}
        <Card className="mb-4 p-6">
          <h2 className="text-[15px] font-semibold text-[#1A1410] mb-5 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#F8F6F3] border border-[#EDE9E4] flex items-center justify-center text-[#B07D3E]">
              <IconMapPin />
            </span>
            Lokasi
            {isTechnician && (
              <span className="ml-auto text-[11px] text-amber-600 font-normal bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Wajib untuk teknisi
              </span>
            )}
          </h2>

          <div className="flex flex-col gap-4">
            {/* Kota */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#3D342D]">
                Kota {isTechnician && <span className="text-red-500">*</span>}
              </label>
              <select
                value={form.city}
                onChange={(e) => handleChange("city", e.target.value)}
                className={`w-full bg-white border rounded-xl text-[14px] px-4 py-3 outline-none transition-all duration-200 focus:ring-2 focus:ring-[#B07D3E]/20 focus:border-[#B07D3E] appearance-none cursor-pointer
                  ${errors.city ? "border-red-400" : "border-[#DDD7CF] hover:border-[#C2B9AF]"}
                  ${!form.city ? "text-[#C2B9AF]" : "text-[#1A1410]"}`}
              >
                <option value="">Pilih kota...</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.city && <p className="text-[12px] text-red-500 font-medium">{errors.city}</p>}
            </div>

            {/* Alamat */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#3D342D]">Alamat Lengkap</label>
              <div className="relative">
                <div className="absolute left-4 top-3.5 text-[#C2B9AF]"><IconHome /></div>
                <textarea
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Jl. Contoh No.1, Kelurahan, Kecamatan"
                  rows={3}
                  className="w-full bg-white border border-[#DDD7CF] hover:border-[#C2B9AF] rounded-xl text-[14px] text-[#1A1410] placeholder:text-[#C2B9AF] pl-11 pr-4 py-3 outline-none transition-all duration-200 focus:ring-2 focus:ring-[#B07D3E]/20 focus:border-[#B07D3E] resize-none"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* ── Form: Identitas & Spesialisasi (TECHNICIAN ONLY) ── */}
        {isTechnician && (
          <Card className="mb-4 p-6">
            <h2 className="text-[15px] font-semibold text-[#1A1410] mb-1 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#F8F6F3] border border-[#EDE9E4] flex items-center justify-center text-[#B07D3E]">
                <IconId />
              </span>
              Identitas & Spesialisasi
            </h2>
            <p className="text-[12px] text-[#7A6E64] mb-5">Hanya terlihat oleh admin platform</p>

            <div className="flex flex-col gap-5">
              {/* Nomor KTP */}
              <Input
                label="Nomor KTP (16 digit)"
                placeholder="3271xxxxxxxxxxxxxxxx"
                value={form.id_number}
                onChange={(e) => handleChange("id_number", e.target.value.replace(/\D/g, "").slice(0, 16))}
                error={errors.id_number}
                leftIcon={<IconId />}
                hint={`${form.id_number.length}/16 digit`}
                fullWidth
              />

              {/* Foto KTP */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[#3D342D]">
                  URL Foto KTP
                </label>

                {/* Preview jika sudah ada URL */}
                {form.id_photo && (
                  <div className="relative mb-2 rounded-xl overflow-hidden border border-[#DDD7CF] aspect-video bg-[#F8F6F3]">
                    <img
                      src={form.id_photo}
                      alt="Preview KTP"
                      className="w-full h-full object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                    <button
                      onClick={() => handleChange("id_photo", "")}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center text-[11px] hover:bg-red-600 transition-colors"
                      title="Hapus foto"
                    >✕</button>
                  </div>
                )}

                <div className="relative flex items-center">
                  <div className="absolute left-4 text-[#C2B9AF]"><IconCamera /></div>
                  <input
                    type="url"
                    value={form.id_photo}
                    onChange={(e) => handleChange("id_photo", e.target.value)}
                    placeholder="https://example.com/foto-ktp.jpg"
                    className="w-full bg-white border border-[#DDD7CF] hover:border-[#C2B9AF] rounded-xl text-[14px] text-[#1A1410] placeholder:text-[#C2B9AF] pl-11 pr-4 py-3 outline-none transition-all duration-200 focus:ring-2 focus:ring-[#B07D3E]/20 focus:border-[#B07D3E]"
                  />
                </div>
                <p className="text-[11px] text-[#7A6E64]">Masukkan URL foto KTP yang sudah diunggah ke cloud storage</p>
              </div>

              {/* Spesialisasi */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[#3D342D]">
                  Spesialisasi Layanan
                </label>
                <p className="text-[12px] text-[#7A6E64] -mt-1">Pilih satu atau lebih layanan yang kamu kuasai</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {SPECIALITIES_OPTIONS.map((spec) => {
                    const selected = selectedSpecs.includes(spec);
                    return (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => toggleSpec(spec)}
                        className={`flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer
                          ${selected
                            ? "bg-[#1A1410] text-white border-[#1A1410]"
                            : "bg-white text-[#7A6E64] border-[#DDD7CF] hover:border-[#B07D3E] hover:text-[#B07D3E]"}`}
                      >
                        {selected && <span className="text-[10px]"><IconCheck /></span>}
                        {spec}
                      </button>
                    );
                  })}
                </div>
                {selectedSpecs.length > 0 && (
                  <p className="text-[11px] text-[#7A6E64] mt-1">
                    Dipilih: <span className="text-[#B07D3E] font-medium">{selectedSpecs.join(", ")}</span>
                  </p>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* ── Save button ── */}
        <div className="sticky bottom-6">
          <div className="bg-white border border-[#EDE9E4] rounded-2xl p-4 shadow-[0_8px_32px_rgb(26,20,16,0.10)] flex items-center gap-3">
            <div className="flex-1 min-w-0">
              {saving ? (
                <p className="text-[13px] text-[#7A6E64]">Menyimpan perubahan…</p>
              ) : success ? (
                <p className="text-[13px] text-green-600 font-medium flex items-center gap-1.5">
                  <IconCheck /> Tersimpan!
                </p>
              ) : (
                <p className="text-[12px] text-[#7A6E64]">
                  {isTechnician ? "Pastikan kota & spesialisasi sudah benar" : "Perubahan belum disimpan"}
                </p>
              )}
            </div>
            <Button
              onClick={handleSave}
              isLoading={saving}
              disabled={saving}
              size="md"
            >
              Simpan Perubahan
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
