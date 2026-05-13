"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, Checkbox } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";

type Role = "CUSTOMER" | "TECHNICIAN";
const STEPS = ["Account Type", "Personal Info", "Security"];

const EyeIcon = ({ crossed }: { crossed?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M1.333 8S3.333 3.333 8 3.333 14.667 8 14.667 8 12.667 12.667 8 12.667 1.333 8 1.333 8z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8" cy="8" r="1.667" stroke="currentColor" strokeWidth="1.3"/>
    {crossed && <path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>}
  </svg>
);
const PersonIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5.333" r="2.667" stroke="currentColor" strokeWidth="1.3"/><path d="M1.333 14c0-3.314 2.985-6 6.667-6s6.667 2.686 6.667 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>);
const PhoneIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="4" y="1.333" width="8" height="13.334" rx="1.333" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="12" r="0.667" fill="currentColor"/></svg>);
const EmailIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1.333 4A1.333 1.333 0 0 1 2.667 2.667h10.666A1.333 1.333 0 0 1 14.667 4v8a1.333 1.333 0 0 1-1.334 1.333H2.667A1.333 1.333 0 0 1 1.333 12V4z" stroke="currentColor" strokeWidth="1.3"/><path d="M1.333 4l6.667 4.667L14.667 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const LockIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2.667" y="7.333" width="10.666" height="7.334" rx="1.333" stroke="currentColor" strokeWidth="1.3"/><path d="M5.333 7.333V5.333a2.667 2.667 0 0 1 5.334 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>);
const CardIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.333" y="3.333" width="13.334" height="9.334" rx="1.333" stroke="currentColor" strokeWidth="1.3"/><path d="M1.333 6.667h13.334" stroke="currentColor" strokeWidth="1.3"/><path d="M4 10h2.667" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>);
const StarIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2l1.545 3.13L13 5.635l-2.5 2.435.59 3.43L8 9.77l-3.09 1.73.59-3.43L3 5.635l3.455-.505L8 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>);

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [role, setRole] = useState<Role>("CUSTOMER");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");

  const [customerForm, setCustomerForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [techForm, setTechForm] = useState({ name: "", email: "", phone: "", specialities: "", idNumber: "", password: "", confirmPassword: "" });

  function validateStep(): string {
    if (step === 0) return "";
    if (step === 1) {
      if (role === "CUSTOMER") {
        if (!customerForm.name.trim()) return "Full name is required";
        if (!customerForm.email.trim()) return "Email is required";
      } else {
        if (!techForm.name.trim()) return "Full name is required";
        if (!techForm.email.trim()) return "Email is required";
        if (!techForm.phone.trim()) return "Phone number is required";
        if (!techForm.specialities.trim()) return "Specialities is required";
        if (!techForm.idNumber.trim()) return "ID Number (KTP) is required";
      }
    }
    if (step === 2) {
      const pw = role === "CUSTOMER" ? customerForm.password : techForm.password;
      const cpw = role === "CUSTOMER" ? customerForm.confirmPassword : techForm.confirmPassword;
      if (!pw) return "Password is required";
      if (pw.length < 6) return "Password must be at least 6 characters";
      if (pw !== cpw) return "Passwords do not match";
      if (!agree) return "You must agree to the terms of service";
    }
    return "";
  }

  async function handleNext(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const validationError = validateStep();
    if (validationError) { setError(validationError); return; }
    if (step < STEPS.length - 1) { setStep(step + 1); return; }
    setIsLoading(true);
    try {
      if (role === "CUSTOMER") {
        await register({ full_name: customerForm.name, email: customerForm.email, password: customerForm.password, role: "CUSTOMER" });
      } else {
        await register({ full_name: techForm.name, email: techForm.email, password: techForm.password, role: "TECHNICIAN", phone_number: techForm.phone, specialities: techForm.specialities, id_number: techForm.idNumber });
      }
      router.push("/login?registered=1");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[50%] bg-stone-900 flex-col justify-between p-14 relative overflow-hidden">
        <div className="absolute -top-20 right-[-80px] w-[420px] h-[420px] rounded-full bg-[#B07D3E] opacity-[0.07] blur-[90px] pointer-events-none" />
        <Link href="/" className="flex items-center gap-2.5 w-fit">
          <span className="w-7 h-7 rounded-full bg-[#B07D3E] flex items-center justify-center"><span className="w-2.5 h-2.5 rounded-full bg-white" /></span>
          <span className="text-[18px] font-semibold tracking-[-0.02em] text-white">Solvio</span>
        </Link>
        <div className="space-y-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#B07D3E] font-semibold mb-5">
              {role === "TECHNICIAN" ? "Join as Technician" : "Join Solvio"}
            </p>
            <h2 className="text-[clamp(2rem,3.2vw,2.8rem)] font-normal text-white leading-[1.1]">
              {role === "TECHNICIAN"
                ? <><>Start receiving<br /></><span className="italic text-[#E4CFA8]">orders today.</span></>
                : <><>Begin your<br /></><span className="italic text-[#E4CFA8]">journey with us.</span></>}
            </h2>
          </div>
          <div className="space-y-4">
            {(role === "TECHNICIAN"
              ? ["Receive tasks matching your skills", "Flexible schedule, work independently", "Timely and transparent payments", "Supported by Solvio 24/7"]
              : ["Book services in minutes", "Verified & experienced technicians", "Transparent pricing, no hidden fees", "Digital visit reports in your account"]
            ).map((b) => (
              <div key={b} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#B07D3E]/20 border border-[#B07D3E]/30 flex items-center justify-center text-[#B07D3E] text-[11px] font-bold shrink-0 mt-0.5">✓</span>
                <span className="text-[14px] text-white/50 font-light leading-snug">{b}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-white/10 pt-8">
          <p className="text-[14px] text-white/35 font-light italic leading-relaxed">
            {role === "TECHNICIAN"
              ? `"Signing up as a technician was quick. Now I have many regular customers."`
              : `"Booking home services is so easy. The technicians are professional and pricing is clear."`}
          </p>
          <p className="text-[12px] text-white/25 mt-3 font-medium">
            {role === "TECHNICIAN" ? "— Budi S., Solvio AC Technician" : "— Rina K., Solvio Customer"}
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-14 lg:px-20 py-16 bg-[#FDFCFB]">
        <div className="lg:hidden mb-10">
          <Link href="/" className="flex items-center gap-2.5 w-fit">
            <span className="w-7 h-7 rounded-full bg-[#1A1410] flex items-center justify-center"><span className="w-2.5 h-2.5 rounded-full bg-[#B07D3E]" /></span>
            <span className="text-[18px] font-semibold tracking-[-0.02em] text-[#1A1410]">Solvio</span>
          </Link>
        </div>

        <div className="w-full max-w-[440px] mx-auto lg:mx-0">
          <div className="mb-8">
            <h1 className="text-[clamp(1.8rem,3vw,2.2rem)] font-normal text-[#1A1410] leading-tight mb-2">Create New Account</h1>
            <p className="text-[14px] text-[#7A6E64] font-light">Already have an account?{" "}<Link href="/login" className="text-[#B07D3E] font-medium hover:underline underline-offset-4">Sign in here</Link></p>
          </div>

          {/* Step indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold transition-all duration-300 ${i < step ? "bg-[#1A1410] text-white" : i === step ? "bg-[#B07D3E] text-white" : "bg-[#EDE9E4] text-[#C2B9AF]"}`}>
                    {i < step ? (<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>) : i + 1}
                  </div>
                  <span className={`text-[12px] font-medium ${i === step ? "text-[#1A1410]" : "text-[#C2B9AF]"}`}>{s}</span>
                  {i < STEPS.length - 1 && (<div className={`w-8 h-px mx-2 transition-all duration-300 ${i < step ? "bg-[#1A1410]" : "bg-[#EDE9E4]"}`} />)}
                </div>
              ))}
            </div>
            <div className="h-1 bg-[#EDE9E4] rounded-full overflow-hidden">
              <div className="h-full bg-[#B07D3E] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-[13px] text-red-600 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleNext} className="space-y-5">

            {/* Step 0: Account Type */}
            {step === 0 && (
              <div className="space-y-5">
                <p className="text-[13px] text-[#7A6E64] font-light">Choose the type of account you want to create:</p>
                <div className="grid grid-cols-2 gap-4">
                  {([
                    { id: "CUSTOMER" as Role, label: "Customer", desc: "I want to book home services",
                      icon: (<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="4" y="14" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M2 14L14 4l12 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><rect x="10" y="18" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.4"/></svg>) },
                    { id: "TECHNICIAN" as Role, label: "Technician", desc: "I want to offer my services",
                      icon: (<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M18 6a4 4 0 0 1-1.172 7.656L8 22.5l-3-.5-.5-3 8.844-8.828A4 4 0 0 1 18 6z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="18" cy="10" r="1.5" fill="currentColor"/></svg>) },
                  ] as const).map((opt) => (
                    <button key={opt.id} type="button" onClick={() => setRole(opt.id)}
                      className={`flex flex-col items-start gap-3 p-5 rounded-2xl border-2 text-left transition-all duration-200 ${role === opt.id ? "border-[#1A1410] bg-[#1A1410] text-white" : "border-[#EDE9E4] bg-white text-[#1A1410] hover:border-[#C2B9AF]"}`}>
                      <span className={role === opt.id ? "text-[#E4CFA8]" : "text-[#B07D3E]"}>{opt.icon}</span>
                      <div>
                        <p className="text-[15px] font-semibold">{opt.label}</p>
                        <p className={`text-[12px] mt-1 font-light leading-snug ${role === opt.id ? "text-white/55" : "text-[#7A6E64]"}`}>{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Personal Info — CUSTOMER */}
            {step === 1 && role === "CUSTOMER" && (
              <div className="space-y-4">
                <Input label="Full Name" type="text" placeholder="Your full name" fullWidth value={customerForm.name}
                  onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })} leftIcon={<PersonIcon />} required />
                <Input label="Email" type="email" placeholder="name@email.com" fullWidth value={customerForm.email}
                  onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })} leftIcon={<EmailIcon />} required />
              </div>
            )}

            {/* Step 1: Personal Info — TECHNICIAN */}
            {step === 1 && role === "TECHNICIAN" && (
              <div className="space-y-4">
                <Input label="Full Name" type="text" placeholder="Your full name" fullWidth value={techForm.name}
                  onChange={(e) => setTechForm({ ...techForm, name: e.target.value })} leftIcon={<PersonIcon />} required />
                <Input label="Email" type="email" placeholder="name@email.com" fullWidth value={techForm.email}
                  onChange={(e) => setTechForm({ ...techForm, email: e.target.value })} leftIcon={<EmailIcon />} required />
                <Input label="Phone Number" type="tel" placeholder="08xxxxxxxxxx" fullWidth value={techForm.phone}
                  onChange={(e) => setTechForm({ ...techForm, phone: e.target.value })} leftIcon={<PhoneIcon />} required />
                <Input label="Specialities" type="text" placeholder="e.g. AC Repair, Electrical, Plumbing" fullWidth value={techForm.specialities}
                  onChange={(e) => setTechForm({ ...techForm, specialities: e.target.value })} leftIcon={<StarIcon />}
                  hint="Separate multiple skills with a comma" required />
                <Input label="ID Number (No. KTP)" type="text" placeholder="16-digit national ID number" fullWidth value={techForm.idNumber}
                  onChange={(e) => setTechForm({ ...techForm, idNumber: e.target.value })} leftIcon={<CardIcon />}
                  hint="ID photo can be uploaded after registration" required />
              </div>
            )}

            {/* Step 2: Security */}
            {step === 2 && (
              <div className="space-y-4">
                {(() => {
                  const pw = role === "CUSTOMER" ? customerForm.password : techForm.password;
                  const cpw = role === "CUSTOMER" ? customerForm.confirmPassword : techForm.confirmPassword;
                  const setPw = (v: string) => role === "CUSTOMER" ? setCustomerForm({ ...customerForm, password: v }) : setTechForm({ ...techForm, password: v });
                  const setCpw = (v: string) => role === "CUSTOMER" ? setCustomerForm({ ...customerForm, confirmPassword: v }) : setTechForm({ ...techForm, confirmPassword: v });
                  return (
                    <>
                      <Input label="Password" type={showPassword ? "text" : "password"} placeholder="Min. 6 characters" fullWidth
                        value={pw} onChange={(e) => setPw(e.target.value)} leftIcon={<LockIcon />}
                        rightIcon={<EyeIcon crossed={showPassword} />} onRightIconClick={() => setShowPassword(!showPassword)} required />
                      {pw.length > 0 && (
                        <div className="flex gap-1.5">
                          {[pw.length >= 6, /[A-Z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)].map((met, i) => (
                            <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${met ? "bg-[#B07D3E]" : "bg-[#EDE9E4]"}`} />
                          ))}
                        </div>
                      )}
                      <Input label="Confirm Password" type={showConfirm ? "text" : "password"} placeholder="Repeat your password" fullWidth
                        value={cpw} onChange={(e) => setCpw(e.target.value)} leftIcon={<LockIcon />}
                        rightIcon={<EyeIcon crossed={showConfirm} />} onRightIconClick={() => setShowConfirm(!showConfirm)}
                        error={cpw.length > 0 && pw !== cpw ? "Passwords do not match" : undefined} required />
                    </>
                  );
                })()}
                <div className="pt-1">
                  <Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)}
                    label={<span>I agree to the{" "}<Link href="/terms" className="text-[#B07D3E] font-medium hover:underline underline-offset-2">Terms of Service</Link>{" "}and{" "}<Link href="/privacy" className="text-[#B07D3E] font-medium hover:underline underline-offset-2">Privacy Policy</Link></span>}
                    required />
                </div>
              </div>
            )}

            {/* Nav buttons */}
            <div className={`flex gap-3 pt-2 ${step > 0 ? "flex-row" : ""}`}>
              {step > 0 && (
                <button type="button" onClick={() => { setStep(step - 1); setError(""); }}
                  className="px-6 py-3.5 border border-[#DDD7CF] text-[#3D342D] text-[14px] font-medium rounded-full hover:border-[#1A1410] transition-all duration-200">
                  ← Back
                </button>
              )}
              <Button type="submit" fullWidth size="lg" isLoading={isLoading} disabled={step === 2 && !agree}>
                {isLoading ? "Creating account…" : step < STEPS.length - 1 ? "Continue →" : "Create Account"}
              </Button>
            </div>
          </form>

          <p className="mt-6 text-[12px] text-[#C2B9AF] text-center leading-relaxed">
            Already have an account?{" "}
            <Link href="/login" className="text-[#B07D3E] font-medium hover:underline underline-offset-2">Sign in now</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
