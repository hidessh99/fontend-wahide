import type { Metadata } from "next";
import { LoginForm } from "@/services/iam/components/LoginForm";
import { AuthLayout } from "@/components/layout/auth/AuthLayout";

export const metadata: Metadata = {
  title: "Masuk ke Dashboard Akun Bisnis",
  description:
    "Masuk ke portal Wahide untuk mengelola slot WhatsApp multi-device, memantau broadcast kampanye spintax, dan mengoptimalkan kuota pesan bisnis Anda.",
  alternates: {
    canonical: "/login",
  },
  openGraph: {
    title: "Masuk | Wahide Enterprise WhatsApp Gateway",
    description:
      "Akses portal dashboard Wahide untuk manajemen perangkat WhatsApp dan antrean pesan blast.",
    url: "/login",
  },
};

export default function LoginPage() {
  return (
    <AuthLayout
      bannerBadge="Enterprise Gateway"
      bannerHeadline="WhatsApp Gateway tanpa batas memori."
      bannerSubheadline="Kirimkan broadcast kampanye spintax, OTP instan, dan multi-device QR pairing dengan performa backend Go terisolasi."
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight leading-[0.95] text-foreground">
            Selamat datang kembali.
          </h1>
          <p className="text-sm font-semibold text-foreground-secondary">
            Masuk untuk mengelola slot WhatsApp dan antrean broadcast bisnis Anda.
          </p>
        </div>

        <LoginForm />
      </div>
    </AuthLayout>
  );
}
