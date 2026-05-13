import Link from "next/link";
import { Button, Badge } from "@/components/ui";

const TEAM_VALUES = [
  {
    icon: "🔒",
    title: "Verified Technicians",
    desc: "Every technician goes through identity verification, skills assessment, and a background check before joining Solvio.",
  },
  {
    icon: "💰",
    title: "Transparent Pricing",
    desc: "No hidden fees. The price displayed is the price you pay — agreed upon before any work begins.",
  },
  {
    icon: "⚡",
    title: "Fast & Reliable",
    desc: "Our scheduling system connects you with the nearest available technician so you don't have to wait long.",
  },
  {
    icon: "🛡️",
    title: "Service Guarantee",
    desc: "Not satisfied? We offer a re-service guarantee at no additional cost within 7 days of completion.",
  },
];

const STATS = [
  { value: "2,400+", label: "Active Customers" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "150+", label: "Trained Technicians" },
  { value: "6", label: "Cities Served" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Choose a Service",
    desc: "Browse our catalog of home services — from AC repair and electrical to cleaning and plumbing.",
  },
  {
    step: "02",
    title: "Book a Schedule",
    desc: "Select your preferred date and time. Enter your address and we'll handle the rest.",
  },
  {
    step: "03",
    title: "Technician Visits",
    desc: "A verified Solvio technician arrives at your location and gets the job done professionally.",
  },
  {
    step: "04",
    title: "Pay & Review",
    desc: "Pay after the work is done via your chosen payment method. Simple and transparent.",
  },
];

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen">

      {/* Hero */}
      <section className="relative min-h-[60vh] flex flex-col justify-center px-8 overflow-hidden pt-[88px]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_60%_40%,#EDE9E4_0%,transparent_65%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto w-full relative py-20">
          <Badge variant="accent">About Solvio</Badge>
          <h1 className="mt-6 text-[clamp(2.8rem,5.5vw,5rem)] font-normal leading-[1.05] text-stone-900 tracking-[-0.025em] max-w-3xl">
            Home Service,{" "}
            <span className="italic text-[#B07D3E]">Made Simple.</span>
          </h1>
          <p className="mt-6 text-[18px] text-stone-500 font-light leading-relaxed max-w-xl">
            Solvio was built with one mission: make professional home maintenance
            accessible to every household — no hassle, no surprises, just
            results you can trust.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="px-8 py-20 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[12px] uppercase tracking-[0.12em] text-[#B07D3E] font-semibold mb-4">
              Our Story
            </p>
            <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-normal text-[#1A1410] leading-tight mb-6">
              Born from a Real Problem
            </h2>
            <div className="space-y-4 text-[16px] text-[#7A6E64] font-light leading-relaxed">
              <p>
                We started Solvio after experiencing firsthand how difficult it
                was to find a reliable, fairly-priced technician. Most
                homeowners either overpay or settle for subpar work because
                there&apos;s no easy way to compare, verify, or trust service
                providers.
              </p>
              <p>
                So we built the platform we wished existed: a marketplace where
                every technician is verified, every price is transparent, and
                every booking is tracked end-to-end — from scheduling to
                completion.
              </p>
              <p>
                Today, Solvio serves thousands of households across Indonesia,
                empowering local technicians with steady work while giving
                homeowners peace of mind.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-5">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="bg-[#FDFCFB] rounded-2xl border border-stone-100 p-8"
              >
                <p className="text-[clamp(2.2rem,4vw,3rem)] font-normal text-[#1A1410] leading-none">
                  {s.value}
                </p>
                <p className="text-[12px] text-[#7A6E64] mt-2 uppercase tracking-widest font-medium">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="px-8 py-20 bg-[#FDFCFB]">
        <div className="max-w-7xl mx-auto">
          <p className="text-[12px] uppercase tracking-[0.12em] text-[#B07D3E] font-semibold mb-4 text-center">
            Our Values
          </p>
          <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-normal text-[#1A1410] text-center mb-14">
            Why Customers Choose Solvio
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM_VALUES.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl border border-stone-100 p-8 hover:shadow-[0_12px_40px_rgb(26,20,16,0.07)] hover:-translate-y-1 transition-all duration-300"
              >
                <span className="text-3xl mb-5 block">{v.icon}</span>
                <h3 className="text-[17px] font-medium text-[#1A1410] mb-3">
                  {v.title}
                </h3>
                <p className="text-[14px] text-[#7A6E64] font-light leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-8 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <p className="text-[12px] uppercase tracking-[0.12em] text-[#B07D3E] font-semibold mb-4 text-center">
            How It Works
          </p>
          <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-normal text-[#1A1410] text-center mb-14">
            From Booking to Done
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="relative">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(100%-1rem)] w-[calc(100%-3rem)] h-px bg-[#EDE9E4]" />
                )}
                <div className="w-14 h-14 rounded-full bg-[#1A1410] flex items-center justify-center text-white text-[14px] font-semibold mb-6">
                  {step.step}
                </div>
                <h3 className="text-[17px] font-medium text-[#1A1410] mb-3">
                  {step.title}
                </h3>
                <p className="text-[14px] text-[#7A6E64] font-light leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-24 bg-[#1A1410] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-normal leading-tight mb-6">
            Ready to experience{" "}
            <span className="italic text-[#E4CFA8]">better home service?</span>
          </h2>
          <p className="text-[16px] text-white/60 font-light mb-10 leading-relaxed">
            Join thousands of homeowners who trust Solvio for their home
            maintenance needs. Book your first service today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services">
              <Button size="lg" variant="outline">
                Browse Services
              </Button>
            </Link>
            <Link href="/register">
              <button className="px-8 py-3.5 text-[14px] font-semibold bg-[#B07D3E] text-white rounded-full hover:bg-[#9A6C31] transition-all duration-300">
                Get Started Free
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
