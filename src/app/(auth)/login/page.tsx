import { LoginForm } from "@/services/iam/components/LoginForm";
import { AuthLayout } from "@/components/layout/auth/AuthLayout";

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
