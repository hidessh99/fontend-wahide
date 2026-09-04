import type { Metadata } from "next";
import { RegisterForm } from "@/modules/iam/components/auth/RegisterForm";
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
      "Mulai uji coba gratis WhatsApp Gateway dengan teknologi Session Hibernation dan teknologi cloud berkinerja tinggi.",
    url: "/register",
  },
};

export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
