import type { Metadata } from "next";
import { IamAdminUsersView } from "@/modules/iam/views/admin/IamAdminUsersView";

export const metadata: Metadata = {
  title: "Kelola Pengguna Platform",
  description: "Manajemen seluruh tenant dan pengguna platform Wahide Gateway.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminUsersPage() {
  return <IamAdminUsersView />;
}
