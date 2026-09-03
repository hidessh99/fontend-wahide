import type { Metadata } from "next";
import { UserActivitiesView } from "@/modules/iam/views/UserActivitiesView";

export const metadata: Metadata = {
  title: "Log Aktivitas Akun",
  description: "Pantau riwayat autentikasi, transaksi saldo, dan aktivitas keamanan akun Anda.",
  alternates: {
    canonical: "/activities",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ActivitiesPage() {
  return <UserActivitiesView />;
}
