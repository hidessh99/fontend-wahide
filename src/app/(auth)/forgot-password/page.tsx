import { ForgotPasswordForm } from "@/services/iam/components/ForgotPasswordForm";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between p-6 sm:p-12 bg-background">
      <div className="flex items-center justify-between max-w-xl w-full mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded-full bg-[#9fe870]" />
          <span className="font-black text-xl tracking-tight text-foreground">
            Wahide<span className="text-[#9fe870]">.</span>
          </span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="my-auto py-8 max-w-md w-full mx-auto space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-4xl font-black tracking-tight leading-[0.95] text-foreground">
            Lupa password akun?
          </h2>
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
