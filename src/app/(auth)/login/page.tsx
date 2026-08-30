import React, { Suspense } from "react";
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
    <AuthLayout>
      <Suspense fallback={<div className="h-96 flex items-center justify-center animate-pulse" />}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
