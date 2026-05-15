import Link from "next/link";
import { Button, Badge, Avatar } from "@/components/ui";

const POPULAR_SERVICES = [
  {
    num: "01",
    name: "Servis AC",
    desc: "Perawatan dan perbaikan AC rumahan agar tetap dingin dan hemat listrik.",
    tag: "AC Rumah",
    startPrice: "Rp 80.000",
    branches: ["Cuci AC", "Reparasi AC", "Isi Freon", "Instalasi AC"],
    icon: "❄️",
  },
  {
    num: "02",
    name: "Kelistrikan",
    desc: "Perbaikan dan pemasangan instalasi listrik rumah dengan aman dan rapi.",
    tag: "Listrik Rumah",
    startPrice: "Rp 100.000",
    branches: ["Instalasi Listrik", "Reparasi Listrik"],
    icon: "⚡",
  },
  {
    num: "03",
    name: "Perawatan Rumah",
    desc: "Kebersihan dan perawatan menyeluruh untuk rumah yang selalu nyaman ditinggali.",
    tag: "Kebersihan",
    startPrice: "Rp 120.000",
    branches: ["Cleaning Service", "Hydro Vacuum"],
    icon: "🏠",
  },
  {
    num: "04",
    name: "Perpipaan",
    desc: "Atasi kebocoran dan pasang instalasi pipa air bersih di rumah Anda.",
    tag: "Pipa & Air",
    startPrice: "Rp 150.000",
    branches: ["Instalasi Pipa", "Reparasi Pipa"],
    icon: "🔧",
  },
];

const REVIEWS = [
  {
    name: "Adrian Kurnia",
    role: "Pemilik Rumah, Bali",
    text: "Proses booking mudah dan teknisinya benar-benar berpengalaman. Solvio mengubah cara saya merawat rumah.",
  },
  {
    name: "Siska Amelia",
    role: "Ibu Rumah Tangga",
    text: "Harganya jelas dari awal, tidak ada biaya tambahan yang mengejutkan. Teknisinya ramah dan hasilnya memuaskan.",
  },
  {
    name: "Hendra Wijaya",
    role: "Pemilik Rumah",
    text: "Pelayanan yang sangat baik. Tim yang rapi, sopan, dan menghargai kenyamanan keluarga kami di rumah.",
  },
];

const STATS = [
  { value: "2.400+", label: "Pelanggan Aktif" },
  { value: "98%", label: "Tingkat Kepuasan" },
  { value: "150+", label: "Teknisi Terlatih" },
  { value: "50+", label: "Kota Layanan" },
];

