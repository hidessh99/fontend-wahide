import type { Metadata } from "next";
import { TeamSellerManagementView } from "@/modules/team/views/seller/TeamSellerManagementView";
import { SellerRouteGuard } from "@/components/layout/shared/SellerRouteGuard";
import { RoleGuard } from "@/components/layout/shared/RoleGuard";
import { RBACGuard } from "@/components/shared/RBACGuard";

export const metadata: Metadata = {
  title: "Manajemen Tim & Agen CS",
  description:
    "Kelola akun staf customer service dan supervisor untuk bisnis Anda.",
  alternates: {
    canonical: "/team",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function TeamPage() {
  return (
    <SellerRouteGuard>
      <RoleGuard requireTeamManagement>
        <RBACGuard allowedRoles={["admin", "seller", "owner", "manager"]}>
          <TeamSellerManagementView />
        </RBACGuard>
      </RoleGuard>
    </SellerRouteGuard>
  );
}
