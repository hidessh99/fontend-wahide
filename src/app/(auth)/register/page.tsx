import type { Metadata } from "next";
import { RegisterForm } from "@/services/iam/components/RegisterForm";
import { AuthLayout } from "@/components/layout/auth/AuthLayout";

export const metadata: Metadata = {
  title: "Daftar Akun Bisnis Gratis (Free Trial)",
  description:
    "Daftarkan akun bisnis Anda secara gratis di Wahide. Dapatkan akses instan ke multi-device QR pairing, simulasi human typing, dan proteksi 5 lapis anti-ban.",
  alternates: {
    canonical: "/register",
  },
  openGraph: {
    title: "Daftar Akun Bisnis Gratis | Wahide WhatsApp Gateway",
    description:
      "Mulai uji coba gratis WhatsApp Gateway dengan teknologi Session Hibernation dan Go Microservices.",
    url: "/register",
  },
};

export default function RegisterPage() {
  return (
    <AuthLayout
      bannerBadge="Free Trial Included"
      bannerHeadline="Otomatisasi WhatsApp skala industri."
      bannerSubheadline="Daftarkan bisnis Anda dan dapatkan akses instan ke multi-device QR pairing, phonebook tagging, dan perlindungan 5 lapis anti-ban."
      footerNote="Dengan mendaftar, Anda menyetujui SLA ketersediaan 99.9% Wahide"
    >
      <div className="space-y-6">
        <div className="space-y-1.5">
          <h1 className="text-4xl font-black tracking-tight leading-[0.95] text-foreground">
            Buat akun bisnis.
          </h1>
          <p className="text-sm font-semibold text-foreground-secondary">
            Mulai gratis tanpa kartu kredit. Tingkatkan paket kapan saja.
          </p>
        </div>

        <RegisterForm />
      </div>
    </AuthLayout>
  );
}
