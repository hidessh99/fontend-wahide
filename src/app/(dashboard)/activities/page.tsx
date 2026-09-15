import type { Metadata } from "next";
import { IamUserActivitiesView } from "@/modules/iam/views/user/IamUserActivitiesView";

export const metadata: Metadata = {
  title: "Log Aktivitas Akun",
  description:
    "Pantau riwayat autentikasi, transaksi saldo, dan aktivitas keamanan akun Anda.",
  alternates: {
    canonical: "/activities",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ActivitiesPage() {
  return <IamUserActivitiesView />;
}
