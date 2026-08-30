import { RegisterForm } from "@/services/iam/components/RegisterForm";
import { AuthLayout } from "@/components/layout/auth/AuthLayout";

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
