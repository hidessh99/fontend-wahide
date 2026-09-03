import type { Metadata } from "next";
import { AdminUsersView } from "@/modules/admin/views";

export const metadata: Metadata = {
  title: "Kelola Pengguna Platform",
  description: "Manajemen seluruh tenant dan pengguna platform Wahide Gateway.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminUsersPage() {
  return <AdminUsersView />;
}
