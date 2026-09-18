import type { Metadata } from "next";
import { FlowListView } from "@/modules/autoreply/views/FlowListView";
import { SellerRouteGuard } from "@/components/layout/shared/SellerRouteGuard";

export const metadata: Metadata = {
  title: "Alur Percakapan Visual (Flow DAG Builder) | Wahide",
  description:
    "Rancang dan kelola bot percakapan multi-turn interaktif secara visual dengan Directed Acyclic Graph.",
  alternates: {
    canonical: "/autoreply/flow",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function FlowPage() {
  return (
    <SellerRouteGuard>
      <FlowListView />
    </SellerRouteGuard>
  );
}
