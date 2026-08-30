import { LoginForm } from "@/services/iam/components/LoginForm";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Kolom Kiri: Visual Banner Wise Brand */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-[#0e0f0c] text-[#fbfcf9] relative overflow-hidden">
        {/* Subtle Green Glow Ring */}
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#9fe870]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#9fe870]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between z-10">
          <Link href="/" className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full bg-[#9fe870] animate-pulse" />
            <span className="font-extrabold text-2xl tracking-tight text-white">
              Wahide<span className="text-[#9fe870]">.</span>
            </span>
          </Link>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#868685] bg-[#1b1d1a] px-3 py-1 rounded-full border border-white/10">
            Enterprise Gateway
          </span>
        </div>

        <div className="space-y-6 z-10 max-w-lg my-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(159,232,112,0.15)] px-4 py-1.5 text-xs font-bold text-[#9fe870]">
            ⚡ Scale to 10,000+ Active WhatsApp Devices
          </div>
          <h1 className="text-5xl font-black leading-[0.95] tracking-tight text-white">
            WhatsApp Gateway tanpa batas memori.
          </h1>
          <p className="text-lg font-semibold text-[#c2c5be] leading-relaxed">
            Kirimkan broadcast kampanye spintax, OTP instan, dan multi-device QR pairing dengan performa backend Go terisolasi.
          </p>
        </div>

        <div className="flex items-center justify-between text-xs font-semibold text-[#868685] z-10 border-t border-white/10 pt-6">
          <span>&copy; {new Date().getFullYear()} Wahide SaaS Platform</span>
          <span>5-Layer Anti-Ban Protected</span>
        </div>
      </div>

      {/* Kolom Kanan: Form Login */}
      <div className="flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        <div className="flex items-center justify-between">
          <Link href="/" className="lg:hidden flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-full bg-[#9fe870]" />
            <span className="font-black text-xl tracking-tight text-foreground">
              Wahide<span className="text-[#9fe870]">.</span>
            </span>
          </Link>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        <div className="my-auto py-8 max-w-md w-full mx-auto space-y-8">
          <div className="space-y-2">
            <h2 className="text-4xl font-black tracking-tight leading-[0.95] text-foreground">
              Selamat datang kembali.
            </h2>
            <p className="text-sm font-semibold text-foreground-secondary">
              Masuk untuk mengelola slot WhatsApp dan antrean broadcast bisnis Anda.
            </p>
          </div>

          <LoginForm />
        </div>

        <div className="text-center text-xs font-semibold text-foreground-muted">
          Platform terenkripsi dengan AES-GCM 256 & Session Isolation
        </div>
      </div>
    </div>
  );
}
