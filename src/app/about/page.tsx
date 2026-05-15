import Link from "next/link";
import { Button, Badge } from "@/components/ui";

const NILAI_NILAI = [
  {
    icon: "🔒",
    title: "Teknisi Terverifikasi",
    desc: "Setiap teknisi melewati verifikasi identitas, penilaian keahlian, dan pemeriksaan latar belakang sebelum bergabung dengan Solvio.",
  },
  {
    icon: "💰",
    title: "Harga Transparan",
    desc: "Tidak ada biaya tersembunyi. Harga yang ditampilkan adalah harga yang Anda bayar — disepakati sebelum pekerjaan dimulai.",
  },
  {
    icon: "⚡",
    title: "Cepat & Andal",
    desc: "Sistem penjadwalan kami menghubungkan Anda dengan teknisi terdekat yang tersedia sehingga Anda tidak perlu menunggu lama.",
  },
  {
    icon: "🛡️",
    title: "Garansi Layanan",
    desc: "Tidak puas? Kami memberikan garansi servis ulang tanpa biaya tambahan dalam 7 hari setelah pekerjaan selesai.",
  },
];

const STATISTIK = [
  { value: "2.400+", label: "Pelanggan Aktif" },
  { value: "98%", label: "Tingkat Kepuasan" },
  { value: "150+", label: "Teknisi Terlatih" },
  { value: "50+", label: "Kota Layanan" },
];

const CARA_KERJA = [
  {
    step: "01",
    title: "Pilih Layanan",
    desc: "Jelajahi katalog layanan rumah kami — mulai dari servis AC, kelistrikan, hingga kebersihan dan perpipaan.",
  },
  {
    step: "02",
    title: "Tentukan Jadwal",
    desc: "Pilih tanggal dan waktu yang Anda inginkan. Masukkan alamat Anda dan kami akan mengurus sisanya.",
  },
  {
    step: "03",
    title: "Teknisi Datang",
    desc: "Teknisi Solvio yang terverifikasi datang ke lokasi Anda dan menyelesaikan pekerjaan secara profesional.",
  },
  {
    step: "04",
    title: "Bayar & Beri Ulasan",
    desc: "Bayar setelah pekerjaan selesai melalui metode pembayaran pilihan Anda. Mudah dan transparan.",
  },
];

export default function TentangPage() {
  return (
    <div className="w-full min-h-screen">

      <section className="relative min-h-[60vh] flex flex-col justify-center px-8 overflow-hidden pt-22">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_60%_40%,#EDE9E4_0%,transparent_65%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto w-full relative py-20">
          <Badge variant="accent">Tentang Solvio</Badge>
          <h1 className="mt-6 text-[clamp(2.8rem,5.5vw,5rem)] font-normal leading-[1.05] text-stone-900 tracking-[-0.025em] max-w-3xl">
            Servis Rumah,{" "}
            <span className="italic text-accent-500">Dibuat Mudah.</span>
          </h1>
          <p className="mt-6 text-[18px] text-stone-500 font-light leading-relaxed max-w-xl">
            Solvio dibangun dengan satu misi: membuat perawatan rumah profesional
            dapat diakses oleh setiap keluarga — tanpa kerumitan, tanpa kejutan, hanya
            hasil yang bisa Anda percaya.
          </p>
        </div>
      </section>

      <section className="px-8 py-20 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[12px] uppercase tracking-[0.12em] text-accent-500 font-semibold mb-4">
              Kisah Kami
            </p>
            <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-normal text-stone-900 leading-tight mb-6">
              Lahir dari Masalah Nyata
            </h2>
            <div className="space-y-4 text-[16px] text-stone-500 font-light leading-relaxed">
              <p>
                Kami mendirikan Solvio setelah merasakan sendiri betapa sulitnya menemukan
                teknisi yang andal dengan harga yang wajar. Kebanyakan pemilik rumah
                terpaksa membayar terlalu mahal atau menerima hasil pekerjaan yang kurang
                memuaskan karena tidak ada cara mudah untuk membandingkan, memverifikasi,
                dan mempercayai penyedia layanan.
              </p>
              <p>
                Maka kami membangun platform yang kami inginkan ada: sebuah marketplace di mana
                setiap teknisi terverifikasi, setiap harga transparan, dan setiap pemesanan
                terpantau dari awal hingga akhir — dari penjadwalan hingga penyelesaian.
              </p>
              <p>
                Hari ini, Solvio melayani ribuan keluarga di seluruh Indonesia,
                memberdayakan teknisi lokal dengan pekerjaan yang stabil sambil memberikan
                ketenangan pikiran bagi para pemilik rumah.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {STATISTIK.map((s) => (
              <div
                key={s.label}
                className="bg-stone-25 rounded-2xl border border-stone-100 p-8"
              >
                <p className="text-[clamp(2.2rem,4vw,3rem)] font-normal text-stone-900 leading-none">
                  {s.value}
                </p>
                <p className="text-[12px] text-stone-500 mt-2 uppercase tracking-widest font-medium">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-8 py-20 bg-stone-25">
        <div className="max-w-7xl mx-auto">
          <p className="text-[12px] uppercase tracking-[0.12em] text-accent-500 font-semibold mb-4 text-center">
            Nilai Kami
          </p>
          <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-normal text-stone-900 text-center mb-14">
            Mengapa Pelanggan Memilih Solvio
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {NILAI_NILAI.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl border border-stone-100 p-8 hover:shadow-[0_12px_40px_rgb(26,20,16,0.07)] hover:-translate-y-1 transition-all duration-300"
              >
                <span className="text-3xl mb-5 block">{v.icon}</span>
                <h3 className="text-[17px] font-medium text-stone-900 mb-3">
                  {v.title}
                </h3>
                <p className="text-[14px] text-stone-500 font-light leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-8 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <p className="text-[12px] uppercase tracking-[0.12em] text-accent-500 font-semibold mb-4 text-center">
            Cara Kerja
          </p>
          <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-normal text-stone-900 text-center mb-14">
            Dari Pemesanan Hingga Selesai
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {CARA_KERJA.map((langkah, i) => (
              <div key={langkah.step} className="relative">
                {i < CARA_KERJA.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(100%-1rem)] w-[calc(100%-3rem)] h-px bg-stone-100" />
                )}
                <div className="w-14 h-14 rounded-full bg-stone-900 flex items-center justify-center text-white text-[14px] font-semibold mb-6">
                  {langkah.step}
                </div>
                <h3 className="text-[17px] font-medium text-stone-900 mb-3">
                  {langkah.title}
                </h3>
                <p className="text-[14px] text-stone-500 font-light leading-relaxed">
                  {langkah.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-24 bg-stone-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-normal leading-tight mb-6">
            Siap merasakan{" "}
            <span className="italic text-accent-200">layanan rumah yang lebih baik?</span>
          </h2>
          <p className="text-[16px] text-white/60 font-light mb-10 leading-relaxed">
            Bergabunglah dengan ribuan pemilik rumah yang mempercayakan perawatan
            rumah mereka kepada Solvio. Pesan layanan pertama Anda hari ini.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services">
              <Button size="lg" variant="outline">
                Lihat Layanan
              </Button>
            </Link>
            <Link href="/register">
              <button className="px-8 py-3.5 text-[14px] font-semibold bg-accent-500 text-white rounded-full hover:bg-[#9A6C31] transition-all duration-300">
                Mulai Bergabung
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
