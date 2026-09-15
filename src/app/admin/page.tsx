import type { Metadata } from "next";
import { OverviewAdminDashboardView } from "@/modules/overview/views/admin/OverviewAdminDashboardView";

export const metadata: Metadata = {
  title: "Ringkasan Admin Portal",
  description: "Dashboard statistik & analisis performa platform Wahide Gateway.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootPage() {
  return <OverviewAdminDashboardView />;
}
