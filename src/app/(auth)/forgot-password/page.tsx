import type { Metadata } from "next";
import { ForgotPasswordView } from "./ForgotPasswordView";

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
  return <ForgotPasswordView />;
}
