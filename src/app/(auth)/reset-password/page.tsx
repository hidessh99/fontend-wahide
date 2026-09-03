import React, { Suspense } from "react";
import type { Metadata } from "next";
import { ResetPasswordView } from "./ResetPasswordView";

export const metadata: Metadata = {
  title: "Konfirmasi Reset Kata Sandi",
  description:
    "Masukkan token verifikasi dari email dan atur kata sandi baru untuk akun bisnis Wahide Anda.",
  alternates: {
    canonical: "/reset-password",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="border-wise-green size-8 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
      }
    >
      <ResetPasswordView />
    </Suspense>
  );
}
