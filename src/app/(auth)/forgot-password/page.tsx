import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/services/iam/components/ForgotPasswordForm";
import { AuthHeader } from "@/components/layout/auth/AuthHeader";

export const metadata: Metadata = {
  title: "Pemulihan Kata Sandi Akun Bisnis",
  description:
    "Reset kata sandi akun bisnis Wahide Anda dengan memasukkan alamat email terdaftar untuk menerima instruksi pemulihan.",
  alternates: {
    canonical: "/forgot-password",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between p-6 sm:p-12 bg-background">
      <div className="max-w-xl w-full mx-auto">
        <AuthHeader />
      </div>

      <div className="my-auto py-8 max-w-md w-full mx-auto space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-black tracking-tight leading-[0.95] text-foreground">
            Lupa password akun?
          </h1>
          <p className="text-sm font-semibold text-foreground-secondary">
            Masukkan email bisnis terdaftar Anda untuk menerima tautan pemulihan sandi.
          </p>
        </div>

        <ForgotPasswordForm />
      </div>

      <div className="text-center text-xs font-semibold text-foreground-muted">
        Bantuan darurat? Hubungi customer support kami melalui helpdesk
      </div>
    </div>
  );
}
