import type { Metadata } from "next";
import { AdminOverviewView } from "@/components/admin/AdminOverviewView";

export const metadata: Metadata = {
  title: "Superadmin Overview & Node Health",
  description: "Platform Superadmin overview, global revenue, and cluster health metrics.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminOverviewPage() {
  return <AdminOverviewView />;
}