export default function HomePage() {
  return (
    <div className="w-full">

      <section className="relative min-h-screen flex flex-col justify-center px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_60%_40%,#EDE9E4_0%,transparent_65%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full relative pt-24 pb-20">
          <div className="animate-fade-up">
            <Badge variant="accent">Maintenance Rumah Terpercaya</Badge>
          </div>

          <div className="mt-8 grid lg:grid-cols-2 gap-12 items-center animate-fade-up delay-75">
            <div>
              <h1 className="text-[clamp(2.8rem,5.5vw,5.5rem)] font-normal leading-[1.05] text-stone-900 tracking-[-0.025em]">
                Panggil Kami<br />
                <span className="italic text-accent-500">Solvio.</span>
              </h1>
              <p className="mt-6 text-[18px] text-stone-500 font-light leading-relaxed max-w-md">
                Solvio menghubungkan Anda dengan teknisi rumahan profesional — cepat, transparan, dan terpercaya untuk semua kebutuhan perawatan rumah Anda.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-start gap-4 animate-fade-up delay-150">
                <Link href="/services"><Button size="lg">Lihat Layanan</Button></Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-stone-900 text-stone-900 text-[14px] font-semibold rounded-full hover:bg-stone-900 hover:text-white transition-all duration-300"
                >
                  Daftar sebagai Teknisi
                </Link>
              </div>
            </div>

            <div className="relative flex items-center justify-center animate-fade-up delay-150">
              <div className="absolute w-90 h-90 rounded-full bg-stone-100 opacity-50" />
              <img src="/hero.svg" alt="Ilustrasi Servis Rumah" className="relative w-full max-w-sm" />
            </div>
          </div>

          <div className="mt-16 border-t border-stone-100" />

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-10 animate-fade-up delay-225">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-[clamp(1.8rem,3.5vw,2.6rem)] font-normal font-display text-stone-900 leading-none">{s.value}</p>
                <p className="text-[12px] text-stone-500 mt-2 tracking-widest uppercase font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="min-h-screen flex flex-col justify-center py-24 px-8 bg-stone-50">
        <div className="max-w-7xl mx-auto w-full">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <p className="text-[12px] uppercase tracking-[0.12em] text-accent-500 font-semibold mb-3">Layanan</p>
              <h2 className="text-[clamp(2.2rem,4vw,3.2rem)] font-normal text-stone-900 leading-tight">
                Layanan Populer.
              </h2>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-[13px] font-semibold text-stone-900 border border-stone-200 px-5 py-2.5 rounded-full hover:border-stone-900 hover:bg-white transition-all duration-200 self-start md:self-auto"
            >
              Lihat Semua Layanan
              <span className="text-accent-500">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {POPULAR_SERVICES.map((s, i) => (
              <Link key={i} href="/services" className="group block">
                <div className="bg-white rounded-2xl overflow-hidden border border-stone-100 hover:shadow-[0_12px_40px_rgb(26,20,16,0.09)] hover:-translate-y-1 transition-all duration-400 h-full flex flex-col">

                  {/* Icon area */}
                  <div className="relative w-full aspect-4/3 bg-linear-to-br from-stone-100 to-stone-50 flex items-center justify-center">
                    <span className="text-[60px] group-hover:scale-110 transition-transform duration-500">{s.icon}</span>
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] bg-white/80 text-accent-500 font-bold px-2 py-0.5 rounded-full border border-stone-100">{s.num}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-[10px] text-accent-500 font-semibold uppercase tracking-[0.09em]">{s.tag}</span>
                    <h3 className="mt-1.5 text-[18px] font-normal text-stone-900 group-hover:text-accent-500 transition-colors duration-300 leading-snug">
                      {s.name}
                    </h3>
                    <p className="mt-2 text-[13px] text-stone-500 font-light leading-relaxed line-clamp-2">
                      {s.desc}
                    </p>

                    {/* Sub-services */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {s.branches.map((branch) => (
                        <span key={branch} className="text-[10px] bg-stone-50 border border-stone-100 text-stone-500 px-2 py-0.5 rounded-full font-medium">
                          {branch}
                        </span>
                      ))}
                    </div>

                    {/* Price + Arrow */}
                    <div className="mt-5 pt-4 border-t border-[#F0EDE9] flex items-center justify-between">
                      <div>
                        <p className="text-[9px] text-stone-300 uppercase tracking-widest font-medium">Mulai dari</p>
                        <p className="text-[14px] font-semibold text-stone-900 mt-0.5">{s.startPrice}</p>
                      </div>
                      <span className="w-8 h-8 rounded-full border border-stone-100 flex items-center justify-center text-stone-300 group-hover:border-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-all duration-300 text-sm">
                        →
                      </span>
                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      <section className="min-h-screen flex flex-col justify-center py-24 px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-20 items-center">

            <div className="space-y-8">
              <div>
                <p className="text-[12px] uppercase tracking-[0.12em] text-accent-500 font-semibold mb-4">Mengapa Solvio</p>
                <h2 className="text-[clamp(2.2rem,4vw,3.2rem)] font-normal text-stone-900 leading-tight">
                  Rumah Nyaman<br />
                  <span className="italic">Butuh Tangan Ahli.</span>
                </h2>
              </div>
              <p className="text-[17px] text-stone-500 font-light leading-relaxed max-w-md">
                Kami tidak sekadar menyediakan teknisi — kami memastikan setiap sudut rumah Anda terawat dengan baik, aman, dan nyaman untuk seluruh keluarga.
              </p>

              <div className="space-y-6 pt-2">
                {[
                  { title: "Teknisi Berpengalaman", desc: "Setiap teknisi kami terverifikasi dan berpengalaman dalam perawatan rumah tinggal." },
                  { title: "Harga Jelas di Awal", desc: "Estimasi biaya disampaikan sebelum pekerjaan dimulai. Tidak ada biaya tersembunyi." },
                  { title: "Laporan Kunjungan Digital", desc: "Catatan lengkap setiap kunjungan tersimpan rapi dan bisa Anda akses kapan saja." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 group cursor-default">
                    <div className="w-px bg-stone-100 group-hover:bg-accent-500 transition-colors duration-300 shrink-0" />
                    <div>
                      <p className="text-[16px] font-semibold text-stone-900 mb-1">{item.title}</p>
                      <p className="text-[14px] text-stone-500 font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-110 lg:h-125">
              <div className="absolute inset-x-10 top-10 bottom-0 bg-stone-50rounded-2xl border border-stone-100" />
              <div className="absolute inset-x-5 top-5 bottom-5 bg-white rounded-2xl border border-stone-100 shadow-[0_4px_24px_rgb(26,20,16,0.04)]" />
              <div className="absolute inset-0 bg-white rounded-2xl border border-stone-100 shadow-[0_8px_40px_rgb(26,20,16,0.08)] p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-stone-500">Laporan Kunjungan</span>
                    <span className="text-[11px] bg-[#F0FBF5] text-[#1A7A45] px-3 py-1 rounded-full font-semibold border border-[#C3EDD5]">✓ Selesai</span>
                  </div>
                  <h3 className="text-[22px] font-normal text-stone-900 mb-1 font-display">Servis AC</h3>
                  <p className="text-[13px] text-stone-500 font-light">Jl. Melati No. 7, Yogyakarta</p>
                </div>
                <div className="space-y-0">
                  {[
                    { label: "Teknisi", val: "Budi Santoso" },
                    { label: "Jenis Servis", val: "Cuci AC Split" },
                    { label: "Tanggal", val: "9 Mei 2026" },
                    { label: "Total Biaya", val: "Rp 120.000" },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between py-3 border-t border-[#F0EDE9]">
                      <span className="text-[13px] text-stone-500">{row.label}</span>
                      <span className="text-[14px] font-medium text-stone-900">{row.val}</span>
                    </div>
                  ))}
                </div>
                <div className="w-full py-3 bg-stone-50 text-stone-500 text-[13px] font-medium rounded-xl text-center border border-stone-100">
                  Laporan tersimpan di akun Anda
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="min-h-screen flex flex-col justify-center py-24 px-8 bg-stone-50">
        <div className="max-w-7xl mx-auto w-full">
          <div className="mb-14">
            <p className="text-[12px] uppercase tracking-[0.12em] text-accent-500 font-semibold mb-3">Testimoni</p>
            <h2 className="text-[clamp(2.2rem,4vw,3.2rem)] font-normal text-stone-900">
              Apa Kata Pelanggan Kami.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-stone-100 hover:shadow-[0_12px_36px_rgb(26,20,16,0.07)] hover:-translate-y-0.5 transition-all duration-400 flex flex-col">
                <div className="flex gap-0.5 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-accent-500 text-sm">★</span>
                  ))}
                </div>
                <p className="text-[15px] text-stone-700 font-light leading-relaxed italic flex-1">
                  "{r.text}"
                </p>
                <div className="flex items-center gap-3 mt-8 pt-6 border-t border-[#F0EDE9]">
                  <Avatar name={r.name} />
                  <div>
                    <p className="text-[14px] font-semibold text-stone-900">{r.name}</p>
                    <p className="text-[12px] text-stone-500 mt-0.5">{r.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="min-h-screen flex flex-col justify-center py-24 px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="bg-stone-900 rounded-3xl px-12 md:px-20 py-24 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-125 h-125 bg-accent-500 opacity-[0.06] rounded-full blur-[80px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />

            <div className="relative max-w-xl">
              <p className="text-[12px] uppercase tracking-[0.12em] text-accent-500 font-semibold mb-5">Mulai Sekarang</p>
              <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-normal text-white leading-[1.08] mb-6">
                Rumah Nyaman<br />
                <span className="italic text-accent-200">Dimulai dari Sini.</span>
              </h2>
              <p className="text-[17px] text-white/45 font-light leading-relaxed mb-10">
                Bergabung dengan 2.400+ pelanggan yang sudah mempercayakan perawatan rumah mereka kepada Solvio.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-3">
                <Link href="/bookings">
                  <button className="px-9 py-4 bg-white text-stone-900 text-[15px] font-semibold rounded-full hover:bg-accent-500 hover:text-white transition-all duration-300">
                    Mulai Reservasi
                  </button>
                </Link>
                <Link href="/register">
                  <button className="px-9 py-4 border border-white/15 text-white/70 text-[15px] font-medium rounded-full hover:border-white/40 hover:text-white transition-all duration-300">
                    Daftar sebagai Teknisi
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
